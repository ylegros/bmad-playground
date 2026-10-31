# Iteration-three architecture seam review

Verdict: Pass after fixes. The lifecycle, migration, comparison-window, immutable-export and selection rules close the material iteration-three seams. Both state-contract findings below were resolved and verified in the updated spine.

## Medium — explicit empty selection versus absent URL state

AD-14 requires Clear selection to survive Back and every representation, but does not explicitly distinguish an empty encoded set from an absent key. The existing `App.navigate` deletes empty string values; `Progress` falls back to legacy `entity` when a category key is absent. One implementation may clear by deleting the key and another may interpret the absent key using defaults or legacy entity state. Both preserve the stated category keys and deterministic serialization in isolation, but together can resurrect cleared series. The rule should explicitly preserve an empty-set representation and prevent legacy fallback after explicit Clear. Existing source anchors: `app/client/App.tsx` navigate, `app/client/Progress.tsx` rawSelection/update.

Disposition: resolved by the concurrent AD-14 clarification: clearing removes the graph key and legacy entity together, absent state means empty, and an explicit graph key takes precedence.

## Medium — local manifest metadata and refresh generation

AD-13 requires manifest lifecycle/window metadata to agree with the snapshot, while AD-5 permits manual refresh to replace a season snapshot and AD-9 validates manifest/snapshot identity. A client can retain its initially loaded manifest while the server commits a newer snapshot with a larger analysis window. One unit can reject the legitimate refreshed snapshot against stale manifest metadata; another can commit it while keeping stale coverage in the season list. The spine needs an explicit consistency boundary for local refresh: refreshed snapshot/audit metadata belongs to the same generation, and client support metadata must be updated or reloaded before it is used for validation/display. A separately failed manifest reload must not discard the last good snapshot or silently relabel it. The immutable bundle rule already closes this issue for hosted releases.

Disposition: resolved and verified in AD-13. Local support metadata derives from the same committed snapshot/audit generation; successful load/refresh atomically commits snapshot and derived support entry without a second manifest request or stale-manifest comparison; pending manifest responses cannot overwrite newer metadata; failed refresh preserves both. Immutable bundle validation stays release-scoped.

## No further divergence demonstrated

- V1 migration requires independently audited lifecycle/calendar evidence; merely changing the schema number is expressly prohibited. Shared contract/validator freeze precedes downstream work.
- The window includes every independently held GP, including held source gaps, and excludes future/cancelled GPs; pre-GP sprint/qualifying remain outside the GP comparison window.
- Export requires all 17 verified years and a complete immutable data/media release before promotion, with version/identity validation and no subset fallback.
- Additive matching, no-match/idempotent actions, category isolation, stale-action guards, one history event per effective action and no series cap are explicit.


