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

## Where this got to

Paused on 2026-09-17, part way through. What exists:

- 9 ingredients decided and downloaded: apple, avocado, banana, bearberry,
  beef-tomato, bell-pepper, black-salsify, black-trumpet, blackberry. Their
  attribution is on the ingredient, the files are in
  `public/images/ingredients/`, and `/credits` lists them.
- Around 87 September ingredients still have no decision.
- `aronia` was reviewed and had no usable candidate. It stays without a photo
  unless a later search finds one.

Two of the nine do not work at card size, and are worth repicking. Both were
approved from the contact sheet, where they are shown much larger, so this only
became visible once cards rendered photos:

- `beef-tomato`: a market stall with a price sign in shot. Reads as a shop.
- `black-salsify`: foliage in a field. The black root, which is the part cooked,
  is not visible.

To carry on:

1. `node scripts/photo-candidates.mjs` and wait. Wikimedia rate-limits hard,
   around 50 seconds of waiting per batch, so a full run is over an hour.
2. `npm run dev`, open `/photos`, approve.
3. `node scripts/download-approved.mjs`.

Worth fixing first: `photo-candidates.mjs` writes its output only once, at the
very end, so a run that dies at ingredient 90 loses all 90. Writing after each
ingredient would make the run resumable, which matters a lot at this speed.

## Tests

None.

## Bilingual

None.

## Mobile

None directly, though home view cards already reserve image space per slice 7.

## Blocked by

Blocked by `issues/002-import-ingredients.md`. Can run any time alongside slices
4 through 9.
