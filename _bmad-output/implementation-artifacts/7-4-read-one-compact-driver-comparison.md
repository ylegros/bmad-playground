---
title: "Read one compact driver comparison"
status: done
created: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
context:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
story_key: 7-4-read-one-compact-driver-comparison
source: ../planning-artifacts/epics-next-iteration-feedback.md
---

## Required build context

Read ../specs/spec-next-iteration-feedback/SPEC.md and every companion listed there, plus the source epic. Paths are relative to this story folder. Acceptance criteria here are the story slice; the canonical spec and companions retain authority. Preserve existing planning/worktree edits. No publication is included.

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

## Development record

Implementation and independent review completed. Final integration evidence below supersedes earlier pending notes; human acceptance is tracked separately as review.

## Concurrent implementation ownership

Own ComparisonSummary.tsx, its dedicated style file and comparison-focused tests. Coordinator owns App.tsx and will place exact Compare copy above selectors; do not edit App.tsx or progress styles. Use a dedicated stylesheet if existing CSS is shared. Preserve other active work.

## Tasks & Acceptance

- [x] Acceptance criterion 1 implemented and verified.
- [x] Acceptance criterion 2 implemented and verified.
- [x] Acceptance criterion 3 implemented and verified.
- [x] Acceptance criterion 4 implemented and verified.
- [x] Acceptance criterion 5 implemented and verified.

## Verification

Ten shared comparison policy tests and six comparison browser cases passed, including rank directions/ties/unavailable and 200% reflow. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B1 | medium / patch - Confirmed CSS offset implied inequality; tied ranks now use neutral tracks with no favorable marker. Qualifying tie browser case passes. |
| B2 | low / patch - Confirmed marker identity relied on styling; markers now display A/B, remain decorative to assistive technology and repeat no numeric score. |
| B7 | low / patch - Existing synthetic comparison test already covered zoom; added real-data 200% identity/value/evidence-keyboard assertions. Local integration passed. |
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |
| V1 | medium / patch - Qualifying browser coverage now verifies marker placement for A winning, reversed-pair B winning, tied-neutral and unavailable-neutral cases, preserving lower-rank outcomes. Targeted and full comparison cases pass. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.
