import { connection } from 'next/server'

import { getIngredients } from '@/lib/data/ingredients'
import { getRecipes } from '@/lib/data/recipes'
import { currentMonth } from '@/lib/months'
import { inSeasonIngredients } from '@/lib/season/recipe'
import { sortByName } from '@/lib/sort'
import { PageHeader } from '@/components/PageHeader'
import { RecipeGrid } from '@/components/RecipeGrid'
import type { RecipeName, RecipeViewItem } from '@/components/types'
import { SEASONAL_CATEGORIES } from '@/lib/types'
import type { Ingredient, Month, Recipe } from '@/lib/types'

/** The recipe view. The ingredient view is app/page.tsx. */
export default async function RecipesPage() {
  // Rendered per request: the month is today's, and the open panel is in the URL.
  await connection()
  const month = currentMonth()

  const ingredients = new Map(getIngredients().map((ingredient) => [ingredient.id, ingredient]))
  const recipes = sortByName(
    getRecipes().map((recipe) => toViewItem(recipe, ingredients, month)),
    (recipe) => recipe.title,
  )

  return (
    <main className="p-6 md:p-10">
      <PageHeader month={month} view="recipes" />
      <p className="mt-4 text-neutral-700">
        Every recipe, by meal. The ones with something in season this month are marked.
      </p>

      <div className="mt-8">
        <RecipeGrid recipes={recipes} />
      </div>
    </main>
  )
}

const isSeasonal = (ingredient: Ingredient) =>
  (SEASONAL_CATEGORIES as readonly string[]).includes(ingredient.category)

/**
 * A recipe's names resolved against the calendar. The loader has already
 * refused any recipe naming an ingredient that does not exist, so a lookup
 * here cannot miss.
 */
function resolve(
  use: { ingredientId?: string; freeText?: string },
  ingredients: Map<string, Ingredient>,
): RecipeName {
  if (use.ingredientId === undefined) return { name: use.freeText ?? '' }
  const ingredient = ingredients.get(use.ingredientId)!
  return isSeasonal(ingredient)
    ? { name: ingredient.name, linkId: ingredient.id }
    : { name: ingredient.name }
}

function toViewItem(
  recipe: Recipe,
  ingredients: Map<string, Ingredient>,
  month: Month,
): RecipeViewItem {
  return {
    id: recipe.id,
    title: recipe.title,
    mealType: recipe.mealType,
    tags: recipe.tags,
    effort: recipe.effort,
    timeMinutes: recipe.timeMinutes,
    servings: recipe.servings,
    source: recipe.source,
    ownNotes: recipe.ownNotes?.en || undefined,
    inSeason: inSeasonIngredients(recipe, ingredients, month).map((id) =>
      resolve({ ingredientId: id }, ingredients),
    ),
    lines: recipe.ingredients.map((line) => ({
      ...resolve(line, ingredients),
      quantity: line.quantity,
      unit: line.unit,
      optional: line.optional ?? false,
      substitutions: (line.substitutions ?? []).map((substitution) => ({
        ...resolve(substitution.use, ingredients),
        reason: substitution.reason,
        ratio: substitution.ratio,
        note: substitution.note?.en || undefined,
      })),
    })),
  }
}
