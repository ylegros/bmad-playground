---
title: "Recognize teams with one standings identity"
status: done
created: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
context:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
story_key: 7-1-recognize-teams-with-one-standings-identity
source: ../planning-artifacts/epics-next-iteration-feedback.md
---

## Required build context

Read ../specs/spec-next-iteration-feedback/SPEC.md and every companion listed there, plus the source epic. Paths are relative to this story folder. Acceptance criteria here are the story slice; the canonical spec and companions retain authority. Preserve existing planning/worktree edits. No publication is included.

### Story 7.1: Recognize teams with one standings identity

As Yannick,
I want a team logo when available and a team name otherwise,
So that standings remain clear without duplicate labels.

**Requirements:** FR1, UX-DR1, NFR1; AD-1/11. **Dependencies:** None.

**Acceptance Criteria:**

1. **Given** a usable season-mapped team logo, **When** either standings category renders, **Then** the logo is the only visible team identity **And** its accessible name identifies the team once.
2. **Given** missing/unmapped/failed logos, **When** identities render or an image fails, **Then** the readable team name appears alone **And** there is no broken image, empty badge or duplicate accessible name.
3. **Given** a previously failed logo, **When** canonical identity or season changes, **Then** failure state is reconciled for the new image **And** other surfaces retain their existing named identities.
4. **Given** keyboard, narrow and 200% inspection, **When** both standings categories are used, **Then** identity and row actions remain readable and operable.

**Implementation boundary:** Shared ConstructorIdentity in app/client/Identity.tsx, mappings in media.ts and standings callers; explicit presentation mode rather than view-specific fallback logic. Preserve provenance/coverage counting and other affiliations.

**Verification:** Target existing media tests/browser coverage for both standings categories, forced image failure and identity change. Do not count text fallback as acquired imagery.

## Development record

Implementation and independent review completed. Final integration evidence below supersedes earlier pending notes; human acceptance is tracked separately as review.

## Concurrent implementation ownership

Own Identity.tsx, media identity tests and a dedicated standings identity browser test. The coordinator owns App.tsx and will wire the explicit Standings mode into both categories; report the prop interface without editing App.tsx. Preserve other active work.

## Tasks & Acceptance

- [x] Acceptance criterion 1 implemented and verified.
- [x] Acceptance criterion 2 implemented and verified.
- [x] Acceptance criterion 3 implemented and verified.
- [x] Acceptance criterion 4 implemented and verified.

## Verification

Constructor identity component tests; standings identity and real network-failure media browser cases passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B9 | false - tests/identity-checks.ts aborts real initial media requests across all surfaces; tests/media.spec.ts invokes it and passed. Dispatched errors additionally cover retained-node recovery. |
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.
