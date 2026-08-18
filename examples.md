# Worked map: the Render Factory (flattened preview)

> GENERATED from `map/` by `verify/build-examples.mjs`. Do not hand-edit this file. It is the
> tour. The wanderable map is `map/` (start at `map/catalog.md`, open one card, then stop).

---

# Render Factory catalog (front door)

Start here. Open ONE card, then stop. You never load this whole folder.

The Render Factory is **6 tables** inside a 53-table base. Two more tables look like they belong and do not (see "wrong neighbour").

**The spine**
- Render Variants (Homeowner Portal Render Variants) -> cards/render-variants.md. The rendered room images the factory makes.
- Selections (Homeowner Portal Selections) -> cards/selections.md. What the buyer chose. It drives the renders.

**The input**
- Home Photography Assets -> cards/home-photography-assets.md. The reference photos a render is built and checked against.

**The menu**
- Catalogue Items / Categories / Packages -> cards/catalogue-items.md. The options a buyer picks from.

**Before you edit**
- Ghost: "Selections 2 / 3 / 4" on Catalogue Items -> cards/ghost_catalogue-selections.md
- Wrong neighbour: Homeowner Portal Documents and Document Checks share the "Homeowner Portal" prefix but are NOT the render pipeline. Do not edit them expecting renders to change.

**Change walks**
- Sales staff add construction-stage photos -> change-walks/construction-stage-photos.md
- Buyer swaps their fridge -> change-walks/fridge-swap.md

Everything else in the base (Margin Analysis, Lot Financing, the four "Tasks" tables) is not the Render Factory. Do not load it.

---

# Catalogue Items   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000001`. Categories `tblEXAMPLE0000002` and Packages `tblEXAMPLE0000003` group them.
**What it is:** one product a buyer can pick (an appliance, a finish, a fixture). Items group into Categories and bundle into Packages.
**Shape:** `Item Name` · `Category` · `Tier` · `Price` · `Homeowner Portal Selections` (the live link to where it is used)
**Hits:** change an item's spec and every Render Variant built on it is stale. Retire an item and the Selections that reference it need a replacement.
**Does not hit:** Margin Analysis / deal pricing. `Price` here is the menu price, not the negotiated deal.

---

# Ghost: Catalogue Items "Selections 2 / 3 / 4"   (ghost)

**Tag:** ghost
**Source:** table `tblEXAMPLE0000001`, fields `fldEXAMPLE0000001` (2), `fldEXAMPLE0000002` (3), `fldEXAMPLE0000003` (4).
**Evidence it is dead:** an isNotEmpty filter across all three fields returns 0 matching records (walked 2026-08-15). No Catalogue Item wires them. They are Airtable auto-created duplicate link fields.
**What a reader will mistake it for:** the link from an item to the selections that use it. The live field is `Homeowner Portal Selections` = `fldEXAMPLE0000004`, with no number. Key on a numbered one and you join to nothing.

---

# Home Photography Assets   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000004`.
**What it is:** the library of real photos a render is built and checked against (marketing and reference shots keyed to a room and a look). Also the attach point for the planned construction-stage photos.
**Shape:** `Asset Key` · `Collection` · `Room Tags` · `View / Angle` · `Validation Status` · `Usage Status` · `Capture Date` · `Project` · `Model` · `Style Package`
**Hits:** swapping a room's reference photo changes what a regenerated variant is composed against; `Validation Status` gates whether a photo is allowed into a render. Anything filtering this table on `Usage Status` sees what you add.
**Does not hit:** `Selection Signature`. Adding or editing a photo does not restate what a buyer chose, so it does not by itself strand a variant.

---

# Render Variants   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000005`. 98 records at walk time (2026-08-15).
**What it is:** one rendered image of one room, for one exact combination of buyer selections. The output of the factory.
**Shape (the fields that matter, not all of them):** `Render Key` · `Selection Signature` (the drift key) · `Room` (Kitchen / Main Bath / Exterior) · `Generation Mode` · `Status` · `QA Status` · `Required Items` · `Required Packages` · `Source Asset Path` · `Render Image` · `Regeneration Reason` · `Regeneration Queued At`
**Hits:** change a Selection and its `Selection Signature` drifts, so every variant on the old signature is stale and regenerates (`Regeneration Reason` fires). Change a Catalogue Item's spec and every variant built on it is stale.
**Does not hit:** Documents / Document Checks. A render passing or failing QA does nothing to document verification. Same portal, different pipeline.

---

# Selections   (live)

**Source:** base `appEXAMPLE0000001` / table `tblEXAMPLE0000006`.
**What it is:** one home's chosen options (siding, trim, appliances, packages). The input the factory renders.
**Shape:** `Selection Key` · `Project` · per-category links (`Appliance Package`, `Style Package`, `Lighting Package`, `Plumbing Selections`, `Millwork Selections`) · `Selection Signature` · `Portal Status` · `Signed At` · `Version`
**Hits:** editing any chosen option changes `Selection Signature`, which strands every Render Variant on the old signature. Bumping `Version` after signing triggers a regeneration pass.
**Does not hit:** pricing / Margin Analysis. Selections drive renders, not deal economics; those live outside the slice.

---

# Change walk (planned extension): sales staff capture construction-stage photos

Not yet built. Walked as a planned extension so a collaborator can add it without breaking the spine. This is not a live noun.

**The want:** sales staff photograph specific construction stages of a home; those photos surface in Airtable and eventually the homeowner portal.
**Where it attaches:** Home Photography Assets (cards/home-photography-assets.md) is already the photo noun, keyed to `Project` and `Capture Date`. Construction-stage photos are the same kind of thing on a new axis (progress over time), so they belong here, distinguished from reference shots, not in a new island table.
**The spine it must not break:** the `Selection Signature` -> Render Variant -> QA chain. Construction photos have no signature and no render gate. Keep them off Render Variants' `Required Items` and `Source Asset Path`, or they pollute the render pipeline and strand variants.
**Hits:** the meaning of Home Photography Assets `Usage Status` and `Validation Status` (they need a construction-appropriate value); any view or automation filtering that table; any portal surface that reads it.
**Does not hit:** Render Variants, Selections, `Selection Signature`, the Catalogue, or Documents. A construction photo is not a rendered variant and is not a buyer choice.
**Ghost to avoid:** do not add another numbered duplicate link field. That is how the dead duplicate link copies on Catalogue Items were born.

---

# Change walk: the buyer swaps their fridge

1. Someone edits the appliance option on a Selection (cards/selections.md).
2. The Selection's `Selection Signature` changes (the `fridge=` token).
3. Every Render Variant with the old signature is now stale. The pipeline sets `Regeneration Reason` and stamps `Regeneration Queued At`.
4. The stale variant regenerates against the current Home Photography Assets reference for that room, and re-enters QA.
5. Does not hit: the buyer's Documents, their pricing, or any other room's variants. Only variants sharing the changed signature move.
