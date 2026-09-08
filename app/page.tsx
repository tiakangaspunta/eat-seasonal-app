import { getIngredients } from '@/lib/data/ingredients'
import { domesticAvailability, importedAvailability, seasonLabel } from '@/lib/season/availability'
import { ProduceGrid, type HomeIngredient } from '@/components/ProduceGrid'
import { SEASONAL_CATEGORIES } from '@/lib/types'
import type { Month } from '@/lib/types'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function currentMonth(): Month {
  return (new Date().getMonth() + 1) as Month
}

export default function HomePage() {
  const month = currentMonth()

  const ingredients: HomeIngredient[] = getIngredients()
    .filter((ingredient) => (SEASONAL_CATEGORIES as readonly string[]).includes(ingredient.category))
    .map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      domesticStatus: domesticAvailability(ingredient, month),
      importedStatus: importedAvailability(ingredient, month),
      seasonLabel: ingredient.availability.domestic
        ? seasonLabel(ingredient.availability.domestic.freshMonths)
        : undefined,
      unverified: ingredient.verified === false || (ingredient.unverifiedMonths?.includes(month) ?? false),
    }))

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold md:text-3xl">
        {MONTH_NAMES[month - 1]}
        <span className="ml-2 font-normal capitalize text-neutral-500">{seasonLabel([month])}</span>
      </h1>
      <p className="mt-4 text-neutral-700">In season, and worth cooking with, this month.</p>

      <div className="mt-8">
        <ProduceGrid ingredients={ingredients} />
      </div>
    </main>
  )
}
