# Notion import mapping

One-time conversion of the exports in `notion-export-ingredients/` and
`notion-export-recipes/` into typed data files under `data/`. Read `PLAN.md`
first: the plan's model wins, and Notion attributes the plan does not have are
dropped rather than accommodated.

## What is in the exports

- 132 ingredient rows. 57 have a season, almost all within January to April.
  September has two entries: bok choy and suppilovahvero.
- 30 recipe rows. 18 from k-ruoka.fi, 5 from satokausi.fi, 3 from yhteishyva.fi,
  one each from soppa365.fi, ravintolanepal.fi, and sydanmerkki.fi, and 2 with no
  URL.
- Ingredient relations on recipes are patchy: 5 recipes have none, most have 4 to 6.
- Only 11 of 30 recipes have a time.

Use the `_all.csv` files. They are the full view.

## Ingredients

| Notion column | Becomes |
| --- | --- |
| Ingredients | `name`, a single field, with the `(kotimainen)` suffix stripped and used as the domestic signal |
| Category | `category`, mapped below |
| Season | `availability.domestic.freshMonths` for domestic rows, `availability.imported.months` for imported rows |
| Recipes | ignored. Recipe to ingredient links are rebuilt from the recipe side |
| Favorites | ignored. Ingredient favorites are not in the plan |
| Inventory | ignored |
| Shopping List | ignored |

### Category mapping

| Notion | Becomes |
| --- | --- |
| Fruits | `fruit`, or `berry` for known berries such as strawberries, lingonberries, bilberries, sea buckthorn |
| Vegetables, Root vegetable, Cabbage, Staples (any combination) | `vegetable` |
| Mushrooms | `mushroom` |
| Herbs & Spices | Split: fresh herbs (thyme, parsley, basil, coriander) to `herb`, dried spices (cumin) to `other`. See `docs/CATEGORY-REVIEW.md` |
| Beans & Seeds & Nuts | `nut` for nuts and seeds (cashew, sunflower seeds); dried beans and lentils go to `other` |
| Dairy & Alternatives, Pantry & Condiments, Grains, Fish & Seafood, Meat & Proteins, Snacks, Vegan and vegetarian products | `other` |
| empty (59 rows) | `other`, and listed in the import report for Tia to reclassify |

Notion's multi-value categories collapse to one. Root vegetable and Cabbage are
subtypes the plan does not have, so they are dropped, not preserved as tags.

### Names in Finnish

Several rows are the same produce twice under two names, for example `Apples` and
`Omena (kotimainen)`, or `Banaani`. Merge these into one ingredient, keeping the
English name where Tia clearly knows it, and the two rows' seasons going into the
domestic and imported month sets respectively. Where only a Finnish name exists,
keep the Finnish name. Names are a single field and she edits them in the app, so
the import should not agonize over this.

### Non-produce ingredients

All 132 rows are imported, including rice, thyme, eggs, and cheese. Rows in the
`other` and `herb` categories get no months and never appear in seasonal views,
but they exist so that recipe ingredient lists are complete and so Tia's existing
links survive. They are not free text.

### Verification

Every imported month set is `verified: true`, because Tia entered it. Anything
Claude adds is `verified: false`. Do not silently extend an imported month set.

## Recipes

| Notion column | Becomes |
| --- | --- |
| Recipes | `title`, a single field. Translate descriptive Finnish titles into English, keep names that are already names. Tia renames anything she prefers in the app |
| URL | `source.url`, with `source.name` from the domain. The 2 rows without a URL become own-recipe entries with no source |
| Effort | `effort`: Low to `easy`, Medium to `medium`, High to `hard`. One blank row needs asking about |
| Time | `timeMinutes`: "30 minutes" to 30, "45 minutes" to 45, "Hour" to 60. The 19 blanks are filled from the source page |
| Type | `mealType`: Main Course and Light become `dinner`, Lunch becomes `lunch`, Side Dish becomes `side`, Breakfast becomes `breakfast`, Salad becomes `side` unless the recipe is clearly a main. Multi-value rows (e.g. "Lunch, Main Course") become multiple mealType entries |
| Ingredients | starting point only. Parse the name before ` (https://`, then rebuild the full list from the source page |
| Season | ignored. A recipe's season is always derived from its ingredients |
| Success | ignored. Cooking history is not imported |
| Favorites | ignored. Cooking history is not imported |
| Meal Plan, Day | ignored |

### Title translation

`Palak paneer` and `Naan` are already names and stay as they are.
`Perunapannukakku tuorejuustotäytteellä` becomes an English title. Judgment call
per recipe, and the Finnish original is listed in the import report so nothing is
lost and Tia can put it back in one click.

### Meal type mapping

Notion's Type is a dish category, not strictly a meal, so the mapping above is a
judgment call per recipe rather than a mechanical one. Anything ambiguous goes in
the import report rather than being guessed silently.

### Rebuilding ingredient lists

The relations are too incomplete to use as the ingredient list. For each recipe
with a URL, read the source page once, extract the ingredient list with quantities,
map each line to an ingredient id where one exists, and leave the rest as
`freeText`. Steps are not copied. This is the same per-recipe reading described in
`PLAN.md` section 3, run over 28 URLs.

Substitutions are not invented during the import. They are added per recipe, with
Tia, afterwards.

## Import report

The import writes `docs/IMPORT-REPORT.md` listing, for Tia to work through:

- The 59 ingredients with no category.
- Rows merged as duplicates, and which season went where.
- Recipes whose effort or time could not be determined.
- Ingredient lines from source pages that matched no known ingredient.
- Any ingredient the import created that was not in Notion.

Nothing in the report blocks the build. It is a list of small corrections.
