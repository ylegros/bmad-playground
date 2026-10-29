# Iteration two technology reality check

Reviewed 2026-10-29 against ARCHITECTURE-SPINE.md, the approved iteration-two spec, app/shared/contracts.ts, app/client/App.tsx, app/server/service.ts, package.json/package-lock.json, vite.config.ts, and the installed Sites SKILL.md and scripts/build-site.mjs.

**Disposition: pass for architecture handoff; implementation and deployment remain unverified.** No new technology or dependency decision requires external version research. React 19.3.1, TypeScript 7.0.2, Vite 8.3.5, React plugin 6.1.2 and Node >=24.0.0 match repository declarations and lockfile inputs. This verifies retained configuration, not registry availability or hosted build execution.

## Findings

- No incompatible hosting claim found. Sites explicitly supports static.directory = dist and owner-private deployment. Static browser assets and same-origin snapshots fit that contract without a hosted Node process, Worker, database or connector. AD-12 correctly defers deployment proof to a terminal native result and preserves audience and identity.
- Implementation gate: current App.tsx directly calls /api and displays refresh/setup actions; no bundled adapter/exporter exists yet. The spine explicitly describes these as pending, so it does not claim current hosted compatibility. A static upload of the current build would fail the proposed experience.
- Implementation caution: the Sites build helper accepts no arguments and invokes the checkout's package build script. The sanitized Site checkout must therefore make its normal build command choose the validated bundled mode, or establish that mode through the exact source workflow. Merely adding a build:hosted script while leaving build on local mode will not make the helper select it. AD-9/12's explicit hosted build requirement covers the intent; verify this wiring during implementation.
- Contract reality check: schema v1 has no starting-grid field, matching AD-10's unavailable-until-normalized rule. Export manifest identity/version/path metadata and the shared data-source interface are proposed extensions rather than existing contracts. Preserve this distinction during handoff.

## Verification limits

Read-only contract and helper inspection only. No dependency installation, build, browser checks, export, Site registration or deployment was performed. Provider limits remain inherited historical assumptions and were not revalidated by this review; no live integration claim is made.
