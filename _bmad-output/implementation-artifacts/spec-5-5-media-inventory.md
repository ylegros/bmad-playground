---
title: '5.5 Inventory canonical season imagery with honest coverage'
type: feature
created: '2026-10-30'
status: 'done'
route: dispatch
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="User authorized remaining stories, reversible implementation choices and parallel execution">

## Intent

Make every canonical driver/constructor season slot accountable through validated image inventory and accessible credits. Existing generic fallbacks are not investigated exceptions. Preserve credited baseline files and mappings while exposing actual/total, investigated exceptions and unresolved slots separately.

## Boundaries & Constraints

Keep canonical identities and season-specific applicability. Never generate likenesses/logos, use name joins or claim future-year acquisition from baseline evidence. Files must be local, decodable and byte-identified; provenance must include source/license/attribution, photograph date and crop notes. Structured exceptions require attempted source URLs, specific blockers and visual-check evidence; user acceptance remains separate. Credits must close by keyboard and return focus to the invoking control. Do not edit App, server, shared contracts/evidence, planning or sprint tracking. Dirty working tree and approval pauses are covered by existing user authorization.

## I/O & Edge-Case Matrix

| Input | Expected |
| --- | --- |
| Valid mapped file and complete provenance | Count once in the full canonical kind/year denominator; retain hash/dimensions |
| Reused image | Count each applicable season slot independently, disclose actual photo date |
| Missing/corrupt file, bad provenance, wrong season/identity or duplicate mapping | Reject, never count as acquired |
| Structured investigated exception | Count separately from actual images; never map same slot twice |
| Generic fallback or unresolved identity | Remains unresolved, strict acceptance rejects incomplete inventory |
| Open credits from summary or image details; close/Escape | Readable credits/coverage; return focus to exact trigger |

</frozen-after-approval>

## Code Map

- scripts/media-inventory.mjs: new read-only validator/report CLI, imports frozen shared validation and validates actual local bytes using browser image decode; no downloads.
- app/client/media.ts: explicit existing credits mappings; add coverage/investigation access while preserving baseline mappings.
- app/client/Identity.tsx: existing canonical identity renderer and details disclosure; add trigger-aware close and selected-season coverage disclosure.
- public/media/credits.json: existing approved provenance, preserve content. New investigations.json and inventory.json carry current tooling output separately.
- scripts/media-inventory.test.mjs and tests/media-credits.spec.ts: deterministic file/provenance/count cases plus browser keyboard focus and existing identity regressions.

## Tasks & Acceptance

- [x] Add inventory script and CLI with safe resolved paths, complete canonical slots and strict acceptance option.
- [x] Validate provenance, duplicate/wrong-season mappings, actual decoded bytes/hash and complete structured exception evidence; ignore prose-only fallbacks for investigated counts.
- [x] Surface kind/year coverage and structured exception details in credits without hiding unresolved slots.
- [x] Implement Close/Escape focus return from summary and per-driver Image details.
- [x] Run meaningful unit/type/browser checks, inspect existing mapped images, generate baseline inventory/report and write story-5-5-verification.md.

Given audited canonical entities, when inventories validate, then each slot appears once and actual/exception/unresolved counts reconcile. Given a missing or invalid file, when inspected, then it never establishes acquired imagery. Given keyboard disclosure actions, when closed, then the initiating control regains focus.

## Implementation Notes

All four agent slots are occupied; implementation follows the authored spec inline. No publication, live acquisition or user acceptance of exceptions is included. Historical 0.2 research may be linked as context but cannot silently count as fresh investigation.

## Verification

npm.cmd run check; node --test scripts/media-inventory.test.mjs; focused Vitest Identity tests; Playwright credits keyboard/focus checks. Record exact baseline counts and remaining unknowns separately.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
