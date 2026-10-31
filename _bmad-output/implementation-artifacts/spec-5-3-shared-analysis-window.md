---
title: '5.3 Compare drivers over the same completed-GP evidence'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'dispatch'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-iteration-three.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="user authorizes all remaining stories and parallel implementation">

## Intent

Implement Story 5.3: all comparison categories use one held-GP analysis window including held source gaps and excluding unheld/cancelled GPs. Full-calendar tables/charts retain explicit lifecycle states. Preserve official points, qualifying-before-grid, six equally weighted votes, conservative driver evidence, teammates, tie/missing/zero rules and unchanged historical v1 behavior.

## Boundaries & Constraints

Shared pure selectors own values. Existing `SeasonSnapshot` is currently v1; root will change it to discriminated V1/V2 union and integrate client/server. Use explicit `SeasonSnapshotV2` where needed and a compatible snapshot union locally until root aliases land. Do not edit contracts.ts, evidence.ts, App.tsx, Progress.tsx, server, media or sprint tracking; other agents own those files. You own selectors.ts, comparison.ts and shared progress-model VALUE projection portions only. Epic6 agent owns selection helpers in progress-model.ts; coordinate before touching that file. New tests and separate story-5-3-verification.md belong to this task.

## I/O & Edge-Case Matrix

| Scenario | Expected |
| --- | --- |
| Held GP with absent records | Retained in window and conservative sample denominator; unavailable metric |
| Unheld/cancelled GP | Excluded from comparison, retained full calendar as explicit state |
| Held qualifying/sprint preceding an unheld GP | Authoritative session display possible but excluded from comparison |
| Zero held GPs | GP categories unavailable, never invented zero/wins |
| Lagging official standings/fractional adjustment | Latest official within window retained with source round/lag; no extrapolation |
| Missing substitute driver/unknown status | Best finish/qualifying or DNF stays unavailable as appropriate |
| Historical v1 fixture | Preserve baseline semantics |

</frozen-after-approval>

## Code Map

- shared/evidence.ts `analysisWindow` is authoritative held-GP window; contracts.ts contains frozen explicit V2.
- shared/selectors.ts progress and finalStandings/teammate; comparison.ts currently loops entire schedule and unbounded standings.
- shared/progress-model.ts projects graph/table output; preserve category selection helper edits by parallel Epic6 agent.

## Tasks & Acceptance

- [ ] Update shared selectors/comparison/progress value projection for v1/v2 with explicit lifecycle unavailable reasons and one window.
- [ ] Add saved ongoing/zero-GP/held-gap/cancelled/pre-GP/lag/unknown-status fixtures covering every matrix row; run focused tests and type check.
- [ ] Record evidence and explain actual coverage; do not claim live-year verification or full browser integration.

Given shared window evidence when all summaries run then samples/votes agree without dropping gaps. Given full calendar when chart/table values project then no future cumulative values or misleading interpolated segments appear.

## Implementation Notes

No unresolved human choices or irreversible actions. Root handles integration, review and tracking; do not commit.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
