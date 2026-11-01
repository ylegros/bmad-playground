# Iteration-four architecture review

Date: 2026-10-31. Intent: validate existing architecture against iteration-four SPEC.md, acceptance.md and adopted DESIGN.md/EXPERIENCE.md. Architecture and application code were not changed.

## Verdict

The existing layered architecture supports both changes. No blocking architecture gaps, new dependencies or new architectural decisions are required. Refresh the spine's scope and brownfield context before implementation handoff.

Deterministic spine lint: passed, zero findings. Three independent reviewers assessed capability coverage, technology/reality and component seams. The retained stack was checked against repository reality; no new technology or version was selected.

## Triaged findings

| Finding | Disposition | Recommended action |
|---|---|---|
| Medium: spine scope, capability mapping and handoff target iteration three | Accepted documentation gap; all three reviewers identified it | Add qualified iteration-four CAP-1/CAP-2 bindings and current spec references, retaining AD-1 through AD-14. Map shell/shared season information and shared Progress chart ownership. |
| Medium: brownfield seed describes obsolete pre-v2/two-season code | Accepted documentation gap; coverage reviewer rated it low | Refresh or clearly historicize the reality-check paragraph and old implementation gates using approved iteration-three verification. Preserve publication-pending status. |
| Chart geometry needs room for long/coincident labels | Implementation obligation, not a missing architecture invariant | Follow UX label offsets, leader lines, margins and local scrolling; preserve plot coordinates and metric precision. A text-only substitution into the old fixed circles is insufficient. |
| Numeric point label versus status-rich evidence text | Implementation clarification, not a new AD | Use the existing series row's numeric value for point labels and preserve formatted evidence/status text for inspection/table context. Missing numeric values remain gaps; zero remains zero. |

AD-1 already delegates presentation and interaction to DESIGN.md/EXPERIENCE.md and requires shared selector output for chart/table. AD-5/13 preserve snapshot/evidence consistency; AD-6/14 retain URL-backed analysis selection. The new disclosure expansion is ephemeral UI state under UX, not a new URL selection or domain field.

## Review evidence

- [Coverage review](review-iteration-four-coverage.md): no critical/high findings; scope and stale seed need alignment.
- [Technology/reality review](review-iteration-four-technology.md): retained stack fits; scope/seed and geometry implementation risks identified.
- [Seam review](review-iteration-four-seams.md): no blocking gaps; UX delegation closes state, placement, snapshot updates and collision behavior.

The raw reviews retain their individual wording and ratings. This synthesis distinguishes stale architecture documentation from implementation details already governed by the adopted UX contract.

## Recommended next step

Update the existing spine's references, scope, capability ownership map, seed and handoff without changing its paradigm, stack or stable AD IDs. Then adopt that refreshed spine into the iteration-four spec before story breakdown or build. This validation did not perform that update.
