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
