# September on satokausi.fi's calendar page, against what we have

Source: `https://satokausi.fi/satokausikalenteri/`, fetched 2026-09-11, reading
the September (syyskuu) listing. Flags in brackets are the origin flags the page
shows; FIN means Finnish.

Unlike the per-ingredient pages used in issue 004, this page does **not**
distinguish varastosesonki / sesongissa / huippusesonki. It only says "this is
in the shops this month". So it can tell us *what* is missing, but not whether a
missing ingredient's September is fresh, storage, or peak.

## 1. Nothing already in the app needs September added

All 47 calendar entries that map to an ingredient we already have are already
marked for September, and the three imported ones' countries match exactly
(avocado ESP/KEN/ZAF, banana COL/ECU/CRI, mango ESP/ISR). Issue 004 got this
month right.

Two we mark fresh in September are absent from the calendar page: button
mushroom (herkkusieni) and oyster mushroom (osterivinokas). Those were Tia's
judgment call in issue 004 — cultivated year round, counted as fresh — so they
stay.

## 2. One existing entry is filed wrong

| Id | Now | Calendar says |
| --- | --- | --- |
| `broad-bean` | category `other`, no months | Härkäpapu [FIN], in season in September |

It is now a `vegetable`, in season and at peak in September, with that month
flagged drafted.

## 3. Missing from the app entirely (72)

Everything listed as FIN below — 49 of the 72 — is now in `data/ingredients/`,
with a September taken from its own satokausi page and `verified: false`. The
23 imported ones were deliberately left out and are kept here in case that
changes. See `docs/DECISIONS.md`.

### Herbs (3, all FIN)
minttu (mint) · tilli (dill) · vihanneskrassi (garden cress)

### Cabbages (4, all FIN)
romanesco · merikaali (sea kale) · kyssäkaali / kaalirapi (kohlrabi) ·
savoijinkaali / kurttukaali (savoy cabbage)

### Leaves and salads (10, all FIN)
lehtisalaatti · keräsalaatti · jäävuorisalaatti · jääsalaatti · lollo rosso ·
rucola · vuonankaali (lamb's lettuce) · salaattisikuri (chicory) · endiivit
(endive) · varsiselleri / lehtiselleri (celery — separate from the celeriac we
already have)

### Berries (15) — our `berry` category is currently empty apart from strawberry
FIN: puolukka (lingonberry) · karpalo (cranberry) · vadelma (raspberry) ·
karhunvatukka (blackberry) · juolukka (bog bilberry) · variksenmarja
(crowberry) · tyrnimarja (sea buckthorn) · pihlajanmarja (rowanberry) ·
ruusunmarja (rosehip) · marja-aronia (aronia) · katajanmarja (juniper) ·
lillukka (stone bramble) · riekonmarja
Imported: pensasmustikka [ESP, MAR, PRT] (cultivated blueberry) ·
ananaskirsikka [PRT] (physalis)

### Fruit (13, all imported except one)
FIN: kriikuna (damson)
Imported: luumu [POL, ESP, FRA, TUR] (plum) · viinirypäleet [ESP, FRA, ITA]
(grapes) · viikuna [TUR, FRA, ITA] (fig) · persikka (peach) · nektariini [ESP,
ITA] · satsuma [ESP] · granaattiomena [ESP, ITA, TUR, ISR] (pomegranate) ·
hunajapomelo [ESP, FRA, ITA] · kvitteni [FRA, ITA, ESP] (quince) ·
kaktusviikuna [ESP, ITA] (prickly pear) · kivakurkku (kiwano) · limekaviaari
[ESP] (finger lime)

### Mushrooms (3, all FIN)
tatit (boletes / porcini) · mustatorvisieni (black trumpet) · matsutake /
tuoksuvalmuska

### Squashes (4)
FIN: kesäkurpitsa (courgette) · patissonkurpitsa (pattypan) · hokkaidokurpitsa
Imported: kajottikurpitsa [ITA, ESP]

### Melons (7)
FIN: vesimeloni (watermelon)
Imported: hunajameloni · cantaloupemeloni [ESP, FRA, ITA] · galiameloni [ESP,
FRA, ITA] · verkkomeloni [ESP, FRA, ITA] · jimbeemeloni [ESP, FRA, ITA] ·
piel de sapo [ESP]

### Beans (1, FIN)
vahapapu (wax bean)

### Other vegetables (3)
FIN: pihvitomaatti (beef tomato) · kirsikkatomaatti (cherry tomato, no flag) ·
pimientos de padron [ESP]

### Onions (5, all FIN)
purjosipuli (leek) · ruohosipuli (chives) · ryvässipuli (potato onion) ·
hopeasipuli (silverskin onion) · jättisipuli

### Root vegetables (4)
FIN: retikka (mooli / black radish) · valkojuurikas (white beet) ·
juuripersilja (root parsley)
Imported: jamssi [NER, GHA] (yam)

## 4. What the calendar page can't tell us

For each of the 72 it says only "September". Filling `freshMonths`,
`storageMonths`, `peakMonths` and the other eleven months the way issue 004 did
means reading each ingredient's own page at
`satokausi.fi/raaka-aineet/<finnish-name>/`. That is the project rule: months
come from the per-ingredient page, not from general knowledge.

So all 50 pages were fetched and their season table parsed by
`scripts/satokausi-fetch.mjs`, and September written from it:

- 43 of the 50 are fresh in September, 33 of those at peak season.
- None is a storage month, and none carries a flag other than FIN, except
  kirsikkatomaatti whose September row carries no flag at all.
- The other eleven months were parsed too and are kept in
  `scripts/september-additions-source.json`, unwritten, for step 3.

## 5. Left for Tia

- **Names.** 22 of the 49 keep a Finnish name. Any of them can be renamed in the
  app; the id does not change.
- **Cards sort by id, so Finnish names look shuffled.** The home grid is ordered
  by the English slug, which put Salaattisikuri between Cauliflower and Chioggia
  beetroot. Sorting the grid by display name instead is a small change, not made
  here because card ordering was not part of this task.
- **Warnings.** Rowanberry and juniper berry are the two additions where
  preparation might be a safety matter rather than a preference, the way
  korvasieni is. Nothing was written, because that is a fact about food safety
  and not one to draft.
- **Photos.** The 49 have none, like the 73 before them. Issue 010's contact
  sheet grew by 49.
