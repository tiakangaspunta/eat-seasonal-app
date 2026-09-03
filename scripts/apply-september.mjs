/**
 * One-shot: writes September into data/ingredients/ from satokausi.fi.
 *
 * Applies september-source.mjs, the transcription of each ingredient's own
 * satokausi.fi page (issue 004). Kept in the repo as the record of what was
 * applied and why, not as a script anyone runs twice: it is idempotent, but a
 * second run over hand-corrected data would put a removed month back.
 */
import fs from 'node:fs'
import path from 'node:path'

import { SEPTEMBER_BY_INGREDIENT } from './september-source.mjs'

const SEPTEMBER = 9
const DIR = path.join(process.cwd(), 'data', 'ingredients')

const add = (months, month) =>
  months.includes(month) ? months : [...months, month].sort((a, b) => a - b)

let changed = 0
for (const [id, [bucket]] of Object.entries(SEPTEMBER_BY_INGREDIENT)) {
  const file = path.join(DIR, `${id}.json`)
  const ingredient = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (bucket === 'absent' || bucket === 'no-page' || bucket === 'already-verified') continue

  // Tia verified this month as fresh herself; satokausi only adds that it peaks.
  // The peak claim is sourced rather than hers, but provenance is tracked per
  // month and not per claim, so marking the month drafted would wrongly demote
  // her own fresh months. Her verified month wins, and the peak rides along.
  if (bucket === 'peak-only') {
    const domestic = ingredient.availability.domestic
    domestic.peakMonths = add(domestic.peakMonths ?? [], SEPTEMBER)
    fs.writeFileSync(file, `${JSON.stringify(ingredient, null, 2)}
`)
    changed += 1
    continue
  }

  if (bucket === 'imported') {
    const imported = ingredient.availability.imported ?? { months: [] }
    imported.months = add(imported.months, SEPTEMBER)
    ingredient.availability.imported = imported
  } else {
    const domestic = ingredient.availability.domestic ?? { freshMonths: [], storageMonths: [] }
    if (bucket === 'storage') {
      domestic.storageMonths = add(domestic.storageMonths, SEPTEMBER)
    } else {
      domestic.freshMonths = add(domestic.freshMonths, SEPTEMBER)
      if (bucket === 'peak') domestic.peakMonths = add(domestic.peakMonths ?? [], SEPTEMBER)
    }
    ingredient.availability.domestic = domestic
  }

  // verified:false already says the whole ingredient is drafted.
  if (ingredient.verified) {
    ingredient.unverifiedMonths = add(ingredient.unverifiedMonths ?? [], SEPTEMBER)
  }

  fs.writeFileSync(file, `${JSON.stringify(ingredient, null, 2)}\n`)
  changed += 1
}
console.log(`September written into ${changed} ingredients`)
