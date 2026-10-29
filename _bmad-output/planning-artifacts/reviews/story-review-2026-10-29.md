# Story review ? accepted iteration-two corrections

Date: 2026-10-29. Reviewed artifact: [epics.md](../epics.md). Comparison contract: [accepted feedback spec](../../specs/spec-iteration-two-feedback/SPEC.md) and [acceptance corrections](../../specs/spec-iteration-two-feedback/acceptance-corrections.md).

The stories require alignment before rebuilding. This review does not change stories, application code, sprint status or the Site. The original release remains the historical baseline; user acceptance of the correction work remains open.

Lenses: adversarial, edge-case hunter, editorial structure. Verification-gap is code-only and does not apply; prose was not selected because this is a behavioral handoff review, not copy-editing. Independent reviewers ran before synthesis. Findings overlapping across lenses are retained as corroborating signals, not counted as distinct implementation tasks.

## Story impact

| Story | Required alignment |
|---|---|
| 1.1 | Tick/highlight without visible Better; explicit accessible direction |
| 1.2 | Best GP qualifying rank; penalty distinction, coverage and scoring cases; summary marker alignment |
| 1.3 | Full identity inventory, real-image counts, individual investigated exceptions and visual checks |
| 3.3 | Existing Site reuse/current audience; update historical private-only wording |
| 3.4 | Corrected feature/coverage verification and anyone-with-link publication evidence |
| Epic 2, 3.1?3.2 | Retain existing behavior and regression obligations; no feedback-driven change identified |

## Findings by lens

### adversarial

- **Location:** epics.md:45-46,73,252-262 ? FR-10/11, AR-3, Story 1.2
  - **Trigger:** The fixed category remains starting grid, explicitly unavailable under schema v1.
  - **Guard/change:** Replace it throughout with best GP qualifying rank from authoritative GP qualifying classification; lower wins one vote.
  - **Consequence:** Faithful implementation retains the rejected category and omits available qualifying data.

- **Location:** epics.md:247-262 ? Story 1.2
  - **Trigger:** No criterion distinguishes qualifying rank from penalized grid or checks incomplete qualifying coverage.
  - **Guard/change:** Add qualifying 2 / grid 7 => qualifying 2; conservative qualifying coverage, sample sizes, precise unavailable reasons and GP/sprint separation.
  - **Consequence:** A renamed row may still compute the wrong value or display the missing-grid explanation.

- **Location:** epics.md:88,91,194-197 ? UX-DR2/5, Story 1.1
  - **Trigger:** Current requirements explicitly demand visible Better text.
  - **Guard/change:** Require tick and highlight without visible Better text in summary and detailed comparison.
  - **Consequence:** The rebuilt dashboard repeats the rejected labels.

- **Location:** epics.md:194-202,233-235 ? Stories 1.1/1.2
  - **Trigger:** Acceptance does not explicitly retain highlight and accessible favorable direction when labels are removed.
  - **Guard/change:** Require tick/highlight and screen-reader text naming driver, measure and direction; decorative tick; no favorable styling for ties/unavailable.
  - **Consequence:** Label removal can leave ambiguous accessible markers or remove the requested highlight.

- **Location:** epics.md:278-281 ? Story 1.3 logos
  - **Trigger:** Any documented fallback reason satisfies logo acceptance without acquisition investigation.
  - **Guard/change:** Target every constructor/season with an appropriate historical logo; record attempted sources and a specific blocker for each exception.
  - **Consequence:** Generic fallback records can close the story while most logos remain missing.

- **Location:** epics.md:267-281,302 ? Story 1.3 photographs
  - **Trigger:** Portrait/reusable-asset wording does not explicitly require verified photographs across the represented driver inventory.
  - **Guard/change:** Require verified local photographs for every represented driver, honest photo-date disclosure, permitted cross-season reuse and individually investigated exceptions.
  - **Consequence:** Initials or substitutes can satisfy a story intended to maximize actual driver photographs.

- **Location:** epics.md:276-302 ? Story 1.3
  - **Trigger:** No measurable imagery coverage deliverable is assigned.
  - **Guard/change:** Require snapshot-derived inventory and per-season mapped-image counts versus total identities, separately for logos/photos; count fallbacks separately with no invented reduced target.
  - **Consequence:** Reviewers cannot measure improvement or distinguish real-image coverage from fallbacks.

- **Location:** epics.md:293-300,547-555 ? Stories 1.3/3.4
  - **Trigger:** Verification covers frames/fallbacks/network blocking without inspecting actual faces/logos.
  - **Guard/change:** Record visual identity and legibility checks on desktop/narrow layouts, including historical suitability, face crop and logo containment.
  - **Consequence:** Wrong identities or unreadable/unsuitable images can pass acceptance.

- **Location:** epics.md:55,66,160-166,516-519,557-575 ? Stories 3.3/3.4
  - **Trigger:** Publication requires owner-private access despite current anyone-with-link authorization.
  - **Guard/change:** Reuse the existing Site identity, preserve anyone-with-link audience and verify link/visibility evidence.
  - **Consequence:** Following stale acceptance can revoke authorized sharing.

- **Location:** epics.md:11-19,26 ? Inputs and authority
  - **Trigger:** Accepted correction spec and companion are missing from the input hierarchy.
  - **Guard/change:** Reference both correction documents and state their precedence over conflicting grid/label/fallback/audience wording.
  - **Consequence:** Story extraction may regenerate superseded requirements.

- **Location:** epics.md:2-9,28,577,581,628-640 ? State and approvals
  - **Trigger:** Original approval/final-validation statements do not distinguish pending correction alignment and rebuild authorization.
  - **Guard/change:** Preserve original approvals as history; mark corrections pending alignment/acceptance, record implementation hold and revalidate revised stories.
  - **Consequence:** A downstream agent can mistake old completion for permission to start correction implementation.

### edge-case-hunter

- **Location:** epics.md:278-300 ? Story 1.3
  - **Trigger:** Supported identities receive fallback reasons without investigated acquisition or actual coverage.
  - **Guard/change:** Require per-season image/identity and fallback counts, attempted sources, specific blockers and visual checks.
  - **Consequence:** Fallback-only imagery still passes the story.

- **Location:** epics.md:252-262 ? Story 1.2
  - **Trigger:** Qualifying rank exists, including qualifying 2 followed by penalized grid 7.
  - **Guard/change:** Replace grid with best GP qualifying rank; require conservative qualifying coverage and penalty-independence fixtures.
  - **Consequence:** Supported qualifying votes remain omitted and obsolete grid-unavailability persists.

- **Location:** epics.md:194-197 ? Story 1.1 and summary integration
  - **Trigger:** Favorable values render in detailed comparison or summary.
  - **Guard/change:** Require tick/highlight without visible Better text on both surfaces and accessible driver/metric/direction descriptions.
  - **Consequence:** Visible labels persist or accessible descriptions omit favorable direction.

- **Location:** epics.md:557-565 ? Story 3.4
  - **Trigger:** A corrected release updates the existing anyone-with-link Site.
  - **Guard/change:** Reuse the Site and preserve anyone-with-link access; verify returned visibility/link access.
  - **Consequence:** Owner-private acceptance removes the currently authorized sharing audience.

### structure

| Pass | Original Text | Revised Text | Changes |
|---|---|---|---|
| structure | Opening metadata/Overview show a final original plan; current correction links and supersession are absent. | MOVE correction links and supersession into a Current handoff block before the historical baseline. | Preserve historical facts and orient readers before the old acceptance criteria. Estimated addition: 60?90 words. |
| structure | Requirements inventories and coverage maps precede the epic index and stories. | MOVE the Epic List after current handoff context; move detailed inventories/maps after stories as reference. | Expose the work breakdown early while preserving traceability. Word impact: 0. |
| structure | Original approvals repeat in per-story metadata, Overview, Batch Review and Final Planning Validation. | MERGE approval history into one historical record; retain story-specific exceptions and links. | Distinguish old approval from current correction state. Estimated reduction: 100?140 words. |

## Canonical findings JSON

```json
[
  {
    "lens": "adversarial",
    "location": "epics.md:45-46,73,252-262 ? FR-10/11, AR-3, Story 1.2",
    "trigger_condition": "The fixed category remains starting grid, explicitly unavailable under schema v1.",
    "guard_snippet": "Replace it throughout with best GP qualifying rank from authoritative GP qualifying classification; lower wins one vote.",
    "potential_consequence": "Faithful implementation retains the rejected category and omits available qualifying data."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:247-262 ? Story 1.2",
    "trigger_condition": "No criterion distinguishes qualifying rank from penalized grid or checks incomplete qualifying coverage.",
    "guard_snippet": "Add qualifying 2 / grid 7 => qualifying 2; conservative qualifying coverage, sample sizes, precise unavailable reasons and GP/sprint separation.",
    "potential_consequence": "A renamed row may still compute the wrong value or display the missing-grid explanation."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:88,91,194-197 ? UX-DR2/5, Story 1.1",
    "trigger_condition": "Current requirements explicitly demand visible Better text.",
    "guard_snippet": "Require tick and highlight without visible Better text in summary and detailed comparison.",
    "potential_consequence": "The rebuilt dashboard repeats the rejected labels."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:194-202,233-235 ? Stories 1.1/1.2",
    "trigger_condition": "Acceptance does not explicitly retain highlight and accessible favorable direction when labels are removed.",
    "guard_snippet": "Require tick/highlight and screen-reader text naming driver, measure and direction; decorative tick; no favorable styling for ties/unavailable.",
    "potential_consequence": "Label removal can leave ambiguous accessible markers or remove the requested highlight."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:278-281 ? Story 1.3 logos",
    "trigger_condition": "Any documented fallback reason satisfies logo acceptance without acquisition investigation.",
    "guard_snippet": "Target every constructor/season with an appropriate historical logo; record attempted sources and a specific blocker for each exception.",
    "potential_consequence": "Generic fallback records can close the story while most logos remain missing."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:267-281,302 ? Story 1.3 photographs",
    "trigger_condition": "Portrait/reusable-asset wording does not explicitly require verified photographs across the represented driver inventory.",
    "guard_snippet": "Require verified local photographs for every represented driver, honest photo-date disclosure, permitted cross-season reuse and individually investigated exceptions.",
    "potential_consequence": "Initials or substitutes can satisfy a story intended to maximize actual driver photographs."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:276-302 ? Story 1.3",
    "trigger_condition": "No measurable imagery coverage deliverable is assigned.",
    "guard_snippet": "Require snapshot-derived inventory and per-season mapped-image counts versus total identities, separately for logos/photos; count fallbacks separately with no invented reduced target.",
    "potential_consequence": "Reviewers cannot measure improvement or distinguish real-image coverage from fallbacks."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:293-300,547-555 ? Stories 1.3/3.4",
    "trigger_condition": "Verification covers frames/fallbacks/network blocking without inspecting actual faces/logos.",
    "guard_snippet": "Record visual identity and legibility checks on desktop/narrow layouts, including historical suitability, face crop and logo containment.",
    "potential_consequence": "Wrong identities or unreadable/unsuitable images can pass acceptance."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:55,66,160-166,516-519,557-575 ? Stories 3.3/3.4",
    "trigger_condition": "Publication requires owner-private access despite current anyone-with-link authorization.",
    "guard_snippet": "Reuse the existing Site identity, preserve anyone-with-link audience and verify link/visibility evidence.",
    "potential_consequence": "Following stale acceptance can revoke authorized sharing."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:11-19,26 ? Inputs and authority",
    "trigger_condition": "Accepted correction spec and companion are missing from the input hierarchy.",
    "guard_snippet": "Reference both correction documents and state their precedence over conflicting grid/label/fallback/audience wording.",
    "potential_consequence": "Story extraction may regenerate superseded requirements."
  },
  {
    "lens": "adversarial",
    "location": "epics.md:2-9,28,577,581,628-640 ? State and approvals",
    "trigger_condition": "Original approval/final-validation statements do not distinguish pending correction alignment and rebuild authorization.",
    "guard_snippet": "Preserve original approvals as history; mark corrections pending alignment/acceptance, record implementation hold and revalidate revised stories.",
    "potential_consequence": "A downstream agent can mistake old completion for permission to start correction implementation."
  },
  {
    "lens": "edge-case-hunter",
    "location": "epics.md:278-300 ? Story 1.3",
    "trigger_condition": "Supported identities receive fallback reasons without investigated acquisition or actual coverage.",
    "guard_snippet": "Require per-season image/identity and fallback counts, attempted sources, specific blockers and visual checks.",
    "potential_consequence": "Fallback-only imagery still passes the story."
  },
  {
    "lens": "edge-case-hunter",
    "location": "epics.md:252-262 ? Story 1.2",
    "trigger_condition": "Qualifying rank exists, including qualifying 2 followed by penalized grid 7.",
    "guard_snippet": "Replace grid with best GP qualifying rank; require conservative qualifying coverage and penalty-independence fixtures.",
    "potential_consequence": "Supported qualifying votes remain omitted and obsolete grid-unavailability persists."
  },
  {
    "lens": "edge-case-hunter",
    "location": "epics.md:194-197 ? Story 1.1 and summary integration",
    "trigger_condition": "Favorable values render in detailed comparison or summary.",
    "guard_snippet": "Require tick/highlight without visible Better text on both surfaces and accessible driver/metric/direction descriptions.",
    "potential_consequence": "Visible labels persist or accessible descriptions omit favorable direction."
  },
  {
    "lens": "edge-case-hunter",
    "location": "epics.md:557-565 ? Story 3.4",
    "trigger_condition": "A corrected release updates the existing anyone-with-link Site.",
    "guard_snippet": "Reuse the Site and preserve anyone-with-link access; verify returned visibility/link access.",
    "potential_consequence": "Owner-private acceptance removes the currently authorized sharing audience."
  },
  {
    "lens": "structure",
    "Pass": "structure",
    "Original Text": "Opening metadata/Overview show a final original plan; current correction links and supersession are absent.",
    "Revised Text": "MOVE correction links and supersession into a Current handoff block before the historical baseline.",
    "Changes": "Preserve historical facts and orient readers before the old acceptance criteria. Estimated addition: 60?90 words."
  },
  {
    "lens": "structure",
    "Pass": "structure",
    "Original Text": "Requirements inventories and coverage maps precede the epic index and stories.",
    "Revised Text": "MOVE the Epic List after current handoff context; move detailed inventories/maps after stories as reference.",
    "Changes": "Expose the work breakdown early while preserving traceability. Word impact: 0."
  },
  {
    "lens": "structure",
    "Pass": "structure",
    "Original Text": "Original approvals repeat in per-story metadata, Overview, Batch Review and Final Planning Validation.",
    "Revised Text": "MERGE approval history into one historical record; retain story-specific exceptions and links.",
    "Changes": "Distinguish old approval from current correction state. Estimated reduction: 100?140 words."
  }
]
```
