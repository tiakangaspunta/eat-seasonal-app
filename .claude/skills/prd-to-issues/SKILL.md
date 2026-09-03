---
name: prd-to-issues
description: Break a build step or a PRD into independently-workable issues and write each as a local markdown file in issues/. Use for a change big enough that it needs dividing into steps, not for everyday work.
---

# Brief to issues

Break a build step, or a PRD, into independently-grabbable issues using vertical
slices (tracer bullets), written as local markdown files.

## When to use this

Only when a change is large enough that it needs dividing. In this project that
means a whole build step from `docs/PLAN.md` section 8, most likely step 1
(seasonal home) and step 5 (combine). Ordinary work, one screen or one data file
or one fix, does not need issues. Say so rather than generating ceremony for a
small job.

`docs/PLAN.md` is the source of scope. There does not need to be a PRD: slicing a
step straight out of the plan is the normal case, and `write-a-prd` is only for
something the plan does not cover.

## Process

### 1. Locate the brief

Ask which build step is being sliced, or which PRD file (for example
`issues/prd.md`). Read `docs/PLAN.md` and `docs/DECISIONS.md` if this session has
not already.

### 2. Explore the codebase

Confirm the current state: the types and seed data in `data/`, what exists in
`lib/season/`, and which screens are already built.

### 3. Draft vertical slices

Each issue is a thin slice that cuts end to end through the layers it touches, not
a horizontal slice of one layer. The layers here are: seed content (`data/`),
derived logic (`lib/season/`), persistence (`lib/storage.ts`), routes and shell
(`app/`), and UI (`components/`).

Slices may be **HITL** or **AFK**. HITL needs Tia: a fact about Finnish
seasonality that is not yet documented, a judgment about her own cooking, a look
at whether a screen feels right, a product decision. AFK can be built and finished
without her. Prefer AFK, but be honest: anything depending on the seasonal
calendar or on her taste is HITL by definition, because CLAUDE.md forbids guessing
those.

<vertical-slice-rules>
- Each slice delivers a narrow but complete path through every layer it touches
- A completed slice is demoable on its own, it can be shown on screen
- Prefer many thin slices over few thick ones
- Per slice, note whether it touches `lib/season/` or `lib/storage.ts`; those are
  test-driven (see the `tdd` skill). Components and routes are not
- Per slice, note any new user-facing strings, which must be `{ en, fi }` fields
- Per slice, note what its layout becomes on mobile
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL or AFK
- **Blocked by**: which other slices, if any, must complete first
- **Covers**: which part of the build step or which user stories this addresses

Ask her:

- Does the granularity feel right, too coarse or too fine?
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked HITL and AFK?
- Is anything here beyond what this step needs? The plan's scope rules win.

Iterate until she approves the breakdown.

### 5. Create the issue files

For each approved slice, write a markdown file in `issues/` named
`issues/NNN-short-title.md`, for example `issues/001-ingredient-side-panel.md`.

Number from the next available number. Check both `issues/` and `issues/done/`
for the highest existing number and continue above it. Completed issues move to
`done/`, and their numbers are never reused.

Create files in dependency order, blockers first, so cross-references point at
real filenames.

Everything stays local. No `gh issue create`, no GitHub CLI, no GitHub issue
numbers.

<issue-template>
## Parent

`docs/PLAN.md` step N, or `issues/prd.md`.

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior,
not layer-by-layer implementation. Reference the plan rather than duplicating it.

## Type

HITL or AFK, with one line on why.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Tests

Which behaviors in `lib/season/` or `lib/storage.ts` this slice pins down with
tests, in plain language, or "none, this slice is UI only".

## Bilingual

New user-facing strings this adds, as `{ en, fi }` keys with `fi` left empty.

## Mobile

What this slice's layout becomes on a narrow screen, one line, to be copied into
`docs/RESPONSIVE.md`.

## Blocked by

- Blocked by `issues/NNN-title.md`, if any.

Or "None, can start immediately".

</issue-template>

Do not close or modify the parent brief. Per CLAUDE.md, do not commit anything.
