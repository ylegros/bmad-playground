---
status: in-review
date: 2026-11-02
baseline_commit: b2c5e5a2b4f3f1dfe8adcdf322b4ce0220e31c0a
scope: stories 7.1-7.4 and 8.1-8.2
---

# Next-iteration build evidence

All six story implementations are complete, pending final human review. Independent tasks ran in parallel; the coordinator owned App/Progress integration. Existing planning changes were preserved. No publication or remote operation was performed.

## Delivered behavior

- Standings uses one accessible team logo or name fallback, including real image failures and identity/season recovery.
- Explicit year changes atomically clear both graph sets, legacy entity and A/B. Historical Back/Forward restores valid selections; old navigation contexts cannot commit stale Progress actions.
- Progress presents inline wrapping driver checkboxes grouped by selected-season team evidence and inline team checkboxes. Multi-team appearances share one canonical selection; headings/guidance precede controls.
- Compare uses a compact central six-row scorecard between portraits, without duplicated scores. Rank tracks identify A/B and ties use neutral tracks. Shared scoring remains unchanged.
- 2026 evidence refreshed through Mexico City GP, canonical round 19, on 2026-11-02; both official standings source rounds are 19 and the audit reports no session gaps. Source timestamp 11:33:27 UTC / 19:33:27 Asia/Shanghai. Snapshot 9f3d2828-fe3b-4782-a84d-17130ad511be.
- Prepared all-17-season release 04c81966efc563f6ad028783 preserves the same snapshot and source metadata. The new Hirakawa identity has a credited acquired portrait; existing 44 accepted exceptions remain unchanged. 2026 portrait coverage is 24/24 and logo coverage 9/11 with two accepted exceptions.

## Verification

- Node domain/server/export suites: 68 passed; final component suites: 26 passed, including restored pre-existing identity tests and added stale-context tests.
- Targeted UI suites: 25/25 passed (Progress, Compare, standings identity and media).
- Season-evidence regressions: 5/5 passed.
- Isolated fresh local server: 1/1 passed against actual refreshed 2026 evidence across all three surfaces, including narrow/200% layouts and keyboard evidence access.
- Prepared static edition: 3/3 passed for all 17 real seasons, iteration-four regressions, current 2026 identity/cutoff and failed-load retry, with external/API requests blocked.
- TypeScript check, local production build, final isolated bundled build and whitespace check passed. Existing production chunk-size warning remains; no new dependency was introduced.
- Actual refreshed-cache failure injection preserved exact local bytes and support metadata. Export verification checked prior manifest, referenced release-file hashes and local cache retention on expected missing-media rejection.

Initial integration failures were resolved: two stale text assertions were updated for accessible logo names/separator-independent evidence labels; an older server on port 3001 was bypassed using a dedicated fresh server on 3105; a disclosure selector was corrected. Final passes above supersede earlier failed attempts. Screenshots under .site-artifacts/next-iteration-compare-*.png were visually inspected.

## Review Triage Log

Three independent required layers ran against the full staged diff (including untracked work): blind hunter, edge-case hunter and verification-gap reviewer. Edge-case hunter returned no findings. Every filed finding is recorded below before grouping.

| ID | Layer | Finding | Verdict | Evidence and resolution |
|---|---|---|---|---|
| B1 | Blind | Tied ranks occupy different positions | medium / patch | Confirmed CSS offset implied inequality; tied ranks now use neutral tracks with no favorable marker. Qualifying tie browser case passes. |
| B2 | Blind | Rank markers lack visible A/B identity | low / patch | Confirmed marker identity relied on styling; markers now display A/B, remain decorative to assistive technology and repeat no numeric score. |
| B3 | Blind | Assertions after export can leave an invalid promoted bundle | false | exportSite validates snapshots, manifest and credited media and atomically promotes only a complete valid release. Delivery assertions inspect that validated output; they are not the export validation boundary. A concurrent later local refresh can make the payload comparison fail without invalidating the immutable release. |
| B4 | Blind | Any rejection satisfies missing-media failure test | low / patch | Delivery helper now requires ENOENT with missing-delivery-media in the failed path; successful run proves the intended failure was exercised. |
| B5 | Blind | Failure check does not hash prior referenced release files | low / patch | Added before/after hashes of every prior release file, in addition to exact manifest and local-cache bytes. Actual delivery run passed. |
| B6 | Blind | Static test hard-codes round 19 | low / patch | Static assertions now derive cutoff/count from the fresh acquisition receipt and snapshot, while delivery evidence retains the factual round. |
| B7 | Blind | Real local comparison lacks 200% verification | low / patch | Existing synthetic comparison test already covered zoom; added real-data 200% identity/value/evidence-keyboard assertions. Local integration passed. |
| B8 | Blind | Same-cached-snapshot stale callback guard lacks direct regression | medium / patch | Extracted the internal guard used by App; tests show an old generation cannot invoke URL/history mutation after year roundtrip/history/category/snapshot changes, while the current context can. Existing browser roundtrip and delayed-response checks also pass. |
| B9 | Blind | Only synthetic dispatched image errors are tested | false | tests/identity-checks.ts aborts real initial media requests across all surfaces; tests/media.spec.ts invokes it and passed. Dispatched errors additionally cover retained-node recovery. |
| B10 | Blind | Sprint status does not reflect delivery | low / patch | Final reconciliation sets all six implemented stories to review while preserving historical statuses; story documents record completed implementation, not human acceptance. |
| V1 | Verification gap | Rank-track favorable direction is not asserted | medium / patch | Qualifying browser coverage now verifies marker placement for A winning, reversed-pair B winning, tied-neutral and unavailable-neutral cases, preserving lower-rank outcomes. Targeted and full comparison cases pass. |

No unresolved implementation defect or deferred review finding remains. Human review is the next gate. No runtime latest-race polling, hosting publication, or scope expansion is implied.

## Delivery paths

- Local data and source evidence: [8.1 evidence](8-1-delivery-evidence.md), next-iteration/data/2026-refresh.json and .cache/seasons-v2/2026.json.
- Bundled preparation: [8.2 evidence](8-2-delivery-evidence.md), next-iteration/bundle/verification.json and dist-next-iteration-bundled/.
- Reproduce preparation from validated local inputs: node scripts/prepare-next-iteration-bundle.mjs, then npx.cmd vite build --mode bundled --outDir dist-next-iteration-bundled.
- Runtime checks: npx.cmd playwright test --config playwright.next-iteration.config.ts; static checks use PREVIEW_DIRECTORY=dist-next-iteration-bundled with playwright.static-release.config.ts.
