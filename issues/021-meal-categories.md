## Parent

`docs/PLAN.md` step 3: "all filters", which includes meal type. Section 4,
Recipe, `mealType`. Replaces the six meal types set on 2026-09-03
(`docs/DECISIONS.md` 2026-10-02).

## Why

The six meal types (breakfast, lunch, dinner, dessert, side, snack) don't match
how Tia picks something to cook. Lunch and dinner are the same kind of dish to
her, almost every recipe ends up tagged dinner, and snack and dessert hold one or
two recipes between them. Four categories instead:

- **Breakfast**
- **Meal**: a main course, whatever time of day it's eaten
- **Sides**
- **Baking**: anything baked, and anything sweet, baked or not

A recipe can still be in more than one, and the recipe view and filters work
off these four.

## What to build

**Type.** `MealType` becomes `'breakfast' | 'meal' | 'side' | 'baking'`. The
field keeps its name, `mealType`, and stays a non-empty array. Validation on
load rejects the old values (`lunch`, `dinner`, `dessert`, `snack`) so a stale
data file fails loudly instead of disappearing from every section.

**Order and headings.** Breakfast, Meal, Sides, Baking, in that order wherever
meal types are listed: the recipe view's sections, the ingredient panel's
filter chips, the recipe card and the recipe panel. The headings move out of
`components/labels.ts` into `lib/strings.ts` as `{ en, fi }`.

**Data.** All 31 recipes remapped, as approved by Tia on 2026-10-02:

| Recipe | Today | Becomes |
| --- | --- | --- |
| Every recipe tagged `dinner` only (20 of them) | dinner | meal |
| Chanterelle pie, root vegetable and mushroom pie, tacos | lunch, dinner | meal |
| Shakshuka | breakfast, lunch, dinner | breakfast, meal |
| Carrot pancakes, chickpea patties, spinach pancakes, tuna and bean salad | dinner, side | meal, side |
| Naan | side | side |
| Red cabbage bao buns | snack, side | meal |
| Smashed Brussels sprouts | side, snack | side |

No recipe is Baking yet. Naan was considered and stays a side.

**Filtering.** Filtering by meal type is built in issue 017, on these four
categories, not on the old six. A recipe in two categories matches either.
This issue changes what the existing ingredient-panel chips offer, and nothing
else about filtering.

**Adding recipes.** `docs/ADDING-RECIPES.md` names the four categories and
what each means, including that sweet things go under Baking, so a recipe
pasted in later is proposed into the right one.

## Type

HITL. The mapping above is settled; Tia checks the recipe view by eye
afterwards.

## Acceptance criteria

- [ ] `MealType` is the four values, in `lib/types.ts` and in the loader's
      validation, and loading rejects `lunch`, `dinner`, `dessert` and `snack`
- [ ] All 31 recipe files carry the mapping in the table
- [ ] The recipe view shows Breakfast, Meal, Sides and Baking sections, in that
      order, with empty sections hidden as they are now
- [ ] The ingredient panel's chips, the recipe card and the recipe panel use
      the same four, in the same order
- [ ] Meal-type headings are `{ en, fi }` in `lib/strings.ts`
- [ ] `docs/ADDING-RECIPES.md` describes the four categories
- [ ] `docs/PLAN.md` section 4 type block updated (the decision itself is
      already recorded there)
- [ ] `docs/FLOWS.md` updated where it names the old sections

## Tests

Test-driven in the loader's tests, with fixture recipes defined in the test:

- A recipe with each of the four values loads.
- A recipe with `lunch`, `dinner`, `dessert` or `snack` is rejected.
- The count by meal type has the four keys and no others.

The existing tests that use `dinner` or `lunch` in fixtures move to the new
values. The sections and chips are checked by eye; the Playwright screenshots
are refreshed, and any smoke flow that names an old section is updated.

## Bilingual

`mealType.breakfast: { en: 'Breakfast', fi: '' }`,
`mealType.meal: { en: 'Meal', fi: '' }`,
`mealType.side: { en: 'Sides', fi: '' }`,
`mealType.baking: { en: 'Baking', fi: '' }`.

## Mobile

Nothing new. Four sections stack in one column as the six did, and four chips
wrap in the panel as six did.

## Blocked by

- Blocked by `issues/015-month-view.md` (done), which orders recipes within
  these sections.
- Issue 017 is blocked by this one, so meal-type filtering is built once, on
  the new categories.
