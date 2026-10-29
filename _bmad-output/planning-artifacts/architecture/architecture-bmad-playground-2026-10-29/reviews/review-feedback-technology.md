# Technology and contract reality review

Reviewed: 2026-10-29

Verdict: PASS. No blocking technology assumptions, version changes, or incompatible data-contract decisions found. This is an architecture handoff review, not implementation acceptance.

## Evidence and findings

1. **Stack retention is verified.** Root `package.json`, `package-lock.json`, and the installed package manifests agree on React 19.3.1, TypeScript 7.0.2, Vite 8.3.5, and `@vitejs/plugin-react` 6.1.2. The root package declares Node >=24.0.0. These are repository seed versions, not claims about current public releases or recommendations to upgrade. No new dependency, chart library, router, storage service, Worker, or backend is committed by this update. No external version research is needed to substantiate retention.

2. **AD-9 matches the actual shared interface.** `app/shared/contracts.ts` already defines the discriminated local/bundled `DataSource`, domain-valued `loadManifest`/`loadSeason`, local-only `refreshSeason`, and common `mediaPath`. `BundledManifest` is direct JSON, not an API envelope, and its season entries have all identity fields named in the spine. `app/client/data-source.ts` unwraps local envelopes, rejects invalid modes/bases, verifies loaded snapshot identity, and does not switch bundled errors to API reads. Media resolution requires a loaded bundled manifest. `app/shared/validation.ts` enforces one immutable release across both bundled entries and exact snapshot season/schema/ID/timestamp identity.

3. **AD-10 requires no schema revision.** Existing `QualifyingResult.position` is a `Metric`; schedule qualifying availability and per-driver records already support the proposed complete-session and complete-season coverage checks. GP and sprint classification/status records remain distinct. The retirement allowlist and shared comparison owner already exist. The current `comparison.ts` still contains the unavailable starting-grid category; replacing it with best GP qualifying is an explicitly pending correction, not an architecture/interface contradiction. Do not treat existing starting-grid behavior as acceptance of the new requirement.

4. **AD-9/12 export and build paths are grounded in current scripts.** `scripts/export-site.mjs` accepts checksum-verified cache envelopes or explicit `--payload-dir` domain inputs, projects public fields, validates snapshots/credits, stages data and media together, rejects corrupt existing immutable releases, and promotes the manifest last. `scripts/prepare-site-source.mjs` retains the destination hosting identity and generates an isolated package whose default build validates sanitized payloads and compiles bundled mode. Root `npm run build` remains the local build; root `build:hosted` explicitly exports and builds bundled mode. The spine correctly scopes the different default build to the isolated source checkout.

5. **Media and hosting requirements are feasible without new technology.** Explicit identity mappings, local media files, credits, release-specific media URLs, and existing source preparation provide the substrate for AD-11/12. Actual asset acquisition, exhaustive identity/season coverage, revised audience evidence, and publication remain acceptance work. The source helper currently writes a README titled “private snapshot”; that stale wording is a downstream correction consideration, not a requirement to restore private access. This review does not independently certify the remote Site audience, project identity, or terminal deployment status.

6. **Local provider controls are retained implementation policy.** `app/server/jolpica.ts` has the fixed Jolpica URL, application User-Agent, process queue, 510ms request spacing, rolling 450-request budget, timeouts, bounded retries, Retry-After handling, and pagination metadata checks. The spine presents the caps as initial application limits and explicitly declines to reassert current provider limits. It introduces no new live-provider contract needing a fresh external assertion for this document update.

## Review limits and implementation notes

- No source correction, build, asset acquisition, deployment, or provider request was performed. Existing code differences expressly identified as pending corrections are not reported as architecture defects.
- Shared runtime validation is already imported by exporter and loader. Unknown input properties are removed by the exporter's public-field projection; AD-9's prohibition on unknown metadata leakage is compatible with that behavior and should not be read as requiring every harmless unknown source property to cause rejection.
- The spine's final deferral of exact contract fields is a general handoff rule. Concrete existing schema-v1 types and AD-9 fields remain authoritative; downstream work must extend or reuse shared types instead of inventing surface-specific representations.
- No blocking findings or unjustified new technology choices remain from this review lens.
