/**
 * View models: what the server page hands the client components.
 *
 * The grid and the panel take plain, already-derived data rather than raw
 * Ingredient and Recipe objects. Availability, season labels, and the recipe
 * lookup all happen on the server, in lib/, so the client components hold
 * nothing but open-and-close state.
 */
import type { Category, Effort, MealType, Month, SubstitutionReason, Tag } from '@/lib/types'

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
  /**
   * The approved photo, if this ingredient has one yet. Undefined is the
   * ordinary case for now: the card draws its placeholder and the layout does
   * not move when the photo arrives.
   */
  image?: { file: string; author: string; license: string }
  /** Ingredients that can stand in for this one, already resolved to names. */
  similar: { id: string; name: string }[]
  recipes: PanelRecipe[]
}

/**
 * One name in a recipe: an ingredient from the calendar, or free text.
 *
 * `linkId` is set only for seasonal ingredients, the ones the ingredient view
 * has a card for. Pasta and soy sauce are named but not links, since following
 * them would open a page with nothing on it.
 */
export type RecipeName = { name: string; linkId?: string }

export type RecipeSubstitution = RecipeName & {
  reason: SubstitutionReason
  ratio?: string
  note?: string
}

export type RecipeLine = RecipeName & {
  quantity?: number
  unit?: string
  optional: boolean
  substitutions: RecipeSubstitution[]
}

/** What the recipe view hands its grid and panel, already resolved to names. */
export type RecipeViewItem = {
  id: string
  title: string
  mealType: MealType[]
  tags: Tag[]
  effort: Effort
  timeMinutes?: number
  servings?: number
  source?: { name: string; url: string }
  lines: RecipeLine[]
  /**
   * The ingredients that put it in season this month, derived in lib/season/.
   * Empty means not in season: one is enough (Tia's rule, 2026-09-23).
   */
  inSeason: RecipeName[]
  /** English prose for now; the fi fields fill at the localization step. */
  ownNotes?: string
}
