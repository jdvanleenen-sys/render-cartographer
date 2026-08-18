# Blind cold-reader run 01 (2026-08-15)

A fresh model with none of the build context was handed only this folder and told:
"drop this in and use it to understand our Render Factory." It followed the README,
tried to wander the map, and tried to break the one rule. We kept the run because it
broke our own claim, and we fixed the build from it. This is the tape, not a summary.

## What it confirmed works
- From a cold start, the fridge-swap question was answered correctly, with an explicit
  "does not hit" that stops a reader chasing Documents or pricing.
- The ghost card and the naming-collisions reference were precise, cited, and machine-checkable.

## What it broke (and what we changed)
1. **Monolithic map defeated the one rule.** The catalog and every card lived in a single
   file (`examples.md`), so "catalog, then one card, then stop" was impossible: opening the
   catalog opened the whole map. FIX: the real map now lives in `map/` as a catalog file plus
   one file per card. `examples.md` is relabeled a flattened preview, not the map to load.
2. **"The catalog" had no address; the "cards/objects folder" did not exist.** The docs pointed
   at shelves that were never built as files. FIX: `map/catalog.md` and `map/cards/` now exist;
   the README walk names them.
3. **The checker enforced the one rule as a phrase-grep, blind to file granularity.** A single
   monolithic file passed "no slurp." FIX: the checker now enforces structure: a card file holds
   exactly one card, and the catalog holds none.
4. **"8 tables" contradicted the catalog's own exclusions** (it counted the two "wrong neighbour"
   tables). FIX: corrected to 6 tables, with the 2 lookalikes named as neighbours.
5. **"98 records" was asserted but stored nowhere checkable.** FIX: record counts are pinned in
   `source-index.json` and the checker verifies any "N records" claim against them. Also removed an
   unverified "98+ Catalogue Items" figure from the ghost evidence.

Minor: added `Required Items` and `Source Asset Path` to the Render Variants card shape; used full
table names with the short name in parentheses on first mention.
