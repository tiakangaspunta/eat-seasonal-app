/**
 * Writes May to August and October to December into every ingredient, from
 * the satokausi.fi pages in `scripts/year-source.json` (issue 012).
 *
 * Same reading as issue 004: on each page a row names a month range, a bucket
 * (Varastosesonki, Sesongissa, Huippusesonki) and the flags of where the
 * produce comes from. A FIN flag makes it domestic, in that bucket; any other
 * flag makes it imported from that country. A row can carry both.
 *
 * What it does not touch:
 * - January to April and September. Those are Tia's Notion months and issue
 *   004's months; disagreements there are issue 013's.
 * - A month an ingredient already has that Tia verified. It is reported if
 *   satokausi says something else, and left alone.
 * - Anything the page does not settle: a row with no flags, a flag this file
 *   has no country for, a month that is both fresh and storage. Reported, not
 *   guessed.
 *
 * Usage: node scripts/apply-year.mjs          dry run, prints the report
 *        node scripts/apply-year.mjs --write  also writes data/ingredients/
 */
import fs from 'node:fs'
import path from 'node:path'

import { yearSlugs } from './year-slugs.mjs'

const MONTHS = [5, 6, 7, 8, 10, 11, 12]
const DIR = path.join(process.cwd(), 'data', 'ingredients')
const SOURCE = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'year-source.json'), 'utf8'))
const WRITE = process.argv.includes('--write')

/** satokausi's flag codes (ISO 3166 alpha-3), as the origin tag displays them. */
const COUNTRY = {
  BRA: 'Brazil', CHN: 'China', COL: 'Colombia', CRI: 'Costa Rica', ECU: 'Ecuador',
  EGY: 'Egypt', ESP: 'Spain', FRA: 'France', GRC: 'Greece', ISR: 'Israel',
  ITA: 'Italy', KEN: 'Kenya', MAR: 'Morocco', MEX: 'Mexico', NLD: 'Netherlands',
  PER: 'Peru', PHL: 'Philippines', TUR: 'Turkey', USA: 'United States',
  ZAF: 'South Africa',
}

/** Ingredients whose page was not recorded as their slug, found for 012. */
const EXTRA_SLUGS = { chanterelle: 'kantarelli' }

/**
 * Pages whose season cell is a sentence rather than a table, which
 * satokausi-fetch.mjs does not parse. Read by hand on 2026-09-30:
 *   herkkusieni    "kasvatettuna ympäri vuoden (Suomi)"
 *   osterivinokas  "ympäri vuoden (Suomi, viljelty)"
 * Both say grown in Finland all year, so every month is fresh and domestic.
 */
const YEAR_ROUND = {
  herkkusieni: [{ months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], bucket: 'fresh', flags: ['FIN'] }],
  osterivinokas: [{ months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], bucket: 'fresh', flags: ['FIN'] }],
}

const sorted = (months) => [...new Set(months)].sort((a, b) => a - b)

const report = { written: [], unsettled: [], keptVerified: [], noPage: [], noTable: [] }

const slugs = { ...yearSlugs(), ...EXTRA_SLUGS }

for (const [id, slug] of Object.entries(slugs)) {
  if (!slug) { report.noPage.push(id); continue }
  const page = YEAR_ROUND[slug] ? { season: YEAR_ROUND[slug] } : SOURCE[slug]
  if (!page?.season?.length) { report.noTable.push(`${id} (${slug})`); continue }

  const file = path.join(DIR, `${id}.json`)
  const ingredient = JSON.parse(fs.readFileSync(file, 'utf8'))
  const unverified = new Set(ingredient.unverifiedMonths ?? [])
  const isVerified = (month) => ingredient.verified && !unverified.has(month)

  const domestic = ingredient.availability.domestic ?? { freshMonths: [], storageMonths: [] }
  const imported = ingredient.availability.imported ?? { months: [] }
  const origins = new Map() // month -> countries, for the months written here
  const added = []

  const has = (month) =>
    domestic.freshMonths.includes(month) ||
    domestic.storageMonths.includes(month) ||
    imported.months.includes(month)

  for (const month of MONTHS) {
    const rows = page.season.filter((row) => row.months.includes(month))
    if (rows.length === 0) continue

    const fin = new Set(rows.filter((r) => r.flags.includes('FIN')).map((r) => r.bucket))
    const foreign = rows.flatMap((r) => r.flags.filter((f) => f !== 'FIN'))
    const problems = []
    if (rows.some((r) => r.flags.length === 0)) problems.push('a row with no origin flag')
    const unknown = foreign.filter((f) => !COUNTRY[f])
    if (unknown.length) problems.push(`unknown flag ${[...new Set(unknown)].join(', ')}`)
    if (fin.has('storage') && (fin.has('fresh') || fin.has('peak'))) problems.push('both fresh and storage')
    if (problems.length) {
      report.unsettled.push(`${id} ${month}: ${problems.join('; ')}`)
      continue
    }

    if (has(month) && isVerified(month)) {
      report.keptVerified.push(`${id} ${month}`)
      continue
    }

    if (fin.size) {
      if (fin.has('storage')) domestic.storageMonths = sorted([...domestic.storageMonths, month])
      else domestic.freshMonths = sorted([...domestic.freshMonths, month])
      if (fin.has('peak')) domestic.peakMonths = sorted([...(domestic.peakMonths ?? []), month])
    }
    if (foreign.length) {
      imported.months = sorted([...imported.months, month])
      origins.set(month, [...new Set(foreign.map((f) => COUNTRY[f]))])
    }
    added.push(month)
  }

  if (added.length === 0) continue

  if (domestic.freshMonths.length || domestic.storageMonths.length) {
    ingredient.availability.domestic = domestic
  }
  if (imported.months.length) {
    // Group the new months by country list, as the existing origins are grouped.
    const groups = new Map()
    for (const [month, countries] of origins) {
      const key = countries.join('|')
      groups.set(key, { months: [...(groups.get(key)?.months ?? []), month], countries })
    }
    // A month written here replaces any origin it had, so a rerun does not
    // record the same month twice.
    const kept = (imported.origins ?? [])
      .map((o) => ({ ...o, months: o.months.filter((m) => !origins.has(m)) }))
      .filter((o) => o.months.length)
    imported.origins = [...kept, ...groups.values()].sort(
      (a, b) => a.months[0] - b.months[0],
    )
    ingredient.availability.imported = imported
  }
  // verified:false already says the whole ingredient is drafted.
  if (ingredient.verified) ingredient.unverifiedMonths = sorted([...unverified, ...added])

  report.written.push(`${id}: ${added.join(', ')}`)
  if (WRITE) fs.writeFileSync(file, `${JSON.stringify(ingredient, null, 2)}\n`)
}

for (const [key, lines] of Object.entries(report)) {
  console.log(`\n## ${key} (${lines.length})`)
  for (const line of lines) console.log(`- ${line}`)
}
console.log(WRITE ? '\nWritten.' : '\nDry run: nothing written. Pass --write to apply.')
