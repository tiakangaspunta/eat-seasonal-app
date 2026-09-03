# Eat seasonal app: plan

Status: planned, nothing built. This document is the brief for Claude Code.
Decisions and their reasons are logged in `DECISIONS.md`.

## 1. Goal

A personal web app that makes it easy, and a bit fun, to cook with produce that is
in season in Finland. It replaces a Notion system that works but takes too much
manual upkeep. Two motivations: lower environmental and financial cost, and
gamifying cooking for someone who does not enjoy it.

Single user for now. Sharing it with other people is out of scope, but the data
model should not make it impossible later.

## 2. Decisions

| Topic | Decision |
| --- | --- |
| Seasons | What is in season in Finland |
| Default view | Domestic produce, grouped by vegetable, fruit, berry, and mushroom |
| Season precision | Month-level data, friendly season labels in the UI |
| Calendar source | Notion export (January to April, verified), September drafted from satokausi.fi and flagged unverified |
| Origin | One ingredient per produce, holding separate domestic and imported month sets |
| Language | English only for now, Finnish as a later pass. Prose is bilingual, names are a single field in whatever language Tia prefers |
| Editing | Ingredient and recipe names and notes are editable in the app, written back into the data files in dev mode |
| Content format | JSON files under `data/`, typed and validated on load, so the app can write to them |
| Platform | Desktop first, built so mobile is an adaptation and not a rewrite |
| Recipe content | Ingredients, tags, substitutions, and personal notes in the app. Method links out |
| Recipe classification | Meal type (breakfast, lunch, dinner, dessert, side, snack) is its own field, separate from diet and style tags |
| Adding recipes | Paste a URL to Claude Code, it writes the data file. No in-app form for now |
| Images | Freely licensed photos per ingredient, attribution stored, approved by contact sheet |
| The game | Monthly ingredient completion, driven by "tried this" |
| Cooking history | Not imported from Notion. The app starts clean |
| Saved data | Browser local storage first, behind an async interface, hosted database later |
| Sync | Same data on every device eventually, so a single-user login is coming |
| Database | Deliberately undecided |
| Navigation | Clicking an ingredient opens a side panel, not a new page |
| Combine | Pick two or more in-season ingredients, see recipes using all of them |

## 3. Recipe content and sourcing

The app must let recipes be customized: how to make something vegan, and how to
swap ingredients so a recipe fits the current season. That needs the ingredient
list in the app, which drives the design below.

- Ingredient lists are stored as structured data. They power season matching,
  filters, and substitutions, and a list of ingredients with amounts is factual
  rather than creative.
- Cooking steps are not copied from other sites. The recipe card links to the
  original method and opens it in a new tab. Recipes written from scratch can have
  full steps in the app.
- Substitutions and personal notes are original content and live in the app.

Neither Soppa365 nor K-Ruoka offers a public API, and scraping their recipes
breaks their terms of use, so the app does not do it.

**How a recipe gets added.** Tia pastes a source URL into Claude Code. Claude
reads that page, extracts the ingredient list, maps each ingredient to the
calendar, proposes tags, time, and effort, and drafts the vegan and seasonal
substitutions. Tia approves or corrects, and Claude writes the entry into
`data/recipes/`. This is a per-recipe reading of a page Tia chose, for her own
records, not bulk collection.

An in-app add and edit form is deferred, not rejected. It gets reconsidered at the
mobile step, since adding a recipe from the kitchen is the case that would justify
it. Document the workflow in `docs/ADDING-RECIPES.md`.

## 4. Data model

Ids are English slugs. Content lives as JSON files under `data/`, typed by these
interfaces and validated when loaded, because the app writes back to them (see
section 6).

**Names are a single field**, in whatever language Tia finds usable. Some Finnish
produce has no English name she knows, and being forced to invent one would make
the app harder to use than the Notion system it replaces. So `name` and `title`
are plain strings, and a mixed-language list is the accepted cost.

**Prose is bilingual.** Notes, warnings, substitution notes, and any recipe steps
are `{ en, fi }` objects, with `en` filled now and `fi` left empty, and an empty
field falling back to the other language so nothing renders blank. This is where
translation actually earns anything.

The tradeoff, stated plainly: at the Finnish step, switching the interface to
Finnish will not translate names, so a list will read half English and half
Finnish. If that turns out to matter, names migrate to `{ en, fi }` at that point,
with the existing single value going into whichever language it already is. That
migration is a one-time pass over the data files, which is cheap. Paying for
bilingual names now, before knowing whether the mixture bothers her, is not.

### Ingredient

```ts
type Ingredient = {
  id: string                     // "carrot"
  name: string                   // display name, any language, editable in the app
  category: 'vegetable' | 'fruit' | 'berry' | 'mushroom' | 'herb' | 'nut' | 'other'
  availability: {
    domestic?: {
      freshMonths: number[]      // 1 to 12, harvested or picked fresh in Finland
      storageMonths: number[]    // available from Finnish storage, not fresh
      peakMonths?: number[]      // best quality and price
    }
    imported?: {
      months: number[]           // when imported stock is good and reasonably priced
    }
  }
  verified: boolean              // false means Claude drafted these months
  unverifiedMonths?: number[]    // the exception list: months drafted from a
                                 // source, on an otherwise verified ingredient
  similarTo: string[]            // ingredient ids that can stand in for this one
  image?: IngredientImage
  notes?: { en: string; fi: string }
  warning?: { en: string; fi: string }   // preparation that matters for safety
  searchTermFi?: string          // Finnish word, only needed if name isn't already Finnish
}

type IngredientImage = {
  file: string                   // path under public/images/ingredients/
  author: string
  license: string                // "CC BY-SA 4.0", "public domain"
  sourceUrl: string
}
```

`freshMonths` and `storageMonths` are separate so the app can be honest: cabbage
in March is stored, not fresh. Season labels shown in the UI are derived from
`freshMonths`, never hand-typed.

Domestic and imported months live on the same ingredient rather than on two
entries, because the same produce is often both. Apple has Finnish fresh months, a
long Finnish storage season, and a separate window when imported apples are worth
buying. The domestic-by-default setting filters which month set counts, not which
ingredients exist, so apple never appears twice in one grid.

An ingredient with no `domestic` at all is imported-only, such as lemon or mango.

`vegetable`, `fruit`, `berry`, `mushroom`, and `herb` are the seasonal categories:
the ones with month data, filtered by month, and grouped on the home view. Fresh
herbs, thyme, basil, parsley, coriander, are produce with a season the same way a
vegetable is, so herb belongs with them rather than with the pantry categories.

`nut` and `other` carry no months and never appear in month-based filtering or the
home view. They exist so recipe ingredient lists are complete, and are found
through recipes and search rather than by browsing. `nut` is its own category, not
folded into `other`, because there will be enough of them to be worth grouping and
possibly filtering on later; everything else non-seasonal, dairy, pantry,
condiments, grains, stays in `other`.

A dried spice is not a seasonal herb even when Notion filed it under Herbs &
Spices. Cumin, for instance, moves to `other`. The test is whether it is bought
fresh with a season, not what drawer it lives in.

The seasonal produce is the priority. Non-seasonal ingredients are recorded
because recipes need them, not because they're a feature in their own right.

`warning` is for the small number of ingredients where preparation is a safety
matter rather than a preference. Korvasieni, false morel, is the case in the
existing data: toxic unless boiled properly, and the app should say so wherever it
appears rather than treating it as an ordinary mushroom.

`verified: false` renders a small marker wherever the ingredient appears, so a
drafted month is never mistaken for a trusted one. Corrections are made by editing
the data file, at which point the flag flips. The marker disappearing over time is
its own progress bar. No verification screen is built.

One boolean per ingredient turned out to be too coarse, because an ingredient can
hold trusted and drafted months at once: carrot's January came from Tia's own
Notion data and its September was sourced from satokausi.fi. `unverifiedMonths` is
the exception list for exactly that case. A month is trusted when `verified` is
true and the month is not in `unverifiedMonths`; when `verified` is false the
whole ingredient is drafted and the list is not used.

**Calendar source.** Each ingredient has its own page on satokausi.fi at
`satokausi.fi/raaka-aineet/<finnish-name>/`, with a real month breakdown into
Varastosesonki, Sesongissa, and Huippusesonki, mapping onto `storageMonths`,
`freshMonths`, and `peakMonths`. That is the source for every month this project
adds, rather than general knowledge. Where it contradicts the Notion import, the
Notion months stand and the disagreement is recorded in
`docs/SATOKAUSI-CONFLICTS.md`.

Every image carries its attribution in the data, and an attribution list is
rendered somewhere in the app. Images are approved before they enter the project:
Claude finds candidates on Wikimedia Commons and Openverse, builds a single
contact sheet page showing all of them with author and license, and only approved
ones are downloaded.

### Recipe

```ts
type Recipe = {
  id: string
  title: string                            // any language, editable in the app
  source?: { name: string; url: string }   // method lives here, opens in new tab
  ingredients: RecipeIngredient[]
  steps?: { en: string[]; fi: string[] }   // only for own recipes
  ownNotes?: { en: string; fi: string }    // how to make it vegan, what to watch for
  mealType: MealType[]                     // breakfast, lunch, dinner, dessert, side, snack
  tags: Tag[]                              // diet and style only: 'vegan', 'vegetarian', 'dairy-free', 'quick', ...
  timeMinutes: number
  effort: 'easy' | 'medium' | 'hard'
  servings?: number
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'side' | 'snack'

type RecipeIngredient = {
  ingredientId?: string                  // set when it maps to a known ingredient
  freeText?: string                      // "soy sauce", not seasonal, not tracked
  quantity?: number
  unit?: string
  optional?: boolean
  substitutions?: Substitution[]
}

type Substitution = {
  use: { ingredientId?: string; freeText?: string }
  reason: 'vegan' | 'dairy-free' | 'seasonal' | 'pantry' | 'preference'
  ratio?: string                          // "1:1", "half the amount"
  note?: { en: string; fi: string }
}
```

`mealType` is kept separate from `tags` on purpose: one is what course a recipe
is, the other is a property of how it's made. A filter for "vegan dinners" is then
two clean filters, `mealType` and `tags`, instead of guessing which strings in one
flat list mean what. A recipe can have more than one meal type, since a soup can
be lunch and dinner both.

A recipe's own seasonality is derived, never stored: the months in which all of
its non-optional, mapped ingredients are available. A recipe that misses the
current month by one ingredient is still offered when that ingredient has a
seasonal substitution, marked as swapped. That near-miss rule is what makes
substitutions earn their place.

### User data

```ts
type UserData = {
  favorites: string[]                    // recipe ids
  tried: Array<{
    recipeId: string
    date: string                         // ISO
    rating: 1 | 2 | 3 | 4 | 5
    note?: string
    ingredientIds: string[]              // seasonal ingredients this cook covered
  }>
}
```

All reads and writes go through `lib/storage.ts`. Because the same data must
eventually appear on every device, that interface is **async from day one**
(`await getUserData()`), even though the first implementation is synchronous
browser storage. That costs nothing now and avoids threading promises through the
UI later. Moving to a database means writing a second implementation and changing
one import.

`ingredientIds` on a tried entry is what drives the monthly progress, and it is
recorded at cook time rather than derived later, so editing a recipe never
rewrites history.

Notion's Success and Favorites columns are not imported. The app starts clean.

## 5. The game

Monthly ingredient completion. The home view shows something like "you have cooked
with 6 of September's 14 seasonal ingredients", with the uncooked ones visibly
distinct so they read as an invitation rather than a reproach. It resets each
month, so a bad week is forgotten. No streaks, no points, no badges: a streak
punishes a week of takeout, which is a strange thing to build into an app meant to
make cooking less unpleasant.

It needs no bookkeeping beyond `tried`. A yearly collection view is a possible
later addition and is not planned now.

## 6. Editing in the app

Ingredient names, recipe titles, and notes are editable in the app. This is not a
convenience: without it the app is unusable for produce Tia knows only by its
Finnish name.

- Click a name in the ingredient panel or recipe panel to edit it in place. No
  separate edit mode, no form.
- The change is written straight into the JSON file in `data/`, through an API
  route that exists **only when running in development**. In a production build
  the route is absent and names are read-only.
- One source of truth: renames are visible to Claude Code, survive a browser
  change, and go into version control with everything else.
- Renaming never changes an ingredient's `id`, so recipe links and cooking
  history are unaffected. Ids stay English slugs even when the display name is
  Finnish.
- Editing does not touch the `verified` flag. A name and a season are different
  claims.

This is why content is JSON rather than TypeScript: a program can rewrite a JSON
file safely, and a `.ts` file with types and comments in it cannot be rewritten
without risking the file.

Editing from a phone is out of scope until step 8, when a database makes it
possible everywhere. The same applies to any wider add-recipe form, which is still
deferred.

## 7. Screens and flows

### Home

1. Opens on the current month, named and labeled with its season.
2. Monthly completion progress at the top.
3. Domestic produce only by default, with a toggle for imported.
4. Grouped into vegetable, fruit, berry, mushroom, and herb sections. These are the
   only five categories the home view ever shows: nuts and other non-seasonal
   ingredients have no season to group by and are found through recipes and
   search instead.
5. Each ingredient is a card with photo, name, season label, whether it is fresh
   or from storage this month, an unverified marker if drafted, and a cooked
   marker if this month's progress includes it.
6. A month strip along the top jumps to any other month.
7. Clicking an ingredient opens the side panel.

### Ingredient side panel

Slides in from the right, main content stays visible behind it.

- Photo, name, category, season label, and fresh and storage months as a small
  twelve-month bar.
- Recipes using this ingredient, filterable.
- The combine control (see below).
- Similar ingredients, so the panel can suggest a swap.

The panel's layout reserves room for the combine control from step one, even
though the logic lands in step five.

### Combine

The case it serves: planning something with carrot, and wanting to know which
other seasonal ingredient could go in too, to get more out of one shop.

The control lists **every ingredient in season this month**, ordered by how many
recipes it already shares with carrot, with that count shown. All in-season
ingredients appear, not only ones with a shared recipe, because the interesting
case is often improvising with no recipe at all. The ordering gets smarter on its
own as recipes accumulate, and there is no pairing list to maintain.

Selecting one or more partners narrows the recipe list to recipes using all
selected ingredients, near-misses included and marked.

### Month view

Clicking a month shows recipes whose ingredients are all in season that month,
sorted by how many seasonal ingredients they use. Same filters as elsewhere.

### Recipe card and recipe panel

Card: title, time, effort, meal type, tags, and which seasonal ingredients it hits.
Panel: full ingredient list with substitutions inline, personal notes, a prominent
link to the original method opening in a new tab, plus favorite, "tried this", and
a one to five star rating.

### Filters

Season or month, meal type, effort, time needed, tags, and origin. Filter state
lives in the URL query string so a filtered view can be linked and reloaded.

### Recipe search shortcut

Not a scraper, and not scanning the internet. A link, next to an ingredient, that
opens k-ruoka, soppa365, or yhteishyva's own search for that ingredient in a new
tab, so browsing those sites for inspiration is one click shorter. Nothing is
fetched, read, or stored by the app; the click just hands off to the site the way
typing the same search into the address bar would.

Each site's search URL must be confirmed by hand before this is built: open the
site, search a known Finnish term (e.g. "fenkoli"), and note the resulting URL.
k-ruoka's own `robots.txt` blocks automated tools from even reading its search
page, so this genuinely can't be discovered any other way, and guessing risks a
dead link. This is a small addition to step 3, not its own step.

Because the search has to run in Finnish, an ingredient needs a Finnish search
term available even when its display `name` is English. `Ingredient` gets an
optional `searchTermFi`, filled in only where the display name isn't already
Finnish.

## 8. Mobile adaptation

Desktop is built first, but every layout decision is written down at the time it is
made, in `docs/RESPONSIVE.md`, in this form:

- Home grid: four columns on desktop, two on tablet, one on mobile.
- Side panel: a right-hand panel on desktop, a full-height bottom sheet on mobile.
- Month strip: a horizontal row on desktop, a horizontally scrolling row with the
  current month centered on mobile.
- Ingredient panel content: recipe list beside ingredient details on desktop,
  stacked with details above recipes on mobile.
- Combine control: an inline list on desktop, a sheet on mobile.
- Name editing: click to edit in place on desktop, tap and hold on mobile, with the
  field never narrower than the text it holds.
- Filters: a persistent sidebar on desktop, a modal sheet behind a filter button
  on mobile.

Rules that keep this cheap: Tailwind mobile-first classes, no fixed pixel widths on
containers, no hover-only interactions, and touch targets of at least 44 by 44
pixels from the start.

## 9. Stack

- Next.js with the App Router and TypeScript. Confirmed over Vite because the
  dev-mode name editing needs a server route now, and step 8 needs a database and
  a single-user login, both of which Next covers without extra pieces.
- Content is read in server components and passed down. The interactive parts, the
  side panel, filters, combine, favorites, and inline editing, are client
  components. Keep the boundary shallow: one client component per interactive area
  rather than a client tree.
- Tailwind CSS.
- Seed content as JSON files in `data/`, typed and validated on load, no database.
- Derived logic in `lib/season/`, persistence behind `lib/storage.ts`.
- Vitest for the season logic and the storage layer, test-driven from step one.
- Playwright for screenshots and a few smoke flows only. See the `tdd` skill.
- Localization as a simple dictionary plus the `en` and `fi` content fields. A
  library such as next-intl can come later without touching the data shape.

## 10. Build steps

Each step ends with something runnable, tests for whatever season logic or storage
it added, and an updated flow diagram. Nothing from a later step is started early.
Steps 1 and 5 are big enough to be sliced into issue files first, using the
`prd-to-issues` skill.

**Step 1: September, done properly**
Project setup, the types above, and real content for the current month only.
The Notion import (`docs/NOTION-IMPORT.md`) brings in all 132 ingredients and 30
recipes with their verified January to April months. September ingredients are
drafted from satokausi.fi and flagged unverified. Photos for September's
ingredients are approved via contact sheet. Around 10 recipes have their ingredient
lists rebuilt from their source pages, chosen because they use September produce.
Home view grouped and filtered to domestic, with the ingredient side panel opening
and listing recipes. Other months are deliberately thin. This is the step to react
to before anything else is built.

**Step 2: recipes and editing**
Recipe panel, ingredient list with substitutions inline, personal notes, source
link opening in a new tab, editable recipe titles and notes, and the paste-a-URL
workflow documented in `docs/ADDING-RECIPES.md`.

**Step 3: the rest of the year**
Full twelve-month calendar for all ingredients, remaining photos, month strip,
month view, all filters, filter state in the URL, imported produce toggle, and the
recipe search shortcut links to k-ruoka, soppa365, and yhteishyva once their
search URLs are confirmed by hand.

**Step 4: favorites, tried, and progress**
The async storage interface and its browser implementation, favorites, "tried
this", star ratings, and the monthly completion progress on the home view.

**Step 5: combine**
Partner ranking by shared recipes, multi-ingredient selection, and near-miss
recipes surfaced through seasonal substitutions.

**Step 6: Finnish**
Fill every `fi` field, add the language switch, check date and month names.

**Step 7: mobile**
Work through `docs/RESPONSIVE.md` and verify on real viewport sizes.

**Step 8: database and sync**
Pick a database, add a single-user login, write the second storage implementation,
migrate what is in browser storage.

## 11. Open questions

- Which database, and which host. Deferred on purpose until step 8.
- What the Notion export actually contains. Until it is in `data/`, assume the
  calendar needs drafting and flagging.
- Whether a yearly collection view is worth adding alongside monthly progress.
- Whether the in-app add-recipe form is needed once mobile exists.
- Whether a half-English, half-Finnish list of names is annoying enough to justify
  migrating names to bilingual fields at the Finnish step.
