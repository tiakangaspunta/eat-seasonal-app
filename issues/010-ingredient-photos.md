## Parent

`docs/PLAN.md` step 1, section 4 (IngredientImage), section 6.4 (decisions on
image sourcing).

## What to build

For each September ingredient, find candidate photos on Wikimedia Commons and
Openverse, and build a single contact sheet page showing every candidate with its
author, license, and source URL. Tia reviews the sheet in one sitting and approves
or rejects each. Only approved images are downloaded into
`public/images/ingredients/`, with `IngredientImage` attribution recorded in the
ingredient's data.

## Type

HITL, explicitly. This is the one slice that was always going to need Tia, not
just as a checkpoint: license accuracy depends on her actual approval, per the
earlier decision that nothing enters the project unreviewed.

## Acceptance criteria

- [ ] Every September ingredient has at least one candidate on the contact sheet,
      or is explicitly noted as unavailable
- [ ] Every candidate shows author, license, and source URL
- [ ] Only images Tia approved are downloaded
- [ ] Approved images have complete `IngredientImage` data on their ingredient
- [ ] An attribution list is renderable somewhere in the app

## Tests

None.

## Bilingual

None.

## Mobile

None directly, though home view cards already reserve image space per slice 7.

## Blocked by

Blocked by `issues/002-import-ingredients.md`. Can run any time alongside slices
4 through 9.
