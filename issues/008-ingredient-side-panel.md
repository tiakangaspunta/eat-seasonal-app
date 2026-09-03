## Parent

`docs/PLAN.md` step 1, section 7 (Ingredient side panel).

## What to build

Clicking an ingredient card opens a side panel from the right, main content
staying visible behind it. Shows name, category, season label, and fresh and
storage months as a small twelve-month bar. Lists recipes that use this
ingredient (from slice 5's rebuilt recipes), filterable. The combine control's
layout is reserved, per the plan, but not wired to any logic yet, that's step 5
of the overall build.

Client component, since it has open and close state and click handling.

## Type

HITL. A new interaction flow, worth Tia's reaction before the next slice builds
on it.

## Acceptance criteria

- [ ] Clicking a card opens the panel without navigating away
- [ ] The home grid stays visible and interactive behind the panel
- [ ] The panel shows the twelve-month bar correctly for at least one fresh-only
      and one fresh-plus-storage ingredient
- [ ] Recipes using this ingredient are listed, and only those recipes
- [ ] A combine control is visibly present but not functional

## Tests

None in `lib/season/`. UI, checked by eye.

## Bilingual

None yet.

## Mobile

Right-hand panel on desktop becomes a full-height bottom sheet on mobile.
Documented in `docs/RESPONSIVE.md` when built.

## Blocked by

Blocked by `issues/005-rebuild-september-recipes.md` and `issues/007-home-view.md`.
