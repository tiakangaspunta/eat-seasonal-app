/**
 * One-shot: add the September produce satokausi.fi's calendar page lists and we
 * did not have, and give the one ingredient that was filed without a season its
 * September.
 *
 * What to add is in `september-additions.mjs`; the months come from
 * `september-additions-source.json`, which is the parsed Sesonki table off each
 * ingredient's own page (see `satokausi-fetch.mjs`).
 *
 * Only September is written. The other eleven months are step 3's job, and the
 * full parse is kept in the source file for when that lands.
 */
import { readFileSync, writeFileSync } from 'node:fs'

import { HARKAPAPU, NEW_INGREDIENTS } from './september-additions.mjs'

const SOURCE = JSON.parse(
  readFileSync(new URL('./september-additions-source.json', import.meta.url)),
)

/** Which of storage / in season / peak September fell in on that page. */
const septemberBucket = (slug) => {
  const row = (SOURCE[slug]?.season ?? []).find((r) => r.months.includes(9))
  if (!row) throw new Error(`${slug}: the page lists no September`)
  if (row.flags.length > 0 && !row.flags.includes('FIN')) {
    throw new Error(`${slug}: September is not Finnish (${row.flags.join(', ')})`)
  }
  return row.bucket
}

const domesticFor = (bucket) =>
  bucket === 'storage'
    ? { freshMonths: [], storageMonths: [9] }
    : bucket === 'peak'
      ? { freshMonths: [9], storageMonths: [], peakMonths: [9] }
      : { freshMonths: [9], storageMonths: [] }

const write = (id, ingredient) =>
  writeFileSync(
    new URL(`../data/ingredients/${id}.json`, import.meta.url),
    JSON.stringify(ingredient, null, 2) + '\n',
  )

let added = 0
for (const [slug, [id, name, category, searchTermFi]] of Object.entries(NEW_INGREDIENTS)) {
  const ingredient = {
    id,
    name,
    category,
    availability: { domestic: domesticFor(septemberBucket(slug)) },
    verified: false,
    similarTo: [],
  }
  if (searchTermFi) ingredient.searchTermFi = searchTermFi
  write(id, ingredient)
  added += 1
}

const path = new URL(`../data/ingredients/${HARKAPAPU.id}.json`, import.meta.url)
const broadBean = JSON.parse(readFileSync(path))
broadBean.category = HARKAPAPU.category
broadBean.availability = { domestic: domesticFor(septemberBucket(HARKAPAPU.slug)) }
broadBean.unverifiedMonths = [9]
broadBean.searchTermFi = 'härkäpapu'
write(HARKAPAPU.id, broadBean)

console.log(`${added} ingredients added, ${HARKAPAPU.id} given a September`)
