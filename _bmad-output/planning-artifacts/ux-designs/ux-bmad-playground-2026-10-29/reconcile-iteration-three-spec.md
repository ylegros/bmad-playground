# Iteration three specification — UX input reconciliation

Sources: [SPEC.md](../../../specs/spec-iteration-three/SPEC.md) and [season coverage and acceptance](../../../specs/spec-iteration-three/season-coverage-and-acceptance.md). Reconciles the existing DESIGN.md and EXPERIENCE.md against the adopted architecture companion. Documentation checks do not establish data verification, image acquisition, runtime behavior or publication acceptance.

## Required UX coverage

| Input | Required UX claim |
| --- | --- |
| CAP-1: single constructor name | A missing, unmapped or failed constructor logo leaves one accessible adjacent team-name label and no text-filled logo badge. Real season-appropriate logos remain alongside the name. Portrait fallbacks are separate from this constructor rule. |
| CAP-2: 17 seasons | Season selection covers 2010–2026 inclusive with individually audited coverage/status; expanding a dropdown alone does not establish support. Standings, Progress and Compare share the selected-season snapshot. |
| Ongoing 2026 | Clearly label ongoing-season data, current standings and Season to date measures. Expose the completed-GP analysis window; include held GP rounds with source gaps and exclude unheld/cancelled GPs. Future rounds are not missing results or zero. |
| Conservative comparisons | Best qualifying/finish and DNF evidence is conservative per driver across that window; show reasons and coverage counts. Zero completed GPs leaves GP-based categories unavailable. Official standings disclose source round and lag; never claim final/full-season totals. Historical complete-season rules remain. |
| Media identity and provenance | Canonical identity/season mappings prohibit successor branding; photograph date/unknown is independent of selected season. Every represented driver/team-season slot requires a credited real image or individually investigated exception. Count actual images and missing exceptions separately by kind/year; fallbacks are not images. |
| CAP-3: Select all | Keyboard-accessible Progress action adds every search match in the active season/category, preserves nonmatching selections, and is idempotent. Empty search matches all; no results is a no-op; changing search alone leaves selection unchanged. Clear selection removes all in the active category. |
| One selection state | Graph, evidence table, controls, URL and browser Back agree, including remove-one, repeated selection, category/year changes and an explicit empty selection. No hidden series cap discards selected entities. |
| Dense and accessible progress | Every selected series remains inspectable through matching labels, lines and table evidence. Keyboard operation, narrow layouts, intended local scroll regions and 200% zoom preserve access. |
| Preserved analysis | Official points, pre-grid-penalty qualifying rank, GP/sprint separation, ties, missing versus zero and source freshness retain the approved 0.2 semantics. No cross-season comparison, live timing, background refresh or generated identity imagery is introduced. |
| Refresh and hosted mode | Failed verification/refresh preserves the last good snapshot, selection and source timestamp. Local refresh remains manual. Hosted offered seasons, images and credits resolve from one validated local release without runtime provider/image requests; anyone-with-link audience remains. |

## Reconciliation status

Verdict: PASS for documentation coverage. Inspected the updated [DESIGN.md](DESIGN.md) and [EXPERIENCE.md](EXPERIENCE.md), dated 2026-10-30. No accepted iteration-three capability or qualitative acceptance claim is dropped. The spines inherit source requirements by reference rather than repeating ingestion/export implementation work.

| Requirement group | Where preserved | Result |
| --- | --- | --- |
| CAP-1 constructor identity | Both Identity media contracts; EXPERIENCE image-failure state and Flow 6 | One accessible name, no fallback logo badge; real historical logos and separate portrait-frame behavior remain. Pass. |
| CAP-2 all years and audit honesty | DESIGN Iteration-three presentation; EXPERIENCE Selector, Season lifecycle and coverage, audit-unavailable state and Flow 8 | All 17 candidates expose individual audit status; support requires verification and never silently excludes a successfully audited year. Pass. |
| Ongoing window and conservative metrics | EXPERIENCE Comparison summary, Season lifecycle and coverage, lifecycle/freshness copy, zero-GP/source-lag states and Flow 8 | Held source gaps stay in the completed-GP window; unheld/cancelled rounds stay outside. Full-calendar evidence, already-held pre-GP sessions, exact rounds, per-driver reasons/counts, zero-GP unavailable and official standings lag remain distinct. Pass. |
| Media evidence | Both Identity media/Image credits contracts; EXPERIENCE lifecycle coverage and Flow 6 | Historical identity, photo dates, provenance, per-kind/year actual/total/exception counts and individually investigated blockers remain explicit. Source spec retains the prohibition on generated logos/portraits. Pass. |
| CAP-3 selection semantics | DESIGN Progress panel and Iteration-three presentation; EXPERIENCE Progress selection, state rows and Flow 9 | Additive full-list matching, empty/no-match/repeat behavior, search independence, active-category Clear selection, category/year validity, explicit empty URL, single history action and Back coherence remain explicit. No cap; keyboard/many-series/narrow/200% access retained. Pass. |
| Preserved baseline and release behavior | Both current-authority blocks; EXPERIENCE component/state contracts, lifecycle coverage and Flows 4/7 | Scoring/highlights, gaps versus zero, GP/sprint separation, refresh retention, coherent metadata and immutable bundled resources remain. Source spec retains non-goals; no new product scope is inferred. Pass. |

No new user decision is required by this reconciliation. Prior mockups remain historical composition references; written spines govern the iteration-three states. Implementation, all-year data/media auditing, runtime accessibility and blocked-external-request verification remain downstream acceptance work.
