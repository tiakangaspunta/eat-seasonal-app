# User flows

Mermaid flowcharts of what the app actually does, updated in the same change
that alters a flow, so a flow can be reviewed by reading rather than by clicking
through the app. Anything not drawn here is not built yet.

## Choosing a view

Built in step 2. The front page has two views, each its own address, and the
side panel's contents are in the address too, as `?open=<id>`. So a reload
keeps the panel open, Back undoes the last thing opened, and the links between
the views land with the right panel showing.

```mermaid
flowchart TD
    open([Open the app]) --> ingredients["Ingredient view, /"]
    ingredients <-->|"Ingredients / Recipes switch"| recipes["Recipe view, /recipes"]

    ingredients -->|"click a card"| ipanel["Ingredient panel, /?open=carrot"]
    recipes -->|"click a card"| rpanel["Recipe panel, /recipes?open=aubergine-pasta"]

    ipanel -->|"click a recipe in its list"| rpanel
    rpanel -->|"click a seasonal ingredient in its list"| ipanel
    rpanel -.->|"pantry ingredients and free text are not links"| rpanel

    ipanel -->|"close, Escape, or Back"| ingredients
    rpanel -->|"close, Escape, or Back"| recipes
```

## Browsing the current month, and opening an ingredient

Built in issues 007 and 008. Recipes in the panel became links in step 2.

```mermaid
flowchart TD
    open([Open the app]) --> home["Home: the current month, named and labelled with its season"]
    home --> filter{"Include imported produce?"}
    filter -->|"no, the default"| domestic["Only produce with Finnish fresh or storage months this month"]
    filter -->|"yes"| both["Also produce with imported months this month"]
    domestic --> grid["Cards grouped into vegetable, fruit, berry, mushroom and herb"]
    both --> grid
    grid --> card["Card: name, season label, fresh or from storage, unverified badge if the months are drafted"]
    card -->|"click"| panel["Ingredient panel opens, the grid stays visible and clickable"]

    panel --> months["Twelve-month bar: fresh, from storage, not available, this month ringed"]
    panel --> recipes["Recipes using this ingredient, filtered by meal type, each a link into the recipe view"]
    panel --> similar["Similar ingredients"]
    panel --> combine["Combine: space reserved, logic is step 5"]

    similar -->|"click"| panel
    card -->|"click another card"| panel
    panel -->|"close button or Escape"| grid
```

## Browsing recipes, and opening one

Built in step 2.

```mermaid
flowchart TD
    recipes["Recipe view: every recipe, in breakfast, lunch, dinner, dessert, side and snack sections"]
    recipes --> card["Card: title, effort, time, tags, a note when the ingredient list is not added yet"]
    card --> season{"At least one non-optional ingredient available from Finland this month?"}
    season -->|"yes"| marked["Marked in season, naming those ingredients"]
    season -->|"no, or no ingredient list"| unmarked["Not marked"]
    card -->|"click"| panel["Recipe panel opens, the grid stays visible and clickable"]
    panel --> method["Open the method: the source page, in a new tab"]
    panel --> notes["Personal notes, when there are any"]
    panel --> list{"Has an ingredient list?"}
    list -->|"no"| empty["Says so, and points at the method link"]
    list -->|"yes"| lines["Each line: amount, name, optional marker"]
    lines --> swaps["Swaps indented under their line: the replacement, why, the ratio, and the note"]
    panel -->|"close button or Escape"| recipes
```

## Renaming an ingredient or a recipe

Built in issue 009. Since step 2 a recipe title is renamed in the recipe panel;
in the ingredient panel it is a link instead. Development only: in a production build the write route is
not compiled at all, and every name renders as plain text with nothing to click.

```mermaid
flowchart TD
    panel["Ingredient panel: the ingredient's name. Recipe panel: the recipe's title"]
    panel -->|"click, or press and hold on a touch screen"| field["The name becomes a field, its text selected"]
    field -->|"Escape"| panel
    field -->|"Enter, or clicking away"| check{"Is the new name usable?"}
    check -->|"empty, or unchanged"| panel
    check -->|"changed"| write["PATCH /api/rename/:kind/:id"]
    write --> guard{"Running in development?"}
    guard -->|"no"| gone["404: the route was never built"]
    guard -->|"yes"| validate{"Valid slug id, name 1 to 80 characters, file exists?"}
    validate -->|"no"| error["The old name comes back, with the reason beneath it"]
    validate -->|"yes"| file["The JSON file in data/ is rewritten: name only, id and verified untouched"]
    file --> refresh["router.refresh(): the panel and the cards behind it both show the new name"]
    refresh --> reorder["The card moves to its new alphabetical place, Finnish letters included"]
```

Lists are ordered by the name on screen, not by the id underneath, so renaming
something moves it. Tia's call on 2026-09-17: ids stay English slugs forever, so
id order stops being alphabetical the moment a name becomes Finnish.

## Approving a photo for an ingredient

Built in issue 010. Development only, apart from the credits page: the contact
sheet and its write route are not compiled into a production build at all, so
`/photos` is a 404 there. Nothing enters `public/` or `data/` by clicking around
the sheet; downloading is a separate, deliberate step run from the terminal.

```mermaid
flowchart TD
    search["node scripts/photo-candidates.mjs: two Commons searches per ingredient, the plain name and the name plus its category"]
    search --> limited{"Did both searches come back?"}
    limited -->|"one was rate-limited"| flagged["The row is marked half-blind, and the sheet says so above its tiles"]
    limited -->|"yes"| file
    flagged --> file
    file["scripts/photo-candidates.json: four candidates each, with author, licence and source url"]
    file --> again["Re-running merges into this file: rows already searched are kept, half-blind rows are searched again"]
    again -.-> file
    file --> sheet["/photos: one row per ingredient, four tiles, captioned with licence and author"]
    sheet -->|"click a tile"| post["POST /api/photos/approve"]
    sheet -->|"None of these"| post
    post --> guard{"Running in development?"}
    guard -->|"no"| gone["404: the route was never built"]
    guard -->|"yes"| validate{"Valid slug id, every attribution field present, https urls only?"}
    validate -->|"no"| error["The tile reverts and says it could not save"]
    validate -->|"yes"| approvals["scripts/photo-approvals.json: the whole candidate, or null for none of these"]
    approvals --> download["node scripts/download-approved.mjs, run by hand"]
    download --> public["public/images/ingredients/<id>.jpg, fetched at 800px"]
    download --> data["The ingredient's image field: file, author, licence, source url"]
    data --> credits["/credits: every photo in the app, derived from the data, and a real page in production"]
```

## Not drawn yet

The recipe panel (step 2), the month strip and the month view (step 3),
favourites, tried and monthly progress (step 4), and combine (step 5).
