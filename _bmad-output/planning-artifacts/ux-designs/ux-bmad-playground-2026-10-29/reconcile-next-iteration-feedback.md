# Next-iteration feedback reconciliation

Date: 2026-11-02. Inputs: [SPEC](../../../specs/spec-next-iteration-feedback/SPEC.md) and [acceptance](../../../specs/spec-next-iteration-feedback/acceptance.md). This records documentation coverage, not runtime evidence.

| Confirmed feedback | UX destination | Resolution |
|---|---|---|
| Standings logo or name, never both | DESIGN Components / Next-iteration presentation; EXPERIENCE Identity media / Flow 12 | Valid season logo alone, accessible name once; missing, unmapped or failed image becomes readable name. Overrides AD-11 within Standings. |
| Latest 2026 race results | Both current authority sections; DESIGN Next-iteration presentation; EXPERIENCE delivery evidence / Flow 12 | Implementation verifies event/round/timezone/source links, refreshes supported inputs and checks local/bundled cutoff. No last-round claim or acquisition in planning. |
| Driver checkboxes inline, team-grouped | Both Progress panel rows; EXPERIENCE grouping / Flow 12 | Wrapping labeled checkboxes, readable group names; shared multi-team ID and fallback group assumptions retained from spec. |
| Team checkboxes inline | Same locations | One wrapping team field; no cap. |
| Progress instructions above selection | Both new presentation sections; EXPERIENCE Voice and Tone | Exact driver copy precedes search, actions and options; team wording remains labeled assumption. |
| Clear selections on year change | EXPERIENCE Selector / states / Interaction Primitives / Flows 9 and 12 | Both sets, legacy entity and A/B clear coherently, including shared IDs. No defaults or stale commits. Explicit selector and historical Back/Forward differentiated. Overrides AD-14 retention. |
| Compare instructions above selection | Both Comparison panel rows; EXPERIENCE Voice and Tone | Exact heading with selected year and exact teammate guidance above selectors. |
| Compact reference composition without duplicate score | Both Comparison summary rows and new presentation sections; Flow 12 | A portrait / one central six-row scorecard / B portrait. Label and values once; aggregate at most once. Existing qualifying-rank metric, equal votes, ties, reasons, ticks/highlights preserved. |

No qualitative feedback dropped. Pit Wall tokens, three surfaces, bottom disclosures, actual-value point labels, complete-selection search/Select all semantics, same-year retention, history restoration, immutable hosted bundle and failure retention remain. Prior optional multi-lens validation skip and Progress/Compare spine-only preferences persist. Historical mocks/supplement yield to current spines; no new mock is claimed.

Open implementation evidence: latest completed GP cutoff, updated snapshots and browser/keyboard/narrow/200% checks. Adopted architecture still contains older identity/retention text; the spec and current spine authority explicitly supersede those clauses. Architecture edits are outside this UX update.
