# Import report

What the Notion import decided rather than copied. Nothing here blocks the build.
It is a list of small corrections, each one fixable by editing a file in
`data/ingredients/` or, once the app runs, by renaming in place.

Ingredients imported 2026-09-03 from
`Sources/notion-export-ingredients/…_all.csv` (issue 002). Recipes imported
2026-09-03 from `Sources/notion-export-recipes/…_all.csv` (issue 003); their
section is at the bottom.

## Counts

133 rows read, 124 ingredients written: 4 rows dropped, 5 folded into another row.

| Category | Count |
| --- | --- |
| vegetable | 46 |
| fruit | 16 |
| berry | 1 |
| mushroom | 6 |
| herb | 4 |
| nut | 4 |
| other | 47 |

Only the first five appear on the home view. 68 of the 124 have no month data at
all, which is expected: most of them are pantry items.

## Rows merged

| Notion row | Folded into | What carried over |
| --- | --- | --- |
| Omena (kotimainen) | Apple | January and February, as domestic fresh months. `Apples` itself had no season, so apple has no imported months yet |
| Paprika | Bell pepper | Nothing, no season on either row |
| Vehnäjauho | Flour | Nothing |
| Nippusipuli | Spring onion (Kevätsipuli) | Nothing |
| Kasvisliemikuutio | Broth | Nothing |

Tomaattisose, Tomaattipyree, and Tomaattimurska were **not** merged, per Tia:
they are three different products.

## Rows dropped

| Notion row | Why |
| --- | --- |
| New Ingredient | An unsaved, empty Notion row |
| Other mushroom | Its one recipe has no source URL, so the real mushroom cannot be recovered |
| Spices | Dropped as an ingredient; its recipe (Sienitäyte tacoihin) has a URL, so the actual spices come from the source page in slice 5 |
| Other unusual | Not an ingredient of its own. All four of its recipes have URLs, so it resolves per recipe in slice 5 |

## Origins drafted, flagged `verified: false`

These rows had a season Tia entered but no `(kotimainen)` marker and are not
obviously imported produce. The months are hers and untouched; only the bucket
they went into is a guess.

| Notion row | Ingredient | Drafted as | Months |
| --- | --- | --- | --- |
| Parsley | `parsley` | imported | February |
| Garlic | `garlic` | imported | February |
| Fenkoli | `fennel` | imported | January, February |
| Sweet potato | `sweet-potato` | imported | January–April |
| Broccoli | `broccoli` | imported | February |
| Latva- ja maa-artisokka | `globe-artichoke` | imported | February |
| Varhaisparsakaali | `sprouting-broccoli` | imported | April |
| Spagettikurpitsa | `spaghetti-squash` | domestic fresh | January |
| Raitajuuri | `chioggia-beetroot` | domestic fresh | January–April |
| Mustajuuri | `black-salsify` | domestic fresh | January–April |

**Asparagus is settled.** Tia confirmed 2026-09-03: Spanish asparagus is April
and May, Finnish is May and June, so April is imported. `asparagus` is now
`verified: true`, and the fact is kept as a note on the ingredient. Its Finnish
May and June months belong to the full-year calendar in step 3, not to this
import, which extends no month set.

One more ingredient carries `verified: false` for a different reason:
`bell-pepper`, because folding Paprika into Peppers was a call made during the
import, not something Notion stated.

## Other calls made during the import

- **Latva- ja maa-artisokka was split, not merged.** Globe artichoke and
  Jerusalem artichoke are unrelated plants with different seasons. Maa-artisokka
  already had its own row, so this row became `globe-artichoke` and took the
  February season with it. **Still open**: Tia does not know which half that
  February belonged to, so `globe-artichoke` stays `verified: false` until
  something settles it. This is exactly the case the unverified marker exists
  for, so it is not a blocker.
- **Tomato is `vegetable`, not `fruit`.** Confirmed by Tia 2026-09-03. Notion
  filed it under Fruits.
  `CATEGORY-REVIEW.md` already made the same call for red chili ("botanically a
  fruit, sold as a vegetable, and you use it as one"), and putting tomato in the
  Fruit section of the home view would be strange.
- **Avocado stays `vegetable`,** as Notion had it, for the same reason.
- **Coconut milk's season was "Always", which is not a month,** so it carries no
  month data. It is category `other` and never appears in seasonal views anyway.
- **Fresh herbs got no months.** `CATEGORY-REVIEW.md` suggested drafting seasons
  for thyme, basil, and coriander. Finnish harvest months are not something to
  guess, and drafting them is not in issue 002, so thyme, basil, and coriander
  have no month data yet. Parsley kept the February that Notion had. Herb seasons
  belong with the September calendar (issue 004) or the full year (step 3).
- **`similarTo` is empty on every ingredient.** Which produce can stand in for
  which is a judgment about Tia's cooking, not something the export knows.
- **No month set was extended.** Every season is exactly as long as Notion had
  it, which is why almost everything reads January to April.
- **`storageMonths` is empty everywhere.** Notion had one Season column with no
  fresh-versus-stored distinction, so nothing can be assigned to storage without
  inventing it.

## Names

English where a common English name exists, per Tia. Kept in Finnish:
**Palsternakka**, **Suppilovahvero**, **Korvasieni**, and
**Kelta- ja kaurajuuri** (which conflates two roots and has no clean English
name; its id is `yellow-beet`).

Ids stay English slugs regardless, so renaming in the app never breaks a recipe
link: `parsnip`, `funnel-chanterelle`, `false-morel`.

Finnish originals kept here so nothing is lost:

Potatoes → Potato · Carrots → Carrot · Siitakesieni → Shiitake · Verigreippi →
Blood grapefruit · Banaani → Banana · Valko-/keräkaali → White cabbage ·
Ruusukaali → Brussels sprout · Suippokaali → Pointed cabbage · Lehtikaali → Kale ·
Kiinankaali → Napa cabbage · Kurpitsa → Pumpkin · Myskikurpitsa → Butternut
squash · Spagettikurpitsa → Spaghetti squash · Raitajuuri → Chioggia beetroot ·
Nauris → Turnip · Maa-artisokka → Jerusalem artichoke · Punajuuri → Beetroot ·
Lanttu → Swede · Fenkoli → Fennel · Punakaali → Red cabbage · Mustajuuri → Black
salsify · Juustokumina → Cumin · Tomaattisose → Tomato paste · Tomaattipyree →
Tomato purée · Tomaattimurska → Crushed tomatoes · Vehnäjauho → Flour ·
Osterivinokas → Oyster mushroom · Herkkusieni → Button mushroom ·
Salottisipuli → Shallot · Paksoi/bok choy → Bok choy ·
Juuri- ja mukulaselleri → Celeriac · Piparjuuri → Horseradish · Kuivahiiva → Dry
yeast · Härkäpapu → Broad bean · Kevätsipuli → Spring onion · Ohra → Barley ·
Rypsiöljy → Rapeseed oil · Suippopaprika → Pointed pepper · Parsa → Asparagus ·
Varhaisparsakaali → Sprouting broccoli · Sulatejuusto → Processed cheese

## Safety

`korvasieni` (false morel) carries a `warning` in the data, so the app can show
it wherever the ingredient appears rather than relying on memory.


# Recipes

Metadata only, per issue 003: title, source, meal type, effort, and time where
Notion had one. Ingredient lists are rebuilt from the source pages in issue 005,
so every recipe currently has `ingredients: []`.

## Counts

31 rows read, 30 recipes written: 1 row dropped.

| Meal type | Recipes |
| --- | --- |
| dinner | 29 |
| side | 6 |
| lunch | 5 |
| breakfast | 1 |
| dessert | 0 |
| snack | 0 |

A recipe can have more than one meal type, so these add up to more than 30.
`dessert` and `snack` exist in the model but nothing in the export is one.

## The export has 31 rows, not 30

`NOTION-IMPORT.md` and issue 003 both say 30. Both CSV exports contain 31 data
rows. With `Pesto` dropped (below) the written count is 30 anyway, and the "19
recipes with no time" figure in the issue turns out to be exactly right, because
the dropped row was one of the timeless ones.

## Row dropped

| Notion row | Why |
| --- | --- |
| Pesto (A ei tykännyt) | Dropped at Tia's request. Its URL pointed at k-ruoka's täytetyt portobellot rather than a pesto recipe, and the row was marked Not good |

## Effort filled in

| Recipe | Notion | Written | Source of the call |
| --- | --- | --- | --- |
| Mushroom filling for tacos | blank | `medium` | Tia, 2026-09-03 |

Everything else mapped mechanically: Low to `easy`, Medium to `medium`, High to
`hard`.

## The 19 recipes with no time

Notion had a time for 11 of the 30. These 19 get theirs from the source page in
issue 005:

Potato pancake with cream cheese filling · Root vegetable and mushroom pie · Red
cabbage bao buns · Tacos · Sweet potato curry · Spinach pancakes · Carrot
pancakes · Mushroom filling for tacos · Lime noodles · Green peppercorn salmon
with fennel stew · Hummus pasta · Roasted chickpea pasta · Naan · Herby
oven-baked tofu · Creamy barley and mushroom risotto · Indian lentil soup ·
Summer soup · Creamed vegetable soup · Aubergine pasta

Two of them, **Tacos** and **Creamy barley and mushroom risotto**, have no URL
either, so they are own-recipe entries with no `source`. Their times and
ingredient lists have to come from Tia rather than from a page.

## Meal type calls

Mechanical part of the mapping: Main Course and Light to `dinner`, Lunch to
`lunch`, Side Dish to `side`, Breakfast to `breakfast`, Salad to `side`.
Multi-value rows became several meal types. The judgment calls:

| Recipe | Notion Type | Written | Why |
| --- | --- | --- | --- |
| Tuna and bean salad | Light, Main Course, Salad | `dinner`, `side` | Light and Main Course both point at dinner, and Salad adds `side`. The three Notion values collapse to two |
| Chanterelle sauce | Main Course | `dinner` | A sauce is arguably a `side`, but Notion says Main Course and it is a plate of pasta away from being one. Kept as filed |
| Mushroom filling for tacos | Main Course, Side Dish | `dinner`, `side` | A filling rather than a dish, so `side` is the honest half. `dinner` kept because Notion had it |
| Naan | Side Dish | `side` | Straightforward, listed only because it is the one recipe with no `dinner` at all |
| Spinach pancakes, Carrot pancakes, Chickpea patties | Main Course, Side Dish | `dinner`, `side` | Both, as Notion had them |

## Tags are empty on every recipe

Notion has no diet or style column, so there is nothing to import. `vegan`,
`vegetarian`, and `dairy-free` are all decided by the ingredient list, which
issue 005 builds, so tagging now would mean guessing. Confirmed with Tia
2026-09-03: leave `tags: []` and fill them in issue 005.

## Titles

Descriptive Finnish titles translated to English, names kept as names. Finnish
originals kept here so nothing is lost:

Perunapannukakku tuorejuustotäytteellä → Potato pancake with cream cheese
filling · Kurkuma-perunacurry → Turmeric potato curry · Täyteläinen
maapähkinäcurry → Rich peanut curry · Porkkanaletut soseesta ja avokadosalaatti →
Carrot pancakes with avocado salad · Juures-sienipiirakka → Root vegetable and
mushroom pie · Kantarellikastike → Chanterelle sauce · Kantarellipiirakka →
Chanterelle pie · Punakaali-bao buns → Red cabbage bao buns · Bataatticurry →
Sweet potato curry · Pinaattiletut → Spinach pancakes · Porkkanaletut → Carrot
pancakes · Sienitäyte tacoihin → Mushroom filling for tacos · Limettinuudelit →
Lime noodles · Tonnikala-papusalaatti → Tuna and bean salad · Viherpippurilohi ja
fenkolimuhennos → Green peppercorn salmon with fennel stew · Suppilovahveropasta →
Suppilovahvero pasta · Kikhernepihvit → Chickpea patties · Hummuspasta → Hummus
pasta · Paahdettu kikhernepasta → Roasted chickpea pasta · Yrttinen uunitofu →
Herby oven-baked tofu · Intialainen linssikeitto → Indian lentil soup ·
Uunifeta-parsapasta → Baked feta and asparagus pasta · Kesäkeitto → Summer soup ·
Kasvissosekeitto → Creamed vegetable soup · Munakoisopasta → Aubergine pasta

Kept as they were: **Palak paneer**, **Naan**, **Shakshuka**, **Tacos**, and
**Creamy barley (ohra) and mushroom risotto**, which lost only its parenthetical.

**Suppilovahvero pasta** keeps the Finnish mushroom name on purpose, because
issue 002 kept `Suppilovahvero` as that ingredient's name. "Funnel chanterelle
pasta" would have been the only place in the app using the English name.

## Source URLs worth a second look

| Recipe | Note |
| --- | --- |
| Hummus pasta | The URL is a satokausi.fi collection page ("uudet talviset suosikkireseptit"), not a single recipe. Issue 005 has to find the right recipe on that page, or ask |
| Tacos, Creamy barley and mushroom risotto | No URL at all. Own-recipe entries |

`source.name` is the bare domain with `www.` stripped: `k-ruoka.fi` (17
recipes), `satokausi.fi` (5), `yhteishyva.fi` (3), `soppa365.fi`,
`ravintolanepal.fi`, `sydanmerkki.fi` (1 each).

## Columns ignored

`Success`, `Favorites`, `Meal Plan`, `Day`, and `Season` were all dropped, as
planned: cooking history is not imported, and a recipe's season is always derived
from its ingredients. `Ingredients` is not read at all in this slice; issue 005
rebuilds those lists from the source pages.
