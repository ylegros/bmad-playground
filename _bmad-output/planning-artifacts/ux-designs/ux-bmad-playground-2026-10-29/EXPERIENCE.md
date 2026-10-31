---
name: F1 Dashboard
status: final
updated: 2026-10-30
sources:
  - ../../../specs/spec-iteration-three/SPEC.md
  - ../../../specs/spec-iteration-three/season-coverage-and-acceptance.md
  - ../../../specs/spec-iteration-two-feedback/SPEC.md
  - ../../../specs/spec-iteration-two-feedback/acceptance-corrections.md
  - ../../../implementation-artifacts/spec-second-iteration.md
  - ../../architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - ../../epics.md
  - ../../prds/prd-bmad-playground-2026-10-29/prd.md
---

# F1 Dashboard — Experience Spine

## Foundation

Current authority: the [iteration-three spec](../../../specs/spec-iteration-three/SPEC.md), [season coverage companion](../../../specs/spec-iteration-three/season-coverage-and-acceptance.md) and adopted [architecture spine](../../architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md), including AD-11/13/14, govern this alignment. Earlier [accepted corrections](../../../specs/spec-iteration-two-feedback/acceptance-corrections.md) retain scoring, imagery and accessible highlight rules. Iteration three supersedes the two-season limit, duplicate constructor fallback badge and individual-only Progress selection. Earlier stories and release checks remain historical; iteration-three implementation and acceptance are pending. Preserve the current anyone-with-link audience. This update authorizes no acquisition, code, build or publication.

Iteration two: the historical [focused UX handoff](iteration-two-design.md) records the six-category summary, selectable evolution graphs, accessible favorable-value ticks and highlights, season-relative imagery and hosted bundled-data states. Its two-year scope and text-filled constructor fallback yield to this spine. The existing local refresh flow continues only in the local edition. The user's prior optional UX-validation skip and Progress/Compare spine-only preference remain in force; iteration-three states need no new mock.

Personal desktop-first responsive web for Yannick. [DESIGN.md](DESIGN.md) is the visual identity reference; no UI library is selected. PRD semantics are confirmed; Pit Wall (option 2) is the selected visual direction; choices marked [ASSUMPTION] remain provisional behavior defaults. Product requirements remain in the source PRD, referenced below by FR number.

## Information Architecture

[ASSUMPTION] Three navigable surfaces share the App header and Navigation. First open lands on Standings with the latest supported season whose coverage is verified; never imply the calendar year is supported. No selected driver is required on entry.

| Surface | Entry | Delivers | Flow |
|---|---|---|---|
| Standings | App open / Navigation | Season selection; driver and constructor standings; links to entity progress and comparison | 1 |
| Progress | Driver or constructor action in Standings / Navigation | Selected entities' chronological metrics, search, additive Select all and source values | 2, 9 |
| Compare | Driver comparison action / Navigation | Two-driver selection and aligned round analysis | 3 |

Standings uses a Drivers/Constructors toggle; both rankings remain one action apart in the same season context. Desktop uses the selected 185px sidebar and grouped panels. A summary strip derives only from available standings/round data and adds no KPI scope; metric previews link to full analyses. [Selected Standings reference](mockups/standings-pit-wall.html) illustrates composition, with fixtures and schematic charts rather than production data. [ASSUMPTION] Entity selection on Progress offers driver/constructor category and entity. Compare reached directly starts empty; reached from a driver preselects that driver and the latest teammate where available. Local refresh is available on every surface (Flow 4); hosted mode offers only retry loading bundled data. Browser Back restores the preceding surface and selection.

## Voice and Tone

Use direct, factual English. Brand voice lives in DESIGN.md.

| Situation | Copy pattern |
|---|---|
| Missing result | “Unavailable” |
| Real zero | “0” in a points column |
| Empty comparison | “Choose two drivers from {season}.” |
| No teammate | “No teammate available for this season. Choose another driver.” |
| Failed refresh with snapshot | “Could not refresh. Showing data last refreshed {date, time, timezone}.” |
| No successful data | “Could not load this season. Try again or choose another season.” |
| Ongoing season | “Ongoing · Season to date · Analyzed GP rounds: {rounds}.” State the actual window, not an inferred contiguous range. |
| Standings freshness | “Current standings · Source Round {n}.” Add “Standings lag the analysis window” when applicable; use Final only after verified completion. |
| Session lifecycle | “Not held”, “Cancelled”, “Unavailable” (with reason), or “Not applicable”; never substitute 0. |
| Progress search | “{n} matches · {m} selected”; “No matches. Selection unchanged.” |

## Component Patterns

[ASSUMPTION] Visual contracts live in DESIGN.md.Components; proposed behavior follows.

| Component | Behavioral contract |
|---|---|
| App header | Carries a single season context and that season's last successful refresh time. Never label old-season data with a newly selected season. |
| Selector | Labeled native/select-equivalent controls for season, category, entities, drivers and metric. Offer all 17 candidate years with individual audited status; only verified years enable analysis. Latest verified season, including ongoing, is the default. Year changes retain valid category-specific graph IDs, discard invalid IDs with announcement before rendering, and clear legacy single-entity and comparison selections (AD-14). |
| Action | In local mode, explicit “Refresh data” starts one refresh; disable duplicates while pending. Bundled mode has load retry only. Standings row actions have entity-specific accessible names for progress/compare. |
| Navigation | Standings / Progress / Compare links expose current page; no hover-only entries. Preserve valid selections while moving between surfaces. |
| Standings table | Championship rank order and PRD columns. Driver rows link to progress and compare; constructor rows to progress. When comparison context has different first/latest teammates, annotate the initial teammate's ranking row “Initial teammate of {driver}”; latest teammate is labeled in Compare. |
| Progress panel | Driver metrics: GP qualifying, race result, round points, cumulative points. Constructor metrics: round points, cumulative points, championship position. Labeled search, Select all, remove-one and Clear selection operate on one category-specific selected set under AD-14. Metric selection changes chart and table together. Sprint results/points remain explicitly separate from GP; round totals include both. |
| Comparison panel | Default B to A's latest teammate at the last shared event in the selected season; initial teammate is at first shared event. Any two season drivers allowed. Changing A recomputes default B [ASSUMPTION]; changing B explicitly overrides it until A/season changes. Prevent identical driver pair with inline guidance. No teammate leaves B empty. |
| Data table | Same chronological round basis as chart; comparison uses the union of rounds, showing unavailable cells for absent results. Driver tables include GP qualifying, GP race result, Sprint result, GP/Sprint points, round total and cumulative points; constructor tables include total round points, cumulative points and championship position. No-sprint event shows “Not applicable” in Sprint columns. |
| Comparison summary | Six equal votes: GP race head-to-head, GP qualifying head-to-head, official championship points, best GP finish, best GP qualifying rank, GP DNFs. Higher counts/points and lower ranks/DNFs win; ties/unavailable award none. Comparable includes ties; equal scores draw unless zero comparable (Insufficient data). Qualifying 2/grid 7 uses 2. Best qualifying/finish and DNF totals require conservative driver evidence across the whole completed-GP window (AD-10/13), including held source gaps, absent substitute-driver records and unknown statuses; otherwise show specific reasons and coverage counts. Keep qualifying head-to-head separate. |
| Comparison highlight | Same shared summary/detail outcomes. Favorable values show tick and highlight without visible Better labels. Tick is aria-hidden; descriptive screen-reader text names driver, metric, value and favorable direction. Ties/unavailable have no favorable tick/highlight. |
| Identity media | Canonical identity/season mappings resolve verified local photographs and historical logos; no successor branding. Honest photo date/unknown disclosure permits portrait reuse. Redundant images have empty alt text. Missing or failed constructor logos remove the badge, leaving exactly one visible and accessible team-name label; no text placeholder or duplicate accessible name. Driver photograph fallbacks may retain stable named frames. All affiliations remain readable; failures never block analysis or count as images. |
| Image credits | Keyboard-accessible local provenance disclosure identifies source, creator, reuse terms/license, attribution, seasons, filename, photo date/unknown and crop notes; closing returns focus to trigger. |
| Status message | Inline status for pending, empty, unavailable, error and retained data. Loading and success announced politely; actionable errors announced once. Retry uses Action. |

[ASSUMPTION] Progress chart defaults to cumulative points. Compare offers GP qualifying, race results, round points and cumulative points; sprint result is explicitly selectable or shown as a labeled companion measure, never merged with GP finishing position. Rank axes put position 1 at top. Non-finish status appears in table text with a labeled chart annotation; no invented numeric rank. Missing points are gaps, not interpolated values. Do not infer a cumulative total from missing underlying rounds; display a source-provided total or Unavailable.

### Season lifecycle and coverage (CAP-2, AD-13)

Standings exposes per-year audit status and known data gaps for all 17 years, 2010–2026; no silent omission or hardcoded unsupported rejection after successful audit. Verification is an evidenced audit with honest availability, not a promise that every metric exists. Unverified/failed audit states explain why analysis is unavailable. No selection triggers background acquisition of all years.

One analysis window includes every independently verified held GP in round order, including held rounds with missing source data, and excludes unheld/cancelled GPs. Tables/charts keep the full calendar. Unknown lifecycle is an unresolved audit gap, never inferred from an empty endpoint or the date. Verified non-sprint cells read Not applicable. Qualifying/sprint results already held before an unheld GP may be shown as authoritative session results but are explicitly outside completed-GP comparisons.

Ongoing 2026 reads Ongoing / Season to date until completion is independently verified. Show the exact analyzed rounds and metric coverage; zero completed GPs makes GP-based summary categories Unavailable. Historical complete seasons retain full held-GP semantics. Official points/ranks come from the latest returned official standings inside the window, with source round and any lag shown; never extrapolate totals or call ongoing standings final.

Each year exposes actual-image/total and investigated-exception counts separately for driver photographs and constructor logos through existing credits/coverage disclosure. Count every identity/season slot once; exceptions require attempted sources and specific blockers. No reduced target is approved. Audit provenance, source freshness, lifecycle, analyzed rounds and gaps belong to the same snapshot. Successful local refresh replaces them together; rejected verification/refresh retains the last good data, selections, metadata and timestamp. Bundled seasons and credited media resolve from one immutable validated release without runtime external requests.

## State Patterns

| Surface/state | Treatment |
|---|---|
| All / cold load | Keep header and selected season visible; Status message “Loading {season}”; no fabricated rows. |
| All / focus and selection | Visible `{colors.focus}` ring; selected Navigation and Selector state conveyed semantically. |
| All / season unavailable or empty | Explicit empty message, season selector remains operable; distinguish no completed rounds from failed loading. |
| All / first-load failure | Inline error and retry; never show another season's snapshot as this season. |
| Hosted / bundled load failure | Retry loading bundled data; no live refresh/API setup or mode fallback. Retain verified snapshot context when available. |
| All / image failure | Constructor: one team name, no logo badge. Driver: stable named portrait fallback. Analysis remains available; coverage evidence tracks exceptions separately. |
| All / audit unavailable | Show individual year/audit failure and gaps; season selector remains usable. Never claim verified support from the dropdown alone. |
| All / ongoing or no completed GPs | Show Season to date window; retain full calendar lifecycle labels. Zero completed GPs leaves GP summary categories unavailable. |
| Standings / source lag | Show source round and lag; do not extrapolate to latest analyzed round. |
| Compare / tied or unavailable category | No favorable tick/highlight; explicit Tied or Unavailable with reason/sample size; zero comparable categories means Insufficient data. |
| Local / refresh pending | Retain current snapshot and selections with “Refreshing”; disable duplicate requests. |
| Local / failed refresh or offline | Preserve last successful season snapshot and timestamp; explain failure and allow retry. Without a snapshot, use first-load failure treatment. No offline persistence guarantee [ASSUMPTION]. |
| Local / refresh success | Replace snapshot consistently across views; update timestamp only on success. Preserve still-valid selections; explain any entity removed from available data. |
| Standings / missing affiliation or points | Show Unavailable in the affected cell; keep other available values. |
| Progress / empty selection | Prompt for category/entity; do not silently choose a driver. |
| Progress / no search matches | Keep existing selected series/table; Select all is a no-op and adds no history. |
| Progress / many selections | Keep every selected series inspectable and distinguishable with complete table access; no hidden cap. Wrap controls and use intended local scrolling at narrow widths/200% zoom. |
| Progress / partial data | Keep chronological rounds and explicit unavailable cells; chart gaps and meaningful result-status text. |
| Compare / fewer than two valid selections | Show selectors and guidance; do not render misleading comparison plots. |
| Compare / no teammate or no shared rounds | Keep A selected, allow arbitrary B; show unavailable aligned cells and “No shared results” where applicable. |
| Compare / partial data | Render available series; missing driver's cell says Unavailable even when other driver's value is 0. |

Permission-denied is not a separate product flow: no authentication or private data is specified. Upstream access failures use the data-error pattern. Automatic polling and automatic refresh are outside MVP.

## Interaction Primitives

[ASSUMPTION] Click/tap and standard keyboard controls suffice; no custom shortcuts, drag or gesture dependence. Tab follows reading order, Enter/Space activates, Escape closes a transient selector and returns focus. Chart round inspection works by keyboard as well as pointer; the Data table exposes every value without tooltip dependence. Long tables use local horizontal scrolling when needed, with labeled scroll regions and visible scroll affordances; page content itself reflows.

### Progress selection (CAP-3, AD-14)

Search uses the existing case-insensitive name-substring predicate over the full active season/category list, including virtualized entries. Empty search matches all. Search alone never changes selection or hides selected nonmatching series from graph/table. Select all unions all matches with existing selections; repeats are idempotent and no matches changes nothing. Clear selection removes all active-category IDs, including nonmatches; remove-one removes only its ID. Driver and constructor sets stay isolated across category changes.

Graph, evidence table, controls and URL use the same set without independent limits. Existing `graphDrivers` / `graphConstructors` keys own it, serialized once in deterministic order. Explicit graph keys override legacy single-entity links. Empty selection removes the active graph key and legacy `entity` together; absence of both means empty, never an automatic default. Each effective selection action creates one history update; no-ops create none. Browser Back restores all representations together. Decode/season changes retain valid IDs only; announce discarded IDs before rendering. Pending actions cannot commit into a different season/category/snapshot context.

Native keyboard-operable actions retain focus and announce resulting selection counts politely, including no-change outcomes without rereading results. Match counts and selected states remain programmatically available. Every selected series has a readable name and distinguishable label/style; all values can be inspected by keyboard or in the matching table at narrow widths and 200% zoom.

## Accessibility Floor

[ASSUMPTION] Target WCAG 2.2 AA. Semantic headings, landmarks, labeled controls, table captions and scoped headers; current navigation uses aria-current. Provide a skip link. Chart summaries describe measure, season and trends without claiming insights absent from data; all numeric values have a Data table equivalent. Series names and line styles supplement color. Focus remains visible and unobscured; updates do not unexpectedly move it. Status announcements avoid re-reading whole tables. Targets at least 44px where practical, never below WCAG minimum without permitted spacing. Respect reduced motion; no animated plot transitions required. At 200% zoom and narrow reflow, controls and text remain available. Visual contrast is specified in DESIGN.md, including `{colors.ink}`, `{colors.muted}`, `{colors.series-a}` and `{colors.series-b}`.

## Inspiration & Anti-patterns

User requested [formula1.com](https://www.formula1.com/) as a close-feel reference, not a copy. Its standings/results framing is relevant; Pit Wall is the selected interpretation; exact values live in DESIGN.md. [ASSUMPTION] Keep analysis central with compact navigation and strong headings. Promotional modules and live timing remain outside scope; attributed identity imagery follows the accepted correction contract.

## Responsive & Platform

[ASSUMPTION] At 1024px+, the selected 185px sidebar frames grouped panels, and comparison can place panels side by side; 768–1023px uses stacked panels; below 768px header controls and selectors stack with `{spacing.mobile}` margins. Navigation remains visible and wraps. Keep season and local refresh access above analysis; bundled mode exposes load retry only. Tables retain full meaning through local horizontal scrolling and an anchored entity/round column when feasible; do not remove points, statuses or affiliations to fit. Charts may scroll horizontally to preserve round labels; table access remains immediately available. No native application or separate mobile feature set.

## Key Flows

The PRD has no named journeys. These provisional flows use Yannick and map all FRs without changing their scope.

### 1 — Yannick selects a season and inspects standings (FR-1, FR-2, FR-3)

1. Yannick opens Standings and selects a supported season starting in 2010.
2. The season context updates consistently; data loads for that season.
3. He reads driver rank, name, affiliation and points, then switches to Constructors for rank, name and points.
4. **Climax:** both standings describe the same selected season, and he chooses a driver or constructor to investigate.

Failure: unavailable season data shows explicit empty/error status with retry or another season choice; no other-season data is relabeled.

### 2 — Yannick follows round-by-round progress (FR-4, FR-5)

1. Yannick opens a driver from Standings into Progress.
2. He switches between qualifying position, race result, round points and cumulative points in chronological rounds, inspecting labeled GP/Sprint information.
3. He returns to standings and opens a constructor, then inspects round points, cumulative points and championship position including sprint points.
4. **Climax:** the chart and matching table show how the selected entity's season developed, with round labels and units visible.

Failure: absent results appear Unavailable and chart gaps; genuine zero points stay 0. Empty entity selection prompts a choice.

### 3 — Yannick compares teammates or any two drivers (FR-6, FR-7)

1. Yannick opens Compare from a selected driver's ranking action.
2. The latest teammate in that season is selected by the approved last-shared-event rule; if different, the initial teammate remains identified in the ranking.
3. He compares qualifying, race results and points on aligned rounds, distinguishing GP and Sprint results.
4. He can replace either driver with any other driver from that season.
5. **Climax:** matching rounds reveal both drivers' values without treating missing participation as zero or a finish.

Failure: no teammate leaves the second selection empty with guidance; absent results remain unavailable. Identical selections prompt another driver [ASSUMPTION].

### 4 — Yannick refreshes the local edition without losing context (FR-8, FR-9)

1. In the local edition, Yannick selects “Refresh data” from any surface.
2. His data stays visible while the refresh is pending.
3. A successful response updates the season snapshot and last refresh time consistently.
4. **Climax:** he continues the same analysis with an explicitly refreshed snapshot.

Failure: retain the last successful data and time; show a clear failure and retry action. No snapshot means an explicit load error. Refresh never runs on a timer.


Mock coverage: Standings uses the linked Pit Wall reference. The iteration-two layout reference illustrates Compare and Progress; its identities/numbers and image frames are fictional, not acquisition or runtime evidence. The written contracts govern complete behavior.

### 5 — Yannick verifies the pair verdict (iteration-two-feedback CAP-3, CAP-4)

1. Yannick selects two drivers in Compare and reads all six equal category rows.
2. He inspects best GP qualifying rank and coverage evidence; qualifying 2 remains 2 after a grid penalty to 7.
3. He follows the same favorable tick/highlight into detailed comparison, with descriptive assistive text naming the driver, measure and direction.
4. **Climax:** he explains the verdict without confusing best rank with qualifying head-to-head.

Failure: incomplete authoritative qualifying coverage shows a precise reason and sample count. Ties/unavailable have no favorable marker; zero comparable categories reads Insufficient data.

### 6 — Yannick recognizes the historical identities (iteration-three CAP-1, CAP-2; retained imagery flow)

1. Yannick chooses a verified year from 2010–2026 and reads standings names, affiliations and historical constructor logos.
2. In Compare he views actual verified photographs and season-appropriate marks in stable paired frames.
3. He opens Image credits to inspect source, reuse terms and photograph date/unknown.
4. **Climax:** he recognizes the correct identity without an implied selected-season photograph date.

Failure: missing or failed constructor logos leave one accessible team-name label without a badge; driver images retain readable named fallbacks. Every missing coverage slot requires an attempted source and specific blocker in the per-season inventory; fallback rendering is not acquisition. Inventory mapped/total and fallback counts separately for photographs and logos per season; actual desktop/narrow/200% visual checks establish identity, legibility and crop/containment. No reduced coverage target is approved.

### 7 — Yannick opens the shared bundled edition

1. Yannick opens the existing anyone-with-link Site and chooses a supported season.
2. The header identifies bundled data and selected snapshot date/time/timezone.
3. He inspects matching graph/table values, corrected summary and local images/credits.
4. **Climax:** the shared edition presents the verified snapshot without runtime provider or image requests.

Failure: offer Retry loading bundled data; never switch to API setup or live refresh. Sites needs network access and does not guarantee disconnected browsing. Local refresh remains Flow 4; a hosted snapshot changes only after a separately authorized release.

### 8 — Yannick explores audited ongoing-season evidence (iteration-three CAP-2)

1. Yannick opens Standings and inspects each candidate year's audit status, then chooses verified ongoing 2026.
2. He reads Ongoing / Season to date, the exact completed-GP window, snapshot freshness, and Current standings source round with any lag.
3. In Progress and Compare he distinguishes held source gaps from Not held, Cancelled and Not applicable cells; already-held pre-GP sessions are explicitly outside completed-GP comparisons.
4. He checks per-driver metric coverage and per-year photograph/logo mapped and investigated-exception counts in the existing disclosure.
5. **Climax:** he explains what the snapshot supports without claiming final standings or future completeness.

Failure: unverified years expose their audit failure rather than fabricated analyses. Zero completed GPs leaves GP categories unavailable; unknown lifecycle remains an audit gap. Failed local verification/refresh retains the last good snapshot, metadata, selections and timestamp. Hosted analysis continues using its immutable release.

### 9 — Yannick selects all matching progress entities (iteration-three CAP-3)

1. Yannick selects Drivers in Progress, keeps an existing selection and searches for a name substring.
2. He uses the keyboard to activate Select all; every match from the full list joins the existing set once, including non-visible matches, while selected nonmatches remain.
3. He inspects every selected series and matching table values, changes search without changing selection, and removes one entity.
4. He clears the active category, uses Back to restore the prior set, then changes category/year; valid IDs remain in their isolated sets and discarded IDs are announced.
5. **Climax:** graph, evidence table, selected controls and URL agree throughout, including an explicitly empty set and many-series narrow/200% inspection.

Failure/no-op: no matches or repeated Select all changes neither selection nor history. A stale action cannot select entities into another season/category/snapshot. Invalid decoded IDs are removed with an announcement; selection never silently defaults or truncates.

## Approved first iteration — 2026-10-29

Historical scope only: iteration three supersedes this two-season limit and its deferred features.

The user approved a reduced first iteration targeting eight hours: only fully verified 2010 and 2021 initially; all required metrics in accessible tables; charts, summary strip, metric previews and broad historical coverage audit deferred. These omissions supersede broader requirements elsewhere in this document for this iteration only. Keep sprint handling, official championship authority, missing-versus-zero, teammate semantics, atomic refresh and failure retention. React/TypeScript/Vite with local Node is accepted. Parallel unattended implementation uses an automated foundation check and final human review, with no intermediate human pause. The canonical contract is _bmad-output/specs/spec-bmad-playground/SPEC.md. Eight hours is a target, not a guarantee; full-MVP direction remains follow-up.
