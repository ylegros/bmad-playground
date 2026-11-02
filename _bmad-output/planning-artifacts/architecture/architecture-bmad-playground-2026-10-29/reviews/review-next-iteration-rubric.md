# Next-iteration architecture rubric review

Verdict: PASS. The spine fixes the feature-level divergence points for all six capabilities, ratifies the existing application and states a sufficient operational envelope. No critical, high or medium finding blocks handoff.

Reviewed 2026-11-02 against SPEC-next-iteration-feedback/SPEC.md, acceptance.md, the updated DESIGN.md and EXPERIENCE.md, the reviewer-gate good-spine checklist, and selected brownfield sources (package.json, App.tsx, Identity.tsx, ComparisonSummary.tsx and file ownership).

## Capability coverage

| Capability | Architectural coverage | Judgment |
| --- | --- | --- |
| CAP-1 exclusive Standings identity | AD-11 assigns one shared renderer, a Standings mode, accessible identity and failure/identity-change recovery; preserves other surfaces. | Enforceable; covers both affiliations and constructor rows. |
| CAP-2 latest verified 2026 data | AD-13 names the ingestion/audit/service/export seams, authoritative cutoff evidence, matching local/bundle identity and separate source/export time; AD-3/5/9 preserve championship authority and atomic outputs. | Covers acquisition rather than treating saved-page audits as acquisition. No unsupported current-round claim. |
| CAP-3 grouped wrapping options | AD-14 owns pure selected-season affiliation projection and unique IDs across duplicate appearances; retains filtering, additive Select all, URL, graph and table agreement. | Prevents independent selection models and current-team inference; wrapping/group accessibility correctly belongs to UX. |
| CAP-4 headings above controls | Current scope authority delegates exact guidance and visual/DOM order to linked UX; AD-1 makes that authority binding; structural mapping names both surfaces. | Sufficient without duplicating exact copy in the spine. |
| CAP-5 coherent year reset | AD-14 separates explicit year selection from history restoration and same-year refresh, clears both graph sets/legacy/A/B, and rejects stale callbacks even after away/back navigation. | Enforceable and covers IDs valid in multiple years and teammate defaults. |
| CAP-6 compact scorecard | AD-10 centralizes all six outcomes and values, one scorecard, optional aggregate once, portrait framing and nonnumeric tracks; AD-11 preserves verified media/fallbacks. | Prevents scoring/presentation divergence and duplicate summary values while preserving inspectable evidence. |

## Good-spine checklist

- Real divergence points are decided: identity fallback ownership, selected-season group membership, duplicate-ID behavior, explicit-year versus history semantics, navigation-context invalidation, data acquisition versus audit, local/bundle cutoff identity and shared scorecard outcomes.
- Rules specify responsible modules, observable behavior and negative constraints. Their stated prevention claims follow from those rules. Selection contracts must be frozen before feature work, rather than independently invented by consumers.
- Deferred items do not reopen any present capability decision. Detailed types are explicitly gated before implementation; new infrastructure, live updates and cross-season comparison remain outside scope.
- Brownfield ratification is credible: existing App year handling retains graph sets, ConstructorIdentity pairs text/logo, and ComparisonSummary repeats raw values inside tracks. The document labels these as target amendments rather than claiming implementation. Existing pure model, immutable export, API adapter and local server seams remain the owners.
- The retained dependency pins match package.json. This change introduces no new dependency, version or provider choice; no latest-version claim is required to establish the retained installed seed.
- Operational/environmental envelope is explicit: local loopback single Node process, writable atomic cache, Vite development proxy, same-origin production API/assets; separate immutable bundled deployment with no runtime provider/Node dependency; bounded local provider queue, retry/failure behavior, logging and explicit refresh. Deployment identity/audience and publication evidence remain governed by AD-12.
- No inherited parent spine is identified; this update preserves stable AD IDs and makes superseded Standings/year-selection rules explicit. Other retained decisions remain binding.
- UX's narrow/200% reflow, accessible grouped options, numeric metric labels, neutral tracks, guidance order and bottom disclosures remain authoritative; no conflicting presentation rule was found.

## Low finding: distinguish failure retention at each publication boundary

AD-13's sentence combining failed acquisition/audit/refresh/export with retention of the local snapshot and previous bundled release can be read as requiring rollback of a successfully refreshed local snapshot when a later export fails. Its preceding service/export ownership rules imply independent atomic boundaries, but the combined sentence is less precise.

Recommended disposition: optional autofix. State that acquisition/audit/refresh failure preserves the last committed local snapshot/support metadata; export failure preserves the last promoted bundled release and does not roll back a successful local refresh. This clarification introduces no new architecture and is not a gate blocker.

## Verification limits

This is a document gate, not implementation acceptance. No new provider evidence was acquired and no current completed-race cutoff, code change, full regression run or hosted publication was verified. The deterministic spine lint was reported as already passing by the parent task; this review independently assessed semantic coverage rather than rerunning it.
