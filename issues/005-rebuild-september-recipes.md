## Parent

`docs/PLAN.md` step 1, section 3.

## What to build

Pick roughly 10 recipes from the 30 that use September produce (once slice 4
lands, this includes more than just bok choy and suppilovahvero recipes). For
each: read the source page once, extract the real ingredient list with
quantities, map each line to an ingredient id where one exists or leave it as
`freeText`, fill in effort and time where still missing, and draft vegan and
seasonal substitutions per the `Substitution` type. For the two recipes touching
`Other unusual` and `Spices`, resolve what those actually were from the source
page rather than leaving a placeholder.

Cooking steps are not copied. Only the ingredient list, quantities, and Tia's own
substitution notes go into the app; the method stays a link.

## Type

HITL. Substitutions and notes are original content presented as Tia's own advice,
and she should read them before they're shown that way, even though drafting them
does not require her to be present.

## Acceptance criteria

- [ ] ~10 recipes have complete, real ingredient lists with quantities
- [ ] Every mapped ingredient references a real ingredient id from slice 2
- [ ] Effort and time are filled for all ~10
- [ ] Each has at least one substitution where a sensible one exists (vegan or
      seasonal)
- [ ] The `Other unusual` and `Spices` recipes have their real ingredients, not a
      placeholder
- [ ] No cooking steps copied from the source pages

## Tests

None in `lib/season/` from this slice directly, but this is the first data that
exercises the availability logic in slice 6 meaningfully, so it's worth a manual
check that at least one rebuilt recipe reads as in-season for September once both
land.

## Bilingual

None, recipe content is single-field or plan-exempted.

## Mobile

None.

## Blocked by

Blocked by `issues/002-import-ingredients.md`, `issues/003-import-recipe-metadata.md`,
and `issues/004-september-calendar.md`.
