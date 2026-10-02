# October on satokausi.fi's calendar page, against what we have

Source: `https://satokausi.fi/satokausikalenteri/`, fetched 2026-10-02, reading
the October (lokakuu) listing: 96 entries. The changes are written by
`node scripts/apply-october.mjs` from the pages saved in
`scripts/october-source.json`.

Unlike in September, the page now marks each entry, by its CSS class:
`season-spotlight`, `season-inseason` or `season-storage`. There is no legend,
but on all 82 entries we already had, those match the ingredient's own page as
Huippusesonki (peak), Sesongissa (fresh) and Varastosesonki (storage). Months
still come from the ingredient's own page, as the project rule says.

## 1. Nothing we already had was out of date

All 119 ingredient pages issue 012 read on 2026-09-30 were read again. None
has changed. The page itself was last modified 2025-12-16; it shows October
because the month turned, not because the calendar was revised.

Button mushroom and oyster mushroom are absent from the October listing, as
they were from September's. They stay year round, as their pages say.

## 2. Cabbages

| Id | Was | Now | Why |
| --- | --- | --- | --- |
| `white-cabbage` | no October | fresh and peak in October | Its page flags October "fIN", a typo the fetch script did not read as a flag, so issue 012 reported "no origin flag". The script now reads flags in any case. |
| `red-cabbage` | fresh September only, storage January to April | fresh June to November, storage December too | Its page gives no flag for June to December. Tia's call: every other cabbage is Finnish, so these months are too. |

This settles every cabbage line under "Months the page does not settle" in
`docs/YEAR-REVIEW.md`, which is generated and still lists them.

## 3. Added: four Finnish ingredients (English names, Tia's call)

Each with the whole year from its own page, `verified: false`, no photo yet.

| Id | Page | Months |
| --- | --- | --- |
| `cavolo-nero` | mustakaali-palmukaali | storage Jan, Dec · fresh Jul, Nov · peak Aug, Oct |
| `swiss-chard` | mangoldi-lehtijuurikas | imported Apr–May (Netherlands, Italy, Spain) · peak Jun · storage Oct |
| `sugar-beet` | sokerijuurikas | fresh Oct · peak Nov |
| `salsify` | kaurajuuri | storage Jan–Mar, Dec · peak Sep–Oct · fresh Nov |

Cavolo nero and kale are each other's `similarTo` (Tia: interchangeable).

## 4. Left out: imported only

Kept out, as in September (`docs/DECISIONS.md`, 2026-09-11): the app is
domestic by default and none of these is a thing Tia buys.

- New since September's list: taateli (dates) [IRN, TUR] · sweetie [ISR] ·
  persimoni (persimmon) [ESP] · omenapäärynä / nashi [CHN, JPN] · kastanja
  (chestnut) [FRA, ITA]
- Already listed in `docs/SEPTEMBER-CALENDAR-GAPS.md`: kvitteni · limekaviaari ·
  kivakurkku · viikuna · viinirypäleet · satsuma · luumu · kaktusviikuna ·
  ananaskirsikka · jamssi · kajottikurpitsa
- Hunajameloni (honeydew melon) carries no flag at all.

One entry, "Satokausikalenteri", links to a page of that name filed as a fruit.
It is the site's own entry, not produce, and is ignored.

## 5. Left for Tia

- **Photos.** The four additions have none. They join the contact sheet with
  the next photo round (issue 018).
