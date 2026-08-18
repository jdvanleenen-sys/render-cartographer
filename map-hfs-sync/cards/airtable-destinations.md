# Airtable destinations: Buyers + Contract (live)

**Source:** the "Upsert Buyer" and "Upsert Contract" nodes in live workflow `6j8NPHZc9CFwQ5KP`. On disk the column maps are visible in `hfs_sync_v2_workflow.json` (Upsert Buyer lines 124-152; final write node lines 154-191) and, for the current upsert form, in `patch_v3_upsert.ps1` (STEP 4, lines 90-119). Base `appEXAMPLE0000001`.
**Tag:** live.
**What it is:** the two write points of the sync. Everything upstream exists to feed these two nodes.
**Shape:**
- **Upsert Buyer** -> the Customers (Buyers) table. Match key: `HFS Customer No`. Writes only: `HFS Customer No`, `First Name`, `Last Name`, `Email`, `Phone Number`. Its output record id flows into the next node as the buyer link.
- **Upsert Contract** -> the Contract table. Match key (live/v3): `HFS Job No`. Writes: `HFS Job No`, `HFS Customer No`, `Buyer Names`, `Contract Date`, `Pre-GST Sale Price`, `QP Preferred Closing Date`, `Actual Closing Date`, `Lawyer`, `Contract Status`, `Lender`, `Series`, `Rescind Date`, `Last HFS Sync`, `Project (Record Link)`, `Customer (Buyer)`. `typecast: true` lets Airtable coerce types.
- Deliberately never written by the sync (human-managed, safe to edit): Contract Status detail, Version Number, all cost/GST/discount currency columns, Realtor, Model Link, Firm dates. `HFS Customer No` on Contract is a lookup off the linked buyer, not written here.
**Hits:** the match key decides create-vs-update. v3 keys Contract on `HFS Job No`; if two contracts share a Job number (co-buyer, re-sale), the second overwrites the first. Adding a column to the write map means the sync will start overwriting whatever a human typed there. The `Project (Record Link)` value depends entirely on Find Projects / Merge Project IDs resolving the Job number upstream — a blank resolve leaves the link null.
**Does not hit:** the Projects and Addresses table (read-only upstream), Deposits, Project-Customers junction, or Margin Analysis. None are write targets of this sync.
