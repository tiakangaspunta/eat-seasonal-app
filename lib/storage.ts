/**
 * The single persistence boundary. Nothing outside this file touches
 * localStorage, or whatever replaces it in step 8.
 *
 * The interface is async from day one even though the first implementation
 * (step 4) will be synchronous browser storage, because the same data has to
 * appear on every device eventually. Swapping in a database then means writing
 * a second implementation, not threading promises through the UI.
 *
 * Unimplemented on purpose: this slice is the scaffold. Step 4 fills it in.
 */

export type Rating = 1 | 2 | 3 | 4 | 5

export type TriedEntry = {
  recipeId: string
  /** ISO date */
  date: string
  rating: Rating
  note?: string
  /** Seasonal ingredients this cook covered, recorded at cook time. */
  ingredientIds: string[]
}

export type UserData = {
  /** Recipe ids. */
  favorites: string[]
  tried: TriedEntry[]
}

export interface Storage {
  getUserData(): Promise<UserData>
  addFavorite(recipeId: string): Promise<void>
  removeFavorite(recipeId: string): Promise<void>
  addTried(entry: TriedEntry): Promise<void>
}

const notImplemented = (name: string): never => {
  throw new Error(`storage.${name} is not implemented yet (see docs/PLAN.md step 4)`)
}

export const storage: Storage = {
  getUserData: async () => notImplemented('getUserData'),
  addFavorite: async () => notImplemented('addFavorite'),
  removeFavorite: async () => notImplemented('removeFavorite'),
  addTried: async () => notImplemented('addTried'),
}
