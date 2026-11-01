# Iteration four acceptance

## Bottom season information

1. Open Standings, Progress and Compare with ongoing-season data. The active analysis precedes the season lifecycle/evidence and coverage disclosures; neither panel is duplicated above it.
2. On initial load the disclosures are collapsed (assumed default). Expand and collapse using pointer and keyboard; focus remains usable and expanded state is exposed to assistive technology.
3. Expanded content retains lifecycle, audit status/time, source freshness, analyzed rounds, standings evidence and applicable notices, plus the existing per-year verification and known-gap inventory.
4. Switch to a complete season: expanded details reflect the selected season and preserve accurate final/current standings wording. Check narrow-screen layout.
5. Expand a disclosure, change surface and season in the same session, and verify expansion is retained while content follows the selected snapshot. Toggling changes neither URL/history nor analysis selection and does not move focus or scroll the page. A fresh page load starts collapsed.
6. Preserve Current/Final, Season-to-date and source-lag captions beside affected results, plus actionable errors/unavailable notices. Loading or failed refresh must not mix a new season's summary with old evidence; retain matching last-good snapshot metadata on refresh failure.

## Metric labels

1. Select 2026, Drivers and GP qualifying position. For every rendered point, the label equals the corresponding driver's qualifying position for that round. Compare against the evidence table and round inspection details.
2. Change metrics and selections, including constructors: labels follow current values rather than stale values or assigned entity numbers. Preserve existing metric precision/formatting semantics.
3. Verify a genuine zero and an absent value: zero displays as zero; absence creates a gap without an invented point or number. Non-numeric result statuses retain existing evidence semantics.
4. Plot entities sharing a value. Names, colors and line styles still identify series; point labels must not rely on the removed ordinal numbers. Check legibility with multiple selections and narrow screens.
5. Preserve pointer inspection, keyboard Left/Right and Home/End inspection, round details and the accessible evidence table.
6. Inspect long, fractional, negative and coincident values where supported by the selected metric. Labels retain existing precision; offsets/leader lines identify true point locations without moving the points. Check local chart scrolling, narrow screens and 200% zoom without clipping complete labels or dropping selected entities. Numeric point labels and status-rich table/inspection text retain their distinct purposes.

## Verification boundary

Exercise the changed interactions in local and bundled editions using existing audited data/fixtures. Bundled analysis must make no external/API requests. Run the existing relevant unit/browser regression checks after implementation; no tests or builds are claimed by this preparation document. Source acquisition, publication and broad historical re-auditing are outside this iteration's UI change.

## Existing implementation touchpoints

- `app/client/App.tsx`: placement of shared season information relative to active analysis and footer.
- `app/client/SeasonEvidence.tsx`: lifecycle/evidence panel and existing coverage disclosure.
- `app/client/EvolutionChart.tsx`: assigned numbers currently appear in both point labels and legend symbols.
- `app/client/Progress.tsx`: metric definitions, shared chart and matching evidence table.

These observations guide implementation; the spec defines the required behavior.
