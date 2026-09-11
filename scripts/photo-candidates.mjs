/**
 * Finds candidate photos for ingredients, and writes them to a file.
 *
 * `docs/PLAN.md` section 6: nothing enters the project unreviewed. So this
 * script only ever *proposes*. It downloads no image and edits no ingredient.
 * It writes `scripts/photo-candidates.json`, which the dev-only contact sheet
 * at `/photos` renders for Tia to approve, and `scripts/download-approved.mjs`
 * acts on afterwards.
 *
 * Search terms come from the ingredient `id`, not its `name`. Ids are English
 * slugs and stay English through any rename (`docs/DECISIONS.md`, 2026-09-11),
 * so "chioggia-beetroot" keeps finding photos after the name on screen became
 * "Raita(puna)juuri". Searching the display name would quietly stop working the
 * moment Tia renames something into Finnish.
 *
 * Usage:
 *   node scripts/photo-candidates.mjs                 # every September ingredient
 *   node scripts/photo-candidates.mjs --limit 10      # the first ten, for a trial sheet
 *   node scripts/photo-candidates.mjs --ids kale,leek # named ingredients only
 *   node scripts/photo-candidates.mjs --month 10      # a different month
 *   node scripts/photo-candidates.mjs --force         # re-search rows already done
 *
 * Re-running is the intended way to repair a run. Rows already searched cleanly
 * are kept and skipped; only rows a search failed on are searched again. See
 * `merge` below.
 */
import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.join(process.cwd(), 'data', 'ingredients')
const OUT_FILE = path.join(process.cwd(), 'scripts', 'photo-candidates.json')

/** Wikimedia asks for a real User-Agent, and Openverse is happier with one too. */
const USER_AGENT = 'eat-seasonal-app/0.1 (personal seasonal-produce app; contact via repo)'

/** How many tiles one ingredient may put on the contact sheet. */
const COMMONS_WANTED = 4
const OPENVERSE_TOPUP = 2

/**
 * Licences worth showing. Everything here allows reuse with attribution, which
 * is all this app does with a photo. Anything else is dropped rather than shown
 * and rejected by hand, so the sheet stays a list of real choices.
 */
const ALLOWED = /^(cc0|cc[- ]?by([- ]sa)?|public domain|pdm|no restrictions)/i

function parseArgs(argv) {
  const args = { month: 9, limit: Infinity, ids: null, force: argv.includes('--force') }
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i + 1]
    if (argv[i] === '--month') args.month = Number(value)
    if (argv[i] === '--limit') args.limit = Number(value)
    if (argv[i] === '--ids') args.ids = value.split(',').map((id) => id.trim())
  }
  return args
}

/** Every month an ingredient is worth showing in, fresh, stored or imported. */
function monthsOf(ingredient) {
  const { domestic, imported } = ingredient.availability ?? {}
  return [
    ...(domestic?.freshMonths ?? []),
    ...(domestic?.storageMonths ?? []),
    ...(imported?.months ?? []),
  ]
}

function loadIngredients({ month, limit, ids }) {
  const all = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8')))

  const chosen = ids
    ? all.filter((ingredient) => ids.includes(ingredient.id))
    : all.filter((ingredient) => monthsOf(ingredient).includes(month))

  // Sorted by id so a trial run of ten is the same ten every time, rather than
  // whatever order the filesystem happened to hand back.
  return chosen.sort((a, b) => a.id.localeCompare(b.id)).slice(0, limit)
}

/**
 * A word per category, added to the search.
 *
 * Free text finds the word, not the food. "aronia" on its own returns a ship
 * called Aronia S and two herbarium sheets; "aronia berry" returns aronia
 * berries. "leek" returns a restaurant facade, "leek vegetable" returns leeks.
 * The hint costs nothing on the searches that were already good: "apple fruit"
 * drops the Apple II computer and keeps the apples.
 *
 * `other` gets no hint, because there is no one word that would help across it.
 */
const CATEGORY_HINT = {
  berry: 'berry',
  fruit: 'fruit',
  vegetable: 'vegetable',
  mushroom: 'mushroom',
  herb: 'herb',
  nut: 'nut',
  other: '',
}

/** "chioggia-beetroot" + vegetable -> "chioggia beetroot vegetable" */
function searchTerm(ingredient) {
  const words = ingredient.id.replace(/-/g, ' ')
  const hint = CATEGORY_HINT[ingredient.category] ?? ''
  // Not added when the name already says it: "blackberry berry" reads as a typo
  // to the search engine as much as to a person.
  return hint && !words.includes(hint) ? `${words} ${hint}` : words
}

/** Commons puts author and licence in HTML fragments. The sheet wants text. */
function plain(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * How long to wait after each 429, in milliseconds.
 *
 * The trial run used 3, 6 and 9 seconds and still lost two searches out of
 * twenty outright: avocado and black-trumpet each came back with only their
 * hinted search, which is why avocado's row was four photographs of lunch.
 * Commons' limit is a burst limit rather than a quota — twenty searches back to
 * back with no pause at all answer 200 — so what it wants is a real pause, not
 * a slightly longer one.
 */
const BACKOFF = [5000, 15000, 45000, 90000]

/**
 * Fetches json, and waits it out when told the run is going too fast.
 *
 * A 429 is not a failure worth reporting to Tia as "no candidates"; it just
 * means backing off. Commons sometimes says how long to back off for, and when
 * it does, that answer beats any schedule of ours.
 */
async function getJson(url, who) {
  for (let attempt = 0; attempt <= BACKOFF.length; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (response.ok) return response.json()
    if (response.status !== 429) throw new Error(`${who} answered ${response.status}`)
    if (attempt === BACKOFF.length) break

    // Jittered, because every ingredient backing off on the same schedule is
    // how a run gets back in step with the limit it just tripped.
    const told = Number(response.headers.get('retry-after')) * 1000
    const wait = Number.isFinite(told) && told > 0 ? told : BACKOFF[attempt] * (1 + Math.random())
    console.log(`    ${who} said 429, waiting ${Math.round(wait / 1000)}s`)
    await sleep(wait)
  }
  throw new Error(`${who} kept answering 429`)
}

/**
 * Commons appends its own analytics parameters to every url it hands back.
 * They are not part of the image address and they make the stored candidates
 * harder to read, so they go.
 */
function clean(url) {
  if (!url) return url
  const parsed = new URL(url)
  for (const key of [...parsed.searchParams.keys()]) {
    if (key.startsWith('utm_')) parsed.searchParams.delete(key)
  }
  return parsed.toString()
}

async function fromCommons(term) {
  const url = new URL('https://commons.wikimedia.org/w/api.php')
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    // `filetype:bitmap` keeps out SVG diagrams and PDFs, which are never what a
    // card wants to show.
    gsrsearch: `filetype:bitmap ${term}`,
    gsrnamespace: '6',
    gsrlimit: String(COMMONS_WANTED * 2),
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '400',
  }).toString()

  const body = await getJson(url, 'Commons')

  const pages = Object.values(body.query?.pages ?? {})
  // The generator returns pages in an arbitrary key order; `index` is the
  // relevance ranking the search actually produced.
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

  return pages
    .map((page) => {
      const info = page.imageinfo?.[0]
      if (!info) return null
      const meta = info.extmetadata ?? {}
      return {
        source: 'Wikimedia Commons',
        title: page.title.replace(/^File:/, ''),
        thumbUrl: clean(info.thumburl),
        fullUrl: clean(info.url),
        author: plain(meta.Artist?.value) || 'Unknown',
        license: plain(meta.LicenseShortName?.value) || 'Unknown',
        sourceUrl: clean(info.descriptionurl),
      }
    })
    .filter((candidate) => candidate && ALLOWED.test(candidate.license))
    .slice(0, COMMONS_WANTED)
}

async function fromOpenverse(term) {
  const url = new URL('https://api.openverse.org/v1/images/')
  url.search = new URLSearchParams({
    q: term,
    page_size: String(OPENVERSE_TOPUP * 3),
    license_type: 'all-cc',
  }).toString()

  const body = await getJson(url, 'Openverse')

  return (body.results ?? [])
    .map((result) => ({
      source: 'Openverse',
      title: result.title ?? term,
      thumbUrl: result.thumbnail ?? result.url,
      fullUrl: result.url,
      author: result.creator || 'Unknown',
      license: `CC ${String(result.license).toUpperCase()} ${result.license_version ?? ''}`.trim(),
      sourceUrl: result.foreign_landing_url ?? result.url,
    }))
    .filter((candidate) => ALLOWED.test(candidate.license.replace(/^CC /, 'cc-')))
    .slice(0, OPENVERSE_TOPUP)
}

/**
 * Takes turns between two result lists until it has enough.
 *
 * Both searches are fallible in opposite directions, so neither is allowed to
 * fill the row on its own: whichever one went wrong, the other still has tiles
 * on the sheet.
 */
function interleave(first, second, wanted) {
  const merged = []
  const seen = new Set()
  for (let i = 0; merged.length < wanted && (i < first.length || i < second.length); i += 1) {
    for (const candidate of [first[i], second[i]]) {
      if (!candidate || seen.has(candidate.fullUrl) || merged.length >= wanted) continue
      seen.add(candidate.fullUrl)
      merged.push(candidate)
    }
  }
  return merged
}

async function candidatesFor(ingredient) {
  const plain = ingredient.id.replace(/-/g, ' ')
  const hinted = searchTerm(ingredient)
  const term = hinted === plain ? plain : `${plain} / ${hinted}`
  const notes = []

  // Both, because the category hint cuts both ways. It rescues "aronia", which
  // alone finds a ship of that name, and it spoils "avocado", which alone finds
  // avocados and with "vegetable" finds avocado toast. There is no way to tell
  // in advance which an ingredient will be, so the row shows some of each and
  // Tia picks.
  // Each search is caught on its own, so one failing does not throw away what
  // the other already found.
  const queries = hinted === plain ? [plain] : [plain, hinted]
  const results = []
  let failed = 0
  for (const query of queries) {
    try {
      results.push(await fromCommons(query))
    } catch (error) {
      results.push([])
      failed += 1
      notes.push(`Commons search for "${query}" failed: ${error.message}`)
    }
    await sleep(1500)
  }
  let candidates = interleave(results[0] ?? [], results[1] ?? [], COMMONS_WANTED)

  // A row built from only one of the two searches is not a row of four choices,
  // it is four results from whichever search happened to survive — and the two
  // searches fail in opposite directions. Avocado's trial row looked like a
  // normal row of four and was really four pictures of lunch, because only the
  // "avocado vegetable" search ran. The flag is what lets the sheet say so on
  // the tile, and what lets a re-run know this row is worth searching again.
  const partial = failed > 0 && failed < queries.length

  // Openverse is noisier than Commons — a "lingonberry" search returns pies and
  // cakes — so it only tops up ingredients Commons was thin on, rather than
  // competing for space on every row.
  if (candidates.length < COMMONS_WANTED) {
    try {
      candidates = [...candidates, ...(await fromOpenverse(plain))]
    } catch (error) {
      notes.push(`Openverse search failed: ${error.message}`)
    }
  }

  if (candidates.length === 0) notes.push('No candidates found. Needs a photo from elsewhere.')

  // `searched` counts the searches that came back, so a row is repairable
  // whether it lost one of two or both.
  return {
    id: ingredient.id,
    name: ingredient.name,
    term,
    candidates,
    notes,
    partial,
    searched: queries.length - failed,
    of: queries.length,
  }
}

/**
 * Rows already on the sheet, by id, so a re-run can keep them.
 *
 * A sheet built for another month is not a sheet to merge into: September's
 * rows would sit there among October's looking reviewable. So a month that
 * does not match starts over. Naming ids explicitly is exempt, since repairing
 * two rows should not throw away the other ninety-seven.
 */
function existingRows({ month, ids }) {
  if (!fs.existsSync(OUT_FILE)) return new Map()
  const previous = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'))
  if (!ids && previous.month !== month) return new Map()
  return new Map((previous.ingredients ?? []).map((row) => [row.id, row]))
}

/**
 * Whether a row still needs searching.
 *
 * A row that lost a search is worth trying again; a row whose searches all ran
 * is not, even if they found nothing, because searching again would only find
 * nothing more slowly. Rows written before this flag existed have no `of`, and
 * count as needing a re-run, so the trial sheet gets repaired rather than
 * trusted.
 */
function needsSearch(row) {
  return !row || row.of === undefined || row.searched < row.of
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const ingredients = loadIngredients(args)
  const previous = existingRows(args)
  const month = fs.existsSync(OUT_FILE)
    ? JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')).month
    : args.month

  // Naming specific ids is an explicit ask for those rows, so it always
  // searches. Everything else keeps what a previous run already got right,
  // which is what makes a 99-ingredient run repairable: run it again and it
  // searches the handful that failed, rather than all 99 a second time.
  const always = args.force || Boolean(args.ids)
  const todo = ingredients.filter((ingredient) => always || needsSearch(previous.get(ingredient.id)))
  const kept = ingredients.length - todo.length

  console.log(
    `${ingredients.length} ingredients: searching ${todo.length}` +
      `${kept ? `, keeping ${kept} already done` : ''}...`,
  )

  const results = new Map(previous)
  for (const ingredient of todo) {
    const result = await candidatesFor(ingredient)
    results.set(result.id, result)
    const count = result.candidates.length
    const half = result.partial ? ' (HALF-BLIND: one search failed)' : ''
    console.log(`  ${result.id}: ${count} candidate${count === 1 ? '' : 's'}${half}`)
    // The pause between searches is inside candidatesFor, so there is nothing
    // more to wait for here.
  }

  // Every row the sheet had, in the order it had them, plus any ingredient
  // this run is seeing for the first time. Built from the previous sheet rather
  // than from `ingredients`, because `--ids avocado` loads one ingredient and
  // must not therefore publish a sheet of one: repairing a row leaves the rest
  // of the sheet, and Tia's place in it, alone.
  const order = [...previous.keys()]
  for (const ingredient of ingredients) if (!previous.has(ingredient.id)) order.push(ingredient.id)
  const ordered = order.map((id) => results.get(id)).filter(Boolean)

  const output = {
    generatedAt: new Date().toISOString(),
    // `--ids` repairs rows on whatever sheet exists; it does not redefine which
    // month that sheet is for.
    month: args.ids ? (previous.size ? month : null) : args.month,
    ingredients: ordered,
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n')

  const empty = ordered.filter((row) => row.candidates.length === 0)
  const partial = ordered.filter((row) => row.partial)
  console.log(`\nWrote ${path.relative(process.cwd(), OUT_FILE)}`)
  console.log(`${ordered.length - empty.length} with candidates, ${empty.length} without.`)
  if (empty.length) console.log(`Without: ${empty.map((row) => row.id).join(', ')}`)
  if (partial.length) {
    console.log(`Half-blind, only one of two searches ran: ${partial.map((row) => row.id).join(', ')}`)
    console.log('Run this again to repair those rows. Rows already done are skipped.')
  }
}

main()
