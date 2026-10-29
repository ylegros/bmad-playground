---
status: final
scope: iteration-two
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
requirementsStatus: confirmed-user-feedback
epicDesignStatus: approved
storyCreationStatus: approved-corrections
validationStatus: passed
workflowStatus: complete
validationOpenChecks: []
correctionImplementationStatus: not-started
handoffDependencies: []
storyApprovalMode: batch-review-requested-by-user
inputDocuments:
  - _bmad-output/specs/spec-iteration-two-feedback/SPEC.md
  - _bmad-output/specs/spec-iteration-two-feedback/acceptance-corrections.md
  - _bmad-output/implementation-artifacts/spec-second-iteration.md
  - _bmad-output/planning-artifacts/prds/prd-bmad-playground-2026-10-29/prd.md
  - _bmad-output/planning-artifacts/prds/prd-bmad-playground-2026-10-29/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/iteration-two-design.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/mockups/iteration-two.html
---

# bmad-playground — Iteration Two Epic Breakdown

## Overview

### Current handoff — accepted review corrections

Update the existing iteration within the same sprint: maximize actual constructor logos and driver photographs, replace best GP starting grid with best GP qualifying rank, and remove repeated visible “Better” labels while retaining ticks, highlights and accessible descriptions. Stories 1.1–1.3 and 3.3–3.4 are revised below; Epic 2 and Stories 3.1–3.2 retain their existing behavior and regression obligations.

The [accepted correction spec](../specs/spec-iteration-two-feedback/SPEC.md), [acceptance companion](../specs/spec-iteration-two-feedback/acceptance-corrections.md) and [synchronized iteration-two spec](../implementation-artifacts/spec-second-iteration.md) govern the corrected requirements. Architecture and UX are now aligned; final story validation passed with no open handoff checks. Original spec notes about pending handoff alignment describe the earlier stage and are resolved by the revalidation record below. These document updates do not authorize asset acquisition, implementation, rebuild or publication. Correction implementation and user acceptance remain open.

Retain the three approved user-value epics and all ten story IDs. The original release is implemented and published with anyone-with-link access; its original planning approvals and validation are historical evidence recorded at the end of this document. Prior release tests do not validate the corrections.

The unchanged baseline extends the Pit Wall dashboard with comparison summaries, selectable season graphs, attributed imagery and bundled-data publication. Existing PRD requirements remain regression obligations, not instructions to rebuild version 0.1. The UX mockup is illustrative, not data evidence.

## Requirements Inventory

### Functional Requirements

Inherited requirements retain their PRD IDs; iteration-two additions start at FR-10.

FR-1: Select one supported season consistently across surfaces; restrict iteration two to verified 2010 and 2021, defaulting to the latest verified supported season.
FR-2: Preserve official driver standings with rank, driver, season-relative constructor affiliations and points.
FR-3: Preserve official constructor standings with rank, constructor and points.
FR-4: Preserve chronological driver GP qualifying, GP results, separate sprint results/points, round-earned points and official cumulative points.
FR-5: Preserve constructor round-earned points, official cumulative points and official championship position, including sprint points where applicable.
FR-6: Compare any two selected-season drivers; retain latest-teammate defaults, first/latest shared-event rules and initial-teammate standings annotations.
FR-7: Align both drivers against the season schedule; preserve explicit unavailable results, genuine zero values, source classifications and statuses.
FR-8: Retain explicit local refresh, with no polling or automatic updates. Bundled mode exposes neither refresh nor API setup.
FR-9: Preserve loading, empty, error, retry and retained-snapshot states. Local failed refresh retains data and timestamp; bundled failure retries bundled loading only.
FR-10: Display six fixed summary rows: GP race head-to-head, GP qualifying head-to-head, official championship points, best GP finish, best GP qualifying rank and GP DNFs. Qualifying rank uses authoritative GP qualifying classification before starting-grid penalties.
FR-11: Declare the overall winner by equal category votes: higher head-to-head counts/points and lower best finish/qualifying rank/DNF counts win. Tied/unavailable categories award no vote; equal scores draw; no comparable categories means insufficient data. Championship rank and winning margins do not affect the verdict.
FR-12: Show score, comparable-category count including ties, tied/unavailable counts, reasons, eligible rounds, tied rounds, excluded rounds and relevant sample sizes. Zero eligible head-to-head rounds means unavailable. Incomplete season-wide best/count coverage remains unavailable. Invalid pairs show guidance without a verdict.
FR-13: Mark favorable comparable round values with a tick and highlight, without repeated visible “Better” text. Lower qualifying/classification positions and higher points are favorable; preserve descriptive screen-reader text naming driver, measure and direction. Ties/unavailable values have no favorable marker or highlight. Compare GP and sprint independently and retain numeric source classification with status.
FR-14: Provide season-evolution graphs with separately selectable driver/constructor categories, multiple entities, valid metric choices and cumulative-points default. Empty selections show guidance; compatible selections survive metric changes.
FR-15: Use the same pure selector results for chronological graph and matching evidence table. Label season, round/event, entities, metric and units; show gaps for missing values, rank 1 at top and distinguish sprint rankings from GP rankings.
FR-16: Support keyboard and pointer round inspection with a persistent detail panel and complete semantic table equivalent.
FR-17: Maximize actual verified driver photographs and season-appropriate constructor logos for every identity represented in 2010/2021. Bundle assets locally with explicit identity/season mappings, provenance and attribution. Report per-season logo/photo counts against total identities, separately from fallbacks; document individually investigated exceptions with attempted sources and specific blockers. Generic “not vetted” reasons and fallback-only tests do not establish coverage acceptance.
FR-18: Support an explicit bundled build alongside the retained local Node/API edition. Export exactly the verified 2010/2021 snapshot payloads and media as one validated immutable release; hosted analysis never falls back to an API.
FR-19: Label bundled mode and selected-season source snapshot date/time/timezone, distinct from export/deployment time. Updating local snapshots requires a new export/publication to update the Site.
FR-20: Prepare sanitized isolated Site source and, when rebuilding/publication is authorized, update the existing Site while preserving its returned identity and current anyone-with-link audience. Record terminal deployment result, shared URL and returned audience evidence; do not create a replacement Site or revert access to owner-private.
FR-21: Preserve URL and browser Back navigation, extending state to graph entities/metric; validate selections on season/category changes and prevent obsolete responses from changing the active analysis.

### NonFunctional Requirements

NFR-1: Preserve official championship authority, fractional points, adjustments, canonical identities, season-relative affiliations, missing-versus-zero and GP/sprint separation. Never derive championship totals/ranks from result positions or incomplete session sums.
NFR-2: Preserve Pit Wall tokens, system fonts, semantic accessible tables, visible labels/units and non-color encodings. Target the existing WCAG 2.2 AA floor, visible focus, keyboard access, concise announcements and reduced motion.
NFR-3: Maintain mobile usability, 200% zoom and narrow reflow; only dense plots/tables scroll locally. Keep full names, statuses, affiliations and controls available.
NFR-4: Hosted product code makes no runtime third-party data, image or font calls and requires no Node API, writable cache, service worker or new account system. Bundled hosting does not guarantee disconnected browsing.
NFR-5: Validate export schema, coverage, season and snapshot identity before publishing; never mix release versions. Reject malformed/missing inputs without implicit downloads or fixture substitution.
NFR-6: Preserve local atomic refresh, snapshot retention, per-season operation generations, response-season checks and latest-operation commitment in both data modes.
NFR-7: Preserve the user-authorized anyone-with-link audience and exclude credentials, logs, raw cache envelopes, local Git metadata and unrelated files from the hosted source/artifact. Version 0.1 remains recoverable through its existing annotated tag.
NFR-8: Verify domain edge cases with deterministic fixtures, browser regressions and hosted network-blocking checks. Record build, unit, end-to-end, export and terminal deployment evidence without claiming planned checks passed.

### Additional Requirements

AR-1: Extend the installed React/TypeScript/Vite application and native CSS; no greenfield starter or dependency upgrade is required. Shared domain logic must remain independent of UI, HTTP and storage.
AR-2: Centralize directions, availability, ties, summary votes and explicit retirement-status allowlist in `app/shared/comparison.ts`. Freeze fixtures for classified retirement, unknown status, missing result and substitute driver before summary implementation. DNS, disqualification, finished and lapped finishes are not DNFs; unknown statuses make DNF totals unavailable.
AR-3: Retain schema v1 and use its authoritative GP qualifying classification for best GP qualifying rank. Lower is better; qualifying rank 2 followed by penalized grid 7 remains qualifying rank 2. Replace the grid row and its schema-unavailable explanation; do not add grid fields or infer qualifying from grid/race results. Season-wide best qualifying requires authoritative qualifying records for every scheduled GP; otherwise explain qualifying coverage and sample sizes. Keep GP qualifying separate from sprint rankings.
AR-4: Under v1, season-wide best finish and DNF counts require authoritative driver records for every scheduled GP. Absence does not prove nonparticipation; replacement-driver gaps remain unavailable. Numeric classification never overrides recognized retirement status.
AR-5: Define shared `DataSource` and `BundledManifest` contracts and runtime validation before exporter/loader work. Manifest/snapshot methods return domain values; only the local adapter unwraps API envelopes. Refresh capability exists only in local mode.
AR-6: Bundled manifest is direct JSON `{bundleVersion: 1, exportedAt, seasons: [...]}`. Season entries extend support metadata with snapshotId, schemaVersion, refreshedAt and relative assetPath. Resolve against configured build base and check loaded payload against manifest identity/version.
AR-7: Export validated payloads from existing cache envelopes through `scripts/export-site.mjs`, reusing server validation. Stage and replace one complete release; use release-specific paths or equivalent cache policy. Preserve source timestamps and record export time separately.
AR-8: Views use `app/client/data-source.ts`, never construct source URLs or select adapters. Invalid build configuration fails the build. Bundled read failures cannot switch to local mode.
AR-9: Store explicit identity/season/constructor mappings in `app/client/media.ts`, files under `public/media/` and provenance in `public/media/credits.json`. Export data and required media together. Record a snapshot-derived per-season imagery inventory, actual-image/fallback counts, individually investigated exceptions and visual-check outcomes in `_bmad-output/implementation-artifacts/second-iteration-media-coverage.md`.
AR-10: Preserve original local build/server. Isolated Site checkout default `npm run build` must run validated bundled export and hosted build; `.openai/hosting.json` stores returned project_id and `static.directory: dist`.
AR-11: Follow installed Sites packaging/source-helper contracts during implementation. Register once, persist identity immediately, synchronize exact source, package matching commit/archive, resume pending deployments and wait for terminal success. Do not invent IDs, duplicate registration after uncertain outcomes or change audience.
AR-12: Retain local Jolpica adapter, fixed upstream base, input validation, pagination, bounded retries/rate handling and atomic snapshot service. Exporter is not another upstream adapter; no new season coverage is authorized.
AR-13: Record operation and verification guidance in README and `_bmad-output/implementation-artifacts/second-iteration-verification.md`. Required checks include local build, unit/regression tests, browser tests, export rejection cases, imagery coverage/visual evidence and bundled behavior with external requests blocked. New correction evidence must be distinguished from original release evidence; an authorized publication must preserve anyone-with-link access.

### UX Design Requirements

UX-DR1: Render comparison as two stable A/B identities flanking a central dark scorecard on desktop; show names, selected season and each driver's own season-relative affiliations/marks. A shared mark is valid only for matching identities.
UX-DR2: Keep all six rows visible with labeled left/right values, verdict, equal-weight explanation, comparable/tied/unavailable counts and row-level evidence/reasons. Favorable values use a tick/highlight without visible “Better” text; retain descriptive screen-reader text. Keep “Tied” and “Unavailable” meanings explicit.
UX-DR3: Use proportional bars only for comparable nonnegative head-to-head counts or points with positive sum, including numeric segment labels and accessible equivalents. Zero/zero, negative totals and missing values use text; rank rows use better-value markers and DNF rows use text/markers.
UX-DR4: Below 1024px place paired identity cards above the scorecard; below 768px stack selectors and full-width metric rows while keeping A left/B right and readable labels.
UX-DR5: Use subtle series-colored cell edges, bold values and a visible tick/highlight without repeated “Better” text in summary and detailed comparison. Screen-reader wording identifies driver, metric and favorable direction; the tick is decorative to assistive technology. Retain headers/status text and a legend explaining pair-relative comparison; never call a favorable pair value a race winner. Ties/unavailable values receive no favorable tick/highlight.
UX-DR6: Progress controls follow category, entity picker, metric order. Use a searchable labeled checkbox selection with visible removable names and Clear selection; no arbitrary entity cap. Keep category-specific choices separate and show explicit empty-selection guidance.
UX-DR7: Charts label season/metric/units, chronological round axis and full event names via inspection/table. Use straight unsmoothed segments, missing-data gaps and inverted rank axes; explain sprint inclusion for round/cumulative points.
UX-DR8: Use stable named series, first blue solid and second lilac dashed, with distinguishable additional dash/marker combinations and legend samples. Do not depend on team colors; crowded plots may scroll locally.
UX-DR9: Provide one focusable round-inspection control using Left/Right and Home/End with visible instructions. Pointer and keyboard update the same persistent round/event/value/status panel; announce intentional keyboard changes concisely without putting every point in Tab order.
UX-DR10: Place the matching semantic evidence table immediately after the graph with captions/scoped headers and every selected entity/round; no value depends on hover.
UX-DR11: Use consistent 4:5 photograph frames and contained historical team marks with reserved dimensions, adjacent full identity text and appropriate alt text. Inspect actual faces and logos for correct identity, historical suitability, legibility and crop/containment on desktop and narrow layouts. Missing mapping, unusable license or load failure retains named initials/team text, but fallback rendering does not count as acquired-image coverage.
UX-DR12: Provide a visible local Image credits link/disclosure containing source URL, creator, license, required attribution, applicable identity/season, portrait date or unknown, filename and crop notes. Explain date mismatch without implying selected-season photography; never substitute unrelated modern constructors.
UX-DR13: Hosted header reads bundled-data mode and selected-season source snapshot timestamp with timezone. Failure offers “Retry loading bundled data”; local edition retains refresh and retained-snapshot messaging. Image failure never blocks analysis.
UX-DR14: Retain Pit Wall colors, spacing, numeric typography, responsive navigation, semantic landmarks/skip link, 2px visible focus ring, practical 44px controls, verified contrast and reduced-motion behavior. Brand red remains action/navigation color; system fonts avoid external font requests.

### FR Coverage Map

| Requirement | Accountable epic | Coverage |
|---|---|---|
| FR-1 | 3 | Retain verified season selection in both modes; regression obligation for Epics 1–2. |
| FR-2 | 1 | Preserve driver standings and add season-relative team marks. |
| FR-3 | 1 | Preserve constructor standings and add historical identity marks. |
| FR-4 | 2 | Preserve driver metrics as graph/table selector inputs. |
| FR-5 | 2 | Preserve constructor points/rank metrics as graph/table selector inputs. |
| FR-6 | 1 | Preserve arbitrary pairs, teammate defaults and annotations. |
| FR-7 | 1 | Preserve aligned source values/statuses in detailed comparison. |
| FR-8 | 3 | Retain local refresh and remove refresh/setup from bundled mode. |
| FR-9 | 3 | Verify retained local data and mode-specific loading/retry states. |
| FR-10 | 1 | Six fixed summary rows, including best GP qualifying rank before grid penalties. |
| FR-11 | 1 | Equal category voting, draws and insufficient data. |
| FR-12 | 1 | Coverage evidence, counts, reasons and invalid-pair guidance. |
| FR-13 | 1 | Shared-policy accessible better-value cell highlights. |
| FR-14 | 2 | Category-specific multi-entity and metric selection. |
| FR-15 | 2 | Shared graph/table values, chronological labels, gaps and rank direction. |
| FR-16 | 2 | Keyboard/pointer inspection and complete table equivalent. |
| FR-17 | 1 | Maximized actual photographs/logos, measured per-season coverage, investigated exceptions and visual evidence. |
| FR-18 | 3 | Validated immutable bundled release and retained local edition. |
| FR-19 | 3 | Bundled-mode/source-date labels and publication update semantics. |
| FR-20 | 3 | Sanitized source and verified authorized update of the existing anyone-with-link Site. |
| FR-21 | 2, 3 | Epic 2 extends graph URL/Back selections; Epic 3 verifies both-mode navigation and stale-response protection. Epic 1 preserves comparison navigation. |

### Quality, Architecture and UX Coverage

| Epic | Quality obligations | Architecture requirements | UX requirements |
|---|---|---|---|
| 1 | NFR-1–3, NFR-8; local-media aspect of NFR-4 | AR-1–4, AR-9; comparison/media evidence under AR-13 | UX-DR1–5, UX-DR11–12, UX-DR14 |
| 2 | NFR-1–3, NFR-6, NFR-8 | AR-1; shared-selector and graph evidence under AR-13 | UX-DR6–10, UX-DR14 |
| 3 | NFR-1–8, including full integration regression | AR-5–8, AR-10–13; export AR-9 media with data | UX-DR13–14; verify UX-DR1–12 in hosted release |

Inherited behavior is tested where affected and again at release; this mapping does not authorize rebuilding the first iteration or expanding season coverage.

## Epic List

### Epic 1: Understand Who Leads a Driver Comparison and Why

Yannick can choose any valid driver pair, immediately read an evidence-backed six-category verdict and inspect better round values. Locally bundled portraits and historically mapped team marks make drivers and affiliations recognizable in comparison and standings, with accessible fallbacks and credits.

**FRs covered:** FR-2, FR-3, FR-6, FR-7, FR-10, FR-11, FR-12, FR-13, FR-17; preserve comparison behavior under FR-21.

**Implementation boundaries:** Extend the existing shared comparison/status policy with best GP qualifying rank and concise accessible markers. Retain schema v1, six equal votes, conservative coverage and existing teammate semantics. Maximize actual photographs/historical logos with measured coverage, investigated exceptions and visual checks; fallbacks remain resilience rather than acquisition completion. Deliver local comparison/standings corrections without requiring new graph or hosting work.

**Dependencies:** Existing version 0.1 only. No dependency on later epics.

### Epic 2: Explore Season Evolution Across Drivers or Constructors

Yannick can select multiple drivers or multiple constructors, choose a valid metric and follow their season chronologically through an accessible graph, keyboard/pointer inspection and matching numeric evidence. URL and Back navigation restore compatible graph selections.

**FRs covered:** FR-4, FR-5, FR-14, FR-15, FR-16, FR-21 (graph selection/navigation).

**Implementation boundaries:** Reuse existing pure progress selectors; keep driver/constructor scales and GP/sprint rankings distinct. Add category-aware selection, stable series styles, missing-value gaps, correct axes, persistent inspection and an immediately following table. Preserve existing local loading/refresh behavior and Pit Wall responsiveness.

**Dependencies:** Existing version 0.1 selectors/state. No dependency on Epic 1 media or comparison policy; no dependency on Epic 3. Recommended after Epic 1 to keep shared shell/CSS integration sequential.

### Epic 3: Share the Complete Dashboard with Bundled Season Data

Yannick can open and share the completed iteration through the existing anyone-with-link ChatGPT Site and analyze verified 2010/2021 data without runtime F1 API or external image requests. The Site clearly identifies its snapshot, while the local edition continues to support explicit refresh.

**FRs covered:** FR-1, FR-8, FR-9, FR-18, FR-19, FR-20, FR-21 (both-mode integration and response safety); hosted regression verification of FR-2–7 and FR-10–17.

**Implementation boundaries:** Retain shared adapter/manifest validation, immutable data/media export, mode-specific UI and local builds. Prepare corrected isolated source and, after rebuild/publication authorization, reuse the existing Site identity and anyone-with-link audience. Verify integrated builds/tests, corrected comparison and imagery coverage, blocked external requests and terminal publication evidence. Publication is part of the epic's user outcome; this story-document update does not itself authorize execution.

**Dependencies:** Epics 1 and 2 for publication of the complete approved iteration. Adapter/export work may use the existing application before they finish, but release acceptance requires both completed outcomes. No dependency on a future epic.

### Grouping and Delivery Rationale

Three epics follow distinct user activities and risk boundaries: understanding a pair, exploring a season and sharing the complete bundled snapshot. Summary, highlights and imagery share comparison identity/rendering work, so they remain consolidated in Epic 1. Progress exploration remains a separate outcome. Shared App.tsx/style.css edits are integration points; coordinate them sequentially. Export/adapter/publication remain together because the hosted outcome requires a verified release.

Recommended order is 1 → 2 → 3. Earlier epics work in the existing local edition and never require future work to function. The iteration ships all three outcomes together as requested. Within each epic, stories are ordered so none depends on a later story; approved stories are recorded below.

## Epic 1: Understand Who Leads a Driver Comparison and Why

Choose a valid driver pair, read an evidence-backed six-category verdict and inspect better round values. Recognize identities through locally bundled portraits and season-relative team marks, with accessible fallbacks and credits.

### Story 1.1: Identify Better Values in Round-by-Round Comparison

As a season analyst,
I want better qualifying, classification and points values clearly marked,
So that I can compare two drivers without manually judging every cell.

**Requirements:** FR-7, FR-13, UX-DR5; NFR-1–3, NFR-8; AR-1 and the metric-direction/tie/availability portion of AR-2.

**Dependencies:** Existing version 0.1 only. No dependency on a later story.

**Original approval:** See [historical approval record](#historical-approval-record).

**Correction status:** Revised for accepted review feedback; implementation and correction acceptance remain pending.

**Acceptance Criteria:**

**Given** two available unequal values,
**When** compared,
**Then** lower qualifying/classification positions or higher points receive a visible tick and highlight without visible “Better” text,
**And** screen-reader text names the driver, measure and favorable direction; the decorative tick is hidden from assistive technology.

**Given** tied or unavailable values,
**When** compared,
**Then** neither receives a favorable tick or highlight,
**And** ties, unavailable values and genuine zero remain distinguishable.

**Given** an authoritative numeric classification with a retirement status,
**When** rendered,
**Then** both remain visible and status alone never creates a numeric finish,
**And** GP and sprint comparisons remain separate.

**Given** Leclerc and Russell's verified 2021 Bahrain records,
**When** displayed,
**Then** Leclerc's better qualifying and GP classification values are marked.

**Given** keyboard use, narrow screens or 200% zoom,
**When** reading the table,
**Then** headers, statuses, labels and the comparison legend remain accessible.

**Implementation boundary:** Update the existing detailed comparison markers and their browser assertions; preserve shared directions, pair selection, teammate defaults and navigation. Verify tick/highlight presence, absence of visible “Better” text, accessible driver/measure/direction and tie/unavailable behavior. Do not remove descriptive screen-reader wording when removing visible labels. Summary integration is addressed by Story 1.2.

### Story 1.2: See the Overall Comparison Verdict and Evidence

As a season analyst,
I want a six-category summary with an explained verdict,
So that I can understand who leads and assess the evidence.

**Requirements:** FR-6, FR-10–12; NFR-1–3, NFR-8; AR-2–4; UX-DR1–4, UX-DR14. Preserve FR-21 comparison navigation. Identity imagery is added independently in a subsequent story.

**Dependencies:** Story 1.1's shared comparison policy. No dependency on imagery or later stories.

**Original approval:** See [historical approval record](#historical-approval-record).

**Correction status:** Revised for accepted review feedback; implementation and correction acceptance remain pending.

**Acceptance Criteria:**

**Given** a valid pair,
**When** Compare opens,
**Then** the six rows are GP race head-to-head, GP qualifying head-to-head, official championship points, best GP finish, best GP qualifying rank and GP DNFs, with named values and availability reasons,
**And** favorable summary values use a tick/highlight without visible “Better” text, retaining screen-reader driver/metric/direction wording; ties/unavailable values have no favorable marker.

**Given** authoritative GP qualifying rank 2 followed by penalized starting-grid position 7,
**When** calculating best GP qualifying rank,
**Then** use qualifying rank 2 and award the category vote to the lower best qualifying rank,
**And** do not use starting grid, race classification or sprint ranking; qualifying head-to-head remains a separate category, not a seventh row or a duplicate best-rank value.

**Given** every scheduled GP has an authoritative qualifying record for a driver,
**When** calculating the season-wide best qualifying rank,
**Then** use the lowest authoritative GP qualifying position and report qualifying sample sizes,
**And** missing records, unavailable sessions or missing numeric classification leave that driver's season-wide category value unavailable with a qualifying-specific coverage reason; never show the missing-starting-grid schema explanation.

**Given** comparable categories,
**When** scored,
**Then** each favorable category awards one vote using its defined direction,
**And** tied/unavailable categories award none; championship position and winning margins never affect the verdict.

**Given** scores of 4–2, equal scores or zero comparable categories,
**When** rendered,
**Then** show respectively the leader, a draw or insufficient data,
**And** show comparable, tied and unavailable counts.

**Given** head-to-head results,
**When** summarized,
**Then** show eligible rounds, ties and exclusions,
**And** no eligible rounds means unavailable.

**Given** schema v1,
**When** summarized,
**Then** existing qualifying data supplies best GP qualifying rank without schema migration; best finish and DNF totals still require driver records across every scheduled GP,
**And** a tested retirement-status allowlist excludes DNS, disqualification and finishes; unknown statuses make DNF unavailable.

**Given** the scorecard,
**When** rendered,
**Then** proportional bars appear only for comparable nonnegative counts/points with positive sums and rank rows use markers,
**And** mobile layout preserves A/B identity; invalid pairs show guidance without a verdict.

**Implementation boundary:** Modify the existing shared summary policy and scorecard; retain retirement/status fixtures, conservative best/count coverage, teammate defaults, URL/Back and comparable counts including ties. Add qualifying-vs-penalized-grid, missing qualifying/unknown participation, complete qualifying coverage, category ties, changed winner, draw and insufficient-data fixtures. Retain synthetic 4–2 scoring coverage and add real qualifying-data verification. Replace the obsolete grid-unavailability assertions; do not relax missing-data rules or alter other category weights. Named identities work without Story 1.3 assets.

### Story 1.3: Recognize Drivers and Historical Teams

As a season analyst,
I want verified driver photographs and season-appropriate team logos across the supported identities,
So that I can recognize identities without confusing historical affiliations.

**Requirements:** FR-2, FR-3, FR-17; AR-9; UX-DR1, UX-DR4, UX-DR11–12, UX-DR14; NFR-1–4, NFR-8.

**Dependencies:** Existing standings and Story 1.2's scorecard for integration. No dependency on hosting.

**Original approval:** See [historical approval record](#historical-approval-record).

**Correction status:** Revised for accepted review feedback; implementation and correction acceptance remain pending.

**Acceptance Criteria:**

**Given** the supported 2010/2021 identities,
**When** acquiring and mapping reusable assets,
**Then** target every represented driver with a verified photograph and every represented constructor/season with an appropriate historical logo using canonical IDs and explicit season mappings,
**And** maximize actual mapped-image coverage; multiple relevant affiliations remain visible and unrelated modern teams or generated likenesses/logos are never substituted.

**Given** the canonical identities in each verified snapshot,
**When** recording `_bmad-output/implementation-artifacts/second-iteration-media-coverage.md`,
**Then** list every driver/season and constructor/season with its mapped filename or individually investigated exception,
**And** report actual mapped-image counts versus total identities separately for logos and photographs in each season; count fallbacks separately and do not invent a reduced accepted coverage target.

**Given** an image cannot be acquired or reused,
**When** proposing a fallback exception,
**Then** record attempted source URLs and the specific identity, historical suitability, availability or reuse blocker for that entry,
**And** a generic “not vetted” reason or successful fallback test does not establish completed acquisition; remaining exceptions stay visible for user review.

**Given** bundled assets,
**When** opening the visible Image credits link,
**Then** local credits identify source URL, creator, license, required attribution, applicable identity/season, filename, crop notes and portrait date or unknown,
**And** a photograph date differing from the selected season is explained without implying selected-season photography; a verified photograph may be reused for the same driver across applicable seasons with explicit mappings/date disclosure.

**Given** absent mappings, unusable licenses or failed image loads,
**When** identities render,
**Then** named initials or team text replace images without broken icons or blocked analysis,
**And** full identity text remains alongside the image frame.

**Given** desktop, narrow screens, keyboard use or 200% zoom,
**When** viewing standings and comparison,
**Then** reserved 4:5 portrait frames, contained team marks, appropriate alt text and local credits remain usable,
**And** comparison keeps A left/B right, names and each driver's season-relative affiliations; shared marks appear only for matching identities.

**Given** the acquired files and mapped identities,
**When** visually inspecting actual logos and photographs on desktop and narrow layouts,
**Then** verify correct driver/constructor identity, historical-logo suitability, legible faces/marks and appropriate crop/containment,
**And** record each visual-check outcome in the coverage inventory; frame/fallback tests alone cannot establish imagery acceptance.

**Given** blocked external image requests,
**When** browsing either supported season,
**Then** local images, credits and fallbacks work without third-party requests.

**Implementation boundary:** Extend existing media mappings, credited local files and identity rendering; acquire imagery against the entire snapshot-derived inventory rather than rebuilding components. Verify mapping/filename integrity, source/license metadata, actual image loading, historical identity and date disclosures. Preserve table semantics and layout dimensions on load failure. Provide coverage counts, individual exceptions and visual evidence for acceptance; do not declare success from fallback-only coverage. Export/publication remain in Epic 3.

## Epic 2: Explore Season Evolution Across Drivers or Constructors

Select multiple entities within one category, follow chronological metric graphs and inspect matching numeric evidence through accessible controls and navigation.

### Story 2.1: Choose Entities and Compare Their Season Metrics

As a season analyst,
I want to select multiple drivers or constructors and a valid metric,
So that I can compare their round-by-round values in one evidence table.

**Requirements:** FR-4, FR-5, FR-14, FR-21; UX-DR6, UX-DR10, UX-DR14; NFR-1–3, NFR-6; AR-1.

**Dependencies:** Existing progress selectors and navigation only; independent of Epic 1.

**Original approval:** See [historical approval record](#historical-approval-record).

**Acceptance Criteria:**

**Given** Progress in a supported season,
**When** choosing a category,
**Then** controls appear in category/entity/metric order with searchable labeled checkboxes, visible removable selected names and Clear selection,
**And** driver and constructor selections remain separate with no arbitrary selection cap; an empty category selection shows explicit guidance.

**Given** selected entities,
**When** choosing a metric,
**Then** only category-valid existing metrics are offered and cumulative points is the default,
**And** compatible choices survive metric changes; GP and sprint results are separate measures, never mixed ranks.

**Given** the selected entities and metric,
**When** displaying the semantic evidence table,
**Then** the existing pure selectors supply chronological schedule-aligned values, source statuses and explicit unavailable cells with season/metric captions and scoped headers,
**And** official standings supply cumulative points/ranks, earned points preserve GP/sprint availability rules and genuine zero remains numeric zero.

**Given** a direct URL, season/category change or browser Back,
**When** restoring graph-selection state,
**Then** compatible entity IDs and metric are restored and only incompatible selections are reset,
**And** obsolete responses never replace the active season; existing standings-to-progress links remain useful.

**Implementation boundary:** Deliver the multi-entity table and URL state before graph rendering. Preserve existing driver and constructor detail measures and local refresh behavior; no later chart story is needed for this table to work.

### Story 2.2: Read Season Evolution as a Labeled Graph

As a season analyst,
I want a graph matching my selected entities and metric,
So that I can see changes across the season and verify them against numbers.

**Requirements:** FR-15; UX-DR7–8, UX-DR10, UX-DR14; NFR-1–3, NFR-8; AR-1.

**Dependencies:** Story 2.1 selection, URL state and evidence table.

**Original approval:** See [historical approval record](#historical-approval-record).

**Acceptance Criteria:**

**Given** a valid selection,
**When** rendering the graph above the evidence table,
**Then** graph and table consume the same selector output and identify season, metric, units, entities and chronological rounds,
**And** points rise upward, rank 1 appears at the top and full event names remain available in the table.

**Given** missing values or source statuses,
**When** plotting,
**Then** missing values break paths without smoothing/interpolation and authoritative numeric classifications retain their status in the evidence table,
**And** missing classifications create gaps; GP/sprint rankings stay distinct and point metrics explain sprint inclusion.

**Given** multiple entities,
**When** changing metric or inspecting the graph,
**Then** named legend entries and stable series identities use blue solid/lilac dashed first, then distinguishable dash/marker combinations,
**And** identification never depends only on team colors.

**Given** empty selection, many series, narrow screens or reduced motion,
**When** rendering,
**Then** empty guidance replaces a misleading plot, crowded plots may scroll locally, labels and controls reflow and charts have no animated transitions,
**And** chart strokes/markers satisfy contrast requirements and the complete table remains immediately accessible.

**Implementation boundary:** Implement `EvolutionChart.tsx` as presentation over shared selector results. Cover chart/table agreement, missing-data gaps, rank direction and category changes with deterministic/browser checks. Keyboard round inspection follows; all values are already accessible through the table.

### Story 2.3: Inspect Any Round by Keyboard or Pointer

As a keyboard or pointer user,
I want to inspect a round without relying on hover,
So that I can read every selected entity's value and source status.

**Requirements:** FR-16; UX-DR9–10, UX-DR14; NFR-2–3, NFR-8.

**Dependencies:** Story 2.2 graph and Story 2.1 table.

**Original approval:** See [historical approval record](#historical-approval-record).

**Acceptance Criteria:**

**Given** the graph,
**When** focusing its single round-inspection control,
**Then** visible instructions describe Left/Right and Home/End,
**And** those keys move chronologically within bounds or to the first/last round without adding every point to the Tab order.

**Given** keyboard or pointer round selection,
**When** a round is inspected,
**Then** the same persistent panel identifies round, event and every selected entity's value/status including Unavailable,
**And** displayed values match that round in the evidence table.

**Given** intentional keyboard input,
**When** the panel changes,
**Then** a concise accessible announcement reports the inspection without rereading the table or moving focus,
**And** pointer movement does not produce repetitive live announcements.

**Given** selection/season/metric changes or narrow layouts,
**When** inspection updates,
**Then** the inspected round is retained if valid or safely reset with consistent labels,
**And** visible focus, details and table remain available at 200% zoom and with reduced motion.

**Implementation boundary:** Add shared pointer/keyboard inspection state and browser verification for every supported key, gaps, first/last round and changed selections. No new analysis calculations.

## Epic 3: Share the Complete Dashboard with Bundled Season Data

Open and share the complete iteration through the existing anyone-with-link Site using immutable verified data/media, while keeping the original local edition and explicit refresh available.

### Story 3.1: Export a Verified Season Bundle for Publication

As the dashboard owner,
I want a reproducible validated export of the two supported seasons,
So that the hosted dashboard can use trustworthy data without an F1 API.

**Requirements:** FR-18; NFR-1, NFR-4–5, NFR-7–8; AR-5–7, AR-9, AR-12–13.

**Dependencies:** Existing cache/validation and Epic 1 media for the complete release. Shared contracts are defined within this story before export work.

**Original approval:** See [historical approval record](#historical-approval-record).

**Acceptance Criteria:**

**Given** existing shared contracts,
**When** preparing the exporter,
**Then** define `DataSource`/`BundledManifest` and shared runtime validation first: domain-returning manifest/season methods and a discriminated local-only refresh capability,
**And** manifest JSON is `{bundleVersion: 1, exportedAt, seasons: [...]}` with supported-season metadata, snapshotId, schemaVersion, refreshedAt and relative assetPath per entry.

**Given** valid verified 2010/2021 cache envelopes and required media,
**When** running `scripts/export-site.mjs`,
**Then** export only validated snapshot payloads and mapped media/credits with the manifest as one staged, atomically replaced release,
**And** preserve source timestamps, record export time separately and use release-specific paths or equivalent stale-cache protection.

**Given** missing/invalid input, wrong season/schema, mismatched snapshot metadata or unverified coverage,
**When** exporting,
**Then** fail without producing a partial publishable release or replacing the previous valid release,
**And** never download implicitly, substitute fixtures, expand supported seasons or expose raw envelopes/logs/credentials.

**Given** export verification fixtures,
**When** checks run,
**Then** successful output and rejection cases above are asserted through the same runtime validators used by the application,
**And** output manifest paths identify payloads from one consistent release.

**Implementation boundary:** Retain schema v1 and reuse existing server validation without creating another provider adapter. This story produces an inspectable export; loading it in the browser is the next story.

### Story 3.2: Analyze Bundled Data While Retaining Local Refresh

As the dashboard owner,
I want the same analysis client to run in local or bundled mode,
So that I can use a bundled snapshot and still refresh my local edition.

**Requirements:** FR-1, FR-8–9, FR-18–19, FR-21; NFR-1–6, NFR-8; AR-5–8, AR-12–13; UX-DR13–14.

**Dependencies:** Story 3.1 export/shared contracts. Existing analysis surfaces; final all-feature release checks follow in Story 3.4.

**Original approval:** See [historical approval record](#historical-approval-record).

**Acceptance Criteria:**

**Given** an explicit local or bundled build setting,
**When** building/loading,
**Then** `app/client/data-source.ts` owns adapter selection and views consume the shared interface without constructing URLs,
**And** invalid configuration fails the build; local alone unwraps API envelopes and bundled reads static domain JSON relative to the configured base.

**Given** a bundled manifest and payload,
**When** loading a season,
**Then** validate schema, season and snapshot identity against the manifest before committing data,
**And** failure offers bundled-load retry without API fallback, refresh or setup actions.

**Given** bundled mode,
**When** using standings, progress or comparison,
**Then** only verified 2010/2021 appear and the header identifies bundled mode plus selected-season source date/time/timezone,
**And** it never labels export/deployment time as source freshness or promises live refresh/disconnected browsing.

**Given** local mode,
**When** loading or explicitly refreshing,
**Then** retain existing API endpoints, atomic refresh, pending-state duplicate prevention and failed-refresh data/timestamp retention,
**And** original local build/server commands remain functional without automatic refresh.

**Given** rapid season switches, overlapping operations, direct links or browser Back in either mode,
**When** responses or navigation complete,
**Then** season checks and operation generations prevent obsolete commits and valid URL selections are restored,
**And** selected-season labels and all surfaces always describe the committed snapshot consistently.

**Implementation boundary:** Preserve original production build and add explicit hosted build configuration. Verify both adapters, bad/mismatched bundles, retries, base paths and local refresh regressions with meaningful tests.

### Story 3.3: Prepare the Corrected Dashboard as Existing Site Source

As the dashboard owner,
I want a sanitized buildable Site source with a persistent hosting identity,
So that publication uses the exact intended release and can be updated safely.

**Requirements:** FR-20 (source preparation/registration); NFR-4–5, NFR-7; AR-10–11; AR-13.

**Dependencies:** Epics 1–2 and Stories 3.1–3.2 for complete source preparation. No deployment required to accept this story.

**Original approval:** See [historical approval record](#historical-approval-record).

**Correction status:** Revised for accepted review feedback; implementation and correction acceptance remain pending.

**Acceptance Criteria:**

**Given** the complete application and validated export,
**When** preparing an isolated Site checkout using the installed Sites skill/source helper,
**Then** include browser source, required build inputs, validated snapshots and attributed media only,
**And** exclude local server runtime assumptions, raw cache envelopes, credentials, logs, local Git metadata from the uploaded artifact and unrelated files; preserve the original checkout and version 0.1 tag.

**Given** the existing Site identity in the isolated checkout's `.openai/hosting.json`,
**When** preparing corrected source,
**Then** reuse that returned project_id and preserve `static.directory: dist` and the currently authorized anyone-with-link audience,
**And** inspect/recover existing identity after uncertain results rather than inventing IDs, registering a replacement Site or changing access.

**Given** the isolated source,
**When** its default `npm run build` runs through the Sites helper,
**Then** validated bundled export and hosted build complete without a running Node API,
**And** sanitized validated payload inputs suffice to reproduce the export without requiring excluded raw cache envelopes or hidden local files.

**Given** the buildable source,
**When** synchronizing and packaging,
**Then** the Sites source helper packages the exact matching commit/archive and preserves returned source/version identity,
**And** the package contains the corrected qualifying category, concise markers and acquired imagery; retain the imagery inventory as separate verification evidence and record build/packaging evidence without claiming deployment success.

**Implementation boundary:** Apply the installed Sites skill during execution. Support sanitized snapshot payload input to the exporter/build as needed using the same validation rules; do not relax validation or introduce implicit provider downloads. Tool-required source metadata stays distinct from excluded local repository metadata.

### Story 3.4: Verify and Share the Corrected Dashboard

As the dashboard owner,
I want the corrected iteration published to the existing anyone-with-link Site with its URL and operating guidance,
So that I can use the dashboard and know exactly which snapshot it contains.

**Requirements:** FR-20 (publication/evidence), FR-19; regression coverage FR-1–21; NFR-1–8; AR-10–13; hosted verification UX-DR1–14.

**Dependencies:** Epics 1–2 and Stories 3.1–3.3. No later story dependency.

**Original approval:** See [historical approval record](#historical-approval-record).

**Correction status:** Revised for accepted review feedback; implementation and correction acceptance remain pending.

**Acceptance Criteria:**

**Given** the complete local and hosted builds,
**When** running `npm.cmd run build`, `npm.cmd test`, `npm.cmd run test:e2e` and hosted export/build checks,
**Then** record successful results or specific failures with no unsupported pass claims,
**And** cover best qualifying rank versus penalized grid, missing qualifying coverage/reasons, changed category votes/ties/draws, tick/highlight without visible “Better” in summary/detail, accessible descriptions, Leclerc–Russell Bahrain values, graph/table agreement/gaps/axes, imagery loading/fallbacks, URL/Back, narrow layout, keyboard access and retained local refresh.

**Given** the Story 1.3 inventory and acquired files,
**When** assessing imagery acceptance,
**Then** verify per-season actual-photo/logo counts against the complete snapshot identities, separately counted fallbacks, individual investigated exceptions, provenance/date disclosures and recorded visual checks,
**And** inspect actual faces/logos for identity, historical suitability, legibility and crop/containment in desktop/narrow views; generic fallback reasons or passing fallback tests cannot close the imagery work.

**Given** the exact packaged hosted artifact,
**When** external F1 and image requests are blocked,
**Then** both supported seasons, standings, summary/highlights, graphs/inspection, images/fallbacks and credits remain usable,
**And** no product `/api` or third-party data/image/font requests occur, no refresh/setup controls appear and bundled retry/source-date messaging works.

**Given** passing corrected-release checks, explicit rebuild/publication authorization and the existing Site identity,
**When** publishing through the installed Sites operations appropriate to its confirmed audience,
**Then** preserve anyone-with-link access and the returned project/version/deployment IDs without creating another Site,
**And** resume pending deployment rather than starting another; report success only after a returned terminal successful result.

**Given** terminal successful publication,
**When** verifying access,
**Then** confirm the shared URL and returned anyone-with-link audience evidence, including an independent browser check where available,
**And** record URL, identities, snapshot versions, deployment result and access/visibility evidence in `_bmad-output/implementation-artifacts/second-iteration-verification.md`.

**Given** publication failure or incomplete verification,
**When** recording evidence,
**Then** retain returned identities and actual state without claiming successful publication,
**And** document the unresolved condition and recovery step without duplicating the Site.

**Given** final operating documentation,
**When** reading README and the verification artifact,
**Then** local refresh, bundled export/build, existing-Site publication/update steps, sharing, credits and snapshot semantics are clear,
**And** explain that local refresh requires a new validated release to update the Site and that bundled hosting still needs Sites network access.

**Implementation boundary:** Verify and publish the corrected release only after feature work and explicit rebuild/publication authorization; do not implement omitted features inside this verification story. Preserve original release evidence as history and record new results separately. Reuse the existing Site/returned identity and preserve anyone-with-link access; never infer execution authorization from old approvals or this document update. User acceptance of corrected imagery and comparison remains open.

## Coverage and Approval Records

### Current correction coverage

| Accepted correction | Accountable stories | Required evidence |
|---|---|---|
| Constructor logos (CAP-1) | 1.3, 3.3, 3.4 | Per-season inventory/counts, investigated exceptions, visual checks and matching release media |
| Driver photographs (CAP-2) | 1.3, 3.3, 3.4 | Verified photographs, mappings/dates/credits, per-season coverage and visual checks |
| Best GP qualifying rank (CAP-3) | 1.2, 3.4 | Qualifying 2/grid 7 fixture, complete/incomplete qualifying coverage, vote/tie/draw regression |
| Concise markers (CAP-4) | 1.1, 1.2, 3.4 | Tick/highlight without visible Better, descriptive screen-reader text, no favorable ties/unavailable |
| Existing sharing audience | 3.3, 3.4 | Existing returned identity, unchanged anyone-with-link access and terminal deployment evidence |

All existing FR/NFR/AR/UX IDs and story numbers are retained. The correction requirements come from the accepted specs; architecture/UX alignment and final story validation have passed. Workflow completion confirmation remains pending. This update does not edit sprint-status.yaml or claim a new runtime pass.

### Historical approval record

The user explicitly approved Stories 1.1 and 1.2, requested one batch review for the remaining stories, approved that batch on 2026-10-29 and authorized original workflow completion. The original three-epic structure and ten-story plan are retained. Original planning validation and the shipped release are historical facts; they do not approve correction implementation or establish correction acceptance. Current user direction authorizes updating these stories only.

| Epic | Stories | Outcome |
|---|---|---|
| 1 | 1.1–1.3 | Shared-policy highlights, six-category verdict/evidence, mapped local imagery/credits |
| 2 | 2.1–2.3 | Multi-entity evidence/URL state, graph, keyboard/pointer inspection |
| 3 | 3.1–3.4 | Validated export, both data modes, existing-Site source and verified anyone-with-link publication |

| Requirements | Stories |
|---|---|
| FR-1 | 3.2, 3.4 |
| FR-2–3 | 1.3, 3.4 |
| FR-4–5 | 2.1–2.2, 3.4 |
| FR-6 | 1.1–1.2, 3.4 |
| FR-7 | 1.1, 3.4 |
| FR-8–9 | 3.2, 3.4 |
| FR-10–12 | 1.2, 3.4 |
| FR-13 | 1.1, 3.4 |
| FR-14 | 2.1, 3.4 |
| FR-15 | 2.1–2.2, 3.4 |
| FR-16 | 2.3, 3.4 |
| FR-17 | 1.3, 3.4 |
| FR-18 | 3.1–3.2, 3.4 |
| FR-19 | 3.2, 3.4 |
| FR-20 | 3.3–3.4 |
| FR-21 | 1.1–1.2, 2.1, 3.2, 3.4 |
| UX-DR1–4 | 1.2–1.3 |
| UX-DR5 | 1.1 |
| UX-DR6 | 2.1 |
| UX-DR7–8 | 2.2 |
| UX-DR9 | 2.3 |
| UX-DR10 | 2.1–2.3 |
| UX-DR11–12 | 1.3 |
| UX-DR13 | 3.2 |
| UX-DR14 | 1.1–1.3, 2.1–2.3, 3.2, 3.4 |
| NFR-1–3 | Feature stories plus 3.4 integration |
| NFR-4–5, NFR-7 | 1.3 media, 3.1–3.4 hosted release |
| NFR-6 | 2.1, 3.2, 3.4 |
| NFR-8 | Feature checks, 3.1–3.2, 3.4 evidence |
| AR-1 | 1.1–1.2, 2.1–2.2 |
| AR-2–4 | 1.1–1.2 |
| AR-5–8 | 3.1–3.2 |
| AR-9 | 1.3, 3.1 |
| AR-10–11 | 3.3–3.4 |
| AR-12 | 3.1–3.2 |
| AR-13 | Feature checks and 3.4 documentation/evidence |

All 21 FRs and 14 UX requirements retain story coverage. No greenfield starter, database or new season is required. Dependencies refer only to existing functionality or earlier stories. Epic 3 release acceptance consumes the completed local outcomes. Synthetic scoring fixtures remain useful; real qualifying coverage now supplies the sixth category when authoritative records are complete.

### Historical Original Planning Validation — 2026-10-29

- Passed functional coverage: all 21 FRs have mapped stories and implementation or inherited-behavior regression acceptance.
- Passed UX/quality/architecture coverage: all 14 UX requirements, 8 NFRs and 13 ARs are assigned. Schema-v1 grid availability, conservative participation/status policy, shared selectors and validated private release contracts are preserved.
- Passed architecture setup: extend the existing application; no starter, upfront database creation or dependency migration is required.
- Passed story completeness: ten stories each identify a user, capability, benefit, requirements, dependencies and testable Given/When/Then criteria. Feature, adapter, source-preparation and publication boundaries keep stories scoped to one implementation session each.
- Passed dependency checks: no story requires a later story. Epics 1 and 2 function locally; Epic 3 consumes completed earlier outcomes. Export input support for the isolated checkout reuses validation rather than requiring raw cache envelopes in the hosted source.
- Passed epic structure/file-overlap checks: comparison/identity, progress exploration and private snapshot access are distinct user outcomes. Shared shell/CSS integration is documented and sequential; comparison concerns are consolidated.
- Passed document checks: all stories approved, sequential numbering, no unresolved template placeholders. User authorized Complete Workflow; status is final.

These original planning statements describe the pre-feedback baseline, including requirements now superseded above. Original release evidence is recorded separately in second-iteration-verification.md. No correction implementation, runtime test, asset acquisition or publication pass is claimed by this update.

### Story Revision Record — 2026-10-29

Updated Stories 1.1–1.3 and 3.3–3.4, related requirements/coverage references and audience wording from the accepted feedback spec and story review. Retained all three epics, ten story IDs, unchanged Epic 2 behavior and original approval/validation history. Every revised story has testable Given/When/Then criteria; no later-story dependencies were introduced. Architecture and UX alignment, final workflow validation and correction implementation remain pending. The original template section order is retained; the current-handoff block and linked historical approval record address orientation/repeated-approval findings without a broad document restructure.

### Initial Correction Validation — 2026-10-29 (historical)

User selected Continue to run step-04-final-validation. Result: draft retained, two cross-document checks open. This is planning validation, not implementation acceptance.

| Check | Result | Evidence |
|---|---|---|
| Functional coverage | Pass | All 21 FRs map to stories; revised acceptance covers all four feedback capabilities and current sharing requirements. |
| Quality/UX requirement coverage | Pass within stories | All 8 NFRs, 13 ARs and 14 UX requirements retain coverage; imagery counts/exceptions/visual checks, qualifying-vs-grid and accessible markers have explicit criteria. Source UX alignment is separately open below. |
| Starter/data setup | Pass | Extend the installed application and schema v1; no greenfield starter, database or upfront entity creation is required. |
| Story completeness | Pass | Ten stable IDs retain user value, requirements, dependencies and Given/When/Then criteria. Corrections extend existing components; Story 1.3 acquisition remains bounded to snapshot identities with explicit exception evidence. |
| Epic structure/file overlap | Pass | Three distinct user outcomes remain: pair comparison, season exploration and shared bundled access. Shared shell/style integration is explicitly coordinated. |
| Dependency order | Pass | Each implementation story relies on existing work or earlier stories. Story 3.2's reference to final verification in 3.4 is not an implementation dependency; Epic 3 consumes completed local outcomes. |
| Architecture compliance | Open — architecture-alignment | ARCHITECTURE-SPINE.md AD-10/AD-11 still require unavailable starting grid and do not record the corrected qualifying category/media coverage gate. AD-12 still requires owner-private publication. Align these with the accepted correction contract and existing anyone-with-link audience through bmad-architecture. |
| UX source compliance | Open — ux-alignment | iteration-two-design.md still specifies best starting grid, visible “Better” markers and generic fallbacks without measured acquisition coverage. Align the summary, highlight and imagery sections plus any conflicting mockup through bmad-ux. |

The correction spec has explicit precedence, but conflicting source handoffs must be aligned before the stories can be declared ready for development. No new requirement or implementation is introduced by this validation. Next action: align architecture and UX, then rerun final validation; keep correction implementation and user acceptance open.

### Final Correction Revalidation — 2026-10-29

The user authorized architecture alignment, then UX alignment and revalidation without rebuilding. Both earlier open checks are now resolved; the initial validation record above remains historical.

| Check | Result | Evidence |
|---|---|---|
| Requirements coverage | Pass | All 21 FRs, 8 NFRs, 13 ARs and 14 UX requirements retain story coverage; all four correction capabilities have explicit criteria and accountable stories. |
| Architecture/setup | Pass | The aligned spine has exactly AD-1 through AD-12, stable IDs and zero deterministic lint findings. Independent rubric/coverage, technology and seam reviews passed after clear fixes. Qualifying uses schema v1; no new starter, database or upfront entities are required. |
| Story completeness/scope | Pass | All ten stories retain user value, requirement references, dependencies and Given/When/Then criteria. The five revised stories cover markers, best qualifying, imagery coverage and existing-Site release evidence; other behavior remains regression scope. |
| Epic structure/file overlap | Pass | Pair comparison, season exploration and shared bundled access remain distinct outcomes. Existing component reuse and coordinated shell/CSS integration avoid unnecessary technical-layer epics. |
| Dependencies | Pass | No implementation story requires a later story. Epic 2 works locally without Epic 3; Epic 3 consumes completed local outcomes. Later integration verification is not an implementation dependency. |
| UX/source compliance | Pass | Both UX spines, the focused supplement and illustrative mock now agree on qualifying before grid penalties, tick/highlight without visible Better, measured actual-image coverage with investigated exceptions, and existing sharing. Required section/order, token/component/link checks and input reconciliation passed; structure/prose fixes were applied. |

Planning validation passes with **0 open checks**. `status: draft` remains until the skill's Complete Workflow confirmation; this is not runtime acceptance or permission to rebuild. Actual acquisition, coverage evidence, implementation tests and corrected-release publication remain future work.

Review evidence: architecture workspace `reviews/review-feedback-{coverage,technology,seams}.md`; UX workspace `reconcile-feedback-{spec,acceptance}.md` and `review-feedback-editorial-{structure,prose}.md`. Original decisions remain in their append-only memlogs. No application files, assets, sprint statuses or deployed Site changed during this alignment.

### Correction workflow approved

On 2026-10-29 the user approved all corrected handoffs and authorized bmad-build with progress reporting. Document workflow is complete; correction implementation begins separately and runtime acceptance remains open.
