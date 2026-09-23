/**
 * What the smoke flows expect to see, read from the same data and the same
 * season logic the app uses.
 *
 * Nothing here is hard-coded. The month comes from the clock, the ingredient
 * comes from the calendar, and both would otherwise have to be edited every
 * time the month turns or a name is renamed into Finnish. A smoke test that
 * needs editing when the content changes is a test that gets deleted.
 */
import { getIngredients } from '../lib/data/ingredients'
import { recipesByIngredient } from '../lib/data/recipes'
import { MONTH_NAMES } from '../lib/months'
import { domesticAvailability } from '../lib/season/availability'
import { SEASONAL_CATEGORIES } from '../lib/types'
import type { Month } from '../lib/types'

export const currentMonth = (): Month => (new Date().getMonth() + 1) as Month

export const currentMonthName = (): string => MONTH_NAMES[currentMonth()]

const inSeasonNow = () =>
  getIngredients().filter(
    (ingredient) =>
      (SEASONAL_CATEGORIES as readonly string[]).includes(ingredient.category) &&
      domesticAvailability(ingredient, currentMonth()) !== 'unavailable',
  )

/**
 * An ingredient the panel flow can prove something with: in season now, and
 * used by at least one recipe, so "the panel lists its recipes" is a real
 * assertion rather than a vacuous one. The one with the most recipes wins, so
 * the choice stays stable as recipes are added.
 */
export function ingredientWithRecipes(): { name: string; recipeTitle: string } {
  // One pass over the recipes, not one per ingredient: asking each ingredient
  // separately re-read every data file ~100 times and took 25 of the test's
  // 30 seconds, the same trap the home page fell into (DECISIONS.md).
  const byIngredient = recipesByIngredient()
  const candidates = inSeasonNow()
    .map((ingredient) => ({ ingredient, recipes: byIngredient.get(ingredient.id) ?? [] }))
    .filter(({ recipes }) => recipes.length > 0)
    .sort((a, b) => b.recipes.length - a.recipes.length)

  const best = candidates[0]
  if (!best) {
    throw new Error(
      'No ingredient is both in season this month and used by a recipe, so the panel flow cannot prove anything. ' +
        'This is a content gap, not a test failure: see issues/005-rebuild-september-recipes.md.',
    )
  }

  return { name: best.ingredient.name, recipeTitle: best.recipes[0].title }
}

/** An ingredient that only shows up once imported produce is included. */
export function importedOnlyCount(): number {
  const month = currentMonth()
  return getIngredients().filter(
    (ingredient) =>
      (SEASONAL_CATEGORIES as readonly string[]).includes(ingredient.category) &&
      domesticAvailability(ingredient, month) === 'unavailable' &&
      (ingredient.availability.imported?.months ?? []).includes(month),
  ).length
}
