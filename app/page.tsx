import { getIngredients } from '@/lib/data/ingredients'
import { recipesUsingIngredient } from '@/lib/data/recipes'
import {
  domesticAvailability,
  importedAvailability,
  originIn,
  seasonLabel,
} from '@/lib/season/availability'
import { MONTH_NAMES } from '@/lib/months'
import { ProduceGrid } from '@/components/ProduceGrid'
import type { HomeIngredient } from '@/components/types'
import { SEASONAL_CATEGORIES } from '@/lib/types'
import type { Month } from '@/lib/types'

function currentMonth(): Month {
  return (new Date().getMonth() + 1) as Month
}

export default function HomePage() {
  const month = currentMonth()

  const seasonal = getIngredients().filter((ingredient) =>
    (SEASONAL_CATEGORIES as readonly string[]).includes(ingredient.category),
  )
  // Only the ingredients the grid holds can be opened in the panel, so a
  // "similar" suggestion pointing at a pantry ingredient is dropped rather
  // than rendered as a button that opens nothing.
  const names = new Map(seasonal.map((ingredient) => [ingredient.id, ingredient.name]))

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
    notes: ingredient.notes?.en || undefined,
    warning: ingredient.warning?.en || undefined,
    similar: ingredient.similarTo
      .filter((id) => names.has(id))
      .map((id) => ({ id, name: names.get(id)! })),
    recipes: recipesUsingIngredient(ingredient.id).map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      mealType: recipe.mealType,
      effort: recipe.effort,
      timeMinutes: recipe.timeMinutes,
    })),
  }))

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold md:text-3xl">
        {MONTH_NAMES[month]}
        <span className="ml-2 font-normal capitalize text-neutral-500">{seasonLabel([month])}</span>
      </h1>
      <p className="mt-4 text-neutral-700">In season this month.</p>

      <div className="mt-8">
        <ProduceGrid ingredients={ingredients} month={month} />
      </div>
    </main>
  )
}
