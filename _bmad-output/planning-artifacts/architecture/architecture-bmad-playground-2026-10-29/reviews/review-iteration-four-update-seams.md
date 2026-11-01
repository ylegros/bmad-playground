# Iteration-four Update gate: seam review

Reviewed 2026-11-01 refreshed ARCHITECTURE-SPINE.md against iteration-four SPEC.md and UX authority. Scoped follow-up to the previous seam validation; no code or spine edits.

**Verdict: pass. No actionable architectural findings.** The update resolves both prior observations: current scope/input/capability mapping now identifies iteration four, and numeric plotted values are explicitly distinguished from status-rich evidence text.

## Adversarial constructions

1. **Disclosure state versus navigation.** Unit A stores expansion as ephemeral shared-shell state across surface and season transitions. Unit B serializes expansion into navigation history or recreates default-collapsed state on each season transition. B is not compliant: Current scope authority (spine:48–50) names ephemeral same-session expansion independent of URL/history; AD-1 delegates interaction to EXPERIENCE.md:86, which explicitly preserves expansion and prohibits history changes. AD-6/14 continue to own analysis selections and Back behavior. No separate AD or state-management dependency is needed.

2. **Numeric value versus evidence/status text.** Unit A renders the shared row.value for numeric labels and preserves row.text for inspection/evidence. Unit B inserts row.text as the point number, parses it into a rank or recalculates numeric values in the chart. B is not compliant: spine:50 explicitly separates these roles; SPEC constraints adopt existing shared numeric values/status-rich evidence; AD-1/2/10 preserve selector ownership, status and absence semantics. Numeric source classification with retirement status remains numeric at the point while status-rich inspection/table evidence remains intact. Null produces no point; zero remains zero. No new metric contract is required.

3. **Coincident labels and geometry.** Unit A offsets label positions with leader lines, preserving true plotted coordinates and local scrolling. Unit B moves data points, drops series/labels or rounds/truncates values to fit. B is not compliant: AD-1 delegates to DESIGN.md:160 and EXPERIENCE.md:92, which prohibit those choices. Two units may choose different compliant label-layout algorithms without becoming incompatible: geometry and label placement remain within chart rendering, sharing metric rows and identity. Algorithm details properly remain implementation choices.

4. **Selected snapshot changes.** Unit A updates disclosure content from the selected committed snapshot while preserving independent expansion. Unit B preserves cached disclosure content from the old snapshot, or resets expansion because evidence identity changed. B violates AD-5/13 plus the adopted atomic-content/same-session UX rules. The updated ownership note assigns disclosure presentation to the shared shell/SeasonEvidence and does not introduce an independent evidence cache. Existing last-good snapshot and season guards remain sufficient.

## Disposition

No additional AD recommended. Keep implementation verification focused on these transitions, including empty/loading states, failed refresh retention, numeric classification plus status, equal values, fractional/negative/zero values and narrow/200% layouts. This pass assesses contract consistency; it does not claim that current application code already implements the iteration-four behavior.
