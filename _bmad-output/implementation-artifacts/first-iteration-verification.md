# First-iteration verification

Completed 2026-10-29 for the approved table-first scope. The local production server is running at **http://127.0.0.1:3001**. Restart with `npm.cmd start` if the process or computer stops; rebuild after changing source.

| Story | Implementation and verification | Progress |
|---|---|---:|
| 1. Season data foundation | Shared contracts, paginated adapter, verified calendars, official per-round standings, integrity-checked atomic cache and API | 100% |
| 2. Season selection and standings | Responsive Pit Wall shell, both standings, verified selection, URL/Back state, first-run setup | 100% |
| 3. Manual refresh and recovery | Complete replacement, retained snapshot/time, retry, duplicate prevention, stale-response protection | 100% |
| 4. Driver season progress | GP qualifying, GP/sprint results and points, round/official cumulative points, explicit adjustments and missing values | 100% |
| 5. Constructor season progress | Session and round points, official cumulative points/rank, adjustments and missing-value handling | 100% |
| 6. Driver comparison and final verification | Arbitrary pairs, latest/initial teammate rules, aligned measure tables, keyboard/mobile checks and integrated verification | 100% |

Percentages cover the accepted first iteration, not the deferred full historical/chart MVP. Final human review remains open.

## Passing checks

- `npm.cmd run build`: TypeScript and production Vite build pass.
- `npm.cmd test`: **19 tests pass**: 13 backend/adapter, four domain selectors and two client operation-generation tests.
- `npm.cmd run test:e2e`: **nine Chromium browser tests pass** on the final production build.
- npm installation audit: zero reported dependency vulnerabilities at installation.

Browser coverage includes both standings, driver/constructor progress, latest/initial teammate behavior, arbitrary/identical pairs, missing participation, source nonfinish status, refresh failure retention and retry success, cold-load retry, late cross-season responses, first-run verification, adding another season without switching context, manifest-only recovery after successful verification, Back/focus, local table scrolling at 390px, and real cached data from both years.

Screenshots: [desktop](../../test-results/first-iteration-desktop.png), [mobile](../../test-results/first-iteration-mobile.png). Browser screenshots and caches are generated local artifacts, ignored by Git.

## Live provider evidence

| Season | Rounds | GP/sprint result records | GP qualifying records | Endpoint/round coverage |
|---|---:|---:|---:|---|
| 2010 | 19 | 456 | 456 | All required pages and per-round driver/constructor standings audited |
| 2021 | 22 | 500 | 439 | All required pages and per-round standings audited; sprint rounds 10, 14, 19 |

Coverage means the complete returned provider collections were audited; it does not imply every driver has every metric. Missing participation stays unavailable. Official totals include fractional points and remain authoritative.

A real `POST /api/v1/seasons/2010/refresh` against the running production server completed successfully after review fixes. The snapshot ID changed, the UTC timestamp advanced, all 19 rounds remained validated, and no endpoint gaps were reported. Cached reads and browser smoke tests perform no automatic upstream refresh.

## Review disposition

Three independent review lenses returned 15 findings, grouped into ten underlying issues; all were addressed and checked. Detailed per-finding verdicts are in [the implementation spec](spec-first-iteration.md).

Corrections include explicit GET/refresh concurrency semantics, requested-season identity validation, fixed historical calendar/sprint expectations, deterministic provider-normalization fixtures, malformed-value rejection, cache checksums, strict dates/timestamps, manifest-only retry after verification, and focus restoration on surface navigation.

The original two live-audited raw cache files were migrated offline into checksum envelopes before testing. The migration retained their data and timestamps. The subsequent real refresh used the new format directly.

Implemented text contrast was checked for core token combinations. Black action text on red is 4.51:1; muted text and both comparison series exceed 6:1 on the panel surface. The provisional on-accent token was corrected in DESIGN.md. Browser checks do not constitute full WCAG certification.

## Run and stop

The server binds only `127.0.0.1:3001`. Its PID is recorded in `.cache/server.pid`, with stdout/stderr in `.cache/server.stdout.log` and `.cache/server.stderr.log`. Inspect the recorded process before stopping it. No public hosting or remote publication was performed.

The repository had no commits at baseline. Existing BMAD setup and user files remain present; implementation is additive and no local commit was created.

Deferred by agreement: charts, summary/previews, broader historical coverage, cross-season analysis, live updates, accounts and public hosting. Automated browser verification currently covers Chromium; other browser engines and a full manual accessibility audit remain unverified.
