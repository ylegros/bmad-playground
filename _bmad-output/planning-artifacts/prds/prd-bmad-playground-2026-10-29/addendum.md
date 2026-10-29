# Data-source decision

The user approved Jolpica as the primary data source. Wikipedia scraping was considered and deferred.

Jolpica is the approved primary source because its documented API supplies structured qualifying, race results, sprint results, and championship standings. Validate season-wide coverage from 2010 and representative sprint seasons during implementation.

- API documentation: https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md
- Rate limits and request batching: https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md
- Terms: https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md

Wikipedia remains an alternative or supplementary source. Retrieving page content through an API still requires parsing article tables into stable driver, constructor, event, and session records. This adds maintenance work compared with consuming structured F1 records. Wikimedia API use is governed by its usage and robot policies:

- https://www.mediawiki.org/wiki/API:REST_API/Policies

Implementation proposal: cache retrieved seasons and fetch changes on demand. Scraping can be a separate learning exercise later.

## Coverage spot checks

Read-only requests on 2026-10-29 confirmed:

- `/ergast/f1/2010/1/results.json`: Bahrain Grand Prix, 24 results.
- `/ergast/f1/2010/1/qualifying.json`: Bahrain Grand Prix, 24 qualifying records.
- `/ergast/f1/2021/10/sprint.json`: British Grand Prix, 20 sprint results.

This is a representative sample, not an audit of every season or endpoint. Season-wide coverage, standings, pagination, and missing sessions need implementation validation.

