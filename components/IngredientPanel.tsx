'use client'

import { useEffect, useRef, useState } from 'react'

import { MONTHS, MONTH_NAMES, monthInitial } from '@/lib/months'
import { OriginTag } from '@/components/OriginTag'
import type { HomeIngredient, PanelRecipe } from '@/components/types'
import type { MealType, Month } from '@/lib/types'

/**
 * The ingredient side panel: a right-hand panel on desktop, a bottom sheet on
 * mobile. Deliberately not modal. The plan wants the grid visible and usable
 * behind it, so there is no backdrop swallowing clicks, and closing is Escape
 * or the close button rather than a click outside.
 */
export function IngredientPanel({
  ingredient,
  month,
  onClose,
  onSelectIngredient,
}: {
  ingredient: HomeIngredient
  month: Month
  onClose: () => void
  onSelectIngredient: (id: string) => void
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panel.current?.focus()
  }, [ingredient.id])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-label={`${ingredient.name} details`}
      className="fixed inset-x-0 bottom-0 top-20 z-30 flex flex-col overflow-y-auto rounded-t-2xl border border-neutral-200 bg-white shadow-2xl outline-none md:inset-y-0 md:left-auto md:right-0 md:w-full md:max-w-md md:rounded-none md:border-y-0"
    >
      <div className="flex items-start justify-between gap-3 border-b border-neutral-200 p-5">
        <div>
          <h2 className="text-xl font-semibold">{ingredient.name}</h2>
          <p className="mt-1 text-sm capitalize text-neutral-500">
            {ingredient.category}
            {ingredient.seasonLabel && ` · ${ingredient.seasonLabel}`}
          </p>
          <div className="mt-2">
            <OriginTag origin={ingredient.origin} countries={ingredient.countries} />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-neutral-500"
        >
          ×
        </button>
      </div>

      <div className="space-y-6 p-5">
        {ingredient.unverified && (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            These months are drafted from satokausi.fi and not yet confirmed.
          </p>
        )}

        {ingredient.warning && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-900">
            <span className="font-semibold">Preparation warning. </span>
            {ingredient.warning}
          </p>
        )}

        {ingredient.notes && <p className="text-sm text-neutral-700">{ingredient.notes}</p>}

        <section>
          <h3 className="text-sm font-semibold text-neutral-900">Through the year</h3>
          <MonthBar
            freshMonths={ingredient.freshMonths}
            storageMonths={ingredient.storageMonths}
            importedMonths={ingredient.importedMonths}
            currentMonth={month}
          />
        </section>

        <section>
          <h3 className="text-sm font-semibold text-neutral-900">Recipes using {ingredient.name}</h3>
          <RecipeList recipes={ingredient.recipes} />
        </section>

        <CombinePlaceholder name={ingredient.name} />

        {ingredient.similar.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-neutral-900">Similar ingredients</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {ingredient.similar.map((similar) => (
                <button
                  key={similar.id}
                  type="button"
                  onClick={() => onSelectIngredient(similar.id)}
                  className="min-h-11 rounded-full border border-neutral-300 px-4 text-sm"
                >
                  {similar.name}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

type MonthState = 'fresh' | 'storage' | 'imported' | 'none'

const MONTH_STATE_STYLE: Record<MonthState, string> = {
  fresh: 'bg-emerald-500 text-white',
  storage: 'bg-amber-200 text-amber-900',
  imported: 'bg-blue-100 text-blue-800',
  none: 'bg-neutral-100 text-neutral-400',
}

const MONTH_STATE_LABEL: Record<MonthState, string> = {
  fresh: 'fresh in Finland',
  storage: 'from Finnish storage',
  imported: 'imported',
  none: 'not available',
}

function MonthBar({
  freshMonths,
  storageMonths,
  importedMonths,
  currentMonth,
}: {
  freshMonths: Month[]
  storageMonths: Month[]
  importedMonths: Month[]
  currentMonth: Month
}) {
  // Domestic first, for the same reason originIn prefers it: if Finland has it
  // that month, that is the answer, and the imported window is a footnote.
  const stateOf = (month: Month): MonthState => {
    if (freshMonths.includes(month)) return 'fresh'
    if (storageMonths.includes(month)) return 'storage'
    if (importedMonths.includes(month)) return 'imported'
    return 'none'
  }

  return (
    <div className="mt-2">
      <ul className="flex gap-1">
        {MONTHS.map((month) => {
          const state = stateOf(month)
          return (
            <li
              key={month}
              className={`flex h-9 flex-1 items-center justify-center rounded text-xs font-medium ${
                MONTH_STATE_STYLE[state]
              } ${month === currentMonth ? 'ring-2 ring-neutral-900 ring-offset-1' : ''}`}
            >
              <span aria-hidden>{monthInitial(month)}</span>
              <span className="sr-only">{`${MONTH_NAMES[month]}: ${MONTH_STATE_LABEL[state]}`}</span>
            </li>
          )
        })}
      </ul>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600">
        <Swatch className="bg-emerald-500">Fresh</Swatch>
        <Swatch className="bg-amber-200">From storage</Swatch>
        <Swatch className="bg-blue-100">Imported</Swatch>
        <Swatch className="bg-neutral-100">Not available</Swatch>
      </div>
    </div>
  )
}

function Swatch({ className, children }: { className: string; children: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${className}`} aria-hidden />
      {children}
    </span>
  )
}

const MEAL_TYPE_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'side', 'snack']

function RecipeList({ recipes }: { recipes: PanelRecipe[] }) {
  const [mealType, setMealType] = useState<MealType | 'all'>('all')

  const present = MEAL_TYPE_ORDER.filter((meal) => recipes.some((r) => r.mealType.includes(meal)))
  const visible = mealType === 'all' ? recipes : recipes.filter((r) => r.mealType.includes(mealType))

  if (recipes.length === 0) {
    return (
      <p className="mt-2 text-sm text-neutral-500">
        No recipe uses this yet. Ingredient lists are being rebuilt from their source pages a few
        recipes at a time.
      </p>
    )
  }

  return (
    <div className="mt-2">
      {present.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {(['all', ...present] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mealType === option}
              onClick={() => setMealType(option)}
              className={`min-h-11 rounded-full border px-4 text-sm capitalize ${
                mealType === option
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-3 space-y-2">
        {visible.map((recipe) => (
          <li key={recipe.id} className="rounded-lg border border-neutral-200 p-3">
            <p className="font-medium">{recipe.title}</p>
            <p className="mt-1 text-sm text-neutral-600">
              {/* capitalize sits on the words, not the line: "40 min" is not a proper noun. */}
              <span className="capitalize">
                {recipe.mealType.join(', ')} · {recipe.effort}
              </span>
              {recipe.timeMinutes !== undefined && ` · ${recipe.timeMinutes} min`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The combine control's room in the layout, held from step one so that step 5
 * drops logic into a space that already exists rather than reflowing the panel.
 */
function CombinePlaceholder({ name }: { name: string }) {
  return (
    <section
      aria-label="Combine"
      className="rounded-lg border border-dashed border-neutral-300 p-4"
    >
      <h3 className="text-sm font-semibold text-neutral-900">Combine with</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Pick another ingredient in season this month to see what it shares with {name}. Coming in a
        later step.
      </p>
      <div className="mt-3 flex gap-2">
        <span className="h-11 flex-1 rounded-full bg-neutral-100" aria-hidden />
        <span className="h-11 flex-1 rounded-full bg-neutral-100" aria-hidden />
      </div>
    </section>
  )
}
