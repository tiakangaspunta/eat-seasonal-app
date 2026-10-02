## Parent

`docs/PLAN.md` step 6: "Finnish". Section 4, Ingredient, names. Reverses the
2026-09-11 decision that names stay a single field (`docs/DECISIONS.md`
2026-10-02).

## Why

Tia wants to use the app in Finnish, and may show it to people who don't speak
Finnish. A single `name` can't serve both: today a Finnish name replaces the
English one outright. So every ingredient gets both names, and the card shows
the one in the chosen language, with the other in smaller letters underneath.

This is for reading only. No accounts, no sharing features: the app is still
single user.

## What to build

**Data.** `Ingredient.name` becomes `{ en: string; fi: string }`, like the rest
of the bilingual content. Either side may be empty, but not both. Validation on
load rejects a name with both sides empty. `searchTermFi` is removed: the
Finnish name now does that job, and the 17 existing `searchTermFi` values move
into `name.fi`.

Recipe titles are not part of this issue. They stay a single string.

**Where the names come from.** Never machine-translated.

- Finnish names: from the ingredient's own satokausi.fi page where there is one
  (its Finnish name is already recorded as the page slug), otherwise from Tia.
  Pantry items with no satokausi.fi page (bread, butter, broth and so on) are
  asked.
- English names: the current English names stay. For ingredients named only in
  Finnish today (Kantarelli, Juolukka, Riekonmarja and the others), the English
  name comes from Tia, or stays empty.
- The proposed names are shown to Tia as one list to approve before any data
  file is written.

**Display.** The name in the interface language is the main line. The name in
the other language sits under it in smaller, quieter text. With the interface
in English: English on top, Finnish underneath. In Finnish: the reverse.

- If one side is empty, the other is shown alone as the main line, with no
  second line.
- If both sides are the same word, only one line is shown.
- This applies to the ingredient card on the home view and in the month view,
  and to the ingredient side panel's heading. Ingredient names inside recipe
  ingredient lists show the main line only, to keep those lists compact.

**Name editing.** Editing an ingredient name in place now edits both sides: two
fields, labeled English and Finnish, written back to the data file through the
same development-only route.

**Logic.** One helper in `lib/` picks the main line and the second line for a
name and a language, so no component decides it on its own.

**Search.** There is no search feature yet. When one is built, it must match an
ingredient by either its English or its Finnish name. This issue only makes that
possible by storing both. Building search is a separate piece of work, to be
added to `docs/PLAN.md` as its own item.

**Recipe search links (issue 019).** These used `searchTermFi`. If 019 is
already built, they switch to `name.fi`, falling back to the English name when
`name.fi` is empty.

## Type

HITL. The Finnish names for pantry items and the English names for Finnish-only
produce come from Tia, and she approves the full name list before it is
written.

## Acceptance criteria

- [ ] `Ingredient.name` is `{ en, fi }` in the type and in all 176 data files,
      and loading rejects a name with both sides empty
- [ ] `searchTermFi` is gone from the type, the validation and the data, with
      its values moved into `name.fi`
- [ ] Every Finnish name comes from satokausi.fi or from Tia, and every added
      English name from Tia, approved as one list
- [ ] Cards and the side panel show the interface language's name on top and
      the other underneath in smaller text, flipping with the language
- [ ] One empty side, or two identical sides, shows a single line
- [ ] In-place editing edits both names
- [ ] `docs/PLAN.md` section 4 type block updated to the `{ en, fi }` name
      (the decision itself is already recorded there)
- [ ] `docs/FLOWS.md` updated for name editing, `docs/RESPONSIVE.md` for the
      two-line card name

## Tests

Test-driven in `lib/`, with fixture names defined in the test:

- Choosing the main and second line: English interface, Finnish interface,
  one side empty, both sides identical.
- Loading rejects a name with both sides empty, and an old plain-string name.

Cards and the panel are checked by eye. The Playwright screenshots are
refreshed.

## Bilingual

Labels for the two editing fields:
`name.edit.en: { en: 'English name', fi: '' }` and
`name.edit.fi: { en: 'Finnish name', fi: '' }`.

## Mobile

The second line wraps under the main line on any width and is never cut off.
It is visually smaller but still at least 14 pixels, so it stays readable on a
phone.

## Blocked by

None technically. In the build order it belongs to step 6, after steps 3, 4 and
5.
