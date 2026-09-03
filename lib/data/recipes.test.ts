/**
 * Not season logic, so not strictly in the tested layer, but the same argument
 * as ingredients.test.ts applies: every later slice reads these files and the
 * app writes back into them. This is the load-and-validate check, plus the
 * import facts worth pinning down (30 recipes, 19 without a time).
 */
import { describe, expect, it } from 'vitest'

import { countByMealType, getRecipe, getRecipes, parseRecipe, recipesWithoutTime } from './recipes'

const valid = {
  id: 'tacos',
  title: 'Tacos',
  ingredients: [],
  mealType: ['lunch', 'dinner'],
  tags: [],
  effort: 'easy',
}

describe('recipe data', () => {
  const recipes = getRecipes()

  it('loads every file and validates its shape', () => {
    expect(recipes.length).toBe(30)
  })

  it('prints counts by meal type', () => {
    const counts = countByMealType()
    // eslint-disable-next-line no-console -- the same sanity print the ingredient import got
    console.log('recipes by meal type:', counts)
    expect(counts.dinner).toBeGreaterThan(0)
  })

  it('gives every recipe a unique id and a non-empty title', () => {
    const ids = new Set(recipes.map((r) => r.id))
    expect(ids.size).toBe(recipes.length)
    expect(recipes.every((r) => r.title.trim() !== '')).toBe(true)
  })

  it('gives every recipe at least one meal type', () => {
    expect(recipes.every((r) => r.mealType.length > 0)).toBe(true)
  })

  it('leaves ingredient lists empty, since slice 5 rebuilds them from source pages', () => {
    expect(recipes.every((r) => r.ingredients.length === 0)).toBe(true)
  })

  it('leaves tags empty, since Notion had no diet or style column', () => {
    expect(recipes.every((r) => r.tags.length === 0)).toBe(true)
  })

  it('flags the 19 recipes whose time has to come from the source page', () => {
    expect(recipesWithoutTime()).toHaveLength(19)
  })

  it('gives every recipe a source except the two Notion rows without a URL', () => {
    const sourceless = recipes.filter((r) => r.source === undefined).map((r) => r.id)
    expect(sourceless.sort()).toEqual(['creamy-barley-and-mushroom-risotto', 'tacos'])
  })

  it('names the source by its domain and links out with an absolute URL', () => {
    const palakPaneer = getRecipe('palak-paneer')
    expect(palakPaneer?.source?.name).toBe('k-ruoka.fi')
    expect(palakPaneer?.source?.url).toBe('https://www.k-ruoka.fi/reseptit/palak-paneer')
  })

  it('maps a multi-value Notion type onto several meal types', () => {
    expect(getRecipe('shakshuka')?.mealType).toEqual(['breakfast', 'lunch', 'dinner'])
  })

  it('rejects a file whose id does not match its filename', () => {
    expect(() => parseRecipe(valid, 'burritos.json')).toThrow(/does not match its filename/)
  })

  it('rejects an unknown meal type', () => {
    expect(() => parseRecipe({ ...valid, mealType: ['brunch'] }, 'tacos.json')).toThrow(
      /unknown mealType brunch/,
    )
  })

  it('rejects a course sitting in tags, which is what mealType is for', () => {
    expect(() => parseRecipe({ ...valid, tags: ['dinner'] }, 'tacos.json')).toThrow(
      /unknown tag dinner/,
    )
  })

  it('rejects an unknown effort', () => {
    expect(() => parseRecipe({ ...valid, effort: 'Low' }, 'tacos.json')).toThrow(
      /unknown effort Low/,
    )
  })

  it('rejects a recipe with no meal type at all', () => {
    expect(() => parseRecipe({ ...valid, mealType: [] }, 'tacos.json')).toThrow(
      /mealType must be a non-empty array/,
    )
  })

  it('rejects an ingredient line that names nothing', () => {
    expect(() => parseRecipe({ ...valid, ingredients: [{ quantity: 2 }] }, 'tacos.json')).toThrow(
      /needs an ingredientId or freeText/,
    )
  })

  it('rejects a source url that is not a url', () => {
    expect(() =>
      parseRecipe({ ...valid, source: { name: 'k-ruoka.fi', url: '/reseptit/tacos' } }, 'tacos.json'),
    ).toThrow(/source.url must be a URL/)
  })

  it('accepts a recipe with no time, since 19 of them have none yet', () => {
    expect(parseRecipe(valid, 'tacos.json').timeMinutes).toBeUndefined()
  })
})
