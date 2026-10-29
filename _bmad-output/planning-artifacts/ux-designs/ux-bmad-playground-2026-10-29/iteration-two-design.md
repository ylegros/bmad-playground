---
title: Pit Wall — iteration two UX handoff
status: final
updated: 2026-10-29
sources:
  - ../../../specs/spec-iteration-two-feedback/SPEC.md
  - ../../../specs/spec-iteration-two-feedback/acceptance-corrections.md
  - ../../../implementation-artifacts/spec-second-iteration.md
  - ../../architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - ../../epics.md
  - DESIGN.md
  - EXPERIENCE.md
---

# Iteration two design

Current authority: the [accepted correction spec](../../../specs/spec-iteration-two-feedback/SPEC.md) and [acceptance companion](../../../specs/spec-iteration-two-feedback/acceptance-corrections.md) supersede conflicting earlier requirements. The [architecture spine](../../architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md) AD-10 through AD-12 and [revised stories](../../epics.md) carry the aligned handoff. Original release checks remain historical; correction implementation and runtime acceptance remain pending. Preserve the current anyone-with-link audience. This update authorizes no acquisition, code, build or publication.

The approved second-iteration spec owns scope and scoring. DESIGN.md owns existing visual tokens and EXPERIENCE.md owns existing navigation. This supplement proposes layout and interaction details for the new work; it supersedes first-iteration deferrals only for the features explicitly approved in the new spec. No product implementation or publication is implied by this handoff.

## Summary: verdict, then evidence

Keep Compare's two labeled driver selectors above a single full-width summary. Desktop composition is a portrait column, central six-row scorecard, and second portrait column. Both driver names remain visible in the central column headers, so values never require looking across the screen to identify their owner. Use each driver's season-relative team name and mapped team mark. Multiple constructor affiliations must remain readable; do not imply the latest team represents every round.

Above the rows show “{name} leads {a}–{b} on category wins” or “Draw: {a}–{b}”. Immediately below: “Each category has equal weight. {n} comparable of 6 · {t} tied · {u} unavailable.” Comparable includes tied categories; a category awards a vote only when both values are available and unequal. No comparable categories shows “Insufficient data” without a winner or draw. An invalid pair shows selection guidance instead of the summary.

| Fixed row | Direction | Supporting evidence |
|---|---|---|
| GP race head-to-head | Higher count | Eligible rounds, ties and excluded rounds |
| GP qualifying head-to-head | Higher count | Eligible rounds, ties and excluded rounds |
| Official championship points | Higher total | Includes sprint points and official adjustments |
| Best GP finish | Lower classification | Round name and source status where relevant |
| Best GP qualifying rank | Lower authoritative GP qualifying classification | Round name, qualifying sample size and coverage; independent of grid penalties |
| GP DNFs | Lower count | Defined retirement statuses and participation coverage |

Best GP qualifying rank requires a complete qualifying session and an authoritative numeric driver record at every scheduled GP before an unqualified season best is available (AD-10). Qualifying 2 followed by grid 7 uses 2. Incomplete coverage gives a qualifying-specific unavailable reason and count; never retain the schema-v1 missing-starting-grid explanation. GP qualifying head-to-head remains a separate category.

Each row reads left value / metric label / right value. Favorable values show a visible tick and highlight without a repeated visible Better label. Hide the decorative tick from assistive technology; screen-reader text names driver, metric, value and favorable direction. Ties read Tied; missing values read Unavailable with a reason. Keep all six rows visible. DNF totals require complete status coverage; DNS and disqualification are not retirements. Incomplete evidence never silently becomes a season-wide record.

Use proportional two-part bars only for comparable nonnegative head-to-head counts or points with positive sum. Label each segment numerically. Bars have a common total width within their row but are not comparable across different measures. Zero/zero, negative totals and missing values use text only. Finish and qualifying-rank rows use markers without proportional bars. DNF counts may use text and a better-value marker to avoid suggesting that a longer bar is desirable.

At widths below 1024px, move the paired identity cards above the scorecard. Below 768px, selectors stack, identity cards stay paired, and each metric occupies a full-width row with wrapping label above two labeled values. Portraits shrink before text does. Keep A left and B right at every width. No mirrored portrait manipulation, decorative sponsor panels or central shared logo for unrelated teams.

## Graphs: choose a question, inspect a round

Progress gains a graph above its existing evidence table. Control order: entity category (Drivers / Constructors), labeled entity picker with selected items, then metric. Default to cumulative points. Keep driver and constructor selections separate; changing category offers only its valid measures. Preserve compatible choices across metric changes. Proposed selection UI: a search field plus labeled native checkboxes; selected names remain visible and removable without reopening a menu. No arbitrary selection cap; large selections wrap and can be reduced using “Clear selection”. Empty selection reads “Choose at least one driver” or “Choose at least one constructor”.

The chart heading includes season, metric and units. Label the horizontal axis with chronological round numbers and expose full event names through inspection and the table. Points increase upward; positional metrics put 1 at the top. Use only existing supported selectors and source semantics; no smoothed curves or interpolation. Missing values break paths. A recorded numeric classification can plot with its source status; absent classification produces a gap. GP and sprint rankings remain separate metrics. Round/cumulative points explicitly explain their inclusion of sprint points.

Use {colors.series-a} solid and {colors.series-b} dashed for the first pair; additional series require distinguishable dash/marker combinations and named legend entries. Legend shows full names and samples of the line/marker style. Identity assignment stays stable during inspection and metric changes. Do not depend on team colors. With crowded selections, allow a wider locally scrollable plot while keeping controls and explanatory text within the page width.

One focusable inspection control uses Left/Right to move by round, Home/End for first/last. Visible instruction explains these keys. A persistent detail panel lists selected round, event, each entity's value and any source status, including Unavailable. Pointer selection uses the same detail panel. Do not place every plotted point in the Tab order. The matching semantic table follows immediately; it exposes every round and selected entity without hover. Announce inspection succinctly after intentional keyboard input, not on pointer movement.

## Highlights: better values without losing meaning

Retain existing table headers, alignment and source text. A favorable cell gets a subtle series-colored edge, bold numeric value and a visible tick, without a visible Better label. The tick is aria-hidden. Screen-reader wording names driver, metric, value and direction, for example: Leclerc, GP qualifying rank 4, lower is favorable within this pair. Brand red remains navigation/action color.

Apply the shared policy independently to each comparable measure: lower qualifying/classification position, higher points. GP and sprint values never compete against one another. Tied cells retain ordinary styling and expose “Tied” in comparison context. Missing values retain Unavailable; no favorable marker appears for either side. Preserve numeric source classification and status together, such as “17 · Retired”; do not invent a finishing position from status alone. Include a short table legend: Tick = favorable value within this pair; ties and unavailable values have no marker.

## Imagery: recognition with honest provenance

Use mapped portraits in comparison identities and compact team marks beside season-relative affiliations in standings and comparison. Graph legends stay text-first; images must not reduce plot space. Proposed portrait treatment: consistent 4:5 frame, neutral {colors.frame} background, face-safe crop, no retouching or artificial period styling. Team marks use contain sizing in a fixed box rather than stretching or cropping. Reserve dimensions before load to prevent layout shifts.

Bundle every usable image locally. The asset record needs entity ID, applicable season/constructor mapping, original source URL, creator, license, attribution, portrait date or “date unknown”, local filename and crop notes. “Portrait from {year}; selected season {season}” belongs in an adjacent image-details/credits disclosure when dates differ; never imply the image was taken in the selected season. Record unknown dates explicitly. Do not use generated likenesses or logos for these identity slots.

Missing mapping, unusable license or image-load failure replaces the image with named initials or a text team label inside the same frame. Full identity text remains beside the image. Use empty alt text when that adjacent text provides the same identity; any image conveying additional information needs equivalent descriptive text. A visible “Image credits” link opens locally bundled provenance with attribution as required. Never substitute an unrelated current team for a historical constructor.

### Acquisition coverage and visual proof

Target every driver/season and constructor/season in verified 2010/2021 snapshots with actual verified photographs and historically appropriate logos. Maximize coverage; no reduced percentage or fallback-only completion is pre-approved. Each coverage slot (kind, canonical identity, season) is either mapped to a valid local image or an investigated fallback. A verified photograph can count once per applicable season slot with honest date/unknown disclosure.

The implementation record _bmad-output/implementation-artifacts/second-iteration-media-coverage.md must inventory every slot, mapped filename or individually investigated exception, attempted source URL, specific blocker and visual-check outcome alongside provenance. Report actual mapped photographs/total drivers and mapped logos/total constructors separately for each season; report fallback counts separately. Generic `not vetted` reasons and successful fallback tests do not establish acquisition coverage. Remaining exceptions require user review during acceptance.

Inspect actual faces/logos for correct identity, historical suitability, legibility and face-safe crop/logo containment at desktop, narrow widths and 200% zoom. Verify local media and credits with external requests blocked. Schematic mock portrait/logo blocks supply no acquisition or visual proof. This documentation update claims no acquired assets or runtime evidence.

## Bundled mode and states

The hosted header reads “Bundled season data · Snapshot {date, time, timezone}”. Use the verified data snapshot timestamp, not deployment time. If seasons have different snapshot dates, show the selected season's date. Hosted load failure offers “Retry loading bundled data”; it exposes no API setup or live refresh. The local edition retains its existing refresh and retained-snapshot behavior. Image failure never blocks analysis. Preserve the current anyone-with-link audience. Sites requires network access and does not guarantee disconnected browsing.

All new controls retain 44px targets where practical and the existing {colors.focus} ring. Verify chart strokes, markers, focus and highlight labels against adjacent surfaces. Respect reduced motion; render charts without animated transitions. At 200% zoom and narrow widths, names and controls wrap; only dense tables/plots scroll locally.

## Review reference and handoff checks

[Layout reference](mockups/iteration-two.html) illustrates summary hierarchy, graph treatment and tick-only cell markers. All displayed identities and numbers are fictional fixtures; schematic portrait/logo blocks show stable frames, not actual-image acquisition coverage or visual proof. This document and the existing spines govern implementation over the mock.

- Check 4–2, equal scores, ties, partly unavailable categories and zero comparable categories; championship rank never changes the verdict.
- Check identical drivers, no selected entities, long names and multi-constructor seasons.
- Check Bahrain 2021 Leclerc/Russell against authoritative data during implementation; the mock supplies no verification evidence.
- Inspect every round by keyboard and compare chart values with the table; test rank-axis direction and missing-value gaps.
- Check narrow reflow, zoom, focus visibility, contrast, image failures and local credits.
- Block external F1 and image requests in the hosted build; verify both approved seasons and bundled-mode messaging.

Existing layout assumptions remain nonblocking implementation defaults. Asset acquisition, reuse evidence and runtime verification remain pending. The optional full UX review remains skipped per the prior recorded preference; document coverage, input reconciliation and required structure/prose checks were completed for this update. No new visual direction or runtime acceptance is claimed.
