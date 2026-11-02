# Next-iteration spec reconciliation

Date: 2026-11-02. Verdict: PASS. Input reconciliation only; this is not the final architecture review gate.

Compared SPEC-next-iteration-feedback/SPEC.md and acceptance.md against ARCHITECTURE-SPINE.md. No missing capability, contradictory requirement or blocking seam found. No spine changes made.

| Contract | Architecture coverage | Finding |
| --- | --- | --- |
| CAP-1 exclusive Standings identity | AD-11 shared ConstructorIdentity Standings mode | Covers driver affiliations and constructor rows, logo-only accessible identity, name-only fallback, image failure and identity/season changes. |
| CAP-2 latest verified 2026 cutoff | AD-13 ingestion/audit/service/export, AD-3/5/9 | Covers authoritative event/round/timezone/source evidence, required sessions and official standings, source lag, local and immutable bundled identity, last-good retention. Latest round remains implementation verification. |
| CAP-3 grouped inline checkboxes | AD-14 pure progress-model projection and Progress | Covers canonical season affiliations, multi-team shared IDs, fallback group, wrapping team field, unique counts, filtering, additive Select all, chart/table parity and keyboard access. |
| CAP-4 instructions above controls | Current scope authority, AD-1 and capability-owner table | Exact copy and selected-year presentation remain UX-owned; visual and DOM order are explicit. Both Progress and Compare have owners. |
| CAP-5 clear on explicit year change | AD-14 shell navigation transaction, AD-5 response guards | Clears both graph sets, legacy entity and A/B, including shared IDs. Prevents default repopulation and stale callbacks; separates Back/Forward restoration and same-year refresh retention. |
| CAP-6 compact single scorecard | AD-10 shared comparison model/ComparisonSummary, AD-11 media | Covers A/B portraits, six rows, one label/value pair, single optional aggregate, preserved metrics/votes, non-color ticks, neutral ties/unavailable, direction-aware bars and raw-detail exception. |

Quiet constraints and assumptions are preserved: official championship authority; missing versus zero; GP qualifying rather than grid position; completed-GP windows; existing scoring and explicit-choice teammate defaults; accessible names and non-color cues; narrow/200% reflow; local refresh and immutable hosted data; no publication authorization. Multi-team grouping, team-mode copy and historical navigation are explicitly identified as spec assumptions.

Conflict sweep: previous logo-plus-name and cross-year retention are explicitly superseded and amended in place. AD-6 delegates Progress semantics to AD-14. AD-4 teammate defaults remain compatible because AD-14 restricts invocation after year changes. Earlier CAP rows in the ownership table identify retained historical capabilities; the new rows are prefixed Next-iteration and remove ambiguity. Historical audit/migration statements do not establish a current 2026 cutoff; AD-13 and the handoff explicitly require fresh evidence.

Seams are assigned: ConstructorIdentity owns logo failure; shared projection owns groups and canonical IDs; shell owns navigation/history; comparison model owns outcomes and the summary renders them once; audit/service/export own source acquisition, atomic snapshot/support consistency and bundled cutoff. Group projection/state-transition/identity contracts are identified for freezing before feature work. No additional schema or technology choice is needed.

Required fixes: none.
