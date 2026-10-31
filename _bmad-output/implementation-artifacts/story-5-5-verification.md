# Story 5.5 verification — 2026-10-30

Implemented shared-contract media inventory/tooling and credits disclosure. Existing credits, canonical mappings and files remain intact. `scripts/media-inventory.mjs` validates canonical full denominators, provenance/date/applicability, duplicate slots, realpath boundaries and decodable local image bytes; mapped rows carry SHA256, byte size and dimensions. Structured exceptions require source URLs, a specific blocker, UTC review time and an existing nonempty visual-evidence file. Legacy fallback prose never contributes to investigated counts. Strict mode rejects unresolved slots and does not grant user acceptance of exceptions.

Baseline inventories were rebuilt against actual v2-audited 2010/2021 rosters. Actual portraits: 27/27 and 21/21. Actual logos: 9/12 and 6/10. Seven missing logo slots were freshly investigated using ten downloaded Commons candidates and current source/license metadata; each candidate was visually inspected. Three 2010 and four 2021 exceptions remain pending user review. No new candidate established a suitable standalone historical logo, so actual-image counts were not inflated. Other years have no acquisition claim. See iteration-three-media-coverage.md and per-year media reports.

Credits now show separate actual/total, investigated and unresolved counts for the selected canonical season, retain creator/source/license/attribution/photo-date/crop details and disclose the legacy notes separately. Close and Escape return focus to the exact summary/image-details trigger. A focusable local table-scroll region fixes the narrow/doubled-text overflow found by the first browser test. Missing constructor badges still leave exactly one canonical accessible name.

Verification commands and outcomes:

- `node --test scripts/media-inventory.test.mjs` — two focused tests pass (canonical/reuse accounting, generic fallback rejection, byte decode/hash, missing/corrupt/duplicate/unsafe files, wrong identity, provenance/date and incomplete/missing visual evidence).
- `node --test scripts/prepare-site-source.test.mjs` — isolated sanitized source build passes after explicitly copying inventory.json/investigations.json as required browser build inputs.
- `npx.cmd vitest run app/client/Identity.test.ts` — three identity tests pass.
- `npx.cmd playwright test --config playwright.media.config.ts --workers=1 --output .site-artifacts/media-agent-test-results` — keyboard summary/image-link opening, Close/Escape exact focus return, separate counts and narrow 200%-text checks pass against an isolated Vite server.
- `npm.cmd run check` — passes.
- Strict baseline inventory command — 48 actual portraits, 15 actual logos, seven investigated exceptions, zero unresolved across the two audited years. Source time is never used as photograph date.

Current visual artifacts: `iteration-three/media/baseline-portrait-contact.png`, `baseline-constructor-contact.png`, candidate images and `research/metadata.json`. All baseline images decode. Contact sheets confirm contained historical marks and visible portrait subjects; Russell remains an existing group source with its existing display crop, and photograph dates can differ substantially from selected season. No new crop or historical-provenance claim was invented.

Limits: no publication, all-year media completion or exception acceptance is claimed. Root coordinates production release validation and copying exception visual evidence with its source/license metadata. Build workflow review layers remain for root integration because all available agent slots were occupied during this subtask; implementation/verification is complete and review status remains explicit.
