# Feedback corrections verification

Updated 2026-10-29 Asia/Shanghai. Local build, independent review and hosted verification completed; publication result is appended below when terminal.

## Accepted changes

- Six-category summary uses authoritative best GP qualifying rank before grid penalties, distinct from qualifying head-to-head; lower is better. Complete per-driver GP qualifying coverage is required.
- Summary and detail show tick/highlight without repeated visible Better labels. Ties/unavailable have no favorable marker. Screen-reader text identifies driver, metric and direction.
- Actual imagery: 2010 portraits27/27 and logos9/12; 2021 portraits21/21 and logos6/10. Seven individually investigated logo exceptions retain names. Portrait dates are disclosed independently of selected season.
- Credits directly define canonical image mappings. Every slot has exactly one image or fallback; duplicate, conflicting and missing slots reject export. Media is read once for hashing and copying.
- Image details opens attribution and focuses its summary. Panel-width reflow preserves the summary at narrow widths and 200% zoom; tests check children fit the summary, not only document overflow.

## Executed evidence

- Local TypeScript/Vite build passed.
- Unit/component suite:34 Node+8 Vitest tests passed, including qualifying2/grid7, missing sessions/driver records/numeric ranks, equal category votes, zero/tie/unavailable, conflicting/missing media slots, immutable release integrity and sanitized Site source build.
- Complete local browser suite:21 passed after review patches; targeted comparison/media7 passed after final container-width fix. All48 driver-season portraits and every mapped team logo decoded; no external requests.
- Bundled export/build passed with original19-round2010 and22-round2021 snapshots and original source IDs/timestamps.
- Hosted browser suite:2 passed, terminal exit0. All external/API requests blocked. Every mapped media file in the immutable release decoded. Selected-season source date and timezone matched source refreshedAt and differed from export time; static mismatch/retry also passed.
- Visual inspection: source contact sheets, actual desktop/narrow/200% summary screenshots. Rejected actor namesake Mark Webber, wrong2010 Williams mark and tiny files with unsupported reuse rationale. Final Mark Webber source is the F1 driver at2017 USGP.
- Three independent review contexts completed: blind,edge-case,verification-gap. Every finding has a verdict/evidence in spec-feedback-corrections.md; older validator/source staging/metric-memory/request-timeout issues are recorded in deferred-work.md.

Coverage inventory: [second-iteration-media-coverage.md](second-iteration-media-coverage.md). Machine-readable inventory includes all70 slots; exact provenance is [credits.json](../../public/media/credits.json).

## Release

Existing project appgprj_6ae2fc6bf4ac8191b6a74419c1da7671. Native get_site confirmed public access before this update; preserve anyone-with-link audience. Data/media identity af487bb97e853268744bc74e. Original dirty checkout and isolated worktrees preserved. No push of the original repository.

Current known limitations:7 investigated historical logo exceptions, mixed photograph dates (disclosed), Chromium-only browser checks, deferred pre-existing hardening items. User acceptance remains open.

### Terminal publication evidence

- Source commit: fe2717882721d533bf7fb7461bbd93f3074ee992
- Archive: .site-artifacts/pit-wall-feedback.tar.gz; sha256:429dd1d59b43a51c4c15afbe2034f1ce8796b8429e8922a055e806d842ceb225;129 files
- Saved version2: appgprj_6ae2fc6bf4ac8191b6a74419c1da7671~appgver_ac9d69a810908191a508ac48cd801ffb
- Deployment: appgdep_6ae31d3559988191b0e55847ddfa3b50
- Terminal status: succeeded at2026-10-29T10:17:51.841967+00:00 (18:17 Asia/Shanghai)
- URL: https://f1-pit-wall-yannick.navyelf64.chatgpt.site
- Existing public audience retained; no access-change operation used.
- Both hosted tests also passed against .site-source/pit-wall/dist after the source helper build, verifying the exact packaged source build.

## Release acceptance

2026-10-29: user approved the deployed release and requested commit, tag0.2 and push. The seven investigated logo exceptions remain documented as accepted release limitations; deferred hardening remains tracked separately. Package version0.2.0.
