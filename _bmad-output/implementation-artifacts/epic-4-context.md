# Epic 4 Context: Recognize each constructor once

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Make every constructor recognizable from exactly one visible and accessible team-name label when its logo is missing, unusable or fails to load, while preserving correct historical logos and existing driver portrait behavior. Deliver the shared identity correction across the approved 0.2 application without waiting for new-season acquisition or Progress selection changes.

## Stories

- Story 4.1: Keep one constructor name when its logo is unavailable

## Requirements & Constraints

- Apply the single-name rule to each constructor identity instance across Standings, Progress, Compare and identity-bearing controls. Separate, legitimate instances elsewhere on a page remain intact.
- Missing season-applicable mappings, rejected or unusable media and failed image requests must leave one readable team name. Do not insert initials, repeated team text, a text-filled fallback badge, an empty logo badge or an additional accessible image name.
- Valid season-appropriate logos remain visible beside the existing name and decorative to assistive technology. Preserve canonical identities and historical applicability; unrelated successor branding is unacceptable.
- A failure belonging to one identity, season or resolved asset must not suppress a different valid asset when the rendered identity changes.
- Preserve driver portrait/initial fallbacks, full names, season-relative affiliations, paired comparison identities, scoring, chart/table values and keyboard navigation. Image failure must leave analysis usable.
- Hosted behavior remains static and same-origin: no external image/font/data requests, API fallback, new media acquisition or publication is introduced by this correction.
- Preserve existing release evidence; record fresh iteration-three verification separately. Passing fallback tests establishes rendering behavior, not acquired-image coverage.
- Validate the visible and accessible name behavior with focused component/browser checks and actual visual inspection in local and bundled modes at desktop, narrow width and 200% zoom. Include valid, absent and deliberately failed images plus recovery when an identity or asset changes. Record evidence under Story 4.1 in `_bmad-output/implementation-artifacts/iteration-three-verification.md`.

## Technical Decisions

- Retain the existing React/TypeScript/Vite application, shared pure domain, local service and build-selected local/bundled data adapters; no new scaffold or stack change is needed.
- One shared constructor identity renderer owns fallback semantics across surfaces and controls. Apply the correction there rather than creating surface-specific versions of identity behavior.
- Resolve media using explicit canonical identity/season mappings. Names are display labels, never join keys. The media mapping authority is `app/client/media.ts`, with local files and provenance maintained through `public/media/credits.json`.
- Continue resolving media through the selected adapter's media-path contract. Bundled media belongs to its validated immutable release; views must not construct external media URLs or select another adapter after failure.
- Keep identity rendering separate from data rules. Views continue consuming shared normalized data/selectors, and this visual correction must not reinterpret affiliations, points, missing values or session information.
- Preserve credited media and mapping validation. A missing or unusable mapping is a legitimate rendering state, not permission to substitute an unrelated mark or invent acquisition evidence.

## UX & Interaction Patterns

- Preserve the Pit Wall design: system fonts, dark grouped panels, restrained red accents, monospaced numeric emphasis and existing spacing/focus tokens.
- Contain valid historical logos within their intended boxes. On absence or failure, remove the constructor image frame entirely and let the single readable name carry identity. Driver portraits retain their stable named fallback frames.
- Keep full names and affiliations legible at narrow widths and 200% zoom. Preserve existing paired A/B identity placement and meaningful table access; do not hide identity text to fit the layout.
- Maintain the WCAG 2.2 AA target, visible unobscured focus, semantic controls/tables and keyboard access. Image state changes must not unexpectedly move focus or cause redundant accessible naming.
- Visual verification must establish actual logo containment, legibility and reflow; text assertions alone do not establish those outcomes.

## Cross-Story Dependencies

- Story 4.1 depends only on the approved 0.2 baseline and is independently deliverable. It does not depend on new-year audits, imagery acquisition or Epic 6 selection controls.
- Epic 5 reuses the corrected renderer for expanded-season identities and owns acquisition, provenance inventories and remaining-media-exception acceptance. Its final integration checks include the single-name behavior; no later story is required to complete Epic 4 itself.
