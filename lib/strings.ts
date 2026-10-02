/**
 * Interface words as `{ en, fi }`, filled in English now and in Finnish at the
 * localization step. An empty field falls back to the other language, so
 * nothing renders blank.
 *
 * Only the words added since issue 014 live here so far. Older labels are
 * still plain English in their components and move here at the Finnish step.
 */
export type Text = { en: string; fi: string }

export function text(value: Text): string {
  return value.en || value.fi
}

export const UI = {
  monthRow: {
    label: { en: 'Choose months', fi: '' },
    seasons: { en: 'Seasons', fi: '' },
    and: { en: 'and', fi: '' },
    thisMonth: { en: 'this month', fi: '' },
  },
  recipeView: {
    inSeasonIntro: { en: 'Recipes with something in season', fi: '' },
    inSeasonOrder: { en: 'By meal, the most seasonal first.', fi: '' },
    empty: { en: 'Nothing with an ingredient list is in season in these months yet.', fi: '' },
  },
} satisfies Record<string, Record<string, Text>>
