---
title: "Start fresh when changing season"
status: done
created: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
context:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
story_key: 7-2-start-fresh-when-changing-season
source: ../planning-artifacts/epics-next-iteration-feedback.md
---

## Required build context

Read ../specs/spec-next-iteration-feedback/SPEC.md and every companion listed there, plus the source epic. Paths are relative to this story folder. Acceptance criteria here are the story slice; the canonical spec and companions retain authority. Preserve existing planning/worktree edits. No publication is included.

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

## Development record

Implementation and independent review completed. Final integration evidence below supersedes earlier pending notes; human acceptance is tracked separately as review.

## Tasks & Acceptance

- [x] Acceptance criterion 1 implemented and verified.
- [x] Acceptance criterion 2 implemented and verified.
- [x] Acceptance criterion 3 implemented and verified.
- [x] Acceptance criterion 4 implemented and verified.

## Verification

Progress navigation/history/rapid-year browser checks and two direct stale-context component tests passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B8 | medium / patch - Extracted the internal guard used by App; tests show an old generation cannot invoke URL/history mutation after year roundtrip/history/category/snapshot changes, while the current context can. Existing browser roundtrip and delayed-response checks also pass. |
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.
