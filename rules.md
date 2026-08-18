# Rules: how the Cartographer maps

Run these in order. You don't write a card until the inventory is done.

## 1. Inventory before cards

List the nouns before you describe any of them. You can't map what you haven't counted. Walk the source and name every candidate noun. Don't open a card yet.

For a large source, don't load it whole. Pull the index (the table list, the folder tree, the module list), not the contents. If the source is too big to read in one gulp, that's the proof the map is needed, not a reason to skip the inventory.

**Noun altitude.** A noun is one thing a reader changes, at the right zoom. When the source is many things (a base, a repo, a vault), a noun is usually one table, module, or folder. When the source is one large table, a noun is a **functional cluster of fields**. Never a single field, never the whole table. One card per cluster. Pick the altitude where a change lands on one card. As a rough size, a cluster is about 5 to 12 fields that share a trigger or a downstream. If one routine edit would touch two clusters, merge them. The worked single-table example is `map-margin-analysis/`. For a flat automation pack or script folder, the nouns are the moving parts (the trigger, the source query, the transform, the destinations) and the file-role groups (the live workflow, the versioned snapshots, the one-off scripts). Not one card per file.

**Databases take more than one read.** For an Airtable-style base the field names and the field config come from different calls. list-tables gives names. get-schema gives ids, types, and formulas. A full base dump can be bigger than a single read, so save it and parse it. get-schema returns ids only, so pull list-tables for the names. On a real base that call is bigger than the token limit and gets saved to a file. Pass that file path to `verify/build-source-index.mjs`, which turns a saved base dump into source-index entries for you (no `jq` needed). "Pull the index, not the contents" still holds. It just takes more than one call.

**Account for every noun.** By the end, each noun in the source is one of three things. Its own card, part of a **named group** card (one that states what it groups: a prefix, a glob, a role), or on an explicit **excluded, with a reason** list. An unaccounted noun is a hole a reader falls through. They trust the map's coverage and never look for the fifth object that breaks four "does not hit" claims. The catalog's "everything else is X, don't load it" line is a coverage claim. Make it true. This is **enforced** for folder territories. `node verify/coverage.mjs <map-dir> <folder-key>` fails loud on any unaccounted file. A group card claims its files with a `**Covers:** <glob>` line (for example `**Covers:** *.ps1`). A file is accounted for if it's named in a card, claimed by a Covers glob, a registered ghost, or on the folder's excluded-with-reason list.

## 2. Mark each noun live / leftover / ghost

Every noun gets one tag, and you have to be able to defend it from **evidence, not from its name**.

- **Live.** Wired and in force. Prove it. Records exist, the code path runs, something reads or writes it. Live means being in force, not how often it runs. A path that runs once a year (a rollback, a year-end job) is live, and often critical. Importance isn't wiring density. The load-bearing noun can be the one nobody touches.
- **Leftover.** Real but retired. It ran once. It doesn't now. Kept for history. Say so.
- **Ghost.** A name with no wiring. A field, table, file, or route that exists and is empty or unreachable. Ghosts are tripwires. The next reader keys on one because the name is right. Mark every ghost and cite the evidence it's dead (a zero count, a missing import, a dead link). Judge by **evidence of intended use, scaled to the source, not a fixed number**. Cite the exact count, and when it's non-zero say why it's still dead (an auto-created duplicate, no distinct data). A sparse-but-purposeful field (a real, distinct value in even one row that nothing else carries) is **live with a low count**, not a ghost. A duplicate-looking name (`… 2`, `… copy`) is a ghost only if its data is also dead. If it carries distinct values it's a live field with a bad name, a naming tripwire. Map it live and flag the name.
- **Unknown.** You couldn't get evidence either way. Say so. Do **not** default to live. An honest *unknown* beats a confident wrong *live*. The dangerous direction is calling a half-dead thing live, because a reader trusts it.

A name on a file isn't a live object. Mapping a wish as live is how the next reader builds the wrong world. If a change is planned but not built, map it as a **planned extension**, never as a live noun.

## 3. Cite source on every card

Every card carries a **Source** line naming exactly where the noun lives. Table id, field ids, file path, module. A reader has to be able to leave the card and land on the real thing in one hop. If you quote a value, it has to appear byte-for-byte in the source. The card is a pointer, never a copy.

## 4. Write Hits and Does not hit

Every noun card ends with two lines.

- **Hits.** What else moves if you change this noun. Name the specific downstream nouns.
- **Does not hit.** The obvious neighbour a reader will assume is downstream and isn't. This line is the point. Without it you wrote a glossary.

**Look past static structure.** What a change hits is often runtime, not file-deep. A schedule or trigger, a feature flag, a permission or credential, an env var or external-service setting, a manual operator step, or timing (a delta window, a nightly job). A card can cite files correctly and still be wrong about impact if the real dependency is only live in production state. Name the operational hits, not just the structural ones.

**"Does not hit" is an absence claim.** It's harder to prove than a hit, and it ages badly, so it gets over-trusted. Keep it first-order, tie it to when you checked, and mark it verified or inferred (§8). Never assert an absence you didn't actually check. **Bound it.** Name the surfaces you actually checked (imports, config, event bindings, a runtime trace) and as of what revision. A bare "does not hit X" isn't allowed. A scoped one is: "no impact on X via imports, config, or the runtime trace, as of \<revision\>." Absence of evidence within a stated scope is honest. Absence stated as fact is a trap.

## 5. Refuse to copy the source into the card

If a card reproduces the source in nicer prose, you built a photocopy. Cards hold the shape and the wiring, not the contents. When in doubt, shorten the card and point harder.

## 6. Refuse to load the whole set of cards

The catalog loads. One card loads on request. The whole cards folder never loads. If your walk instruction says "read everything first," you built a brochure and failed the one rule. A cold reader has to reach any single answer in two hops. Catalog, then one card. A card may point to at most one sibling card when a change genuinely crosses clusters. That's still a map, not a slurp. Naming a downstream noun in Hits isn't a navigation link. Name as many true downstream nouns as there are. The one-sibling limit is only about explicit "see cards/X" pointers a reader would follow.

## 7. Register your slice before you verify

The verifier (`verify/verify_map.mjs`) checks your map against `verify/source-index.json`, a derived ground-truth index of the real base. Before you map a new slice you have to register it there, or the verifier fails a correct map with `uncited` errors. The step-by-step recipe, and the phrasing the checks enforce, are in `reference/verifier-and-source-index.md`. Read it before you write cards.

## 8. Verified vs inferred: the independent key

A map that's well-formed isn't the same as a map that's right. The verifier proves the map cites real things and is structured correctly. It can't prove that a live / leftover / ghost tag or a Hits / Does not hit claim is *true*.

- Mark each load-bearing claim by how you know it. **verified-static** (traced to code, a schema, or a formula), **verified-runtime** (observed in an actual run or the live data), or **inferred** (plausible from naming or structure, not traced). A static trace doesn't prove runtime behaviour. A claim about what happens *when it runs* needs runtime evidence, not just a citation. A confident wrong claim is worse than a missing one.
- Stamp each card with what you **observed and when**. The date and the source state (commit, base revision, or "walked <date>"), and for a load-bearing claim, **what would invalidate it** (a schema change, a new file in a hotspot path, a changed endpoint). A sparse map goes stale faster than a verbose one, because a reader trusts its omissions.
- Pin a load-bearing claim to the source revision or state it was checked against (a commit, a hash, a base revision, a walk date). When that source changes, the claim is **stale, not wrong**. Don't silently trust it and don't silently regenerate it. Flag it for re-check. Keep the states distinct: **verified / stale / unknown**. A map that quietly passes on old evidence is how a good map becomes a confidently wrong one.
- The independent keys for correctness are the **source trace** and a **blind cold-reader run** (a reader who isn't the author). The verifier passing is the instrument checking itself. It's never proof the map is right.

## Refusal

- Asked to map a **failure**: decline. That's a diagnosis, not a map.
- Asked to map the **method** itself (ICM, a skill, a folder system about folder systems): decline. Map a territory, not the method.
- Asked to **load the whole thing and summarize**: decline. That's the whole-thing-reading the map exists to prevent.
