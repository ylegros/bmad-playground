# Acceptance and visual direction

## Standings identity — CAP-1

- Check both driver affiliations and constructor standings: a valid season-appropriate team logo appears without an adjacent visible team-name duplicate.
- Missing, unmapped or failed logos show the readable team name, without an empty badge or broken image. Logo-only identities expose the team name to assistive technology.

## Latest 2026 data — CAP-2

- During implementation, identify the latest completed 2026 GP using authoritative results. Record the event, round, verification timestamp/timezone and source links in delivery evidence.
- Refresh the existing supported results, qualifying, points and standings inputs through that event; preserve Sprint distinctions and lifecycle statuses. Recompute existing analyses from the updated evidence.
- Verify the delivered local and bundled snapshots against that cutoff. Expose genuine gaps and standings source lag rather than claiming unsupported completeness or finality; retain the last good snapshot on refresh failure.

## Progress selection — CAP-3 and CAP-4

- Replace the vertical entity list with visible labeled checkboxes flowing horizontally and wrapping. Driver options are grouped under readable team labels; constructor mode displays team options in a wrapping inline field.
- Keep all options reachable without a selection cap. Multi-team duplicates share checked state and never duplicate chart series or evidence columns. Filtering preserves selected nonmatches; Select all remains additive across all matches.
- Above search, bulk actions and options, display: **Choose your focus** followed by **Choose at least one driver to explore season evolution.** Team mode uses corresponding team wording.
- Checked controls, selected counts, URL state, graph and table agree after toggle, search, Select all and Clear selection. Check pointer and keyboard use, narrow screens and 200% zoom.

## Year changes — CAP-5

- With selections in both Progress categories and Compare, switch years. Both category sets, legacy entity and A/B are empty in controls, URL and analysis, even for shared IDs. Switching back through the year selector stays empty.
- Show the appropriate empty guidance. A year change alone must not trigger latest-teammate selection; explicitly choosing driver A still applies the existing teammate default.
- Commit the year and reset coherently, avoiding stale charts or delayed callbacks restoring old choices. Check Back/Forward restoration separately from explicit year selection.

## Compare headings and composition — CAP-4 and CAP-6

- Above the selectors, display **Choose two drivers from {season}** and **Start with a driver to select their latest teammate automatically.** Replace the year dynamically.
- Use the conversation's attached reference as composition guidance: driver A portrait/identity on the left, compact central scorecard, driver B portrait/identity on the right. Retain current verified media and fallbacks.
- Each of the six rows shows one centered metric label, A's value on the left, B's value on the right and a bar between them. Remove repeated value blocks/cards. Any retained aggregate vote score appears once only.
- Preserve these metrics: GP race head-to-head, GP qualifying head-to-head, official championship points, best GP finish, best GP qualifying rank and GP DNFs. The reference's starting-grid metric does not replace qualifying rank.
- Preserve six equal votes, favorable-value ticks/highlights, ties, unavailable reasons and coverage. Bars agree with displayed values, never imply a winner for ties/unavailable data, and never turn missing values into zero. Label lower-is-better metrics clearly.
- Keep driver identities and A/B ordering understandable at narrow widths and 200% zoom; adapt the portrait framing as space requires while retaining one readable scorecard. Detail evidence may repeat raw results where needed for inspection; remove redundant summary score presentations.

## Authority and traceability

The confirmed conversation supplies all eight feedback items: standings identity; latest 2026 results; driver checkbox layout; team checkbox layout; Progress heading; year reset; Compare heading; compact Compare composition. CAP-3 combines the two checkbox items. The existing UX and architecture are adopted baselines; this spec explicitly overrides their conflicting defaults. The attached image is captured here as composition requirements because it has no repository path; its particular assets and numbers are not requirements.
