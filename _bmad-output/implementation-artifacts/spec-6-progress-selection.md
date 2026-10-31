---
title: 'Epic 6: Complete Progress matching selection'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'dispatch'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
review_loop_iteration: 0
context: []
---
<frozen-after-approval reason="User authorized all remaining implementation and parallel work">
## Intent
Implement Stories 6.1, 6.2 and 6.3 from epics-iteration-three.md. Full-list additive Select all must preserve one complete selected set in native controls, chart, table and URL, with accessible inspection and browser restoration.
## Boundaries & Constraints
Always retain selected nonmatches, isolate category sets, preserve existing metric semantics and support all identities without a cap. Use existing URL keys with deterministic serialization and explicit empty behavior. Effective actions add one history entry; no-ops add none. Discard invalid IDs with announcement, retain valid IDs across snapshot changes and reject stale action contexts. Year changes clear legacy entity/comparison A/B. Native actions retain focus and announce counts. Keep all existing planning edits. No server, contract, media, publication or dependency changes in this implementation.
## I/O & Edge-Case Matrix
| State / action | Expected behavior |
|---|---|
| Search substring / Select all | Union every full-list case-insensitive match and existing selected nonmatches |
| Empty search / Select all | Select every canonical active-category ID |
| No matches or repeat / Select all | Same set, no history entry, polite no-change count |
| Remove one / Clear | Remove only named ID / empty all active IDs plus legacy entity, preserve other category |
| Invalid URL or changed snapshot | Retain valid category IDs, remove invalid and announce |
| Back / Forward | Restore coherent selected controls, chart and evidence |
| Refresh failure / success | Retain source and selection / retain valid selection and announce removals |
| Old context action | Reject without URL mutation |
| Dense narrow or zoomed field | Every name/value inspectable through wrapping controls and labeled local scrolling |
</frozen-after-approval>
## Code Map
- app/shared/progress-model.ts: existing selectedEntities decoder and series projection; add matching/set operations here.
- app/client/Progress.tsx: existing native picker, selected chips and matching evidence; consume shared matching and add native bulk action/status.
- app/client/App.tsx: URL navigation owner and snapshot loading; guard stale Progress callbacks and reconcile invalid graph keys without adding history.
- app/client/EvolutionChart.tsx: existing stable series identity map, numbered/dashed lines and round inspector; retain behavior and label scroll region.
- app/client/progress.css: responsive wrapping and local overflow.
- app/shared/progress-model.test.ts and tests/progress.spec.ts: reusable fixture and semantic browser coverage.
## Tasks & Acceptance
- [x] Add pure canonical matching and selection routines with union/no-op/remove/clear tests.
- [x] Add Select all, shared counts and polite action announcements in Progress.
- [x] Guard navigation/no-op history and reconcile graph selections across season/snapshot changes.
- [x] Verify dense driver/constructor selections, keyboard/pointer evidence and narrow/zoom layout.
- Given a filtered field with nonmatches selected, when Select all runs, then every match joins the same complete chart/table selected set.
- Given effective or repeated actions, when navigation restores, then effective actions create one entry and no-ops create none.
- Given changed data or stale callbacks, when reconciliation runs, then valid selections persist and old-context actions cannot commit.
- Given a full field on narrow/zoomed screens, when every name and round is inspected, then controls, names and values remain accessible.
## Implementation Notes
No unresolved intent gaps or irreversible operations. User explicitly approved preserving existing dirty edits and all remaining story implementation. Capacity occupied; implement directly and request independent review from coordinator.
## Spec Change Log
## Review Triage Log
## Verification
Commands: node --test app/shared/progress-model.test.ts; npx playwright test tests/progress.spec.ts; npm run check.

Implementation verification: canonical matching/set unit tests 5/5; local production build passed; 10 semantic browser scenarios passed across full and targeted runs. Independent review and expanded v2/bundled smoke await coordinator integration.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
