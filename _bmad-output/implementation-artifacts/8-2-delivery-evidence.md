# Story 8.2 prepared bundled delivery

Prepared locally on 2026-11-02; no publication or hosting operation was performed.

The existing exporter produced immutable release `04c81966efc563f6ad028783` with all 17 verified seasons (2010–2026), 133 credited media assets and the existing 44 accepted media exceptions. The 2026 snapshot remains `9f3d2828-fe3b-4782-a84d-17130ad511be`, refreshed `2026-11-02T11:33:27.363Z`, audit `791e1b18-369a-42e0-9c26-968f2fc04708` at `2026-11-02T11:34:00.054Z`. Its analysis window is rounds 1–19 through the Mexico City GP on 2026-11-01. Source verification belongs to [8.1 delivery evidence](8-1-delivery-evidence.md); this export does not independently acquire race results. Export time `2026-11-02T11:38:03.514Z` is separate from source freshness.

`scripts/prepare-next-iteration-bundle.mjs` verifies every released payload against the public projection of its local committed snapshot, validates each against its manifest entry, and records [machine-readable evidence](next-iteration/bundle/verification.json). It injects an export input failure before preparing the good release, proving the old manifest bytes and refreshed local cache bytes remain intact. The existing exporter and adapter required no behavior change.

The first real export rejected the refreshed identity denominator because `ryo_hirakawa` had no credited media slot. Acquired the unchanged 800×1200 [Morio photograph of Ryo Hirakawa at Fuji, 2024-09-14](https://commons.wikimedia.org/wiki/File:Ryo_Hirakawa_2024_WEC_Fuji_1.jpg), under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The downloaded original was visually inspected: clear unobstructed face and head/shoulders, suitable for existing CSS portrait framing. Credits explicitly disclose 2024 Toyota apparel and do not imply a 2026 team photograph. No image editing or generated likeness was used. Regenerated strict inventory from all local snapshots: 2026 portraits 24/24 actual, constructors 9/11 actual plus the existing two accepted exceptions; zero unresolved slots.

Commands and actual results:

- `npm.cmd run export:iteration-three`: initially rejected missing Hirakawa media slot; prior bundle unchanged.
- `node scripts/prepare-next-iteration-bundle.mjs`: passed all 17 local/bundled equality, manifest identity and failure-retention assertions; staged the release above.
- `node --test scripts/export-site.test.mjs scripts/export-site-v2.test.mjs`: 2/2 passed, including invalid/missing inputs, metadata sanitization, corrupt immutable release rejection and isolated source build.
- `npm.cmd run check`: passed.
- `npx.cmd vite build --mode bundled --outDir dist-next-iteration-bundled`: passed. Existing large-chunk warning remains; output is local and unpublished.

The dedicated `tests/static-release/next-iteration.spec.ts` checks all three 2026 surfaces, source/cutoff identity and static-only failure recovery with external/API traffic blocked. The coordinator owns its execution and the full local/bundled integration gate to avoid concurrent browser servers. Browser results must be appended before claiming the story complete. No shared `dist` build or browser server was started by this worker.

## Tasks & Acceptance



## Verification

All17 payload equality, credited media validation, expected export-failure byte/hash retention, isolated bundled build and three static browser cases passed. See [complete build evidence](next-iteration-build.md) for commands, source identity and final checks.

## Review Triage Log

| ID | Verdict and resolution |
|---|---|
| B3 | false - exportSite validates snapshots, manifest and credited media and atomically promotes only a complete valid release. Delivery assertions inspect that validated output; they are not the export validation boundary. A concurrent later local refresh can make the payload comparison fail without invalidating the immutable release. |
| B4 | low / patch - Delivery helper now requires ENOENT with missing-delivery-media in the failed path; successful run proves the intended failure was exercised. |
| B5 | low / patch - Added before/after hashes of every prior release file, in addition to exact manifest and local-cache bytes. Actual delivery run passed. |
| B6 | low / patch - Static assertions now derive cutoff/count from the fresh acquisition receipt and snapshot, while delivery evidence retains the factual round. |
| B10 | low / patch - Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |

Full layer findings, evidence and dispositions: [review triage](next-iteration-build.md#review-triage-log). No unresolved or deferred defect. No publication.

Final coordinator verification: fresh local three-surface integration and final prepared static three-case suite passed. Current snapshot/release identity matches next-iteration-build.md; no publication performed. Earlier pending browser notes are superseded.
