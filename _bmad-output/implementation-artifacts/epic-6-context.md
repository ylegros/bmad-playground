# Epic 6 Context: Select matching Progress series together

## Goal
Provide additive full-list matching and preserve one uncapped selected set across controls, chart, evidence, URL and browser navigation.

## Stories
- Story 6.1: Add all current search matches to Progress
- Story 6.2: Restore matching selections through URL and navigation
- Story 6.3: Inspect every selected series accessibly

## Requirements & Constraints
Case-insensitive name-substring search applies to the entire season/category identity list. Empty search matches everyone. Search does not mutate selections. Select all unions matching IDs with existing nonmatches. Repeated/no-match actions add no history. Clear removes every active-category ID and legacy entity; other category selections survive. Validate decoded IDs and changed snapshots, retain valid IDs, announce discarded IDs, never silently default or cap selections. Failures retain snapshots, timestamps and selections.

## Technical Decisions
URL graphDrivers and graphConstructors are the sole selected-set owner. Serialize deterministic unique IDs. Explicit graph keys override legacy entity. Missing graph and entity keys decode empty. Effective actions create one history entry. Context guards reject stale season/category/snapshot callbacks. Year changes reset entity/comparison A/B. Preserve existing metric/gap/sprint semantics and chart rank direction.

## UX & Interaction Patterns
Native Select all retains focus, gives polite concise match/selected count announcements for effective and no-op actions. Every series has stable named distinguishing styles and keyboard/pointer round inspection. Complete semantic tables and labeled local scroll regions remain available at narrow widths and 200% zoom. No new palette or dependency.

## Cross-Story Dependencies
6.2 depends on 6.1; 6.3 depends on 6.1 and 6.2. Baseline snapshots suffice independently of Epic 5; expanded-data integration follows when available.
