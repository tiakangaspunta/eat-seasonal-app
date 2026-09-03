# Import report

What the Notion import decided rather than copied. Nothing here blocks the build.
It is a list of small corrections, each one fixable by editing a file in
`data/ingredients/` or, once the app runs, by renaming in place.

Ingredients imported 2026-09-03 from
`Sources/notion-export-ingredients/…_all.csv` (issue 002). Recipes are issue 003
and are not covered yet.

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

These 11 rows have a season Tia entered but no `(kotimainen)` marker and are not
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
| Parsa | `asparagus` | imported | April |
| Varhaisparsakaali | `sprouting-broccoli` | imported | April |
| Spagettikurpitsa | `spaghetti-squash` | domestic fresh | January |
| Raitajuuri | `chioggia-beetroot` | domestic fresh | January–April |
| Mustajuuri | `black-salsify` | domestic fresh | January–April |

Asparagus in April is the one most worth a second look: Finnish asparagus is a
May and June crop, so April reads as imported, but that is an inference.

One more ingredient carries `verified: false` for a different reason:
`bell-pepper`, because folding Paprika into Peppers was a call made during the
import, not something Notion stated.

## Other calls made during the import

- **Latva- ja maa-artisokka was split, not merged.** Globe artichoke and
  Jerusalem artichoke are unrelated plants with different seasons. Maa-artisokka
  already had its own row, so this row became `globe-artichoke` and took the
  February season with it. If that February actually belonged to the Jerusalem
  artichoke half, move it.
- **Tomato is `vegetable`, not `fruit`.** Notion filed it under Fruits.
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
