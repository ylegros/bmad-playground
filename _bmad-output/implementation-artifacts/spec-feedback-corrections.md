---
title: 'Iteration two review corrections'
type: feature
created: '2026-10-29'
status: done
route: dispatch
baseline_commit: 10e2d6dc58eb9586cc8ff9866bc95c8e9b39cd22
context:
  - C:/Users/User/Documents/projects/bmad-playground/_bmad-output/specs/spec-iteration-two-feedback/SPEC.md
  - C:/Users/User/Documents/projects/bmad-playground/_bmad-output/specs/spec-iteration-two-feedback/acceptance-corrections.md
  - C:/Users/User/Documents/projects/bmad-playground/_bmad-output/planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - C:/Users/User/Documents/projects/bmad-playground/_bmad-output/planning-artifacts/epics.md
---

<frozen-after-approval>
## Intent
Correct the reviewed dashboard within the same sprint: maximize verified photographs/historical logos, replace best starting grid with best GP qualifying rank, and remove repeated visible Better wording while retaining ticks/highlights/accessibility. User approved all aligned documents and build on 2026-10-29. Parallel isolated work and preservation of the original dirty checkout remain authorized. Existing Site stays anyone-with-link.
## Boundaries & Constraints
Preserve 2010/2021 only, schema v1, six equal category votes, authoritative official points, conservative per-driver season-wide coverage, missing versus zero, GP/sprint distinction, local refresh, graph/table and URL/Back behavior. No new stack. Media acquisition maximizes every snapshot identity; fallbacks need individual attempted source/blocker and are not acquired-image counts. Preserve the current Site ID/audience; use exact source/archive and terminal deployment evidence on publication. Do not modify user planning baseline outside progress and build state.
## I/O & Edge-Case Matrix
| Scenario | Expected |
|---|---|
| Qualifying 2, penalized grid7 | Best qualifying2, lower wins, no grid schema explanation |
| Incomplete qualifying sessions or driver records | Unavailable with qualifying-specific reason and sample count |
| Favorable comparable summary/detail value | Visible tick/highlight, no visible Better text, descriptive driver/metric/direction for screen reader |
| Tie/unavailable | No favorable tick/highlight; meaning retained |
| Media slot | Actual verified image+credits or individually investigated exception; count each kind/identity/season once |
| Hosted artifact | All mapped assets local and same immutable release; existing anyone-with-link access preserved |
</frozen-after-approval>

## Code Map
- app/shared/comparison.ts: current grid-unavailable category; central policy/scoring/availability and tests.
- app/client/Comparison.tsx, ComparisonSummary.tsx, comparison.css: current Better markers, semantic text and classes; preserve cell status/source data.
- app/client/media.ts, Identity.tsx: canonical mappings/date disclosure and image-failure frames; current 2 portraits/1 logo baseline.
- public/media/credits.json and scripts/export-site.mjs: exact assets/fallbacks schema, immutable data/media validation; preserve provenance fields.
- tests/comparison.spec.ts, tests/hosted.spec.ts, comparison.test.ts: replace outdated grid/visible Better assertions and add accepted edge checks.
- scripts/prepare-site-source.mjs and .site-source/pit-wall: existing sanitized source and persisted Site identity. Root owns integration/publication.

## Tasks & Acceptance
- [x] Comparison track in C:/Users/User/Documents/projects/bmad-playground/.worktrees/comparison: implement qualifying policy and tick-only summary/detail in shared/client comparison files; meaningful unit/browser tests. Only this track edits comparison code/tests. Do not edit root or acquisition files/media mappings. Report changed paths and focused checks; no commits/pushes.
- [x] Photograph track: acquire verified real portraits in separate acquisition directories with exact credits, candidate metadata and review evidence; preserve original files as needed.
- [x] Logo track: acquire actual historical constructor marks for 22 season slots with provenance and specific exceptions; no modern-identity substitution or AI generated logos.
- [x] Root merges assets/maps/credits, adds coverage integrity checks, inventories every slot with per-season counts/visual checks and integrates the comparison work.
- [x] Root runs local+hosted regressions and independent review, updates evidence, packages/publishes through existing Site after passing checks.
Given every snapshot identity, when coverage is reviewed, then actual photographs/logos and individual exceptions are counted separately with visual/provenance evidence. Given corrected scorecard, when qualifying differs from penalized grid, then qualifying classification determines the fixed category. Given either comparison surface, when favorable/tied/unavailable values render, then accepted visual and screen-reader rules hold.

## Implementation Notes
Code paths and active baseline investigated; no intent gaps. External source sync/publication is already authorized, with current sharing preserved. Estimates are milestones, not elapsed-time guarantees. Report percent progress regularly; never count fallback-only passes as imagery completion.

## Verification
npm.cmd run build; npm.cmd test; npm.cmd run test:e2e; bundled export/build and network-blocked hosted tests; image coverage/mapping/license/inventory and actual visual inspection; terminal Site deployment result.

## Review Triage Log

| Finding | Verdict | Route and evidence |
|---|---|---|
| Blind 1 README status | low | patch: corrected shared/public hosting, qualifying category and obsolete deferred-chart text. |
| Blind 2 mixed verification | medium | patch: old evidence is explicitly historical; current correction verification is separate and deployment stays pending until terminal success. |
| Blind 3 sparse complete sessions | medium | defer: pre-existing generic schema validation; adapter ingestion already audits full upstream pagination. Current checked real snapshots retain 19/22 rounds and all audited records; no data-refresh/validator change in this correction. |
| Blind 4 calendar truncation | medium | defer: pre-existing validator limitation; current source snapshots match supported calendars and immutable original identities. |
| Blind 5 mapping drift | medium | patch: derive exact canonical identity/season mappings from the validated credits rather than maintain a duplicate map. Every mapped slot loads in runtime browser tests. |
| Blind 6 corrupt file accepted | medium | defer: exporter historically checks file existence, not image decoding. Actual release images all decode in browser tests; image-failure behavior is separately verified. |
| Blind 7 stale source files | medium | defer: pre-existing preparation overlay behavior. Current checkout is controlled, original source paths are retained and explicit source inventory is inspected before publication. No source deletion/rename required for this correction. |
| Blind 8 non-atomic checkout preparation | low | defer: pre-existing scratch-checkout replacement behavior; original source repository and version1 remain recoverable. Bundle promotion itself is already atomic and tested. |
| Blind 9 hidden attribution link | low | patch: Image details opens credits and focuses its summary; browser assertion covers both. |
| Blind 10 per-category metric memory | medium | defer: pre-existing shared graphMetric URL behavior in unchanged Progress component; constructor change replaces prior metric. Follow-up should add category-specific memory without breaking existing URL/Back behavior. |
| Edge 1 hung bundled fetch | medium | defer: fetch has no timeout in pre-existing data source; suggested guard was not existing code. Genuine bounded-network retry follow-up, unrelated to current media/policy changes. |
| Edge 2 hash/copy race | medium | patch: read every asset once and use the same bytes for release hashing and staged output. |
| Verification source freshness | medium | patch: hosted test asserts exact selected-season source timestamps with timezone and distinguishes export time. |
| Root visual inspection: zoom clipping | medium | patch: container-width summary reflow and child-containment assertions cover the observed 200% clipping. |

## Completion

Version2 deployed successfully on2026-10-29 at18:17 Asia/Shanghai. Source commit fe2717882721d533bf7fb7461bbd93f3074ee992 belongs to the isolated Site repository; original working-tree changes remain preserved without a root-repository commit/push. All task/matrix rows have passing evidence in feedback-corrections-verification.md. Seven investigated logo exceptions and pre-existing hardening follow-ups remain explicit; user acceptance is open.
