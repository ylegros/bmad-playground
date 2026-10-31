# All-year media acquisition checkpoint — 2026-10-30

Core-review handoff checkpoint requested by root. All acquisition processes have finished; no unsaved network work remains. Overall Stories 5.23–5.39 scope remains active and will resume after integrated review. No commit or sprint-tracker changes were made.

Current state:

- Collected 84 canonical driver IDs and 25 constructor IDs from saved provider driverId/constructorId records with their canonical Wikipedia URLs and represented years. This is research input; final denominators use only audited `.cache/seasons-v2` snapshots.
- Existing approved portrait assets represent 44 of those drivers. Downloaded the other 40 real driver photographs; zero portrait download failures remain. Identity binding is provider URL → exact Wikipedia sitelink (with explicit saved redirects for Albon, Sirotkin, Antonelli and Rossi) → Wikidata Qid/P18 → Commons file and license metadata. No name-only identity joins.
- All 40 new photo candidates were visually inspected in two saved contact sheets. Subjects are visible; Piastri is a full-body source and Pietro Fittipaldi wears a cap. Dates may be later than selected years and must remain independently disclosed. Sirotkin uses the Free Art License; others are CC BY/CC BY-SA/public-domain with metadata. None has yet been promoted into public/media or credits.json.
- Downloaded 18 constructor-logo candidates and their source/license metadata. Inspected contact sheet: actual current/historical Haas variants, Caterham variants, Lotus Enstone badge, Manor variants, Racing Point, Audi2026, Mercedes2026, Williams Atlassian, McLaren2022, Sauber S and Alpine. Exact allowed years still need explicit applicability decisions before mapping. Five additional historical file downloads returned HTTP429 and remain pending retry, not exceptions.
- Public media still contains only preserved baseline approved imagery plus Story5.5 inventory/investigation metadata. The seven baseline logo exceptions remain pending user review; no lower target is approved.

Saved files:

- `.cache/media-acquisition/canonical-identities.json`
- `.cache/media-acquisition/portrait-candidates.json` and `portraits/*` (40 files)
- `.cache/media-acquisition/wikidata-portraits.json`, `wikipedia-portrait-redirects.json`, `wikidata-redirected-portraits.json`
- `.cache/media-acquisition/logo-candidates.json` and `logos/*` (18 files)
- `.cache/media-acquisition/wikidata-constructors.json`, `constructor-logo-catalog.json`
- `_bmad-output/implementation-artifacts/iteration-three/media/new-portraits-contact-1.png`, `new-portraits-contact-2.png`, `new-logos-contact-1.png`

Resume:

1. `node scripts/collect-media-identities.mjs` refreshes research identities from saved raw pages without network.
2. `node scripts/acquire-media-portraits.mjs` skips saved successful downloads, uses cached identity metadata, and acquires only new/missing candidates. HTTP429 metadata requests honor Retry-After with bounded retries.
3. `node scripts/acquire-media-logos.mjs` skips saved successful logo candidates and retries five failed images. Its image-download path currently records HTTP429 instead of waiting; next change should add bounded Retry-After handling there. Do not count those failures as investigated exceptions.
4. `node scripts/render-media-contacts.mjs portraits` / `logos` rebuilds contact sheets from saved candidates.
5. Promote visually verified files and complete credit/license fields, extending existing portrait applicability only for independently represented canonical identities. Assign constructor marks only after exact-era checks (e.g. official McLaren logo history distinguishes 2007–2017, mono-black 2017–2021, papaya2021 onward).
6. Generate per-year inventories/reports only from audited `.cache/seasons-v2/*.json`, then run strict inventory validation and browser/static release checks.

Network execution approvals were granted through tool review for `node scripts/acquire-media-portraits.mjs`, `node scripts/acquire-media-logos.mjs` and `node scripts/research-constructor-logos.mjs`. User authorized all-year acquisition and parallel work; no publication or external communications occurred. Existing user authorization remains sufficient for reversible media implementation. Coordinate with root before broad credits applicability changes so explicit legacy-v1 export remains usable separately.
