---
status: final
scope: iteration-three
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
requirementsStatus: confirmed
workflowStatus: complete
epicDesignStatus: approved
storyCreationStatus: batch-generated
validationStatus: passed
validationOpenChecks: []
readinessStatus: PASS
implementationStatus: not-started
storyApprovalMode: batch-generation-requested-by-user
updated: 2026-10-30
inputDocuments:
  - _bmad-output/specs/spec-iteration-three/SPEC.md
  - _bmad-output/specs/spec-iteration-three/season-coverage-and-acceptance.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - _bmad-output/planning-artifacts/prds/prd-bmad-playground-2026-10-29/prd.md
---

# F1 Pit Wall — Iteration Three Epic Breakdown

## Overview

Requirements extraction for the approved 0.2 baseline and iteration-three CAP-1..3. The iteration-three spec and its four required companions govern scope. The original PRD supplies regression requirements; historical two-season restrictions and deferrals do not govern this iteration. Preserve iteration-two epics.md and existing sprint history; this separate file holds the new iteration. Requirements and the three-epic structure were confirmed by the user on 2026-10-30. User requested all remaining stories and checks in one batch, superseding per-story/epic pauses. Stories are generated in epic order; final validation and readiness follow without further menus. Batch generation does not claim user acceptance of implementation.

## Requirements Inventory

### Functional Requirements

FR-1: Preserve one selected-season context across Standings, Progress and Compare; offer individually audited candidates 2010–2026 and enable analysis only for verified years. Default to the latest verified year, including an audited ongoing season.
FR-2: Preserve official driver standings with position, canonical driver name, season-relative constructor affiliations and points.
FR-3: Preserve official constructor standings with position, name and points.
FR-4: Preserve chronological driver GP qualifying, GP results, separate sprint results/points, awarded round points and official cumulative championship points.
FR-5: Preserve constructor awarded round points, official cumulative points and championship position, including applicable sprints.
FR-6: Preserve any-two-driver comparison, season-relative first/latest teammate defaults and initial-teammate annotations.
FR-7: Preserve round alignment, explicit unavailable records, genuine zero values, source classification and status.
FR-8: Preserve explicit local refresh without polling or background acquisition; hosted mode offers static-load retry only.
FR-9: Preserve loading, empty, error and retained-snapshot states. Failed refresh retains snapshot, selections, support metadata and source timestamp.
I3-FR-1 (CAP-1): Every constructor identity has exactly one visible accessible team-name label. Missing/failed logos remove the badge without text placeholders; verified logos remain decorative beside the name.
I3-FR-2 (CAP-2): Audit all 17 years independently, including calendars, GP classifications/statuses/points, GP qualifying, applicable sprint results/points, official per-round standings, entities, affiliations and pagination. Record every year's verification, failures, freshness, provenance and gaps without silent omission.
I3-FR-3 (CAP-2): Distinguish independently evidenced held, unheld, cancelled and unknown session lifecycle from data availability. Never infer unheld from an empty endpoint, date or maximum returned round. Unknown lifecycle prevents verification.
I3-FR-4 (CAP-2): Use one shared completed-GP window including held rounds with source gaps and excluding unheld/cancelled GPs. Retain the full calendar in tables/charts; already-held qualifying/sprint before an unheld GP is outside completed-GP comparison.
I3-FR-5 (CAP-2): Show ongoing 2026 as Ongoing / Season to date until completion is verified. Display exact analyzed rounds, metric samples and official standings source round/lag. Zero completed GPs leaves GP categories unavailable.
I3-FR-6 (CAP-2): Preserve six equally weighted comparison categories, directions, tie/comparable counts and conservative driver evidence for best finish/qualifying and DNF counts over the shared window. Qualifying 2/grid 7 remains 2; unknown retirement statuses and absent driver evidence remain unavailable.
I3-FR-7 (CAP-2): Acquire and validate real credited driver photographs and historically appropriate constructor logos for every represented identity/season slot. Reuse approved assets where applicable; disclose photograph date/unknown separately from selected year.
I3-FR-8 (CAP-2): Report actual-image/total and investigated-exception counts separately per kind/year. Every exception needs attempted sources, specific blockers and visual-check evidence; fallbacks never count as acquired images and no reduced target is preapproved.
I3-FR-9 (CAP-2): Export all 17 verified season payloads and credited media as one immutable validated release. Reject missing years, invalid inputs and mixed identities/metadata without implicit downloads or promotion over the prior good release.
I3-FR-10 (CAP-3): Select all unions every current search match from the full active season/category list with existing selection. Empty search matches all, no matches changes nothing, repeats are idempotent and selected nonmatches remain.
I3-FR-11 (CAP-3): Search alone changes no selection. Remove-one removes one ID; Clear selection empties the active category including nonmatches. Driver and constructor sets stay isolated.
I3-FR-12 (CAP-3): Graph, table, controls and URL consume one uncapped selected set. Back restores it; effective actions create one history entry and no-ops create none. Empty selection cannot fall back to legacy entity/default selection.
I3-FR-13 (CAP-3): Retain only valid IDs on decoded links/year changes, announce discarded IDs and prevent stale season/category/snapshot actions from committing elsewhere. Preserve every selected series for inspection at narrow widths and 200% zoom.

### NonFunctional Requirements

NFR-1: Preserve official championship authority, fractional points, adjustments, canonical identities, historical affiliations, ties, missing-versus-zero and GP/sprint separation; never fabricate results, future points or participation.
NFR-2: Preserve Pit Wall tokens/system fonts, semantic table equivalents, visible units/round labels, non-color encodings, visible focus and the existing WCAG 2.2 AA target.
NFR-3: Keep keyboard/pointer inspection, concise status announcements and focus retention; support narrow reflow and 200% zoom with intended local plot/table scrolling and full names/statuses/controls.
NFR-4: Hosted analysis makes no external data/image/font/API calls and needs no new backend/account system; no disconnected-browsing guarantee is introduced.
NFR-5: Preserve atomic per-season snapshot replacement, request generations, bounded provider queue/retries and last-good retention; no UI-triggered 17-year background download.
NFR-6: Preserve the existing Site identity and anyone-with-link audience on separately authorized publication. Keep sanitized source, matching source/archive and terminal deployment evidence; planning approval does not publish.
NFR-7: Preserve 0.2 artifacts and use iteration-three audit/media/verification evidence. Deterministic tests use saved fixtures; live audits establish provider coverage, not deterministic expectations.

### Additional Requirements

- AD-1..14 are binding. Retain existing React/TypeScript/Vite client, local Node service, shared pure domain and build-selected local/bundled adapters; no new scaffold or stack change.
- Freeze shared schemaVersion 2 / bundleVersion 2 types, runtime validators, audit records and window selectors before dependent feature implementation. No consumer invents its own lifecycle/window shape.
- Migrate audited v1 historical snapshots only with calendar/lifecycle evidence; reject unknown versions and invalid metadata without replacing good data. Coordinate cache, service, loaders, exporter and fixtures; API envelope paths remain /api/v1.
- Derive local support metadata from the same committed snapshot/audit generation. Successful load/refresh atomically updates snapshot and derived entry; delayed manifests cannot overwrite newer metadata. Bundled metadata must match its immutable release.
- Successful-empty audited source gaps are distinct from failed requests/pages/malformed payloads; the latter reject replacement. Held source gaps stay inside conservative evidence denominators.
- Expand server candidate/calendars, client support guards and exporter beyond hardcoded 2010/2021. Audit statuses/sprint applicability per year; unknown statuses require individual mapping and fixtures.
- app/client/media.ts owns canonical identity/season mappings. public/media/credits.json holds provenance, reuse terms, attribution, applicability, photograph date and crop notes. Freeze shared slot validation/counting before acquisition/export.
- Validate all 17 offered payloads/media from one release with external/API requests blocked. Preserve local manual refresh separately; retain previous hosted release if validation fails.
- New-year source availability, media acquisition and remaining exception review are implementation/acceptance gates, not completed planning evidence. No acquisition, code, build or publication occurs in this workflow.

### UX Design Requirements

UX-DR1: App header and Selector show selected year, source time/timezone, audit status and Ongoing/Complete; show all 17 candidate statuses without implying unverified support.
UX-DR2: Standings table retains canonical names/affiliations/official ranks/points and displays Current standings with source round/lag; Final requires verified completion.
UX-DR3: Shared Identity media renderer removes missing/failed constructor badges and retains one accessible name; driver portrait fallbacks keep readable stable frames. Correct historical mapped marks remain contained.
UX-DR4: Image credits/coverage disclosure is keyboard accessible, returns focus on close and exposes provenance/photo date plus separate kind/year mapped and investigated-exception counts.
UX-DR5: Progress panel provides category, search, Select all, remove-one and Clear selection with existing Pit Wall styling, match/selected counts and visible focus; filtering never hides selected nonmatch series from chart/table.
UX-DR6: Progress selection uses case-insensitive name-substring matches over the full list, deterministic graphDrivers/graphConstructors state and explicit empty/legacy-link precedence per AD-14.
UX-DR7: Comparison panel/summary/highlights preserve paired identities, six rows and shared outcomes; qualifying-before-grid and decorative ticks with descriptive assistive text remain. Ties/unavailable have no favorable marker.
UX-DR8: Data table and chart share values/window semantics; distinguish Not held, Cancelled, Unavailable with reason and Not applicable. Do not draw through missing sessions or invent future cumulative values.
UX-DR9: Status message covers audit failure, zero completed GPs, empty selection, no matches, many selections, cold/load failures and retained refresh failures; announce concise changes without moving focus/rereading tables.
UX-DR10: Navigation/Back/category/year transitions restore the same selections everywhere, isolate categories, retain valid IDs and announce removals. No-op selection adds no history.
UX-DR11: Preserve DESIGN colors/typography/spacing/components and desktop-first responsive layout, named series/styles, semantic tables, keyboard inspection and narrow/200% reflow without hidden series caps.
UX-DR12: Validate the retained identity flow and EXPERIENCE flows 8/9 for ongoing-season evidence and Select all, plus existing scoring/refresh/bundled regressions. Historical mocks are layout references, not data/media evidence; written spines govern.

### FR Coverage Map

| Requirement | Epic | Delivery or regression responsibility |
| --- | --- | --- |
| FR-1 | 5 | Individually verified season context across all 17 years |
| FR-2 | 5; 4 identity regression | Official driver standings and historical affiliations |
| FR-3 | 5; 4 identity correction | Official constructor standings with one accessible name |
| FR-4 | 5; 6 selection regression | Driver progress and shared chronological evidence |
| FR-5 | 5; 6 selection regression | Constructor progress and sprint-aware points |
| FR-6 | 5 | Within-season pair/teammate rules retained across expanded data |
| FR-7 | 5 | Source gaps, zeroes, classifications and round alignment |
| FR-8 | 5 | Explicit local refresh and hosted static-only reads |
| FR-9 | 5; 6 selection retention | Atomic refresh, metadata and last-good context |
| I3-FR-1 / CAP-1 | 4 | Single constructor identity for absent/failed logos |
| I3-FR-2 / CAP-2 | 5 | All 17 year-specific data audits |
| I3-FR-3 / CAP-2 | 5 | Evidenced lifecycle and availability distinctions |
| I3-FR-4 / CAP-2 | 5 | Shared completed-GP analysis window |
| I3-FR-5 / CAP-2 | 5 | Ongoing-season labels, samples and standings lag |
| I3-FR-6 / CAP-2 | 5 | Conservative six-category comparison over that window |
| I3-FR-7 / CAP-2 | 5 | Credited canonical season-appropriate media |
| I3-FR-8 / CAP-2 | 5 | Per-slot actual/exception inventory and visual evidence |
| I3-FR-9 / CAP-2 | 5 | Complete immutable all-year hosted release preparation |
| I3-FR-10 / CAP-3 | 6 | Add every current search match once |
| I3-FR-11 / CAP-3 | 6 | Independent search, remove-one and active-category clear |
| I3-FR-12 / CAP-3 | 6 | One uncapped URL-backed set and coherent history |
| I3-FR-13 / CAP-3 | 6 | Valid-context selection and many-series access |

| Cross-cutting requirements | Owning epic(s) |
| --- | --- |
| NFR-1 official scoring and honest absence | 5; 4/6 preserve baseline |
| NFR-2 accessibility and approved visuals | 4, 5, 6 |
| NFR-3 keyboard, narrow/200% access | 4, 5, 6 |
| NFR-4 hosted static behavior | 5; 4/6 hosted regressions |
| NFR-5 atomicity/provider budget | 5; 6 selection retention |
| NFR-6 existing Site/audience and release evidence | 5 |
| NFR-7 separate iteration-three evidence | 4, 5, 6 |
| UX-DR1, UX-DR2 | 5 |
| UX-DR3 | 4; 5 validates expanded identities |
| UX-DR4 | 5 |
| UX-DR5, UX-DR6 | 6 |
| UX-DR7, UX-DR8 | 5; 6 preserves shared graph/table behavior |
| UX-DR9 | 5, 6; 4 image-failure state |
| UX-DR10 | 6; 5 refresh/context integration |
| UX-DR11, UX-DR12 | 4, 5, 6 within each delivered scope |

## Epic List

Approved numbering continues after iteration-two Epics 1–3 to avoid colliding with historical story and sprint keys. Each epic delivers a user outcome on the approved 0.2 baseline and needs no later epic to function. Technical changes remain ordered stories inside the user-value epic that needs them.

### Epic 4: Recognize each constructor once

Yannick reads one visible, accessible team name when a constructor logo is missing or fails, while verified historical marks continue to render correctly. The shared renderer applies the correction throughout the existing application.

**FRs covered:** I3-FR-1 (CAP-1); preserve FR-2/3 identity behavior.

**Implementation notes:** AD-11; reuse the existing identity renderer and Pit Wall styles. Cover missing mapping, rejected media and image-load failure without duplicating text or accessible names. Driver portrait fallback behavior is retained.

**Independence:** Deliverable against existing 0.2 data/media, without waiting for all-year acquisition or Select all. Epic 5 reuses this renderer when new identities arrive.

### Epic 5: Explore every season with honest data and imagery

Yannick explores all 17 years from 2010–2026 across standings, progress and comparison, understands completed-round evidence for ongoing 2026, and sees credited photographs/historical logos or individually investigated exceptions. Local refresh and the bundled hosted edition retain their established behavior.

**FRs covered:** I3-FR-2..9 (CAP-2), FR-1..9 as expanded-data and current-season delivery/regressions.

**Implementation notes:** AD-1..13. Keep schema-v2/audit/window foundation, ingestion, year-specific audits, media evidence, shared analysis surfaces and immutable export in one epic: they repeatedly touch the same shared contracts, loaders and validators. Freeze shared contracts before dependent work. Group bounded year/media acquisition work into reviewable stories rather than a single all-years task. Require all 17 audited payloads for the complete iteration release; incomplete audits or unresolved media acceptance cannot silently reduce scope.

**Independence:** Does not require Epic 6 selection controls. Can use the baseline identity renderer before Epic 4; completing Epic 4 first avoids duplicating fallback corrections. Existing Site publication remains a separately authorized release action; preparing and verifying release artifacts does not publish them.

### Epic 6: Select matching Progress series together

Yannick selects every search-matching driver or constructor in one keyboard-accessible action, retains selected nonmatches and can inspect, remove, clear and restore the same set through browser Back without hidden limits.

**FRs covered:** I3-FR-10..13 (CAP-3); preserve FR-4/5 progress values and FR-9 retained selections.

**Implementation notes:** AD-6/14. Extend the existing category-specific URL-backed state, case-insensitive full-list search and shared chart/table selectors. Cover empty/no-match/repeated actions, legacy links, invalid IDs, category/year/context changes and many-series narrow/200% inspection.

**Independence:** Implementable and testable using existing 0.2 verified seasons; it neither depends on nor triggers new-year acquisition. Repeat integration checks against Epic 5's expanded data after both are available.

### Approved delivery order and boundaries

1. Epic 4 is the small, independently reviewable identity correction.
2. Epic 5 starts with the shared schema/audit/window foundation before dependent year acquisition and UI/export work. Media/data evidence and all-year release validation are completion gates within this epic, not deferred follow-up scope.
3. Epic 6 can be developed independently against baseline data; integrate with refreshed snapshots and all 17 seasons when Epic 5 is available.

No forward epic dependency is required for a delivered outcome. Shared identity usage is incidental; Epic 5 owns acquisition/provenance while Epic 4 owns fallback rendering. Shared Progress usage is bounded: Epic 5 owns values/window metadata, Epic 6 owns selection state. Retain the same shared contracts and selectors at both boundaries. Detailed stories follow; readiness is assessed separately after final validation.

## Epic 4: Recognize each constructor once

Yannick recognizes the correct constructor from one visible and accessible name, including when a logo is missing or fails. This epic is independently deliverable against approved 0.2 data and assets.

### Story 4.1: Keep one constructor name when its logo is unavailable

As a season-analysis user,
I want a constructor's name to appear once when its logo is absent or fails,
So that I can recognize the team without repeated labels or misleading branding.

**Requirements:** I3-FR-1 / CAP-1; FR-2/3 identity regressions; UX-DR3, UX-DR9, UX-DR11, UX-DR12; NFR-2/3/4/7; AD-11.

**Dependencies:** Approved release 0.2 only; no new-year audit, media acquisition or later story. Reuse the existing shared identity renderer, mappings and Pit Wall styles. Implementation inspection starts at `app/client/Identity.tsx`, `app/client/media.ts` and their callers.

**Review status:** Included in the user-requested batch; not implemented. One development session covers the shared correction and its focused component/browser verification.

**Acceptance Criteria:**

**Given** a constructor with no season-applicable mapping, rejected/unusable media or a logo that fails to load,
**When** its identity is rendered in Standings, Progress, Compare or an identity-bearing control,
**Then** exactly one visible team-name label and one accessible team-name label remain within that identity instance,
**And** no initials, team text, empty logo badge or additional accessible image name is inserted as a constructor fallback; surrounding unrelated identity instances are not removed.

**Given** a valid historically applicable constructor logo,
**When** the identity renders normally,
**Then** the contained logo and existing readable team-name label remain,
**And** the redundant logo is decorative for assistive technology, the canonical identity/season mapping is retained and no successor branding is substituted.

**Given** an identity instance first displays a failed logo and is then reused for another constructor, season or valid mapped asset,
**When** its identity or resolved asset changes,
**Then** the new asset is evaluated independently and may display successfully,
**And** stale failure state cannot suppress a valid logo or attach the previous team's name/image to the new identity.

**Given** driver portrait fallbacks, paired comparison identities and normal data interactions on the approved baseline,
**When** the constructor correction is applied,
**Then** driver photograph/initial behavior, names, affiliations, scoring, chart/table values and keyboard navigation remain functional,
**And** no external asset request, new media acquisition, hosted API fallback or publication is introduced.

**Given** missing mapping, valid mapping and deliberately failed-image cases,
**When** focused verification runs in local and bundled modes at desktop, narrow width and 200% zoom,
**Then** rendered text and accessibility assertions establish the single-name rule and successful-logo recovery, with visual checks confirming containment, legibility and reflow,
**And** evidence is recorded in `_bmad-output/implementation-artifacts/iteration-three-verification.md` under Story 4.1; fallback success is not reported as acquired-image coverage.

### Epic 4 coverage

Story 4.1 covers the entire CAP-1 / I3-FR-1 outcome and its relevant identity/accessibility regressions. No later story is required for completion. Epic 5 will independently verify this shared behavior against newly acquired identities, while owning the media inventory and acquisition acceptance.

Epic 4 contains one story. User requested remaining epics and checks as a single batch; no intermediate approval pause applies.

## Epic 5: Explore every season with honest data and imagery

Yannick can inspect individually audited 2010-2026 data, conservative completed-GP analysis and credited historical imagery in local and bundled editions. Stories 5.1-5.5 establish shared contracts and working fixture-backed behavior; each can be verified without future acquisition stories. Stories 5.6-5.22 each audit one year, and 5.23-5.39 each handle one year's media inventory. Stories 5.40-5.41 complete release preparation and evidence. No new-year support is asserted merely by writing these stories.

All story statuses are not-started. Dependencies name earlier stories only; independent year stories may run in any order after their prerequisites, using one shared bounded upstream queue. Do not concurrently overwrite shared mappings/contracts or the same evidence file; merge year records through the shared tooling.

### Story 5.1: Validate versioned season evidence consistently

As a season-analysis user,
I want one trusted evidence contract across loaders and audits,
So that season lifecycle cannot be interpreted differently by each surface.

**Requirements:** I3-FR-3/4/5/9; NFR-1/5/7; AD-1/2/5/6/9/13.

**Dependencies:** 0.2 baseline; no future story.

**Scope and evidence:** Freeze shared v2 TypeScript shapes and runtime validators in app/shared, including audit records, session applicability/lifecycle, ordered analysisRounds, support/bundle metadata and media-slot contracts. Add validated fixture-backed local/bundled adapter seams and explicit migration tooling. Preserve the separately usable 0.2 release until the complete iteration-three release passes 5.40. Development fixtures/subsets are never publishable releases. Evidence: iteration-three-verification.md, section 5.1.

**Acceptance Criteria:**

**Given** v2 snapshot, support and bundle fixtures with held/unheld/cancelled/unknown sessions,
**When** all consumers use the shared validators,
**Then** version, identity, window, UTC freshness, canonical references and audit provenance are checked by one contract,
**And** duplicate/out-of-schedule analysis rounds, contradictory applicability, malformed lifecycle and unknown versions fail closed; unknown lifecycle cannot be marked verified.

**Given** audited v1 historical input and calendar/lifecycle evidence,
**When** explicit migration runs,
**Then** a validated v2 result preserves original scoring/source timestamps and separately records migration/audit provenance,
**And** no unchecked cast or date-based completion inference is allowed; failed migration preserves the original and last good snapshot.

**Given** matching v2 bundled fixtures or mismatched manifest/payload generations,
**When** the fixture-backed loader resolves one immutable release,
**Then** matching values load without API fallback and mismatches are rejected,
**And** existing API envelopes remain /api/v1, no hidden v1/v2 mixing is allowed, and exact shared schemas are frozen before dependent work.

### Story 5.2: Load audited historical and ongoing seasons safely

As a season-analysis user,
I want season loading to distinguish lifecycle from missing source records,
So that refresh preserves trustworthy evidence instead of inventing completeness.

**Requirements:** I3-FR-2/3/4; FR-1/8/9; NFR-1/5/7; AD-5/7/8/13.

**Dependencies:** 5.1.

**Scope and evidence:** Extend service/repository/adapter/audit tooling from hardcoded calendars to audited year records for candidates 2010-2026. Commit v2 snapshots and derived support metadata coherently; test general ingestion with saved fixtures, not 17-year live acquisition. Store per-year reports under implementation-artifacts/iteration-three/data/{year}.md and an iteration-three-data-coverage.md index.

**Acceptance Criteria:**

**Given** a candidate year with independently sourced calendar/session applicability and lifecycle,
**When** required endpoint pages are fetched through the process-wide bounded queue,
**Then** all required pages and canonical entities/affiliations are audited and a complete staged snapshot is validated before atomic commit,
**And** records retain official points/classification/status; candidate range alone never sets verified=true.

**Given** successful-empty held data, verified unheld/cancelled sessions or unknown lifecycle,
**When** coverage is assessed,
**Then** held successful-empty gaps remain explicit inside the window; unheld/cancelled/non-sprint are separate states; unknown lifecycle prevents verification,
**And** request/page/malformed failures reject replacement and preserve snapshot, support entry and timestamp rather than masquerading as audited gaps.

**Given** a successful refresh and delayed earlier cache/manifest responses,
**When** the client receives a newer per-season generation,
**Then** snapshot and derived support lifecycle/window/freshness/gaps commit together,
**And** delayed metadata cannot overwrite them, failed refresh keeps both, initial cache-miss/manual-refresh behavior remains, and no polling or all-years UI download is introduced.

**Given** rate limits, truncated pages, changed pagination totals and interrupted year audits,
**When** audit tooling runs or retries manually,
**Then** bounded retries/timeouts/budget exhaustion fail cleanly with per-year progress and failure evidence,
**And** completed other-year records remain intact and a partial year is never promoted as verified.

### Story 5.3: Compare drivers over the same completed-GP evidence

As a season-analysis user,
I want every metric to use the same honest season window,
So that ongoing-season results remain comparable without future-round zeroes.

**Requirements:** I3-FR-4/5/6; FR-2/3/4/5/6/7; NFR-1; UX-DR7/8; AD-2/3/4/10/13.

**Dependencies:** 5.1; fixture-driven, no live audit dependency.

**Scope and evidence:** Update shared selectors/comparison/progress-model together with saved edge fixtures. Keep pure-domain ownership and existing teammate/scoring policies. Record deterministic outcomes in iteration-three-verification.md, section 5.3.

**Acceptance Criteria:**

**Given** held GPs with source gaps, future/cancelled GPs and a sprint/qualifying held before its GP,
**When** shared selectors build the analysis window,
**Then** every held GP stays in the ordered denominator and unheld/cancelled GPs stay outside it,
**And** full-calendar output preserves session lifecycle and pre-GP evidence is separately labelled outside completed-GP comparisons.

**Given** ongoing and completed historical fixtures,
**When** six-category comparison and evidence tables are computed,
**Then** best GP finish/qualifying and DNF counts require conservative driver records across the whole window; zero completed GPs leaves GP categories unavailable,
**And** qualifying 2/grid 7 stays 2, missing substitute-driver evidence and unknown retirement status remain unavailable, and directions/equal votes/ties/insufficient-data behavior remain unchanged.

**Given** official standings lagging the latest analyzed GP and a fractional-points/adjustment fixture,
**When** standings and cumulative series are selected,
**Then** official source totals/ranks and source round are retained without extrapolation or local reranking,
**And** GP/sprint earned totals, genuine zeroes, adjustments, teammate ties and missing sprint entries preserve 0.2 semantics; graphs and tables share output.

### Story 5.4: Read audit status and season-to-date evidence on every surface

As a season-analysis user,
I want clear coverage and ongoing-season context throughout analysis,
So that I can tell what is known without confusing future rounds with failures.

**Requirements:** I3-FR-2/4/5; FR-1/2/3/4/5/7/8/9; UX-DR1/2/7/8/9/11/12; NFR-2/3/4/5; AD-6/10/13.

**Dependencies:** 5.1, 5.2, 5.3.

**Scope and evidence:** Integrate v2 client state/loaders and lifecycle/window selectors with App, Standings, Progress and Compare. Use fixture-backed candidates for coverage of all UI states before live year audits; preserve approved styling. Evidence: EXPERIENCE flow 8 in iteration-three-verification.md.

**Acceptance Criteria:**

**Given** 17 candidates with distinct verified/unverified statuses,
**When** the season control and coverage disclosure render,
**Then** all years and individual audit failures/gaps are discoverable, only verified analysis is enabled and latest verified season is the default,
**And** successful audit is not rejected by a residual two-year guard and selection never starts broad acquisition.

**Given** ongoing 2026 or an independently verified completed season,
**When** Standings, Progress and Compare render,
**Then** Ongoing / Season to date shows exact analyzed GP rounds and samples; Current standings names source round and lag; Final requires verified completion,
**And** Not held, Cancelled, Not applicable and Unavailable with reason remain distinct, zero-GP and pre-GP-session states are explicit and future plot segments are not fabricated.

**Given** keyboard use, narrow viewport/200% zoom and refresh/load failures,
**When** the user traverses the analysis,
**Then** controls, names, units, focus, status announcements and semantic table equivalents remain usable with intended local scrolling,
**And** local failure retains good data/metadata/selection/time; bundled failure retries static loading without API fallback, and obsolete season responses never relabel data.

### Story 5.5: Inventory credited imagery against canonical season identities

As a season-analysis user,
I want a reliable per-season media inventory and credits disclosure,
So that real imagery and investigated exceptions are counted honestly.

**Requirements:** I3-FR-7/8; UX-DR3/4/11/12; NFR-2/3/4/7; AD-9/11.

**Dependencies:** 5.1; may use existing verified identities before new-year audits.

**Scope and evidence:** Freeze and implement shared (kind, canonical identity, season) validation/counting, media integrity and provenance tooling. Keep app/client/media.ts and public/media/credits.json as owners. Record index iteration-three-media-coverage.md and per-year records iteration-three/media/{year}.md; no broad acquisition in this tooling story.

**Acceptance Criteria:**

**Given** audited identities plus reused credited files, duplicate mappings and missing assets,
**When** inventory validation runs,
**Then** each portrait/constructor slot counts once per identity/season and is mapped or an investigated exception, never both,
**And** actual/total and exception counts are separate per kind/year; missing files, wrong seasons and incomplete provenance are rejected rather than counted as images.

**Given** an accepted asset or investigated exception,
**When** credits/coverage disclosure is opened,
**Then** source URL, creator, reuse terms/license URL, attribution, applicability, file, photograph date/unknown and crop notes are available for mapped assets,
**And** exceptions carry attempted source URLs, specific blockers and visual-check outcomes; generic not-vetted and fallback-only results cannot establish acquisition acceptance.

**Given** keyboard interaction and dated/reused imagery,
**When** disclosure opens and closes,
**Then** focus returns to its trigger and photo date is disclosed independently of selected season,
**And** historical constructor identity is enforced, no generated images or successor substitution is allowed, and approved driver fallbacks/rendering remain.

### Story 5.6: Audit 2010 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2010 season evidence,
So that 2010 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2010 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2010.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2010 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2010 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2010 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.7: Audit 2011 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2011 season evidence,
So that 2011 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2011 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2011.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2011 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2011 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2011 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.8: Audit 2012 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2012 season evidence,
So that 2012 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2012 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2012.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2012 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2012 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2012 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.9: Audit 2013 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2013 season evidence,
So that 2013 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2013 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2013.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2013 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2013 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2013 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.10: Audit 2014 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2014 season evidence,
So that 2014 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2014 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2014.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2014 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2014 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2014 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.11: Audit 2015 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2015 season evidence,
So that 2015 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2015 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2015.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2015 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2015 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2015 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.12: Audit 2016 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2016 season evidence,
So that 2016 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2016 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2016.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2016 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2016 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2016 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.13: Audit 2017 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2017 season evidence,
So that 2017 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2017 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2017.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2017 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2017 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2017 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.14: Audit 2018 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2018 season evidence,
So that 2018 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2018 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2018.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2018 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2018 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2018 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.15: Audit 2019 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2019 season evidence,
So that 2019 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2019 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2019.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2019 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2019 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2019 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.16: Audit 2020 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2020 season evidence,
So that 2020 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2020 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2020.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2020 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2020 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2020 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.17: Audit 2021 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2021 season evidence,
So that 2021 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2021 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2021.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2021 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2021 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2021 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.18: Audit 2022 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2022 season evidence,
So that 2022 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2022 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2022.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2022 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2022 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2022 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.19: Audit 2023 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2023 season evidence,
So that 2023 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2023 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2023.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2023 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2023 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2023 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.20: Audit 2024 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2024 season evidence,
So that 2024 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2024 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2024.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2024 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2024 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2024 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.21: Audit 2025 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2025 season evidence,
So that 2025 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2025 acquisition/audit and its source-specific fixes/fixtures. Verify historical calendar completion and applicability independently, including cancelled/rescheduled events and sprint format where relevant; do not infer completion from the year. Evidence: iteration-three/data/2025.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2025 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2025 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2025 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.22: Audit 2026 season data and analysis

As a season-analysis user,
I want to inspect individually verified 2026 season evidence,
So that 2026 is supported by a real audit rather than a dropdown entry.

**Requirements:** I3-FR-2/3/4/5/6; FR-1..9; NFR-1/5/7; UX-DR1/2/7/8/9/12; AD-2/3/4/5/7/8/10/13.

**Dependencies:** 5.1, 5.2, 5.3, 5.4; no other year audit required.

**Scope and evidence:** Only 2026 acquisition/audit and its source-specific fixes/fixtures. For 2026 retain ongoing status until independent completion evidence; audit all available completed rounds and distinguish unheld future sessions, zero completed GPs and standings lag. Evidence: iteration-three/data/2026.md plus index iteration-three-data-coverage.md; preserve source snapshot identity/time. Source-specific fixes must remain shared rather than year-only UI logic.

**Acceptance Criteria:**

**Given** the 2026 audited calendar and session inventory,
**When** manual year audit fetches all required pages,
**Then** calendar, GP results/statuses/points, GP qualifying, applicable sprint results/points, official per-round driver/constructor standings and canonical affiliations are individually reconciled,
**And** report records source URLs, observation/snapshot times, expected versus fetched pages/rounds, lifecycle evidence, actual gaps and every failure; prior 2010/2021 evidence is explicitly revalidated for v2.

**Given** the resulting 2026 snapshot and independently checked representative edge records,
**When** local standings, progress and comparison are exercised,
**Then** official source ranks/points, GP/sprint separation, qualifying-before-grid, window samples, source lag and missing-versus-zero agree with evidence,
**And** unknown retirement/status values are individually investigated and fixture-mapped or remain unavailable; no invented source values or inferred nonparticipation is accepted.

**Given** a failed 2026 request/verification or unresolved lifecycle,
**When** the audit finishes,
**Then** the year remains unverified with a specific report and prior good snapshot preserved, rather than silently omitted or force-marked verified,
**And** story is not marked complete until usable verified year data and its checks exist; successful-empty genuine gaps may be disclosed without pretending every metric is available.

### Story 5.23: Complete 2010 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2010 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.6; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2010 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2010.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2010 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2010 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2010 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.24: Complete 2011 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2011 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.7; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2011 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2011.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2011 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2011 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2011 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.25: Complete 2012 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2012 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.8; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2012 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2012.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2012 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2012 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2012 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.26: Complete 2013 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2013 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.9; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2013 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2013.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2013 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2013 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2013 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.27: Complete 2014 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2014 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.10; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2014 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2014.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2014 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2014 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2014 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.28: Complete 2015 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2015 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.11; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2015 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2015.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2015 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2015 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2015 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.29: Complete 2016 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2016 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.12; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2016 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2016.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2016 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2016 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2016 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.30: Complete 2017 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2017 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.13; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2017 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2017.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2017 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2017 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2017 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.31: Complete 2018 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2018 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.14; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2018 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2018.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2018 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2018 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2018 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.32: Complete 2019 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2019 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.15; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2019 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2019.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2019 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2019 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2019 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.33: Complete 2020 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2020 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.16; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2020 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2020.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2020 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2020 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2020 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.34: Complete 2021 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2021 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.17; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2021 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2021.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2021 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2021 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2021 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.35: Complete 2022 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2022 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.18; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2022 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2022.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2022 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2022 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2022 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.36: Complete 2023 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2023 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.19; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2023 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2023.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2023 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2023 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2023 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.37: Complete 2024 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2024 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.20; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2024 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2024.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2024 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2024 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2024 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.38: Complete 2025 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2025 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.21; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2025 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2025.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2025 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2025 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2025 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.39: Complete 2026 driver and constructor imagery inventory

As a season-analysis user,
I want correct credited imagery for every represented 2026 identity,
So that I recognize historical teams and drivers with honest coverage.

**Requirements:** I3-FR-7/8; NFR-2/3/4/7; UX-DR3/4/11/12; AD-9/11.

**Dependencies:** 5.5 and 5.22; no other year media story required.

**Scope and evidence:** Bound acquisition/reuse to the audited 2026 roster and affiliations. Files may be reused across applicable years but every slot needs independent applicability validation. Evidence: iteration-three/media/2026.md and index iteration-three-media-coverage.md; share updates through mapping/credit validators.

**Acceptance Criteria:**

**Given** every portrait and constructor slot from the audited 2026 entities,
**When** existing approved files are checked and real assets acquired where needed,
**Then** canonical identity, historical constructor branding, applicable season and license/provenance are verified for each mapped asset,
**And** no name-based joins, unrelated successors, generated likenesses/logos or photograph-date claims inferred from selected year are accepted.

**Given** one inventory row for every 2026 kind/identity/season slot,
**When** coverage counts and exceptions are generated,
**Then** mapped valid files and individually investigated exceptions partition the full audited denominator, with separate logo/photo actual/total and missing counts,
**And** each remaining exception has attempted URLs and a specific blocker; no lower percentage is preapproved and exception acceptance remains a user-review gate, not an automatic pass.

**Given** the 2026 rendered images, missing mappings and forced image-load failures,
**When** desktop/narrow/200% visual and keyboard checks run,
**Then** faces/logos, crop/containment, names, affiliations, credits and photo-date disclosures are checked and recorded,
**And** fallbacks never count as acquired images; the existing renderer behavior is preserved and final single-name compliance is checked in 5.41 without requiring future code to finish acquisition.

### Story 5.40: Prepare one complete immutable all-season bundle

As a season-analysis user,
I want every offered season and credited asset in one validated hosted release,
So that shared analysis cannot mix years or release generations.

**Requirements:** I3-FR-9; FR-8/9; NFR-4/5/6/7; UX-DR1/4/8/9/12; AD-5/9/11/12/13.

**Dependencies:** 5.1-5.5; all data stories 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14, 5.15, 5.16, 5.17, 5.18, 5.19, 5.20, 5.21, 5.22; all media stories 5.23, 5.24, 5.25, 5.26, 5.27, 5.28, 5.29, 5.30, 5.31, 5.32, 5.33, 5.34, 5.35, 5.36, 5.37, 5.38, 5.39.

**Scope and evidence:** Extend scripts/export-site.mjs and shared bundled validation for the full iteration-three release. Prepare sanitized source/commit/archive and verify build artifacts using the existing Sites contract; do not publish or alter audience. Fixture subsets used earlier are not acceptable release input. Record iteration-three-verification.md section 5.40.

**Acceptance Criteria:**

**Given** all 17 verified snapshots and credited media mappings/exception inventories,
**When** the iteration-three export stages a release,
**Then** bundleVersion 2 manifest contains exactly 2010-2026 with matching schema/snapshot/source timestamps, audit/lifecycle/window metadata and same-release media,
**And** required metadata is sanitized, export time remains separate from source time and local refresh/build remains available.

**Given** one missing/unverified year, malformed input, mixed generation, corrupt file or invalid media provenance,
**When** export or loading is attempted,
**Then** validation fails without implicit downloading, fixtures substituted for real snapshots or partial manifest promotion,
**And** previous good release is retained and failures name the affected year/asset; data load never falls back to API.

**Given** a staged static build with external/API requests blocked,
**When** every offered year and referenced image/credits are loaded,
**Then** all analysis assets resolve from the configured same-origin immutable release and retain source freshness labels,
**And** isolated source builds from declared inputs, excludes server/raw envelopes/secrets/logs, preserves existing project identity and anyone-with-link audience configuration, and returned terminal deployment success is required for any later publication claim.

### Story 5.41: Verify the complete all-season exploration handoff

As a season-analysis user,
I want evidence that every requested year and image slot has been accounted for,
So that iteration acceptance is based on checked data and behavior.

**Requirements:** I3-FR-1..9; FR-1..9; NFR-1..7; UX-DR1/2/3/4/7/8/9/11/12; AD-1..13.

**Dependencies:** 5.40; earlier Epic 5 stories; 4.1 required only for full-iteration CAP-1 signoff.

**Scope and evidence:** Use iteration-three-verification.md as final integration index and retain all per-year data/media reports. Run existing type/unit/component/browser and local/hosted checks appropriate to changed behavior; add meaningful new-year/window/migration regressions. Publication is excluded; deployment acceptance is conditional on separate authorization.

**Acceptance Criteria:**

**Given** all year reports, staged bundle and local application,
**When** the verification matrix is reconciled,
**Then** 17/17 years have individually checked data, canonical rosters, lifecycle/windows and usable analysis; 17/17 media inventories reconcile actual/exception denominators,
**And** no year is silently omitted, old release evidence is not substituted for new checks and a failed audit keeps full acceptance open.

**Given** local/bundled regression scenarios and ongoing/historical fixtures,
**When** end-to-end checks cover standings, progress, pair summaries, refresh and credits,
**Then** official scoring, fractional adjustments, sprint/no-sprint, penalties, team changes, missing participants, unknown statuses, zero-GP, cancelled/unknown lifecycle, pagination failure, stale responses and logo failures meet their recorded contracts,
**And** keyboard/table and desktop/narrow/200% outcomes and source timestamps are evidenced; blocked external/API checks cover all hosted years.

**Given** remaining investigated media exceptions or blocked coverage checks,
**When** the final acceptance report is produced,
**Then** exceptions and failures remain explicit with user review required, and iteration acceptance is not falsely marked complete,
**And** no data gap is zero-filled or scope reduced; publication remains unperformed unless separately authorized and any eventual release retains existing Site identity/audience.

### Epic 5 completion boundary

Stories 5.6-5.22 cover every year exactly once for data; Stories 5.23-5.39 cover every year exactly once for media. Year acquisition can finish with investigated media exceptions, but final exception acceptance remains open until user review. Full CAP-2 acceptance requires all usable verified data, full inventories, successful release validation and acknowledged exceptions; no story grants permission to lower the target. Neither Epic 6 nor future publication is required to verify Epic 5's local/bundled release candidate.

## Epic 6: Select matching Progress series together

Yannick selects every matching driver or constructor once and keeps one coherent selected set across controls, chart, evidence table and Back. These stories can use approved 0.2 data independently of Epic 5, then consume the same contracts on expanded-data integration.

### Story 6.1: Add all current search matches to Progress

As a season-analysis user,
I want one action to add every matching entity while retaining my other choices,
So that I can compare a whole filtered field without repeated clicks.

**Requirements:** I3-FR-10/11; FR-4/5; UX-DR5/6/9/11/12; NFR-1/2/3; AD-6/14.

**Dependencies:** 0.2 baseline; no Epic 5 dependency.

**Scope and evidence:** Extend existing Progress category selection with one pure shared matching/set routine and native Select all. Use full canonical list, not virtualized DOM entries. Include focus/count announcements and focused semantic tests; evidence iteration-three-verification.md section 6.1.

**Acceptance Criteria:**

**Given** active Drivers or Constructors, a search and selected nonmatches,
**When** Select all is activated by keyboard or pointer,
**Then** all case-insensitive name-substring matches from the full active-season/category list are unioned once with existing IDs,
**And** selected nonmatches stay selected and search alone never removes series from chart/table.

**Given** empty search, no matches or repeated Select all,
**When** the action runs,
**Then** empty search matches all and no-match/repeated actions preserve the same set without duplicate IDs,
**And** remove-one affects only its ID, Clear selection empties all active-category selections including nonmatches and the other category set is retained.

**Given** normal selections and an effective or no-op action,
**When** the controls update,
**Then** chart, table, selection controls and match/selected counts consume the same selected set with no cap,
**And** focus remains at the action and concise polite announcements explain resulting counts including no-change states.

### Story 6.2: Restore matching selections through URL and navigation

As a season-analysis user,
I want my complete Progress selection to survive navigation and restore through Back,
So that the graph and evidence never disagree about my choices.

**Requirements:** I3-FR-11/12/13; FR-9; UX-DR6/9/10/12; NFR-2/3/5; AD-5/6/14.

**Dependencies:** 6.1; baseline snapshots suffice.

**Scope and evidence:** Use existing graphDrivers/graphConstructors URL keys and navigation/state owner. Serialize deterministically and guard action context; do not add a second selection store. Verify with browser navigation and rapid switching fixtures.

**Acceptance Criteria:**

**Given** effective Select all/remove-one/Clear actions or no-op repeats,
**When** URL state is updated and Back/Forward is used,
**Then** each effective action adds one history entry and no-op adds none; controls/chart/table restore together,
**And** explicit graph keys override legacy entity, clearing removes active key plus legacy entity and absent keys decode empty rather than defaulting.

**Given** decoded invalid IDs, season/category changes or a pending old-snapshot action,
**When** the active context changes,
**Then** valid IDs are retained in their category, invalid IDs are discarded with announcement and legacy entity/comparison A/B reset on year change,
**And** old season/category/snapshot actions cannot commit, search alone changes no selection and category sets remain isolated.

**Given** a rejected refresh or a newer valid snapshot,
**When** selection is reconciled,
**Then** failure retains the selected set and good source timestamp while success retains still-valid IDs and announces removals,
**And** no competing URL/table/chart state or delayed manifest update can silently replace the current selection.

### Story 6.3: Inspect every selected series accessibly

As a season-analysis user,
I want all selected entities to remain readable and inspectable together,
So that Select all remains useful on dense fields and small screens.

**Requirements:** I3-FR-10..13; FR-4/5; UX-DR5/9/10/11/12; NFR-1/2/3/4/7; AD-1/6/10/14.

**Dependencies:** 6.1, 6.2; no future story; expanded-year smoke checks run after Epic 5 when available.

**Scope and evidence:** Exercise full driver and constructor fields, named styles, keyboard/pointer details and semantic tables at desktop/narrow/200% zoom. Improve rendering/scroll regions as needed without imposing caps or silently dropping names; no new palette decision or arbitrary performance threshold.

**Acceptance Criteria:**

**Given** Select all includes every active-category entity, including off-screen matches,
**When** the chart and evidence table render and are inspected,
**Then** all IDs/names and corresponding rows/values remain available with stable distinguishable labels/styles and keyboard/pointer inspection,
**And** virtualization may optimize rendering but never reduce the selected set; rank direction, missing gaps, GP/sprint distinction and units remain unchanged.

**Given** narrow viewport or 200% zoom with many selected controls/series,
**When** the user searches, clears, removes one and restores via Back,
**Then** controls wrap, intended local scrolling is usable, focus is visible and tables preserve full semantic evidence,
**And** no page-wide clipping, color-only identity, hidden selection cap or tooltip-only access blocks inspection.

**Given** both categories, empty/no-match/repeated actions and local/bundled modes,
**When** EXPERIENCE flow 9 is verified using baseline data and later expanded-data integration,
**Then** one selected set agrees across URL/controls/graph/table and all recorded selection edge cases pass,
**And** evidence names the actual seasons and commands used, blocked external/API hosted verification remains possible and no new-year acquisition/publication is triggered.

## Story-level traceability and delivery checks

| Requirements | Stories |
| --- | --- |
| CAP-1 / I3-FR-1 | 4.1; 5.41 final integration |
| I3-FR-2/3 | 5.1/5.2/5.4; 5.6-5.22 individual audits |
| I3-FR-4/5/6 | 5.1/5.3/5.4; every year audit; 5.41 |
| I3-FR-7/8 | 5.5; 5.23-5.39 individual media; 5.41 |
| I3-FR-9 | 5.1/5.40/5.41 |
| I3-FR-10/11 | 6.1/6.2/6.3 |
| I3-FR-12/13 | 6.2/6.3 |
| FR-1..9 | 5.2/5.3/5.4, per-year audits and 5.41; 4.1/6.1-6.3 relevant regressions |
| UX-DR1/2 | 5.4; individual audits; 5.41 |
| UX-DR3 | 4.1; 5.5; individual media; 5.41 |
| UX-DR4 | 5.5; individual media; 5.40/5.41 |
| UX-DR5/6 | 6.1/6.2/6.3 |
| UX-DR7/8 | 5.3/5.4; individual audits; 5.41 |
| UX-DR9/10 | 4.1 image failures; 5.2/5.4; 6.1/6.2/6.3 |
| UX-DR11/12 | 4.1; 5.4/5.5; individual media; 5.41; 6.3 |
| NFR-1 | 5.1/5.2/5.3, individual audits, 5.41; 6.3 regressions |
| NFR-2/3 | 4.1, 5.4/5.5, media checks, 5.41, 6.1-6.3 |
| NFR-4 | 4.1, 5.4/5.40/5.41, 6.3 |
| NFR-5 | 5.1/5.2, audits, 5.40/5.41, 6.2 |
| NFR-6 | 5.40/5.41 release preparation; publication separately authorized |
| NFR-7 | Every story's named iteration-three evidence; 5.41 integration index |

The batch contains 45 stories: one in Epic 4, 41 in Epic 5 and three in Epic 6. The repeated year stories deliberately bound source research and media acquisition to one season per agent session; shared rules/tooling are implemented once. No story requires another year's audit/media work except full all-year release completion. Planning status never substitutes for data, imagery, runtime acceptance or publication evidence. Existing sprint-status.yaml is unchanged because the requested follow-up is a readiness assessment, not tracking generation.

## Final validation ? 2026-10-30

All requirement, architecture, story-quality, epic-value and dependency checks pass. The user explicitly requested batch generation, replacing intermediate story/epic and final continuation pauses; final planning status does not imply individual implementation acceptance. There are 45 unique stories and 138 Given/When/Then/And scenarios, with all 17 years covered once for data and once for media. Brownfield setup retains the existing stack; no starter or upfront database work is needed. Shared contract/migration work is confined to the prerequisite stories that need it. No forward story dependencies or uncovered UX-DRs remain.

Implementation readiness is **PASS**, documented in [implementation-readiness-iteration-three.md](implementation-readiness-iteration-three.md). Data/provider verification, imagery acquisition/exception review and runtime release checks remain required implementation gates. This workflow changes no application code, source data, assets, publication or existing sprint tracking. Next generate sprint tracking for these epics while retaining historical statuses, then invoke bmad-build for the selected story.
