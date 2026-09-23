/**
 * Month names for display, in one place.
 *
 * The home heading, the ingredient panel's twelve-month bar, and later the
 * month strip all name months, and the Finnish step has to translate them
 * exactly once rather than in three components.
 */
import type { Month } from '@/lib/types'

export const MONTHS: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const MONTH_NAMES: Record<Month, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

/** The single letter shown in the twelve-month bar, where a name will not fit. */
export function monthInitial(month: Month): string {
  return MONTH_NAMES[month].charAt(0)
}

/**
 * Today's month. Only meaningful at request time: a page calling this has to
 * `await connection()` first, or a production build would prerender it once
 * and show the month it was built in forever.
 */
export function currentMonth(): Month {
  return (new Date().getMonth() + 1) as Month
}
