# Templates: start a new map by copying, not imitating

Copy these blanks into a new map folder and fill the `<angle-bracket>` placeholders, then delete the hint comments.

- `catalog.template.md` -> `map/catalog.md` (the front door, points only)
- `card.template.md` -> `map/cards/<noun>.md` (one live or leftover noun)
- `ghost.template.md` -> `map/cards/ghost_<noun>.md` (a dead name, group same-pattern ghosts into one)
- `change-walk.template.md` -> `map/change-walks/<change>.md`

Then register the new slice in `verify/source-index.json` (see `reference/verifier-and-source-index.md`) and run `node verify/verify_map.mjs <map-dir>`.
