# Good and bad tests

Examples use this project's own code: the season logic in `lib/season/` and the
storage layer in `lib/storage.ts`.

## Good tests

Test the behavior Tia would describe, through the public interface.

```typescript
// GOOD: names a behavior, uses the public interface
test('cabbage in March is available but not fresh', () => {
  expect(availability(cabbage, 3)).toEqual({ available: true, source: 'storage' })
})

// GOOD: describes the derivation in plain terms
test('a recipe is out of season when one required ingredient is unavailable', () => {
  expect(recipeMonths(nettleSoup, ingredients)).not.toContain(11)
})

// GOOD: the near-miss rule, which is the whole point of substitutions
test('a recipe missing one ingredient is offered when a seasonal swap exists', () => {
  const matches = recipesForMonth(3, recipes, ingredients)
  expect(matches).toContainEqual(
    expect.objectContaining({ id: 'root-gratin', swapped: ['parsnip'] })
  )
})

// GOOD: persistence stated as behavior, tested at the interface
test('a favorite survives a reload', () => {
  toggleFavorite('root-gratin')
  expect(getUserData().favorites).toContain('root-gratin')
})
```

Characteristics:

- Describes what the system does, not how.
- Goes through the public interface only.
- Survives an internal rewrite.
- One logical assertion.
- Uses small fixture ingredients defined in the test, not the real calendar.

## Bad tests

```typescript
// BAD: asserts on internals. monthsToBitmask is a private helper; renaming it
// breaks this test even though nothing Tia sees has changed.
test('availability calls monthsToBitmask', () => { ... })

// BAD: reaches past the interface. If the stored shape changes, this fails
// while the behavior is fine.
test('toggleFavorite writes to localStorage', () => {
  toggleFavorite('root-gratin')
  expect(JSON.parse(localStorage.getItem('userData')!).favorites).toContain('root-gratin')
})

// BAD: pinned to the real seed data. Fixing carrot's calendar breaks this test
// for no good reason.
test('September has 14 seasonal vegetables', () => { ... })
```

Red flags:

- Testing a private helper.
- Reading `localStorage` or raw state instead of using the storage interface.
- Asserting how many times something was called.
- Importing from `data/` instead of defining fixtures.
- The test breaks on a refactor when no behavior changed.
- The test name describes code rather than behavior.

## A note on shared state

The storage layer is a module-level singleton over browser storage, so one test's
writes are visible to the next. Reset in a `beforeEach` (`resetUserData()`) so
each test states its own starting conditions. A test that only passes when run
after another test is worse than no test.
