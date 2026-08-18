# HFS -> Airtable sync catalog (front door)

Start here. Open ONE card, then stop. Do not read all 183 files in this folder. That is the whole-folder read this map exists to spare you.

**The later reader may be a model** with no memory of this pack, or a new developer. Same map, same job.

## What this territory is
`C:\GitHub\hfs-airtable-mapping` is an n8n automation pack that syncs the HFS CRM (Home Front Sales, a Microsoft SQL Server source) one-way into an Airtable base (`appEXAMPLE0000001`). Of 183 files, **the live running system is one cloud workflow plus about two on-disk files.** The other ~180 files are build-time scaffolding, retired snapshots, prior-era docs, and two look-alike ghost workflows. The single most important fact in this map: **the workflow that runs is not a file you can open here.** It lives in n8n cloud (workflow `6j8NPHZc9CFwQ5KP`), and the JSON on disk is a stale earlier version.

## Came here to change something? Start here
You do not need to know the parts. Find your task, open the one card, stop.
- **Add or change a field the sync sends to Airtable** -> cards/transform-node.md (full walk: change-walks/add-hfs-field.md)
- **The sync broke, or you need to edit the live workflow** -> change-walks/edit-the-live-sync.md
- **A signed contract never showed up in Airtable** -> cards/sql-source.md (the query decides what enters)
- **Someone said "just redeploy it"** -> stop and read cards/deploy-and-patch.md first. The obvious script reverts production to an old version.
- **Which files actually run vs. which are junk** -> the live spine below (about 4 files run, ~180 do not)

## The live spine
- The live n8n workflow (v3) -> cards/live-workflow.md. The 9-node pipeline that actually runs daily at 7 AM.
- HFS SQL source query -> cards/sql-source.md. The SELECT against `tblCustomers` that feeds the sync.
- Transform Data node -> cards/transform-node.md. The field-mapping and status-derivation logic.
- Airtable destinations (Buyers + Contract) -> cards/airtable-destinations.md. The two tables the sync writes.
- Deploy & patch scripts -> cards/deploy-and-patch.md. How you change the live workflow (this is the only correct way to edit it).

## The current reference
- Current mapping doc -> cards/current-mapping-doc.md. `HFS_AIRTABLE_MAPPING.md`, the one doc that matches the live workflow.

## Retired but kept (leftover)
- Prior-era mapping docs -> cards/prior-era-docs.md. `MASTER_MAPPING.md` and `hfs_schema.md`, earlier plans, partly superseded.
- Superseded workflow snapshots -> cards/superseded-workflow-snapshots.md. The on-disk `*.json` and `*.js` that no longer match the live workflow.
- Build & diagnostic scripts -> cards/scaffolding-scripts.md. About 165 one-off `.ps1` probes, fixes, and backfills.

## Before you edit (traps)
- Ghost: other HomeFront workflows -> cards/ghost_other-homefront-workflows.md. `wf_*.json` are webhook-based syncs, NOT the live SQL sync.
- Ghost: hardcoded secrets -> cards/ghost_hardcoded-secrets.md. Stale API keys and plaintext DB credentials scattered in scripts and docs.
- Naming trap: **"v2" and "v3" mean different things in the filename vs. the live workflow.** `hfs_sync_v2_workflow.json` is NOT what runs. See the superseded-snapshots card.
- Naming trap: three docs describe the mapping from three different dates. Only the current-mapping-doc card matches reality.

## Change walks
- Add a new HFS column to the sync -> change-walks/add-hfs-field.md
- Edit the live sync safely -> change-walks/edit-the-live-sync.md
