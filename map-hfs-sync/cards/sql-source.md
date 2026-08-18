# HFS SQL source query (live)

**Source:** the "Query HFS New Records" node in live workflow `6j8NPHZc9CFwQ5KP`. On disk, the exact SELECT is mirrored in the "Query HFS New Records" node of `hfs_sync_v2_workflow.json` (lines 22-24) and documented in `HFS_AIRTABLE_MAPPING.md` Stage 1. Runs against Microsoft SQL Server table `tblCustomers` via n8n credential `[sql-cred-id]` ("HFS SQL Server").
**Tag:** live.
**What it is:** the single query that defines what enters the pipeline. It is a delta read: contracts (not all customers) modified in the last day.
**Shape (the SELECT's own filter, the part that decides scope):**
- `WHERE c.webdeleted = 0`: skip soft-deleted rows
- `AND c.Contract_Signed_Date IS NOT NULL`: only signed contracts (this is why prospects/quotes never sync)
- `AND c.ModifiedDate >= DATEADD(day, -1, CAST(GETDATE() AS DATE))`: the 24h delta window
- Columns pulled: `Customer_No`, `Job_No`, `Customer_Name`, `Customer_LName`, `Email`, `CellPhone`, `Phone`, `Contract_Signed_Date`, `Total_Sales_Price`, `Expected_Occupancy`, `Purchased_Date`, `Law_Firm`, `Lending_Institution`, `RescindDate`, `ModifiedDate`, and the status bits `Cancelled` / `Closed` / `Purchased` / `Sold` / `Reserved`, plus `Series`.
**Hits:** widen the WHERE clause and more rows flow to Transform Data and both destinations. Add a column here and it becomes available to the transform (but only appears in Airtable if you also map it in Transform Data and Upsert Contract). The delta window (`-1 day`) plus the 7 AM schedule means a row modified after a run but before the next window edge can be missed. That is a scope property of this query, not a transform bug.
**Does not hit:** Airtable directly. This node only produces rows; nothing is written until Upsert Buyer / Upsert Contract. It also does not read `tblJobs`, `POST_DEPOSIT_TRANS`, or any other HFS table. Despite the older docs planning those, the live query is `tblCustomers` only.
