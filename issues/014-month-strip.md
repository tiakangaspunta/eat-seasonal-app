## Parent

`docs/PLAN.md` step 3: "month strip" and the "months and seasons" filter.
Section 7, Home point 6, and Filters. Decided with Tia on 2026-09-30: one row of
months does both jobs, on both views.

## What to build

A row of the twelve months, with Winter, Spring, Summer and Autumn buttons,
along the top of both the ingredient view and the recipe view.

- **One month:** tapping a month shows that month, as the app does for the
  current month today.
- **Several months:** more months can be added, and the view shows anything in
  season in *any* of them. Tapping a chosen month again takes it out; the last
  one cannot be taken out, so something is always chosen.
- **Seasons:** a season button chooses its three months at once (winter
  December to February, spring March to May, summer June to August, autumn
  September to November, as `lib/season/availability.ts` defines them).
- **Both views:** the ingredient view shows produce available from Finland in
  the chosen months; the recipe view marks recipes in season in any of them.
  Switching views and following panel links keep the choice.
- **In the address:** `?months=10,11`, so reload, bookmarks and Back keep it,
  alongside `open`. With no `months`, the app opens on the current month, as
  now. The current month is marked in the row wherever you are.
- **Cards over several months** say which of the chosen months the ingredient
  is available in, for example "fresh Oct · storage Nov", instead of "fresh
  this month". With one month chosen they read as today.
- **Heading:** one month reads as now ("March, spring"); a whole season reads
  as the season ("Autumn"); any other set lists the months ("October and
  November").

## Type

AFK. The choices above are settled; the season split is Tia's, confirmed.

## Acceptance criteria

- [x] The row of months and the four season buttons on both views
- [x] One or several months can be chosen; a season chooses its three
- [x] The ingredient view shows produce available in any chosen month
- [x] The recipe view marks recipes in season in any chosen month
- [x] `?months=` holds the choice; invalid or missing values fall back to the
      current month rather than erroring
- [x] Switching views and following panel links keep the choice
- [x] Cards over several months name the months they are available in
- [x] A smoke flow: choose a season, see the heading change, reload, still
      there
- [x] `docs/FLOWS.md` and `docs/RESPONSIVE.md` updated

## Tests

Test-first in `lib/season/`, with fixture data:

- availability over several months: an ingredient counts if it is available in
  any of them, and which months it is fresh or from storage in;
- a recipe is in season over several months if it is in season in any of them;
- reading `?months=` from the address: one month, several, a season's three,
  duplicates, out-of-range and non-numeric values, and no value at all.

## Bilingual

Month and season names already exist. New:
`monthRow.label: { en: 'Choose months', fi: '' }`,
`monthRow.seasons: { en: 'Seasons', fi: '' }`, and the heading joiner
`monthRow.and: { en: 'and', fi: '' }`.

## Mobile

A single horizontal row on desktop, with the season buttons beside it; on
mobile the months scroll horizontally with the first chosen month scrolled into
view, and the season buttons sit on their own row above. Every month and button
at least 44 by 44 pixels.

## Blocked by

None, can start immediately.
