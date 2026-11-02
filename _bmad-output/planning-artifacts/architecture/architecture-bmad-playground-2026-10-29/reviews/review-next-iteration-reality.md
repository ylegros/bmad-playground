# Next-iteration reality and technology gate

Date: 2026-11-02
Verdict: PASS. No blocking reality or technology findings.

## Evidence and scope

Reviewed ARCHITECTURE-SPINE.md against the next-iteration SPEC.md and acceptance.md, package.json, package-lock.json, installed package manifests, and the existing client/shared/server/export seams. This is a document and repository reality check, not execution verification or confirmation of the latest live 2026 race. No new dependency, version selection, provider capability or upgrade is proposed, so installed brownfield evidence is sufficient for the technology claims.

The named retained versions are concrete: React 19.3.1, TypeScript 7.0.2, Vite 8.3.5 and @vitejs/plugin-react 6.1.2 match package.json, lockfile entries and node_modules package manifests. Node >=24.0.0 is accurately described as the repository's declared engine requirement, not a claim about an externally verified latest release.

## Committed decision checks

| Decisions | Repository evidence and finding |
| --- | --- |
| AD-1/2/3/4 | app/shared/contracts.ts, selectors.ts and comparison.ts provide the retained normalized identity, Metric availability, official standings and season-relative comparison boundaries. The update introduces no alternate scoring or provider model. |
| AD-5/6/7/8 | app/server/service.ts provides per-season in-flight coordination, validated snapshots, checksums, staged write/rename and manifest derivation; app/server/audit.ts and evidence-ingestion.ts retain explicit saved-page audits and reviewed lifecycle evidence. Local runtime and browser boundaries remain coherent. Existing rules are retained invariants rather than a new operational claim. |
| AD-9/12 | scripts/export-site.mjs validates and sanitizes snapshots and media, stages release-specific content and creates manifests; existing local/bundled adapters remain the target's correct integration points. No deployment is performed or claimed. |
| AD-10 | ComparisonSummary.tsx imports shared comparisonSummary and barProportions and already has six metric rows and portrait framing. It currently repeats raw values inside bars. Removing that duplication is correctly described as target work; shared scoring remains unchanged. Neutral treatment and accessible evidence are retained target rules. |
| AD-11 | Identity.tsx resolves season-aware mappedMedia and image failure through MediaFrame, while ConstructorIdentity always renders the readable name next to an optional logo. A shared exclusive Standings identity mode is an appropriate amendment, and is explicitly distinguished from the existing implementation. Non-Standings identities retain their visible naming requirement. |
| AD-13 | contracts.ts already defines v2 lifecycle, analysisRounds, provenance and session evidence. evidence-ingestion.ts combines reviewed calendar evidence with observed provider pages, preserves original source timestamps and rejects unknown lifecycle. audit:data explicitly disables network acquisition. SnapshotService validates and commits; export-site.mjs supports v2 immutable releases. The proposed 2026 refresh fits these actual seams and does not misrepresent a saved-page audit as live acquisition. |
| AD-14 | App.tsx uses URL graphDrivers/graphConstructors keys and popstate history restoration. The explicit Season handler currently clears entity/a/b but retains graph sets. Progress.tsx uses the shared matchingEntities, canonicalSelection and changeSelection helpers, currently renders flat options and guidance below controls. Adding a pure team projection to progress-model.ts and making a coherent explicit-year reset are compatible target changes. No grouping helper or navigation-generation guard is falsely claimed to exist already. |

## Findings and implementation limits

1. No technology mismatch or unsupported new technology commitment was found. The stack seed is grounded in installed files rather than assumed release knowledge.
2. The document accurately identifies current-versus-target gaps for exclusive Standings identity, grouped wrapping selection, headings, graph-set reset and repeated comparison values. These gaps are implementation work, not architecture review failures.
3. Latest completed 2026 GP, canonical cutoff and corresponding source evidence remain an explicit implementation gate. This review did not browse or acquire live records and does not certify that existing 2026 snapshots are current. AD-13 correctly requires source acquisition and reviewed lifecycle evidence before auditing/exporting the replacement.
4. Existing v1 and v2 contract names coexist in contracts.ts (including BundledManifest and BundledManifestV2); downstream code must continue using existing versioned validators/adapters. The spine's v2 runtime contract commitment does not require an unnecessary schema migration or dependency change for this iteration.

All six new capabilities have plausible owners and implementable seams. No spine amendment is required by this lens. Implementation acceptance must still prove the SPEC's behavior and local/bundled cutoff agreement; a planning gate does not establish those results.
