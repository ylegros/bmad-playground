---
name: F1 Dashboard
description: Personal season analysis with a restrained racing-inspired visual language.
status: final
updated: 2026-10-30
sources:
  - ../../../specs/spec-iteration-three/SPEC.md
  - ../../../specs/spec-iteration-three/season-coverage-and-acceptance.md
  - ../../../specs/spec-iteration-two-feedback/SPEC.md
  - ../../../specs/spec-iteration-two-feedback/acceptance-corrections.md
  - ../../../implementation-artifacts/spec-second-iteration.md
  - ../../architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md
  - ../../epics.md
  - ../../prds/prd-bmad-playground-2026-10-29/prd.md
colors:
  canvas: '#0D0F13'
  surface: '#20242C'
  ink: '#F5F6F8'
  muted: '#A0A6B2'
  border: '#343943'
  accent: '#E32219'
  on-accent: '#000000'
  frame: '#15171D'
  control-border: '#8B929F'
  focus: '#78B7FF'
  series-a: '#78B7FF'
  series-b: '#D6A0EA'
typography:
  title:
    fontFamily: 'system-ui, sans-serif'
    fontSize: 32px
    fontWeight: '750'
    lineHeight: '1.2'
  heading:
    fontFamily: 'system-ui, sans-serif'
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.3'
  body:
    fontFamily: 'system-ui, sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  meta:
    fontFamily: 'system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 4px
  md: 8px
spacing:
  unit: 4px
  control: 12px
  gutter: 24px
  section: 32px
  mobile: 16px
components:
  app-header:
    background: '{colors.frame}'
    foreground: '{colors.ink}'
  selector:
    background: '{colors.surface}'
    border: '{colors.control-border}'
    radius: '{rounded.sm}'
  action:
    background: '{colors.accent}'
    foreground: '{colors.on-accent}'
  navigation:
    indicator: '{colors.accent}'
  standings-table:
    background: '{colors.surface}'
  progress-panel:
    background: '{colors.surface}'
    radius: '{rounded.md}'
  comparison-panel:
    background: '{colors.surface}'
    radius: '{rounded.md}'
  data-table:
    background: '{colors.surface}'
  status-message:
    foreground: '{colors.ink}'
    border: '{colors.border}'
---

## Brand & Style

Current authority: the [iteration-three spec](../../../specs/spec-iteration-three/SPEC.md), [season coverage companion](../../../specs/spec-iteration-three/season-coverage-and-acceptance.md) and adopted [architecture spine](../../architecture/architecture-bmad-playground-2026-10-29/ARCHITECTURE-SPINE.md), including AD-11/13/14, govern this alignment. Earlier [accepted corrections](../../../specs/spec-iteration-two-feedback/acceptance-corrections.md) retain scoring, imagery and accessible highlight rules. Iteration three supersedes the two-season limit, duplicate constructor fallback badge and individual-only Progress selection. Earlier release checks and stories remain historical; iteration-three implementation and evidence are pending. Preserve the current anyone-with-link audience. This update authorizes no acquisition, code, build or publication.

Iteration two: the historical [summary, graphs, highlights and imagery handoff](iteration-two-design.md) records component details within this identity. Its [responsive layout reference](mockups/iteration-two.html) uses fictional fixtures. This spine governs iteration-three scope and fallback rules when that historical supplement conflicts. The user's earlier optional UX-validation skip and Progress/Compare spine-only preference persist.

User selected **Pit Wall (option 2)**: dark compact desktop sidebar, grouped data panels, restrained red accents and monospaced numeric emphasis. The Formula 1 reference supplies color/racing feel, not copied branding. Tokens define original implementation values. Use system fonts and the product name F1 Dashboard. Selected composition: [Standings — Pit Wall](mockups/standings-pit-wall.html), illustrating the header, sidebar, summary strip and grouped panels. Fixture values and schematic charts are not production data.

`EXPERIENCE.md` owns behavior. These spines win on conflict with later visual artifacts.

## Colors

[ASSUMPTION] `{colors.canvas}` supports dark data surfaces; `{colors.ink}` and `{colors.muted}` carry primary and secondary text. `{colors.accent}` identifies actions and active navigation; refresh errors use explicit text rather than interpreting this brand color as an error signal. `{colors.series-a}` and `{colors.series-b}` distinguish drivers alongside names and solid/dashed lines. Team affiliation remains text; team colors are unnecessary.

Target WCAG AA: normal text 4.5:1, large text 3:1, essential controls/focus/chart marks 3:1 against adjacent surfaces. Verify implemented combinations, including hover/disabled states. Border and focus colors support these targets; subtle gridlines must not carry essential information alone.

## Typography

Use `{typography.title}` once per surface, `{typography.heading}` for sections, `{typography.body}` for data and controls, and `{typography.meta}` for timestamps and chart labels. Numeric cells use ui-monospace, Consolas, monospace with tabular figures and right alignment. Full names wrap; uppercase is limited to short GP/Sprint labels. Respect browser font enlargement.

## Layout & Spacing

Maximum content width 1440px, centered. Header uses {colors.frame} framing, a red lower rule, product name, season selector, refresh and snapshot time. At 1024px+ Navigation occupies a 185px sidebar. Content places a compact summary strip above a wider standings panel and narrower metric preview panel. Summaries derive only from available PRD data: leader points, top-two points gap and covered rounds; omit unavailable values and never invent completeness or new KPI scope. Preview links to Progress/Compare. Use {spacing.gutter} gutters and {spacing.section} gaps. [ASSUMPTION] Below 1024px use wrapping visible navigation and stacked panels; below 768px use {spacing.mobile} margins and stacked controls.

## Elevation & Depth

Flat surfaces, visible borders and spacing establish groups. No decorative shadows or gradients. Charts remain subordinate to legible labels and numeric evidence.

## Shapes

[ASSUMPTION] `{rounded.sm}` for controls and `{rounded.md}` for analysis panels. Square table cells retain alignment; avoid rounded decoration around individual values.

## Components

Component names match `EXPERIENCE.md`.

| Component | Visual contract |
|---|---|
| App header | Dark `{components.app-header.background}` frame; light `{colors.ink}` text; selected season and timestamp remain legible and wrap on narrow screens. |
| Selector | Visible label above bordered dark field; 44px minimum height; selected value never replaced by placeholder alone. |
| Action | Local refresh uses a red filled primary action with black text; bundled mode has load retry only. Secondary actions use ink text and bordered dark surface; explicit disabled styling. |
| Navigation | Text links with active underline and weight change; active state does not rely on red alone. |
| Standings table | Drivers/Constructors toggle, clear header, aligned monospaced numeric columns, full names and text constructor affiliations; initial-teammate annotation sits alongside the driver name when relevant. |
| Progress panel | Heading with selected entities and season; labeled search and category controls, Select all and Clear selection above chart; visible round axis, units and complete named legend; accessible data table follows. Selected controls wrap without dropping names or series. |
| Comparison panel | Two labeled driver selectors; named light-blue solid/lilac dashed series; aligned same-round values; season always in heading. |
| Data table | Caption identifies entity, season and measure; row/column headers; GP and Sprint columns explicitly labeled; unavailable text remains distinct from numeric 0. |
| Comparison summary | Portrait / six-row scorecard / portrait; stable A/B identities. Best GP qualifying rank replaces starting grid. Favorable values show tick, bold number and subtle series-colored highlight without visible Better labels; ties/unavailable retain ordinary styling. |
| Comparison highlight | Same summary/detail tick and highlight; tick supplies a non-color cue and is decorative for assistive technology. |
| Identity media | Actual verified photographs in stable 4:5 face-safe frames on {colors.frame}; season-appropriate logos contained in fixed boxes. Missing or failed constructor logos remove the logo badge entirely, leaving one readable team-name label; no text-filled badge, duplicate name or empty logo decoration. Full names and all affiliations remain readable; A stays left/B right on mobile. |
| Image credits | Readable local provenance disclosure with photo date/unknown and selected season. Driver portrait fallbacks may retain reserved frames; constructor fallback follows Identity media. Fallbacks never count as acquired images. |
| Status message | Text with outlined container; loading uses a static placeholder or restrained progress indicator; failures include a retry action and retained-snapshot time when present. |

Focus uses a visible 2px `{colors.focus}` outline with 2px offset; reserve room to avoid clipping it. Hover and selected treatments preserve text contrast. Result statuses such as DNF appear as text, never fabricated positions.

### Iteration-three presentation

| Existing component | Visual delta |
|---|---|
| App header / Selector | Show every candidate year 2010–2026 with its individual audit status; distinguish unverified/unavailable years from verified analysis. Keep selected season, snapshot time/timezone and Ongoing or Complete visible. |
| Status message / Standings table | Use plain text for Current standings, source round and any lag behind the analysis window. Reserve Final for independently verified season completion. Display analyzed rounds and Season to date on ongoing-season analysis; never imply future completeness. |
| Progress panel / Data table / Comparison summary | Keep the full calendar visible with distinct Not held, Cancelled, Unavailable and Not applicable text. Season-to-date summaries identify the completed-GP window and coverage counts. Missing values remain gaps, and pre-GP qualifying/sprint results are identified as outside completed-GP comparisons. |
| Action / Selector | Select all and Clear selection use existing secondary-action styling and visible focus. Show match and selected counts without implying a display limit. No-results and empty-selection guidance remain readable beside the controls. |

Many-series inspection retains every selected name, distinguishable line style/label and matching table evidence. Use intended panel/table scrolling and wrapping at narrow widths and 200% zoom; never hide selected series to fit. No additional fixed palette or arbitrary series cap is introduced. The existing mockups illustrate historical composition; iteration-three states are spine-only under the user's existing preference.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep round, season, units and driver names visible | Depend on hover or color to identify values |
| Keep table evidence available beside charts | Convert missing values to zero or connect chart lines across gaps |
| Use restrained racing cues and original assets | Reproduce Formula 1 branding or assume its exact palette is verified |
| Preserve working data during refresh | Replace a retained snapshot with an empty error screen |

Contrast implementation: use {colors.control-border} for essential control boundaries; {colors.border} is a nonessential panel divider. Red primary actions use black {colors.on-accent} text; white on red is not the button text contract. Header text uses {colors.ink} on {colors.frame}.



## Approved first iteration — 2026-10-29

Historical scope only: the iteration-three authority above supersedes its two-season limit and deferred features.

The user approved a reduced first iteration targeting eight hours: only fully verified 2010 and 2021 initially; all required metrics in accessible tables; charts, summary strip, metric previews and broad historical coverage audit deferred. These omissions supersede broader requirements elsewhere in this document for this iteration only. Keep sprint handling, official championship authority, missing-versus-zero, teammate semantics, atomic refresh and failure retention. React/TypeScript/Vite with local Node is accepted. Parallel unattended implementation uses an automated foundation check and final human review, with no intermediate human pause. The canonical contract is _bmad-output/specs/spec-bmad-playground/SPEC.md. Eight hours is a target, not a guarantee; full-MVP direction remains follow-up.


Implementation contrast check: black action text on #E32219 measures 4.51:1; the provisional #0D0F13 foreground measured 4.12:1 and was corrected to satisfy the normal-text AA target.

