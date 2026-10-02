import { domesticAvailability } from './availability'
import { compareNames } from '@/lib/sort'
import type { Ingredient, Month, Recipe } from '@/lib/types'

/**
 * The ingredients that put a recipe in season in any of the chosen months, in
 * recipe order.
 *
 * Tia's rule, 2026-09-23: one is enough. A recipe is in season when at least
 * one of its ingredients is available from Finland this month, fresh or from
 * storage, so an empty result means "not in season" and anything else means
 * "in season, because of these". Imported stock does not count: the app is
 * domestic by default, and a recipe does not become seasonal because limes
 * can be bought all year.
 */
export function inSeasonIngredients(
  recipe: Recipe,
  calendar: Map<string, Ingredient>,
  months: Month[],
): string[] {
  const ids = recipe.ingredients
    // Optional lines can be left out, so they cannot be what makes it seasonal.
    .filter((line) => !line.optional)
    .map((line) => line.ingredientId)
    .filter((id): id is string => id !== undefined)
    .filter((id) => {
      const ingredient = calendar.get(id)
      return (
        ingredient !== undefined &&
        months.some((month) => domesticAvailability(ingredient, month) !== 'unavailable')
      )
    })
  return [...new Set(ids)]
}

/**
 * The recipes in season in any of the chosen months, the ones using the most
 * in-season ingredients first, ties by title.
 *
 * Tia's call on 2026-10-02 (issue 015): with months chosen, the recipe view
 * shows only these, in this order within each meal-type section. The count is
 * the same one the card shows, so optional lines, imported-only and pantry
 * ingredients do not move a recipe up.
 */
export function inSeasonRecipes(
  recipes: Recipe[],
  calendar: Map<string, Ingredient>,
  months: Month[],
): Recipe[] {
  return recipes
    .map((recipe) => ({ recipe, count: inSeasonIngredients(recipe, calendar, months).length }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || compareNames(a.recipe.title, b.recipe.title))
    .map(({ recipe }) => recipe)
}
