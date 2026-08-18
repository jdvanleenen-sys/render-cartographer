# Ghost — Catalogue Items "Selections 2 / 3 / 4"   (ghost)

**Tag:** ghost
**Source:** table `tblEXAMPLE0000001`, fields `fldEXAMPLE0000001` (2), `fldEXAMPLE0000002` (3), `fldEXAMPLE0000003` (4).
**Evidence it is dead:** an isNotEmpty filter across all three fields returns 0 matching records (walked 2026-08-15). No Catalogue Item wires them. They are Airtable auto-created duplicate link fields.
**What a reader will mistake it for:** the link from an item to the selections that use it. The live field is `Homeowner Portal Selections` = `fldEXAMPLE0000004`, with no number. Key on a numbered one and you join to nothing.
