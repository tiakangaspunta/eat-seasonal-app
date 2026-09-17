/**
 * Display order, in one place.
 *
 * Lists are ordered by what is written on them, not by the id underneath.
 * Ids stay English slugs forever (`chicory`, `chioggia-beetroot`), so once a
 * name is renamed to Finnish, sorting by id puts Salaattisikuri between
 * Cauliflower and Cucumber, which reads as no order at all. Renaming something
 * moves it, which is the intended behaviour: Tia's call on 2026-09-17.
 *
 * Finnish collation, not English: å, ä and ö sort after z rather than beside a
 * and o, and a mixed English-and-Finnish list is still mostly a Finnish one. A
 * plain `.sort()` would be wrong twice over, putting every capital before every
 * lowercase letter and every accented letter after both.
 */
const collator = new Intl.Collator('fi', { sensitivity: 'base', numeric: true })

/** Compares two display strings. Pass straight to `.sort()`. */
export const compareNames = (a: string, b: string): number => collator.compare(a, b)

/** Sorts a copy by whatever each item is called on screen. */
export function sortByName<T>(items: readonly T[], nameOf: (item: T) => string): T[] {
  return [...items].sort((a, b) => compareNames(nameOf(a), nameOf(b)))
}
