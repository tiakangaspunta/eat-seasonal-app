'use client'

import { useState } from 'react'

import type { PhotoDecision, SheetRow } from '@/lib/data/photos'

/**
 * One row per ingredient, every candidate photo in it, approve by clicking one.
 *
 * `docs/PLAN.md` section 6: images are approved before they enter the project.
 * This is the approving. Clicking a tile records a decision in
 * `scripts/photo-approvals.json` and nothing else — no image is downloaded and
 * no ingredient file is touched until `scripts/download-approved.mjs` is run
 * deliberately from the terminal.
 *
 * Tiles are plain `<img>` rather than `next/image`, because these are remote
 * thumbnails from two APIs on a page that exists only in development. Teaching
 * the production image config about Commons and Openverse would be configuring
 * production for something production does not have.
 */
export type SheetIngredient = SheetRow

type Saving = 'idle' | 'saving' | 'failed'

export function ContactSheet({
  ingredients,
  initialDecisions,
}: {
  ingredients: SheetIngredient[]
  initialDecisions: Record<string, PhotoDecision>
}) {
  const [decisions, setDecisions] = useState(initialDecisions)
  const [saving, setSaving] = useState<Record<string, Saving>>({})

  const reviewed = ingredients.filter((ingredient) => ingredient.id in decisions).length
  const approved = ingredients.filter((ingredient) => decisions[ingredient.id]).length

  async function decide(id: string, decision: PhotoDecision) {
    // Shown as chosen straight away. The sheet is a long scroll and waiting for
    // a round trip before the tile changes would make it feel broken.
    const previous = decisions[id]
    setDecisions((current) => ({ ...current, [id]: decision }))
    setSaving((current) => ({ ...current, [id]: 'saving' }))

    try {
      const response = await fetch('/api/photos/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setSaving((current) => ({ ...current, [id]: 'idle' }))
    } catch {
      // Put it back. A decision that looks saved but is not would send the
      // download step after the wrong photo, or after none at all.
      setDecisions((current) => ({ ...current, [id]: previous }))
      setSaving((current) => ({ ...current, [id]: 'failed' }))
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Photo contact sheet</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Pick one photo per ingredient, or say none of these. Nothing is downloaded until you
          approve it here and the download step is run.
        </p>
        <p className="mt-2 text-sm font-medium text-neutral-900">
          {reviewed} of {ingredients.length} reviewed, {approved} approved
        </p>
      </header>

      <ol className="space-y-8">
        {ingredients.map((ingredient) => {
          const decision = decisions[ingredient.id]
          const isReviewed = ingredient.id in decisions
          const state = saving[ingredient.id] ?? 'idle'

          // Re-searching a row can replace the very photo Tia approved from it,
          // which would otherwise leave the row saying "approved" with nothing
          // highlighted. The old choice stays on the row, first and labelled, so
          // it can be compared against what the repaired search found and either
          // kept or clicked away.
          const stillOffered = ingredient.candidates.some(
            (candidate) => candidate.fullUrl === decision?.fullUrl,
          )
          const tiles = decision && !stillOffered ? [decision, ...ingredient.candidates] : ingredient.candidates

          return (
            <li key={ingredient.id} className="border-t border-neutral-200 pt-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-base font-semibold text-neutral-900">{ingredient.name}</h2>
                <span className="text-xs text-neutral-500">searched &ldquo;{ingredient.term}&rdquo;</span>
                {isReviewed && (
                  <span className="text-xs font-medium text-green-700">
                    {decision ? 'approved' : 'none of these'}
                  </span>
                )}
                {state === 'failed' && (
                  <span className="text-xs font-medium text-red-700">
                    Could not save. Is the dev server still running?
                  </span>
                )}
              </div>

              {/*
                A half-blind row is the one failure that does not look like a
                failure: four tiles, all from whichever search survived, and the
                two searches are wrong in opposite directions. Saying so above
                the tiles is the difference between choosing and settling.
              */}
              {ingredient.partial && (
                <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
                  Only one of two searches ran, so these four are all from the same search and may
                  all be wrong in the same way. Re-run the candidate script to repair this row.
                </p>
              )}

              {ingredient.notes.map((note) => (
                <p key={note} className="mt-1 text-sm text-amber-800">
                  {note}
                </p>
              ))}

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tiles.map((candidate) => {
                  const chosen = decision?.fullUrl === candidate.fullUrl
                  const carriedOver = chosen && !stillOffered
                  return (
                    <figure key={candidate.fullUrl} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => decide(ingredient.id, chosen ? null : candidate)}
                        aria-pressed={chosen}
                        className={`block overflow-hidden rounded-lg border-4 ${
                          chosen ? 'border-green-600' : 'border-transparent hover:border-neutral-300'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={candidate.thumbUrl}
                          alt={`Candidate photo for ${ingredient.name}: ${candidate.title}`}
                          loading="lazy"
                          className="h-40 w-full bg-neutral-100 object-cover"
                        />
                      </button>
                      <figcaption className="mt-1 text-xs leading-snug text-neutral-600">
                        {carriedOver && (
                          <span className="block font-medium text-amber-900">
                            Your earlier choice, no longer found by this search
                          </span>
                        )}
                        <span className="block truncate font-medium text-neutral-800" title={candidate.title}>
                          {candidate.title}
                        </span>
                        <span className="block">{candidate.license}</span>
                        <span className="block truncate" title={candidate.author}>
                          {candidate.author}
                        </span>
                        <a
                          href={candidate.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex min-h-[44px] items-center underline"
                        >
                          {candidate.source}
                        </a>
                      </figcaption>
                    </figure>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => decide(ingredient.id, null)}
                className={`mt-3 inline-flex min-h-[44px] items-center rounded-lg border px-4 text-sm ${
                  isReviewed && !decision
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-700'
                }`}
              >
                None of these
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
