---
title: "Refresh verified 2026 results through the latest completed race"
status: done
created: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
context:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
story_key: 8-1-refresh-verified-2026-results-through-the-latest-completed-r
source: ../planning-artifacts/epics-next-iteration-feedback.md
---

## Required build context

Read ../specs/spec-next-iteration-feedback/SPEC.md and every companion listed there, plus the source epic. Paths are relative to this story folder. Acceptance criteria here are the story slice; the canonical spec and companions retain authority. Preserve existing planning/worktree edits. No publication is included.

### Story 8.1: Refresh verified 2026 results through the latest completed race

As Yannick,
I want current verified 2026 race evidence in local analysis,
So that the dashboard reflects the latest completed race honestly.

**Requirements:** FR2, UX-DR7, NFR2/4; AD-3/5/7/8/13. **Dependencies:** None.

**Acceptance Criteria:**

1. **Given** implementation begins, **When** authoritative results are checked, **Then** delivery evidence records the latest completed GP event, canonical round, verification timestamp/timezone and source links **And** no planning-era assumed last round is used.
2. **Given** that cutoff, **When** fresh source pages and independently checked calendar/session evidence are acquired, **Then** pagination, required GP qualifying/results, applicable Sprint, awarded points and per-round official standings are audited through it **And** saved-page audit alone is never presented as fresh acquisition.
3. **Given** validated evidence, **When** SnapshotService commits the refreshed local snapshot, **Then** support metadata, window, provenance and timestamps agree atomically **And** analyses recompute from the same immutable version. Official standings retain their own source round/lag; genuine gaps stay unavailable, future sessions retain lifecycle, and completion is independently verified.
4. **Given** failed page/request, malformed input or failed audit/refresh, **When** replacement is attempted, **Then** prior local snapshot/support/timestamp remain intact **And** failure evidence identifies the cause without fabricated values.
5. **Given** successful or failed refresh, **When** selections and three surfaces are inspected, **Then** same-year selection behavior, official points, conservative coverage and GP/Sprint distinctions remain intact.

**Implementation boundary:** Existing evidence-ingestion.ts, audit.ts, snapshot service and saved evidence inputs; use existing bounded provider queue. Do not alter historical seasons, schema, media or scoring without an evidenced need. Network/provider gaps must be reported honestly, not marked complete.

**Verification:** Saved fixture regressions remain deterministic; live/source verification is separately recorded. Demonstrate cutoff and source round in all surfaces plus atomic failure retention. Record exact acquisition/audit commands and output paths in delivery evidence.

## Development record

Fresh source acquisition and atomic local refresh completed through independently verified Mexico City GP, canonical round 19. See [delivery evidence](8-1-delivery-evidence.md) and next-iteration/data/2026-refresh.json for exact identity, timestamps, source links, pagination inventory and successful failure-retention checks. Deterministic ingestion/service tests passed 4/4. Parent integration must still inspect the three surfaces before marking the story complete.

## Concurrent implementation ownership

Own fresh 2026 source evidence, saved inputs, ingestion/audit fixes if needed and story-specific delivery evidence. Do not edit UI, shared scoring, sprint tracking or other stories. Do not publish. After validated local commit, report exact cache/evidence paths for dependent bundle story 8.2. Use source/network tools or authorized escalation as necessary. Never pass off fixtures as live 2026 results.


## Tasks & Acceptance

- [x] Acceptance criterion 1 implemented and verified.
- [x] Acceptance criterion 2 implemented and verified.
- [x] Acceptance criterion 3 implemented and verified.
- [x] Acceptance criterion 4 implemented and verified.
- [x] Acceptance criterion 5 implemented and verified.

## Verification

Fresh authoritative round19 acquisition/audit; deterministic ingestion/service checks; exact failed-refresh retention; actual-data three-surface browser integration passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.
