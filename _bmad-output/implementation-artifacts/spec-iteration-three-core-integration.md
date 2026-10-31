---
title: 'Iteration three shared implementation integration'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'dispatch'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="user authorized all stories, parallel work and preserving planning edits">

## Intent

Implement iteration-three CAP1–3 using the approved brownfield architecture and UX. Every constructor identity has one accessible name when its logo is unavailable. Explore2010–2026 with individually audited calendar/session lifecycle, official results/standings and canonical credited media. All six comparison categories share the held-GP window, including held source gaps and excluding unheld/cancelled GPs; ongoing seasons show window/sample/source lag without future values. Progress Select all unions the full current name-search match set with existing selections; URL/Back/chart/table agree without hidden caps, stale context or no-op history entries.

Keep the approved v1 release separately usable until all17 real v2 years and media inventories pass the complete release gate. Unknown lifecycle cannot verify; unknown result statuses remain unavailable unless independently investigated. Explicit local refresh fetches source pages through one durable bounded queue and atomically retains good data/support/source times on failure. Saved-page manual audits never acquire data implicitly. Static bundles validate one immutable generation and never fall back to API. No publication or hosting audience change is authorized. Investigated media exceptions remain subject to explicit user review; implementation approval does not accept them.

</frozen-after-approval>

## Code Map

Shared contracts/evidence/validation/versioned modules own version discriminants, window and audit semantics. Server evidence-ingestion/service/provider-cache/provider-budget own acquisition, source provenance and atomic commits. Client App/data-source/SeasonEvidence own same-generation support, lifecycle disclosures and view state. Shared selectors/comparison/progress-model own values and selection routines. Identity/media and inventory tooling own credited files and investigated slots. Explicit iteration-three exporter/source preparation requires all17 v2 snapshots; v1 commands remain version-specific.

## Tasks & Acceptance

- [x] Versioned contracts, explicit evidenced migration and local/static adapter seams implemented with saved tests.
- [x] Generic ingestion, cache separation, per-year audit reporting and persisted provider request budget implemented.
- [x] Held-GP window, conservative metrics and lifecycle-aware projections implemented.
- [x] Client atomic support merge and source/window/coverage disclosures implemented.
- [x] Media integrity/denominator/structured-exception tools and accessible credits implemented.
- [x] Bulk selection, no-op/history/Back/context protections and uncapped readable series implemented.
- [x] Explicit all17-year v2 export/source path implemented and fixture-tested for invalid input/retention.
- [x] Finish every real-year data audit, browser matrix and per-year media acquisition; reconcile all denominators.
- [x] User review of concrete remaining media exceptions, real full static release and blocked-external/API verification.

Given invalid metadata or requests when refresh/export runs then previous good data/release is retained. Given held gaps or zero GPs when summaries run then evidence remains conservative. Given valid selections when search, Select all, Clear or Back runs then one canonical set restores everywhere. Given actual all-year acceptance gates still open when status is reported then implementation is not described as a completed release.

## Implementation Notes

This review covers integrated runtime/tooling/test code, not completion of the external data/media acquisition still in progress. Current evidence lives in per-story verification files, iteration-three-data-coverage.md and iteration-three-media-coverage.md. Existing user planning edits remain untouched. Source statuses were independently investigated; ambiguous newly observed labels remain unavailable rather than guessed.

## Verification

Type checking, local/hosted builds, full unit suite and relevant browser checks. Actual real-year browser checks use playwright.audit.config.ts and committed v2 caches; fixture checks do not establish live source coverage. Review findings are triaged before completion claims.

## Review Triage Log

Three independent review lenses examined the integrated core diff. All thirteen actionable findings were accepted and patched; final regression verification remains in progress.

| Finding | Verdict and patch | Verification evidence |
|---|---|---|
| Runtime media metadata could differ from bundled assets | High; load and validate the three metadata files atomically from the pinned release | Media and data-source unit tests |
| Versioned support adapter rejected the mixed local manifest | Medium; validate the versioned manifest seam | Data-source contract tests |
| Complete season could label lagging standings Final | High; require the standings source to equal the last held GP | Season evidence tests |
| Audit time appeared as source observation time | Medium; separate Audited from source freshness | Season evidence tests |
| Adjustment derivation assumed consecutive calendar rounds | Medium; use the preceding held GP without bridging missing standings | Shared analysis tests |
| Selection notice survived a later effective action | Low; clear the obsolete notice on effective actions and Back | Progress browser tests |
| Missing standings could lack a specific gap | High; require round and standings-kind evidence | Evidence validator tests |
| A global gap could conceal another missing session | High; require round and session-kind evidence | Evidence validator tests |
| Incomplete endpoint inventory could claim verified audit | High; require every endpoint family and per-held-round standings endpoint | Evidence validator tests |
| Visual investigation evidence was plain text | Medium; link to the same-release evidence asset | Media credits browser coverage |
| Missing GP results hid available official cumulative totals | Medium; retain independently available standings metrics | Metric-cell tests |
| Missing numeric position hid classification/status text | Medium; retain source text while leaving numeric plots unavailable | Metric-cell tests |
| Retry budgeting lacked an executed production-queue test | Medium; exercise controlled 503-to-200 retry and exhausted-budget rejection | Provider-budget tests; no live requests |

Real-data verification: all seventeen 2010–2026 source audits and all seventeen local real-snapshot browser checks passed. Snapshot-linked records are in iteration-three/data/browser-verification.json. This does not establish media exception acceptance or static release completion.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
