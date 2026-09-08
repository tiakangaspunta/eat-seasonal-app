# Where imported produce comes from

The origin tag on a card reads "Imported · Spain" when the data records a
country and plain "Imported" when it does not. This file records where each
country came from, and which ingredients were deliberately left blank.

## The source

Every entry below comes from that ingredient's own page on **satokausi.fi**,
under `satokausi.fi/raaka-aineet/<finnish-name>/`, fetched on 2026-09-08. Those
pages carry a month-by-month table whose rows include country flags, so the
source is both Finland-specific and month-specific. It is the same source issue
004 used for the September calendar.

Retailer product pages (K-Ruoka, S-kaupat, Kespro) were also checked. They were
not used, for two reasons: they state today's shelf rather than a given month,
and Kespro's own pages say outright that "tuotteen alkuperämaa vaihtelee
sesongeittain". Where a retailer snapshot disagreed with satokausi, satokausi
won: a shelf check in September said coconut came from Ivory Coast, while
satokausi's January row says the Philippines and Brazil, and January is the
month our data covers.

## Origin rotates with the season, so the data holds it per month

This is why `imported.origins` is a list of month groups rather than one list of
countries per ingredient. Two ingredients settled it on their own:

- **Avocado**: Spain, Colombia, Peru and Mexico in January to April; Spain,
  Kenya and South Africa in September.
- **Mango**: Brazil in February and March; Spain and Israel in September.

A single country list per ingredient would have been wrong in September, which
is the only month the app currently shows.

## What is recorded

| Ingredient | Months | Countries |
| --- | --- | --- |
| Avocado | 1–4 | Spain, Colombia, Peru, Mexico |
| Avocado | 9 | Spain, Kenya, South Africa |
| Banana | 1–3, 9 | Colombia, Ecuador, Costa Rica |
| Blood grapefruit | 1–3 | Spain, Turkey, United States |
| Blood orange | 2–4 | Italy, Spain |
| Coconut | 1 | Philippines, Brazil |
| Fennel | 1–2 | Spain, Italy |
| Ginger | 3–4 | China |
| Globe artichoke | 2 | Italy, France, Spain |
| Grapefruit | 2 | Spain, Israel |
| Guava | 1–3 | Brazil, Colombia |
| Kiwi | 1–2 | Italy |
| Lemon | 2 | Spain, Italy |
| Lime | 1–4 | Brazil, Mexico |
| Mandarin | 2–4 | Spain, Italy, Morocco |
| Mango | 2–3 | Brazil |
| Mango | 9 | Spain, Israel |
| Orange | 1–4 | Spain, Egypt, Morocco, Israel, Italy, Greece |
| Papaya | 2–3 | Brazil, Colombia, Costa Rica |
| Pineapple | 2–4 | Ecuador, Costa Rica |
| Sweet potato | 1–2 | United States, Israel, Spain, Netherlands |
| Sweet potato | 3–4 | United States, Israel |
| Asparagus | 4 | Spain |
| Sprouting broccoli | 4 | Spain |

Kiwi is the one entry not taken from a month table: its ingredient page carries
no flags, and the country names come from satokausi's own article
`satokausi.fi/parasta-juuri-nyt-kiivi/`, which says Finnish shops import kiwi
mainly from Italy, New Zealand and Chile, and that the Italian ones are in
season in February. Only Italy is recorded, since that is the claim the article
makes about these months.

## What is deliberately blank

| Ingredient | Why |
| --- | --- |
| Broccoli | satokausi's page has no winter row, so it names no country for our February import month. See `SATOKAUSI-CONFLICTS.md`. |
| Garlic | satokausi's January to March row carries the Finnish flag and no other: it calls those months Finnish storage, not an import. |
| Parsley | no satokausi page found under the slugs tried; the herb only appears with Finnish summer months. |

A retailer listing could have filled all three (Spain for garlic, Spain and the
Netherlands for broccoli, Italy and Spain for parsley), but each of those pages
also says the origin changes with the season, and none of them says anything
about February in particular. "Imported" with no country is the honest answer
until a month-specific source turns up.
