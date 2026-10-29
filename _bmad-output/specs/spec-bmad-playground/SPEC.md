---
id: SPEC-bmad-playground
companions:
  - ../../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
sources:
  - ../../planning-artifacts/briefs/brief-bmad-playground-2026-10-29/brief.md
  - ../../planning-artifacts/prds/prd-bmad-playground-2026-10-29/prd.md
  - ../../planning-artifacts/prds/prd-bmad-playground-2026-10-29/addendum.md
---

> **Canonical contract.** This spec and its companions define what to build and verify. Sources provide audit history; companions are required reading. Derived from `.memlog.md`; update through bmad-spec.

# F1 Dashboard — First Iteration

## Why

The 2026-10-29 user decision targets a usable local iteration within roughly eight hours, without a runtime guarantee. Initially offer only fully verified 2010 and 2021. Keep every required metric in accessible tables; defer charts, summary strip and metric previews. Broader historical support remains full-MVP follow-up. This boundary supersedes conflicting full-MVP scope in source documents and adopted companions; all remaining correctness and recovery invariants stay binding.

React/TypeScript/Vite and local Node operation are accepted. Parallel agents and unattended completion are authorized: automated foundation verification, no intermediate human pause, final human review only. Existing untracked BMAD setup and git metadata are preserved; no commits or deployment are requested.

Yannick wants a personal web dashboard to learn by building and exploring F1 performance. Deliver a working season-analysis MVP before expanding its scope.

## Capabilities

- **CAP-1 — Season context (FR-1)**
  - **intent:** Select one supported season from 2010 onward for all analysis.
  - **success:** Only verified supported years are offered; every surface uses the selected season without relabeling another season's data. The support manifest records checked rounds and known gaps.
- **CAP-2 — Driver standings (FR-2)**
  - **intent:** Inspect drivers' championship ranking in the selected season.
  - **success:** Show official position, driver name, source constructor affiliations and points; unavailable fields remain explicit.
- **CAP-3 — Constructor standings (FR-3)**
  - **intent:** Inspect constructors' championship ranking in the selected season.
  - **success:** Show official position, constructor name and points for the same season context.
- **CAP-4 — Driver progress (FR-4)**
  - **intent:** Follow a driver's qualifying, results and points through a season.
  - **success:** Chronological accessible tables expose GP qualifying, GP result/classification and status, separate sprint results, GP/sprint awarded points, round-earned points and official cumulative points. Missing values differ from zero and never become invented finishes.
- **CAP-5 — Constructor progress (FR-5)**
  - **intent:** Follow a constructor's points and championship position through a season.
  - **success:** Show round-earned points including sprints, official cumulative points and official rank by round; retain differences between session-earned and championship totals as adjustments.
- **CAP-6 — Comparison selection (FR-6)**
  - **intent:** Compare teammates by default or choose any two drivers from the selected season.
  - **success:** The default opponent is the latest teammate at the last shared event in that season. Identify the initial teammate from the first shared event in the ranking when different. No teammate leaves the second selection empty; arbitrary distinct season drivers remain selectable.
- **CAP-7 — Aligned comparison (FR-7)**
  - **intent:** Compare both drivers' performance against matching rounds.
  - **success:** GP qualifying, GP results, separately labeled sprint results, round points and cumulative points align to the same chronological season schedule in accessible tables. Charts are deferred. Absent participation/results show Unavailable; actual zero points remain 0.
- **CAP-8 — Manual refresh (FR-8)**
  - **intent:** Refresh the selected season on demand from any surface.
  - **success:** Explicit refresh replaces the complete validated snapshot consistently across views, updates its successful refresh time and preserves valid selections. Duplicate pending actions are disabled; automatic refresh never runs.
- **CAP-9 — Data states and recovery (FR-9)**
  - **intent:** Understand availability and recover from load or refresh failures.
  - **success:** Distinguish loading, empty/unrun, partial/unavailable and failed data states. Failed refresh retains the last successful snapshot and timestamp with retry; cold-load failure shows an error without another season's data.

## Constraints

- Jolpica is the approved primary source. Verify complete required endpoint/page coverage before claiming support from 2010 through any upper bound; representative 2010/2021 samples do not establish season-wide coverage.
- Architecture AD-1–AD-8 govern identity, unavailable values, official championship authority, season-relative teammates, atomic snapshots, API contracts, provider limits and acceptance checks. Session-earned totals must not replace official championship totals or ranks.
- GP qualifying is the only qualifying measure. Keep GP and sprint results distinct; verified non-sprint events show Not applicable, while missing expected sessions remain Unavailable. Fractional points and source result statuses must survive normalization.
- Use the selected Pit Wall composition and original assets. DESIGN.md owns visual tokens/layout; EXPERIENCE.md owns interactions, states and accessible table equivalents. Its linked Standings mockup is illustrative; the spines govern implementation.
- Desktop is primary; core controls remain usable on smaller screens. Keep season, rounds, units and names visible, with keyboard access and readable accessible tables.
- Initial loads may fetch on cache miss; subsequent upstream updates require explicit refresh. Failed requests must not replace a valid snapshot or advance its timestamp.
- Complete required endpoint/page coverage checks for 2010 and 2021, published dependency resolution and AD-8 fixture/integration/accessibility checks are first-iteration gates; broader historical audit is deferred.

## Non-goals

- Cross-season analysis in this MVP. Next iteration may compare driver/constructor final championship ranks and total points by year.
- Live timing, automatic updates, sprint qualifying, accounts, native applications and Wikipedia scraping/fallback.
- Commercial positioning or public adoption. Public/shared deployment requires a separate access and rate-control decision.

## Success signal

Yannick can select a verified season, inspect both standings, follow driver and constructor progress, compare teammates or arbitrary drivers, and refresh successfully. Demonstrating a failed refresh preserves the same data and timestamp completes the recovery check.

## Assumptions

- React/TypeScript/Vite and local Node are accepted; exact compatible published versions remain implementation choices. Initial operation uses one local process, same-origin API and file cache.
- Three surfaces, latest verified season on entry, URL/Back state, empty direct Compare, comparison reset/default rules, cumulative-points default and no offline guarantee remain the upstream provisional behavior choices.
- Upstream provisional visual tokens, responsive/input defaults and WCAG 2.2 AA target remain in force pending validation.
- Multiple teammate candidates at a boundary round use the architecture's provisional GP-before-sprint, then ascending driverId tie-break.



