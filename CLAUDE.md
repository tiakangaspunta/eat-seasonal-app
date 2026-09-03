# Working rules for this project

Read `docs/PLAN.md` before doing anything. It is the brief.

## Ways of working

- Build in the steps listed in `docs/PLAN.md`. One step at a time. Do not start
  work belonging to a later step.
- Step 1 is sliced into issue files under `issues/`, numbered in dependency
  order. Work one issue at a time, in order, respecting each issue's "Blocked
  by". Every issue in step 1 is currently marked HITL: stop at the end of each
  one, show what was built, and wait for Tia before starting the next. When a
  later step needs slicing too, use the `prd-to-issues` skill.
- Ask when something is unclear rather than guessing at product behavior.
- Never commit and never push without explicit approval. Staging and showing a
  diff is fine, committing is not.
- Propose, then build. For anything beyond a small fix, say what you plan to
  change and wait.
- Two things are never guessed, because only Tia can settle them: facts about
  Finnish seasonality that are not already in `data/` or the plan, and judgments
  about her own cooking (what is easy, what is worth the effort, which
  substitutions she would accept). Ask.
- If an issue needs something fetched from the internet (a source page, a
  reference site) and you have no web access here, say so plainly and ask Tia to
  get it from her Cowork session, which does. Never draft data from memory as a
  substitute for a real source the issue names.

## Responses

- Every response ends with a plain-English summary, under an `In plain English:`
  heading, after the normal answer. The technical answer stays exactly as it is.
  The summary is added to it, never substituted for it.
- The summary says what was done and why it matters, in everyday language: no
  file paths, no commands, no jargon. Where a technical word is unavoidable, say
  what it means in the same sentence.
- Real names stay real. GitHub is GitHub, not "your online copy". The terminal is
  the terminal. Plain English means fewer unexplained ideas, not renaming things
  Tia already knows: paraphrasing a familiar proper noun makes a summary harder
  to follow, not easier, and reads as talking down.
- Skip it only when the whole response is already one or two plain sentences and
  the summary would just repeat them.
- Tia has the `claudish-to-english` plugin installed, which does this same job.
  It works, but it renders through a `MessageDisplay` hook, which appears to be
  a Claude Code terminal feature and does not show in the VSCode extension. The
  rule lives here so the summary arrives whatever the plugin does.

## Layers

- `data/` seed content: ingredients and recipes as typed data.
- `lib/season/` derived logic: availability by month, fresh versus stored, a
  recipe's own season, combine matching, substitution near-miss matching.
- `lib/storage.ts` persistence: favorites, tried, ratings, behind one interface.
- `app/` routes and shell.
- `components/` UI.

Keep them separate. The test of a good design here is that adding an ingredient or
a recipe means editing a data file and nothing else.

## Language and content

- All code, ids, keys, comments, and commit messages in English.
- Every user-facing string is a `{ en, fi }` object. Fill `en` now, leave `fi`
  as an empty string until the localization step, never machine-translate it
  silently.
- Do not copy cooking steps from external recipe sites. Ingredients, tags,
  substitutions, and personal notes only, plus a link to the source.

## Documentation

- `docs/PLAN.md`: the brief. Update it when a decision changes.
- `docs/FLOWS.md`: Mermaid flowcharts of the user flows. Update the diagram in
  the same change that alters a flow, so flows can be reviewed by reading rather
  than by clicking through the app.
- `docs/RESPONSIVE.md`: for every layout built for desktop, one line saying what
  it becomes on mobile. Written at the time the layout is built, not later.
- `docs/DECISIONS.md`: short dated entries for choices worth remembering, with
  the reason.

## Code

- Next.js App Router, TypeScript, Tailwind CSS.
- Tailwind mobile-first: unprefixed classes are the mobile case, `md:` and up
  add the desktop case.
- No fixed pixel widths on layout containers. No hover-only interactions.
  Touch targets at least 44 by 44 pixels.
- Seasonality, season labels, and a recipe's own season are always derived in
  `lib/season/` from ingredient month data. Never hand-typed in two places.
- All persistence goes through `lib/storage.ts`. No component touches
  `localStorage` directly.
- External links open in a new tab (`target="_blank"` with
  `rel="noopener noreferrer"`). Internal navigation stays in the same tab.
- No database, no ORM, and no hosting decisions until step 8.

## Testing

Narrow on purpose. Full rules in the `tdd` skill.

- Test-driven with Vitest: `lib/season/` and `lib/storage.ts`. These are where the
  app can be confidently wrong.
- Not unit tested: `components/` and `app/`. Checked by eye.
- Playwright for two things only: screenshots at desktop and mobile viewports, and
  a handful of smoke flows proving the app is wired together. Smoke flows assert
  on visible text and roles, never on classes or pixel positions.
- Seasonality tests use fixture data defined in the test, not the real calendar in
  `data/`.
- If a task touches only untested layers, say so and write no tests.

## Skills

`.claude/skills/` holds four skills, adapted to this project:

- `grill-me`: stress-test a plan or design, one question at a time.
- `tdd`: the testing rules above, in full.
- `prd-to-issues`: slice a big build step into local issue files in `issues/`.
  Used for step 1 and step 5, not for everyday work.
- `write-a-prd`: only for something `docs/PLAN.md` does not already cover.

`docs/PLAN.md` is the source of scope. A PRD is the exception, not the routine.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
