/**
 * Downloads the photos Tia approved, and records their attribution.
 *
 * This is the only step that puts an image in `public/` or writes `image` onto
 * an ingredient, and it acts strictly on `scripts/photo-approvals.json`. An
 * ingredient nobody approved a photo for is left exactly as it is. That is the
 * whole point of the arrangement in `docs/PLAN.md` section 6: nothing enters the
 * project unreviewed.
 *
 * Images are fetched at a sensible width rather than at Commons' original size,
 * which is routinely several megabytes and far more than a card needs.
 *
 * Usage:
 *   node scripts/download-approved.mjs            # download and write attribution
 *   node scripts/download-approved.mjs --dry-run  # say what it would do
 */
import fs from 'node:fs'
import path from 'node:path'

const APPROVALS = path.join(process.cwd(), 'scripts', 'photo-approvals.json')
const INGREDIENTS = path.join(process.cwd(), 'data', 'ingredients')
const IMAGES = path.join(process.cwd(), 'public', 'images', 'ingredients')

const USER_AGENT = 'eat-seasonal-app/0.1 (personal seasonal-produce app; contact via repo)'

/** Wide enough for a card at desktop and a retina phone, small enough to ship. */
const WIDTH = 800

const dryRun = process.argv.includes('--dry-run')

/**
 * Commons serves any file at any width through Special:FilePath, which is the
 * documented way to ask for a scaled copy. Anything else is taken as it comes.
 */
function downloadUrl(candidate) {
  if (candidate.source === 'Wikimedia Commons') {
    const file = encodeURIComponent(candidate.title.replace(/^File:/, ''))
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${WIDTH}`
  }
  return candidate.fullUrl
}

/** The extension the browser will need, taken from the file we asked for. */
function extensionOf(candidate, contentType) {
  const fromType = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[contentType]
  if (fromType) return fromType
  const fromTitle = path.extname(candidate.title).toLowerCase()
  return fromTitle === '.jpeg' ? '.jpg' : fromTitle || '.jpg'
}

/**
 * Waits out a 429 rather than failing on it, as `photo-candidates.mjs` does.
 * Commons' limit is a burst limit: a run of 65 downloads trips it around the
 * 55th, and what it wants is a real pause.
 */
const BACKOFF = [5000, 15000, 45000, 90000]

async function fetchPatiently(url) {
  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (response.status !== 429 || attempt === BACKOFF.length) return response
    const told = Number(response.headers.get('retry-after')) * 1000
    const wait = Number.isFinite(told) && told > 0 ? told : BACKOFF[attempt] * (1 + Math.random())
    console.log(`    429, waiting ${Math.round(wait / 1000)}s`)
    await new Promise((resolve) => setTimeout(resolve, wait))
  }
}

async function download(id, candidate) {
  const url = downloadUrl(candidate)
  const response = await fetchPatiently(url)
  if (!response.ok) throw new Error(`${url} answered ${response.status}`)

  const contentType = (response.headers.get('content-type') ?? '').split(';')[0]
  if (!contentType.startsWith('image/')) throw new Error(`${url} is not an image (${contentType})`)

  const file = `${id}${extensionOf(candidate, contentType)}`
  fs.mkdirSync(IMAGES, { recursive: true })
  fs.writeFileSync(path.join(IMAGES, file), Buffer.from(await response.arrayBuffer()))
  return file
}

/**
 * Writes the attribution onto the ingredient, and nothing else.
 *
 * Same rule as renaming: a change to one field leaves every other field, and
 * the id above all, exactly as it was.
 */
function recordImage(id, file, candidate) {
  const target = path.join(INGREDIENTS, `${id}.json`)
  const ingredient = JSON.parse(fs.readFileSync(target, 'utf8'))
  ingredient.image = {
    file: `/images/ingredients/${file}`,
    author: candidate.author,
    license: candidate.license,
    sourceUrl: candidate.sourceUrl,
  }
  fs.writeFileSync(target, JSON.stringify(ingredient, null, 2) + '\n')
}

async function main() {
  if (!fs.existsSync(APPROVALS)) {
    console.log('No approvals yet. Review the contact sheet at /photos first.')
    return
  }

  const { decisions } = JSON.parse(fs.readFileSync(APPROVALS, 'utf8'))
  const approved = Object.entries(decisions).filter(([, decision]) => decision !== null)

  if (approved.length === 0) {
    console.log('Nothing approved yet.')
    return
  }

  console.log(`${approved.length} approved${dryRun ? ' (dry run, nothing will be written)' : ''}`)

  let done = 0
  for (const [id, candidate] of approved) {
    if (!fs.existsSync(path.join(INGREDIENTS, `${id}.json`))) {
      console.log(`  ${id}: no such ingredient, skipped`)
      continue
    }
    // Already downloaded, and still the photo that was approved: nothing to do.
    // A changed approval has a different sourceUrl, so it downloads again.
    const current = JSON.parse(fs.readFileSync(path.join(INGREDIENTS, `${id}.json`), 'utf8')).image
    if (
      current?.sourceUrl === candidate.sourceUrl &&
      fs.existsSync(path.join(process.cwd(), 'public', current.file))
    ) {
      done += 1
      continue
    }
    if (dryRun) {
      console.log(`  ${id}: would download ${downloadUrl(candidate)}`)
      continue
    }
    try {
      const file = await download(id, candidate)
      recordImage(id, file, candidate)
      done += 1
      console.log(`  ${id}: ${file}`)
    } catch (error) {
      console.log(`  ${id}: FAILED, ${error.message}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  if (!dryRun) console.log(`\nDownloaded ${done} of ${approved.length}.`)
}

main()
