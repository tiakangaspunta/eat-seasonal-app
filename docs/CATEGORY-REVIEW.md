# Category review: the 59 uncategorized ingredients

Proposed categories for every ingredient row in the Notion export with an empty
Category. Categories are the plan's six: `vegetable`, `fruit`, `berry`,
`mushroom`, `herb`, `other`. Only the first four ever appear in seasonal views.

`domestic` in the origin column means the row is named `(kotimainen)` or is
clearly Finnish-grown. `?` means the export gives no signal and I did not want to
assume.

## Vegetables (24)

| Notion name | English | Origin | Note |
| --- | --- | --- | --- |
| Suippokaali (kotimainen) | Pointed cabbage | domestic | |
| Lehtikaali (kotimainen) | Kale | domestic | |
| Kiinankaali (kotimainen) | Napa cabbage | domestic | |
| Kurpitsa (kotimainen) | Pumpkin | domestic | Worth splitting from squash later if you use them differently |
| Myskikurpitsa (kotimainen) | Butternut squash | domestic | |
| Spagettikurpitsa | Spaghetti squash | ? | Grown in Finland, but your row has no `kotimainen` marker |
| Nauris (kotimainen) | Turnip | domestic | |
| Palsternakka (kotimainen) | Parsnip | domestic | |
| Punajuuri (kotimainen) | Beetroot | domestic | |
| Raitajuuri | Chioggia beetroot | ? | A beetroot variety. Merge into Punajuuri unless you want it separate |
| Mustajuuri | Black salsify | ? | |
| Maa-artisokka (kotimainen) | Jerusalem artichoke | domestic | Duplicate: see merges below |
| Varhaisparsakaali | Sprouting broccoli | ? | Duplicate: see merges below |
| Kevätsipuli | Spring onion | ? | Duplicate: see merges below |
| Nippusipuli | Bunched spring onion | ? | Duplicate: see merges below |
| Green beans | Green beans | ? | |
| Härkäpapu | Broad bean | ? | Vegetable if you buy them fresh or frozen, `other` if dried. Your call |
| Cauliflower | Cauliflower | ? | |
| Radish | Radish | ? | |
| Peas | Peas | ? | |
| Eggplant | Eggplant | imported | |
| Spinach | Spinach | ? | |
| Paksoi/bok choy (kotimainen) | Bok choy | domestic | One of only two September entries in your whole export |
| Red chili | Red chili | imported | Botanically a fruit, sold as a vegetable, and you use it as one |

## Fruits (2)

| Notion name | English | Origin | Note |
| --- | --- | --- | --- |
| Verigreippi | Blood grapefruit | imported | Distinct from your existing Grapefruit and Blood orange rows, so kept separate |
| Kiwi | Kiwi | imported | |

## Mushrooms (2)

| Notion name | English | Origin | Note |
| --- | --- | --- | --- |
| Herkkusieni | Button mushroom | ? | Cultivated, so available all year rather than seasonal |
| Osterivinokas | Oyster mushroom | ? | Cultivated, same |

## Herbs (seasonal produce, not pantry)

Herb is now a seasonal category, grouped on the home view alongside vegetable,
fruit, berry, and mushroom, so this is where actual fresh herbs go: not a pantry
category, not for dried spice.

The 5 rows Notion filed under "Herbs & Spices" split as follows:

| Notion name | English | Where it goes | Note |
| --- | --- | --- | --- |
| Thyme | Thyme | `herb`, drafted season | |
| Parsley | Parsley | `herb`, already has a season (February) | |
| Basil | Basil | `herb`, drafted season | |
| Coriander | Coriander | `herb`, drafted season | |
| Paprika | ? | Needs your call, see below | |
| Juustokumina | Cumin | `other`, not `herb` | A dried spice, not a fresh seasonal herb |

**Paprika is bell pepper**, confirmed. It merges into the existing `Peppers` row
rather than staying separate, since `Suippopaprika (kotimainen)` is specifically
the domestic pointed variety and this generic entry reads as the same thing as
`Peppers`. `category: vegetable`. Flagged `verified: false` on the merge itself,
since which row absorbs which origin data is my call, not Notion's; corrected in
the app if it's wrong.

## Nuts and seeds (2)

| Notion name | English | Note |
| --- | --- | --- |
| Cashew | Cashew | |
| Sunflower seeds | Sunflower seeds | |

## Other (24)

Pantry, dairy, grains, and staples. No months, never in seasonal views, kept so
recipe ingredient lists are complete.

Dairy: Feta, Cheese, Milk, Cream cheese, Sulatejuusto (processed cheese).

Grains and baking: Tortillas, Noodles, Flour, Vehnäjauho (wheat flour), Ohra
(barley), Kuivahiiva (dry yeast).

Tomato products: Tomaattisose (tomato paste), Tomaattipyree (tomato purée),
Tomaattimurska (crushed tomatoes).

Legumes: Lentils, Härkäpapu if dried (see open question below).

Condiments and other: Honey, Soy sauce, Peanut butter, Syrup, Stevia, Hummus,
Broth, Kasvisliemikuutio (vegetable stock cube), Rypsiöljy (rapeseed oil).

## Rows to delete (2)

- `New Ingredient` — an unsaved Notion row.
- `Other mushroom` — links to one recipe, Creamy barley (ohra) and mushroom
  risotto, which has no source URL, so its real ingredient can't be recovered from
  a page. Deleted rather than resolved; that recipe's ingredient list stays
  incomplete until you fill it in.
- `Spices` — deleted as its own ingredient entity. It links to one recipe,
  Sienitäyte tacoihin (yhteishyva.fi), which has a URL, so its actual spices get
  read from the source page during import. If the page just says "spices to
  taste" with nothing specific, that becomes `freeText`, not a tracked ingredient.
  A specific named spice that is worth tracking goes to `other`, same as cumin.

## Row not deleted: `Other unusual`

Kept, and resolved per recipe instead of dropped. It links to 4 recipes, and 3 of
them (Punakaali-bao buns, Suppilovahveropasta, Yrttinen uunitofu) already have a
proper ingredient list alongside it, so it's likely one uncategorized extra in
each, resolved when that recipe's list is rebuilt from its source page in step 1
or 2. The fourth, Porkkanaletut soseesta ja avokadosalaatti, lists `Other unusual`
as its *only* ingredient, but it has a URL, so its real list gets built from the
source page the same way. No recipe here depends on guessing what "unusual" meant;
every one of them has a page to read.

## Merge candidates

Pairs and groups that are the same thing under two names, some of them crossing
into the already-categorized rows:

- `Maa-artisokka (kotimainen)` and `Latva- ja maa-artisokka`. The second conflates
  Jerusalem artichoke with globe artichoke, which are unrelated plants with
  different seasons. Worth splitting properly rather than merging.
- `Kevätsipuli` and `Nippusipuli`. Both spring onion.
- `Varhaisparsakaali` and `Broccoli`. Sprouting broccoli has a genuinely different
  season, so keep separate if you buy it as its own thing.
- `Vehnäjauho` and `Flour`.
- `Kasvisliemikuutio` and `Broth`.
- `Tomaattisose`, `Tomaattipyree`, and `Tomaattimurska`. Three different products,
  so keep all three unless you never distinguish them in practice.
- Already-categorized duplicates from the same export: `Apples` and
  `Omena (kotimainen)`, and `Banaani` alongside any English banana row.

## Resolved

1. Origins for the 11 unmarked rows: drafted from general knowledge, flagged
   `verified: false`, corrected in the app as you notice a wrong one.
2. Härkäpapu: dried, goes to `other`, no season.
3. Raitajuuri stays separate from Punajuuri.
4. Deletions: `New Ingredient` and `Other mushroom` confirmed. `Spices` deleted as
   an ingredient entity, its recipe resolved from source. `Other unusual` kept,
   resolved per recipe from source pages rather than deleted.

## Still open

None. Paprika resolved above.
