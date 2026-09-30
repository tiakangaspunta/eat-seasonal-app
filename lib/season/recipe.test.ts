import { describe, expect, it } from 'vitest'

import { inSeasonIngredients } from './recipe'
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

function recipe(ingredients: RecipeIngredient[]): Recipe {
  return {
    id: 'fixture',
    title: 'Fixture',
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
