# Wayfinder Cartographer

A drop-in folder that turns an AI into a **Cartographer**. Point it at a body of work and it leaves a **map** a later reader can wander without reading the whole thing. The later reader is often a cold model. Sometimes a new person. Same map.

This is not a diagnostician (it does not say why something failed) and not a tour (it does not narrate the whole thing). It hands you a catalog and doors.

## Why this exists (the two-hour call)

The people who get paid are the ones who can hand the next person — or the next AI — a system they can change *without* a two-hour handoff call. That is what this produces.

**Before:** to safely change the HFS sync, read 183 files or book a two-hour call with whoever built it.
**After:** open the catalog, read one card, make the change. Two file-opens.

**See it work in 60 seconds (cold AI):** drop the `map-hfs-sync/` folder into any AI with no memory of your system and ask:

> "Using only this folder, what breaks if I change the SQL query, and what does it NOT touch?"

It answers correctly from one card (`sql-source`) and stops — a stranger, human or model, gets the answer without loading the rest. That is the whole product.

## Worked maps — proven across system shapes

This is a mapmaker, not a single map. The same skill produced all of these, each passing the verifier:

- **`map/`** — the Render Factory: a *multi-table slice of an Airtable base* (buyer selections → rendered video).
- **`map-margin-analysis/`** — a *single 112-field table*, where a noun is a cluster of fields.
- **`map-hfs-sync/`** — an *n8n automation folder* (183 files; only ~4 are the live system).

It has also been cold-run — by a fresh session with no memory — on a **third-party code repo** and an **Obsidian vault** (see `CHANGELOG.md`): **five system shapes in all.** The method is source-agnostic; only the verifier's ground-truth setup changes per shape.

> Note: in the worked maps, live infrastructure identifiers are masked. The Airtable base, table, and field ids are replaced with example ids (`tblEXAMPLE…`), and an n8n instance host and two credential ids are masked as `[…]`. Every other citation (table and field names, file paths, line numbers, record counts) is real and unchanged.

## What to feed it

A body of work that is still in force and that someone will change: a repo, a vault, an automation pack, a client-delivery folder, or a slice of a database. Not something that broke. Not the methodology itself.

## How a cold model should walk this folder

Load in this order. Do not load everything.

1. `identity.md` — who the Cartographer is and who the later reader is.
2. `rules.md` — how it maps: inventory first, tag live / leftover / ghost, cite source, write Hits and Does not hit.
3. `reference/card-types.md` — the closed set of card types.
4. Then produce the map for the target, or read an existing one.

To READ the finished map in this repo: open `map/catalog.md` (the front door), then open exactly **one** file in `map/cards/`, then stop. Two file-opens, ever. Never load the whole `map/cards/` folder at once. That is the one rule.

`examples.md` is a flattened preview: every card in one file, for reading convenience. It is the tour, not the map to load. The wanderable map is `map/`.

## The one rule

Open `map/catalog.md`, then one card in `map/cards/`, then stop. If any instruction here told you to add every file to the project, it would be wrong. It does not.

## In ICM terms

This is the ICM **system-map** form. The catalog is the front-door index (it points, stores almost nothing); the cards are the objects; `Hits` / `Does not hit` plus the catalog warnings are the effects index, kept on the noun so it cannot drift from a separate file; change-walks are process demonstrations; `verify/source-index.json` is a derived index (generated, never hand-typed); and `examples.md` is a derived flattened view of `map/` (rebuilt by `verify/build-examples.mjs`). Hand-built to this form, then verified against the ICM Architect skill.

## Verify a map

A map in this repo is checked, not trusted. The checker is Node (no runtime install needed):

```
node verify/verify_map.mjs map examples.md
```

It fails if a card cites a table or field the real base does not have, if a ghost is tagged live, if a "N records" claim disagrees with the source, if the walk tells a reader to slurp the whole source, if a card file holds more than one card, or if the catalog embeds a full card instead of pointing. Negative fixtures that MUST fail live in `verify/fixtures/` (one per failure mode):

```
node verify/verify_map.mjs verify/fixtures/fail_ghost-by-name.md    # expect exit 1
node verify/verify_map.mjs verify/fixtures/fail_field-invented.md   # expect exit 1
node verify/verify_map.mjs verify/fixtures/fail_slurp-negation.md   # expect exit 1
node verify/verify_map.mjs verify/fixtures/fail_heading-dodge.md    # expect exit 1
```

`verify/source-index.json` is the ground truth the checker cites against: the real table and field ids and names pulled from the base, record counts, and the proven ghost list. `verify/blind-run-01.md` is the cold-reader run that broke the first version and what we changed because of it.

**Coverage (folder territories).** Structural verification proves what is *in* the map is sound; coverage proves the map is *complete*. Run `node verify/coverage.mjs <map-dir> <folder-key>` — it fails unless every real file is accounted for (named in a card, claimed by a card's `**Covers:** <glob>` line, a registered ghost, or excluded-with-reason). Example: `node verify/coverage.mjs map-hfs-sync hfs-airtable-mapping`.

## What the later reader can do, cold

1. Find the front door from the catalog.
2. Open one card and know what the thing is and why it is shaped that way.
3. Name what else moves if they change it, and the obvious wrong neighbour.
4. Stop, without loading the rest.
