# User flows

Mermaid flowcharts of what the app actually does, updated in the same change
that alters a flow, so a flow can be reviewed by reading rather than by clicking
through the app. Anything not drawn here is not built yet.

## Browsing the current month, and opening an ingredient

Built in issues 007 and 008.

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
    panel --> recipes["Recipes using this ingredient, filtered by meal type"]
    panel --> similar["Similar ingredients"]
    panel --> combine["Combine: space reserved, logic is step 5"]

    similar -->|"click"| panel
    card -->|"click another card"| panel
    panel -->|"close button or Escape"| grid
```

## Not drawn yet

The recipe panel (step 2), the month strip and the month view (step 3),
favourites, tried and monthly progress (step 4), and combine (step 5).
