---
title: '5.4 Read audit status and season-to-date evidence on every surface'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'oneshot'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
context: []
---

<frozen-after-approval reason="user authorized all remaining stories and parallel implementation">

## Intent

Integrate shared v2 validators and domain selectors into client adapters and every analysis view. Preserve baseline v1 release as an explicitly versioned path. Offer17 candidate coverage statuses, verified-only analysis, latest verified default and no automatic broad acquisition. Show Ongoing / Season to date, exact analyzed GP rounds/samples, Current vs Final standings with official source round/lag and zero-GP/pre-GP evidence. Distinguish Not held, Cancelled, Not applicable and source Unavailable. Commit snapshot and derived support metadata together, preserve last good data on failure, and keep delayed manifests from overwriting current generations. Preserve accessible styling, semantic tables, keyboard operation and narrow/200% layouts. No publication.

</frozen-after-approval>

## Implementation Notes

- Existing client App/operations owns snapshots/generations; preserve Epic6 selection reconciliation/guards. New shared/versioned.ts combines explicit v1/v2 runtime validation and pure committed-support merge; no permissive version casts.
- Main static adapter validates complete17-year v2 bundle or separate approved v1 release, never mixes versions or falls back to API. Dedicated evidence-data-source remains fixture seam.
- SeasonEvidence provides lifecycle/window/coverage disclosure; standings captions and selectors use bounded official source.
- Tests include versioned metadata merge, malformed generations, ongoing/zero/pre-GP labels and retained failed-refresh states against saved fixtures; live provider coverage belongs to year audit stories.

## Final verification — 2026-10-31

Full unit suite: 66 Node tests and 19 Vitest tests passed. TypeScript and production build passed. Core browser matrix: 28 passed. All17 real source audits and local real-snapshot browser checks passed; see iteration-three-data-coverage.md. Integrated review findings and patches are recorded in spec-iteration-three-core-integration.md. Ready for human review; static release and media exception acceptance remain separate.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
