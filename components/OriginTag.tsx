/**
 * Where an ingredient comes from this month, as a tag.
 *
 * Shown on every card, not only on imported ones: with the imported toggle on,
 * a grid where only some cards are labelled makes the unlabelled ones ambiguous
 * rather than obviously Finnish.
 *
 * The country names come from the data and are never inferred. An imported
 * ingredient with no recorded country reads "Imported", which is all the month
 * data actually claims.
 */
export function OriginTag({
  origin,
  countries,
  showCountries = false,
}: {
  origin: 'domestic' | 'imported' | 'none'
  countries: string[]
  /**
   * Cards say only "Imported": a grid of forty is scanned, and orange alone
   * brings six countries. The panel, which is read rather than scanned, opts in
   * and lists them all.
   */
  showCountries?: boolean
}) {
  if (origin === 'none') return null

  // One colour scheme across the app: green and amber are Finnish produce,
  // fresh and stored, and blue is everything grown somewhere else. The twelve
  // month bar in the panel uses the same three.
  if (origin === 'domestic') {
    return (
      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-900">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden />
        Finnish
      </span>
    )
  }

  // items-start and a max width, not items-center: with a country list the tag
  // can run to two lines on a narrow card, and the dot should stay on the first.
  return (
    <span className="inline-flex max-w-full items-start gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-left text-xs font-medium text-blue-900">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
      {showCountries && countries.length > 0 ? `Imported · ${countries.join(', ')}` : 'Imported'}
    </span>
  )
}
