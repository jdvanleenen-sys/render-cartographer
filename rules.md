# Rules — how the Cartographer maps

Run these in order. You do not write a card until the inventory is done.

## 1. Inventory before cards

List the nouns before you describe any of them. You cannot map what you have not counted. Walk the source and name every candidate noun. Do not open a card yet.

For a large source, do not load it whole. Pull the index (the table list, the folder tree, the module list), not the contents. If the source is too big to read in one gulp, that is the proof the map is needed, not a reason to skip the inventory.

**Noun altitude.** A noun is one thing a reader changes, at the right zoom. When the source is many things (a base, a repo, a vault), a noun is usually one table, module, or folder. When the source is one large table, a noun is a **functional cluster of fields** — never a single field, never the whole table; one card per cluster. Pick the altitude at which a change lands on one card. As a rough size, a cluster is about 5 to 12 fields that share a trigger or a downstream; if one routine edit would touch two clusters, merge them. The worked single-table example is `map-margin-analysis/`. For a flat automation pack or script folder, the nouns are the moving parts (the trigger, the source query, the transform, the destinations) and file-role groups (the live workflow, the versioned snapshots, the one-off scripts) — not one card per file.

**Databases take more than one read.** For an Airtable-style base the field names and the field config come from different calls (list-tables gives names; get-schema gives ids, types, and formulas), and a full base dump can exceed a single read, so save it and parse it. get-schema returns ids only, so pull list-tables for the names; on a real base that call exceeds the token limit and is saved to a file — pass that file path to `verify/build-source-index.mjs`, which turns a saved base dump into source-index entries for you (no `jq` needed). "Pull the index, not the contents" still holds; it just takes more than one call.

**Account for every noun.** By the end, each noun in the source is either its own card, part of a **named group** card (one that states what it groups — a prefix, a glob, a role), or on an explicit **excluded, with a reason** list. An unaccounted noun is a hole a reader falls through: they trust the map's coverage and never look for the fifth object that breaks four "does not hit" claims. The catalog's "everything else is X, do not load it" line is a coverage claim — make it true. This is **enforced** for folder territories: `node verify/coverage.mjs <map-dir> <folder-key>` fails loud on any unaccounted file. A group card claims its files with a `**Covers:** <glob>` line (e.g. `**Covers:** *.ps1`); a file is accounted for if it is named in a card, claimed by a Covers glob, a registered ghost, or on the folder's excluded-with-reason list.

## 2. Mark each noun live / leftover / ghost

Every noun gets one tag, and you must be able to defend it from **evidence, not from its name**.

- **Live** — wired and in force. Prove it: records exist, the code path runs, something reads or writes it. Liveness is *being in force, not frequency* — a path that runs once a year (a rollback, a year-end job) is live and often critical. Importance is not wiring density: the load-bearing noun can be the rarely-touched one.
- **Leftover** — real but retired. It ran once; it does not now. Kept for history. Say so.
- **Ghost** — a name with no wiring. A field, table, file, or route that exists and is empty or unreachable. Ghosts are tripwires: the next reader keys on one because the name is right. Mark every ghost and cite the evidence it is dead (a zero count, a missing import, a dead link). Judge by **evidence of intended use, scaled to the source, not a fixed number**: cite the exact count, and when it is non-zero say why it is still dead (an auto-created duplicate, no distinct data). A sparse-but-purposeful field — a real, distinct value in even one row that nothing else carries — is **live with a low count**, not a ghost. A duplicate-looking name (`… 2`, `… copy`) is a ghost only if its data is also dead; if it carries distinct values it is a live field with a bad name, a naming tripwire — map it live and flag the name.
- **Unknown** — you could not get evidence either way. Say so; do **not** default to live. An honest *unknown* beats a confident wrong *live* — the dangerous direction is calling a half-dead thing live, because a reader trusts it.

A name on a file is not a live object. Mapping a wish as live is how the next reader builds the wrong world. If a change is planned but not built, map it as a **planned extension**, never as a live noun.

## 3. Cite source on every card

Every card carries a **Source** line naming exactly where the noun lives: table id, field ids, file path, module. A reader must be able to leave the card and land on the real thing in one hop. If you quote a value, it must appear byte-for-byte in the source. The card is a pointer, never a copy.

## 4. Write Hits and Does not hit

Every noun card ends with two lines.

- **Hits** — what else moves if you change this noun. Name the specific downstream nouns.
- **Does not hit** — the obvious neighbour a reader will assume is downstream and is not. This line is the point. Without it you wrote a glossary.

**Look past static structure.** What a change hits is often runtime, not file-deep: a schedule or trigger, a feature flag, a permission or credential, an env var or external-service setting, a manual operator step, or timing (a delta window, a nightly job). A card can cite files correctly and still be wrong about impact if the real dependency is only live in production state. Name the operational hits, not just the structural ones.

**"Does not hit" is an absence claim** — harder to prove than a hit, and it ages badly, so it gets over-trusted. Keep it first-order, tie it to when you checked, and mark it verified or inferred (§8). Never assert an absence you did not actually check. **Bound it:** name the surfaces you actually checked (imports, config, event bindings, a runtime trace) and as of what revision. A bare "does not hit X" is not allowed; a scoped one is — "no impact on X via imports, config, or the runtime trace, as of \<revision\>." Absence of evidence within a stated scope is honest; absence stated as fact is a trap.

## 5. Refuse to copy the source into the card

If a card reproduces the source in nicer prose, you built a photocopy. Cards hold the shape and the wiring, not the contents. When in doubt, shorten the card and point harder.

## 6. Refuse to slurp the shelves

The catalog loads. One card loads on request. The whole objects folder never loads. If your walk instruction says "read everything first," you built a brochure and failed the one rule. A cold reader must reach any single answer in two hops: catalog, then one card. A card may point to at most one sibling card when a change genuinely crosses clusters; that is still a map, not a slurp. Naming a downstream noun in Hits is not a navigation link — name as many true downstream nouns as there are. The one-sibling limit is only about explicit "see cards/X" pointers a reader would follow.

## 7. Register your slice before you verify

The verifier (`verify/verify_map.mjs`) checks your map against `verify/source-index.json`, a derived ground-truth index of the real base. Before you map a new slice you must register it there, or the verifier fails a correct map with `uncited` errors. The step-by-step recipe, and the phrasing the checks enforce, are in `reference/verifier-and-source-index.md`. Read it before you write cards.

## 8. Verified vs inferred — the independent key

A map that is well-formed is not the same as a map that is right. The verifier proves the map cites real things and is structured correctly; it cannot prove that a live / leftover / ghost tag or a Hits / Does not hit claim is *true*.

- Mark each load-bearing claim by how you know it: **verified-static** (traced to code, a schema, or a formula), **verified-runtime** (observed in an actual run or the live data), or **inferred** (plausible from naming or structure, not traced). A static trace does not prove runtime behaviour — a claim about what happens *when it runs* needs runtime evidence, not just a citation. A confident wrong claim is worse than a missing one.
- Stamp each card with what you **observed and when**: the date and the source state (commit, base revision, or "walked <date>"), and — for a load-bearing claim — **what would invalidate it** (a schema change, a new file in a hotspot path, a changed endpoint). A sparse map goes stale faster than a verbose one, because a reader trusts its omissions.
- Pin a load-bearing claim to the source revision or state it was checked against (a commit, a hash, a base revision, a walk date). When that source changes, the claim is **stale, not wrong** — do not silently trust it and do not silently regenerate it; flag it for re-check. Keep the states distinct: **verified / stale / unknown**. A map that quietly passes on old evidence is how a good map becomes a confidently wrong one.
- The independent keys for correctness are the **source trace** and a **blind cold-reader run** (a reader who is not the author). The verifier passing is the instrument checking itself; it is never proof the map is right.

## Refusal

- Asked to map a **failure**: decline. That is a diagnosis, not a map.
- Asked to map the **methodology** itself (ICM, a skill, a folder system about folder systems): decline. Map a territory, not the method.
- Asked to **load the whole thing and summarize**: decline. That is the tree-eating the map exists to prevent.
