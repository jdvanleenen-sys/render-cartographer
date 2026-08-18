# Ghost — the AI summary panel   (ghost)

**Tag:** ghost
**Source:** table `tblEXAMPLE0000007`, fields `fldEXAMPLE0000039` (Attachments), `fldEXAMPLE0000040` (Attachment Summary), `fldEXAMPLE0000041` (Summary AI).
**Evidence it is dead:** Attachments is empty in all 347 records (walked 2026-08-15), so the attachment-summary AI field has nothing to read. The record-summary AI field errors with an empty dependency on every record walked, and its prompt references field ids that no longer exist in the table (`fldEXAMPLE0000042`, `fldEXAMPLE0000043`). None of the three fields holds a computed value anywhere.
**What a reader will mistake it for:** a working AI digest of the deal. Nothing reads or writes these three fields; the live human-readable state of a row is its label, the two ⚠️ revenue flags, and the margin alert.
