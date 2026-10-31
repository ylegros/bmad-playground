---
title: '5.2 Load audited historical and ongoing seasons safely'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'dispatch'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/epics-iteration-three.md'
---

<frozen-after-approval reason="user authorized all remaining implementation and parallel work">

## Intent

Implement Story5.2 generic audited v2 ingestion/service against saved fixtures before live year promotion. Retain v1 cache separately and never replace good evidence on errors. Independently evidenced held/unheld/cancelled/unknown sessions stay distinct from source availability. Honest successful-empty held gaps stay in window; unknown lifecycle never verified. Freeze schema types already in shared/contracts.ts and evidence.ts.

## Boundaries & Constraints

Own app/server service/jolpica/audit and new evidence-ingestion modules/tests plus backend verification report. Root owns client App/data-source/validation integration; another agent owns shared selectors; media agent owns Identity/media. Coordinate before changes to shared modules. No main sprint tracking or commits. Existing root edits: jolpica exports queuedFetch and buildSnapshot accepts optional third auditedCalendar {rounds,sprints}; provider-cache.ts provides fetchPage+observations preserving cached observation time; scripts/acquire-season-pages.mjs acquires raw pages single bounded process. Do not start live API process without root approval (one active bounded queue).

## I/O & Edge-Case Matrix

| Input | Expected |
| --- | --- |
| Candidate2010–2026 + independent calendar/session evidence + valid pages | Validate all canonical records/pages, source observations and full schedule, then stage v2 |
| Held successful empty session | Explicit gap, held window retained, no fabricated values |
| Unheld/cancelled/not-applicable | Distinct lifecycle/availability; unheld GP outside window |
| Unknown lifecycle or malformed/failed/truncated request | No verified promotion; last good snapshot/support/time retained |
| Refresh race/cache GET/retry | Existing bounded queue/operation dedup and atomic replacement preserved |

</frozen-after-approval>

## Code Map

- server/jolpica.ts normalized builder already parses exact official source metrics and all pages; retain parser, can extend audited-calendar path rather than duplicate it.
- server/provider-cache.ts raw cache with source URL/observedAt metadata; source raw acquisition running at root. Do not relabel saved pages freshly fetched.
- fixtures/iteration-three/calendar-evidence/{year}.json official research agent actively writes. Research-only not automatic audited truth: reconcile canonical dates/rounds versus provider and require complete independent session applicability/lifecycle and completion evidence for complete season. Official event slugs/date labels help reconcile chronology, not event names as identity joins.
- server/service.ts existing checksum+atomic rename+dedup; add v2 directory `.cache/seasons-v2` and evidence-backed load. Keep baseline v1 usable until migration validated; manifest should include17 candidates and same-generation support derived from valid v2 where available. No blind casting.
- shared/evidence.ts validators/supportEntryV2/analysisWindow authority. Root changes canonical SeasonSnapshot alias to V1|V2; legacy strict validSnapshot remains V1 predicate.

## Tasks & Acceptance

- [x] Implement independently evidenced v2 snapshot construction and endpoint/page provenance, evidence schedule reconciliation, explicit gaps and failure handling.
- [x] Extend service support candidates and atomic v2 caching; retain baseline v1 separate and derive matching support metadata.
- [x] Add manual per-year audit CLI with report generation and resume/progress/failure evidence; defer live execution to root single queue.
- [x] Meaningful deterministic fixture tests cover matrix; focused tests/type check. Record story5-2-verification.md.

Given failed acquisition when audit exits then no partial year is verified and previous data remains. Given successful v2 generation when manifest reads then support fields derive from that exact snapshot. User authorizes choices within these recorded rules.

## Implementation Notes

No publication, no provider completion claim from fixtures. Root coordinates live audits and client integration.

## Final verification — 2026-10-31

Full unit suite: 66 Node tests and 19 Vitest tests passed. TypeScript and production build passed. Core browser matrix: 28 passed. All17 real source audits and local real-snapshot browser checks passed; see iteration-three-data-coverage.md. Integrated review findings and patches are recorded in spec-iteration-three-core-integration.md. Ready for human review; static release and media exception acceptance remain separate.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
