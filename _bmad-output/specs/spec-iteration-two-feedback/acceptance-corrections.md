# Acceptance Corrections

Accepted by the user on 2026-10-29 for the current sprint. These requirements supersede conflicting wording in the previous iteration-two handoff. Implementation is pending.

## Imagery coverage

Build a per-season inventory from the verified snapshot identities. For each constructor logo and driver photograph, record identity, applicable season, mapped filename or investigated exception, source URL, creator, reuse terms/license, required attribution and visual-check outcome. Record photograph date or unknown and any crop notes. Reusing a verified photograph for the same driver in multiple seasons is allowed with honest date disclosure; constructor marks must fit the historical identity.

Report actual mapped-image counts against total identities separately for logos and photographs in each season. Count fallbacks separately. Investigate every missing entry and state the specific blocker and attempted source; a generic “not vetted” reason does not establish an acquisition exception. Do not invent a lower accepted coverage target or claim coverage from successful fallback rendering.

- Given every constructor represented in 2010/2021, when reviewing the coverage inventory and UI, then each has an identity/season-appropriate bundled logo or an individually evidenced exception.
- Given every driver represented in those seasons, when reviewing the inventory and UI, then each has a verified bundled photograph or an individually evidenced exception; dates are disclosed without implying period photography.
- Given bundled mode with external requests blocked, when images and credits render, then mapped files load locally; failed images retain readable identities and stable frames.
- Given acquired assets, when checking desktop and narrow layouts, then actual logos and faces are legible, contained/cropped appropriately and associated with the correct identity. Visual coverage checks supplement automated fallback tests.

## Qualifying instead of starting grid

The six summary rows are GP race head-to-head, GP qualifying head-to-head, official championship points, best GP finish, **best GP qualifying rank**, and GP DNFs. Replace the grid row; do not add a seventh row or duplicate a head-to-head count as a best rank.

- Given authoritative GP qualifying classification, when computing best qualifying rank under the existing conservative season-wide coverage rule, then use the lowest qualifying position and report relevant sample sizes/reasons.
- Given qualifying rank 2 and a starting-grid penalty producing grid position 7, when comparing qualifying, then use 2. Do not use race classification, infer grid or apply grid penalties to qualifying rank.
- Given missing or incomplete authoritative qualifying coverage, when displaying the category, then explain that qualifying limitation. Do not show the schema-v1 missing-starting-grid explanation.
- Given the replacement category, when scoring, then lower wins one vote; ties/unavailable award none. Existing draw, comparable-count and insufficient-data rules remain unchanged. GP qualifying stays separate from sprint ranking.

## Comparison presentation

- Given a favorable value in the summary or detailed round comparison, when rendered, then show the tick and highlight without repeated visible “Better” text.
- Given assistive technology, when reading that marker, then descriptive text identifies the driver, metric and favorable direction; the decorative tick is not the sole accessible explanation.
- Given ties or unavailable values, when rendered, then retain their meaning without a favorable tick/highlight.

## Handoff boundary

The existing implementation spec is synchronized with these corrections. Epics/stories, architecture and UX still require alignment through their owning workflows before rebuilding. Do not interpret older starting-grid, visible “Better” or fallback-only acceptance wording as current authority. Original release test/publication evidence remains historical.
