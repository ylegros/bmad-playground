---
title: "Prepare matching local and bundled season evidence"
status: done
created: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
context:
  - ../specs/spec-next-iteration-feedback/SPEC.md
  - ../specs/spec-next-iteration-feedback/acceptance.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
story_key: 8-2-prepare-matching-local-and-bundled-season-evidence
source: ../planning-artifacts/epics-next-iteration-feedback.md
---

## Required build context

Read ../specs/spec-next-iteration-feedback/SPEC.md and every companion listed there, plus the source epic. Paths are relative to this story folder. Acceptance criteria here are the story slice; the canonical spec and companions retain authority. Preserve existing planning/worktree edits. No publication is included.

### Story 8.2: Prepare matching local and bundled season evidence

As Yannick,
I want the prepared bundled edition to contain the verified local 2026 evidence,
So that both editions support the same analysis cutoff.

**Requirements:** FR2, UX-DR7, NFR2/4; AD-5/9/12/13. **Dependencies:** 8.1.

**Acceptance Criteria:**

1. **Given** the verified local snapshot from 8.1, **When** the existing all-season exporter stages a release, **Then** the 2026 payload and manifest agree on snapshot ID, window/cutoff, audit provenance and source timestamps **And** other required verified seasons and credited media remain available.
2. **Given** refreshed local data and a failed export, **When** staging rejects input, **Then** the previous bundle remains intact **And** the successful local commit is not rolled back.
3. **Given** a prepared bundled build with external requests blocked, **When** all three surfaces load and the 2026 cutoff is inspected, **Then** evidence matches the local payload **And** static retries never fall back to live APIs; export time is distinct from source time.
4. **Given** completed story checks, **When** the handoff is prepared, **Then** it records source cutoff, snapshot/release identity, relevant commands/results and remaining gaps **And** no publication is claimed or performed.

**Implementation boundary:** Existing scripts/export-site.mjs, shared bundle validator and bundled data adapter; stage a complete immutable all-season release. No new hosting identity/audience or deployment operation.

**Verification:** Existing exporter failure/identity tests and local/bundled builds; targeted season evidence and static release browser checks. Final integration exercises all six capabilities in both modes if Epic 7 has landed; otherwise validate current UI and repeat only affected integration when Epic 7 lands.

## Development record

Prepared immutable all-season release `04c81966efc563f6ad028783` from the verified local cache. All 17 payloads match their local public projections, with matching snapshot/window/audit/source metadata. Real failed export retained previous manifest and refreshed local bytes. Added the newly required credited Hirakawa portrait and regenerated strict media inventory; existing 44 accepted exceptions remain. Exporter regression tests 2/2 and TypeScript check passed; isolated bundled build passed at `dist-next-iteration-bundled`. See [delivery evidence](8-2-delivery-evidence.md) and [machine-readable verification](next-iteration/bundle/verification.json). Coordinator owns final browser integration; no publication performed or claimed.

## Current dependency and concurrent execution

Story 8.1 validated local .cache/seasons-v2/2026.json, snapshot 9f3d2828-fe3b-4782-a84d-17130ad511be, GP round 19 Mexico. Read next-iteration/data/2026-refresh.json as dependency evidence. Own exporter/bundle preparation, bundle delivery evidence and dedicated bundled verification. Do not run Vite build into shared dist or start browser servers concurrently with coordinator tests. You may export into the existing public release tree, validate all17 payloads and make a separate hosted build output directory if needed. Do not publish. Do not edit UI, canonical spec or sprint tracking.

## Tasks & Acceptance

- [x] Acceptance criterion 1 implemented and verified.
- [x] Acceptance criterion 2 implemented and verified.
- [x] Acceptance criterion 3 implemented and verified.
- [x] Acceptance criterion 4 implemented and verified.

## Verification

All17 payload equality, credited media validation, expected export-failure byte/hash retention, isolated bundled build and three static browser cases passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B3 | false - exportSite validates snapshots, manifest and credited media and atomically promotes only a complete valid release. Delivery assertions inspect that validated output; they are not the export validation boundary. A concurrent later local refresh can make the payload comparison fail without invalidating the immutable release. |
| B4 | low / patch - Delivery helper now requires ENOENT with missing-delivery-media in the failed path; successful run proves the intended failure was exercised. |
| B5 | low / patch - Added before/after hashes of every prior release file, in addition to exact manifest and local-cache bytes. Actual delivery run passed. |
| B6 | low / patch - Static assertions now derive cutoff/count from the fresh acquisition receipt and snapshot, while delivery evidence retains the factual round. |
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.
