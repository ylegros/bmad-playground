---
title: 'Iteration four: season disclosures and graph values'
type: 'feature'
created: '2026-11-01'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - _bmad-output/specs/spec-iteration-four/SPEC.md
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** Season lifecycle/evidence and 2010-2026 coverage obscure the main analysis, while Progress points show assigned entity numbers instead of the measured value.

**Approach:** Implement both confirmed changes together, with parallel ownership, against SPEC-iteration-four and every companion. Shared season information belongs below all active analysis, before the footer, in independent initially collapsed disclosures. Retain expansion across same-session season/view changes without URL/history changes; preserve complete snapshot-bound information, inline result qualification/errors and accessible focus/keyboard behavior. Show each numeric Progress point's actual value with existing precision; remove ordinal legend badges while retaining named colors/dashes, zero versus gaps, status-rich evidence, true plot coordinates and pointer/keyboard round inspection. Long/coincident values remain complete and legible using spacing/leader lines/local scrolling. Preserve local/bundled behavior, existing scoring/data/identity and every selected entity. No new metrics, dependencies, source/media acquisition, publication or push. User authorized existing uncommitted planning, both goals together and parallel build on 2026-11-01.

Given any analysis surface, when season disclosures are opened or seasons/views change, then information follows the selected snapshot with usable focus and independent retained expansion. Given a graph metric and entity, when numeric points render or selections change, then labels equal that entity/round value and matching evidence retains its existing meaning. Verify detailed acceptance.md checks, narrow/200% layout and both modes without bundled external/API requests.

</frozen-after-approval>

## Implementation Notes

- Planning investigation: no unresolved user-visible intent gaps; no irreversible operations; bounded client presentation changes and focused tests. Existing spec/UX defaults already record choices. Use the oneshot route to avoid redundant approval/spec ceremony.
- CAP-1 code map: App.tsx currently places SeasonEvidence and Coverage notes above analysis. Keep the shared component mounted below analysis; SeasonEvidence owns ephemeral disclosure state. Retain visible result/error qualification and selected-season metadata. Tests: SeasonEvidence.test.ts, tests/season-evidence.spec.ts and audit/static checks that inspect evidence.
- CAP-2 code map: progress-model.ts already returns numeric value|null plus status-rich text; EvolutionChart.tsx renders ordinals at points/legend. Reuse shared series; geometry/model helpers may change only for label layout. Tests: shared progress-model tests and tests/progress.spec.ts.
- Parallel ownership: disclosure agent owns App/SeasonEvidence/style and season evidence/audit tests; graph agent owns EvolutionChart/progress CSS/model helper and graph tests. Root owns integrated local/bundled checks, blind review, visual verification and delivery record.
- Scope excludes historical planning edits from application review claims; preserve all approved documents. Existing sprint tracks completed iterations and is unchanged.
- Implemented both capabilities in parallel. SeasonEvidence owns two native independently controlled disclosures, with snapshot-bound contents and same-session expansion. App keeps them after analysis and retains inline errors, zero-GP guidance and accurate standings lag.
- Progress uses complete String(row.value) labels and named line-style legends. A pure layout reserves label columns/vertical slots and tick margins without changing numeric semantics; leader lines connect to true geometry. Keyboard inspection scrolls the chart locally; a sticky round axis retains context for dense fields.
- Fixed an intermediate PowerShell ANSI write to UTF-8 before final builds. Source isolation test that copied that intermediate file was rerun successfully. A media regression timed out during concurrent image-heavy checks and passed in its isolated retry; no media code changed.
- Verification and local sanitized source/archive handoff: iteration-four-verification.md. Both production modes pass, all accepted regression cases pass, independent review findings are resolved with no deferred work. No push/publication or sprint changes.

## Review Triage Log

| Finding | Verdict and evidence | Disposition |
|---|---|---|
| Long axis values clip at fixed left margin | Medium: the negative fractional fixture exceeded the former x=50 gutter. Dynamic formatted-tick padding and rendered tick bounds now pass. | Patched. |
| Keyboard inspection selects offscreen rounds | Medium: widened columns exposed offscreen Home/End targets. Inspection now scrolls only the chart; marker viewport tests pass at actual 200% zoom. | Patched. |
| Dense chart hides round axis | Medium: more than 24 populated series exceed the local height cap. Sticky bottom round axis stays within the scroll viewport in the dense test. | Patched. |
| Font-size test does not enlarge fixed SVG fonts | Medium verification gap: replaced the added collision test's font-size simulation with actual CSS zoom 2; bundled screenshots/checks also exercise zoom 2. | Patched. |
| Bundled test checks only driver qualifying | Low verification gap: added historical fractional cumulative points, sprint points, adjustments and constructor cumulative values against shared-model evidence. | Patched. |
| Bundled screenshots alone do not prove bounds/readability | Medium verification gap: assert all numeric/axis text within SVG, every label-pair non-overlap and clearance from point markers; desktop/narrow/200% screenshots also visually inspected. | Patched. |
| Collision coverage excludes other chart elements | False as a blanket no-crossing requirement: series lines intentionally pass beneath opaque value backgrounds; leaders end before label columns and point anchors stay left. Added full label/marker/neighbor bounds assertions, which pass. No separate visible defect remains. | Rejected as a blanket rule; coverage strengthened. |
| Disclosure persistence lacks Back/Forward tests | Low verification gap: added browser-history traversal with independent open states, selected snapshot content and unchanged Forward entries after toggles; focused suite passes. | Patched. |
