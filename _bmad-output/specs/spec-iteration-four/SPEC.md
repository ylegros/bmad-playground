---
id: SPEC-iteration-four
status: ready-for-implementation
created: 2026-10-31
updated: 2026-11-01
companions:
  - acceptance.md
  - implementation-handoff.md
  - ../../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
sources: []
---

# F1 Pit Wall iteration four

## Why

Yannick wants the analysis to take priority over season metadata and graph labels to communicate performance directly. Season lifecycle/evidence and coverage currently appear above analysis; graph points repeat an assigned entity number instead of their metric value. The user confirmed both requested changes in conversation.

## Capabilities

- **CAP-1**
  - **intent:** Consult season information at the bottom when needed without it occupying the primary analysis area.
  - **success:** On Standings, Progress and Compare, season lifecycle/evidence (including “Ongoing / Season to date”) and “Season coverage · 2010–2026” appear below active analysis in expandable sections. Expanding reveals the existing information; duplicate panels no longer appear above analysis.
- **CAP-2**
  - **intent:** Read the selected metric value directly at each plotted graph point.
  - **success:** Each point label represents that entity's value for that round and metric, agreeing with graph evidence and inspection details. For “2026 · GP qualifying position · position”, the label is the qualifying position, rather than an assigned driver number. Missing values remain gaps and genuine zero remains zero.

## Constraints

- Preserve existing season data, calculations, completed-GP evidence windows and distinctions between absent values and zero. Moving metadata must not relabel ongoing standings as final or remove evidence.
- Preserve season/metric/selection controls, local and hosted behavior, evidence tables, keyboard round inspection and accessible entity identification.
- Expansion controls must work with keyboard and pointer, expose their expanded state, and remain readable on narrow screens. Graph identity must remain understandable when several entities share a value.
- Apply the acceptance checks in acceptance.md.
- Follow the adopted DESIGN.md and EXPERIENCE.md for disclosure presentation, interaction and readable value labels. UX defaults retain expansion during same-session navigation without changing the URL or history; exact disclosure copy remains provisional.
- Follow the adopted architecture spine's AD-1 through AD-14; preserve existing shared numeric metric values and status-rich evidence text rather than deriving results inside the chart. implementation-handoff.md identifies the two implementation slices and verification boundary.

## Non-goals

- New metrics, cross-season comparison, additional data/media acquisition or a broad dashboard redesign.
- Application implementation or publication during this planning step.

## Success signal

The primary analysis precedes expandable season information. A reader can see each plotted qualifying position directly and verify it against the corresponding evidence row without interpreting an assigned driver number.

## Assumptions

- Both information sections start collapsed. “Bottom” means below active analysis inside main content, before the footer; exact grouping and summary copy remain implementation choices.
- Value labels apply to all metrics in the shared driver/constructor Progress chart. Remove assigned-number legend badges while retaining names, colors and line styles; a legend does not represent one round's metric value.

## Open questions

None blocking. The assumptions above remain reviewable defaults, not additional user-confirmed requirements.
