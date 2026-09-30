## Parent

`docs/PLAN.md` step 3: "filter state in the URL, imported produce toggle".
Section 7, Filters; section 8, filters on mobile.

## What to build

The filter frame, with its first filter. The "Include imported produce"
checkbox already works, but it is component state, so a reload forgets it.
It moves into the address (`?origin=all`, default domestic) and into a filter
area laid out the way the plan wants filters to be: a sidebar on desktop, a
sheet behind a "Filters" button on mobile. Issue 017 then adds the recipe
filters to the same frame.

It combines with the month and the open panel (`?month=3&origin=all&open=lime`).

## Type

AFK.

## Acceptance criteria

- [ ] The origin choice is in the address; reload, bookmarks and Back keep it
- [ ] With no `origin`, the view is domestic only, as now
- [ ] It works together with `month` and `open`
- [ ] Desktop: a filter sidebar. Mobile: a "Filters" button opening a sheet,
      closable, with the choice applied as it is made
- [ ] The existing "including imported produce" smoke flow passes, and reloads
      once to prove the state survives
- [ ] `docs/FLOWS.md` and `docs/RESPONSIVE.md` updated

## Tests

Reading and writing filter state from the address: defaults, unknown values
ignored, and the round trip (state to query string and back) giving the same
state. Pinned in `lib/`, since a wrong reading here silently hides produce.

## Bilingual

`filters.button: { en: 'Filters', fi: '' }`,
`filters.origin.domestic: { en: 'Finnish only', fi: '' }`,
`filters.origin.all: { en: 'Include imported', fi: '' }`. The existing checkbox
label is replaced.

## Mobile

A persistent sidebar on desktop; on mobile a modal sheet behind a "Filters"
button (plan section 8).

## Blocked by

- Blocked by `issues/014-month-strip.md`, since both write the same address and
  should share one way of doing it.
