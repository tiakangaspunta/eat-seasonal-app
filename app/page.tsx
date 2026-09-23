import { connection } from 'next/server'

import { getIngredients } from '@/lib/data/ingredients'
import { recipesByIngredient } from '@/lib/data/recipes'
import {
  domesticAvailability,
  importedAvailability,
  originIn,
  seasonLabel,
} from '@/lib/season/availability'
import { currentMonth } from '@/lib/months'
import { sortByName } from '@/lib/sort'
import { PageHeader } from '@/components/PageHeader'
import { ProduceGrid } from '@/components/ProduceGrid'
import type { HomeIngredient } from '@/components/types'
import { SEASONAL_CATEGORIES } from '@/lib/types'

/** The ingredient view. The recipe view is app/recipes/page.tsx. */
export default async function HomePage() {
  // Rendered per request: the month is today's, and the open panel is in the URL.
  await connection()
  const month = currentMonth()

  const seasonal = getIngredients().filter((ingredient) =>
    (SEASONAL_CATEGORIES as readonly string[]).includes(ingredient.category),
  )
  // Only the ingredients the grid holds can be opened in the panel, so a
  // "similar" suggestion pointing at a pantry ingredient is dropped rather
  // than rendered as a button that opens nothing.
  const names = new Map(seasonal.map((ingredient) => [ingredient.id, ingredient.name]))
  // Built once for the whole page. Asking for one ingredient's recipes at a
  // time re-read and re-validated every content file on each call, which is
  // cheap once and ruinous 120 times over.
  const recipesForIngredient = recipesByIngredient()

  const ingredients: HomeIngredient[] = seasonal.map((ingredient) => ({
    ...originIn(ingredient, month),
    id: ingredient.id,
    name: ingredient.name,
    category: ingredient.category,
    domesticStatus: domesticAvailability(ingredient, month),
    importedStatus: importedAvailability(ingredient, month),
    seasonLabel: ingredient.availability.domestic
      ? seasonLabel(ingredient.availability.domestic.freshMonths)
      : undefined,
    unverified: ingredient.verified === false || (ingredient.unverifiedMonths?.includes(month) ?? false),
    freshMonths: ingredient.availability.domestic?.freshMonths ?? [],
    storageMonths: ingredient.availability.domestic?.storageMonths ?? [],
    importedMonths: ingredient.availability.imported?.months ?? [],
    image: ingredient.image
      ? {
          file: ingredient.image.file,
          author: ingredient.image.author,
          license: ingredient.image.license,
        }
      : undefined,
    notes: ingredient.notes?.en || undefined,
    similar: sortByName(
      ingredient.similarTo.filter((id) => names.has(id)).map((id) => ({ id, name: names.get(id)! })),
      (similar) => similar.name,
    ),
    recipes: sortByName(
      (recipesForIngredient.get(ingredient.id) ?? []).map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        mealType: recipe.mealType,
        effort: recipe.effort,
        timeMinutes: recipe.timeMinutes,
      })),
      (recipe) => recipe.title,
    ),
  }))

  // Sorted by what the card says, not by the id underneath. Renaming an
  // ingredient moves it to its new alphabetical place, which is the point.
  const byName = sortByName(ingredients, (ingredient) => ingredient.name)

  return (
    <main className="p-6 md:p-10">
      <PageHeader month={month} view="ingredients" />
      <p className="mt-4 text-neutral-700">In season this month.</p>

      <div className="mt-8">
        <ProduceGrid ingredients={byName} month={month} />
      </div>
    </main>
  )
}
