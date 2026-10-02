/**
 * October on satokausi.fi's calendar page, checked on 2026-10-02. Record in
 * `docs/OCTOBER-CALENDAR-GAPS.md`.
 *
 * Reads the six pages saved in `scripts/october-source.json` and:
 * - fills white cabbage's October, which issue 012 missed because the page
 *   types its flag "fIN" (satokausi-fetch.mjs now reads flags in any case);
 * - fills red cabbage's unflagged rows as Finnish. Tia's call: every other
 *   cabbage is Finnish, so these are too;
 * - adds four Finnish ingredients the calendar lists that the app lacked,
 *   with the whole year from their own pages, English names (Tia's call);
 * - makes cavolo nero and kale stand-ins for each other (Tia's call).
 *
 * The same reading as apply-year.mjs: FIN makes a row domestic, any other flag
 * imported from that country, and a peak month is also a fresh month.
 *
 * Usage: node scripts/apply-october.mjs          dry run, prints the changes
 *        node scripts/apply-october.mjs --write  also writes data/ingredients/
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'data', 'ingredients')
const SOURCE = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'october-source.json'), 'utf8'))
const WRITE = process.argv.includes('--write')

const COUNTRY = { ESP: 'Spain', ITA: 'Italy', NLD: 'Netherlands' }

const sorted = (months) => [...new Set(months)].sort((a, b) => a - b)

/** A page's rows as month sets. `assumeFinnish` reads a row with no flag as FIN. */
function monthSets(slug, assumeFinnish = false) {
  const sets = { fresh: [], storage: [], peak: [], imported: [], origins: [] }
  for (const row of SOURCE[slug].season) {
    const flags = row.flags.length === 0 && assumeFinnish ? ['FIN'] : row.flags
    if (flags.length === 0) throw new Error(`${slug} ${row.months}: no flag`)
    if (flags.includes('FIN')) {
      if (row.bucket === 'storage') sets.storage.push(...row.months)
      else sets.fresh.push(...row.months)
      if (row.bucket === 'peak') sets.peak.push(...row.months)
    }
    const abroad = flags.filter((f) => f !== 'FIN')
    if (abroad.length) {
      sets.imported.push(...row.months)
      sets.origins.push({ months: row.months, countries: abroad.map((f) => COUNTRY[f] ?? f) })
    }
  }
  return sets
}

function load(id) {
  return JSON.parse(fs.readFileSync(path.join(DIR, `${id}.json`), 'utf8'))
}

function save(ingredient) {
  const file = path.join(DIR, `${ingredient.id}.json`)
  console.log(`${fs.existsSync(file) ? 'update' : 'create'} ${ingredient.id}`)
  if (WRITE) fs.writeFileSync(file, JSON.stringify(ingredient, null, 2) + '\n')
}

/** Adds the page's months to an existing ingredient, marking each one drafted. */
function addMonths(id, slug, months, assumeFinnish) {
  const ingredient = load(id)
  const sets = monthSets(slug, assumeFinnish)
  const domestic = ingredient.availability.domestic
  const pick = (list) => list.filter((m) => months.includes(m))
  domestic.freshMonths = sorted([...domestic.freshMonths, ...pick(sets.fresh)])
  domestic.storageMonths = sorted([...domestic.storageMonths, ...pick(sets.storage)])
  if (pick(sets.peak).length) domestic.peakMonths = sorted([...(domestic.peakMonths ?? []), ...pick(sets.peak)])
  if (ingredient.verified) ingredient.unverifiedMonths = sorted([...(ingredient.unverifiedMonths ?? []), ...months])
  save(ingredient)
}

function create(id, name, slug, similarTo = []) {
  const sets = monthSets(slug)
  const availability = {
    domestic: {
      freshMonths: sorted(sets.fresh),
      storageMonths: sorted(sets.storage),
      ...(sets.peak.length ? { peakMonths: sorted(sets.peak) } : {}),
    },
  }
  if (sets.imported.length) availability.imported = { months: sorted(sets.imported), origins: sets.origins }
  save({ id, name, category: 'vegetable', availability, verified: false, similarTo })
}

addMonths('white-cabbage', 'valkokaali-kerakaali', [10])
addMonths('red-cabbage', 'punakaali', [6, 7, 8, 10, 11, 12], true)

create('cavolo-nero', 'Cavolo nero', 'mustakaali-palmukaali', ['kale'])
create('swiss-chard', 'Swiss chard', 'mangoldi-lehtijuurikas')
create('sugar-beet', 'Sugar beet', 'sokerijuurikas')
create('salsify', 'Salsify', 'kaurajuuri')

const kale = load('kale')
kale.similarTo = [...new Set([...kale.similarTo, 'cavolo-nero'])]
save(kale)

if (!WRITE) console.log('\ndry run: nothing written, pass --write')
