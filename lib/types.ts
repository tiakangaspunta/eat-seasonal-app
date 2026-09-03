/**
 * The content model from docs/PLAN.md section 4.
 *
 * Content lives as JSON under data/ and is validated against these types when
 * loaded, because the app writes back into those files (dev-mode name editing).
 */

/** Prose is bilingual. `fi` stays empty until the localization step. */
export type Bilingual = { en: string; fi: string }

export type Category =
  | 'vegetable'
  | 'fruit'
  | 'berry'
  | 'mushroom'
  | 'herb'
  | 'nut'
  | 'other'

/** The categories with month data, filtered by month and shown on the home view. */
export const SEASONAL_CATEGORIES = [
  'vegetable',
  'fruit',
  'berry',
  'mushroom',
  'herb',
] as const satisfies readonly Category[]

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type IngredientImage = {
  /** Path under public/images/ingredients/ */
  file: string
  author: string
  /** "CC BY-SA 4.0", "public domain" */
  license: string
  sourceUrl: string
}

export type Availability = {
  domestic?: {
    /** Harvested or picked fresh in Finland. */
    freshMonths: Month[]
    /** Available from Finnish storage, not fresh. */
    storageMonths: Month[]
    /** Best quality and price. */
    peakMonths?: Month[]
  }
  imported?: {
    /** When imported stock is good and reasonably priced. */
    months: Month[]
  }
}

export type Ingredient = {
  /** English slug, never changed by a rename. */
  id: string
  /** Display name, any language, editable in the app. */
  name: string
  category: Category
  availability: Availability
  /** false means Claude drafted these months or this origin. */
  verified: boolean
  /**
   * The exception list to `verified`: months whose availability was drafted
   * from a source rather than confirmed by Tia. One ingredient can hold both
   * trusted and drafted months, which a single boolean cannot say. Only
   * meaningful when `verified` is true; when it is false the whole ingredient
   * is drafted and listing months again would be a second way to say it.
   */
  unverifiedMonths?: Month[]
  /** Ingredient ids that can stand in for this one. */
  similarTo: string[]
  image?: IngredientImage
  notes?: Bilingual
  /** Preparation that matters for safety, not preference. */
  warning?: Bilingual
  /**
   * Finnish word for the recipe search shortcut (step 3), which has to run in
   * Finnish on k-ruoka and the rest. Only needed when `name` is not already
   * Finnish.
   */
  searchTermFi?: string
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'side'
  | 'snack'

/** Diet and style only. Course lives in mealType. */
export type Tag =
  | 'vegan'
  | 'vegetarian'
  | 'dairy-free'
  | 'gluten-free'
  | 'quick'
  | 'one-pot'
  | 'oven'
  | 'batch'

export type Effort = 'easy' | 'medium' | 'hard'

export type SubstitutionReason =
  | 'vegan'
  | 'dairy-free'
  | 'seasonal'
  | 'pantry'
  | 'preference'

export type Substitution = {
  use: { ingredientId?: string; freeText?: string }
  reason: SubstitutionReason
  /** "1:1", "half the amount" */
  ratio?: string
  note?: Bilingual
}

export type RecipeIngredient = {
  /** Set when it maps to a known ingredient. */
  ingredientId?: string
  /** "soy sauce": not seasonal, not tracked. */
  freeText?: string
  quantity?: number
  unit?: string
  optional?: boolean
  substitutions?: Substitution[]
}

export type Recipe = {
  id: string
  /** Any language, editable in the app. */
  title: string
  /** The method lives here and opens in a new tab. */
  source?: { name: string; url: string }
  ingredients: RecipeIngredient[]
  /** Only for own recipes. Never copied from a source page. */
  steps?: { en: string[]; fi: string[] }
  ownNotes?: Bilingual
  mealType: MealType[]
  tags: Tag[]
  timeMinutes?: number
  effort: Effort
  servings?: number
}
