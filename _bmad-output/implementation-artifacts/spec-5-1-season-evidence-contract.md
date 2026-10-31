---
title: '5.1 Validate versioned season evidence consistently'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'dispatch'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-iteration-three.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="user authorized all remaining implementation">

## Intent

Freeze and implement Story 5.1's shared v2 season evidence contract, runtime validation, explicit evidenced v1 migration and validated adapter seams. Keep approved baseline v1 usable separately while rejecting mixed generations and unknown versions. User authorizes all stories, necessary reversible choices and parallel implementation while preserving existing planning edits.

## Boundaries & Constraints

Always retain canonical identities, v1 scoring/source timestamps and `/api/v1` envelopes. Lifecycle needs independent per-session provenance; never infer from dates, missing endpoint rows or maximum round. Unknown lifecycle is representable but never verified. Freeze exact types before consumers implement against them. Root owns later service/ingestion work, another agent owns Progress/App selection. Do not edit client App/Progress, server modules, media acquisition or existing planning files. Production baseline must continue compiling; add discriminated V1/V2 types or explicit new types where needed rather than silently casting v1.

## I/O & Edge-Case Matrix

| Input | Expected |
| --- | --- |
| Valid ongoing/complete v2 fixture | Shared validators accept canonical records, ordered held-GP analysis window, UTC audit/source time and provenance |
| Unknown lifecycle | Representable pending audit, rejected for verified support/bundle |
| Duplicate/out-of-calendar window, contradictory applicability, malformed provenance or unknown version | Reject |
| Audited v1 plus explicit matching calendar/session evidence | Pure migration preserves scoring and source timestamp; records distinct migration/audit identity |
| Missing or contradictory evidence | Migration fails without mutation |
| Matching v2 fixture bundle/payload | Validate immutable metadata and same generation; no API fallback |
| Mismatched source/audit/window/schema generation | Reject |

</frozen-after-approval>

## Code Map

- `app/shared/contracts.ts`: existing v1 shapes; shared v2 ownership lives here. Retain baseline exported aliases compatibility while adding explicit versioned shapes; coordinate final choice with root.
- `app/shared/validation.ts`: v1 nested validation; factor reusable structural rules without imposing historical all-round-standings assumptions on ongoing v2. Keep legacy v1 path explicit.
- `app/client/data-source.ts`: existing local/static adapter, canonical paths and immutable validation. Add testable v2 seam or version-dispatch support without breaking v1 production; coordinate files with root first.
- `scripts/export-site.mjs`: root handles full export later; do not promote fixture subsets.

## Tasks & Acceptance

- [ ] `app/shared/contracts.ts` — define discriminated v2 audit, lifecycle, ordered window, support/bundle and media slot contracts; provide root exact public API immediately when settled.
- [ ] `app/shared/validation.ts` and/or new shared evidence module — runtime validate every matrix row with canonical references, timestamps and provenance; validate windows equal independently held GP rounds including source gaps.
- [ ] New shared migration tooling — explicit pure evidence-backed v1 migration, no implicit default completion or input mutation.
- [ ] Fixture-backed local/bundled adapter validation seams — prove valid v2 load and generation rejection with saved tests, keep v1 baseline usable.
- [ ] Focused tests — exercise every matrix row, run relevant unit/type checks and record results in a separate `story-5-1-verification.md`.

Given valid evidence when each validator runs then all consumers get consistent semantics. Given invalid or mixed versions when loaded then fail closed without replacing good data. Given migration evidence when applied then original points and source time remain unchanged.

## Implementation Notes

Full canonical baseline will be captured before dispatch. No external acquisition or publication belongs to this story. Root integrates review and sprint tracking.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
