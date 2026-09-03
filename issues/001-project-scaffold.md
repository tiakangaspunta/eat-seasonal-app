## Parent

`docs/PLAN.md` step 1 (September, done properly).

## What to build

A running Next.js App Router project with TypeScript and Tailwind CSS, the folder
layout the plan assumes (`data/`, `lib/season/`, `lib/storage.ts` as a stub,
`app/`, `components/`), and Vitest and Playwright both wired up and runnable.
No product features yet. This is what everything else is built on.

## Type

HITL. Tia confirms the setup and tooling before anything is built on top of it.

## Acceptance criteria

- [ ] `npm run dev` serves an empty home page with no errors
- [ ] `npm test` runs Vitest (even with zero tests) and exits clean
- [ ] Playwright is installed and a trivial smoke test can run
- [ ] `data/`, `lib/season/`, `lib/storage.ts`, `app/`, `components/` exist
- [ ] `lib/storage.ts` exports the async interface shape from the plan, unimplemented

## Tests

None yet. This slice is setup only.

## Bilingual

None.

## Mobile

None yet, nothing rendered.

## Blocked by

None, can start immediately.
