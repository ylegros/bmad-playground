# Iteration Three Verification

## Story 4.1 — One constructor name

Implemented 2026-10-30 against the approved 2010/2021 baseline. Shared constructor identities omit the entire frame for absent or failed images and retain one canonical name. Valid logos remain decorative. Identity/season/resolved-filename keys isolate image failure state. Driver portrait frames and initials remain unchanged. Credits now describe the corrected fallback behavior.

Validation:

- `npm.cmd run build` and `npm.cmd run build:hosted`: passed; final local build restored after hosted checks.
- `npm.cmd test`: 34 Node tests and 8 Vitest tests passed. Subsequently added `npx.cmd vitest run app/client/Identity.test.ts`: 3 passed (missing mapping, decorative valid logo, season applicability).
- `npx.cmd playwright test tests/media.spec.ts`: 3 passed, including every 2010/2021 portrait and mapped mark. Updated focused identity check passed again locally.
- `npx.cmd playwright test --config playwright.hosted.config.ts`: 3 passed. Updated focused identity check passed again bundled, with external/API requests rejected.
- Browser assertions cover single text/accessibility labels, no fallback frame, deliberately failed logos, decorative images, exact LH/MV hidden initials, plain Progress controls, and Ferrari recovery across two already-loaded seasons. A retained DOM marker proves the constructor identity survived the season switch, including reuse of the same asset filename. Identity and filename changes are additionally isolated by the explicit React key; independent browser mutation of those two inputs was not exercised.
- Desktop 1280px, narrow 390px and CSS 200% zoom captures were visually inspected in local and bundled modes: single readable team names, stable driver fallback frames and no page-wide overflow. Evidence: `.site-artifacts/iteration-three/identity-{local,bundled}-{desktop,narrow,zoom}.png`. Comparison evidence tables retain their intended local scrolling.

Review: independent blind review found three verification gaps; missing-mapping component tests, retained-identity recovery and exact portrait-initial assertions were added. No application defects were found by that review. No new data/media coverage, expanded-year audit or publication is claimed. Story is ready for human review; final acceptance remains separate.

## Sprint tracking

Generated and validated six epics / 55 stories: 10 historical completed stories and 45 iteration-three stories. Historical Stories 3.3/3.4 were renamed in the current epics; their prior done statuses were transplanted to the current keys. Parser warnings referred only to overview/index/revision headings, with all story headings parsed. Existing user planning edits were preserved with explicit authorization.

## Resumed verification — 2026-10-31

Progress is an unweighted count of the 45 iteration-three stories ready for review, not release acceptance or elapsed effort. **45/45 (100%) are implemented and ready for human review.** All17 years passed source/local/static verification; the user explicitly accepted the 44 researched logo exceptions. Sprint stories remain `review`, with no deployment performed.

- All seventeen 2010–2026 real source audits passed; all seventeen local real-snapshot browser tests passed (1.8 minutes). Snapshot-linked evidence and exact source observation times are retained in [data coverage](iteration-three-data-coverage.md).
- Full unit regression: 66 Node tests and 19 Vitest tests passed. TypeScript checking passed.
- Integrated fixture browser regression: all 28 passed, including credits keyboard/focus behavior. Invalid legacy gap fixtures were replaced with audited v2 evidence; analysis-window wording expectations were updated.
- Three independent core reviews produced thirteen accepted findings; all were patched. Their dispositions are recorded in [integration review triage](spec-iteration-three-core-integration.md).
- All seventeen canonical-media browser checks passed (1.4 minutes). The user explicitly accepted the 44 documented logo exceptions on 2026-10-31; these remain exceptions, never counted as acquired images. Accepted metadata and credits UI are included in the final isolated source/archive. Post-change credits keyboard, both baseline portrait/mapped-logo checks and the focused image-failure/recovery check passed. The latter now aborts image files specifically so required runtime metadata remains readable.
- Final accepted release `4cf203e522dd724d20d6b384`: isolated production build passed; dedicated all17-season static browser test passed (25.5 seconds), including exact accepted metadata/UI and zero external/API attempts. [Handoff report](story-5-41-handoff.md) records source/archive paths, manifest/archive hashes and unchanged hosting identity. No publication was performed.

The user requested updates at least every five minutes; updates also accompany material verification results or blockers.

## Human approval — 2026-10-31

User approved the final implementation and handoff. All45 iteration-three stories and Epics4–6 are marked done; sprint tracking validation passed. Earlier ready-for-review counts document prior checkpoints. Publication remains unperformed.
