/**
 * Where every photo in the app came from.
 *
 * `docs/PLAN.md` section 6: every image carries its attribution in the data,
 * and an attribution list is rendered somewhere in the app. This is that list,
 * and it is a real page in a production build, because that is the point of it.
 *
 * It is derived from the ingredient data, never maintained by hand, so a photo
 * cannot be in the app without appearing here.
 */
import Link from 'next/link'

import { getIngredients } from '@/lib/data/ingredients'

export const metadata = { title: 'Photo credits' }

export default function CreditsPage() {
  const credited = getIngredients()
    .filter((ingredient) => ingredient.image)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold text-neutral-900">Photo credits</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Every photo in this app, with its author and licence.
      </p>

      {credited.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-700">No photos yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200">
          {credited.map((ingredient) => (
            <li key={ingredient.id} className="py-3 text-sm">
              <span className="font-medium text-neutral-900">{ingredient.name}</span>
              <span className="mt-0.5 block text-neutral-600">
                {ingredient.image!.author}, {ingredient.image!.license} &middot;{' '}
                <a
                  href={ingredient.image!.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  source
                </a>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center text-sm text-neutral-700 underline"
      >
        Back to what is in season
      </Link>
    </main>
  )
}
