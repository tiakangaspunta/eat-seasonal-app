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
import { getRecipes, recipesByIngredient } from '../lib/data/recipes'
import { MONTH_NAMES } from '../lib/months'
import { CALENDAR_SEASONS, domesticAvailability } from '../lib/season/availability'
import { inSeasonRecipes } from '../lib/season/recipe'
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

/**
 * A season the current month is not in. Choosing today's own season would
 * leave a heading that already named it, and prove nothing.
 */
export function anotherSeason(): string {
  return CALENDAR_SEASONS.find((season) => !season.months.includes(currentMonth()))!.name
}

/**
 * A season the month view can prove something with: one recipe in season in
 * it, and one recipe left out because it has no ingredient list yet.
 */
export function seasonWithRecipes(): { season: string; inSeason: string; leftOut: string } {
  const calendar = new Map(getIngredients().map((ingredient) => [ingredient.id, ingredient]))
  const recipes = getRecipes()
  const leftOut = recipes.find((recipe) => recipe.ingredients.length === 0)
  for (const season of CALENDAR_SEASONS) {
    const shown = inSeasonRecipes(recipes, calendar, season.months)
    if (shown.length > 0 && leftOut) {
      return { season: season.name, inSeason: shown[0].title, leftOut: leftOut.title }
    }
  }
  throw new Error(
    'No season has an in-season recipe, or every recipe has an ingredient list, so the month view flow cannot prove anything.',
  )
}
