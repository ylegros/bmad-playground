# Feedback coverage and architecture rubric review

Verdict: PASS WITH MINOR DOCUMENTATION NOTES. No critical, high or medium finding blocks this architecture handoff. The corrected spine reconciles the accepted feedback contract and revised story requirements without introducing a new user decision or claiming implementation acceptance.

## Scope and authority

Reviewed ARCHITECTURE-SPINE.md against ../../../../specs/spec-iteration-two-feedback/SPEC.md, its acceptance-corrections.md companion, and planning-artifacts/epics.md. The source application is the shipped pre-correction baseline; differences required by the accepted feedback are intentional future implementation, not brownfield inconsistency. This review changes documentation only. No code execution, asset acquisition, build or publication result is asserted.

## Capability reconciliation

| Contract | Binding architecture | Assessment |
| --- | --- | --- |
| CAP-1 constructor logos | AD-11, AD-9 | Targets every snapshot constructor/season; historical identity, explicit mappings, bundled credited files, attempted sources and individually evidenced exceptions are mandatory. Actual logo counts and fallbacks are separate. Visual inspection is required; fallback tests cannot close acquisition. Matches Stories 1.3/3.3/3.4. |
| CAP-2 driver photographs | AD-11, AD-9 | Targets every driver/season with verified photographs, honest date/unknown disclosure and permitted cross-season reuse. Provenance, license, filename, crop notes and visual checks are explicit. No generated likenesses or reduced pre-approved percentage. Matches the same imagery stories. |
| CAP-3 best GP qualifying rank | AD-10 | Fixed six rows replace grid with lowest authoritative GP qualifying position. Qualifying 2/grid 7 remains 2. Conservative complete-season records, precise qualifying reasons/sample counts, equal voting and separate qualifying head-to-head are retained. No schema migration or seventh category. Matches Story 1.2. |
| CAP-4 concise favorable markers | AD-10 | Summary/detail share outcomes; tick/highlight replace repeated visible Better wording. Accessible descriptions identify driver, metric and direction; decorative ticks are hidden. Ties/unavailable get neither favorable tick nor highlight. Matches Stories 1.1/1.2. |
| Existing audience and execution boundary | AD-12; current correction authority | Existing returned Site identity and anyone-with-link access are retained; no replacement registration or owner-private regression. Explicit future execution authorization, terminal-result evidence and historical-release separation are required. Matches Stories 3.3/3.4. |

## Rubric assessment

- Enforceability: Each AD names Binds/Prevents/Rule. AD-9 owns adapter and release boundaries, AD-10 owns shared comparison policy, AD-11 owns identity/provenance/coverage, and AD-12 owns release identity/audience/evidence. These prevent the concrete independent-builder divergences the corrections expose.
- Baseline preservation: AD-2/3 preserve canonical identities, source statuses, missing versus zero, fractional/official points and GP/sprint separation. AD-4 retains teammate policy. AD-5/6 retain refresh, immutable snapshot commitment and navigation guards. AD-10 preserves conservative best/count coverage, frozen retirement cases, graph/table agreement and accessible inspection.
- Operational/environmental envelope: AD-7 explicitly scopes the loopback Node process, disk repository, upstream queue, retries, logging and atomic writes to local mode. AD-9/12 cover static bundled builds, same-origin immutable assets, sanitized isolated source, existing hosting identity, deployment evidence and network limitations. No operational dimension is silently missing at this feature altitude.
- Brownfield fit: Retained layered React/TypeScript/Vite application, schema v1, exporter and local server are explicit. The document clearly distinguishes corrected intended behavior from shipped code. No new starter, backend, database, season or scoring policy is introduced.
- Deferred work: Libraries/component details and expanded operational topology remain outside the shared invariants. Deferral of exact ancillary contract fields is bounded by shared-contract-first ownership; it does not permit feature-local incompatible shapes. Additional seasons require a new audit.
- User decisions: No new decision is required for architecture. Previously adopted assumptions remain visible; user acceptance of eventual imagery exceptions/correction results is an existing acceptance obligation, not a new architecture choice.
- Reconciliation status: Revised epics still record architecture alignment as open and quote the old AD-10/11/12 behavior in their validation history. This spine now supplies the required alignment. Epics final revalidation and UX source alignment remain separate downstream steps, correctly not represented as complete here.

## Minor notes

1. LOW — Frontmatter traceability understates scope. `binds` lists only FR-1 through FR-9 although AD-9/10/11/12 and the capability table bind iteration-two hosting/comparison/media. Add CAP-1 through CAP-4 and/or relevant FR-10 through FR-21 identifiers to prevent metadata consumers from overlooking correction coverage. Disposition: autofix documentation metadata; no user decision.
2. LOW — Stack-seed evidence wording retains “private deployment” in its parenthetical description of installed Sites contracts (line 145). AD-12 is unambiguous about current anyone-with-link access, so this does not change the governing rule, but “deployment” or “audience-aware deployment” would avoid a stale signal. Disposition: autofix prose.

Named dependency versions are presented as retained installed seed, not a dependency selection or upgrade. This coverage review does not independently attest current upstream package/provider versions; unchanged versions are not a feedback-correction blocker.

No spine edits were made by this reviewer.
