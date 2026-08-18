# Transform Data node (live)

**Source:** the "Transform Data" code node in live workflow `6j8NPHZc9CFwQ5KP`. The authoritative on-disk copy of the live code is the embedded string in `patch_v3_upsert.ps1` (STEP 2, lines 37-75) — that is the version last PUT to the cloud. Two standalone `.js` files (`transform_code_v2.js`, `transform_code_v3.js`) are earlier drafts and do NOT match the live code (see cards/superseded-workflow-snapshots.md).
**Tag:** live.
**What it is:** the JavaScript node that turns raw HFS SQL rows into clean Airtable-shaped rows: renames columns, formats dates, and derives Contract Status from HFS bit flags.
**Shape (the parts that carry logic, not the 1:1 copies):**
- Date helpers: `toDate()` -> `YYYY-MM-DD`; `toDateTime()` -> full ISO 8601. `lastHfsSync` uses `toDateTime`; the other dates use `toDate`.
- Status derivation (order matters — first match wins): `Cancelled` -> "Cancelled"; else `Closed` or `Purchased` -> "C/S"; else `Sold` -> "Firm"; else `Reserved` -> "Lot Hold". Note the live values ("C/S", "Firm", "Lot Hold") differ from the strings in the older docs ("Closed / Possession Taken", "Active"). The live node wins.
- Phone fallback: `CellPhone` preferred, else `Phone`.
- `buyerNames`: `Customer_Name` + " " + `Customer_LName`, trimmed.
- Output keys are camelCase intermediate names (`jobNo`, `customerNo`, `contractDate`, `salePrice`, ...) consumed downstream by name.
**Hits:** rename an output key here and the matching expression in Upsert Buyer / Upsert Contract breaks (they read `$('Merge Project IDs').item.json.<key>` by name). Change the status-derivation order and existing contracts get restated on the next run.
**Does not hit:** the Airtable Contract Status column at rest. Although the node computes `contractStatus`, the current doc records a deliberate rule that Contract Status is human-managed; if that column is dropped from Upsert Contract's map, editing this derivation has no effect on Airtable. It also does not derive any Project or Construction data — that logic exists only in the retired `transform_code_v2.js` draft.
