# Accepted-feedback architecture seam review

Reviewed 2026-10-29 against ARCHITECTURE-SPINE.md, the canonical accepted-feedback SPEC.md and acceptance-corrections.md, the retained iteration-two specification, and the existing shared contracts/media owner. Documentation review only; no implementation or publication verification is claimed.

Verdict: PASS with one contract-freeze follow-up. The changed decisions close the earlier qualifying/grid, manifest-envelope, conservative coverage and audience seams. No correction-blocking contradiction found. The existing deferred requirement to define shared contracts before independent implementation must also cover the media handoff below.

## S1 — Low: make the media metadata handoff shared before splitting acquisition and export

AD-11 gives `app/client/media.ts` ownership of identity/season mappings and `public/media/credits.json` ownership of provenance. AD-9 requires exporter/loader shared runtime validation for bundled snapshots, but no equivalent shared owner is named for the credits/mapping schema, inventory enumeration or coverage-count calculation. Existing `MediaAsset` and `MediaFallback` interfaces live in the client module, which imports the runtime data source. The exporter cannot reasonably import that entire client module as its pure validation boundary.

Concrete incompatible subordinate units, each satisfying the written AD invariants in isolation:

- Unit A owns acquisition/mapping and supplies credits as an `assets` array, with one photograph record containing `seasons: [2010, 2021]`. Its report correctly counts that file once for each mapped identity/season. Explicit mapping lookup stays in `app/client/media.ts`.
- Unit B owns export/packaging and validates season-expanded provenance records keyed by kind, canonical identity and season. Its internal contract expects a separate record for each season and a manifest of referenced filenames. It validates all required provenance fields and immutable-release integrity, keeps the snapshot contract shared, and has no runtime external requests.

Neither serialization violates the listed metadata requirements; they cannot consume the same credits input without an agreed conversion. This is a handoff risk, not a claim that the current baseline already fails or that a schema migration is needed. The existing deferred-contract gate prevents these units from proceeding independently without resolving it.

Close by explicitly extending that gate: one pure shared media contract/validator consumed by mapping, export and evidence generation; retain existing serialization where practical. Define coverage denominators as canonical identity/season pairs from verified snapshots, numerators as successfully verified mapped identity/season pairs, unique physical-file counts separately, and fallbacks separately. A photograph reused in both seasons counts toward both season inventories, not as two acquired files. Keep acquisition investigation evidence outside the deployment artifact as AD-11 already requires. No new media API or service is warranted.

## Attempts to construct conflicting qualifying units — closed

A domain unit using qualifying classification 2 and a scorecard unit using penalized grid 7 cannot both obey AD-10. The decision explicitly fixes `QualifyingResult.position`, schema v1, six votes, and a distinct qualifying head-to-head category. No optional grid migration remains.

A unit excluding substitute-driver absences to publish a season best and another marking that best unavailable also cannot both obey AD-10: every scheduled GP requires complete qualifying and that driver's authoritative numeric record. Missing qualifying has its own unavailable reason and coverage count. Best finish/DNF follow the same conservative absence boundary; DNF interpretation is centralized with fixtures and unknown-status behavior. Exact retirement allowlist contents belong to the shared comparison implementation, not independently to each surface.

Head-to-head does not inherit the season-best requirement: the retained specification restricts its sample to rounds with comparable authoritative values for both drivers, and AD-10 requires eligible/tied/excluded round disclosure. Summary/detail must consume that shared policy. No seventh row or duplicate best-rank count is allowed.

## Attempts to split shared domain and release ownership — closed

AD-1 keeps pure contracts/selectors free from UI, HTTP and storage. AD-9 binds adapters to domain-returning methods, gives only local mode refresh capability, fixes direct bundled JSON versus local API envelopes, and places export/load validation under one contract. Views cannot select adapters or construct data URLs. Two independent envelope conventions would violate AD-9.

Media resolution belongs to the selected adapter after validated manifest loading; release-specific paths or equivalent cache policy tie photographs, logos, credits and snapshots to one immutable release. A loader combining a new snapshot with stale prior-release media would violate AD-9. The spine appropriately leaves exact release path syntax to the shared implementation rather than requiring a second backend.

AD-11 closes identity/provenance and false coverage claims: canonical identities and applicable seasons, historical constructor suitability, honest photograph dates, complete credits, actual files, individual investigated exceptions, distinct fallback counts and visual checks are explicit. Sharing one photograph across seasons is allowed; sharing an unrelated modern constructor identity is not. Remaining exceptions require user acceptance; the architecture grants no reduced coverage target.

## Attempts to split marker accessibility — closed

A summary showing visible Better text while detail uses a tick cannot satisfy AD-10. Both must consume shared outcomes and use a visible tick/highlight with driver, metric and favorable-direction text for assistive technology; the tick is decorative to accessibility APIs. Ties and unavailable values have no favorable marker. CSS/component details may differ without creating a domain seam. Acceptance should verify the accessible text actually exposed in both surfaces, not only the presence of a hidden node.

## Attempts to split existing Site identity/audience — closed

An owner-private redeploy and an anyone-with-link redeploy cannot both satisfy AD-12. It explicitly preserves the currently authorized anyone-with-link audience and existing returned project identity; uncertain identity must be inspected/recovered rather than replaced. Earlier private-deployment wording in historical implementation evidence is superseded by the correction authority and AD-12.

AD-12 also separates document approval from execution authorization, requires sanitized exact source and matching packaging, pending-deployment recovery, terminal success evidence, URL and sharing evidence. A locally built archive alone cannot establish publication. No acquisition, runtime fix, rebuild or publication was performed during this review.

## Gate recommendation

Accept the architecture update. Carry S1 into the pre-implementation shared-contract freeze; it does not require changing the approved capabilities, schema-v1 data strategy or current audience. Revalidate downstream UX/stories against the canonical corrections and treat prior tests/deployment evidence as historical, as the spine already directs.
