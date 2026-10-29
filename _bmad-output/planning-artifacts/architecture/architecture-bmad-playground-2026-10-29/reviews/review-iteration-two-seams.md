# Iteration-two architecture seam review

Reviewed ARCHITECTURE-SPINE.md against the approved implementation-artifacts/spec-second-iteration.md and current shared contracts. This is an independent architecture review, not implementation verification.

Verdict: the two-edition direction preserves the approved scope. No critical contradiction found. Resolve the following contract decisions before independent implementation begins; the existing deferred-contract gate provides the right place.

## S1 — Medium: exported manifest and adapter share no concrete contract yet

AD-9 lists manifest information but does not bind its shape or error/result contract. One compliant exporter can emit a flat array of season entries with an `assetPath`, while another compliant loader expects AD-6's `{data: {seasons: [...]}}` with nested release metadata. Both contain every listed field, but the hosted build fails to load. Current `SupportManifest` has no snapshot identity or asset fields.

Bind a shared bundled-manifest type, its schema/version discriminator, entry fields, path resolution relative to the configured base, and the adapter result/error and capability contracts. Require exporter and loader to import the same definitions. Distinguish the static JSON shape from the local API envelope explicitly. Keep the architecture's existing rule that views never choose URLs or adapters.

## S2 — Medium: summary coverage and retirement classification can still produce different winners

AD-10 correctly assigns comparison policy to one module, but two implementations can disagree about a driver's season-wide sample. One may treat every schedule round without a driver entry as incomplete participation and make best finish/DNF unavailable; another may exclude events before debut or after replacement and produce season totals. The normalized schema has no explicit entered-session roster. Likewise, saying retirement statuses are defined centrally establishes ownership without selecting the classification of statuses beyond DNS/disqualification.

Before freezing comparison types, record how absent participation is distinguished from a missing result, what evidence proves a driver's sample complete, and the retirement-status mapping including unknown statuses. Shared fixtures should cover a substitute driver, a missing result in an otherwise complete endpoint, a classified retirement, and an unknown status. These choices affect a vote and can change the declared overall winner.

## S3 — Low: optional grid migration should have an explicit iteration-two decision

AD-10 allows either retaining schema v1 with unavailable grid or extending/invalidation/reverification. Both are permitted by the approved spec, which allows explained unavailable rows, but implementing exporter and provider changes independently can select opposing assumptions: an exporter only accepting v1 can reject a correctly reverified v2 snapshot.

Record the selected schema strategy before export work starts: retain v1 and display the explained unavailable grid row, or define the new version and reverify both seasons. Pin accepted schema versions consistently in provider validation, cache loading, export and bundled loading. Do not leave the version choice to each unit.

## Release boundary checks

AD-9/12 already close the major release seams: explicit build mode, no fallback provider calls, exact verified seasons, source timestamps separate from export time, immutable release assets, preserved Site identity, owner-private publication, terminal success evidence, and local refresh requiring republishing to affect hosted data. No additional runtime backend or network-disconnected promise is needed.
