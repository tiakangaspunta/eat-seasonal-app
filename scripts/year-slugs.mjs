/**
 * Which satokausi.fi page belongs to which ingredient, for issue 012.
 *
 * Collected from the two September scripts, which already recorded the slug of
 * every page read on 2026-09-11, so the rest of the year is read off the same
 * pages rather than looked up again. Ingredients merged or removed since
 * (the two lettuces folded into iceberg-lettuce) are dropped.
 *
 * Usage: node scripts/year-slugs.mjs  prints { id: slug | null } for every
 * ingredient in a seasonal category, null where no page is recorded.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { SEPTEMBER_BY_INGREDIENT } from './september-source.mjs'
import { NEW_INGREDIENTS, HARKAPAPU } from './september-additions.mjs'

const SEASONAL = ['vegetable', 'fruit', 'berry', 'mushroom', 'herb']

export function yearSlugs() {
  const known = {}
  for (const [id, [, slug]] of Object.entries(SEPTEMBER_BY_INGREDIENT)) known[id] = slug
  for (const [slug, [id]] of Object.entries(NEW_INGREDIENTS)) known[id] = slug
  known[HARKAPAPU.id] = HARKAPAPU.slug

  const dir = path.join(process.cwd(), 'data', 'ingredients')
  const out = {}
  for (const file of fs.readdirSync(dir).sort()) {
    const ingredient = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    if (!SEASONAL.includes(ingredient.category)) continue
    out[ingredient.id] = known[ingredient.id] ?? null
  }
  return out
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stdout.write(JSON.stringify(yearSlugs(), null, 2) + '\n')
}
