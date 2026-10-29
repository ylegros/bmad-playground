---
id: SPEC-iteration-two-feedback
companions:
  - acceptance-corrections.md
  - ../../implementation-artifacts/spec-second-iteration.md
sources: []
---

> **Canonical correction contract.** Derived from `.memlog.md` and the user's accepted review feedback. This spec and its companion supersede conflicting image-coverage, starting-grid and visible-marker requirements in the iteration-two handoff. The existing iteration-two baseline otherwise remains in force.

# Iteration Two — Accepted Review Corrections

## Why

Yannick's live review found too few team logos and driver photographs, an unwanted starting-grid category and repetitive visible “Better” labels. Correct these within the same sprint before accepting the iteration. This records accepted requirements; implementation and deployment remain pending.

## Capabilities

- **CAP-1 — Constructor logos**
  - **intent:** Recognize every represented constructor through a season-appropriate logo.
  - **success:** Maximize real logo coverage across the verified 2010/2021 constructor inventory; report mapped assets and individually investigated exceptions per season. Fallback text does not count as logo coverage.
- **CAP-2 — Driver photographs**
  - **intent:** Recognize the selected drivers through verified photographs.
  - **success:** Maximize real photograph coverage across both seasons' driver inventories, with local files, explicit identity mappings, credits, photo dates and individually investigated exceptions. Fallback initials do not count as photo coverage.
- **CAP-3 — Best GP qualifying rank**
  - **intent:** Compare each driver's best qualifying classification rather than starting grid after penalties.
  - **success:** The fixed six-category scorecard replaces best GP starting grid with best GP qualifying rank. Authoritative GP qualifying classification supplies the value; lower is better. Qualifying head-to-head remains a separate category. Missing qualifying data has a precise explanation.
- **CAP-4 — Concise favorable-value markers**
  - **intent:** Identify favorable comparison values without repetitive labels.
  - **success:** Summary and detailed comparison use a tick and highlight without visible “Better” text; screen-reader descriptions retain driver, measure and direction. Ties and unavailable values receive no favorable marker.

## Constraints

- Preserve verified 2010/2021 coverage, official championship points, source statuses, missing-versus-zero, GP/sprint separation, graph/table agreement, local refresh and bundled-data hosting.
- Retain six equal category votes, draw/insufficient-data rules and conservative availability/coverage checks. Qualifying rank is independent of grid penalties; no starting-grid schema migration is required.
- Verify image identity and reuse terms; bundle assets and credits locally. Never substitute an unrelated modern constructor or generated likeness/logo. Record portrait date or unknown without implying selected-season photography.
- Target every supported identity; evidence must show actual coverage and remaining exceptions. No lower percentage or fallback-only completion is pre-approved.
- Preserve the user's current anyone-with-link audience when an authorized rebuild is eventually published. This operation changes documentation only.

## Non-goals

- Starting-grid analysis, new seasons, altered scoring weights or unrelated dashboard changes.
- Acquiring assets, editing application code, rebuilding, publishing or rewriting sprint stories during this spec update.

## Success signal

Reviewers can account for every supported constructor/driver image slot, inspect actual assets and exceptions, and verify that the scorecard measures qualifying rank before grid penalties and uses concise accessible markers. Prior release tests do not establish acceptance of these corrections.
