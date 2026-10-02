import { describe, expect, it } from 'vitest'

import { inSeasonIngredients, inSeasonRecipes } from './recipe'
import type { Ingredient, Recipe, RecipeIngredient } from '@/lib/types'

const carrot: Ingredient = {
  id: 'carrot',
  name: 'Carrot',
  category: 'vegetable',
  availability: { domestic: { freshMonths: [8, 9], storageMonths: [1, 2] } },
  verified: true,
  similarTo: [],
}

const asparagus: Ingredient = {
  id: 'asparagus',
  name: 'Asparagus',
  category: 'vegetable',
  availability: { domestic: { freshMonths: [5, 6], storageMonths: [] } },
  verified: true,
  similarTo: [],
}

const lime: Ingredient = {
  id: 'lime',
  name: 'Lime',
  category: 'fruit',
  availability: { imported: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
  verified: true,
  similarTo: [],
}

const calendar = new Map([carrot, asparagus].map((ingredient) => [ingredient.id, ingredient]))
const withLime = new Map([...calendar, [lime.id, lime]])

function recipe(ingredients: RecipeIngredient[], title = 'Fixture'): Recipe {
  return {
    id: title.toLowerCase(),
    title,
    ingredients,
    mealType: ['dinner'],
    tags: [],
    effort: 'easy',
  }
}

describe('a recipe in season', () => {
  it('is in season when one of its ingredients is fresh this month, even if the rest are not', () => {
    const soup = recipe([{ ingredientId: 'carrot' }, { ingredientId: 'asparagus' }])
    expect(inSeasonIngredients(soup, calendar, [9])).toEqual(['carrot'])
  })

  it('counts an ingredient from Finnish storage, not only a fresh one', () => {
    const soup = recipe([{ ingredientId: 'carrot' }])
    expect(inSeasonIngredients(soup, calendar, [1])).toEqual(['carrot'])
  })

  it('does not count an optional ingredient, since the recipe can be made without it', () => {
    const soup = recipe([{ ingredientId: 'carrot', optional: true }, { ingredientId: 'asparagus' }])
    expect(inSeasonIngredients(soup, calendar, [9])).toEqual([])
  })

  it('does not count an ingredient that is only ever imported', () => {
    const noodles = recipe([{ ingredientId: 'lime' }])
    expect(inSeasonIngredients(noodles, withLime, [9])).toEqual([])
  })

  it('is never in season without an ingredient list', () => {
    expect(inSeasonIngredients(recipe([]), calendar, [9])).toEqual([])
  })

  it('names an ingredient once, however many lines it is on', () => {
    const soup = recipe([{ ingredientId: 'carrot' }, { freeText: 'salt' }, { ingredientId: 'carrot' }])
    expect(inSeasonIngredients(soup, calendar, [9])).toEqual(['carrot'])
  })
})

describe('a recipe in season over several chosen months', () => {
  it('is in season if it is in season in any of them', () => {
    const salad = recipe([{ ingredientId: 'asparagus' }])
    expect(inSeasonIngredients(salad, calendar, [4, 5])).toEqual(['asparagus'])
  })

  it('names every ingredient that puts it in season in any of them, once, in recipe order', () => {
    const soup = recipe([{ ingredientId: 'asparagus' }, { ingredientId: 'carrot' }])
    expect(inSeasonIngredients(soup, calendar, [1, 5])).toEqual(['asparagus', 'carrot'])
  })

  it('is not in season when none of the months has any of its ingredients', () => {
    const soup = recipe([{ ingredientId: 'carrot' }, { ingredientId: 'asparagus' }])
    expect(inSeasonIngredients(soup, calendar, [3, 4])).toEqual([])
  })
})

describe('the recipes in season in the chosen months', () => {
  const both = recipe([{ ingredientId: 'carrot' }, { ingredientId: 'asparagus' }], 'Both')
  const carrotOnly = recipe([{ ingredientId: 'carrot' }], 'Carrot soup')
  const asparagusOnly = recipe([{ ingredientId: 'asparagus' }], 'Asparagus salad')
  const noList = recipe([], 'No list yet')

  it('leaves out recipes with nothing in season, and recipes with no ingredient list', () => {
    const titles = inSeasonRecipes([carrotOnly, asparagusOnly, noList], calendar, [9]).map((r) => r.title)
    expect(titles).toEqual(['Carrot soup'])
  })

  it('puts the recipe with the most ingredients in season first', () => {
    const titles = inSeasonRecipes([carrotOnly, both], calendar, [5, 9]).map((r) => r.title)
    expect(titles).toEqual(['Both', 'Carrot soup'])
  })

  it('breaks a tie by title', () => {
    const titles = inSeasonRecipes([carrotOnly, asparagusOnly], calendar, [5, 9]).map((r) => r.title)
    expect(titles).toEqual(['Asparagus salad', 'Carrot soup'])
  })

  it('counts an ingredient once, however many lines it is on', () => {
    const twice = recipe([{ ingredientId: 'carrot' }, { ingredientId: 'carrot' }], 'Zesty carrots')
    const titles = inSeasonRecipes([twice, asparagusOnly], calendar, [5, 9]).map((r) => r.title)
    expect(titles).toEqual(['Asparagus salad', 'Zesty carrots'])
  })

  it('does not count optional lines or imported-only ingredients towards the order', () => {
    const padded = recipe(
      [{ ingredientId: 'carrot' }, { ingredientId: 'asparagus', optional: true }, { ingredientId: 'lime' }],
      'Ample',
    )
    const titles = inSeasonRecipes([padded, both], withLime, [5, 9]).map((r) => r.title)
    expect(titles).toEqual(['Both', 'Ample'])
  })
})
