# Superseded workflow snapshots (leftover)

**Source:** `hfs_sync_v2_workflow.json`, `hfs_sync_workflow.json`, `transform_code_v2.js`, `transform_code_v3.js`, and the pointer `hfs_sync_workflow_id.txt` (`vhKnR8Z6BkeIMTsV`).
**Tag:** leftover.
**What it is:** on-disk snapshots of earlier versions of the sync. They are the single biggest trap in this folder because their names read as "the workflow" but none of them matches what runs.
**Shape (what each really is):**
- `hfs_sync_v2_workflow.json` — the v2 architecture: 11 nodes, a 3-node dedup section (Build Contract Filter, Check Existing Contracts, Filter New Only), and a final **Create** Contract node keyed differently from live. `patch_v3_upsert.ps1` later removed those dedup nodes and switched Create -> Upsert on the live workflow. So this file is a pre-v3 snapshot. It is still the best on-disk reference for the SQL query and the Buyer column map, which v3 did not change.
- `hfs_sync_workflow.json` — v1 ("HFS -> Airtable Daily Sync", workflow `vhKnR8Z6BkeIMTsV`), the original upsert-everything design that could overwrite manual Airtable data. Superseded and inactive.
- `transform_code_v2.js` — a richer draft transform (Projects fields, City/Province/Construction_Status maps). Never the live contract transform; matches the abandoned multi-table plan.
- `transform_code_v3.js` — a slim contract-only draft WITHOUT the `toDate`/`toDateTime` helpers; the live transform (in `patch_v3_upsert.ps1`) has them, so even this file lags the live node.
**Hits:** deploying `hfs_sync_v2_workflow.json` (via `deploy_v2.ps1`) would overwrite the live v3 workflow back to v2. Copying any `transform_code_*.js` into the node would revert date/status behaviour.
**Does not hit:** the live workflow unless you deploy one of them. At rest they run nothing. Read them for shape and history; do not treat any as the current definition — the live workflow `6j8NPHZc9CFwQ5KP` wins.
