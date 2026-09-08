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

export type Origin = {
  origin: 'domestic' | 'imported' | 'none'
  /** Country names, only ever the ones recorded in the data. */
  countries: string[]
}

/**
 * Where an ingredient in a given month comes from.
 *
 * Domestic wins whenever Finland has it, fresh or from storage, since that is
 * the produce the app is for. Countries are returned only for an imported
 * month, and only when the data records them.
 */
export function originIn(ingredient: Ingredient, month: Month): Origin {
  if (domesticAvailability(ingredient, month) !== 'unavailable') {
    return { origin: 'domestic', countries: [] }
  }
  if (importedAvailability(ingredient, month) === 'available') {
    const origins = ingredient.availability.imported?.origins ?? []
    const forMonth = origins.find((entry) => entry.months.includes(month))
    return { origin: 'imported', countries: forMonth?.countries ?? [] }
  }
  return { origin: 'none', countries: [] }
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
