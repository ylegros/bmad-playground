# Iteration four delivery verification

Date: 2026-11-01. Both confirmed UI changes are implemented and ready for human review. This record documents implementation evidence, not new source research or publication.

## Result

Season lifecycle/evidence, coverage notes and 2010-2026 verification inventory are bottom disclosures after active analysis. They start closed, retain independent expansion across same-session views/seasons/history and reset on reload. Matching snapshot information, inline errors, zero-GP guidance and Current/Final/source-lag captions remain accurate.

Progress point labels show the actual numeric metric value, including qualifying position, zero, fractional and negative points. Named color/dash legends replace ordinal badges. Complete labels use measured-width allowances, vertical collision slots and leaders to their true points; chart-only scrolling, keyboard-target visibility and a sticky round axis support dense fields. Status-rich inspection/table evidence is preserved.

## Validation

| Check | Result |
|---|---|
| Local production build and TypeScript | Passed after final graph fixes. |
| Node regression | 67 cases accepted: 66 passed in initial full run, isolated-source case rerun passed after correcting intermediate encoding. The 6 shared Progress cases passed again after geometry changes. |
| Client unit regression | 21 passed. |
| Full local browser regression | 34 of 35 passed initially; the media identity timeout passed its focused retry (7.9s). No media implementation changed. |
| Final affected browser regression | 17 passed after review fixes, including metric/category/status values, dense actual-200% label bounds, keyboard scrolling and disclosure Back/Forward/loading/refresh behavior. |
| Real audited local snapshots | 2010, 2021 and 2026: 3 passed across standings, full-field Progress, inspection and Compare. |
| Isolated source validation/build | Sanitized 17-year export validated; final source TypeScript and bundled compilation passed without server/cache source. |
| Real immutable bundled regression | 2 passed: all 17 years/media/accepted exceptions, plus iteration-four disclosures and actual metric labels. External/API attempts: zero. |
| Bundled label semantics | 2026 all-driver qualifying plus 2021 driver cumulative/fractional points, sprint points, adjustments and constructor cumulative points match shared-model values. |
| Visual/layout | Desktop 1280px, narrow 390px and actual CSS zoom 2 checked. Full labels and axis text remain inside SVG; labels avoid one another and point markers. No document-wide overflow; local scrolling retains all data. |
| Independent blind review | 8 findings triaged in spec-iteration-four-delivery.md; accepted issues fixed, blanket no-line-crossing claim rejected with evidence. No deferred findings. |

The first integrated build caught an intermediate non-UTF-8 write; corrected before final successful builds. The initial image-heavy parallel browser run had one timeout, resolved by its isolated retry. Test preview processes started for the audit/static suites were stopped after successful cases; both runners exited 0. No broad historical re-acquisition occurred.

## Local delivery artifacts

- Sanitized source: `.site-source/pit-wall-iteration-four/`.
- Production bundle: `.site-source/pit-wall-iteration-four/dist/`.
- Source archive: `.site-source/pit-wall-iteration-four-source.zip`; 371 entries, 22,603,672 bytes. Every entry hash verified against sanitized source; server/cache, dependencies, Git metadata, environment files and dist are excluded.
- Archive SHA256: `5c69d8529631608f790aaa40d267beea9e5644ba81eb9ddb63a685d23d54a78d`.
- Source/dist manifest SHA256: `d5cd659527171556ea7448572c388f41740a7b1674b140facfbb67713794293d` (byte-identical). Exported at `2026-11-01T08:16:36.589Z`.
- Data release remains `4cf203e522dd724d20d6b384`: all 17 audited seasons and 44 accepted investigated logo exceptions are retained. This is the data release identifier, not an iteration-four source commit.
- Existing hosting manifest SHA256 remains `25eeeec12741c2a060e457cc55b942f582d601d6d7e8cff4248159837c6504dc`; existing identity/audience unchanged.
- Visual evidence: `.site-artifacts/iteration-four/bundled-{desktop,narrow,zoom}-{graph,information}.png`.

No remote push, Site source synchronization, publication or audience change was performed. Existing large-bundle build warning remains; no dependency or bundle-splitting scope was introduced. Historical sprint statuses remain unchanged; human acceptance of this iteration is still separate.
