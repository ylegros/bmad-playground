# F1 Dashboard — Pit Wall

A Formula 1 dashboard for **2010 and 2021** with comparison verdicts, season evolution graphs and attributed imagery. The local edition supports manual refresh; the shared Site edition reads validated bundled snapshots.

Requires **Node 24 or newer**. This checkout has both seasons verified and cached from Jolpica. The existing shared Site is https://f1-pit-wall-yannick.navyelf64.chatgpt.site; source changes require a validated publication before they appear there.

## Run

```powershell
npm.cmd install
npm.cmd run build
npm.cmd start
```

Open **http://127.0.0.1:3001**. On macOS/Linux, use `npm` in place of `npm.cmd`.

For development, `npm.cmd run dev` starts the API and Vite together; open **http://127.0.0.1:5173**.

## Explore

1. Select 2010 or 2021 and switch between Drivers and Constructors standings.
2. Use a row's **Progress** action for qualifying, results, earned points and official championship totals. Constructor tables include round points and official championship positions.
3. Use **Compare** on a driver for the latest teammate in that season; either driver can be replaced. When first and latest teammates differ, the initial teammate is identified in the ranking.
4. **Refresh data** updates the selected season. Existing values remain visible while pending; a failure retains the snapshot and its timestamp.

GP and Sprint results remain separate. **Unavailable** is different from **0**; **Not applicable** identifies a verified non-sprint event. Official championship totals and ranks are not reconstructed from finishes. The adjustment column shows the change in official points minus the points earned that round; missing inputs leave it unavailable.

## Data and caching

Only the local server calls [Jolpica F1](https://github.com/jolpica/jolpica-f1). It follows every page, normalizes provider identities and records official standings after each round. Cached snapshots live in `.cache/seasons/` and are intentionally ignored by Git. No background refresh or polling occurs.

On a fresh checkout with no cache, use the **Verify season data** actions in the app, or run:

```powershell
npm.cmd run audit:data
```

The command audits missing candidate seasons and leaves existing valid snapshots untouched. First verification and explicit refresh can take a few minutes because requests are queued below the provider request limits. A failed audit never replaces a valid cache. The initial pair is historical; later seasons require a separate coverage audit before being offered.

## Verify

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd exec playwright install chromium
npm.cmd run test:e2e
```

Unit tests use deterministic fixtures. Browser tests include synthetic data scenarios and a real cached-data smoke test; run `audit:data` before browser tests on a fresh checkout. The smoke test reads the cache and does not refresh upstream. Browser screenshots are written to `test-results/`.

## Comparison and graphs

Compare uses six fixed categories, with one vote per favorable category. Ties and unavailable categories award no vote; equal scores draw. Best GP qualifying rank uses qualifying classification before grid penalties; it is distinct from qualifying head-to-head. Best finish and DNF counts require authoritative driver records across every scheduled GP, and unmapped retirement statuses leave DNF totals unavailable.

Progress supports multiple drivers or constructors, metric selection and matching graph/table evidence. Inspect rounds using the focusable control with Left/Right and Home/End, or point to the graph. Missing values create gaps. The **All round measures** disclosure retains the detailed metrics. Graph selections and metrics survive URL and browser Back navigation where compatible.

Image credits are available in the dashboard and `public/media/credits.json`. Only explicitly mapped reusable assets appear; other identities have named fallbacks. Portrait dates are recorded separately from the selected season.

## Bundled shared Site

```powershell
npm.cmd run export:site
npm.cmd run build:hosted
npm.cmd exec playwright test -- --config playwright.hosted.config.ts
```

Export validates the original cache checksums, schema, coverage, snapshot identities and media before atomically promoting a complete immutable release. Missing or invalid inputs fail without downloading data or replacing the previous manifest. The header shows the selected season's source timestamp and timezone; export and deployment times do not describe source freshness.

The hosted build has no API, refresh or verification setup actions and no external image/font/data requests. Its retry loads bundled data only. Hosted browsing requires network access to Sites.

The isolated publication checkout is `.site-source/pit-wall`; its `.openai/hosting.json` retains the returned Site identity. `node scripts/prepare-site-source.mjs` copies an explicit source allowlist plus validated payloads; it excludes the local server, raw cache envelopes, original Git metadata, logs and credentials. Its default `npm run build` validates sanitized payloads and compiles bundled mode. Publish updates through the installed Sites source helper and standard deployment operation, preserving the existing anyone-with-link audience, reusing the identity and resuming pending deployments. Refreshing the local edition updates the Site only after a new export and publication.

Build and publication evidence lives in [_bmad-output/implementation-artifacts/second-iteration-verification.md](_bmad-output/implementation-artifacts/second-iteration-verification.md).

## Retained first iteration

Local single-process use, responsive semantic tables and original Pit Wall styling. Broad historical coverage beyond 2010/2021, cross-season comparison, live timing and accounts are deferred. Browser verification currently targets Chromium; no full accessibility conformance certification is claimed.

The build contract is in [_bmad-output/specs/spec-bmad-playground/SPEC.md](_bmad-output/specs/spec-bmad-playground/SPEC.md); the six dispatch stories live beside it. Implementation evidence is recorded in [_bmad-output/implementation-artifacts/first-iteration-verification.md](_bmad-output/implementation-artifacts/first-iteration-verification.md).
