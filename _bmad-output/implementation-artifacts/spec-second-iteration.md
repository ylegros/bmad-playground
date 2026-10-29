---
title: 'Second iteration: visual season analysis and private bundled-data Site'
type: 'feature'
created: '2026-10-29'
status: 'draft'
feedback_status: 'accepted-pending-handoff-alignment'
baseline_commit: 10e2d6dc58eb9586cc8ff9866bc95c8e9b39cd22
route: 'dispatch'
review_loop_iteration: 0
context: []
---

> **Current revision — accepted review feedback, 2026-10-29.** The user authorized the four corrections recorded below. The earlier release is published, but these corrections are not implemented or verified. Align epics, architecture and UX before rebuilding. The [canonical correction spec](../specs/spec-iteration-two-feedback/SPEC.md) and its [acceptance companion](../specs/spec-iteration-two-feedback/acceptance-corrections.md) govern conflicting older requirements.

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Version 0.1 supplies correct tables but makes comparing performance laborious. Add the user's five test findings: a driver-comparison summary with a declared winner, selectable season evolution graphs, better-value comparison cell highlighting, team logos, and driver photographs. Publish the finished iteration as a ChatGPT Site with bundled verified season data and no runtime F1 API dependency, preserving the user's subsequently authorized anyone-with-link audience.

The user explicitly groups these deliverables into iteration two. Deliver them together, retaining independent implementation and verification boundaries. Version 0.1 remains recoverable through its existing annotated tag.

The overall head-to-head winner is the driver with the most comparison categories in their favor. Each of the six defined summary categories has equal weight and awards one vote to its leader. Tied or unavailable categories award no votes. Equal category-win totals produce an overall draw, with no championship-position tiebreaker. Show the category score and the number of comparable categories; if none are comparable, show insufficient data rather than a winner or draw.

## Boundaries & Constraints

**Always:** Preserve Pit Wall styling, accessible tables, 2010/2021 verified coverage, official championship authority, source statuses, missing-versus-zero semantics, GP/sprint separation, season-relative identities, URL/Back navigation and mobile usability. Charts and tables use the same pure selectors. Bundle data and images locally in the hosted artifact. Label the hosted snapshot date and bundled-data mode; it must not promise live refresh. Keep local server refresh behavior available in the local edition. Preserve the returned Site identity and the currently authorized anyone-with-link audience.

Images use explicit driver/season-constructor mappings. Prefer period-appropriate team marks; never map a historical constructor to an unrelated current team. Include asset provenance and required attribution; missing/unusable images use named initials or team labels without broken image icons. Portrait dates are recorded; do not imply every portrait was photographed in the selected year.

**Never:** Add unverified seasons, fabricate numeric finishes or missing points, combine GP and sprint result rankings, introduce live timing, change the authorized audience without user direction, or require runtime third-party image/data calls. No guarantee of internet-disconnected browsing; bundled data means no runtime F1 API dependency.

### Accepted review corrections — current sprint

1. **Maximize constructor logos:** Target every constructor represented in verified 2010/2021 with an appropriate historical mark. Provide per-season mapped-image counts, identity mappings, credits and individual investigated exceptions. Text fallbacks remain for failures but do not count as successful logo coverage. Generic “not vetted” reasons are insufficient acquisition evidence.
2. **Maximize driver photographs:** Target every represented driver with a verified local photograph, explicit identity/season mappings, attribution, photograph date or unknown and individual investigated exceptions. A verified portrait may serve multiple applicable seasons with date disclosure. Initials do not count as photograph coverage. Validate actual faces and images visually, not only fallback behavior.
3. **Qualifying rank replaces starting grid:** Replace the best GP starting-grid row with **best GP qualifying rank**, using authoritative GP qualifying classification before starting-grid penalties. Lower is better. Keep GP qualifying head-to-head as a distinct count category and retain the six equal votes, ties, unavailable values and conservative coverage rules. Schema v1 already contains qualifying position; no grid migration is required. Missing qualifying coverage must have a qualifying-specific reason.
4. **Concise markers:** Remove repeated visible “Better” text from summary and detailed comparisons. Retain the tick and highlight, with descriptive screen-reader text naming driver, metric and direction. Tied/unavailable values receive no favorable marker.

Record these requirements now; acquisition, implementation and publication remain on hold until the feedback handoff is aligned and rebuilding is authorized. Prior release completion does not close acceptance of these corrections.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Per-round comparison | Two available unequal values | Lower qualifying/classification position or higher points receives a tick and highlight, descriptive screen-reader text and no visible “Better” label | Ties and absent values have no winner |
| Best GP qualifying rank | Authoritative qualifying rank 2; penalized starting grid 7 | Use qualifying rank 2; lowest qualifying rank wins this category | Missing qualifying coverage has a precise reason; do not substitute grid or race result |
| Nonfinish | Source result with numeric classification and status | Retain status, compare only authoritative source classification where present | No numeric classification means no result winner |
| Overall comparison | Valid pair and available summary categories | Most category wins determines overall winner; show score and comparable-category count | Tied categories give no votes; equal totals mean draw; no comparable categories means insufficient data |
| Season evolution | Selected season, entity category, entities and metric | Chronological labeled lines with consistent names, styles, units and matching table | Missing values form gaps; rank 1 is at top |
| Invalid selection | Same comparison driver or empty graph selection | Inline selection guidance | No summary declaring a winner |
| Hosted mode | Bundled validated snapshots | All supported analysis works with local static assets | Clear load retry; no live refresh/setup action |
| Asset failure | Missing mapping or failed image | Readable identity fallback | Analysis and navigation remain usable |

</frozen-after-approval>

## Open Questions

- Summary winner rule resolved by user: most comparison categories in a driver's favor, with equal weight per category.
- Visual reference resolved: user attached the Alonso/Ocon head-to-head graphic. See the presentation direction below.

## Head-to-Head Presentation Direction

User reference: attached Alonso/Ocon graphic, following the [original reference link](https://th.bing.com/th/id/OIP.Ohf4xV3TG0IR44A7SZB_PwHaEK?w=268&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3).

- Desktop: driver portraits flank a central dark scorecard; prominent driver names, consistent left/right identities, season context and team identities frame the metrics. Use Pit Wall typography and colors with two distinguishable series. Show each driver's own team mark for arbitrary pairs; a shared central team mark is appropriate only when both identities match.
- Current six rows: GP race head-to-head, GP qualifying head-to-head, official championship points, best GP finish, best GP qualifying rank, and GP DNFs. Qualifying classification is distinct from penalized starting grid. Use the qualifying classification; unavailable qualifying/retirement coverage must be explained.
- Race and qualifying counts include only rounds with comparable authoritative values for both drivers. State eligible round counts, ties and excluded rounds. Preserve source status and existing nonfinish rules. GP results remain separate from sprint results; championship points retain official totals, including sprint points and adjustments.
- Pair large values with a clearly labeled comparison bar and a tick/highlight for the favorable value, retaining descriptive screen-reader text without repeated visible “Better” wording. Higher wins/points are better; lower numeric finish/qualifying ranks and fewer DNFs are better. Define DNF from source retirement statuses, keeping DNS, disqualification and unavailable participation distinct.
- Bars show proportions only for comparable nonnegative counts/totals with a positive sum. Rank rows use a better-value marker instead of implying larger positions are better; zero/zero, negative totals and unavailable values use text without a misleading proportional bar.
- Mobile: compact paired portraits/names above full-width metric rows, preserving left/right identity and readable labels. Provide accessible text equivalents for bars and retain the detailed round tables below the summary.
- The example's drivers, numbers, sponsor graphics and F1 branding are reference content, not bundled product assets. Use mapped, attributed portraits/team marks and actual selected-season data.
- Overall winner counts favorable categories across the six summary rows above. Higher race/qualifying head-to-head counts and championship points win their category; lower best GP finish, best GP qualifying rank and DNF count win theirs. Award one vote per category regardless of winning margin. Keep the category set fixed; unavailable rows remain visible and excluded from scoring. Official championship position does not add a vote or break a tie.

## Code Map

- `app/client/App.tsx`: existing standings/progress/compare, request helper, selectors and shared season state. Extract presentation components rather than duplicate data semantics.
- `app/shared/selectors.ts`: `progress`, `finalStandings`, `teammate`, `resultText`; reuse official values and round alignment.
- `app/shared/contracts.ts`: normalized snapshot contracts remain authoritative and provider-independent.
- `app/client/style.css`: existing responsive layout and visual tokens.
- `.cache/seasons/{2010,2021}.json`: validated source cache envelopes; export only snapshot payloads for publication, not process logs or credentials.
- `tests/dashboard.spec.ts`, `tests/fixtures.ts`, shared selector tests: regression foundation.
- `vite.config.ts`, `package.json`: introduce explicit hosted build without replacing the local production server.

## Tasks & Acceptance

**Execution:**

The checked tasks below record the original shipped release. They do not establish completion of the accepted review corrections.
- [x] `app/shared/comparison.ts` and its tests — define one reusable metric-direction, tie, availability and summary policy.
- [x] `app/client/ComparisonSummary.tsx`, `app/client/App.tsx`, `app/client/style.css` — summary and cell highlights with visible and accessible explanations.
- [x] `app/client/EvolutionChart.tsx`, `app/client/App.tsx` — graph with selectable drivers or constructors, metric selector, cumulative-points default, keyboard inspection and matching table. Keep categories separate to preserve useful scales.
- [x] `public/media/`, `app/client/media.ts`, `public/media/credits.json` — acquire and map reusable logos/portraits and provide credits and fallbacks.
- [x] `app/client/data-source.ts`, `scripts/export-site.mjs`, `vite.config.ts`, `package.json` — static hosted data mode with export-time validation and retained local API mode.
- [x] `.openai/hosting.json` and an isolated Site source checkout — register once, package exact source, publish privately, verify returned deployment state.
- [x] `tests/dashboard.spec.ts`, `README.md`, `_bmad-output/implementation-artifacts/second-iteration-verification.md` — exercise analysis and hosted mode, document operation and evidence.

**Acceptance Criteria:**
- Given two valid drivers, when Compare opens, then the summary states its winner criterion and the component counts and available sample sizes.
- Given category-win totals of 4–2, when the summary is displayed, then the driver with four favorable categories is the overall winner regardless of championship position or winning margins.
- Given tied or unavailable categories, when scoring the summary, then neither driver receives a vote for those categories; equal totals show a draw, and zero comparable categories show insufficient data. Display tied and unavailable category counts alongside the score.
- Given Leclerc and Russell in 2021 Bahrain, when their available qualifying and GP results are displayed, then Leclerc's better values are highlighted with a non-color indicator.
- Given multiple selected drivers or teams, when the metric or season changes, then chart, labels and table agree without bridging unavailable values.
- Given the hosted build, when every F1 API and external image request is blocked, then both bundled seasons and all analysis remain usable.
- Given an authorized corrected release, when publication finishes, then its returned URL remains accessible to anyone with the link as subsequently requested by the user.

**Accepted-feedback work — not implemented:**
- [ ] Inventory and maximize logos for every 2010/2021 constructor; record real-image counts, provenance, visual checks and individually investigated exceptions.
- [ ] Inventory and maximize driver photographs for both seasons; record real-image counts, photograph dates, provenance, visual checks and individually investigated exceptions.
- [ ] Replace best starting grid with best GP qualifying rank in the shared summary policy and UI; verify qualifying 2 / penalized grid 7 uses 2, conservative coverage, equal votes and precise unavailable reasons.
- [ ] Remove visible “Better” labels from summary/detail markers; verify retained ticks, highlights, accessible descriptions, ties and unavailable values.

Detailed Given/When/Then criteria are in the [acceptance correction companion](../specs/spec-iteration-two-feedback/acceptance-corrections.md). No code, asset acquisition, rebuild or deployment is part of this documentation update.

## Implementation Notes

- Architecture contract: [updated architecture spine](../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md), especially AD-9 through AD-12. One shared analysis client has two build-selected data adapters: the existing local Node API with refresh, and static bundled snapshots for private ChatGPT Sites hosting.
- Hosted export validates exactly the approved 2010/2021 snapshots, preserves source timestamps, and ships data/media in one immutable release. Hosted loading never falls back to the API. Refreshing local data requires a new export/publication to update the Site.
- Schema v1 already provides GP qualifying classification. Use it for best GP qualifying rank; remove the starting-grid category and its schema-unavailable explanation. Do not add grid fields or use penalized grid positions. Keep centralized retirement interpretation and conservative season-total coverage checks.
- Retain the local build/server. Prepare a sanitized isolated Site checkout with its own hosted build and returned hosting identity; exclude raw cache envelopes, credentials and logs. Follow Sites packaging/private-deployment contracts and record terminal deployment evidence.
- Architecture update only: implementation and publication remain pending. The commands below are required verification targets, not evidence that iteration two has passed.

## Spec Change Log

- 2026-10-29: User accepted four live-review corrections within the same sprint: maximize verified constructor logos and driver photographs with measured coverage/individual exceptions; replace best GP starting grid with best GP qualifying rank before grid penalties; remove visible “Better” labels while retaining ticks/highlights and screen-reader descriptions. User requested spec recording only; implementation remains pending. Earlier grid requirements are superseded. Anyone-with-link publication is the existing separately authorized audience.

- 2026-10-29: Winston aligned the architecture with the approved private bundled-data hosting plan, retained local refresh, and recorded export, shared-analysis, media and publication boundaries. Frozen intent and acceptance scope are unchanged.

- 2026-10-29: User approved the iteration-two plan, including the reference-inspired six-category summary, category-vote winner rule, charts, comparison highlights, imagery and private bundled-data publication. Implementation and verification remain pending.
- 2026-10-29: User selected most favorable comparison categories as the overall winner rule. Replaced championship-position recommendation with equal category votes, explicit draws and unavailable-data handling; retained the supplied Alonso/Ocon visual direction.

## Review Triage Log

### Independent implementation review ? 2026-10-29

| Finding | Verdict | Evidence / disposition |
|---|---|---|
| Blind: B-winning score ordering | medium | Corrected verdict to show leader score first while A/B row identities stay fixed. |
| Blind: unavailable session plotted | medium | Shared projection now checks availability; retained-record fixture verifies graph gaps. |
| Blind: missing participation accepted as complete | false | Schema v1 cannot prove absent participation; approved design explicitly requires conservative per-driver unavailable totals. Existing verified cache checksums reject record loss, and upstream page completeness is already tested. No new source metadata is authorized. |
| Blind: invalid numeric positions | medium | Added positive-integer validation for positions while preserving fractional/negative points; regression test passes. |
| Blind: unknown snapshot metadata exported | medium | Exporter constructs nested public payload allowlist; injected fields excluded in passing test. |
| Blind: unrelated public files copied | medium | Site preparation copies only current release and credited media; generated-source test excludes unrelated sentinel. |
| Blind: damaged existing release reused | high | Export compares staged and existing bytes/tree before manifest promotion; corrupt/missing payload/media tests pass. |
| Blind: incomplete media provenance validation | medium | Complete asset/fallback fields validated before export; malformed-contract cases rejected. |
| Blind: keyboard omits values | medium | Intentional keyboard announcement includes each selected entity value/status; focused browser test passes. |
| Blind: removed graph selections silent | medium | Accessible guidance names absent IDs while compatible selections persist; browser test passes. |
| Edge: unavailable session plotted | medium | Same projection defect fixed and tested; separate finding retained in log. |
| Edge: damaged existing release reused | high | Same exporter defect fixed and tested; separate finding retained in log. |
| Verification: rendered metric-axis direction | medium | Browser test observes SVG circle y coordinates after rank and points selection. |
| Verification: isolated source not exercised | medium | New executable source-preparation test preserves identity, excludes server/cache and builds generated checkout from sanitized data. |


## Verification

Planned checks to run after implementation; no iteration-two pass is claimed by this document.

- `npm.cmd run build` — TypeScript and local production build pass.
- `npm.cmd test` — existing regressions and new comparison-policy cases pass.
- `npm.cmd run test:e2e` — existing navigation/data tests plus summary, chart, imagery fallback and bundled-mode scenarios pass.
- Sites packaging/build checks and returned terminal deployment success verify publication; record URL and visibility.

## Build execution evidence ? 2026-10-29

Approved baseline and parallel isolated-worktree execution followed. Three implementation tracks integrated and independent blind/edge/verification reviews triaged above. Local build, 40 unit tests, 18 local browser tests and 2 hosted browser tests passed. Isolated sanitized source default build and local deployment archive preparation passed. External source synchronization was rejected by automatic approval review pending explicit source-export authorization. No deployment or URL access success is claimed. See second-iteration-verification.md for retained identity and recovery.

## Publication completed ? 2026-10-29

User explicitly selected anyone with the link, superseding original private-only audience for this publication. Source synchronized at 4b05d2bf49f586e0630136dd48f953c8635cf204. Version 1 deployed successfully as appgdep_6ae30174a1508191944de15fed0b9d0e. URL: https://f1-pit-wall-yannick.navyelf64.chatgpt.site. Access mode public confirmed by native update result.
