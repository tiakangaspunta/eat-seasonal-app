# Decisions

Short entries, newest last. Why, not just what.

## 2026-09-03 Initial planning

- **Recipes store ingredients, link out for the method.** Customizing recipes for
  vegan versions and seasonal swaps needs the ingredient list as data. Steps are
  the creative part and are not copied.
- **No scraping of Soppa365 or K-Ruoka.** No public API, and it breaks their terms
  of use. Recipes are added one at a time from a URL Tia chooses.
- **Month-level season data, with fresh and storage months separate.** Season
  labels in the UI are derived. Cabbage in March should not claim to be fresh.
- **Drafted months are flagged, not hidden.** Claude cannot know Finnish harvest
  months reliably, so `verified: false` shows a marker in the UI and corrections
  happen in the data file. No verification screen: it would compete with step one
  for no real gain.
- **No in-app add-recipe form yet.** Claude drafting substitutions from a pasted
  URL is faster than typing into a form, and the form is the part that would need
  a bilingual ingredient picker. Reconsidered at the mobile step.
- **Monthly ingredient completion instead of streaks or points.** The goal is to
  make cooking less unpleasant, and a streak punishes a bad week. Monthly reset is
  forgiving and maps directly onto the seasonal goal.
- **Combine offers every in-season ingredient, ranked by shared recipes.** The real
  case is improvising with carrot and wanting a second seasonal ingredient, which a
  shared-recipe-only list cannot serve. Ranking by co-occurrence needs no pairing
  data to maintain and improves as recipes accumulate.
- **Storage interface is async from day one.** Favorites and cooking history have to
  appear on both the kitchen phone and the desk browser, so a hosted database and a
  single-user login are coming. Async now avoids threading promises through the UI
  later.
- **Freely licensed photos, attribution in the data, approved by contact sheet.** An
  appetizing grid is doing motivational work. License accuracy matters more than
  speed, so nothing enters the project unreviewed.
- **Step one covers September only.** A real month with real recipes gives a true
  read on the design, and it keeps the first image review to roughly 15 photos.
- **Testing is narrow: Vitest on `lib/season/` and `lib/storage.ts`.** That is where
  the app can be confidently wrong. Components and routes are restyled constantly
  and are checked by eye, with Playwright limited to screenshots and smoke flows.

## 2026-09-03 After reading the Notion export

- **September is drafted from satokausi.fi and flagged.** The export's calendar
  covers January to April only, and step one is September. Satokausikalenteri is
  the Finnish reference and already the source of several of her recipes, so this
  is a sourced draft rather than a guess, and the unverified marker is exactly the
  case it was designed for.
- **One ingredient holds both domestic and imported months.** The export has
  `Apples` and `Omena (kotimainen)` as separate rows, and gives imported mango and
  citrus their own seasons, so the same produce is often both. Two entries would
  duplicate names, photos, and substitution links, and would show apple twice in
  one grid. `origin` as a single field was wrong and is replaced by an
  `availability` object.
- **Cooking history is not imported.** The Success and Favorites columns hold real
  opinions, but Tia chose a clean start, so they are dropped rather than
  half-migrated.
- **English only for now, with a language fallback.** Descriptive Finnish titles
  are translated, names like Palak paneer are kept, `fi` stays empty until the
  localization step, and any empty field falls back to the other language so
  nothing renders blank.
- **Non-produce ingredients are imported as ingredients, not free text.** Rice,
  cheese, and thyme get category `other` or `herb` and no months, so they never
  appear in seasonal views but recipe ingredient lists stay complete and the
  existing links survive.
- **Recipe ingredient lists are rebuilt from source pages.** The Notion relations
  are too incomplete to use: 5 recipes have none and most have 4 to 6. Rebuilding
  is also where the missing times come from.
- **A `warning` field was added to Ingredient.** The export contains
  `Korvasieni (myrkyllinen!)`. False morel is toxic unless prepared properly, and
  that belongs in the data rather than in Tia's memory.

## 2026-09-03 Editing names in the app

- **Names are editable in the app, and this is a requirement rather than a
  convenience.** Tia does not know the English names of several Finnish
  vegetables, and prefers Finnish for others. An app that only shows names she has
  to look up is worse than the Notion system it replaces.
- **Edits are written into the data files, in dev mode only.** One source of truth,
  visible to Claude Code and to version control, and no second place for names to
  live. The cost is that renaming from a phone waits for step 8, which is
  acceptable while the app runs locally on one machine.
- **Names are a single field, prose stays bilingual.** Forcing an English name for
  palsternakka buys nothing. Notes, warnings, and steps remain `{ en, fi }`,
  because that is where translation does real work. Accepted cost: a Finnish
  interface will show mixed-language names. Migration path if it grates: names
  become `{ en, fi }` at the Finnish step, with the existing value assigned to
  whichever language it already is.
- **Content is JSON, not TypeScript.** A program can safely rewrite a JSON file. A
  `.ts` file with types and comments cannot be rewritten without risking the file,
  and the app now writes to its own content.
- **Renaming never changes an id.** Ids stay English slugs, so recipe links,
  substitutions, and cooking history survive any rename.

## 2026-09-03 Stack confirmed

- **Next.js App Router over Vite plus React.** Vite would be faster to work in, and
  almost everything here is client-side, so it was a real option. Next wins on two
  concrete needs rather than on principle: the dev-mode write route for editing
  names, and the database plus single-user login at step 8. It is also what Tia
  already builds in, so the code reads as familiar. Migrating from Vite at step 8
  was considered and rejected: a migration you can see coming is one to avoid.

## 2026-09-03 Meal type separated from tags

- **`mealType` is its own field on Recipe, not folded into `tags`.** The original
  plan had `'breakfast'` sitting in the same flat list as `'vegan'`, with no `Tag`
  type ever defined and no `'dessert'` at all. Meal type (what course something is)
  and tags (how it's made) are different questions, and a "vegan dinner" filter
  needs both answered independently. `mealType` is an array so one recipe can serve
  more than one purpose, like a soup that's lunch and dinner both.
- **The Notion Type column maps to `mealType`, not `tags`.** Main Course and Light
  become `dinner`, Lunch stays `lunch`, Side Dish and most Salad rows become
  `side`, Breakfast stays `breakfast`. This is a judgment call per recipe, not
  mechanical, so ambiguous rows go in the import report.

## 2026-09-03 Nut category added

- **`nut` is a seventh category, alongside `herb` as non-seasonal.** With the full
  ingredient database in view, most rows are pantry and dairy items that don't fit
  the seasonal concept at all, and lumping everything into `other` would bury nuts
  and seeds among dozens of unrelated items. `nut` gets its own bucket for the same
  reason `herb` already had one: not seasonal, but common and specific enough to be
  worth grouping. Genuinely miscellaneous items, dairy, pantry, condiments, grains,
  stay in `other`.
- **Home view shows only the four seasonal categories.** Tia confirmed the
  priority is the seasonal produce; herbs, nuts, and other non-seasonal
  ingredients are in the database so recipe ingredient lists are complete, and are
  reached through recipes and search, not by browsing the home page.

## 2026-09-03 Herb elevated to a seasonal category

- **`herb` moves from the non-seasonal group to the seasonal one.** It now sits
  alongside `vegetable`, `fruit`, `berry`, and `mushroom`: month data, shown on the
  home view. A fresh herb has a season the same way a vegetable does. Only `nut`
  and `other` stay non-seasonal.
- **The test is whether it's bought fresh with a season, not what Notion filed it
  under.** Notion's Herbs & Spices category mixed fresh herbs with at least one
  dried spice. Cumin moves to `other`. Paprika is ambiguous, since "paprika" in
  Finnish usually means bell pepper and the export already has two separate fresh
  pepper rows; left open for Tia.
- **Unresolved placeholder ingredients are worked out from their recipes' source
  pages, not deleted outright.** `Other unusual` and `Spices` both link to recipes
  with real URLs, so their actual ingredients surface when those recipes are
  rebuilt in step 1 or 2. Only `New Ingredient` (an empty row) and `Other
  mushroom` (its one recipe has no URL to read) are dropped.
- **Origins for the 11 ingredients with no domestic/imported marker are drafted
  from general knowledge and flagged unverified**, the same pattern already used
  for September's calendar, rather than left as an open question Tia can't
  actually answer without the Finnish name in front of her.

## 2026-09-03 Step 1 sliced, all HITL

- **All 11 issues for step 1 are marked HITL, not just the photo approval.** For
  the first step, Tia wants a checkpoint at every slice rather than trusting the
  AFK label anywhere yet. Each issue's HITL reason is specific to that slice
  (foundational review, drafted content, a new flow to react to, a first write to
  the app's own data), not a blanket "ask permission" note.
- Issue files live in `issues/001-project-scaffold.md` through
  `issues/011-smoke-tests-and-screenshots.md`. Dependency order: 1, then 2 and 3 in
  parallel, then 4, then 5, then 6 and 7, then 8, then 9, with 10 running any time
  after 2, and 11 last.

## 2026-09-03 Paprika resolved

- **Paprika is bell pepper, merged into `Peppers`.** Confirmed by Tia. Kept
  separate from `Suippopaprika (kotimainen)`, which is a distinct domestic
  variety, not the same row. `category: vegetable`, merge itself flagged
  `verified: false` since the origin split between the two source rows is a call
  I made, not something Tia stated directly.

## 2026-09-03 Scaffold tooling (issue 001)

- **Scaffolded by hand rather than with `create-next-app`.** The generator adds an
  ESLint setup, a `src/` question, and demo content that would have to be undone,
  and the plan already fixes the folder layout (`data/`, `lib/season/`,
  `lib/storage.ts`, `app/`, `components/`). Versions landed: Next 16 (App Router,
  Turbopack), React 19, Tailwind 4, Vitest 4, TypeScript 7.
- **Tailwind 4 needs no `tailwind.config`.** v4 is configured from CSS: one
  `@import "tailwindcss"` in `app/globals.css` plus the `@tailwindcss/postcss`
  plugin. When theme tokens are needed, they go in that CSS file, not a JS config.
- **Vitest is scoped to `lib/**/*.test.ts` in its config**, so the "not unit
  tested" rule for `components/` and `app/` is enforced by the runner rather than
  by remembering it. `npm test` passes with no tests, which keeps the script
  honest until `lib/season/` exists.
- **Playwright runs one desktop and one mobile project from the start**, since the
  plan wants screenshots at both viewports. It starts `npm run dev` itself, so
  there is no separate server step.
- **`lib/storage.ts` ships as an async interface whose methods throw.** Shape
  first, implementation in step 4. Throwing rather than returning empty data means
  a premature caller fails loudly instead of silently reading nothing.
- **`next dev` appends its own `nextjs-agent-rules` block to `CLAUDE.md`.** It is
  regenerated on every dev run, so it is left in place rather than deleted.
