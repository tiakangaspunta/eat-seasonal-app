import type { Ingredient, Month } from '@/lib/types'

export type DomesticAvailability = 'fresh' | 'storage' | 'unavailable'

export function domesticAvailability(ingredient: Ingredient, month: Month): DomesticAvailability {
  const domestic = ingredient.availability.domestic
  if (domestic?.freshMonths.includes(month)) return 'fresh'
  if (domestic?.storageMonths.includes(month)) return 'storage'
  return 'unavailable'
}

export type ImportedAvailability = 'available' | 'unavailable'

export function importedAvailability(ingredient: Ingredient, month: Month): ImportedAvailability {
  const imported = ingredient.availability.imported
  return imported?.months.includes(month) ? 'available' : 'unavailable'
}

const CALENDAR_SEASONS: { name: string; months: Month[] }[] = [
  { name: 'winter', months: [12, 1, 2] },
  { name: 'spring', months: [3, 4, 5] },
  { name: 'summer', months: [6, 7, 8] },
  { name: 'autumn', months: [9, 10, 11] },
]

function seasonOf(month: Month): string {
  return CALENDAR_SEASONS.find((season) => season.months.includes(month))!.name
}

/** Names, in month order, the calendar season(s) a set of fresh months falls in. */
export function seasonLabel(freshMonths: Month[]): string {
  const names: string[] = []
  for (const month of freshMonths) {
    const name = seasonOf(month)
    if (names[names.length - 1] !== name) names.push(name)
  }
  return names.join('–')
}
