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

## 2026-09-03 Plain-English summaries are a CLAUDE.md rule, not just a plugin

- **Every response ends with a plain-English summary**, appended after the normal
  technical answer rather than replacing it. Append rather than replace because
  the precise version is still what gets acted on; the summary is for reading.
- **The rule is written into `CLAUDE.md` even though the `claudish-to-english`
  plugin already does this.** The plugin is installed, configured for Windows
  (`llama3.2`, append mode) and verified working: run by hand it returns a clean
  rewrite. But it delivers through a `MessageDisplay` hook, which appears to be a
  Claude Code terminal feature, and this project is worked on through the VSCode
  extension, where the rewrite is generated and then not shown. Writing the rule
  down means the summary arrives regardless of which client is in use.
- **Consequence to watch:** in the terminal, both could fire and produce two
  summaries. Harmless, but if it becomes annoying the fix is to disable the
  plugin, since the CLAUDE.md rule works everywhere and the plugin does not.

## 2026-09-03 Ingredient import (issue 002)

- **The conversion ran once and was not kept as a rerunnable script.** The app
  writes back into `data/ingredients/` (name editing), so a generator that could
  be run again would eventually overwrite Tia's edits with the Notion export. The
  JSON files are the source of truth from now on. Provenance lives in
  `docs/IMPORT-REPORT.md` instead of in a script.
- **One JSON file per ingredient, named by id.** Keeps "adding an ingredient
  means editing a data file and nothing else" literally true, and means the
  dev-mode write route rewrites one small file rather than a 124-entry array.
- **The loader reads the directory rather than a manifest,** for the same reason:
  dropping a file in is the whole operation.
- **Validation throws instead of skipping a bad file.** A silent hole in the data
  would show up as a missing card weeks later; a thrown error shows up now.
- **Three merges Tia settled:** Kevätsipuli with Nippusipuli, Vehnäjauho with
  Flour, Kasvisliemikuutio with Broth. The three tomato products stay separate,
  because they are three different products.
- **Names are English where a common English name exists.** Palsternakka,
  Suppilovahvero, Korvasieni, and Kelta- ja kaurajuuri stay Finnish. Ids are
  English slugs regardless, so any later rename is free.
- **Tomato is `vegetable`, not the `fruit` Notion had.** Same reasoning
  `CATEGORY-REVIEW.md` already applied to red chili: sold and used as a
  vegetable, and the Fruit section of the home view is the wrong place for it.
- **Fresh herbs got no drafted months.** `CATEGORY-REVIEW.md` suggested drafting
  seasons for thyme, basil, and coriander, but Finnish harvest months are not
  something to guess, and it is not in issue 002's scope. They wait for the
  September calendar or step 3.
- **`similarTo` is empty everywhere.** Which produce substitutes for which is a
  judgment about Tia's cooking, so it is not invented during an import.
- **`timeMinutes` on `Recipe` is optional, unlike the plan's `number`.** 19 of the
  30 Notion recipes have no time, and issue 003 imports metadata before slice 5
  fills them in. Making it required would mean inventing 19 numbers.

## 2026-09-03 Recipe search shortcut, not a scraper

- **Declined again: automated scanning of k-ruoka, soppa365, or any recipe site
  for ingredient matches.** Same reasoning as the original recipe-sourcing
  decision. Code that queries a site's search and reads results on its own is
  scraping, regardless of personal-use framing, and k-ruoka's `robots.txt`
  explicitly disallows automated access to its search parameters, confirming the
  concern rather than changing it.
- **Built instead: a plain link that opens each site's own search for an
  ingredient in a new tab.** Nothing fetched or stored, the equivalent of typing
  the search into the address bar. Added to step 3, at Tia's request, alongside a
  third source, yhteishyva.fi.
- **The three search URLs must be confirmed by hand, not guessed.** k-ruoka
  blocks automated tools from even reading its search page, and yhteishyva's
  search URL only resolves once a query actually runs, so neither could be
  verified from outside a real browser. Tia searches "fenkoli" once per site when
  this is built and pastes back the resulting URL.
- **A separate `searchTermFi` field was added to `Ingredient`.** The site
  searches only work in Finnish, and names are a single field that may already be
  English, so an ingredient like fennel needs its Finnish word recorded somewhere
  even if it isn't the display name.

## 2026-09-03 Recipe metadata import (issue 003)

- **The export has 31 rows, not the 30 the plan and the issue both claim.** Both
  CSV variants agree. `Pesto (A ei tykännyt)` was then dropped at Tia's request,
  because its URL pointed at a stuffed-portobello recipe rather than a pesto one
  and the row was marked Not good, so 30 recipes were written after all.
- **`tags` is empty on every recipe.** Notion has no diet or style column, and
  `vegan`, `vegetarian`, and `dairy-free` are all decided by the ingredient list,
  which issue 005 builds. Tagging now would mean guessing at the one thing a
  filter has to be right about.
- **Personal notes do not live in titles.** The dropped Pesto row carried "(A ei
  tykännyt)" in its name; had it stayed, that would have moved to `ownNotes`.
  The same rule applies to any future row.
- **A recipe's meal types can outnumber Notion's Type values, or be fewer.**
  "Light, Main Course, Salad" collapses to `dinner` and `side`, because Light and
  Main Course both mean dinner. The mapping is per recipe, and every judgment
  call is listed in `IMPORT-REPORT.md`.
- **Titles are English where the Finnish was descriptive, except where an
  ingredient name would disagree with itself.** `Suppilovahveropasta` became
  "Suppilovahvero pasta" rather than "Funnel chanterelle pasta", because issue
  002 kept `Suppilovahvero` as the ingredient's display name and the app should
  not use two names for one mushroom.
- **The recipe loader mirrors the ingredient loader rather than sharing code with
  it.** Same directory-as-manifest reading, same throw-on-bad-file validation,
  but the two shapes have almost nothing in common beyond `id`, so a shared
  abstraction would be a wrapper around two unrelated bodies of rules. Revisit if
  a third data type appears.
- **The recipe loader also checks that every `ingredientId` exists.** Nothing
  uses it yet, since the lists are empty, but a recipe pointing at a deleted
  ingredient would surface as a quietly missing match in season logic, which is
  the failure the ingredient loader already refuses to allow.
- **Effort for `Mushroom filling for tacos` came from Tia, not from a guess.** It
  was the one blank Effort in the export, and effort is a judgment about her own
  cooking.


## 2026-09-03 satokausi.fi confirmed as a real, structured source

- **satokausi.fi has a real per-ingredient season breakdown, not just a
  current-month listing.** Each ingredient has its own page at
  `satokausi.fi/raaka-aineet/<name>/` with months tagged storage season, in
  season, or peak season, verified on `porkkana` (carrot). This maps directly
  onto `freshMonths`, `storageMonths`, and `peakMonths`, and is meaningfully
  better than drafting the calendar from general knowledge as originally planned.
- **Reading it is not the same category of thing as the recipe scraping
  question.** It's public reference data, read once per ingredient to extract
  facts, not code built to repeatedly query a site. `robots.txt` doesn't restrict
  it.
- **The actual pulling of this data waits for issue 004, not done in bulk now.**
  Tia chose to keep the work matched to the step in front of us rather than
  front-load the whole calendar. `issues/004-september-calendar.md` now notes
  the sourcing method and that it needs to happen back in the Cowork session,
  since Claude Code likely has no web access itself.

## 2026-09-03 Correction: Claude Code has internet access

- **Wrong assumption fixed.** Two edits earlier today, the CLAUDE.md rule about
  routing internet-dependent issues back through Cowork, and issue 004's sourcing
  note, both assumed Claude Code had no web access. That was wrong, and it was
  never consistent with the plan anyway: the paste-a-URL recipe workflow already
  assumed fetching a page directly. Both are corrected: Claude Code fetches named
  sources itself. The one thing that doesn't change is k-ruoka's `robots.txt`
  blocking its search page from automated tools generally, that's a site policy,
  not a capability gap, and still means the three search-shortcut URLs in step 3
  get confirmed by Tia searching by hand.

## 2026-09-03 September calendar from satokausi.fi (issue 004)

- **Claude Code does have web access in this session, so the Cowork detour was
  not needed.** Issue 004 assumed otherwise. All 73 seasonal ingredients were
  fetched here, one satokausi.fi page each, and the issue's sourcing note is now
  out of date rather than wrong: check before assuming the tool is missing.
- **satokausi.fi's calendar index gave exact URL slugs, so none were guessed.**
  `satokausi.fi/satokausikalenteri/` links every ingredient page. A guessed slug
  is safe in a way guessed data is not — it either 404s or it doesn't — but the
  index made it unnecessary for most.
- **`verified` gained an exception list rather than being flipped or trusted.**
  Tia chose `unverifiedMonths`, so carrot can hold a trusted January from her
  Notion data and a drafted September from satokausi at the same time. Flipping
  the whole ingredient to `verified: false` would have greyed out roughly 70 of
  73 ingredients and thrown away the signal that her own months are trusted;
  treating satokausi as verified outright would have decided on her behalf that
  a published source is as good as her own knowledge.
- **The 28 fresh-versus-storage disagreements were recorded, not resolved.**
  satokausi calls January carrot storage where the Notion import calls it fresh,
  and the same pattern covers most root vegetables and cabbages. Almost
  certainly a shape mismatch: Notion had one availability column, this project
  split it in two, and the import put everything in `freshMonths`. Listed in
  `docs/SATOKAUSI-CONFLICTS.md` for step 3, when the full year lands.
- **Only September was written, though every page shows all twelve months.**
  Tia kept the slice matched to the step. Step 3 re-fetches.
- **Cauliflower, portobello, and shiitake are in storage in September, not
  fresh.** Worth noting because the home view will show them differently from
  the other 43, and cauliflower in particular reads as an autumn vegetable.
- **Two mushrooms are cultivated year-round, which the three-season model has no
  bucket for.** satokausi says button mushroom and oyster mushroom are grown in
  Finland "ympäri vuoden" with no season headings at all. Tia's call: they are
  fresh, because a year-round greenhouse crop genuinely is fresh. The
  consequence, accepted knowingly, is that they will sit in the grid in all
  twelve months once step 3 lands and never read as a seasonal find.
- **Beetroot and turnip are not in season in September, surprising as that is.**
  Beetroot's page lists storage January to April and peak November to December,
  with September under no heading; turnip peaks in July and August and is gone
  by autumn. Tia accepted both readings rather than overriding them. The same
  went for cauliflower being in storage in September rather than fresh: odd for
  a vegetable that reads as autumnal, but coherent with its June fresh season
  and July to August peak.
- **Basil, coriander, and thyme have no satokausi page and were left alone.**
  Its herb section runs to mint, garden cress, dill, and parsley only. Tia chose
  to leave them with no months rather than fill them from her own knowledge or
  hunt a second source now: they drop out of the September grid, and step 3
  sources all three at once alongside the rest of the year.
- **Provenance is tracked per month, not per claim, and bok choy is where that
  bites.** Tia's own data already had September as fresh; satokausi adds that
  September is bok choy's peak. Marking the month drafted would demote her fresh
  claim to say something she did not, so the peak was added and the month left
  verified. The peak marking is therefore sourced but unmarked. Splitting
  provenance per claim would cost more than the one case is worth; revisit only
  if peaks and fresh months start disagreeing often.

## 2026-09-03 A temporary data preview, out of issue order

- **The app was unviewable, so a throwaway preview was built before issue 005.**
  `app/page.tsx` rendered one heading, which meant every review of the seed
  content was a review of JSON. Tia asked to see something even if it looked
  unfinished. The real home view is issue 007, two issues away and behind the
  availability logic in 006, so the choice was between reordering the plan and
  building something deliberately disposable. Disposable won: it unblocks the
  reviewing without pulling design work forward onto content that is not
  finished, and issue 007 deletes it.
- **The preview derives nothing, on purpose.** It prints the stored month arrays
  as coloured squares and never renders a season label, a "fresh now", or a
  recipe's own season. Those belong in `lib/season/`, and a throwaway page is
  exactly where a second, quietly disagreeing copy of that logic would take
  root. The cost is that it reads as a data table rather than an app, which is
  the right trade for a page with a delete date.
- **It lives at `/preview`, not at `/`.** The home route keeps its scaffold plus
  a link, so issue 007 builds into an empty route rather than deleting work.
