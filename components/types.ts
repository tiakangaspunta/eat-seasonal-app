/**
 * View models: what the server page hands the client components.
 *
 * The grid and the panel take plain, already-derived data rather than raw
 * Ingredient and Recipe objects. Availability, season labels, and the recipe
 * lookup all happen on the server, in lib/, so the client components hold
 * nothing but open-and-close state.
 */
import type { Category, Effort, MealType, Month } from '@/lib/types'

export type PanelRecipe = {
  id: string
  title: string
  mealType: MealType[]
  effort: Effort
  timeMinutes?: number
}

export type HomeIngredient = {
  id: string
  name: string
  category: Category
  domesticStatus: 'fresh' | 'storage' | 'unavailable'
  importedStatus: 'available' | 'unavailable'
  /** Where it comes from this month, and the countries if the data names any. */
  origin: 'domestic' | 'imported' | 'none'
  countries: string[]
  seasonLabel?: string
  unverified: boolean
  freshMonths: Month[]
  storageMonths: Month[]
  importedMonths: Month[]
  /** English prose for now; the fi fields fill at the localization step. */
  notes?: string
  warning?: string
  /** Ingredients that can stand in for this one, already resolved to names. */
  similar: { id: string; name: string }[]
  recipes: PanelRecipe[]
}
