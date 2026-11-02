# Next-iteration UX input reconciliation

Date: 2026-11-02. Inputs: current DESIGN.md and EXPERIENCE.md in `ux-bmad-playground-2026-10-29`; target: current ARCHITECTURE-SPINE.md. This is input reconciliation, not the final reviewer gate. The spine was read only.

Verdict: **PASS with one wording clarification**. All eight user feedback items and the quieter retained UX constraints have an architecture owner or explicit delegation to UX. No load-bearing UX requirement is missing.

| UX contract | Architecture landing |
| --- | --- |
| Standings logo exclusively, readable name fallback, one accessible identity, load-failure recovery | AD-11 explicit Standings mode, both ranking categories, shared failure renderer; other surfaces retain affiliation text. |
| Latest completed 2026 GP, honest freshness/cutoff and retained snapshot on failure | AD-13 implementation-time evidence acquisition, matching snapshot/support metadata and immutable export; no invented current round or publication. |
| Wrapping driver checkboxes grouped by season team; wrapping team field | AD-14 shared canonical projection; multi-team appearances share one ID, checked state and unique counts; readable fallback group; UX owns accessible grouping/wrap. |
| Exact Progress/Compare guidance before controls in visual and DOM order | Current scope authority explicitly delegates exact wording and placement to DESIGN/EXPERIENCE; structural mapping CAP-4 identifies Progress and Compare shell. |
| Explicit year reset versus historical navigation | AD-14 clears both graph sets, legacy entity and A/B atomically, including IDs valid in both years; selector return stays empty; Back/Forward restores historical state; same-year navigation/refresh retain selection. Generation guard also handles away-and-back delayed callbacks. |
| One portrait-framed six-row scorecard and one value per driver per row | AD-10 reuses shared outcomes, prohibits values repeated in tracks and duplicate aggregate votes; raw evidence may repeat. |
| Quiet accessibility and truthful comparison bars | AD-1 delegates tokens/accessibility to UX; AD-10 retains non-color ticks, descriptive assistive text, hidden decorative tracks, lower-is-better labels, ties/unavailable neutrality and coverage/reasons. AD-14 retains focus, announcements, keyboard/table access, unique counts and narrow/200% inspection. |
| Bottom disclosure behavior and current numeric chart labels | Current scope authority retains iteration-four placement, same-session expansion independent of URL/history, actual labels and status-rich evidence; AD-1 retains the UX contracts. |

## Precise clarification

AD-10 says every row retains a track, then says negative points use text without invented magnitude. EXPERIENCE's grouping/comparison contract requires a neutral track where meaningful proportional magnitude is undefined. Make the negative-points clause unambiguous: **“negative points use a neutral track with explicit values and no invented magnitude.”** This preserves the stated every-row track contract and avoids one implementation omitting that row's track.

## Stale-conflict assessment

The current scope authority explicitly supersedes earlier AD-11 logo-plus-name and AD-14 cross-year retention. Amended rules agree with the current UX. Historical first-iteration and iteration-two sections are labeled historical and do not regain authority. “Progress search/list” in AD-14's Binds line is legacy terminology only; optionally change it to “Progress search/options” for consistency with wrapping controls. No new stack, schema, color palette, mockup, scoring metric or current-race claim was introduced.

No source UX edit is required by this reconciliation.
