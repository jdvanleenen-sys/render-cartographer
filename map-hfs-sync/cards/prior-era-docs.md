# Prior-era mapping docs (leftover)

**Source:** `MASTER_MAPPING.md` (2026-03-31) + `MASTER_MAPPING.html`, and `hfs_schema.md` (2026-03-14). Both predate the current doc.
**Tag:** leftover.
**What it is:** the earlier planning documents. Real, useful history, but partly wrong about the system as it runs today. `hfs_schema.md` is the original exploratory plan (5 tables incl. Deposits and Project-Customers, many open questions). `MASTER_MAPPING.md` is the mid-project master reference. It resolved decisions and documents BOTH v1 (superseded) and v2 (which it calls "CURRENT", 11 nodes, Create-not-upsert).
**Shape (why they are kept, and where they mislead):**
- Still valuable: the full HFS-to-Airtable column tables with Airtable column ids, the Construction_Status 0-9 code map, the City normalization rules, and the SQL join to Sales_Persons/Realtors, none of which the current doc repeats.
- Now wrong: `MASTER_MAPPING.md` calls v2 "CURRENT" and describes an 11-node Create-Contract dedup design; the live workflow is the 9-node v3 upsert. `hfs_schema.md` plans multi-table/loop syncs (Projects, Deposits, per-job loops) that were never built into the live pipeline.
**Hits:** if you edit these to "correct" them, you are editing history, not the running system. The live behaviour lives in the workflow and `HFS_AIRTABLE_MAPPING.md`. Mine them for the extra column ids and code maps the current doc omits.
**Does not hit:** the live workflow. Nothing reads these at runtime; they are references for humans only. Do not treat their node lists or "CURRENT" labels as the live shape.
