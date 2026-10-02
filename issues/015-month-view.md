## Parent

`docs/PLAN.md` step 3: "month view". Section 7, Month view.

## What to build

For the chosen months, the recipes in season in them (one in-season ingredient
is enough, section 4), sorted by how many seasonal ingredients they use, most
first. The card already names the ingredients that put it in season; here, the
count is what orders the list.

Settled on 2026-09-30: the month view is not a third screen. It is the recipe
view with months chosen in the row of months (issue 014), which marks the
recipes in season in any of them. What is still open, and asked before
building:

- Does the recipe view narrow to in-season recipes, when it deliberately shows
  all of them today (only 5 of 31 have ingredient lists)? Or is "only in
  season" a toggle?
- Does the sort replace the meal-type sections, or sort within them?

Answered by Tia on 2026-10-02: choosing months narrows the view to recipes
with at least one ingredient in season; with no months chosen the view still
shows every recipe. The sort applies within each meal-type section.

## Type

AFK once the questions above are answered, which is Tia's call on product
behaviour.

## Acceptance criteria

- [x] Tia has answered the two open questions above
- [x] Recipes in season in the chosen months are shown, sorted by how many of
      their ingredients are in season then, ties broken by title
- [x] Recipes with no ingredient list are never shown as in season
- [x] A smoke flow: choose months, see their in-season recipes
- [x] `docs/FLOWS.md` and `docs/RESPONSIVE.md` updated

## Tests

In `lib/season/`, test-first with fixture data: counting a recipe's in-season
ingredients for a month (optional lines, imported-only and pantry ingredients
not counted, as the in-season rule already says), and the order that count
gives, including ties.

## Bilingual

Depends on the answers. Likely a heading and an empty state, for example
`monthView.empty: { en: 'Nothing with an ingredient list is in season this month yet.', fi: '' }`.

## Mobile

The same card grid as the recipe view: one column on mobile, more from `md:`.

## Blocked by

- Blocked by `issues/014-month-strip.md`.
