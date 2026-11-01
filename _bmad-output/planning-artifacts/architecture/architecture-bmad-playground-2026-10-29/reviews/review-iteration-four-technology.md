# Iteration four architecture validation: technology and implementation reality

Date: 2026-10-31. Scope: ARCHITECTURE-SPINE.md against iteration-four SPEC/acceptance, adopted DESIGN/EXPERIENCE, package/lockfile and current implementation. Read-only implementation inspection; no build, provider verification or publication performed.

Verdict: retained technology is suitable; update the architecture's scope and current-code evidence before treating it as the iteration-four handoff. No dependency or version change is needed.

## Findings

### T1 — Medium: stack reality paragraph and handoff describe the pre-iteration-three baseline

Evidence: the spine's Stack seed says contracts have schema/bundle v1 and the snapshot service hardcodes two-year candidates. `app/shared/contracts.ts:38` now defines SeasonSnapshotV2 and `:48` BundledManifestV2 alongside intentional v1 compatibility. `app/server/service.ts:6` imports shared candidate years, `:18` defaults to loadAuditedSnapshot, and `:22` validates verified v2 caches before considering the separate baseline cache. The remaining two-year calendar in `app/server/jolpica.ts:67` is real legacy code, but does not describe the service's current default ingestion path. The final handoff still instructs readers to implement/freeze iteration-three v2 contracts and audit all years.

Impact: downstream implementation could redo completed migrations or mistake compatibility code for the active technology boundary. These are stale dated implementation observations, not reasons to discard AD-13/14's ongoing invariants.

Recommendation: preserve the original iteration-three observations as explicitly historical evidence; add a dated current baseline with the actual v1/v2 compatibility boundary and active audited ingestion path. Replace the next-work handoff with the two iteration-four changes. Do not infer live season coverage or publication from code inspection.

### T2 — Medium: scope and bindings have no iteration-four contract

Evidence: spine frontmatter, Current scope authority, Structural seed and Handoff status stop at iteration-three CAP-1..3. SPEC-iteration-four CAP-1 introduces bottom disclosures and CAP-2 changes shared Progress labels, while DESIGN.md:158-160 requires readable metric labels and preserved adjacent Current/Final/source-lag captions. AD-10 and AD-13 remain compatible but do not establish ownership for these additions.

Impact: the stack is compatible, but independently implemented disclosure and chart changes lack an explicit architecture handoff. A blanket move of lifecycle text would also risk hiding important per-result context that UX retains.

Recommendation: bind iteration-four spec and acceptance in the spine. Keep shell/SeasonEvidence ownership for placement and disclosure state; retain selectors/data adapters untouched. Keep contextual result captions beside results and move the detailed evidence sections only. Establish chart label layout as presentation over shared selector values, not a new calculation or data contract.

### T3 — Medium: fixed chart geometry is insufficient for the adopted label contract

Evidence: `app/client/EvolutionChart.tsx` sets height=300, width=Math.max(900,count*36), radius=10 and point fontSize=9; both legend and point text use identity(item.id)+1. `app/shared/progress-model.ts:35` already supplies numeric value and evidence text from metricCell; chartGeometry exposes fixed coordinates and paths. DESIGN.md:160 calls for readable existing meta-size values, reserved margins, overlap offsets/leader lines and no hidden selected series. Identical-coordinate labels cannot be made distinguishable by a text substitution alone.

Impact: using row.value in the existing circles would satisfy simple qualifying examples while clipping large/fractional/negative points and obscuring coincident values with many selections.

Recommendation: retain native SVG and existing shared geometry/selector boundaries. Define a deterministic presentation layout for label bounds, offsets and leaders while leaving numeric point coordinates and gap/path semantics unchanged. Preserve identity through named legends and named inspection; remove ordinal legend badges. Reuse evidence precision for numeric labels, but preserve classification/status text in inspection/table: metricCell can return numeric value with richer resultText, so copying row.text wholesale is not a numeric-label contract. Include equal values, zero, fractional/negative/large points and many selected entities at narrow width/200% zoom in acceptance evidence.

## Confirmed retained technology

- package.json and the package-lock root agree on React 19.3.1, TypeScript 7.0.2, Vite 8.3.5 and @vitejs/plugin-react 6.1.2, with Node >=24.0.0. This establishes declared/locked stack only, not the executing Node version.
- Existing React state and native details/summary support the requested session-retained disclosure behavior without adding a router or storage dependency. SeasonEvidence currently contains one noncollapsible lifecycle section and one native coverage details element; App renders it above the surface. Keep same-session disclosure state in the surviving shell/component, outside URL and history, as specified by UX.
- Existing SVG, metricCell, evolutionSeries and chartGeometry are sufficient foundations. No new chart library, backend, schema version, provider operation or hosted API is required for this scope.
- Existing local/bundled adapters, immutable snapshot identity and lifecycle/zero/unavailable semantics remain binding. No external technology research was necessary because this validation proposes no new technology or version claim.

## Validation limits

This is architecture/code alignment evidence, not implementation acceptance. No application edits, dependency updates, tests, build or deployment were performed. Historical audit and publication evidence must remain explicitly dated and separate from current-code invariants.
