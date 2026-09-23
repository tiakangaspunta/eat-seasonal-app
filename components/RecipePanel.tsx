'use client'

import Link from 'next/link'

import { EditableName } from '@/components/EditableName'
import { SUBSTITUTION_REASON_LABEL, formatQuantity } from '@/components/labels'
import { SidePanel } from '@/components/SidePanel'
import type { RecipeLine, RecipeName, RecipeViewItem } from '@/components/types'

/**
 * The recipe side panel, in the recipe view: the ingredient list with its
 * swaps under each line, personal notes, and the link to the method. The
 * method itself is never copied in (docs/PLAN.md section 3), so the link is
 * the most prominent thing here after the title.
 *
 * Seasonal ingredients are links into the ingredient view, which opens with
 * that ingredient's panel showing.
 */
export function RecipePanel({ recipe, onClose }: { recipe: RecipeViewItem; onClose: () => void }) {
  const facts = [
    recipe.mealType.join(', '),
    recipe.effort,
    recipe.timeMinutes !== undefined ? `${recipe.timeMinutes} min` : undefined,
    recipe.servings !== undefined ? `serves ${recipe.servings}` : undefined,
  ].filter(Boolean)

  return (
    <SidePanel
      label={`${recipe.title} recipe`}
      focusKey={recipe.id}
      onClose={onClose}
      header={
        <>
          <h2>
            <EditableName kind="recipe" id={recipe.id} name={recipe.title} className="text-xl font-semibold" />
          </h2>
          {/* First letter only: "40 min" and "serves 6" are not proper nouns. */}
          <p className="mt-1 text-sm text-neutral-500 first-letter:uppercase">{facts.join(' · ')}</p>
          {recipe.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      }
    >
      {recipe.source ? (
        <a
          href={recipe.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 text-center text-sm font-medium text-white"
        >
          Open the method on {recipe.source.name}
          {/* Drawn, not the ↗ character: some systems render that as a coloured emoji. */}
          <svg aria-hidden viewBox="0 0 16 16" className="ml-2 h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 11 11 5M6 5h5v5" />
          </svg>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <p className="text-sm text-neutral-500">No source recorded for this recipe.</p>
      )}

      {recipe.inSeason.length > 0 && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          In season this month: {recipe.inSeason.map((ingredient) => ingredient.name).join(', ')}
        </p>
      )}

      {recipe.ownNotes && (
        <section>
          <h3 className="text-sm font-semibold text-neutral-900">Notes</h3>
          <p className="mt-1 whitespace-pre-line text-sm text-neutral-700">{recipe.ownNotes}</p>
        </section>
      )}

      <section>
        <h3 className="text-sm font-semibold text-neutral-900">Ingredients</h3>
        {recipe.lines.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">
            The ingredient list has not been added from the source page yet. The method link has it.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-neutral-100">
            {recipe.lines.map((line, index) => (
              <IngredientLine key={index} line={line} />
            ))}
          </ul>
        )}
      </section>
    </SidePanel>
  )
}

function IngredientLine({ line }: { line: RecipeLine }) {
  const amount = [line.quantity !== undefined ? formatQuantity(line.quantity) : undefined, line.unit]
    .filter(Boolean)
    .join(' ')

  return (
    <li className="py-2 text-sm">
      <div className="flex min-h-11 items-center gap-2">
        {amount && <span className="w-20 shrink-0 text-neutral-500">{amount}</span>}
        <span className="min-w-0">
          <NameOrLink name={line} />
          {line.optional && <span className="ml-1.5 text-neutral-500">(optional)</span>}
        </span>
      </div>

      {line.substitutions.length > 0 && (
        <ul className="mb-1 ml-2 mt-1 space-y-2 border-l-2 border-emerald-200 pl-3">
          {line.substitutions.map((substitution, index) => (
            <li key={index}>
              <div className="flex flex-wrap items-center gap-x-2">
                <span className="text-neutral-500">or</span>
                <NameOrLink name={substitution} />
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                  {SUBSTITUTION_REASON_LABEL[substitution.reason]}
                </span>
                {substitution.ratio && <span className="text-xs text-neutral-500">{substitution.ratio}</span>}
              </div>
              {substitution.note && <p className="mt-1 text-neutral-600">{substitution.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** A seasonal ingredient is a link to its card in the ingredient view; anything else is text. */
function NameOrLink({ name }: { name: RecipeName }) {
  if (!name.linkId) return <span>{name.name}</span>
  return (
    <Link
      href={`/?open=${name.linkId}`}
      className="inline-flex min-h-11 items-center font-medium underline decoration-neutral-300 underline-offset-2"
    >
      {name.name}
    </Link>
  )
}
