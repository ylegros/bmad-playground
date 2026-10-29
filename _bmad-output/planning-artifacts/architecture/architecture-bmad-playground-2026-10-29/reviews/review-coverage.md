# Coverage and rubric review

Verdict: PASS with one low-severity clarification; no blocking requirement or operational-envelope gap.

Reviewed ARCHITECTURE-SPINE.md against the finalized PRD, DESIGN.md, EXPERIENCE.md, and the reviewer-gate good-spine checklist.

## Findings

- **Low — Explicitly preserve the no-sprint display distinction (AD-2).** EXPERIENCE.md requires “Not applicable” in sprint cells for a non-sprint event, while genuinely absent results say “Unavailable”. AD-2 preserves schedule/session availability and forbids absent-sprint zeroes, but its two-case metric union could lead a builder to render every non-value as Unavailable. Autofix: require selectors to distinguish not-applicable sessions from unavailable expected results and map them to the UX labels; a separate metric variant is optional. The existing availability metadata can carry this distinction.

## Reconciliation

| Input capability | Spine coverage |
| --- | --- |
| FR-1 seasons from 2010, verified upper bound, common context | AD-5, AD-6, AD-8; manifest and immutable per-season snapshots |
| FR-2/3 driver/constructor standings, affiliation and official points/ranks | AD-2, AD-3; source identities and official standings authority |
| FR-4/5 chronological driver/constructor progress, GP/sprint separation | AD-1–3, AD-8; common schedule, awarded and championship points separated |
| FR-6 season-relative initial/latest teammates, arbitrary two drivers | AD-4, AD-6; deterministic defaults and season-wide candidates |
| FR-7 aligned comparison, explicit missing values | AD-1, AD-2, AD-4; shared selectors, chart gaps and table cells |
| FR-8/9 explicit refresh, retained snapshot/time, loading/error states | AD-5–7; atomic replacement, pending/error contract, no automatic updates |

Quiet UX requirements remain binding through AD-1's explicit ownership of DESIGN.md and EXPERIENCE.md: Pit Wall composition/tokens, accessible tables, names and line styles, keyboard chart inspection, status announcements, 200% zoom/reflow, visible units/season/rounds, GP versus sprint labels, Back restoration, preserved valid selections, and factual copy. AD-8 adds keyboard/table and narrow-screen acceptance checks. Avoid copying those details into architecture rules.

## Rubric

- The shared-contract, selector, adapter and snapshot ownership rules address the real independent-build divergence points at feature altitude.
- Rules are enforceable through imports, shared types/selectors, service boundaries and fixture/integration acceptance. Full contract fields are safely deferred only behind a define-before-parallel-build gate.
- Runtime, deployment, storage, upstream budgets, errors, operations and public-hosting revisit conditions are explicit. Local single-process scope is coherent with the personal MVP.
- Library choice and detailed component tree are safe deferrals; data semantics are fixed before them.
- Greenfield stack proposals are clearly assumptions. Starter baseline versions are explicitly distinguished from registry releases and stable resolution is an implementation gate. Link freshness was not independently rechecked in this coverage review.
- No inherited parent spine applies. No unsupported coverage claim is made; audit ownership is retained from the PRD.
