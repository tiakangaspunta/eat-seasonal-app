import { describe, expect, it } from 'vitest'

import { domesticAvailability, importedAvailability, seasonLabel } from './availability'
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

describe('season label', () => {
  it('names a single calendar season for a fixture that stays inside it', () => {
    expect(seasonLabel([6, 7, 8])).toBe('summer')
  })

  it('joins two calendar seasons in month order for a fixture spanning both', () => {
    expect(seasonLabel([2, 3, 4])).toBe('winter–spring')
  })
})
