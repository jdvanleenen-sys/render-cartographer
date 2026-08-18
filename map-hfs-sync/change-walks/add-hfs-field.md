# Change walk — add a new HFS column to the sync

Say you want the HFS `Elevation` column to start landing on the Airtable Contract.

1. **SQL source** (cards/sql-source.md): add `c.Elevation` to the SELECT column list in the "Query HFS New Records" node. If you skip this, the column never enters the pipeline.
2. **Transform Data** (cards/transform-node.md): add an output key, e.g. `elevation: r.Elevation || null`, to the returned object. Downstream reads by key name, so the key must exist here.
3. **Upsert Contract** (cards/airtable-destinations.md): add the Airtable column to the write map, e.g. `'Elevation': '={{ $("Merge Project IDs").item.json.elevation }}'`. The Airtable column must already exist on the Contract table (create it in Airtable first).
4. **Deploy** (cards/deploy-and-patch.md): apply the change to the live workflow `6j8NPHZc9CFwQ5KP` — either edit the three nodes in the n8n UI, or write a fetch-modify-PUT patch script in the style of `patch_v3_upsert.ps1`.
5. **Update the doc** (cards/current-mapping-doc.md): add the row to `HFS_AIRTABLE_MAPPING.md` so the human contract still matches the workflow.

**Do not** edit `hfs_sync_v2_workflow.json` or any `transform_code_*.js` to make this change — they are snapshots that do not deploy themselves, and `deploy_v2.ps1` would push the stale v2 shape over your live v3 workflow.

**Does not hit:** Projects, Deposits, Margin Analysis, or any human-managed Contract column — adding one mapped column touches only that column.
