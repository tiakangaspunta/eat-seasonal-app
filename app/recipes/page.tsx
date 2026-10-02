import { connection } from 'next/server'

import { getIngredients } from '@/lib/data/ingredients'
import { getRecipes } from '@/lib/data/recipes'
import { currentMonth } from '@/lib/months'
import { inSeasonIngredients, inSeasonRecipes } from '@/lib/season/recipe'
import { formatMonths, parseMonths } from '@/lib/season/selection'
import { sortByName } from '@/lib/sort'
import { UI, text } from '@/lib/strings'
import { monthsPhrase } from '@/components/monthText'
import { PageHeader } from '@/components/PageHeader'
import { RecipeGrid } from '@/components/RecipeGrid'
import type { RecipeName, RecipeViewItem } from '@/components/types'
import { SEASONAL_CATEGORIES } from '@/lib/types'
import type { Ingredient, Month, Recipe } from '@/lib/types'

/** The recipe view. The ingredient view is app/page.tsx. */
export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Rendered per request: today's month is the default, and the chosen months
  // and the open panel are in the URL.
  await connection()
  const today = currentMonth()
  const query = await searchParams
  const months = parseMonths(query.months, today)
  const monthsQuery = query.months === undefined ? '' : `months=${formatMonths(months)}`
  const when = monthsPhrase(months, today)

  const ingredients = new Map(getIngredients().map((ingredient) => [ingredient.id, ingredient]))
  const all = sortByName(getRecipes(), (recipe) => recipe.title)
  // Months chosen in the row narrow the view to what is in season then, most
  // seasonal first (Tia's call, issue 015). Without a choice it is every recipe.
  const chosen = query.months !== undefined
  const shown = chosen ? inSeasonRecipes(all, ingredients, months) : all
  const toItem = (recipe: Recipe) => toViewItem(recipe, ingredients, months)

  return (
    <main className="p-6 md:p-10">
      <PageHeader months={months} today={today} view="recipes" monthsQuery={monthsQuery} />
      <p className="mt-6 text-neutral-700">
        {chosen
          ? `${text(UI.recipeView.inSeasonIntro)} ${when}. ${text(UI.recipeView.inSeasonOrder)}`
          : `Every recipe, by meal. The ones with something in season ${when} are marked.`}
      </p>

      <div className="mt-8">
        {chosen && shown.length === 0 ? (
          <p className="text-neutral-600">{text(UI.recipeView.empty)}</p>
        ) : null}
        <RecipeGrid recipes={shown.map(toItem)} all={all.map(toItem)} when={when} />
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
  months: Month[],
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
    inSeason: inSeasonIngredients(recipe, ingredients, months).map((id) =>
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
