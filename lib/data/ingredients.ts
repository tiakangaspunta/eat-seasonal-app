/**
 * Loads and validates data/ingredients/*.json.
 *
 * Reading the directory rather than importing a manifest is deliberate: adding
 * an ingredient means dropping one JSON file into data/ingredients/ and nothing
 * else. Validation is strict because the app writes back into these files, so a
 * bad write should fail loudly at load rather than render as an empty card.
 */
import fs from 'node:fs'
import path from 'node:path'

import type { Category, Ingredient, Month } from '@/lib/types'

const INGREDIENTS_DIR = path.join(process.cwd(), 'data', 'ingredients')

const CATEGORIES: readonly Category[] = [
  'vegetable', 'fruit', 'berry', 'mushroom', 'herb', 'nut', 'other',
]

class IngredientDataError extends Error {
  constructor(file: string, problem: string) {
    super(`data/ingredients/${file}: ${problem}`)
    this.name = 'IngredientDataError'
  }
}

const isMonthArray = (value: unknown): value is Month[] =>
  Array.isArray(value) &&
  value.every((m) => Number.isInteger(m) && (m as number) >= 1 && (m as number) <= 12)

const isBilingual = (value: unknown): boolean =>
  typeof value === 'object' && value !== null &&
  typeof (value as { en?: unknown }).en === 'string' &&
  typeof (value as { fi?: unknown }).fi === 'string'

/** Throws rather than returning a partial ingredient: a silent hole is worse. */
export function parseIngredient(raw: unknown, file: string): Ingredient {
  const fail = (problem: string): never => { throw new IngredientDataError(file, problem) }

  if (typeof raw !== 'object' || raw === null) return fail('not an object')
  const o = raw as Record<string, unknown>

  if (typeof o.id !== 'string' || o.id === '') fail('missing id')
  if (typeof o.name !== 'string' || o.name === '') fail('missing name')
  if (!CATEGORIES.includes(o.category as Category)) fail(`unknown category ${String(o.category)}`)
  if (typeof o.verified !== 'boolean') fail('missing verified')
  if (!Array.isArray(o.similarTo) || !o.similarTo.every((s) => typeof s === 'string')) {
    fail('similarTo must be an array of ingredient ids')
  }
  if (typeof o.availability !== 'object' || o.availability === null) fail('missing availability')

  const availability = o.availability as Record<string, unknown>
  if (availability.domestic !== undefined) {
    const d = availability.domestic as Record<string, unknown>
    if (!isMonthArray(d.freshMonths)) fail('domestic.freshMonths must be months 1-12')
    if (!isMonthArray(d.storageMonths)) fail('domestic.storageMonths must be months 1-12')
    if (d.peakMonths !== undefined && !isMonthArray(d.peakMonths)) {
      fail('domestic.peakMonths must be months 1-12')
    }
  }
  if (availability.imported !== undefined) {
    const i = availability.imported as Record<string, unknown>
    if (!isMonthArray(i.months)) fail('imported.months must be months 1-12')
  }
  if (o.unverifiedMonths !== undefined) {
    if (!isMonthArray(o.unverifiedMonths)) fail('unverifiedMonths must be months 1-12')
    if (o.verified === false) {
      fail('unverifiedMonths is redundant when verified is false: the whole ingredient is drafted')
    }
  }
  if (o.notes !== undefined && !isBilingual(o.notes)) fail('notes must be { en, fi }')
  if (o.warning !== undefined && !isBilingual(o.warning)) fail('warning must be { en, fi }')
  if (o.searchTermFi !== undefined && typeof o.searchTermFi !== 'string') {
    fail('searchTermFi must be a string')
  }

  const fileId = file.replace(/\.json$/, '')
  if (o.id !== fileId) fail(`id "${String(o.id)}" does not match its filename`)

  return raw as Ingredient
}

let cache: Ingredient[] | undefined

/** Every ingredient, sorted by id so output is stable across machines. */
export function getIngredients(): Ingredient[] {
  if (cache) return cache
  const files = fs.readdirSync(INGREDIENTS_DIR).filter((f) => f.endsWith('.json'))
  const ingredients = files.map((file) =>
    parseIngredient(JSON.parse(fs.readFileSync(path.join(INGREDIENTS_DIR, file), 'utf8')), file),
  )

  const seen = new Set<string>()
  for (const ingredient of ingredients) {
    if (seen.has(ingredient.id)) throw new Error(`Duplicate ingredient id: ${ingredient.id}`)
    seen.add(ingredient.id)
  }
  for (const ingredient of ingredients) {
    for (const similar of ingredient.similarTo) {
      if (!seen.has(similar)) {
        throw new Error(`${ingredient.id}.similarTo points at unknown ingredient ${similar}`)
      }
    }
  }

  cache = ingredients.sort((a, b) => a.id.localeCompare(b.id))
  return cache
}

export function getIngredient(id: string): Ingredient | undefined {
  return getIngredients().find((ingredient) => ingredient.id === id)
}

export function countByCategory(): Record<Category, number> {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>
  for (const ingredient of getIngredients()) counts[ingredient.category] += 1
  return counts
}
