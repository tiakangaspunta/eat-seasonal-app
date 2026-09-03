---
name: tdd
description: Test-driven development for this project's season logic and storage layer. Use when building or changing seasonality derivation, recipe matching, substitution matching, or the storage layer, or when fixing a bug in any of them. Not used for components or routes.
---

# Test-driven development

## What is tested here, and what is not

This is a personal app, not a product. Testing is deliberately narrow.

**Test-driven (write the test first):**

- `lib/season/` — everything derived from month data: whether an ingredient is in
  season in a given month, fresh versus from storage, a recipe's own season
  derived from its ingredients, ranking recipes by how many seasonal ingredients
  they use, the combine matching, and the substitution near-miss matching. This is
  the layer that can be confidently wrong. An app that says asparagus is in season
  in November, or that hides a recipe that a seasonal swap would have rescued, has
  failed at the one job it has.
- `lib/storage.ts` — favorites, tried entries, and ratings. The behavior that
  matters is persistence: a favorite set on one screen is still set on the next,
  and everything survives a reload. Test against the interface, not against
  `localStorage`, so the same tests still pass when a database replaces it.

**Not tested:**

- `components/` and `app/` — layout, the side panel, the month strip, the grid.
  Correctness means "this reads well and is pleasant to use", which no assertion
  checks. Verify by eye, and with screenshots.
- Anything needing a browser, beyond the smoke flows below.

**Playwright** is here for two narrow things: screenshots at desktop and mobile
viewport sizes, and a handful of smoke flows that prove the app is wired together
(home renders the current month, clicking an ingredient opens the panel with
recipes in it, a filter changes the list). Smoke flows assert on visible text and
roles, never on classes or pixel positions, so restyling does not break them.

If a task touches only untested layers, say so plainly and write no tests. Do not
invent test coverage to look thorough.

## Tooling

- Runner: **Vitest**. `npm test` (watch) and `npm run test:run` (single pass).
- Tests live next to the code they test: `lib/season/inSeason.test.ts`.
- No mocking library, and nothing to mock. There is no backend and no network. If
  you want to mock one of our own modules, the test is aimed at the wrong level:
  move it out to the public interface.
- Seasonality tests use small fixture data defined in the test file, not the real
  seed data in `data/`. Real data changes as the calendar is corrected, and tests
  should not fail because a month was fixed.

## Before you start

For a small change: state in one or two plain-language sentences what behavior you
are about to pin down, then start. Plain language means Tia's words, not the
code's:

> "I'm going to make sure that cabbage in March shows as stored and not fresh, and
> that a March recipe using it is still offered."

For anything larger than a couple of files: write the list of behaviors, show it,
and wait for a yes before writing code.

Tia is not a professional developer. Never present a test plan as a list of
function names or file paths. Questions that only matter to the code, answer
yourself.

## The loop

Work in vertical slices. One test, then the code that passes it, then the next
test. Never write a batch of tests up front.

```
RIGHT                        WRONG
RED to GREEN: test1, impl1   RED:   test1, test2, test3
RED to GREEN: test2, impl2   GREEN: impl1, impl2, impl3
RED to GREEN: test3, impl3
```

Tests written in bulk describe behavior you imagined rather than behavior that
exists. Each test should respond to what the previous cycle taught you.

Per cycle:

1. **RED**: write one test for one behavior. Run it. Confirm it fails, and fails
   for the reason you expect. A test that passes immediately is testing nothing.
2. **GREEN**: write the minimum code that passes it. No speculative extras.
3. Repeat.

## Refactor

Only once everything is green. Never refactor while a test is red.

Look for duplication to extract, and for logic that would be simpler behind a
smaller interface. Run the tests after each step. Per CLAUDE.md, do not refactor
code you were not asked to touch. If something outside the current task looks
wrong, say so and wait.

## Checklist per cycle

```
[ ] Test names a behavior, in words Tia would use
[ ] Test goes through the public interface, not internals
[ ] Test would survive an internal rewrite
[ ] Seasonality tests use fixture data, not the real calendar
[ ] Code is the minimum for this test
[ ] Nothing speculative added
```

See [tests.md](tests.md) for what good and bad tests look like here.
