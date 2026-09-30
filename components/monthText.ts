/**
 * How a choice of months is put into words: the page heading, the sentence
 * under it, and a card over several months. The season arithmetic is
 * lib/season/'s; this only names what it decided.
 */
import { MONTH_NAMES, monthShort } from '@/lib/months'
import { selectionSeason } from '@/lib/season/selection'
import { UI, text } from '@/lib/strings'
import type { Month } from '@/lib/types'

/** "October", "October and November", "October, November and December". */
export function joinList(words: string[]): string {
  if (words.length < 2) return words.join('')
  return `${words.slice(0, -1).join(', ')} ${text(UI.monthRow.and)} ${words[words.length - 1]}`
}

/** A whole season is named as the season; any other set lists its months. */
export function monthsHeading(months: Month[]): { title: string; capitalize: boolean } {
  const season = selectionSeason(months)
  if (season) return { title: season, capitalize: true }
  return { title: joinList(months.map((month) => MONTH_NAMES[month])), capitalize: false }
}

/** "this month", "in March", "in autumn", "in October and November". */
export function monthsPhrase(months: Month[], today: Month): string {
  if (months.length === 1 && months[0] === today) return text(UI.monthRow.thisMonth)
  const season = selectionSeason(months)
  return `in ${season ?? joinList(months.map((month) => MONTH_NAMES[month]))}`
}

/** "fresh Oct · storage Nov", for a card when several months are chosen. */
export function monthsAvailable(fresh: Month[], storage: Month[]): string {
  const parts: string[] = []
  if (fresh.length > 0) parts.push(`fresh ${fresh.map(monthShort).join(', ')}`)
  if (storage.length > 0) parts.push(`storage ${storage.map(monthShort).join(', ')}`)
  return parts.join(' · ')
}
