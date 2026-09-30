/**
 * The months chosen in the row of months, as the address holds them
 * (`?months=10,11`), and the few operations the row performs on them.
 *
 * A choice is never empty: something is always shown, so a missing or broken
 * value falls back to a month rather than to nothing.
 */
import { CALENDAR_SEASONS, type SeasonName } from './availability'
import type { Month } from '@/lib/types'

function isMonth(value: number): value is Month {
  return Number.isInteger(value) && value >= 1 && value <= 12
}

/**
 * Chosen months in the order they are named: calendar order, except that a run
 * of months through the new year comes first, so December to February reads
 * as winter does rather than as "January, February and December". Choosing
 * all twelve is calendar order.
 */
export function orderMonths(months: Month[]): Month[] {
  const sorted = [...new Set(months)].sort((a, b) => a - b)
  const chosen = new Set<number>(sorted)
  if (!chosen.has(12) || !chosen.has(1) || chosen.size === 12) return sorted
  let start = 12
  while (chosen.has(start - 1)) start--
  return [...sorted.filter((month) => month >= start), ...sorted.filter((month) => month < start)]
}

/**
 * The `months` query value, read leniently: anything that is not a month is
 * dropped, and if nothing is left the choice is `fallback`, today's month.
 */
export function parseMonths(value: string | string[] | undefined, fallback: Month): Month[] {
  const raw = Array.isArray(value) ? value.join(',') : (value ?? '')
  const months = raw
    .split(',')
    .filter((part) => part.trim() !== '')
    .map(Number)
    .filter(isMonth)
  return months.length > 0 ? orderMonths(months) : [fallback]
}

/** The query value for a choice, the inverse of parseMonths. */
export function formatMonths(months: Month[]): string {
  return orderMonths(months).join(',')
}

/** Tapping a month adds it, or takes it out again, unless it is the last one. */
export function toggleMonth(months: Month[], month: Month): Month[] {
  if (!months.includes(month)) return orderMonths([...months, month])
  if (months.length === 1) return months
  return orderMonths(months.filter((chosen) => chosen !== month))
}

export function seasonMonths(season: SeasonName): Month[] {
  return CALENDAR_SEASONS.find((entry) => entry.name === season)!.months
}

/** The season whose three months are exactly the choice, if there is one. */
export function selectionSeason(months: Month[]): SeasonName | undefined {
  const chosen = new Set(months)
  return CALENDAR_SEASONS.find(
    (season) => season.months.length === chosen.size && season.months.every((m) => chosen.has(m)),
  )?.name
}
