## Parent

`docs/PLAN.md` step 3: "all filters". Section 7, Filters.

## What to build

The rest of the plan's filters, in the frame issue 016 built: meal type,
effort, time needed and tags, on the recipe view and the month view, all kept in
the address. Months and seasons are the row of months, issue 014.

Filters narrow the list. Where a filter needs data a recipe does not have (16
recipes have no time yet), the recipe is left out of a time filter rather than
guessed into it, and the filter says how many have no time recorded.

## Type

AFK.

## Acceptance criteria

- [ ] Meal type, effort, time needed and tags filter the recipe view and month
      view, alone and combined
- [ ] All of them live in the address, alongside `month`, `origin` and `open`
- [ ] Recipes missing a field are left out of that field's filter, and the
      count of them is shown
- [ ] A way to clear all filters
- [ ] A smoke flow: filter, reload, still filtered
- [ ] `docs/FLOWS.md` and `docs/RESPONSIVE.md` updated

## Tests

The filter logic, test-first with fixture recipes: each filter alone, filters
combined (and within a filter, whether two tags mean "either" or "both", to be
asked if unclear), and recipes missing a field. Plus the address round trip for
the new keys.

## Bilingual

Filter headings and time bands, for example
`filters.mealType: { en: 'Meal', fi: '' }`,
`filters.effort: { en: 'Effort', fi: '' }`,
`filters.time: { en: 'Time', fi: '' }`,
`filters.tags: { en: 'Tags', fi: '' }`,
`filters.clear: { en: 'Clear filters', fi: '' }`,
`filters.noTime: { en: '{count} have no time recorded', fi: '' }`.
Meal types, effort and tags reuse their existing labels.

## Mobile

In the same sheet as issue 016's filters on mobile, grouped under headings;
the sidebar on desktop.

## Blocked by

- Blocked by `issues/015-month-view.md`.
- Blocked by `issues/016-filters-in-the-url.md`.
