## Parent

`docs/PLAN.md` step 1, section 9 (stack) and the `tdd` skill.

## What to build

`lib/season/availability.ts`: given an ingredient and a month, return whether it's
available, and if so whether it's fresh or from storage, for both domestic and
imported month sets. Also the derived season label used in the UI (spring,
summer, etc.), always computed from `freshMonths`, never hand-typed.

Test-driven, per the `tdd` skill: one behavior, one test, then the minimum code,
repeat. Fixtures defined in the test file, not the real September data from
slice 4, so correcting a month later never breaks a test.

## Type

HITL. Season logic is the layer the app can be confidently wrong in, so Tia
reviews the behaviors being pinned down, in plain language, before and during.

## Acceptance criteria

- [ ] A fixture ingredient in season fresh in a given month returns `fresh`
- [ ] A fixture ingredient available only from storage in a given month returns
      `storage`, not `fresh`
- [ ] A fixture ingredient with no data for a month returns unavailable
- [ ] A derived season label is correct for a fixture spanning two calendar
      seasons
- [ ] Imported and domestic availability are evaluated independently for the
      same ingredient

## Tests

All of the above, in `lib/season/availability.test.ts`, written first per the
`tdd` skill's red-green loop, one behavior at a time.

## Bilingual

None, pure logic.

## Mobile

None.

## Blocked by

Blocked by `issues/002-import-ingredients.md` and `issues/004-september-calendar.md`
for realistic fixtures, though the logic itself only needs the `Ingredient` type
from slice 1.
