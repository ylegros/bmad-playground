# Story 8.1 delivery evidence

Verified 2026-11-02 11:33 UTC (19:33 Asia/Shanghai): latest completed GP is Mexico City, canonical round 19, raced 2026-11-01. The fresh official calendar independently shows Brazil round 20 next on November 8 and rounds 21�23 upcoming. Season remains ongoing; no completion evidence or finality is claimed.

Official sources checked with web open and saved separately by fresh HTTP acquisition:
- https://www.formula1.com/en/racing/2026
- https://www.formula1.com/en/results/2026/races
- https://www.formula1.com/en/results/2026/races/1298/mexico/race-result
- https://www.formula1.com/en/results/2026/races/1298/mexico/qualifying

Saved official HTML and its exact HTTP timestamps/status/paths: `next-iteration/data/official-source-acquisition.json` (all HTTP 200). These are real fresh source pages, not deterministic fixtures. Previous independently reviewed session evidence retains its original timestamps; only newly checked calendar/Mexico lifecycle evidence is advanced.

Fresh provider acquisition and atomic audit command (executed from repository root using authorized network escalation):

```powershell
node --input-type=module -e "import {SnapshotService} from './app/server/service.ts'; const s=await new SnapshotService().get(2026,true); console.log(JSON.stringify({snapshotId:s.snapshotId,refreshedAt:s.refreshedAt,analysisRounds:s.analysisRounds,gaps:s.coverage.gaps,audit:s.audit}));"
```

`get(2026,true)` uses existing bounded queue and `providerCache(refresh=true)`, acquiring every calendar/results/Sprint/qualifying page and both official standings endpoints for each held round. It does not reuse saved responses. Initial sandbox-only probe failed `UPSTREAM_NETWORK`; authorized network escalation succeeded. No prior snapshot was replaced by the failed probe.

Result: refresh completed in 33,815 ms; snapshot `9f3d2828-fe3b-4782-a84d-17130ad511be`, source timestamp `2026-11-02T11:33:27.363Z`, audit `791e1b18-369a-42e0-9c26-968f2fc04708` at `2026-11-02T11:34:00.054Z`. Immutable local envelope: `.cache/seasons-v2/2026.json`. Fresh provider pages: `.cache/iteration-three/provider/<sha256-of-source-URL>.json`. Full endpoint pagination inventory and original observations are persisted in `next-iteration/data/2026-refresh.json`.

Analysis window is rounds 1�19; no session-level coverage gaps. Official driver and constructor standings both retain source round 19 (no source lag). Records: 418 GP, 132 Sprint, 413 qualifying. Different individual record counts are retained as supplied; missing driver qualifying stays unavailable through existing conservative selectors. No points, rankings, missing records or future session values are fabricated. Sprint applicability remains the established six-event calendar. Future rounds 20�23 remain unheld; Mexico Sprint remains not applicable.

Deterministic verification command:

```powershell
node --test app/server/evidence-ingestion.test.ts app/server/service.test.ts
```

Passed 4/4 tests: successful-empty gaps; future/cancelled lifecycle; malformed/unknown/calendar/provenance/pagination rejection; independent completion requirement; atomic v2 failure retention. Separately injected a failing fresh-page loader into SnapshotService against the actual refreshed cache: original envelope bytes and support manifest were identical after failure; recorded in `2026-refresh.json`. Failed-refresh source timestamp and snapshot identity remain unchanged.

Changed production input: `app/fixtures/iteration-three/audited-calendars/2026.json` only. No ingestion, schema, scoring, historical seasons, media, UI or queue changes were necessary. Supporting delivery artifacts are under `next-iteration/data`. No publication performed. Local three-surface integration remains for the parent build's final browser checks; data acquisition/audit does not establish that UI acceptance by itself. Story 8.2 may consume the exact validated cache above; export must preserve this identity and source timestamp.

## Tasks & Acceptance



## Verification

Fresh authoritative round19 acquisition/audit; deterministic ingestion/service checks; exact failed-refresh retention; actual-data three-surface browser integration passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.

Final coordinator verification: fresh local three-surface integration and final prepared static three-case suite passed. Current snapshot/release identity matches next-iteration-build.md; no publication performed. Earlier pending browser notes are superseded.
