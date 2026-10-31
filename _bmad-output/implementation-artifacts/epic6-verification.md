# Epic 6 verification

Date: 2026-10-30 (Asia/Shanghai). Baseline: 7d91d16c390f8286d6cbbec5e47a36aab4b1f12d.

## Scope and state

Stories 6.1-6.3 implemented; status in-review pending independent coordinated review and final expanded-data/bundled integration. Existing dirty planning artifacts preserved. No commits or publication performed.

## 6.1: Full matching and bulk selection

The shared pure matching routine uses every canonical active-category identity, applies existing case-insensitive name substring matching, and supplies both the visible options and Select all. Canonical set operations sort/deduplicate IDs and preserve selected nonmatches. Native Select all, clear, remove and checkboxes consume the same selected set as chart/table. Counts and concise polite announcements cover effective, repeated and no-match actions; Select all retains focus.

## 6.2: URL and navigation

URL graph keys remain the sole selected-set store. Effective actions push one entry; no-op actions skip navigation. Explicit graph keys override legacy entity; clear deletes active key and legacy entity. Decode/snapshot reconciliation replaces invalid IDs without extra history and retains valid IDs for both categories. App rejects callbacks from old season/category/snapshot contexts. Year selection retains existing legacy/comparison resets. Tests verify Back, Forward, reload, category isolation, rejected refresh retention, replacement removals and delayed old-year loading.

## 6.3: All-series inspection

No selected-series cap introduced. Existing stable numbered/color/dash identities and keyboard/pointer round inspection retained. Chart scroll region now has a name and keyboard focus, with visible outline. Legend/detail wrapping supports long names. Dense fixture selects all 35 drivers, including off-screen list entries; every corresponding table header and late-field inspection remains present after search filtering. Narrow 390px viewport plus doubled text size produces no page-wide overflow. Baseline fixtures model 2010 and 2021; they are deterministic test evidence rather than new-year audit evidence.

## Commands and outcomes

- `node --test app/shared/progress-model.test.ts`: 5/5 passed, including additive/canonical/no-op/remove/clear/full-list matching.
- `npm.cmd run check`: passed.
- `npm.cmd run build`: passed, local production build.
- `npx.cmd playwright test tests/progress.spec.ts`: 8/8 passed after rebuilding production assets.
- `npx.cmd playwright test tests/progress.spec.ts --grep 'refresh failure|delayed old'`: 2/2 passed after adding refresh/rapid-switch scenarios.

The first prebuild browser run reached stale baseline dist and did not find Select all. Rebuilt local production assets; all scenarios then passed. No product test assertions were weakened.

## Remaining verification

Coordinator must complete independent build review and final v2/expanded-year plus bundled-mode flow 9 smoke. Root owns shared contracts, loader/integration changes, main sprint tracking and release evidence. No actual 17-year acquisition, hosted publication or final human acceptance is claimed by this evidence.
