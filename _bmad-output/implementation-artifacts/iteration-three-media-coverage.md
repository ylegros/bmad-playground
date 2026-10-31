# Iteration-three media coverage

Checked 2026-10-31T03:17:11.480Z against all17 individually audited v2 snapshots. Actual imagery and individually investigated exceptions are separate. **The user explicitly accepted all44 documented logo exceptions on2026-10-31. Exceptions remain separate from acquired imagery; this acceptance does not inflate actual-image counts.**

| Season | Actual photographs / total | Photo exceptions | Actual logos / total | Investigated logo exceptions | Unresolved |
| --- | ---: | ---: | ---: | ---: | ---: |
| [2010](iteration-three/media/2010.md) | 27 / 27 | 0 | 9 / 12 | 3 | 0 |
| [2011](iteration-three/media/2011.md) | 28 / 28 | 0 | 9 / 12 | 3 | 0 |
| [2012](iteration-three/media/2012.md) | 25 / 25 | 0 | 10 / 12 | 2 | 0 |
| [2013](iteration-three/media/2013.md) | 23 / 23 | 0 | 8 / 11 | 3 | 0 |
| [2014](iteration-three/media/2014.md) | 24 / 24 | 0 | 9 / 11 | 2 | 0 |
| [2015](iteration-three/media/2015.md) | 22 / 22 | 0 | 8 / 10 | 2 | 0 |
| [2016](iteration-three/media/2016.md) | 24 / 24 | 0 | 9 / 11 | 2 | 0 |
| [2017](iteration-three/media/2017.md) | 25 / 25 | 0 | 8 / 10 | 2 | 0 |
| [2018](iteration-three/media/2018.md) | 20 / 20 | 0 | 8 / 10 | 2 | 0 |
| [2019](iteration-three/media/2019.md) | 20 / 20 | 0 | 7 / 10 | 3 | 0 |
| [2020](iteration-three/media/2020.md) | 23 / 23 | 0 | 7 / 10 | 3 | 0 |
| [2021](iteration-three/media/2021.md) | 21 / 21 | 0 | 6 / 10 | 4 | 0 |
| [2022](iteration-three/media/2022.md) | 22 / 22 | 0 | 6 / 10 | 4 | 0 |
| [2023](iteration-three/media/2023.md) | 22 / 22 | 0 | 7 / 10 | 3 | 0 |
| [2024](iteration-three/media/2024.md) | 24 / 24 | 0 | 8 / 10 | 2 | 0 |
| [2025](iteration-three/media/2025.md) | 21 / 21 | 0 | 8 / 10 | 2 | 0 |
| [2026](iteration-three/media/2026.md) | 23 / 23 | 0 | 9 / 11 | 2 | 0 |

Totals: **394/394 real photograph slots**, **136/180 real logo slots**, **44 individually investigated logo exceptions** and zero unresolved slots. These slots represent 84 canonical driver identities.

Every slot is keyed by kind/canonical identity/year. Source file hashes, dimensions, per-slot provenance and exception evidence are in public/media/inventory.json and investigations.json; credits.json owns the explicit asset mappings. Current research source/license records and contact sheets are in iteration-three/media/research. Strict success establishes accounting/integrity; the separate explicit user decision accepts all44 documented unacquired logo slots. No live external image calls or generated likenesses/logos are used.

Local browser verification passed for all seventeen seasons: `npx.cmd playwright test --config playwright.audit.config.ts tests/audits/season-media.spec.ts` — **17 passed (1.4m)** on 2026-10-31. Each canonical driver portrait was selected and decoded in the comparison UI; every constructor mapping decoded and each exception retained exactly one name without an image frame. External requests were blocked and none attempted. This runtime check does not replace the documented visual identity/crop research or user exception review.

Acceptance update2026-10-31: canonical investigation and inventory exception rows now record `accepted-by-user` for all44 exceptions. Source checkedAt, source audits, image bytes and acquired/total counts remain unchanged.
