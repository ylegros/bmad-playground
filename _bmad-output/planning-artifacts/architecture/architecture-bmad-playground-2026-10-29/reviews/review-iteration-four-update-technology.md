# Iteration-four update gate: technology and repository reality

Date: 2026-11-01. Reviewed the refreshed ARCHITECTURE-SPINE.md, SPEC-iteration-four and implementation-handoff.md, adopted UX, reconciliation record, package/lockfile and the previously inspected repository seams. This is a fresh update-gate report; earlier validation reports remain historical.

Verdict: **PASS — no blocking technology or repository-reality findings.** No code/spine edits, build, tests, provider requests or deployment were performed.

## Resolved findings

1. The spine now binds both iteration-four capabilities and its acceptance companion, maps disclosure ownership to the surviving shell/SeasonEvidence and value-label ownership to Progress/EvolutionChart, and explicitly distinguishes ephemeral expansion from URL/history selection. Its brownfield paragraph accurately describes v2 contracts alongside v1 compatibility and shared season candidates, rather than treating completed iteration-three migration as future work. Current `app/client/App.tsx:146` still renders SeasonEvidence before active surfaces, confirming the stated pending presentation seam.
2. The numeric/status distinction is explicit: `app/shared/progress-model.ts` supplies numeric value or null independently of status-rich text; the refreshed authority uses row.value for point values and retains row.text for inspection/evidence. This avoids fabricating ranks or copying classification/status text into numeric labels. Existing ordinal labels remain visible in `app/client/EvolutionChart.tsx:19` and `:22`, matching the spine's current-code claim.
3. Layout/interaction acceptance is delegated to adopted UX and repeated in the handoff: coincident and long labels, readable precision, named legends, null gaps, keyboard/pointer inspection and narrow/200% layouts. This addresses the earlier fixed-geometry risk without introducing a dependency or changing the data model. A deterministic layout implementation remains implementation work, appropriately outside this architecture document.

## Retained stack confirmation

`package.json:7` declares Node >=24.0.0; `:25-35` retains React 19.3.1, TypeScript 7.0.2, Vite 8.3.5 and React plugin 6.1.2. The package-lock root matches these declarations. No new version or technology is bound by this update, so external version research is unnecessary. These checks establish repository declarations/lockfile, not runtime availability or successful installation.

Native React state, details/summary, SVG and the existing shared selectors are sufficient for both capabilities. No schema/API/provider/storage/hosting change is implied. Local/bundled boundaries and publication limits remain explicit. Approved iteration-three verification is cited as dated baseline evidence, distinct from current code observations and pending publication.

## Implementation watchpoint (informational)

`EvolutionChart.tsx:12` still fixes height at 300 and round spacing at 36; point text at `:22` is fontSize=9 inside radius-10 circles. Do not treat replacing the text expression as completion. Implement and visually verify the adopted margin/offset/leader-line and scrolling behavior while preserving true point coordinates and the existing inspection geometry. The updated spine/UX/handoff already require this; it is not an unresolved architecture decision.
