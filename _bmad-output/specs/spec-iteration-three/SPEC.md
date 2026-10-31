---
id: SPEC-iteration-three
status: planning
companions:
  - season-coverage-and-acceptance.md
  - ../../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
sources: []
---

# F1 Pit Wall iteration three

## Why

The approved 0.2 dashboard repeats team names when logos are absent, covers only 2010/2021, and requires selecting progress series individually. Expand exploration to 2010-2026 and make identity and selection controls clearer.

## Capabilities

- **CAP-1**
  - **intent:** Recognize a constructor once when its logo is missing or fails to load.
  - **success:** Every constructor identity shows one accessible team-name label without an additional text-filled logo badge; mapped logos still render normally.
- **CAP-2**
  - **intent:** Explore every season from 2010 through 2026 inclusive, with standings, progress, comparison, verified logos and driver photographs.
  - **success:** All 17 years have individually audited data and coverage status. For 2026, show available completed rounds and clearly label ongoing-season data. Every driver/team-season media slot has a credited image or an individually investigated exception counted separately.
- **CAP-3**
  - **intent:** Select all current search results on Progress without selecting each driver or constructor individually.
  - **success:** A keyboard-accessible Select all action selects every search match in the active season/category once; graph, evidence table, controls and URL agree. Empty search matches all; no results changes nothing. Clear selection and Back remain functional.

## Constraints

- Follow the adopted architecture spine (AD-1 through AD-14) for shared contracts, season-to-date evidence and selection state. Follow adopted DESIGN.md for Pit Wall appearance and EXPERIENCE.md for interactions, labels and accessible states.
- Preserve approved 0.2 scoring semantics: official points, qualifying rank before grid penalties, GP/sprint separation, ties, missing versus zero and source freshness.
- Audit ingestion, historical/current-season validation and immutable export for all 17 years; a larger dropdown or silently omitted years is insufficient.
- Distinguish unheld rounds from genuine source gaps. Never invent results, substitute zero for absence or label ongoing-season standings final. Use the adopted completed-GP evidence window for season-to-date comparisons.
- Map historical logos by canonical identity and season; never substitute successor branding. Disclose photograph dates independently from selected season.
- Preserve local manual refresh, bundled hosted analysis and the existing anyone-with-link Site audience on publication.

## Non-goals

- Cross-season comparisons, live timing and years outside 2010-2026.
- Automatic background refresh or fabricated/generated logos and driver portraits.

## Success signal

A user can explore any requested year with honest coverage, see one name for a missing team logo and select all matching progress entities. Verify data and imagery per season, including completed-round analysis for ongoing 2026.

## Assumptions

- Approved tag 0.2 remains the baseline; branding and manual refresh remain.
- Select all adds search matches while retaining already selected nonmatching entities; Clear selection removes all. This interaction interpretation is carried in the adopted EXPERIENCE.md.
