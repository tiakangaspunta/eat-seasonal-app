# Where satokausi.fi disagrees with the Notion data

Issue 004 sourced September from each ingredient's own page on satokausi.fi.
Those pages also cover January to April, which is the range Tia's Notion export
already filled in and marked verified. In 28 cases the two disagree, and the
disagreement is always the same one.

**Nothing here has been changed.** Issue 004's rule is that existing verified
months are untouched, so the data still says what Tia's Notion said. This file
is the list to work through, most likely at step 3 when the full twelve-month
calendar lands.

## The disagreement

Tia's Notion had one column for when produce is available. This project split
that into `freshMonths` (harvested or picked now) and `storageMonths` (available
from Finnish storage, not fresh), a distinction her rows had no way to express.
So the import put everything into `freshMonths`.

satokausi draws exactly that line, and puts these months on the other side of
it. Carrot is the clearest case: Tia's data says fresh in January, satokausi
says January carrot is out of storage and Finnish carrot is not fresh until
June.

This is very likely a shape mismatch rather than either source being wrong.
Neither of them is claiming January carrots are pulled from frozen ground.

| Ingredient | Tia has these as fresh | satokausi calls these storage | Her months verified |
| --- | --- | --- | --- |
| Apple | Jan, Feb | Jan, Feb | yes |
| Beetroot | Jan, Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Black salsify | Jan, Feb, Mar | Jan, Feb, Mar | no |
| Brussels sprout | Jan | Jan | yes |
| Butternut squash | Jan, Feb | Jan, Feb | yes |
| Carrot | Jan, Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Celeriac | Feb, Mar | Jan, Feb, Mar, Apr | yes |
| Chioggia beetroot | Jan, Feb, Mar, Apr | Jan, Feb, Mar, Apr | no |
| Horseradish | Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Jerusalem artichoke | Jan, Feb, Mar | Jan, Feb, Mar | yes |
| Kale | Jan | Jan | yes |
| Kelta- ja kaurajuuri | Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Napa cabbage | Jan, Feb | Jan, Feb | yes |
| Palsternakka | Jan, Feb, Mar | Jan, Feb, Mar, Apr | yes |
| Pear | Feb, Mar | Jan, Feb, Mar | yes |
| Pointed cabbage | Jan | Jan | yes |
| Portobello | Jan, Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Potato | Jan, Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Pumpkin | Jan | Jan | yes |
| Red cabbage | Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Red onion | Feb, Mar | Jan, Feb, Mar, Apr | yes |
| Shallot | Feb, Mar | Jan, Feb, Mar, Apr | yes |
| Shiitake | Jan, Feb, Mar | Jan, Feb, Mar | yes |
| Spaghetti squash | Jan | Jan | no |
| Swede | Jan, Feb, Mar | Jan, Feb, Mar, Apr | yes |
| Turnip | Jan, Feb | Jan, Feb | yes |
| White cabbage | Jan, Feb, Mar, Apr | Jan, Feb, Mar, Apr | yes |
| Yellow onion | Jan, Feb, Mar | Jan, Feb, Mar, Apr | yes |

## Origin disagreements

Four ingredients where the two sources disagree about where the produce comes
from, rather than about fresh versus storage. Also unchanged.

| Ingredient | Tia has | satokausi says |
| --- | --- | --- |
| Garlic | imported in February | February is Finnish, from storage |
| Sprouting broccoli | imported in April | April is Finnish, in season |
| Broccoli | imported in February | no February on the page at all |
| Parsley | imported in February | no February on the page at all |

## Ingredients with no satokausi page

Basil, coriander, and thyme have no page on satokausi.fi — its herb section
covers only mint, garden cress, dill, and parsley. Their months were left
exactly as they were, and a different source will be needed for them.
