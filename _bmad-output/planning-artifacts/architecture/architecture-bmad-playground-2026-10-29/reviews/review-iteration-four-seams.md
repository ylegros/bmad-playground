# Iteration-four architecture validation: adversarial seams

Verdict: no blocking architecture divergence found. The existing AD-1 delegation makes the current UX documents binding for layout and interaction. Most apparent omissions are already decided there and do not merit another AD. One medium handoff issue and one low implementation clarification remain.

## Medium — Current handoff still identifies iteration-three inputs and next steps

Evidence: ARCHITECTURE-SPINE.md lines 193–195 map CAP-1/2/3 to iteration-three identity, coverage and selection; lines 208 onward declare iteration-three alignment and recommend aligning UX next. Iteration-four SPEC.md has a different CAP-1/2 and already adopts updated DESIGN.md/EXPERIENCE.md. The existing AD-1 Rule does delegate to those documents, so the underlying invariants remain usable.

Adversarial construction: a shell implementer receives the architecture handoff/capability table and preserves the old top evidence placement, while a chart implementer receives iteration-four SPEC and changes numeric labels. Both can cite the spine's stated capability mapping, but only the chart implementer follows the current iteration input. This is a stale scope/traceability trap rather than a missing invariant: once current UX is read, the old placement is not compliant.

Recommendation: on an authorized architecture Update, add an iteration-four scope/input note and capability mapping with explicit iteration identifiers, retaining AD IDs. State that the prior seed/readiness observations are historical. Do not add a redundant layout AD. Under Validate, report only; no spine edit was made.

## Low — Numeric labels must distinguish plotted number from evidence text

Evidence: app/shared/progress-model.ts metricCell returns {value, text}; GP/sprint result text comes from resultText in app/shared/selectors.ts:59–63 and can contain classification/status instead of the plotted numeric position. evolutionSeries feeds the same rows to chart and evidence table. EvolutionChart currently uses identity ordinals for both point text and legend, so the implementation must choose a replacement deliberately. EXPERIENCE.md:90 requires numeric metric values with existing formatting while preserving nonnumeric statuses.

Adversarial construction: a chart implementer substitutes row.text for the ordinal to match the evidence table literally; a selector implementer correctly preserves status-rich evidence text such as classification plus retirement status alongside a numeric source position. The chart can then show status prose instead of the requested position. Conversely, substituting row.value should not overwrite row.text in tables or inspection. Both units may follow AD-1's shared-selector rule but disagree on the role of the two existing fields. Current UX resolves the intended behavior, so this does not require a new architecture AD.

Recommendation: implementation tasks should explicitly use the numeric plotted value with the existing numeric precision convention for point labels, preserving evidence text for tables, titles and inspection. If a shared numeric-label field/helper is introduced, own it alongside metricCell and consume it rather than inventing a second per-chart metric policy. Verify a classified non-finisher with an authoritative numeric position, a nonnumeric-only status, fractional/negative points, zero and unavailable. This is implementation guidance, not a proposal to change domain semantics.

## Tested seams that are already closed

- **Bottom placement:** shell A puts disclosures after tables; shell B puts them before tables. B violates DESIGN.md:158 and EXPERIENCE.md:77/84. AD-1 explicitly delegates layout/interactions, so both cannot be compliant. Keep inline Current/Final, season-to-date and actionable error context beside data as UX specifies.
- **Expansion versus URL/navigation:** shell A preserves two independent in-memory expansion flags through surface/season changes; shell B serializes them into URL history or resets them on navigation. B violates EXPERIENCE.md:86. Persistent unkeyed shell ownership or equivalent lifted transient state is an implementation choice; no state library or persistence layer is needed.
- **Missing snapshot/loading:** A keeps summaries mounted with honest loading/unavailable content; B removes them while season data loads and loses expansion. B violates EXPERIENCE.md:86 and the same-session rule. Both may keep last-good evidence only for its correct season, governed by AD-5/13; stale selected-season relabelling is already prohibited.
- **Snapshot atomicity:** evidence A derives lifecycle/window directly from the committed selected snapshot; evidence B independently caches lifecycle/manifest fields and retains stale metadata after refresh. B violates AD-13 and EXPERIENCE.md:77/102. No new contract shape is necessary.
- **Metric/category context:** chart A consumes the newly derived evolutionSeries; chart B memoizes labels by entity/round alone and reuses qualifying labels for points or a constructor sharing an ID. B violates EXPERIENCE.md:90 and AD-1/2/10. Identity keys remain canonical IDs in category context, not numbers or label strings.
- **Collision layout:** A offsets label text with leader lines and expands local scrollable space; B moves data points, suppresses labels or hides selected series. B violates DESIGN.md:160 and EXPERIENCE.md:92. Exact label-placement algorithms, gutters and component splits can remain deferred implementation choices. Different compliant algorithms do not create an architectural incompatibility because the chart owns geometry and label placement together.

## Scope and edits

Reviewed the existing spine, iteration-four SPEC/acceptance, current UX documents, App.tsx, SeasonEvidence.tsx, EvolutionChart.tsx, Progress.tsx, app/shared/progress-model.ts and relevant selector formatting. The progress model lives in app/shared, not app/client. No code or architecture edits, publication, technology/version adoption, or runtime verification occurred. This review file is the sole change from this lens.
