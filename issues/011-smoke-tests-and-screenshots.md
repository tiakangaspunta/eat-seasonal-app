## Parent

`docs/PLAN.md` step 1, section 9 (stack), and the `tdd` skill.

## What to build

A small number of Playwright smoke flows: home renders the current month with
visible ingredient names and roles, clicking an ingredient opens the panel with
its recipes listed, and the domestic and imported toggle changes the visible
count. Assertions on visible text and roles, never on classes or pixel positions,
so restyling later doesn't break them. Also: desktop and mobile viewport
screenshots of the home view and the open panel, for the visual record.

## Type

HITL. Tia reviews what got captured and whether the smoke flows actually cover
what matters before they're relied on as the safety net for later steps.

## Acceptance criteria

- [ ] Home smoke flow passes: current month name and at least one ingredient
      name are visible
- [ ] Panel smoke flow passes: clicking an ingredient shows its name and at
      least one recipe title in the panel
- [ ] Filter smoke flow passes: toggling imported changes the ingredient count
- [ ] Desktop and mobile screenshots are saved and reviewed
- [ ] No assertion depends on a CSS class name or a pixel coordinate

## Tests

The three flows above, in Playwright. No new Vitest coverage from this slice.

## Bilingual

None.

## Mobile

This slice is what verifies section 8's mobile notes hold up, at least for what's
built so far. Full mobile verification is step 7 of the overall build, not this
slice.

## Blocked by

Blocked by `issues/007-home-view.md`, `issues/008-ingredient-side-panel.md`, and
`issues/009-inline-name-editing.md`. Best run after `issues/010-ingredient-photos.md`
too, so the screenshots show real photos, though it does not strictly require it.
