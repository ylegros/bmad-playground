# Story 5.41: complete all-season exploration handoff

The local and immutable static dashboard cover every season from 2010 through 2026. Publication is excluded from this handoff.

## Evidence matrix

| Gate | Evidence |
|---|---|
| Canonical data, lifecycle, source windows and scoring | 17/17 source audits; [per-year reports](iteration-three-data-coverage.md) preserve snapshot/audit IDs, exact source observation times, rosters, endpoint pages and conservative gaps/statuses |
| Real local analysis | 17/17 browser tests passed, covering official standings, full-field Progress, keyboard round inspection, six-category comparison and desktop/narrow/200% layouts |
| Media accounting and visual investigation | 394/394 photographs and 136/180 logos; 44 researched logo exceptions; [per-year reports](iteration-three-media-coverage.md), credited source/license files and visual evidence |
| Rendered canonical imagery | 17/17 browser tests passed; every canonical driver portrait and mapped constructor image decoded; exceptions retained one constructor name; external requests blocked |
| Core regressions | 66 Node tests, 19 Vitest tests and 28 core browser tests passed; type checking and production build passed |
| Independent implementation review | Thirteen accepted findings patched; [triage log](spec-iteration-three-core-integration.md) |
| Complete immutable static release | First full all17-season static browser test passed with zero external/API attempts; accepted-exception metadata rebuild and final check recorded below |
| Isolated source and hosting identity | Source archive excludes server/cache/secrets/dependencies/build outputs; file hashes verified; existing hosting configuration preserved byte-for-byte |

## Exception acceptance

On 2026-10-31, the user explicitly selected **“Accept these documented exceptions”** for the 44 constructor-logo slots: Force India 2010–11, Williams 2010–13, Toro Rosso 2010–19, Red Bull 2013–26, Alfa Romeo 2019–22, AlphaTauri 2020–23, Aston Martin 2021–23 and RB/Racing Bulls 2024–26. These remain counted as exceptions, never acquired images. Each displays the canonical team name alone. Their research and unsuccessful candidates remain available for future acquisition.

## Release candidate

Accepted-exception release: `4cf203e522dd724d20d6b384`, exported 2026-10-31T03:24:03.774Z. Isolated source: `.site-source/pit-wall-iteration-three`; production output is its `dist` directory. Source and dist manifests are byte-identical, SHA256 `7a5a2dc6aea761c0455e31eb652688b64527a380c0cbbf4d890fc24355ff6dff`.

Archive: `.site-source/pit-wall-iteration-three-source.zip`, 22,617,617 bytes, 371 entries. Every archived file was hash-verified against the sanitized source. SHA256: `A3158B91B15FBEAC9401057CBAD3DE974DE9FEED817E77A5D9A6F0443987C93F`.

Final command: set `PREVIEW_DIRECTORY` to the isolated dist, then run `npx.cmd playwright test --config playwright.static-release.config.ts`. Result: **1 passed (25.5s), exit 0**, covering all seventeen years, source values/windows/timestamps, local media decoding, all44 accepted investigation/inventory rows and served metadata, exact accepted-exception credits text, selection/Back and portraits. External/API attempts: **zero**. The dedicated preview helper was stopped after verification.

Hosting configuration SHA256 remained `25eeeec12741c2a060e457cc55b942f582d601d6d7e8cff4248159837c6504dc`. No publication, push or hosting audience change was performed. Existing root public release remains the separately usable historical baseline.

All45 iteration-three stories are implemented and ready for human review. Source classifications that cannot independently establish retirement remain unavailable; original-proposal cancellation/revision research remains explicitly partial in the calendar reports. Neither limitation is concealed by a zero, inferred lifecycle or fabricated history.

## Human approval

The user approved the completed iteration on 2026-10-31 after receiving the final verification and handoff. All45 iteration-three stories and Epics4–6 are now marked done. The existing44 logo-exception acceptance remains recorded. This approval closes implementation review; publication remains outside this handoff.
