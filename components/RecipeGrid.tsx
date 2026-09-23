'use client'

import { useRef } from 'react'

import { MEAL_TYPE_HEADING, MEAL_TYPE_ORDER } from '@/components/labels'
import { RecipePanel } from '@/components/RecipePanel'
import type { RecipeViewItem } from '@/components/types'
import { useOpenParam } from '@/components/useOpenParam'

/**
 * The recipe view: every recipe, in meal-type sections, opening in the side
 * panel. A recipe with two meal types sits in both sections, since a soup that
 * is lunch and dinner should be found by someone looking for either.
 */
export function RecipeGrid({ recipes }: { recipes: RecipeViewItem[] }) {
  const [selectedId, setSelectedId] = useOpenParam()
  // Where focus goes when the panel closes: back to the card that opened it.
  const opener = useRef<HTMLElement | null>(null)

  const selected = recipes.find((recipe) => recipe.id === selectedId)

  const open = (id: string, element: HTMLElement) => {
    opener.current = element
    setSelectedId(id)
  }

  const close = () => {
    setSelectedId(null)
    opener.current?.focus()
  }

  return (
    <div>
      <div className="space-y-10">
        {MEAL_TYPE_ORDER.map((mealType) => {
          const items = recipes.filter((recipe) => recipe.mealType.includes(mealType))
          if (items.length === 0) return null

          return (
            <section key={mealType}>
              <h2 className="text-lg font-semibold">{MEAL_TYPE_HEADING[mealType]}</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    selected={recipe.id === selectedId}
                    onOpen={open}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {selected && <RecipePanel key={selected.id} recipe={selected} onClose={close} />}
    </div>
  )
}

function RecipeCard({
  recipe,
  selected,
  onOpen,
}: {
  recipe: RecipeViewItem
  selected: boolean
  onOpen: (id: string, element: HTMLElement) => void
}) {
  return (
    <button
      type="button"
      onClick={(event) => onOpen(recipe.id, event.currentTarget)}
      aria-expanded={selected}
      className={`flex min-h-11 w-full flex-col items-start rounded-lg border p-3 text-left ${
        selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200'
      }`}
    >
      <span className="font-medium">{recipe.title}</span>
      <span className="mt-1 text-sm text-neutral-600">
        <span className="capitalize">{recipe.effort}</span>
        {recipe.timeMinutes !== undefined && ` · ${recipe.timeMinutes} min`}
      </span>
      {recipe.tags.length > 0 && (
        <span className="mt-2 flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              {tag}
            </span>
          ))}
        </span>
      )}
      {recipe.inSeason.length > 0 && (
        <span className="mt-2 flex items-start gap-1.5 text-sm text-emerald-800">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
          <span>In season: {recipe.inSeason.map((ingredient) => ingredient.name).join(', ')}</span>
        </span>
      )}
      {recipe.lines.length === 0 && (
        <span className="mt-2 text-xs text-neutral-500">Ingredient list not added yet</span>
      )}
    </button>
  )
}
