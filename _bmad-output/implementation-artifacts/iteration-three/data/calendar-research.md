# Calendar and session lifecycle research

Observed 2026-10-30 UTC. This is independent calendar research, **not a completed source-data audit**. The root acquisition worker owns the one bounded Jolpica queue. This research made no Jolpica calls and does not promote any year to verified.

## Machine-readable records

`app/fixtures/iteration-three/calendar-evidence/{year}.json` records all 17 years. Each held event has its official Formula 1 GP-result URL and a separately fetched qualifying-result URL. Actual table rows are positive held-session evidence; absent endpoints, dates and maximum returned rounds never establish held status. Applicable sprints have independently fetched Sprint-result tables.

`rounds[].sessions.{gp,qualifying,sprint}` matches the frozen shared SessionEvidence shape: lifecycle, applicable and provenance entries containing sourceUrl, observedAt and note. Availability is deliberately not assigned here: endpoint completeness must come from the ingestion audit. Original top-level gp/qualifying/sprint fields are collection diagnostics; consumers use the sessions object. Non-applicable sprint sessions use lifecycle unheld and applicable false.

The round identifier is chronological **result-table order**, requiring comparison with the normalized provider calendar by event identity and date before merging. Never join from URL slugs: official Turkish2021 result URLs can retain a Singapore slug, and official Imola2022 URLs can use Italy. In2023 the F1 calendar retains cancelled Imola as its displayed round6 and subsequent display numbering differs from held-race result chronology.

Dates are normalized from the official table day/month and its explicit season heading. Each historical record contains independent completion provenance plus the result page for the identified final event. 2026 remains ongoing; its separate upcomingRounds list preserves the five official future events. Mexico was explicitly Next in the current calendar at observation; future statuses need re-observation when refreshing.

| Season | Positive GP evidence | Positive qualifying evidence | Positive Sprint evidence |
|---|---:|---:|---:|
|2010|19|19|0|
|2011|19|19|0|
|2012|20|20|0|
|2013|19|19|0|
|2014|19|19|0|
|2015|19|19|0|
|2016|21|21|0|
|2017|20|20|0|
|2018|21|21|0|
|2019|21|21|0|
|2020|17|17|0|
|2021|22|22|3|
|2022|22|22|3|
|2023|22|22|6|
|2024|24|24|6|
|2025|24|24|6|
|2026|18|18|6|

The research covers 347 GP and 347 qualifying sessions, plus30 Sprint sessions. It does not prove provider endpoint completeness, canonical rosters, points, classifications or status mappings.

## Applicability sources

- [Sprint debut/history and three2021 events](https://www.formula1.com/en/latest/article/everything-you-need-to-know-about-the-f1-sprint-format-as-it-returns-this.6UbqdBk5NcJ2maGFiTSQv8): Sprint debuted at Silverstone in July2021;2021 venues were Silverstone, Monza and Interlagos. This positively establishes no Sprint applicability2010–2020.
- [2022 format and three events](https://www.formula1.com/en/latest/article/how-does-the-f1-sprint-work-the-format-explained-ahead-of-imola.4ep6uU8VYFMgftvTYxkZdI): Imola, Austria and Brazil.
- [2023 six venues](https://www.formula1.com/en/latest/article/breaking-formula-1-announces-venues-for-six-f1-sprint-events-across-2023.4tvAAXFGdkoHKE8Onjh8Ya): Azerbaijan, Austria, Belgium, Qatar, United States and Brazil.
- [2024 six venues](https://www.formula1.com/en/latest/article/formula-1-announces-2024-sprint-calendar.7qBSzIpqD6C2IobIRm9HHm): China, Miami, Austria, United States, Brazil and Qatar.
- [2025 six venues](https://www.formula1.com/en/latest/article/formula-1-announces-2024-sprint-calendar.3fjONI6I9cAyThBj73oQRX): China, Miami, Belgium, United States, Brazil and Qatar.
- [2026 six venues](https://www.formula1.com/en/latest/article/the-beginners-guide-to-the-f1-sprint.55yJBEiF7vYkZEwSV9lZJ9): China, Miami, Canada, Great Britain, Netherlands and Singapore.

All session result URLs are stored individually in year JSONs; this report avoids duplicating hundreds of links.

## Completion evidence

Historical completion is independently sourced, never inferred from today's year. [FIA's2019 Abu Dhabi preview](https://www.fia.com/sites/default/files/2019_abu_dhabi_gp_preview.01.pdf) explicitly identifies historical season-ending venues: Abu Dhabi except2011–2013, which ended in Brazil. The records pair that retrospective evidence with each positively observed finale result table.

[2010 final-round retrospective](https://www.formula1.com/en/latest/article/formula-one-racings-greatest-title-showdowns.73LmegYX1AuPDL9cnWR1no), [2019 FIA finale report](https://www.fia.com/news/f1-hamilton-ends-2019-high-dominant-abu-dhabi-win), [2020 FIA finale report](https://www.fia.com/news/f1-verstappen-takes-dominant-abu-dhabi-win-close-out-2020-season), [2021 official finale report](https://www.formula1.com/en/latest/article/brilliant-verstappen-claims-maiden-title-after-victory-in-abu-dhabi-season.22Arui4l6BKK2PUsJgKqpZ), [2022 Abu Dhabi Sports Council result/season-finale report](https://adsc.gov.ae/media-center/press-releases/khaled-bin-mohamed-bin-zayed-presents-2022-formula-1-abu-dhabi-grand-prix-champion-max-verstappen-with-winner-s-trophy/), [2023 F1 impact report](https://corp.formula1.com/wp-content/uploads/2024/04/Formula-1-2023-Impact-Report.pdf), [2024 official finale report](https://www.formula1.com/en/latest/article/norris-so-proud-of-mclaren-as-abu-dhabi-win-ensures-team-take-first.3zORGryvho6xIdXJxlYPiY), and [2025 official finale report](https://www.formula1.com/en/latest/article/abu-dhabi-lowdown-all-the-key-moments-as-norris-seals-his-debut-title-and.6WLoFRGsfe4fbq1TZeoVIa) provide the other explicit completion sources.

## Calendar revisions and unresolved audit work

`calendar-changes.json` preserves sourced positive facts and explicitly marks its cancellation/revision inventory partial. Do not inject a cancelled event into an arbitrary canonical numbered round: keep original event/date identity and reconcile revisions first.

Important2026 change: [current official calendar](https://www.formula1.com/en/racing/2026) offers23 numbered events, with18 positively completed through United States. [FIA's March announcement](https://www.fia.com/news/bahrain-and-saudi-arabian-grands-prix-will-not-take-place-april) called off original April Bahrain/Saudi dates, but does not itself establish permanent cancellation. [F1/FIA later relocation announcement](https://www.formula1.com/en/latest/article/formula-1-and-fia-confirm-that-malaysia-will-join-the-2026-calendar-as-host-venue-for-the-bahrain-grand-prix.6lL7vjFEM2VVynRHvg1TCf) moves Bahrain to Sepang October2–4; its official result is positive held evidence. Saudi Arabia's final disposition beyond the April call-off remains an explicit unresolved change record.

Remaining work before verified promotion: audit all required pages and rosters; validate lifecycle/applicability with shared runtime validators; preserve original source refresh times and record migration/audit provenance separately. Unknown metadata must prevent verified promotion. This research alone never establishes story or release acceptance.

## Canonical calendar reconciliation completed

All17 typed backend inputs now exist in `app/fixtures/iteration-three/audited-calendars/{year}.json`. Each saved provider calendar was joined one-to-one against the official event evidence using a reviewed event-name alias and matching date, with independently documented corrections below; canonical provider round IDs were retained only after the join. No research array was blindly cast. `calendar-reconciliation.json` records aliases, counts and exceptions. There are347 heldGP rounds and five explicitly upcoming2026 rounds; every canonical session has known lifecycle and sourced applicability. This establishes the canonical calendar input, not endpoint/roster audit completion.

- Russia2014: F1 season summary says21October; [FIA's contemporaneous race report](https://www.fia.com/news/hamilton-wins-sochi-hand-mercedes-constructors-title) and [event page](https://www.fia.com/championship/events/fia-formula-one-world-championship/season-2014/2014-russian-grand-prix) establish12October. The original conflicting research value remains preserved; reviewed input carries correction provenance.
- Las Vegas2023,2025,2026: annual summaries use the local Saturday date; official event timetables show the Sunday UTC race dates19November2023,23November2025,22November2026 matching the saved provider calendars. These conversions have exact official timetable provenance.2024provider uses local23November, matching its summary; preserve the provider's source date representation rather than silently rewriting history.
- Imola2023: the withdrawn proposal has no canonical provider round. The original F1 calendar's displayed numbering is not used to shift canonical IDs; all22 positive held-event identities/dates match independently.
- [FIA's2020 archived inventory](https://www.fia.com/events/fia-formula-one-world-championship/season-2020/2020-fia-formula-one-world-championship) explicitly records cancelled and postponed original proposals. [FIA's2021 update](https://www.fia.com/news/formula-1-update-2021-calendar) and [F1's final22-event revision](https://www.formula1.com/en/latest/article/breaking-formula-1-announces-revised-22-race-calendar-for-2021.6OaQqLr4jrU5Ia2va3sjkv) explain the changed Turkey, France, Styria, Mexico and Brazil dates; all final held-event dates match. Singapore cancellation now has its own official source record.

The separate original-proposal history remains explicitly partial. In particular, archival postponed entries must not be relabelled permanently cancelled without another source. Such removed proposals are retained in the change inventory, never assigned fictitious numbered rounds or mixed into the final canonical schedule.2026Saudi Arabia's disposition beyond the originalApril call-off remains unresolved off the final23-event calendar. Full historical proposal-history acceptance is not claimed by the canonical-calendar reconciliation.
