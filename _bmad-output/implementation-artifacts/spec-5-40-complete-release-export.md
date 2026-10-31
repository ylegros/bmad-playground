---
title: '5.40 Prepare one complete immutable all-season bundle'
type: 'feature'
created: '2026-10-30'
status: 'done'
route: 'dispatch'
baseline_commit: '7d91d16c390f8286d6cbbec5e47a36aab4b1f12d'
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-iteration-three.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-5-context.md'
---

<frozen-after-approval reason="user authorized implementation of all stories and parallel work">

## Intent

Implement complete immutable v2 export and sanitized source preparation for Story5.40. Full acceptance remains open until all17 real snapshots/media inventories and actual static checks pass. Preserve separately usable approved v1 release/build path; add explicit iteration-three command rather than silently substituting baseline or fixtures for full release.

## Boundaries & Constraints

Own scripts/export-site.mjs and export tests, prepare-site-source.mjs and tests (coordinate media agent finishing explicit inventory inputs), package.json explicit export/build iteration-three commands and your story5-40-verification.md. Do not edit App/shared/server/media files or main tracker; root owns integration and acquisition. No publication, hosting identity/audience change, source data downloading or v1 cache mutation. Never promote partial or corrupt release over prior good manifest.

## I/O & Edge-Case Matrix

| Input | Expected |
| --- | --- |
| Exactly2010–2026 verified v2 snapshots and complete validated credited slots | One bundleVersion2 immutable manifest/release with matching audit/window/lifecycle/source fields |
| Missing/unverified year, v1 mixed generation, malformed endpoint audit/media provenance | Fail naming year/slot before manifest promotion |
| Changed media bytes/metadata | New content-addressed release identity; source time not replaced by export time |
| Valid same release | Static data+images same-origin, no API fallback |
| Existing good release then invalid new input | Good manifest/release retained |

</frozen-after-approval>

## Code Map

- shared/evidence.ts has validSnapshotV2/supportEntryV2/validBundledManifestV2/validBundledSnapshotV2; fixture validator permits subsets so exporter enforces exact17.
- scripts/export-site.mjs publicSnapshot currently strips new fields and validates v1 exact2; maintain explicit v1 baseline path, implement v2 sanitization with whitelist nested audit/session provenance.
- scripts/media-inventory.mjs media agent implements file decode/hash/provenance/coverage contracts; coordinate interface and use same authoritative validator rather than invented parallel schema. Existing credits.assets canonical mapping, inventory.json coverage and investigations.json structured exceptions stay same release.
- Existing source helper copies whitelisted browser/shared/media inputs and preserves hosting identity; export v2 sanitized payloads and required inventory inputs without server/raw envelopes/secrets/logs/original git metadata.

## Tasks & Acceptance

- [x] Explicit v2 export path rejects subset/v1 mix, stages validated17 snapshots plus media and copies all required static inputs.
- [x] Preserve all recorded v2 metadata using sanitization; exact manifest metadata equals source, source timestamp remains separate from export.
- [x] Atomic content-addressed release + corruption/invalid-input/retention tests with saved synthetic17-year fixtures; declare fixtures are tests only, never release actual product snapshots.
- [x] Extend isolated source helper explicit v2 option so build works from declared sanitized inputs; retain existing Site identity/audience configuration and v1 default behavior.
- [x] Focused tests and typecheck; record code readiness versus still-open actual acquisition/acceptance obligations. Do not mark story complete or publish.

Given staged real release when static checks eventually run then every offered year/image resolves same-origin from one immutable generation. Until data/media prerequisites exist, actual release preparation and final integration remain open.

## Implementation Notes

Root owns final evidence reconciliation and user review of actual remaining media exceptions. An export check cannot self-approve exceptions or fabricate user acceptance. Do not commit.

Final integration: implementation completed 2026-10-31; sprint story status is review pending human code review. User accepted all44 documented logo exceptions. Accepted release 4cf203e522dd724d20d6b384 passed all17-season static verification with no external/API attempts. See story-5-41-handoff.md for final evidence and artifact checksum; earlier pending notes describe intermediate checkpoints. No publication.
