/**
 * TEMPORARY. Delete this whole directory when issue 007 builds the real home
 * view. It exists only so the seed content can be reviewed in a browser instead
 * of by reading JSON.
 *
 * One rule holds it in place: it derives nothing. It prints the month arrays as
 * they are stored and never turns them into a season label, a "fresh now", or a
 * recipe's own season. All of that belongs to lib/season/ in issue 006, and a
 * throwaway page is exactly where a second, quietly disagreeing copy of that
 * logic would take root.
 */
import { getIngredients } from '@/lib/data/ingredients'
import { getRecipes } from '@/lib/data/recipes'
import { SEASONAL_CATEGORIES } from '@/lib/types'
import type { Category, Ingredient, Month } from '@/lib/types'

const MONTH_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTHS: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const SEPTEMBER: Month = 9

const CATEGORY_LABELS: Record<Category, string> = {
  vegetable: 'Vegetables',
  fruit: 'Fruit',
  berry: 'Berries',
  mushroom: 'Mushrooms',
  herb: 'Herbs',
  nut: 'Nuts',
  other: 'Other',
}

/** What the stored data says about one month. Fresh and storage are both shown. */
function monthCell(ingredient: Ingredient, month: Month) {
  const domestic = ingredient.availability.domestic
  const fresh = domestic?.freshMonths.includes(month) ?? false
  const stored = domestic?.storageMonths.includes(month) ?? false
  const peak = domestic?.peakMonths?.includes(month) ?? false
  const imported = ingredient.availability.imported?.months.includes(month) ?? false
  const drafted =
    !ingredient.verified || (ingredient.unverifiedMonths?.includes(month) ?? false)

  const style = fresh
    ? 'bg-emerald-600 text-white'
    : stored
      ? 'bg-amber-200 text-amber-950'
      : imported
        ? 'bg-sky-100 text-sky-900'
        : 'bg-neutral-100 text-neutral-400'

  const words =
    [fresh && 'fresh', stored && 'from storage', imported && 'imported', peak && 'peak']
      .filter(Boolean)
      .join(', ') || 'not available'
  const available = fresh || stored || imported
  const suffix = drafted && available ? ' (drafted)' : ''

  return (
    <span
      key={month}
      title={`${MONTH_INITIALS[month - 1]}: ${words}${suffix}`}
      className={`grid h-6 w-6 place-items-center rounded text-[11px] font-medium ${style}`}
    >
      {peak ? '*' : MONTH_INITIALS[month - 1]}
    </span>
  )
}

function IngredientRow({ ingredient }: { ingredient: Ingredient }) {
  const domestic = ingredient.availability.domestic
  const draftedSeptember =
    !ingredient.verified || (ingredient.unverifiedMonths?.includes(SEPTEMBER) ?? false)
  const inSeptember =
    (domestic?.freshMonths.includes(SEPTEMBER) ?? false) ||
    (domestic?.storageMonths.includes(SEPTEMBER) ?? false) ||
    (ingredient.availability.imported?.months.includes(SEPTEMBER) ?? false)

  return (
    <li className="flex flex-col gap-2 border-b border-neutral-200 py-3 md:flex-row md:items-center md:gap-4">
      <div className="min-w-0 md:w-72">
        <span className={inSeptember ? 'font-medium' : 'text-neutral-500'}>{ingredient.name}</span>
        {ingredient.warning ? (
          <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">warning</span>
        ) : null}
        {draftedSeptember && inSeptember ? (
          <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-xs text-neutral-700">
            drafted
          </span>
        ) : null}
        <span className="ml-2 text-xs text-neutral-400">{ingredient.id}</span>
      </div>
      <div className="flex flex-wrap gap-1">{MONTHS.map((month) => monthCell(ingredient, month))}</div>
    </li>
  )
}

export default function PreviewPage() {
  const ingredients = getIngredients()
  const recipes = getRecipes()

  const count = (pick: (i: Ingredient) => boolean) => ingredients.filter(pick).length
  const freshNow = count((i) => i.availability.domestic?.freshMonths.includes(SEPTEMBER) ?? false)
  const storedNow = count(
    (i) =>
      (i.availability.domestic?.storageMonths.includes(SEPTEMBER) ?? false) &&
      !(i.availability.domestic?.freshMonths.includes(SEPTEMBER) ?? false),
  )
  const importedNow = count((i) => i.availability.imported?.months.includes(SEPTEMBER) ?? false)
  const withIngredients = recipes.filter((r) => r.ingredients.length > 0).length

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-6 rounded border border-dashed border-neutral-400 bg-neutral-50 p-3 text-sm text-neutral-700">
        <strong className="font-medium">Temporary data preview.</strong> Not the home view, and not
        designed. It prints what is in <code>data/</code> so the seed content can be checked in a
        browser. Issue 007 builds the real thing, and this page gets deleted then.
      </div>

      <h1 className="text-2xl font-semibold md:text-3xl">Eat seasonal: data preview</h1>

      <section className="mt-6">
        <h2 className="text-lg font-medium">September</h2>
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-700">
          <li>
            <strong className="font-semibold">{freshNow}</strong> fresh
          </li>
          <li>
            <strong className="font-semibold">{storedNow}</strong> from Finnish storage
          </li>
          <li>
            <strong className="font-semibold">{importedNow}</strong> worth buying imported
          </li>
          <li>
            <strong className="font-semibold">{ingredients.length}</strong> ingredients in total
          </li>
        </ul>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-4 w-4 rounded bg-emerald-600" /> fresh
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-4 w-4 rounded bg-amber-200" /> from storage
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-4 w-4 rounded bg-sky-100" /> imported
          </span>
          <span>A star marks a peak month. Tap or hover a square for what it says.</span>
        </p>
      </section>

      {[...SEASONAL_CATEGORIES, 'nut', 'other'].map((category) => {
        const rows = ingredients.filter((i) => i.category === category)
        if (rows.length === 0) return null
        const seasonal = (SEASONAL_CATEGORIES as readonly string[]).includes(category)
        return (
          <section key={category} className="mt-8">
            <h2 className="text-lg font-medium">
              {CATEGORY_LABELS[category as Category]}{' '}
              <span className="text-sm font-normal text-neutral-500">
                {rows.length}
                {seasonal ? '' : ', no months by design, found through recipes'}
              </span>
            </h2>
            <ul className="mt-1">
              {rows.map((ingredient) => (
                <IngredientRow key={ingredient.id} ingredient={ingredient} />
              ))}
            </ul>
          </section>
        )
      })}

      <section className="mt-10">
        <h2 className="text-lg font-medium">
          Recipes{' '}
          <span className="text-sm font-normal text-neutral-500">
            {recipes.length}, {withIngredients} with an ingredient list,{' '}
            {recipes.length - withIngredients} still empty until issue 005
          </span>
        </h2>
        <ul className="mt-2">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex flex-col gap-1 border-b border-neutral-200 py-3 text-sm md:flex-row md:items-baseline md:gap-4"
            >
              <span className="min-w-0 font-medium md:w-80">{recipe.title}</span>
              <span className="text-neutral-600">
                {recipe.ingredients.length} ingredients,{' '}
                {recipe.mealType.join(', ') || 'no meal type'},{' '}
                {recipe.timeMinutes ? `${recipe.timeMinutes} min` : 'no time'}, {recipe.effort}
              </span>
              {recipe.source ? (
                <a
                  href={recipe.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 underline md:ml-auto"
                >
                  {recipe.source.name}
                </a>
              ) : (
                <span className="text-neutral-400 md:ml-auto">own recipe</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
