# Iteration-four coverage and brownfield consistency review

Verdict: Compatible architecture with documentation alignment gaps; no critical or high finding and no new architectural decision is required for the two requested UI changes.

Scope: architecture spine against iteration-four SPEC.md and acceptance.md, adopted DESIGN.md / EXPERIENCE.md, and selected existing implementation seams. This is a Validate review; architecture and code were not changed. Deterministic lint was reported clean by the coordinating reviewer. No new technology is proposed, so no technology-currentness research is needed.

## Findings

### Medium — Scope authority and capability index stop at iteration three

Evidence: spine front matter `scope`, `binds` and `sources`, Current scope authority, structural capability table, and Handoff status all identify iteration three as the current target. They omit SPEC-iteration-four/CAP-1 and CAP-2, despite linking UX documents that now explicitly declare iteration four current. Handoff still instructs implementers to align UX and create iteration-three stories. A reader following the architectural handoff therefore receives an obsolete work target and no explicit route from the new capabilities to existing rules.

Recommendation: update the scope/source authority and handoff, and map iteration-four CAP-1 to shell/SeasonEvidence under AD-1/5/13 and CAP-2 to Progress/EvolutionChart under AD-1/2/10/14. Explicitly state that current UX owns disclosure placement/state and point-label presentation. Preserve all AD IDs and scoring/data contracts. Disposition: clear documentation fix during a later Update, report only under Validate.

### Low — Stack-seed reality checks describe the pre-iteration-three codebase

Evidence: Stack seed states contracts have schema/bundle v1 and service hardcodes two-year candidates. Current `app/shared/contracts.ts` defines SeasonSnapshotV2, SupportManifestV2 and BundledManifestV2 alongside compatibility v1 types; `app/server/service.ts` validates the shared 2010–2026 candidate list. The UX spines record iteration three approved complete, while the architectural handoff still describes the v2 migration/audits as future implementation gates. This makes the brownfield baseline misleading, although the normative v2 rules themselves remain compatible.

Recommendation: mark those observations as historical iteration-three discovery or refresh them from the current repository; keep completed implementation evidence distinct from pending publication and from future iteration-four verification. Disposition: documentation refresh, not a request to redo migrations or audits.

## Coverage and non-findings

- CAP-1 is implementable in the current shared shell: `App.tsx` renders `SeasonEvidence` before active surfaces, and `SeasonEvidence.tsx` already receives the snapshot and manifest. Moving this presentation below active analysis and controlling its disclosures does not change contracts, refresh ownership or immutable bundles. AD-1 explicitly delegates layout to DESIGN.md and interactions to EXPERIENCE.md, which already specify initial collapse, same-session retention, URL/history independence, focus behavior and empty/error states. Their absence from an AD is not an architecture gap.
- CAP-2 is implementable through the existing shared `EvolutionChart` input: rows already carry numeric `value` and formatted `text`, and both point and legend labels currently render `identity(item.id)+1`. Keep stable identity/style mapping while replacing display labels. AD-1 and AD-10 already require shared selector/evidence consistency; AD-2 preserves unavailable versus zero. No new API, schema, dependency or formatting service is warranted by this scope.
- UX explicitly limits new value labels to the shared driver/constructor Progress chart and retains Compare behavior. Label offsets, leader lines, scrolling and precision are binding UX decisions under AD-1, not Deferred architectural divergence. Preserve AD-14's unbounded selection and verify dense coincident labels during implementation.
- Lifecycle wording is compatible: AD-13 requires ongoing/season-to-date truthfulness without prescribing a top panel. UX retains Current/Final, source-lag and relevant Season-to-date captions beside results while moving detailed lifecycle evidence below analysis. Collapsing detailed evidence must not hide actionable errors or qualify results inaccurately.
- Existing local/bundled boundaries, deployment environment, release identity/audience and explicit publication authorization remain decided by AD-7/9/12; iteration four changes none of them. No operational dimension newly requires a decision.

No application defect is asserted from the fact that iteration-four UI work is not implemented yet. The current ordinal labels and top evidence panel are expected implementation touchpoints, not review findings against completed iteration-four code.
