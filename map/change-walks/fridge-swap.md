# Change walk — the buyer swaps their fridge

1. Someone edits the appliance option on a Selection (cards/selections.md).
2. The Selection's `Selection Signature` changes (the `fridge=` token).
3. Every Render Variant with the old signature is now stale. The pipeline sets `Regeneration Reason` and stamps `Regeneration Queued At`.
4. The stale variant regenerates against the current Home Photography Assets reference for that room, and re-enters QA.
5. Does not hit: the buyer's Documents, their pricing, or any other room's variants. Only variants sharing the changed signature move.
