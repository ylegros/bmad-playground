---
title: F1 Dashboard MVP
status: final
created: 2026-10-29
updated: 2026-10-29
---

# F1 Dashboard MVP

## Purpose and user

A personal web application for Yannick to learn by building and exploring F1 performance. This document translates the product brief into requirements for a working MVP, followed by iteration.

Source: ../../briefs/brief-bmad-playground-2026-10-29/brief.md.

## Scope boundary

The MVP includes one selected season at a time, standings, within-season progress, driver comparisons, and manual refresh. Cross-season comparisons are the next iteration. Live timing is outside the MVP.

## Terms

- Season: one championship year.
- Round: a championship event within a season.
- Standings: championship ranking with points.
- Race result: finishing position or recorded non-finish status.

## MVP features

### Season and standings

- **FR-1:** Select one season at a time from supported seasons starting in 2010. Show the selected season consistently across views. Data-source coverage and the upper season bound remain to be verified.
- **FR-2:** View driver standings showing position, driver, constructor affiliation, and points for the selected season.
- **FR-3:** View constructor standings showing position, constructor, and points for the selected season.

### Within-season progress

- **FR-4:** View a driver's qualifying position, race result, points earned per round, and cumulative championship points in chronological order. Include sprint results and sprint points; distinguish sprint and Grand Prix results. Qualifying position refers to Grand Prix qualifying; separate sprint qualifying is outside the MVP.
- **FR-5:** View constructor points earned per round, cumulative points, and championship position round by round, including sprint points. Qualifying and race results remain driver-level measures.

### Driver comparison

- **FR-6:** Compare two drivers from the selected season, defaulting to the selected driver's latest teammate in that season while allowing any two drivers to be chosen. Keep the initial teammate visible in the ranking when it differs. The latest teammate is the teammate at the last shared event in the selected season; the initial teammate is the teammate at the first shared event.
- **FR-7:** Show both drivers' qualifying positions, race results, and points against matching rounds. Absent results are shown explicitly as unavailable rather than zero or a finishing position.

### Data refresh

- **FR-8:** Refresh data on demand through an explicit action. Automatic updates are outside the MVP.
- **FR-9:** Show loading, empty, and failed-refresh states. Retain the last successful data after a failed refresh and show its last refresh time.

## Quality expectations

- Keep round labels, season labels, and units visible so comparisons remain understandable.
- Distinguish unavailable data from real zero-point results.
- Desktop browsers are the initial layout target; core controls remain usable on smaller screens.

## Success check

The MVP succeeds when Yannick can select a supported season, inspect both standings, follow round-by-round progress, compare teammates or any two drivers, and refresh data successfully. Feature breadth should not delay that working learning milestone.

## Data source and verification

Jolpica is the approved primary source. Sample checks returned 24 race results and 24 qualifying results for 2010 Bahrain, and 20 sprint results for 2021 Britain. Details and source links are in [addendum.md](addendum.md).

## Deferred validation

- Implementation owner: verify season-wide results and standings coverage from 2010 through the latest available season, including pagination and incomplete seasons, before claiming full coverage.
- UX and implementation owners: define empty selections and teammate display details before building the comparison view; preserve the approved first/latest teammate rule.

All user-facing scope decisions are confirmed. These validation tasks carry into architecture and implementation.



## Approved first iteration — 2026-10-29

The user approved a reduced first iteration targeting eight hours: only fully verified 2010 and 2021 initially; all required metrics in accessible tables; charts, summary strip, metric previews and broad historical coverage audit deferred. These omissions supersede broader requirements elsewhere in this document for this iteration only. Keep sprint handling, official championship authority, missing-versus-zero, teammate semantics, atomic refresh and failure retention. React/TypeScript/Vite with local Node is accepted. Parallel unattended implementation uses an automated foundation check and final human review, with no intermediate human pause. The canonical contract is _bmad-output/specs/spec-bmad-playground/SPEC.md. Eight hours is a target, not a guarantee; full-MVP direction remains follow-up.

