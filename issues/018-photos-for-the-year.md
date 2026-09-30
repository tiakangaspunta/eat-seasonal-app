## Parent

`docs/PLAN.md` step 3: "remaining photos".

## What to build

Photos for every ingredient the home view shows in some month and does not have
one yet (32 seasonal ingredients today, more or fewer once issue 012 lands).
Same process as issue 010: freely licensed candidates with author, license and
source, shown on the contact sheet, and only the ones Tia approves are
downloaded and credited.

## Type

HITL. Tia approves each photo.

## Acceptance criteria

- [ ] Every ingredient shown on the home view in some month has candidates on
      the contact sheet
- [ ] Every candidate shows author, license and source URL
- [ ] Only approved images are downloaded, with complete `IngredientImage` data
- [ ] The credits page lists them
- [ ] Ingredients with no acceptable candidate are listed, and keep the card
      without a photo

## Tests

None new; `lib/data/photos.ts` is already tested.

## Bilingual

None.

## Mobile

None. The contact sheet already has its mobile line.

## Blocked by

- Blocked by `issues/012-full-year-calendar.md`, which decides which
  ingredients appear in which month.
