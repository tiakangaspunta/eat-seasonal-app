## Parent

`docs/PLAN.md` step 1, section 7 (Home).

## What to build

The home page: opens on September, named and labeled with its season. Domestic
produce shown by default, with a toggle for imported. Grouped into vegetable,
fruit, berry, mushroom, and herb sections. Each ingredient is a card: name,
season label, fresh-or-storage indicator, and an unverified badge where
`verified: false`. Photos are not required for this slice to be considered done,
they can land from slice 10 without this slice being reopened.

Server component for the grid itself; the domestic/imported toggle is the one
small client component here.

## Type

HITL. This is the first real screen. Tia reacts to it before more is built on
top, per the plan's explicit instruction that step 1 is "the step to react to
before anything else is built."

## Acceptance criteria

- [ ] Loading the home page shows September, correctly labeled
- [ ] Only domestic produce shows by default
- [ ] Toggling to include imported changes the visible set
- [ ] Ingredients are grouped into the five seasonal categories, not a flat list
- [ ] An ingredient with `verified: false` shows a visible badge
- [ ] Cards reserve space for a photo whether or not one exists yet

## Tests

None in `lib/season/` from this slice; it consumes slice 6. No Playwright yet,
that's slice 11.

## Bilingual

None yet, English only.

## Mobile

Grid: four columns on desktop, two on tablet, one on mobile. Documented in
`docs/RESPONSIVE.md` when built, not just here.

## Blocked by

Blocked by `issues/002-import-ingredients.md`, `issues/004-september-calendar.md`,
and `issues/006-availability-logic.md`.
