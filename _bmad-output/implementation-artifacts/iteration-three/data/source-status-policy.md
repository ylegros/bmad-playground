# Source status policy investigation ? 2026-10-30

Investigated all 31 previously unmapped exact strings from the saved 2010?2026 provider-page audit. This is a status-policy investigation, not a new season or participation audit. The baseline allowlist remains intact.

## Primary evidence

- [Jolpica current SessionStatus enum](https://github.com/jolpica/jolpica-f1/blob/0fdc5a2584d6aae670d7b7b0188542493de2e437/jolpica/formula_one/models/session.py#L90): LAPPED explicitly means a car finished behind the leader; withdrawal and DNS share the DID_NOT_START category. Read via public raw source; no Jolpica API requests.
- [Exact legacy status enumeration](https://github.com/jolpica/jolpica-f1/blob/0fdc5a2584d6aae670d7b7b0188542493de2e437/jolpica_api/ergastapi/status_mapping.py): confirms exact provider spellings, including Withdrew and the three long lap deficits. Enumeration supplies names, not proof that every mechanical cause is a retirement.
- [Maintainer explanation, discussion 184](https://github.com/jolpica/jolpica-f1/discussions/184): historical mechanical causes can represent either retirement or failure to start. This explicitly rules out broad mechanical-label inference.
- [Official 2014 Malaysian result](https://www.formula1.com/en/results/2014/races/899/malaysia/race-result) records Perez as DNS, corresponding to cached Withdrew. [Official race report](https://www.formula1.com/en/latest/article/race-dominant-hamilton-leads-mercedes-one-two-in-malaysia.2MlVrEu4O6TIfT57dkmDsU) confirms he never started.

## Decisions

Add only exact Lapped=false and Withdrew=false. Preserve case-sensitive lookup; no regex, lap-count, numeric-classification or participation inference. Missing driver records still block totals. Unknown labels remain unavailable, including mechanical causes not conclusively distinguished from DNS. In particular cached Fuel system includes Hulkenberg 2013 Australia with withdrawal classification; generic mechanical=true would fabricate a DNF. Cached +11/+14/+42 Laps include retirement classifications, so never extend the baseline lap labels using a generic pattern.

The table lists one actual cached occurrence per exact string; the saved fixture additionally retains withdrawal counterexamples when observed. Cached classifications are diagnostic evidence of ambiguity, not a rule used by runtime selectors.

| Exact status | Decision | Saved occurrence | Rationale |
| --- | --- | --- | --- |
| Tyre | Unavailable | 2018 round 10, leclerc | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Battery | Unavailable | 2018 round 18, ricciardo | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Transmission | Unavailable | 2011 round 1, barrichello | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Water leak | Unavailable | 2011 round 1, kovalainen | Legacy cause alone cannot reliably distinguish retirement from DNS |
| +42 Laps | Unavailable | 2011 round 2, karthikeyan | Long lap deficit is not reliable proof of finishing |
| Engine misfire | Unavailable | 2011 round 2, maldonado | Legacy cause alone cannot reliably distinguish retirement from DNS |
| ERS | Unavailable | 2014 round 1, grosjean | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Oil pressure | Unavailable | 2014 round 1, ericsson | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Withdrew | Not retirement | 2014 round 2, perez | Exact legacy withdrawal spelling; official Perez DNS corroboration |
| Alternator | Unavailable | 2012 round 19, webber | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Electronics | Unavailable | 2020 round 1, albon | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Fuel system | Unavailable | 2013 round 1, hulkenberg | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Lapped | Not retirement | 2025 round 2, bortoleto | Provider enum explicitly identifies a finished car |
| +11 Laps | Unavailable | 2012 round 11, michael_schumacher | Long lap deficit is not reliable proof of finishing |
| Water pressure | Unavailable | 2022 round 16, alonso | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Radiator | Unavailable | 2020 round 11, albon | Legacy cause alone cannot reliably distinguish retirement from DNS |
| +14 Laps | Unavailable | 2011 round 13, ricciardo | Long lap deficit is not reliable proof of finishing |
| Brake duct | Unavailable | 2015 round 16, raikkonen | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Pneumatics | Unavailable | 2013 round 13, grosjean | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Undertray | Unavailable | 2022 round 11, latifi | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Differential | Unavailable | 2022 round 15, tsunoda | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Seat | Unavailable | 2017 round 8, perez | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Debris | Unavailable | 2020 round 7, russell | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Out of fuel | Unavailable | 2019 round 2, ricciardo | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Spark plugs | Unavailable | 2017 round 16, vettel | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Cooling system | Unavailable | 2022 round 2, bottas | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Water pump | Unavailable | 2022 round 2, alonso | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Fuel leak | Unavailable | 2022 round 3, max_verstappen | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Drivetrain | Unavailable | 2014 round 7, kvyat | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Heat shield fire | Unavailable | 2011 round 11, heidfeld | Legacy cause alone cannot reliably distinguish retirement from DNS |
| Injury | Unavailable | 2011 round 6, perez | Cause alone cannot distinguish pre-start withdrawal from retirement |

## Verification

Saved source-status-policy.fixtures.json contains 33 actual source records with URL, source observation time, exact string and expected policy result. Tests cover every investigated string, unknown case variants, ambiguous lap/withdrawal counterexamples and DNF summary behavior. node --test app/shared/source-status-policy.test.ts app/shared/comparison.test.ts passed 13/13; npm.cmd run check passed. Recent Lapped records now permit conservative DNF totals when every other driver/window record is available; unresolved historical statuses continue to block rather than fabricate totals. Parent regenerates the aggregate source audit and per-year reports after integration.
