# Technology/provider review

Verdict: PASS. No blocking findings.

Reviewed ARCHITECTURE-SPINE.md against current primary sources on 2026-10-29. React/TypeScript/Vite plus a single Node service fits the stated local, single-process dashboard envelope. The server boundary supports provider identification, a shared upstream request budget and atomic persistent snapshots.

- The [upstream react-ts manifest](https://raw.githubusercontent.com/vitejs/vite/main/packages/create-vite/template-react-ts/package.json) currently matches all six recorded version baselines. The spine explicitly distinguishes upstream main from published releases and requires published starter resolution, compatibility checks and a lockfile at implementation; it does not present these versions as verified registry releases.
- The [Vite guide](https://vite.dev/guide/) confirms react-ts and the published scaffolding workflow. Its stated Node requirements are compatible with the selected Node 24 line; the [Node release page](https://nodejs.org/en/about/previous-releases) currently lists Node 24 as LTS.
- [Jolpica documentation](https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md) supports the required endpoint families, pagination metadata and custom application/version User-Agent. The server-only adapter correctly makes the User-Agent requirement implementable.
- [Jolpica rate limits](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md) currently state 4 requests/second and 500/hour for unauthenticated access. The spine's 2/second and 450/hour queue is a conservative application limit and is explicitly changeable. Shared-IP limits can still produce 429 responses; the specified Retry-After handling covers this case.
- [Driver standings](https://github.com/jolpica/jolpica-f1/blob/main/docs/endpoints/driverStandings.md) and [constructor standings](https://github.com/jolpica/jolpica-f1/blob/main/docs/endpoints/constructorStandings.md) support per-round official totals/ranks. The distinction between session-earned and official championship points is sound. Full historical coverage remains a required implementation gate rather than an unsupported provider guarantee.

Nonblocking note: recorded upstream-main versions are mutable evidence. Rechecking the published scaffold and committing its lockfile is essential before dependencies become binding; this is already required by the spine.
