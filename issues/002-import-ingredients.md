## Parent

`docs/PLAN.md` step 1, `docs/NOTION-IMPORT.md`, `docs/CATEGORY-REVIEW.md`.

## What to build

Convert the 132-row Notion ingredient export into `data/ingredients/*.json`
following the mapping and category decisions already agreed:

- Domestic and imported rows for the same produce merged onto one ingredient
  (Apple, Banana, etc.), each holding its own month set under `availability`.
- Categories: vegetable, fruit, berry, mushroom, herb, nut, other, per
  `CATEGORY-REVIEW.md`, including the herb versus dried-spice split (cumin to
  `other`), Härkäpapu to `other` (dried), Raitajuuri kept separate from Punajuuri.
- The 11 undetermined origins drafted from general knowledge, `verified: false`.
- `New Ingredient`, `Other mushroom`, and `Spices` dropped. `Other unusual` is not
  created as its own ingredient; it resolves per recipe in slice 5.
- Every imported month set from Tia's own data is `verified: true`.

## Type

HITL. This becomes the foundation every other slice reads from, so Tia reviews
the converted data against the category decisions before it's trusted.

## Acceptance criteria

- [ ] Every non-dropped row from the export exists as an ingredient
- [ ] No ingredient has both a `(kotimainen)` and non-`(kotimainen)` duplicate
- [ ] Category counts match `CATEGORY-REVIEW.md`
- [ ] `verified: true` only where Tia's own data set the months
- [ ] A script or test prints counts by category for a quick sanity check

## Tests

None in `lib/season/` yet, this slice is data only. A basic load-and-validate
check (does every file parse and match the `Ingredient` shape) is reasonable here
even though it's not season logic.

## Bilingual

None. Names are a single field per the plan.

## Mobile

None, no UI yet.

## Blocked by

Blocked by `issues/001-project-scaffold.md`.
