## Parent

`docs/PLAN.md` step 1, section 6 (Editing in the app).

## What to build

Click an ingredient's name in the side panel to edit it in place. No separate
edit mode, no form. The change writes into the ingredient's JSON file in `data/`
through an API route that exists only in development; in a production build the
route is absent and names are read-only. The ingredient's `id` never changes, so
nothing else breaks. The `verified` flag is untouched by a rename.

## Type

HITL. Tia should confirm the write actually lands correctly and safely before
trusting it, since this is the first time the app writes to its own content.

## Acceptance criteria

- [ ] Clicking a name in the panel makes it editable
- [ ] Saving writes the new name into the correct file in `data/ingredients/`
- [ ] The change is visible on reload, and in the file on disk
- [ ] The ingredient's `id` is unchanged after a rename
- [ ] `verified` is unchanged after a rename
- [ ] The write route does not exist in a production build

## Tests

None in `lib/season/`. This could get a narrow test on the write route itself if
it's easy to isolate, otherwise verified by hand per the `tdd` skill's rule that
untested layers are fine to leave untested when said plainly.

## Bilingual

None, names are a single field.

## Mobile

Tap and hold to edit on mobile rather than click. Field never narrower than the
text it holds. Documented in `docs/RESPONSIVE.md` when built.

## Blocked by

Blocked by `issues/008-ingredient-side-panel.md`.
