import Link from 'next/link'

export type View = 'ingredients' | 'recipes'

const VIEWS: { view: View; href: string; label: string }[] = [
  { view: 'ingredients', href: '/', label: 'Ingredients' },
  { view: 'recipes', href: '/recipes', label: 'Recipes' },
]

/**
 * The switch between the two views of the front page. Links, not buttons: each
 * view is its own URL, so the switch is navigation, and the back button and a
 * bookmark both treat it that way.
 */
export function ViewSwitch({ current }: { current: View }) {
  return (
    <nav aria-label="View" className="inline-flex rounded-full border border-neutral-300 p-1">
      {VIEWS.map(({ view, href, label }) => (
        <Link
          key={view}
          href={href}
          aria-current={view === current ? 'page' : undefined}
          className={`flex min-h-11 items-center rounded-full px-5 text-sm font-medium ${
            view === current ? 'bg-neutral-900 text-white' : 'text-neutral-700'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
