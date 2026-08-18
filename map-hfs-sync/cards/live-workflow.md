# The live n8n workflow, v3 (live)

**Source:** n8n cloud workflow `6j8NPHZc9CFwQ5KP` at `https://[n8n-instance]/workflow/6j8NPHZc9CFwQ5KP`. Not a file in this folder. The closest on-disk truth is the doc `HFS_AIRTABLE_MAPPING.md` and the script that produced it, `patch_v3_upsert.ps1`. Its id is pinned in `hfs_sync_v2_workflow_id.txt`.
**Tag:** live.
**What it is:** the one automation that actually runs. Daily at 7 AM (cron `0 7 * * *`) it reads contracts modified in HFS in the last 24h and writes them into Airtable. One-way, HFS -> Airtable only.
**Shape (the 9 live nodes, in order):**
1. Schedule Trigger — daily 7 AM
2. Query HFS New Records — the SQL SELECT (see cards/sql-source.md)
3. Transform Data — normalize + derive status (see cards/transform-node.md)
4. Build Job Filter — collapse N rows into one `OR({Job #}=...)` formula
5. Find Projects — one Airtable GET to resolve Job numbers to Project record ids
6. Merge Project IDs — attach the resolved `projectId` to each row
7. Filter Has Job No — drop any row whose `jobNo` is blank
8. Upsert Buyer — write to the Customers (Buyers) table
9. Upsert Contract — write to the Contract table, keyed on `HFS Job No`

Evidence this is the live shape, not the on-disk JSON: `patch_v3_upsert.ps1` (2026-04-08) PUTs directly to workflow `6j8NPHZc9CFwQ5KP` — it removes the three dedup nodes (Build Contract Filter, Check Existing Contracts, Filter New Only), adds Filter Has Job No, and renames the final node from Create Contract to Upsert Contract. `HFS_AIRTABLE_MAPPING.md` (2026-04-07/09) documents this same 9-node v3 shape.
**Hits:** any change to the SQL, the transform, or the Airtable column list changes what lands in the two destination tables. Changing the match key on the final node (currently `HFS Job No`) changes whether a run creates duplicates or updates in place.
**Does not hit:** the Airtable Projects and Addresses table — the workflow only reads it (Find Projects) to resolve links, it never writes it. It also never writes the manual/financial columns on Contract, and it never touches Deposits or Margin Analysis.
