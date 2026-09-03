/**
 * Loads and validates data/recipes/*.json.
 *
 * Same shape of loader as lib/data/ingredients.ts, and for the same reasons:
 * the directory is the manifest, so adding a recipe means dropping one JSON
 * file in; and validation throws rather than skipping, because the app writes
 * back into these files (title and notes editing) and a bad write should fail
 * at load rather than render as a blank card.
 */
import fs from 'node:fs'
import path from 'node:path'

import { getIngredients } from './ingredients'
import type { Bilingual, Effort, MealType, Recipe, RecipeIngredient, Tag } from '@/lib/types'

const RECIPES_DIR = path.join(process.cwd(), 'data', 'recipes')

const MEAL_TYPES: readonly MealType[] = [
  'breakfast', 'lunch', 'dinner', 'dessert', 'side', 'snack',
]

const TAGS: readonly Tag[] = [
  'vegan', 'vegetarian', 'dairy-free', 'gluten-free', 'quick', 'one-pot', 'oven', 'batch',
]

const EFFORTS: readonly Effort[] = ['easy', 'medium', 'hard']

const SUBSTITUTION_REASONS = ['vegan', 'dairy-free', 'seasonal', 'pantry', 'preference']

class RecipeDataError extends Error {
  constructor(file: string, problem: string) {
    super(`data/recipes/${file}: ${problem}`)
    this.name = 'RecipeDataError'
  }
}

const isBilingual = (value: unknown): value is Bilingual =>
  typeof value === 'object' && value !== null &&
  typeof (value as { en?: unknown }).en === 'string' &&
  typeof (value as { fi?: unknown }).fi === 'string'

const isStringArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every((s) => typeof s === 'string')

/** Throws rather than returning a partial recipe: a silent hole is worse. */
export function parseRecipe(raw: unknown, file: string): Recipe {
  const fail = (problem: string): never => { throw new RecipeDataError(file, problem) }

  if (typeof raw !== 'object' || raw === null) return fail('not an object')
  const o = raw as Record<string, unknown>

  if (typeof o.id !== 'string' || o.id === '') fail('missing id')
  if (typeof o.title !== 'string' || o.title === '') fail('missing title')
  if (!EFFORTS.includes(o.effort as Effort)) fail(`unknown effort ${String(o.effort)}`)

  if (!Array.isArray(o.mealType) || o.mealType.length === 0) {
    fail('mealType must be a non-empty array')
  }
  for (const meal of o.mealType as unknown[]) {
    if (!MEAL_TYPES.includes(meal as MealType)) fail(`unknown mealType ${String(meal)}`)
  }

  if (!Array.isArray(o.tags)) fail('tags must be an array')
  for (const tag of o.tags as unknown[]) {
    if (!TAGS.includes(tag as Tag)) fail(`unknown tag ${String(tag)}`)
  }

  if (o.source !== undefined) {
    const s = o.source as Record<string, unknown>
    if (typeof s?.name !== 'string' || s.name === '') fail('source.name must be a non-empty string')
    if (typeof s?.url !== 'string' || !s.url.startsWith('http')) fail('source.url must be a URL')
  }

  if (o.timeMinutes !== undefined) {
    if (typeof o.timeMinutes !== 'number' || !Number.isFinite(o.timeMinutes) || o.timeMinutes <= 0) {
      fail('timeMinutes must be a positive number when present')
    }
  }
  if (o.servings !== undefined && (typeof o.servings !== 'number' || o.servings <= 0)) {
    fail('servings must be a positive number when present')
  }

  if (!Array.isArray(o.ingredients)) fail('ingredients must be an array')
  for (const line of o.ingredients as unknown[]) parseRecipeIngredient(line, fail)

  if (o.ownNotes !== undefined && !isBilingual(o.ownNotes)) fail('ownNotes must be { en, fi }')
  if (o.steps !== undefined) {
    const steps = o.steps as Record<string, unknown>
    if (!isStringArray(steps?.en) || !isStringArray(steps?.fi)) {
      fail('steps must be { en: string[], fi: string[] }')
    }
  }

  const fileId = file.replace(/\.json$/, '')
  if (o.id !== fileId) fail(`id "${String(o.id)}" does not match its filename`)

  return raw as Recipe
}

function parseRecipeIngredient(
  raw: unknown,
  fail: (problem: string) => never,
): RecipeIngredient {
  if (typeof raw !== 'object' || raw === null) return fail('an ingredient line is not an object')
  const line = raw as Record<string, unknown>

  const hasId = typeof line.ingredientId === 'string' && line.ingredientId !== ''
  const hasText = typeof line.freeText === 'string' && line.freeText !== ''
  if (!hasId && !hasText) fail('an ingredient line needs an ingredientId or freeText')

  if (line.quantity !== undefined && typeof line.quantity !== 'number') {
    fail('ingredient quantity must be a number')
  }
  if (line.unit !== undefined && typeof line.unit !== 'string') {
    fail('ingredient unit must be a string')
  }
  if (line.optional !== undefined && typeof line.optional !== 'boolean') {
    fail('ingredient optional must be a boolean')
  }

  if (line.substitutions !== undefined) {
    if (!Array.isArray(line.substitutions)) fail('substitutions must be an array')
    for (const sub of line.substitutions as unknown[]) {
      const s = sub as Record<string, unknown>
      const use = s?.use as Record<string, unknown> | undefined
      const useHasTarget =
        typeof use?.ingredientId === 'string' || typeof use?.freeText === 'string'
      if (!useHasTarget) fail('a substitution needs use.ingredientId or use.freeText')
      if (!SUBSTITUTION_REASONS.includes(String(s?.reason))) {
        fail(`unknown substitution reason ${String(s?.reason)}`)
      }
      if (s.note !== undefined && !isBilingual(s.note)) fail('substitution note must be { en, fi }')
    }
  }

  return raw as RecipeIngredient
}

let cache: Recipe[] | undefined

/** Every recipe, sorted by id so output is stable across machines. */
export function getRecipes(): Recipe[] {
  if (cache) return cache
  const files = fs.readdirSync(RECIPES_DIR).filter((f) => f.endsWith('.json'))
  const recipes = files.map((file) =>
    parseRecipe(JSON.parse(fs.readFileSync(path.join(RECIPES_DIR, file), 'utf8')), file),
  )

  const seen = new Set<string>()
  for (const recipe of recipes) {
    if (seen.has(recipe.id)) throw new Error(`Duplicate recipe id: ${recipe.id}`)
    seen.add(recipe.id)
  }

  // A recipe pointing at an ingredient that no longer exists would show up as a
  // gap in season matching, which is the same quiet wrongness the ingredient
  // loader already refuses.
  const ingredientIds = new Set(getIngredients().map((i) => i.id))
  for (const recipe of recipes) {
    for (const line of recipe.ingredients) {
      if (line.ingredientId !== undefined && !ingredientIds.has(line.ingredientId)) {
        throw new Error(`${recipe.id} uses unknown ingredient ${line.ingredientId}`)
      }
      for (const sub of line.substitutions ?? []) {
        const id = sub.use.ingredientId
        if (id !== undefined && !ingredientIds.has(id)) {
          throw new Error(`${recipe.id} substitutes in unknown ingredient ${id}`)
        }
      }
    }
  }

  cache = recipes.sort((a, b) => a.id.localeCompare(b.id))
  return cache
}

export function getRecipe(id: string): Recipe | undefined {
  return getRecipes().find((recipe) => recipe.id === id)
}

/** Recipes still missing a time. Filled in when ingredient lists are rebuilt. */
export function recipesWithoutTime(): Recipe[] {
  return getRecipes().filter((recipe) => recipe.timeMinutes === undefined)
}

export function countByMealType(): Record<MealType, number> {
  const counts = Object.fromEntries(MEAL_TYPES.map((m) => [m, 0])) as Record<MealType, number>
  for (const recipe of getRecipes()) {
    for (const meal of recipe.mealType) counts[meal] += 1
  }
  return counts
}
