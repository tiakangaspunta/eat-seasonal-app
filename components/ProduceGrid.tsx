'use client'

import { useState } from 'react'

import type { Category } from '@/lib/types'

export type HomeIngredient = {
  id: string
  name: string
  category: Category
  domesticStatus: 'fresh' | 'storage' | 'unavailable'
  importedStatus: 'available' | 'unavailable'
  seasonLabel?: string
  unverified: boolean
}

const CATEGORY_ORDER: { category: Category; heading: string }[] = [
  { category: 'vegetable', heading: 'Vegetables' },
  { category: 'fruit', heading: 'Fruit' },
  { category: 'berry', heading: 'Berries' },
  { category: 'mushroom', heading: 'Mushrooms' },
  { category: 'herb', heading: 'Herbs' },
]

function isVisible(ingredient: HomeIngredient, includeImported: boolean): boolean {
  if (ingredient.domesticStatus !== 'unavailable') return true
  return includeImported && ingredient.importedStatus === 'available'
}

export function ProduceGrid({ ingredients }: { ingredients: HomeIngredient[] }) {
  const [includeImported, setIncludeImported] = useState(false)

  const visible = ingredients.filter((i) => isVisible(i, includeImported))

  return (
    <div>
      <label className="flex min-h-11 w-fit items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={includeImported}
          onChange={(e) => setIncludeImported(e.target.checked)}
        />
        Include imported produce
      </label>

      <div className="mt-6 space-y-10">
        {CATEGORY_ORDER.map(({ category, heading }) => {
          const items = visible.filter((i) => i.category === category)
          if (items.length === 0) return null

          return (
            <section key={category}>
              <h2 className="text-lg font-semibold">{heading}</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map((ingredient) => (
                  <IngredientCard key={ingredient.id} ingredient={ingredient} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function IngredientCard({ ingredient }: { ingredient: HomeIngredient }) {
  const statusLabel =
    ingredient.domesticStatus === 'fresh'
      ? 'Fresh'
      : ingredient.domesticStatus === 'storage'
        ? 'From storage'
        : 'Imported'

  return (
    <div className="rounded-lg border border-neutral-200 p-3">
      <div className="aspect-square w-full rounded-md bg-neutral-100" aria-hidden />
      <div className="mt-2 flex items-start justify-between gap-2">
        <span className="font-medium">{ingredient.name}</span>
        {ingredient.unverified && (
          <span
            className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
            title="This season data is drafted, not yet confirmed"
          >
            unverified
          </span>
        )}
      </div>
      <div className="mt-1 text-sm text-neutral-600">
        {ingredient.seasonLabel && <span className="capitalize">{ingredient.seasonLabel}</span>}
        {ingredient.seasonLabel && ' · '}
        {statusLabel}
      </div>
    </div>
  )
}
