# F1 Dashboard — Pit Wall

A local, table-first Formula 1 dashboard for **2010 and 2021**. Inspect driver and constructor standings, follow round-by-round progress, compare drivers, and manually refresh season snapshots.

Requires **Node 24 or newer**. This checkout has both seasons verified and cached from Jolpica. Nothing is deployed publicly.

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

## First-iteration boundary

Local single-process use, responsive semantic tables and original Pit Wall styling. Charts, summary panels, broad historical coverage, cross-season comparison, live timing, accounts and public hosting are deferred. Browser verification currently targets Chromium; no full accessibility conformance certification is claimed.

The build contract is in [_bmad-output/specs/spec-bmad-playground/SPEC.md](_bmad-output/specs/spec-bmad-playground/SPEC.md); the six dispatch stories live beside it. Implementation evidence is recorded in [_bmad-output/implementation-artifacts/first-iteration-verification.md](_bmad-output/implementation-artifacts/first-iteration-verification.md).
