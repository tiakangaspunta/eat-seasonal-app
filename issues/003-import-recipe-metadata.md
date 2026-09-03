## Parent

`docs/PLAN.md` step 1, `docs/NOTION-IMPORT.md`.

## What to build

Convert the 31-row Notion recipe export into `data/recipes/*.json`, metadata
only: title, source (name and URL), effort, time where Notion had it, mealType
(mapped from Notion's Type column per the judgment calls in `NOTION-IMPORT.md`),
and tags. Ingredient lists are not built here, that is slice 5. Cooking history
(Success, Favorites) is not imported, per an earlier decision.

The export turned out to have 31 rows, not 30. `Pesto (A ei tykännyt)` was
dropped at Tia's request, so 30 recipes are written and 19 of them have no time,
which is what the criteria below count.

## Type

HITL. The mealType mapping involved judgment calls (Main Course and Light to
`dinner`, Salad mostly to `side`), and Tia should see the result before it's
relied on.

## Acceptance criteria

- [x] All 30 recipes exist with title, source, effort, mealType, tags
- [x] Ambiguous mealType calls are listed in `docs/IMPORT-REPORT.md`
- [x] The 19 recipes with no Notion time are flagged, to be filled in slice 5
- [x] `ingredients: []` placeholder, not yet populated

## Tests

None. Data only, no derived logic yet.

## Bilingual

None. Titles are a single field.

## Mobile

None, no UI yet.

## Blocked by

Blocked by `issues/001-project-scaffold.md`. Runs alongside
`issues/002-import-ingredients.md`, not blocked by it.
