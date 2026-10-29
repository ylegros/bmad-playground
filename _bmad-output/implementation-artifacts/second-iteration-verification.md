# Historical iteration two release verification

This file preserves version1 evidence and its historical authorization sequence. Current corrections are recorded in [feedback-corrections-verification.md](feedback-corrections-verification.md). The old starting-grid and sparse-image limitations below describe the original release.

Updated 2026-10-29 16:19 Asia/Shanghai. Publication succeeded. The user explicitly selected anyone-with-link access, superseding the original private-only requirement. Live URL: https://f1-pit-wall-yannick.navyelf64.chatgpt.site

## Verified implementation

- Local `npm.cmd run build`: passed after integrated review fixes.
- `npm.cmd test`: 32 Node tests and 8 Vitest tests passed.
- `npm.cmd run test:e2e`: 18 browser tests passed after review fixes.
- `npm.cmd run build:hosted`: passed from original verified caches and attributed media.
- Hosted Playwright: 2 tests passed, terminal exit 0. All external and `/api` requests blocked; both seasons, standings, summary/highlights, graphs/inspection, mobile and static retry work. Bahrain 2021 Leclerc/Russell qualifying 4/15 and GP classification 6/14 verified in browser against bundled real data.
- Isolated source's default `npm.cmd run build`: passed using sanitized payloads without local server/cache. Dedicated source-preparation regression test also builds a temporary isolated checkout.
- Blind, edge-case and verification-gap reviews completed. Every finding triaged in the spec; fixes cover graph availability, rendered axis directions, keyboard value announcements, missing selections, score order, numeric positions, export allowlists, provenance and damaged release rejection.
- Sprint tracking validation passed.

## Release identity

| Field | Recorded value |
|---|---|
| Site project | `appgprj_6ae2fc6bf4ac8191b6a74419c1da7671` |
| Sanitized checkout | `.site-source/pit-wall` |
| Hosting manifest | `.site-source/pit-wall/.openai/hosting.json` |
| Local deployment archive | `.site-artifacts/pit-wall.tar.gz` |
| Release data/media identity | `5560ceb4c23b5a365e1fa91a` |
| 2010 snapshot | `44e390a5-52c2-4dca-9fd5-4830e3281e62` |
| 2010 source refreshedAt | `2026-10-28T17:32:35.974Z` |
| 2021 snapshot | `647d9760-ba07-4b20-8fb8-b01a746c4c2f` |
| 2021 source refreshedAt | `2026-10-28T17:21:45.922Z` |
| Source commit | `4b05d2bf49f586e0630136dd48f953c8635cf204` |
| Saved version | `appgprj_6ae2fc6bf4ac8191b6a74419c1da7671~appgver_337252ef46148191b8772a8abcd84e21` (version 1) |
| Deployment | `appgdep_6ae30174a1508191944de15fed0b9d0e` |
| Terminal status | `succeeded` at `2026-10-29T08:19:20.191757+00:00` |
| Current audience | `public`: anyone with URL, explicitly selected by user |

The existing local v0.1 tag and planning changes are preserved. Worktrees remain available under `.worktrees/`. No original repository push occurred.

## Private audience and source boundary

Native `get_site` returned current user role `owner`, custom access restricted to the owner, no allowed groups/editors and zero external visitors. The Site has no published version yet. Creation returned an expected origin, which is not proof of deployment.

Prepared source contains browser/shared code, build inputs, sanitized domain payloads, attributed media and the returned hosting identity. It excludes server code, raw cache envelopes, credentials, logs, original Git metadata and unrelated public files. The deployment archive contains static assets and hosting metadata. Source synchronization would export this application source and bundled data to the registered Site's external Git repository.

## Publication authorization and result

Automatic approval review rejected the source-helper escalation: it requires explicit user authorization for exporting the source payload to the external Site repository. The rejection was not bypassed. After approval, resume the existing Site source helper, synchronize the exact source, package its matching commit/archive, then use the owner-private deployment operation and wait for terminal success. Preserve any returned version/deployment IDs; do not register another Site.

## Product limitations

Schema v1 keeps starting grid explicitly unavailable. Two licensed driver portraits and one historical team mark are bundled; other canonical identities have documented named fallbacks. Browser verification targets Chromium; no accessibility certification or disconnected-browsing guarantee is claimed. Local refresh does not change the Site until another validated export/publication.

The user subsequently requested publication on ChatGPT and selected anyone with the link. Source synchronization/build/packaging succeeded; exact matching source/archive saved as version 1. Native access update confirmed public mode (revision 2). Standard deployment returned terminal succeeded with the live URL. No additional access check is required by Sites after terminal success. Original private-access observations above are historical; public access is the current authorized state.
