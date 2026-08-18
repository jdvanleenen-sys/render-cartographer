# Change walk (planned extension) — sales staff capture construction-stage photos

Not yet built. Walked as a planned extension so a collaborator can add it without breaking the spine. This is not a live noun.

**The want:** sales staff photograph specific construction stages of a home; those photos surface in Airtable and eventually the homeowner portal.
**Where it attaches:** Home Photography Assets (cards/home-photography-assets.md) is already the photo noun, keyed to `Project` and `Capture Date`. Construction-stage photos are the same kind of thing on a new axis (progress over time), so they belong here, distinguished from reference shots, not in a new island table.
**The spine it must not break:** the `Selection Signature` -> Render Variant -> QA chain. Construction photos have no signature and no render gate. Keep them off Render Variants' `Required Items` and `Source Asset Path`, or they pollute the render pipeline and strand variants.
**Hits:** the meaning of Home Photography Assets `Usage Status` and `Validation Status` (they need a construction-appropriate value); any view or automation filtering that table; any portal surface that reads it.
**Does not hit:** Render Variants, Selections, `Selection Signature`, the Catalogue, or Documents. A construction photo is not a rendered variant and is not a buyer choice.
**Ghost to avoid:** do not add another numbered duplicate link field. That is how the dead duplicate link copies on Catalogue Items were born.
