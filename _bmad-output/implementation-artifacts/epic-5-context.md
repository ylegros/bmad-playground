# Epic 5 Context: Explore every season with honest data and imagery

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable individually audited 2010–2026 seasons in local and immutable bundled editions, with honest completed-GP analysis, lifecycle and source freshness disclosures, and credited historical imagery. Candidate years are not verified merely because they are listed. Preserve approved release 0.2 separately until the complete iteration-three release passes validation; development fixtures never establish acquisition or publication readiness.

## Stories

- Story 5.1: Validate versioned season evidence consistently
- Story 5.2: Load audited historical and ongoing seasons safely
- Story 5.3: Compare drivers over the same completed-GP evidence
- Story 5.4: Read audit status and season-to-date evidence on every surface
- Story 5.5: Inventory credited imagery against canonical season identities
- Story 5.6: Audit 2010 season data and analysis
- Story 5.7: Audit 2011 season data and analysis
- Story 5.8: Audit 2012 season data and analysis
- Story 5.9: Audit 2013 season data and analysis
- Story 5.10: Audit 2014 season data and analysis
- Story 5.11: Audit 2015 season data and analysis
- Story 5.12: Audit 2016 season data and analysis
- Story 5.13: Audit 2017 season data and analysis
- Story 5.14: Audit 2018 season data and analysis
- Story 5.15: Audit 2019 season data and analysis
- Story 5.16: Audit 2020 season data and analysis
- Story 5.17: Audit 2021 season data and analysis
- Story 5.18: Audit 2022 season data and analysis
- Story 5.19: Audit 2023 season data and analysis
- Story 5.20: Audit 2024 season data and analysis
- Story 5.21: Audit 2025 season data and analysis
- Story 5.22: Audit 2026 season data and analysis
- Story 5.23: Complete 2010 driver and constructor imagery inventory
- Story 5.24: Complete 2011 driver and constructor imagery inventory
- Story 5.25: Complete 2012 driver and constructor imagery inventory
- Story 5.26: Complete 2013 driver and constructor imagery inventory
- Story 5.27: Complete 2014 driver and constructor imagery inventory
- Story 5.28: Complete 2015 driver and constructor imagery inventory
- Story 5.29: Complete 2016 driver and constructor imagery inventory
- Story 5.30: Complete 2017 driver and constructor imagery inventory
- Story 5.31: Complete 2018 driver and constructor imagery inventory
- Story 5.32: Complete 2019 driver and constructor imagery inventory
- Story 5.33: Complete 2020 driver and constructor imagery inventory
- Story 5.34: Complete 2021 driver and constructor imagery inventory
- Story 5.35: Complete 2022 driver and constructor imagery inventory
- Story 5.36: Complete 2023 driver and constructor imagery inventory
- Story 5.37: Complete 2024 driver and constructor imagery inventory
- Story 5.38: Complete 2025 driver and constructor imagery inventory
- Story 5.39: Complete 2026 driver and constructor imagery inventory
- Story 5.40: Prepare one complete immutable all-season bundle
- Story 5.41: Verify the complete all-season exploration handoff

## Requirements & Constraints

Audit every candidate independently against sourced calendar, session applicability, lifecycle and required endpoint/page inventory. Retain source URLs, observation times, cancellation/rescheduling evidence and per-year progress/failures. A verified audit may contain honest successful-empty held-session gaps; transport, pagination, malformed payload or unresolved lifecycle failures cannot establish verification. Never infer completion or nonparticipation from dates, empty responses or maximum returned round.

Use one ordered window containing every independently evidenced held GP, including source gaps, while excluding unheld/cancelled GPs. Historical completed seasons include all held GPs. Pre-GP sprint or qualifying evidence can appear separately but cannot enter completed-GP comparisons. Best finish, best qualifying and DNF totals require conservative driver evidence across the full window; unknown statuses or substitute-driver gaps remain unavailable. Keep six equal-vote summary categories, qualifying position rather than grid, tie rules, fractional awarded points, official championship authority, sprint separation and season-relative teammates. Preserve genuine zeroes without inventing missing values.

Audit and inventory all canonical driver/season and constructor/season identities. Count mapped images and investigated exceptions separately per kind/year. Assets require usable provenance, actual identity/historical suitability and desktop/narrow/200% visual checks. Exceptions require attempted source URLs, specific blockers and visual outcomes; fallback rendering or generic not-vetted reasons cannot establish acquisition. No reduced coverage target is approved, and remaining exceptions require user review.

The complete release requires all 17 verified snapshots and reconciled media inventories. Reject missing/unverified years, invalid provenance, corrupt assets and mixed generations without promoting a partial release. Keep per-year evidence and iteration-three coverage/verification indexes. Preparing the release does not authorize publication.

## Technical Decisions

Freeze shared schema-v2 snapshot, support, bundle-v2, audit, lifecycle and media-slot shapes plus runtime validation before dependent implementation. Preserve canonical identities, scoring and source timestamps. Lifecycle held/unheld/cancelled/unknown is independent of availability complete/unavailable/not-applicable. Snapshots carry ongoing/complete season status, explicit analysisRounds and audit provenance; manifests agree with the same generation. Unknown versions and contradictory lifecycle fail closed. Explicit v1 migration requires independent historical evidence and records migration provenance separately from original refresh/source times.

Shared pure selectors own domain decisions and feed both graphs and semantic tables. Official standings retain their latest source round within the analysis window, authoritative totals/ranks and any lag; do not extrapolate or locally rerank. Local server ingestion is the sole provider writer, stages complete validated snapshots and commits atomically. Reuse one process-wide bounded provider queue with timeouts, retry limits and budget failures. UI selection never launches broad acquisition, polling or direct provider requests.

Commit successful local snapshot and derived support metadata together; delayed manifest responses cannot overwrite newer per-season generations. Failed load/refresh retains good snapshot, metadata, selection and timestamp. Existing /api/v1 envelopes remain with explicit payload validation. Bundled mode loads one immutable same-origin release, validates manifest/payload agreement and never falls back to API. Export sanitizes payloads and includes credited media in the release identity; export time is distinct from source freshness.

Media slots are keyed by kind, canonical identity and season, count once and are either mapped or investigated exceptions. Reused dated photographs disclose their actual date or unknown. Historical logos cannot be replaced by successors; generated portraits/logos are excluded. Constructor imagery remains decorative beside exactly one accessible team name; failed images leave no fallback badge. Driver named portrait fallbacks remain available.

## UX & Interaction Patterns

Expose all candidate years and individual audit status/gaps; enable verified analysis and default to the latest verified season. Ongoing analysis reads Ongoing / Season to date with exact analyzed GP rounds and samples. Final standings require independently verified completion; otherwise show Current standings and source-round lag. Distinguish Not held, Cancelled, Not applicable and Unavailable with reasons. Keep zero-GP and pre-GP evidence explicit and avoid fabricated future graph segments.

Preserve approved Pit Wall styling, names/units, accessible status announcements, keyboard navigation, semantic table equivalents and intended local scrolling at narrow widths/200% zoom. Credits disclosure exposes source/license/attribution, applicability, photography date and crop notes and returns focus to its trigger. Bundled failures retry static loading; obsolete responses cannot relabel another season.

## Cross-Story Dependencies

5.1 freezes contracts first. 5.2 ingestion and 5.3 pure analysis can then proceed independently; 5.4 integrates both. 5.5 media tooling depends on 5.1 and can use existing verified identities. Independent year data audits and media inventories follow their tooling prerequisites through the shared bounded queue; do not concurrently overwrite contracts, mappings or one evidence file. 5.40 requires all foundation, data and media stories; 5.41 verifies the complete release candidate. Story 4.1 is needed for full CAP-1 signoff. Epic 6 and later publication are not prerequisites for Epic 5 local/bundled verification.
