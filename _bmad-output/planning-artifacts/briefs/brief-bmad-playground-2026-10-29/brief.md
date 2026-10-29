---
title: F1 Dashboard Product Brief
status: final
created: 2026-10-29
updated: 2026-10-29
---

# F1 Dashboard

## Purpose and audience

A personal web dashboard built as a test project for learning. The sole intended user is the project owner; commercial positioning and public adoption are not goals.

## Delivery approach

Build a working MVP first, then iterate as part of the learning project. The user approved an MVP with one selected season at a time: driver and constructor standings, round-by-round progress, driver comparisons, and manual refresh. Cross-season comparison is deferred to the next iteration.

## Product direction: MVP and later iteration

- Explore driver and constructor rankings and their evolution within a season. Driver views include Grand Prix qualifying position, race result, and points by round; constructor views show championship position, round points, and cumulative points.
- Explore driver and constructor evolution across multiple seasons, using final championship position and total points by year as the initial cross-season view.
- Cover seasons starting in 2010 using Jolpica as the primary source. Full coverage through the latest available season remains an implementation validation task.
- Compare two drivers head to head using qualifying position, race position, and points. Default to teammates, while allowing any two drivers to be selected.
- Refresh data on demand; automatic or live updates are not required.
- Show both points earned per round and cumulative points, including sprint results and points.
- Default comparison to the latest teammate, retaining the initial teammate in the rankings.

## Success and follow-up

The MVP succeeds when Yannick can select a supported season, inspect both standings, follow round-by-round progress, compare teammates or any two drivers, and refresh data successfully. Desktop is the primary layout target, with core controls usable on smaller screens. Missing results are explicit; failed refreshes preserve previously loaded data.

Jolpica coverage from 2010 onward must be verified during implementation. Cross-season comparisons remain the next iteration. Detailed requirements and source checks are captured in the PRD and its addendum.


## Approved first iteration — 2026-10-29

The user approved a reduced first iteration targeting eight hours: only fully verified 2010 and 2021 initially; all required metrics in accessible tables; charts, summary strip, metric previews and broad historical coverage audit deferred. These omissions supersede broader requirements elsewhere in this document for this iteration only. Keep sprint handling, official championship authority, missing-versus-zero, teammate semantics, atomic refresh and failure retention. React/TypeScript/Vite with local Node is accepted. Parallel unattended implementation uses an automated foundation check and final human review, with no intermediate human pause. The canonical contract is _bmad-output/specs/spec-bmad-playground/SPEC.md. Eight hours is a target, not a guarantee; full-MVP direction remains follow-up.

