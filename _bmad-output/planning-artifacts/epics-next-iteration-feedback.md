---
title: F1 Dashboard next-iteration feedback
status: final
stepsCompleted: [1, 2, 3, 4]
created: 2026-11-02
inputDocuments:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - prds/prd-bmad-playground-2026-10-29/prd.md
  - ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
---

# F1 Dashboard — next-iteration epic breakdown

## Overview

Incremental brownfield work for the six approved capabilities and eight confirmed feedback items. Earlier epics 1–6 remain historical and retain their status. This iteration starts at Epic 7. The current spec overrides earlier conflicting identity and year-retention rules; retain all other behavior. No new stack, schema or deployment is planned.

## Requirements Inventory

### Functional Requirements

- FR1 (CAP-1): Standings displays a valid team logo or a readable team-name fallback, never both visibly, in driver and constructor rows.
- FR2 (CAP-2): Refresh verified 2026 evidence through the implementation-verified latest completed GP, with explicit cutoff, source freshness, lag and matching local/bundled payloads.
- FR3 (CAP-3): Inline wrapping driver checkboxes are grouped by team; team checkboxes flow inline and wrap. Preserve complete unique selection, search and additive Select all.
- FR4 (CAP-4): Exact Progress and Compare headings/guidance precede controls in visual and reading order; season copy is dynamic.
- FR5 (CAP-5): An explicit year change clears both graph sets, legacy entity and Compare A/B atomically, even for shared IDs; history restoration and same-year refresh retain their distinct contracts.
- FR6 (CAP-6): One compact portrait/central six-row scorecard/portrait layout shows each label and A/B value once, with meaningful tracks and at most one aggregate score.
- Retained PRD FR-1..9: single-season context, official standings, driver/constructor metrics, GP/Sprint distinctions, first/latest teammates, aligned evidence, explicit local refresh and last-good failure retention. These are regression obligations rather than new epics.

### NonFunctional Requirements

- NFR1: Keyboard-operable, labeled controls; accessible logo identity once; favorable-value cues independent of color; readable narrow-screen and 200% layouts.
- NFR2: Missing, zero, unavailable, unheld, cancelled and not-applicable remain distinct. Six equal votes, official points, qualifying rank and completed-GP windows remain unchanged.
- NFR3: Preserve canonical identity, unique series, URL coherence, history and stale-action guards across season/category/snapshot/navigation contexts.
- NFR4: Preserve atomic local commits and immutable bundled release boundaries. Failed export does not roll back a successful local commit; hosted code never falls back to live APIs.

### Additional Requirements

- AD-1/10: Shared pure selectors/comparison own metrics and winners; views only present the resulting model.
- AD-11: Shared ConstructorIdentity owns an explicit Standings presentation mode, failure reset and accessible fallback.
- AD-13: Existing audited ingestion/service commits local data; exporter copies the same validated payload. Saved-page audit alone does not acquire fresh evidence. Record authoritative cutoff/source links during build.
- AD-14: Shared progress-model owns team projection; App owns year/history transactions and navigation generation. Multi-team appearances share one driver ID; unassigned drivers remain selectable.
- Keep installed dependencies, all-season support, accepted media exceptions, bottom disclosures and actual point labels. Publication remains a separate action.

### UX Design Requirements

- UX-DR1: Logo-only valid standings identity; name-only missing/unmapped/failed identity; no broken or empty badge.
- UX-DR2: Inline, wrapping labeled driver checkboxes in named team groups; inline wrapping team field; synchronized multi-team appearances.
- UX-DR3: Progress copy above search/actions/options: “Choose your focus” and “Choose at least one driver to explore season evolution.” Team mode uses “Choose at least one team to explore season evolution.”
- UX-DR4: Compare copy above selectors: “Choose two drivers from {season}” and “Start with a driver to select their latest teammate automatically.”
- UX-DR5: Year reset shows empty guidance without auto-refill; explicit A choice retains latest-teammate default.
- UX-DR6: Portraits frame one central six-row scorecard, labels centered, A/B values once, tracks between; ranks use markers and undefined proportions use neutral tracks. Preserve ticks, reasons, coverage and A/B identity at narrow/200% sizes.
- UX-DR7: Freshness/cutoff and lag use existing header, inline captions and bottom disclosures; no unsupported finality claim.

## FR Coverage Map

| Requirement | Epic | Stories |
|---|---|---|
| FR1 / CAP-1 / UX-DR1 | 7 | 7.1 |
| FR2 / CAP-2 / UX-DR7 | 8 | 8.1, 8.2 |
| FR3 / CAP-3 / UX-DR2 | 7 | 7.3 |
| FR4 / CAP-4 / UX-DR3/4 | 7 | 7.3, 7.4 |
| FR5 / CAP-5 / UX-DR5 | 7 | 7.2 |
| FR6 / CAP-6 / UX-DR6 | 7 | 7.4 |
| NFR1/2/3 | 7, 8 | Applicable acceptance and regression checks in every story |
| NFR4 | 8 | 8.1, 8.2 |

## Epic List

### Epic 7: Explore seasons with clear selection and compact comparison

Yannick recognizes teams without duplicate labels, chooses grouped options, starts fresh after a year change and reads one compact comparison. Covers FR1/3/4/5/6. Works against the existing validated snapshots without Epic 8.

### Epic 8: Analyze the latest verified 2026 race evidence

Yannick can inspect current 2026 results and truthful freshness/coverage in both local and prepared bundled editions. Covers FR2. Uses the existing UI and data pipeline without Epic 7; 8.2 depends only on 8.1. No publication included.

## Epic 7: Explore seasons with clear selection and compact comparison

Deliver the approved interaction and presentation changes against existing validated data.

### Story 7.1: Recognize teams with one standings identity

As Yannick,
I want a team logo when available and a team name otherwise,
So that standings remain clear without duplicate labels.

**Requirements:** FR1, UX-DR1, NFR1; AD-1/11. **Dependencies:** None.

**Acceptance Criteria:**

1. **Given** a usable season-mapped team logo, **When** either standings category renders, **Then** the logo is the only visible team identity **And** its accessible name identifies the team once.
2. **Given** missing/unmapped/failed logos, **When** identities render or an image fails, **Then** the readable team name appears alone **And** there is no broken image, empty badge or duplicate accessible name.
3. **Given** a previously failed logo, **When** canonical identity or season changes, **Then** failure state is reconciled for the new image **And** other surfaces retain their existing named identities.
4. **Given** keyboard, narrow and 200% inspection, **When** both standings categories are used, **Then** identity and row actions remain readable and operable.

**Implementation boundary:** Shared ConstructorIdentity in app/client/Identity.tsx, mappings in media.ts and standings callers; explicit presentation mode rather than view-specific fallback logic. Preserve provenance/coverage counting and other affiliations.

**Verification:** Target existing media tests/browser coverage for both standings categories, forced image failure and identity change. Do not count text fallback as acquired imagery.

### Story 7.2: Start fresh when changing season

As Yannick,
I want year changes to clear my current selections,
So that I choose deliberately for each season.

**Requirements:** FR5, UX-DR5, NFR1/3; AD-4/6/14. **Dependencies:** None.

**Acceptance Criteria:**

1. **Given** both Progress sets, legacy entity and Compare A/B are populated, **When** a different year is explicitly chosen, **Then** season and all five selection fields change coherently in one history transaction **And** shared valid IDs are cleared, with no stale analysis or default refill.
2. **Given** an empty year-switched view, **When** the year selector returns to the previous year, **Then** selections remain empty **And** selecting A explicitly still defaults B using the existing latest-teammate policy.
3. **Given** historical entries, **When** Back/Forward restores an entry, **Then** season and its valid selections restore together **And** invalid IDs are removed with an announcement. Same-year navigation/refresh preserves selection; failed refresh retains matching data/state.
4. **Given** delayed actions including a year-away-and-back cycle with the same cached snapshot, **When** callbacks arrive from an obsolete navigation context, **Then** they cannot restore old choices or add a history entry.

**Implementation boundary:** App.tsx owns explicit-year versus history transitions, canonical URL serialization and navigation generation; keep selection routines shared in progress-model.ts. Preserve current category isolation, no-op history and legacy-link precedence.

**Verification:** Extend selection/navigation scenarios for both categories, shared IDs, rapid year roundtrip, A/B and legacy URL state, explicit empty URLs, Back/Forward and same-year refresh. Assert controls, URL, graph and evidence agree.

### Story 7.3: Choose grouped progress options inline

As Yannick,
I want wrapping driver checkboxes grouped by team and inline team options,
So that I can choose my focus without scanning a vertical list.

**Requirements:** FR3, Progress part of FR4, UX-DR2/3, NFR1/3; AD-1/2/14. **Dependencies:** None; integrate after 7.2 when sharing App/navigation code.

**Acceptance Criteria:**

1. **Given** Drivers mode, **When** options render, **Then** labeled checkboxes flow inline within readable accessible team groups and wrap **And** memberships come from selected-season canonical evidence. Drivers without affiliations remain selectable in a fallback group.
2. **Given** a driver with multiple affiliations, **When** any appearance is toggled, **Then** all appearances share checked state **And** counts, matching, Select all, graph and evidence count the canonical ID once.
3. **Given** Teams mode, **When** options render, **Then** team checkboxes flow inline and wrap without a selection cap.
4. **Given** either mode, **When** selection controls render, **Then** “Choose your focus” and “Choose at least one driver to explore season evolution.” appear before search/actions/options visually and in reading order **And** team mode substitutes “team”.
5. **Given** filtered names and selected nonmatches, **When** Select all, toggle, remove-one or Clear selection is used, **Then** existing additive/full-match semantics persist **And** selection, URL, counts, graph and table agree; search alone does not remove selected series.
6. **Given** keyboard/pointer input, narrow screens or 200% zoom, **When** the entire field is inspected, **Then** every option/name remains reachable with visible focus and correct group labels **And** no selected series disappears to fit.

**Implementation boundary:** Shared pure projection in app/shared/progress-model.ts, consumed by Progress.tsx and progress.css. No second grouped selection store; freeze one projection shape before UI wiring. Preserve metric values and bottom disclosures.

**Verification:** Add semantic cases for multi-team membership, unassigned identity, no matches, additive filtering and complete-field wrap/keyboard inspection. Reuse existing progress model/browser fixtures.

### Story 7.4: Read one compact driver comparison

As Yannick,
I want portraits framing one compact comparison scorecard,
So that I can compare drivers without repeated scores.

**Requirements:** FR6, Compare part of FR4, UX-DR4/6, NFR1/2; AD-1/4/10/11. **Dependencies:** None; coordinate App.tsx integration with 7.2.

**Acceptance Criteria:**

1. **Given** selected season, **When** Compare renders, **Then** “Choose two drivers from {season}” and “Start with a driver to select their latest teammate automatically.” precede selectors visually and in reading order.
2. **Given** a pair, **When** summary renders, **Then** A/B portraits frame one central six-row scorecard **And** each row has one centered label, one value per driver and a track between them. No numeric copies appear inside tracks or redundant summary cards; any aggregate score appears once.
3. **Given** existing shared outcomes, **When** all six metrics render, **Then** metric identity, six equal votes, official points, coverage/reasons, favorable ticks and ties are unchanged **And** qualifying 2/grid 7 remains qualifying 2; reference numbers/branding are never fixtures of product behavior.
4. **Given** comparable nonnegative counts/points with positive sum, **When** track renders, **Then** proportions agree with values. **Given** ranks/nonproportional values, **Then** direction/position markers are used. **Given** zero/zero, negative or unavailable values, **Then** neutral tracks and explicit text avoid invented magnitude. Tracks never calculate winners; lower-is-better metrics are labeled.
5. **Given** no pair, no teammate, ties, unavailable data or missing photos, **When** Compare renders, **Then** existing empty/fallback explanations remain **And** keyboard, screen-reader, narrow and 200% inspection retain identities, A/B ordering, six rows and evidence access.

**Implementation boundary:** ComparisonSummary.tsx and Compare shell/styles consume app/shared/comparison.ts unchanged as scoring owner. Keep round evidence separate; raw evidence may repeat values for inspection. Match written DESIGN/EXPERIENCE composition without copying source branding.

**Verification:** Existing comparison fixtures plus duplicate-summary assertions, exact dynamic guidance, qualifying/grid distinction, ties, missing/zero/negative tracks and responsive visual inspection.

## Epic 8: Analyze the latest verified 2026 race evidence

Refresh authoritative evidence through the latest completed GP and prepare an internally consistent static bundle.

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

### Story 8.2: Prepare matching local and bundled season evidence

As Yannick,
I want the prepared bundled edition to contain the verified local 2026 evidence,
So that both editions support the same analysis cutoff.

**Requirements:** FR2, UX-DR7, NFR2/4; AD-5/9/12/13. **Dependencies:** 8.1.

**Acceptance Criteria:**

1. **Given** the verified local snapshot from 8.1, **When** the existing all-season exporter stages a release, **Then** the 2026 payload and manifest agree on snapshot ID, window/cutoff, audit provenance and source timestamps **And** other required verified seasons and credited media remain available.
2. **Given** refreshed local data and a failed export, **When** staging rejects input, **Then** the previous bundle remains intact **And** the successful local commit is not rolled back.
3. **Given** a prepared bundled build with external requests blocked, **When** all three surfaces load and the 2026 cutoff is inspected, **Then** evidence matches the local payload **And** static retries never fall back to live APIs; export time is distinct from source time.
4. **Given** completed story checks, **When** the handoff is prepared, **Then** it records source cutoff, snapshot/release identity, relevant commands/results and remaining gaps **And** no publication is claimed or performed.

**Implementation boundary:** Existing scripts/export-site.mjs, shared bundle validator and bundled data adapter; stage a complete immutable all-season release. No new hosting identity/audience or deployment operation.

**Verification:** Existing exporter failure/identity tests and local/bundled builds; targeted season evidence and static release browser checks. Final integration exercises all six capabilities in both modes if Epic 7 has landed; otherwise validate current UI and repeat only affected integration when Epic 7 lands.

## Build sequencing and handoff

Default sequence: 7.1 → 7.2 → 7.3 → 7.4 → 8.1 → 8.2. Only 8.2 has a hard story dependency. This conservative sequence avoids overlapping App/media edits; no parallel build is assumed. Each UI story is demonstrable using existing validated data and must pass its own acceptance before completion.

Use the story-specific files in ../implementation-artifacts/ for build inputs. Read current SPEC plus every companion first. Inspect existing worktree changes and preserve planning edits. Appropriate baseline and final commands are npm run check, npm test, relevant Playwright cases, npm run build and the existing all-season bundled build path; do not acquire data or run builds during planning. Story 8.1 must verify fresh sources during implementation. Final integration records real outcomes; planning readiness is not runtime completion.
