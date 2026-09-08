'use client'

import { useRef, useState } from 'react'

import { IngredientPanel } from '@/components/IngredientPanel'
import { OriginTag } from '@/components/OriginTag'
import type { HomeIngredient } from '@/components/types'
import type { Category, Month } from '@/lib/types'

export type { HomeIngredient } from '@/components/types'

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

export function ProduceGrid({
  ingredients,
  month,
}: {
  ingredients: HomeIngredient[]
  month: Month
}) {
  const [includeImported, setIncludeImported] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // Where focus goes when the panel closes: back to the card that opened it,
  // so keyboard use does not restart at the top of the grid.
  const opener = useRef<HTMLElement | null>(null)

  const visible = ingredients.filter((i) => isVisible(i, includeImported))
  const selected = ingredients.find((i) => i.id === selectedId)

  const open = (id: string, element: HTMLElement | null) => {
    if (element) opener.current = element
    setSelectedId(id)
  }

  const close = () => {
    setSelectedId(null)
    opener.current?.focus()
  }

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
              <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    selected={ingredient.id === selectedId}
                    onOpen={open}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {selected && (
        <IngredientPanel
          key={selected.id}
          ingredient={selected}
          month={month}
          onClose={close}
          onSelectIngredient={(id) => setSelectedId(id)}
        />
      )}
    </div>
  )
}

function IngredientCard({
  ingredient,
  selected,
  onOpen,
}: {
  ingredient: HomeIngredient
  selected: boolean
  onOpen: (id: string, element: HTMLElement | null) => void
}) {
  // Fresh or from storage is a claim about Finnish produce. An imported card
  // has neither, and the origin tag carries the whole answer there.
  const statusLabel =
    ingredient.domesticStatus === 'fresh'
      ? 'Fresh'
      : ingredient.domesticStatus === 'storage'
        ? 'From storage'
        : undefined

  return (
    <button
      type="button"
      onClick={(event) => onOpen(ingredient.id, event.currentTarget)}
      aria-expanded={selected}
      className={`relative rounded-lg border p-3 text-left ${
        selected ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200'
      }`}
    >
      {/* 4:3, not a square: a square photo slot makes the card taller than the
          screen can show many of, and produce photos are wider than they are
          tall anyway. The badge sits in its corner rather than beside the name,
          which at two columns on a phone left neither of them room. */}
      <div className="aspect-[4/3] w-full rounded-md bg-neutral-100" aria-hidden />
      <div className="mt-2 font-medium">{ingredient.name}</div>
      {/* Positioned over the photo, but written after the name so the card
          still reads "Garlic, unverified" rather than the other way round. */}
      {ingredient.unverified && (
        <span
          className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
          title="This season data is drafted, not yet confirmed"
        >
          unverified
        </span>
      )}
      <div className="mt-1.5">
        <OriginTag origin={ingredient.origin} countries={ingredient.countries} />
      </div>
      {statusLabel && (
        <div className="mt-1.5 text-sm text-neutral-600">
          {ingredient.seasonLabel && <span className="capitalize">{ingredient.seasonLabel}</span>}
          {ingredient.seasonLabel && ' · '}
          {statusLabel}
        </div>
      )}
    </button>
  )
}
