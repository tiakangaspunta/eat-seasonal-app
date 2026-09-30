/**
 * Replaces the domestic January to April months with what satokausi.fi says,
 * for issue 013.
 *
 * Tia's Notion data had one column for "available", so every month landed in
 * freshMonths; satokausi splits fresh from storage (docs/SATOKAUSI-CONFLICTS.md).
 * On 2026-09-30 Tia decided to trust satokausi, so its reading wins, including
 * the storage months it lists that her data left out.
 *
 * The months stay verified: this is Tia's call, not a draft. Imported months
 * are not touched, since they were already read from the same pages. A month
 * whose page row has no origin flag is reported and left as it was.
 *
 * Usage: node scripts/apply-jan-apr.mjs          dry run, prints the changes
 *        node scripts/apply-jan-apr.mjs --write  also writes data/ingredients/
 */
import fs from 'node:fs'
import path from 'node:path'

import { yearSlugs } from './year-slugs.mjs'

const MONTHS = [1, 2, 3, 4]
const DIR = path.join(process.cwd(), 'data', 'ingredients')
const SOURCE = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'year-source.json'), 'utf8'))
const WRITE = process.argv.includes('--write')

/** Pages that say "grown in Finland year round" in words; see apply-year.mjs. */
const YEAR_ROUND = ['herkkusieni', 'osterivinokas']

const sorted = (months) => [...new Set(months)].sort((a, b) => a - b)
const describe = (d, m) =>
  d.freshMonths.includes(m) ? (d.peakMonths?.includes(m) ? 'fresh (peak)' : 'fresh')
    : d.storageMonths.includes(m) ? 'storage' : 'none'

const changes = []
const unsettled = []

for (const [id, slug] of Object.entries({ ...yearSlugs(), chanterelle: 'kantarelli' })) {
  if (!slug) continue
  const rows = YEAR_ROUND.includes(slug)
    ? [{ months: MONTHS, bucket: 'fresh', flags: ['FIN'] }]
    : SOURCE[slug]?.season
  if (!rows?.length) continue

  const file = path.join(DIR, `${id}.json`)
  const ingredient = JSON.parse(fs.readFileSync(file, 'utf8'))
  const before = structuredClone(
    ingredient.availability.domestic ?? { freshMonths: [], storageMonths: [] },
  )
  const d = structuredClone(before)
  const lines = []

  for (const month of MONTHS) {
    const here = rows.filter((r) => r.months.includes(month))
    if (here.some((r) => r.flags.length === 0)) { unsettled.push(`${id} ${month}`); continue }
    const fin = new Set(here.filter((r) => r.flags.includes('FIN')).map((r) => r.bucket))
    if (fin.has('storage') && (fin.has('fresh') || fin.has('peak'))) { unsettled.push(`${id} ${month}: fresh and storage`); continue }

    d.freshMonths = d.freshMonths.filter((m) => m !== month)
    d.storageMonths = d.storageMonths.filter((m) => m !== month)
    d.peakMonths = (d.peakMonths ?? []).filter((m) => m !== month)
    if (fin.has('storage')) d.storageMonths.push(month)
    else if (fin.size) d.freshMonths.push(month)
    if (fin.has('peak')) d.peakMonths.push(month)

    d.freshMonths = sorted(d.freshMonths)
    d.storageMonths = sorted(d.storageMonths)
    d.peakMonths = sorted(d.peakMonths)

    const was = describe(before, month)
    const now = describe(d, month)
    if (was !== now) lines.push(`${month}: ${was} → ${now}`)
  }

  if (!lines.length) continue
  if (!d.peakMonths.length) delete d.peakMonths
  if (d.freshMonths.length || d.storageMonths.length) ingredient.availability.domestic = d
  else delete ingredient.availability.domestic
  changes.push(`${id}: ${lines.join('; ')}`)
  if (WRITE) fs.writeFileSync(file, `${JSON.stringify(ingredient, null, 2)}\n`)
}

console.log(`## changed (${changes.length})`)
for (const line of changes) console.log(`- ${line}`)
console.log(`\n## unsettled, left as they were (${unsettled.length})`)
for (const line of unsettled) console.log(`- ${line}`)
console.log(WRITE ? '\nWritten.' : '\nDry run: nothing written. Pass --write to apply.')
