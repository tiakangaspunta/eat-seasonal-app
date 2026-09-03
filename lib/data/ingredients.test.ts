/**
 * Not season logic, so not strictly in the tested layer, but the ingredient
 * files are what every later slice reads from and the app writes back into
 * them. This is the load-and-validate check issue 002 asks for, plus the
 * counts-by-category sanity print.
 */
import { describe, expect, it } from 'vitest'

import { countByCategory, getIngredient, getIngredients, parseIngredient } from './ingredients'
import { SEASONAL_CATEGORIES } from '@/lib/types'

describe('ingredient data', () => {
  const ingredients = getIngredients()

  it('loads every file and validates its shape', () => {
    expect(ingredients.length).toBe(124)
  })

  it('prints counts by category', () => {
    const counts = countByCategory()
    // eslint-disable-next-line no-console -- the sanity check the issue asks for
    console.log('ingredients by category:', counts)
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(ingredients.length)
  })

  it('gives every ingredient a unique id and a non-empty name', () => {
    const ids = new Set(ingredients.map((i) => i.id))
    expect(ids.size).toBe(ingredients.length)
    expect(ingredients.every((i) => i.name.trim() !== '')).toBe(true)
  })

  it('keeps every month between 1 and 12', () => {
    const months = ingredients.flatMap((i) => [
      ...(i.availability.domestic?.freshMonths ?? []),
      ...(i.availability.domestic?.storageMonths ?? []),
      ...(i.availability.domestic?.peakMonths ?? []),
      ...(i.availability.imported?.months ?? []),
    ])
    expect(months.every((m) => m >= 1 && m <= 12)).toBe(true)
  })

  it('gives month data only to the seasonal categories', () => {
    const withMonths = ingredients.filter(
      (i) => i.availability.domestic !== undefined || i.availability.imported !== undefined,
    )
    const nonSeasonal = withMonths.filter(
      (i) => !(SEASONAL_CATEGORIES as readonly string[]).includes(i.category),
    )
    expect(nonSeasonal.map((i) => i.id)).toEqual([])
  })

  it('merged the domestic and imported rows for apple onto one ingredient', () => {
    const apple = getIngredient('apple')
    expect(apple?.availability.domestic?.freshMonths).toEqual([1, 2, 9])
    expect(ingredients.filter((i) => i.name === 'Apple')).toHaveLength(1)
  })

  it('marks September drafted wherever it came from satokausi.fi', () => {
    // September is issue 004's slice: sourced, but not yet confirmed by Tia.
    const apple = getIngredient('apple')
    expect(apple?.verified).toBe(true)
    expect(apple?.unverifiedMonths).toEqual([9])
    // An ingredient Tia had already verified for September keeps its clean record.
    expect(getIngredient('funnel-chanterelle')?.unverifiedMonths).toBeUndefined()
  })

  it('carries the false morel warning in the data', () => {
    expect(getIngredient('false-morel')?.warning?.en).toMatch(/toxic/i)
  })

  it('flags drafted origins as unverified', () => {
    const unverified = ingredients.filter((i) => !i.verified).map((i) => i.id).sort()
    expect(unverified).toEqual([
      'bell-pepper', 'black-salsify', 'broccoli', 'chioggia-beetroot',
      'fennel', 'garlic', 'globe-artichoke', 'parsley', 'spaghetti-squash',
      'sprouting-broccoli', 'sweet-potato',
    ])
  })

  it('rejects a file whose id does not match its filename', () => {
    expect(() =>
      parseIngredient(
        { id: 'carrot', name: 'Carrot', category: 'vegetable', availability: {}, verified: true, similarTo: [] },
        'parsnip.json',
      ),
    ).toThrow(/does not match its filename/)
  })

  it('rejects unverifiedMonths on an ingredient that is already unverified', () => {
    expect(() =>
      parseIngredient(
        {
          id: 'carrot', name: 'Carrot', category: 'vegetable', verified: false, similarTo: [],
          availability: {}, unverifiedMonths: [9],
        },
        'carrot.json',
      ),
    ).toThrow(/redundant when verified is false/)
  })

  it('accepts a verified ingredient that lists individual drafted months', () => {
    const ingredient = parseIngredient(
      {
        id: 'carrot', name: 'Carrot', category: 'vegetable', verified: true, similarTo: [],
        availability: { domestic: { freshMonths: [1, 2], storageMonths: [] } },
        unverifiedMonths: [9],
      },
      'carrot.json',
    )
    expect(ingredient.unverifiedMonths).toEqual([9])
  })

  it('rejects a month outside 1 to 12', () => {
    expect(() =>
      parseIngredient(
        {
          id: 'carrot', name: 'Carrot', category: 'vegetable', verified: true, similarTo: [],
          availability: { domestic: { freshMonths: [13], storageMonths: [] } },
        },
        'carrot.json',
      ),
    ).toThrow(/months 1-12/)
  })
})
