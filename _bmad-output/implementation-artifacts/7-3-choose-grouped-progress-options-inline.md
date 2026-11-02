---
title: "Choose grouped progress options inline"
status: done
created: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
context:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
story_key: 7-3-choose-grouped-progress-options-inline
source: ../planning-artifacts/epics-next-iteration-feedback.md
---

## Required build context

Read ../specs/spec-next-iteration-feedback/SPEC.md and every companion listed there, plus the source epic. Paths are relative to this story folder. Acceptance criteria here are the story slice; the canonical spec and companions retain authority. Preserve existing planning/worktree edits. No publication is included.

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

## Development record

Implementation and independent review completed. Final integration evidence below supersedes earlier pending notes; human acceptance is tracked separately as review.

## Tasks & Acceptance

- [x] Acceptance criterion 1 implemented and verified.
- [x] Acceptance criterion 2 implemented and verified.
- [x] Acceptance criterion 3 implemented and verified.
- [x] Acceptance criterion 4 implemented and verified.
- [x] Acceptance criterion 5 implemented and verified.
- [x] Acceptance criterion 6 implemented and verified.

## Verification

Seven progress-model tests and 13 Progress browser cases, including grouped duplicates, filtering, full-field and narrow/200% checks, passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.
