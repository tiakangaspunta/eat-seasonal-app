import { describe, expect, it } from 'vitest'

import { domesticAvailability, importedAvailability, originIn, seasonLabel } from './availability'
import type { Ingredient } from '@/lib/types'

function fixture(overrides: Partial<Ingredient> = {}): Ingredient {
  return {
    id: 'fixture',
    name: 'Fixture',
    category: 'vegetable',
    availability: {},
    verified: true,
    similarTo: [],
    ...overrides,
  }
}

describe('domestic availability', () => {
  it('is fresh in a month the ingredient is picked fresh in Finland', () => {
    const carrot = fixture({
      availability: {
        domestic: { freshMonths: [6, 7, 8], storageMonths: [] },
      },
    })
    expect(domesticAvailability(carrot, 7)).toBe('fresh')
  })

  it('is storage, not fresh, in a month only Finnish storage covers', () => {
    const cabbage = fixture({
      availability: {
        domestic: { freshMonths: [8, 9], storageMonths: [10, 11, 12, 1, 2, 3] },
      },
    })
    expect(domesticAvailability(cabbage, 2)).toBe('storage')
  })

  it('is unavailable in a month covered by neither fresh nor storage', () => {
    const carrot = fixture({
      availability: {
        domestic: { freshMonths: [6, 7, 8], storageMonths: [9, 10] },
      },
    })
    expect(domesticAvailability(carrot, 3)).toBe('unavailable')
  })

  it('is unavailable when the ingredient has no domestic availability at all', () => {
    const lemon = fixture({ availability: { imported: { months: [1, 2, 3] } } })
    expect(domesticAvailability(lemon, 2)).toBe('unavailable')
  })
})

describe('imported availability, independent of domestic', () => {
  it('reads imported stock as available even when domestic is in storage that month', () => {
    const apple = fixture({
      availability: {
        domestic: { freshMonths: [9], storageMonths: [10, 11, 12, 1, 2] },
        imported: { months: [1, 2] },
      },
    })
    expect(domesticAvailability(apple, 1)).toBe('storage')
    expect(importedAvailability(apple, 1)).toBe('available')
  })

  it('reads imported stock as unavailable outside its months, even when domestic is fresh', () => {
    const apple = fixture({
      availability: {
        domestic: { freshMonths: [9], storageMonths: [] },
        imported: { months: [1, 2] },
      },
    })
    expect(domesticAvailability(apple, 9)).toBe('fresh')
    expect(importedAvailability(apple, 9)).toBe('unavailable')
  })
})

describe('where the produce in a month comes from', () => {
  it('is domestic when Finland has it fresh', () => {
    const carrot = fixture({
      availability: { domestic: { freshMonths: [8, 9], storageMonths: [] } },
    })
    expect(originIn(carrot, 9)).toEqual({ origin: 'domestic', countries: [] })
  })

  it('is still domestic when Finland only has it in storage', () => {
    const cabbage = fixture({
      availability: { domestic: { freshMonths: [8, 9], storageMonths: [1, 2] } },
    })
    expect(originIn(cabbage, 2).origin).toBe('domestic')
  })

  it('prefers domestic over imported in a month that has both', () => {
    // The point of the app: if Finland has it, that is where it is from.
    const apple = fixture({
      availability: {
        domestic: { freshMonths: [9], storageMonths: [] },
        imported: { months: [9], origins: [{ months: [9], countries: ['Italy'] }] },
      },
    })
    expect(originIn(apple, 9)).toEqual({ origin: 'domestic', countries: [] })
  })

  it('names the countries an imported-only month is sourced from', () => {
    const lemon = fixture({
      availability: {
        imported: { months: [2], origins: [{ months: [2], countries: ['Spain', 'Italy'] }] },
      },
    })
    expect(originIn(lemon, 2)).toEqual({ origin: 'imported', countries: ['Spain', 'Italy'] })
  })

  it('gives each month its own countries, since origin rotates with the season', () => {
    // Avocado, from satokausi.fi: a different half of the world in September
    // than in the spring. One list per ingredient would be wrong half the year.
    const avocado = fixture({
      availability: {
        imported: {
          months: [1, 2, 9],
          origins: [
            { months: [1, 2], countries: ['Spain', 'Peru'] },
            { months: [9], countries: ['Spain', 'Kenya'] },
          ],
        },
      },
    })
    expect(originIn(avocado, 2).countries).toEqual(['Spain', 'Peru'])
    expect(originIn(avocado, 9).countries).toEqual(['Spain', 'Kenya'])
  })

  it('says imported with no country when no country is recorded', () => {
    // The honest state of much of the data: we know it is imported, no source
    // settled where from, and a guessed country would be worse than none.
    const mango = fixture({ availability: { imported: { months: [2] } } })
    expect(originIn(mango, 2)).toEqual({ origin: 'imported', countries: [] })
  })

  it('says imported with no country for a month the origins do not cover', () => {
    const mango = fixture({
      availability: { imported: { months: [2, 9], origins: [{ months: [9], countries: ['Spain'] }] } },
    })
    expect(originIn(mango, 2).countries).toEqual([])
    expect(originIn(mango, 9).countries).toEqual(['Spain'])
  })

  it('is nowhere in a month neither domestic nor imported covers', () => {
    const lemon = fixture({ availability: { imported: { months: [2] } } })
    expect(originIn(lemon, 7).origin).toBe('none')
  })
})

describe('season label', () => {
  it('names a single calendar season for a fixture that stays inside it', () => {
    expect(seasonLabel([6, 7, 8])).toBe('summer')
  })

  it('joins two calendar seasons in month order for a fixture spanning both', () => {
    expect(seasonLabel([2, 3, 4])).toBe('winter–spring')
  })
})
