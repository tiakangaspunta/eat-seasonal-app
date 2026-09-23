import { domesticAvailability } from './availability'
import type { Ingredient, Month, Recipe } from '@/lib/types'

/**
 * The ingredients that put a recipe in season this month, in recipe order.
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
  month: Month,
): string[] {
  const ids = recipe.ingredients
    // Optional lines can be left out, so they cannot be what makes it seasonal.
    .filter((line) => !line.optional)
    .map((line) => line.ingredientId)
    .filter((id): id is string => id !== undefined)
    .filter((id) => {
      const ingredient = calendar.get(id)
      return ingredient !== undefined && domesticAvailability(ingredient, month) !== 'unavailable'
    })
  return [...new Set(ids)]
}
