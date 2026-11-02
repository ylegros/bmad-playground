# Next-iteration architecture seam review

Date: 2026-11-02
Verdict: PASS — no demonstrated incompatible implementation pair satisfying every applicable architecture decision.

## Evidence examined

- ARCHITECTURE-SPINE.md, especially AD-1, AD-5/6, AD-9/10/11/13/14 and the handoff prerequisites.
- spec-next-iteration-feedback/SPEC.md and acceptance.md.
- app/client/App.tsx, Identity.tsx and ComparisonSummary.tsx.
- app/shared/progress-model.ts.
- app/server/service.ts and scripts/export-site.mjs.

This is a document and existing-code seam review. No runtime verification, upstream race verification, implementation or release was performed.

## Attempted incompatible implementations

### Selection owner, grouped options and duplicate drivers

One Progress implementation could retain selected IDs per team while another uses one canonical driver set. These disagree when a driver appears under two teams. The former violates AD-14: grouping adds no state, appearances share one driver ID and checked state, and all consumers count IDs once. The shared projection owner is named, with canonical selected-season affiliations rather than media-derived teams. Existing progress-model.ts already owns canonicalSelection, matchingEntities and selection changes. No compliant incompatibility remains. Exact projection types must still be frozen before independent implementation, as required by the handoff; that is an explicit prerequisite rather than an omitted ownership decision.

### Explicit year change, history and delayed actions

A year handler that clears only the displayed category and another that clears all sets would disagree. AD-14 explicitly requires App.tsx to clear both sets, legacy entity and A/B together. Back/Forward has a separate historical restoration policy; same-year navigation and refresh preserve selection. A stale callback from an away-and-back trip could otherwise pass season/snapshot equality, which is exactly the weakness in the existing App.tsx guard. AD-14 additionally requires navigation-context generation, closing that case. Revalidating an entry against its loaded season cannot repopulate empty state. Existing URL navigation and validation are amendment targets, not alternate authority.

### Local freshness, support metadata and bundled delivery

A refresh implementer could commit a newer snapshot while a manifest implementer retained initial support metadata. AD-13 expressly requires atomic client snapshot/support derivation and prohibits late manifest overwrite. SnapshotService derives its manifest from cached snapshots today; service.ts commits a validated snapshot through a temporary file and rename. Exporter/loader cannot independently invent a later cutoff: AD-9/13 require exact payload identity, source timestamps, audit provenance and analysis window to agree. Existing export-site.mjs stages releases before manifest promotion. Failed upstream refresh cannot overwrite local data; failed export cannot promote an incomplete bundle. Local refresh and hosted promotion remain distinct under AD-12, so a later export failure does not require cross-system rollback of an already validated local refresh. No cross-edition transaction is implied.

### Shared comparison scoring and compact presentation

A visual implementer might use track widths to decide winners or substitute grid position. Both violate AD-10. Shared comparison.ts remains authoritative for six category outcomes; ComparisonSummary owns the compact presentation. Rows retain exactly one value per driver, one metric label and a track, while raw inspection evidence may repeat results. Neutral tracks for missing/zero/negative inputs and markers for rank metrics avoid invented magnitudes. Existing ComparisonSummary.tsx imports the authoritative model but repeats numbers inside tracks; the amendment explicitly removes that presentation behavior without changing scoring inputs. No independently compliant competing score authority remains.

### Standings identity and runtime failure

One caller could hide the name whenever a mapping exists while MediaFrame independently suppresses a failed image, producing an empty cell. AD-11 disallows that split: the shared identity renderer owns Standings mode, image failure and identity/season transitions. Standings rows and driver affiliations use that mode; other surfaces retain their normal name-plus-optional-logo policy. Accessible identification and readable failure fallback are binding. Existing Identity.tsx separates MediaFrame failure state from ConstructorIdentity text, so implementation must adjust that boundary; preserving it blindly would violate the new rule.

## Findings

No blocking or actionable architecture hole was demonstrated. Concrete API/type shapes, semantic checkbox markup and CSS remain implementation choices within the named owners and explicit freeze prerequisite. Inventing additional mandatory architecture decisions for those details would not improve the tested seams.

The architecture does not claim the latest 2026 round has already been verified. That remains the explicitly required implementation evidence gate in SPEC CAP-2, acceptance.md and AD-13.
