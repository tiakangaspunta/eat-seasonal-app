---
name: write-a-prd
description: Generate a PRD from a brief and write it as a local markdown file in issues/. Use only for a change big enough to need one, not for everyday work.
---

This skill is invoked when the user wants to create a PRD. You may skip steps you
do not consider necessary.

Use it only for a change large enough to warrant it. `docs/PLAN.md` is already the
brief for the planned build steps, so most work needs no PRD: one screen, one
feature, one fix. If the request is that size, say so and just do the work. A PRD
is worth writing for something the plan does not cover, or for a step whose shape
is still genuinely unclear.

1. Ask the user for a long, detailed description of the problem they want to solve
   and any ideas they have for solutions.

2. Explore the repo to verify their assertions and understand the current state.
   Read `docs/PLAN.md` and `docs/DECISIONS.md` first, and look at the existing
   data files in `data/` to confirm the current schema. Anything the brief assumes
   about Finnish seasonality or about Tia's own cooking that is not already
   documented is an open question for her, not something to fill in.

3. Interview the user relentlessly about every aspect of this plan until you reach
   a shared understanding. Walk down each branch of the design tree, resolving
   dependencies between decisions one by one. One question at a time.

4. Sketch out the parts you will need to build or modify, using this project's
   layers: seed content (`data/`), derived logic (`lib/season/`), persistence
   (`lib/storage.ts`), routes and shell (`app/`), and UI (`components/`). Keep the
   layers separate. The test of a good design here is that adding an ingredient or
   a recipe means editing a data file and nothing else.

   Where logic lands in `lib/`, aim for a small interface hiding the complexity,
   because that is what can be tested cleanly at its boundary.

   Check with the user that this matches their expectations, in plain language
   rather than file paths.

5. Once you have a complete understanding of the problem and solution, use the
   template below to write the PRD as a local markdown file at `issues/prd.md`,
   or `issues/prd-<topic>.md` if one already exists. Create `issues/` if needed.
   Do not submit a GitHub issue or call any external service.

<prd-template>

## Problem statement

The problem Tia is facing, from her perspective.

## Solution

The solution, from her perspective.

## User stories

A long, numbered list of user stories, each in the format:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As someone who dislikes cooking, I want to see what is in season this month at a glance, so that I can decide what to make without researching it first.
</user-story-example>

This list should be extensive and cover all aspects of the feature.

## Implementation decisions

A list of decisions made. This can include:

- The modules that will be built or modified
- The interfaces of those modules
- Technical clarifications from the session
- Architectural decisions
- Schema changes, especially to `Ingredient`, `Recipe`, and `Substitution`
- Specific interactions

Do not include specific file paths or code snippets. They go out of date fast.

## Bilingual impact

Which new user-facing strings this adds, and confirmation that each is an
`{ en, fi }` field with `fi` left empty until the localization step.

## Mobile impact

For each new layout, one line on what it becomes on a narrow screen. This goes
into `docs/RESPONSIVE.md` when the work is built.

## Testing decisions

Which behaviors in `lib/season/` and `lib/storage.ts` will be test-driven,
described in plain language. Components and routes are not unit tested; they are
checked by eye and covered by a smoke flow where it is worth it. See the `tdd`
skill for the rules and for existing tests to follow.

If this PRD touches no season logic and no storage, say so here in one line rather
than inventing coverage.

## Out of scope

What is out of scope, including anything `docs/PLAN.md` defers to a later step, so
the reasoning is not relitigated later.

## Further notes

Anything else.

</prd-template>
