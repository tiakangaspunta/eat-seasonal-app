/**
 * Display words for the recipe fields, in one place, so the ingredient panel's
 * recipe list and the recipe view never disagree on order or wording.
 */
import type { MealType, SubstitutionReason } from '@/lib/types'

/** The order a day runs in, not the alphabet. */
export const MEAL_TYPE_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'side', 'snack']

export const MEAL_TYPE_HEADING: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  dessert: 'Dessert',
  side: 'Sides',
  snack: 'Snacks',
}

/**
 * Why a swap is offered, as the recipe records it. "Seasonal swap", never "in
 * season": whether it is in season this month is a claim only lib/season/ may
 * make, from the month data.
 */
export const SUBSTITUTION_REASON_LABEL: Record<SubstitutionReason, string> = {
  seasonal: 'Seasonal swap',
  vegan: 'Vegan',
  'dairy-free': 'Dairy-free',
  pantry: 'From the pantry',
  preference: 'Preference',
}

const FRACTIONS: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' }

/** "0.25" reads as a measurement nobody uses; "¼ tsp" is how a recipe says it. */
export function formatQuantity(quantity: number): string {
  const whole = Math.floor(quantity)
  const fraction = FRACTIONS[Math.round((quantity - whole) * 100) / 100]
  if (fraction) return whole === 0 ? fraction : `${whole}${fraction}`
  return String(quantity)
}
