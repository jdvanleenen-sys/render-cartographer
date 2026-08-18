# The verifier and source-index.json

> **Mapping a folder, repo, vault, or pack (not a database)?** The table / field / record machinery below is for Airtable-style bases. Skip to **Non-database territories** near the end for the folder recipe (index the files, register, verify). The method is the same; only this registration file is source-specific.

The method prose and the verifier are one system. `verify/verify_map.mjs` checks your map against `verify/source-index.json`, a derived ground-truth index of the real base. If you write a map and skip this file, the verifier fails you with `uncited` and `invented-field` errors whose cause is not obvious. Read this before you write cards.

## Register your slice before you map it

Add an entry to `source-index.json`, **generated from the live base, never hand-typed** (if the base and this file disagree, re-walk the base; the base wins). The keys:

- **`tables`** — the `tbl` id and name of the table you are mapping, **and every neighbour table you cite in a card**. A link target named in a Hits line counts as a citation, so it must be registered.
- **`table_fields`** — for each table, the full list of field names. This feeds the `field "X"` check.
- **`fields`** — any specific `fld` id you cite by id, with a short label.
- **`record_counts`** — the table's record count (the number you put on the card's Source line).
- **`ghost_fields`** / **`ghost_names`** — the ids and names you have proven dead.

Rule of thumb: **every `tbl`/`fld` id that appears anywhere in your map must be a key in this file.**

**Generate it, don't type it.** Run `node verify/build-source-index.mjs <base-dump.json> <tblId> [tblId...] --write` to fill `tables`, `table_fields`, **and every field id in `fields`** from a saved base dump, then add `record_counts` and the ghosts yourself after probing (those need live counts). Never hand-type ids or names.

**Getting the dump.** The generator's input is the saved JSON from the base's list-tables call. On a real base that call exceeds the token limit and is written to a file for you — pass that file path to the generator. If it is not auto-saved, save it yourself, or build the dump per-table from the schema call. You cannot skip this: the field ids your cards cite must come from the live base.

**A neighbour needs only a `tables` entry.** A table you merely name in a Hits line (a link target) needs only its `tbl` id in `tables`. `table_fields` and `record_counts` are required only for a table you actually write a card about. **Presence in `tables` is not registration for your own table** — a table can already be there as an earlier map's neighbour; confirm yours also has `table_fields` and a `record_counts` entry before you verify.

## Phrasing the checks enforce (so you do not hit cryptic errors)

- **Record count** is checked only on the **Source line** (the line that cites the table id): write `table \`tbl…\`. 304 records.` Field-level counts anywhere else must be written as **"rows"**, not "records" — so a ghost's evidence reads "isNotEmpty returns 0 rows".
- **Citing ids**: put ids in backticks. You may write `the link field \`fldXXX\``; ids are recognised and skipped by the field-name check. Only quote a **name** after the word "field" if it is a real field name.
- **Slurp warnings**: phrase them subject-first ("you never load the whole table") or lead with "do not". An imperative like "Load the whole table only if…" trips the no-slurp check even when it is a warning.
- **Ghosts in a live card**: you may (and should) warn about a ghost in the **Does not hit** line — that is allowed. Do **not** put a ghost id or name in the card's **Source** or **Shape**; that reads as mapping a dead field as live and fails `ghost-as-live`.
- **Name collisions — the important one.** `ghost_names` is matched as a case-insensitive **substring** against every live card's claim region. If a dead field's name is *also* the name of a live table or field (e.g. a dead text-shadow field called "Projects and Addresses" when a live table has that name), do **not** register that name in `ghost_names` — it would fire `ghost-as-live` on your correct live cards. Register only the dead field's `fld` id in `ghost_fields`. Ids never collide; names do. This is exactly the case the Cartographer exists to catch, so get it right.

## Non-database territories (folders, repos, packs, vaults)

Register a folder the same way you register a base, with the generator's folder mode:

```
node verify/build-source-index.mjs --dir <folder> --key <name> --write
```

This walks the folder and fills `folders[<name>].files` with every real file path. After probing, add `ghost_files` (the paths you have proven dead) to that entry.

With a folder registered, the verifier has teeth on a folder map: every filename-shaped file a card cites must exist in the index (**path anchor**), and a live card may not present a `ghost_files` path as live (**ghost-file-as-live**). If a map cites files but no folder is registered, the verifier **fails loud** rather than passing a folder map blind.

What still does not apply on a folder: the Airtable id / field / record-count checks (there are no `tbl`/`fld` ids). And the path anchor recognises files by a distinctive stem (underscore, hyphen, digit, or uppercase), so a bare-lowercase name like `config.json` is not auto-checked — cite those in a way you can eyeball. A blind cold-reader run is still the strongest check of your live / leftover / ghost calls; keep it as `verify/blind-run-*.md`. The worked folder example is `map-hfs-sync/`.

**Coverage.** After registering, run `node verify/coverage.mjs <map-dir> <folder-key>`. It fails loud unless every real file is accounted for — named in a card, claimed by a card's `**Covers:** <glob>` line, a registered ghost, or on `folders["<key>"].excluded` (an array of globs, each with a reason). This is how "account for every noun" (rules §1) becomes a guard rather than a hope, and it catches the omission a citation-check never can: the file that got no card at all.

## Then verify

Run `node verify/verify_map.mjs <map-dir>` (or point it at the whole repo to confirm no regression on other maps). Fix every failure before you hand the map over. A blind cold-reader run is a stronger check when a second fresh reader is available; save it as `verify/blind-run-*.md`.
