/**
 * The photo contact sheet, in development only.
 *
 * `page.dev.tsx` rather than `page.tsx`, so `next.config.ts` leaves it out of a
 * production build entirely: `/photos` is a 404 in production, like any path
 * that was never defined. It is a working surface for reviewing candidates, not
 * part of the app Tia uses to decide what to cook.
 *
 * Candidates come from `scripts/photo-candidates.json`, written by
 * `scripts/photo-candidates.mjs`. Run that first; this page says so if it is
 * missing rather than rendering an empty list.
 */
import { ContactSheet } from '@/components/ContactSheet'
import { readApprovals, readCandidates } from '@/lib/data/photos'

export const dynamic = 'force-dynamic'

export default function PhotosPage() {
  const { ingredients, generatedAt } = readCandidates()
  const { decisions } = readApprovals()

  if (ingredients.length === 0) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold text-neutral-900">Photo contact sheet</h1>
        <p className="mt-2 text-sm text-neutral-700">
          No candidates yet. Run <code className="rounded bg-neutral-100 px-1">node scripts/photo-candidates.mjs --limit 10</code> and
          reload.
        </p>
      </main>
    )
  }

  return (
    <main>
      <ContactSheet ingredients={ingredients} initialDecisions={decisions} />
      <p className="mx-auto w-full max-w-5xl px-4 pb-8 text-xs text-neutral-500">
        Candidates generated {new Date(generatedAt).toLocaleString()}
      </p>
    </main>
  )
}
