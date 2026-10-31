# Season coverage and acceptance

## Coverage contract

Audit every year from 2010 through 2026 inclusive before calling its data verified. Include calendars, GP classifications/statuses/points, GP qualifying classification, applicable sprint results/points, official driver/constructor standings, canonical entities and historical affiliations. Record source snapshot identity/time and genuine gaps. New-year provider coverage remains to be audited.

2026 includes available completed rounds and is clearly marked ongoing until season completion is verified. Unheld rounds are not missing results or zero scores. Show current standings and the analyzed completed-round window explicitly; do not claim final standings, full-season totals or future-round completeness. The adopted architecture spine AD-10/AD-13 defines one completed-GP analysis window, including held rounds with source gaps and excluding unheld/cancelled GPs. Best qualifying/finish and DNF counts require conservative per-driver evidence across that window and explicit Season to date labels; zero completed GPs leaves GP-based categories unavailable. Official standings disclose their source round and any lag. The adopted EXPERIENCE.md specifies these windows, labels and accessible states; DESIGN.md retains the approved Pit Wall visual contract. Historical complete-season calculations retain existing semantics.

## Media inventory

Count each (kind, canonical identity, season) once across every represented driver and constructor. Retain approved reusable 0.2 assets where applicable. Acquire real logos/photographs with identity checks, historical logo applicability, source, creator, reuse terms, attribution and photograph date. Remaining exceptions require attempted sources and specific blockers. Report actual versus missing images separately per kind/year; fallbacks never count as images. Final denominators follow the entity audit.

## Progress selection behavior

Select all applies to current search results in the active season/category. Empty search matches all active-category entities; no matches is a no-op. Repeated selection is idempotent. The routine UX assumption is additive selection: retain already selected nonmatching entities and add every match. Changing search alone does not change selection. Clear selection remains global for the active category. Graph, evidence table, controls, URL and Back must agree; no hidden series cap may discard selected entities. Adopted AD-14 owns matching, category/year validation, empty-selection serialization and history behavior.

## Acceptance examples

- Given no usable constructor logo, including image-load failure, show its accessible team name once and no text-filled placeholder badge.
- Given a mapped historical logo, retain the logo and team-name label without successor-brand substitution.
- Given any requested year, expose its audited coverage and supported analyses without a hardcoded unsupported-year rejection after successful audit.
- Given ongoing 2026, analyze available completed rounds and distinguish future sessions from source gaps; current standings never say final.
- Given failed verification/refresh, preserve the last good snapshot, selections and source timestamp.
- Given a filtered Drivers or Constructors list, Select all selects every matching entity once and retains existing selections under the stated additive assumption. Empty search selects all; no matches changes nothing.
- Given repeated Select all, remove-one, Clear selection, keyboard operation, category/year changes or browser Back, every representation remains coherent.
- Given many selected series, inspection matches the table, labels and lines remain distinguishable, and scrolling stays within intended regions at narrow widths and 200% zoom.
- Given hosted analysis, every offered season payload and credited image resolves from the same validated local release with external/API requests blocked during verification.

## Implementation seams and handoff

Server candidates, support/bundle validators, data-source guards and exporter currently assume 2010/2021. Assess calendar/sprint auditing, request throttling, current-season coverage and scalable media acquisition. Progress already retains category-specific entity selection and Clear selection; extend that state rather than create competing selection semantics.

The two user behavior decisions are resolved; the architecture spine and updated DESIGN.md/EXPERIENCE.md are adopted as required companions. AD-11 governs identity/media, AD-13 governs lifecycle/schema migration and coherent refresh metadata, and AD-14 governs selection. Architecture and UX are aligned at planning level. Next create iteration-three stories and check implementation readiness. Preserve 0.2 planning/evidence and use new iteration stories. No implementation, broad data acquisition or deployment has started in this planning pass.
