# Iteration four implementation handoff

Build from SPEC.md and every listed companion. Scope is the two confirmed UI changes; retained UX defaults are explicit assumptions, with no blocking product decision.

| Slice | Owns | Completion evidence |
|---|---|---|
| CAP-1: season information on demand | Shared shell placement in App.tsx and SeasonEvidence disclosures; ephemeral same-session expansion state | All three surfaces place expandable information below analysis, preserve selected-snapshot evidence, keyboard/focus semantics and inline result/error honesty. Verify acceptance.md bottom-information checks. |
| CAP-2: actual-value graph labels | Shared Progress/EvolutionChart presentation over existing progress-model series | Labels use each numeric point value; names/colors/dashes identify entities without ordinal badges. Preserve formatted status text for inspection/table. Verify acceptance.md metric-label checks including long/coincident values and existing round inspection. |

Either slice can complete without the other. CAP-1 then CAP-2 is a convenient implementation order, not a dependency. Neither requires a new schema, API, dependency, provider request or recalculation of audited data.

Existing focused checks live in tests/progress.spec.ts, app/client/SeasonEvidence.test.ts and shared progress-model tests. Adapt/add behavioral assertions for changed requirements rather than preserving old panel placement or ordinal labels. Use the existing local/bundled harnesses; run relevant regressions and visually inspect narrow/200% layouts after implementation. Record actual results separately from this planning handoff.

The completed iteration-three epics/sprint remain historical. This small iteration is a direct spec handoff to bmad-build; no new stories.yaml or sprint entries are required. Preparation does not authorize starting implementation or publishing.
