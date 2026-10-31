# Story 5.1 verification — 2026-10-30

Implemented explicit v2 contracts alongside retained v1 baseline types. Shared evidence validators validate canonical references, UTC timestamps, calendar ordering, independent session applicability/lifecycle/provenance, audit page inventories, completion evidence and the exact held-GP analysis window. Successful-empty held gaps remain inside the window; unknown lifecycle is representable in pending audits and rejected for verified snapshots/bundles.

Pure explicit v1 migration requires a matching evidenced calendar, a new snapshot identity and a distinct audit identity. It clones inputs, preserves all scoring/source timestamps and records migration provenance separately. V2 support entries derive from snapshots; immutable bundle checks compare snapshot/source/audit/window metadata and reject other schema generations.

The additive createEvidenceDataSource seam in app/client/evidence-data-source.ts supports explicit fixture-backed v2 local envelopes and immutable static bundles, rejecting mismatches with no API fallback. Existing v1 production adapters and strict default validation remain usable. Media contracts and full-denominator slot counting distinguish actual mapped imagery from individually investigated exceptions; acquisition and filesystem integrity are later-story responsibilities.

Validation:
- npm.cmd run check — passed.
- node --test app/shared/evidence.test.ts app/shared/validation.test.ts — 6 tests passed.
- Saved fixture tests cover ongoing/complete/zero-GP/pending unknown, held source gaps, duplicate/out-of-calendar/missing windows, canonical/applicability/provenance/page failures, unknown schema, pure migration and contradictions, immutable generation mismatches, local/bundled loading and canonical media denominators.

Limits: fixture bundles intentionally allow subsets for adapter testing; full 17-year release completeness belongs to the exporter gate in Story 5.40. This story performs no live year audit, acquisition, publication, production v2 promotion or media file inspection. The source seam intentionally leaves production v1 intact until server/client/export integration is coordinated by the root agent.
