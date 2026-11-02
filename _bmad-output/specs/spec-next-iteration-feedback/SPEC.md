---
id: SPEC-next-iteration-feedback
created: 2026-11-02
companions:
  - acceptance.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-bmad-playground-2026-10-29/EXPERIENCE.md
  - ../../planning-artifacts/architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
sources: []
---

# F1 Dashboard — next iteration feedback

## Why

Yannick wants clearer team identity, current 2026 results, easier Progress selection and a more compact Compare view. This contract captures the eight feedback items confirmed in conversation on 2026-11-02.

## Capabilities

- **CAP-1**
  - **intent:** Recognize each team in Standings without duplicate identity text.
  - **success:** An available logo is the only visible team identity; a missing or failed logo is replaced by the team name. Accessible team identification remains available.
- **CAP-2**
  - **intent:** Analyze 2026 through the latest completed race supported by verified results.
  - **success:** The delivered snapshot includes the latest completed GP verified during implementation, with dated source evidence and matching analysis coverage; standings freshness and any source lag are explicit.
- **CAP-3**
  - **intent:** Select Progress drivers by team and teams from a compact field.
  - **success:** Driver checkboxes appear inline within team groups and wrap as needed; team checkboxes appear inline and wrap. Search, additive Select all, clear, chart and evidence table still reflect the complete selection.
- **CAP-4**
  - **intent:** Understand selection instructions before choosing entities.
  - **success:** Progress and Compare headings and guidance precede their selection controls visually and in reading order, using the copy in acceptance.md and the selected year.
- **CAP-5**
  - **intent:** Start a fresh selection when changing years.
  - **success:** A year change clears both Progress category sets, legacy entity selection and Compare A/B, including IDs valid in both years; no automatic default repopulates them.
- **CAP-6**
  - **intent:** Read a compact two-driver comparison without repeated scores.
  - **success:** Driver portraits frame a central six-metric scorecard; each metric has one label, one value per driver and a comparison bar, with no duplicate score display.

## Constraints

- This contract supersedes conflicting adopted UX rules for logo/name display, selection layout, heading placement and year-change retention, including AD-14 retention across years. Other adopted rules remain in force.
- Follow acceptance.md. Preserve existing six-category scoring, teammate defaults after an explicit driver choice, metric semantics, official championship authority, missing-versus-zero distinctions and completed-GP evidence windows.
- Preserve keyboard access, readable names, accessible image identity, non-color comparison cues and narrow-screen/200% zoom usability.
- Verify the latest completed race during implementation; this planning document makes no claim about the current last round. Keep refresh failure retention and hosted bundled-data behavior.

## Non-goals

- New comparison metrics, scoring changes, cross-season comparison or a broad visual redesign.
- Copying the reference's branding, driver identities or numerical values.
- Code changes, data acquisition, publication or editing the adopted UX documents during this spec run.

## Success signal

Demonstrate all acceptance checks with the refreshed 2026 snapshot: no duplicate standings identity, grouped wrapping selections, headings above controls, empty selections after a year switch and a single compact comparison scorecard.

## Assumptions

- A driver affiliated with multiple teams appears in each applicable team group with one shared selected ID; unassigned drivers remain selectable in a fallback group.
- Team-mode Progress guidance uses corresponding team wording.
- Back/Forward restores historical season and selection; explicit year changes clear selection. Same-year navigation and refresh retain existing behavior.
