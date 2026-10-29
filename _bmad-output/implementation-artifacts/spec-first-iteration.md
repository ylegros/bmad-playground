---
title: 'F1 Dashboard first iteration'
type: 'feature'
created: '2026-10-29'
status: 'done'
route: 'dispatch'
baseline_commit: 'NO_VCS'
review_loop_iteration: 0
context:
  - _bmad-output/specs/spec-bmad-playground/SPEC.md
---

<frozen-after-approval reason="User approved reduced scope, parallel implementation and unattended completion on 2026-10-29">

## Intent

**Problem:** The repository contains F1 planning artifacts but no working dashboard. Yannick wants a usable first iteration when returning after sleep, targeting eight hours of implementation rather than the complete historical MVP.

**Approach:** Deliver a local Pit Wall dashboard with verified 2010 and 2021 seasons, official driver and constructor standings, table-first season progress, two-driver comparison and recoverable manual refresh. Use the accepted React/TypeScript/Vite client and local Node server; implement independent surfaces in parallel after shared contracts stabilize.

## Boundaries & Constraints

**Always:** Keep selected-season identity consistent across views and requests. Verify all required endpoints/pages for each offered season before claiming support. Preserve official championship totals/ranks, fractional points, provider statuses, separate GP/sprint results, GP-only qualifying, missing versus zero, and season-relative latest/initial teammate semantics. Keep atomic complete snapshots, successful timestamps and retained data on refresh failure. Use original Pit Wall styling with responsive keyboard-operable tables. Shared pure selectors own metric semantics. Run an automated foundation contract check before integrating parallel work; present final human review after verification. Eight hours is a target, not a guarantee.

**Never:** Claim complete coverage from representative samples. Add charts, summary strip, metric previews, historical years beyond the initial verified pair, cross-season analysis, automatic refresh, live timing, accounts, Wikipedia fallback or public deployment in this iteration. Do not change existing git metadata, commit existing setup, or discard user files. No intermediate human checkpoint is needed under the accepted unattended authorization.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Season selection | Verified 2010 or 2021 | All surfaces use the same season snapshot | Unsupported years cannot be selected |
| First load | No cache | Validate and display provider data with refresh time | Explicit cold error and retry; never show another season |
| Refresh | Existing valid snapshot | Atomic replacement and new successful timestamp | Retain snapshot/time on network or validation failure |
| Sprint round | 2021 British GP | Separate sprint and GP results; combined round points | Missing expected session is Unavailable |
| Non-sprint round | Verified non-sprint event | Sprint marked Not applicable | Never infer zero from absence |
| Participation gap | Driver lacks a round result | Aligned row remains with Unavailable cells | Recorded zero points remain numeric zero |
| Championship adjustment | Official total differs from earned sum | Display official total/rank and adjustment | Never substitute reconstructed totals |
| Teammate boundary | Multiple affiliations or changed teammate | Default latest shared-event teammate; annotate initial when different | No teammate leaves second selection empty |
| Request race | Season changes during a fetch | Only matching latest selection is rendered | Discard obsolete response without relabeling |

</frozen-after-approval>

## Code Map

- `app/shared/` — new dependency-free contracts and pure analysis selectors; coordinate names before parallel implementation.
- `app/server/` — new Jolpica adapter, coverage validation, file-cache snapshot owner and same-origin API; only this layer calls the provider.
- `app/client/` — new React shell, season state, standings, progress and comparison tables, original Pit Wall styles.
- Root `package.json`, TypeScript/Vite configuration and `index.html` — additive local development/build/test entry points.
- Existing `.agents/`, `_bmad/`, planning artifacts and working templates — preserve installed workflows and original design references. There are no commits: the existing BMAD setup is untracked; baseline is NO_VCS.

## Tasks & Acceptance

**Execution:**
- [x] `app/shared/` — define normalized snapshots, nullability and selectors; test sprint totals, official authority and teammate boundaries.
- [x] `app/server/` — implement paginated provider reads, bounded requests, support manifest, validated atomic cache and refresh endpoint.
- [x] `app/client/` — build shell and both standings with accessible controls and coherent selection.
- [x] `app/client/` — add driver/constructor progress and aligned arbitrary-driver comparison tables.
- [x] Root configuration and documentation — provide install, run, build, verification commands and scope limitations.
- [x] Integration tests — exercise the I/O matrix, especially stale responses and refresh retention; record live coverage evidence for each offered year.

**Acceptance Criteria:**
- Given the local app is running, the user can complete standings → driver progress → constructor progress → comparison → manual refresh for each verified season without a reload.
- Given the initial support pair, the app clearly labels supported years and does not imply that all years from 2010 onward were audited.
- Given desktop or a smaller viewport, core controls work by keyboard and wide metric tables remain readable through scrolling.
- Given final verification, report exact passing commands and any unverified behavior before the human review.

## Implementation Notes

- User authorized additive reversible local work and parallel agents. No deployment, publication or commit is part of this run.

- Final verification: production build passes, 19 unit/integration tests and nine Chromium tests pass. Both historical seasons audited; real 2010 refresh changes snapshot ID and timestamp. All review findings corrected; details in first-iteration-verification.md.
- Runtime: hidden local Node process at 127.0.0.1:3001; PID and logs recorded under .cache/.

## Spec Change Log

## Review Triage Log
| Finding | Verdict | Evidence and action |
|---|---|---|
| Blind 1: truncated historical schedule | medium | Adapter accepts a shortened self-consistent calendar; enforce the verified 19/22-round calendars before publishing snapshots. |
| Blind 2: absent expected sprint | medium | Optional schedule metadata alone cannot establish non-applicability; enforce 2021 rounds 10/14/19. |
| Blind 3: damaged complete session cache | medium | Removing entries can retain complete flags; persist and verify a checksum of the audited snapshot. No two-car roster assumption will be introduced. |
| Blind 4: malformed provider metrics/status | medium | Invalid provided numeric strings currently become unavailable and absent statuses become empty; distinguish legitimate absent metrics from malformed supplied fields. |
| Blind 5: provider season identity | high | Returned round IDs can match another year; reject responses whose table/record season differs from the requested year. |
| Blind 6: cached GET/refresh race | medium | Both operations share active promise; explicit refresh must run after a pending cache-only read. |
| Blind 7: manifest failure after successful verification | medium | Both steps share a catch path; preserve successful verification and retry only manifest discovery. |
| Blind 8: focus after surface navigation | medium | Row action disappears after navigation; focus the destination heading only on surface changes. |
| Blind 9: adapter normalization tests | medium | Existing tests bypass buildSnapshot; add deterministic provider-shaped normalizer fixtures. |
| Blind 10: date/timestamp validation | medium | Parseable timestamps and unchecked schedule dates pass; validate calendar dates and UTC ISO timestamps. |
| Edge 1: cached GET/refresh race | medium | Same verified defect as Blind 6; grouped for the same service fix and regression test. |
| Edge 2: wrong-season payload | high | Same verified defect as Blind 5; grouped for adapter identity validation. |
| Edge 3: lost cached participant | medium | Same verified defect as Blind 3; checksum rejects altered persisted audited data. Provider pagination remains the source completeness authority. |
| Edge 4: missing sprint metadata/results | medium | Same verified defect as Blind 2; expected sprint calendar guards applicability. |
| Verification gap 1: normalizer bypassed | medium | Provider field corruption would evade current tests; grouped with Blind 9 and accepted deterministic integration tests. |

- All 15 review findings above were addressed in ten grouped fixes. Final targeted regressions cover provider identity/calendar, normalization, malformed payloads, cache integrity, GET/POST race, manifest-only retry and destination focus; no unresolved review finding remains.

## Verification

- `npm run build` — production client and server compile with TypeScript contracts intact.
- `npm test` — meaningful domain, adapter and snapshot recovery tests pass.
- Local browser walkthrough — both seasons, all surfaces, comparison defaults, failed refresh retention and responsive tables work; record any unavailable browser tooling explicitly.


