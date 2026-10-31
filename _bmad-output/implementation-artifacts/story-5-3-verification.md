Story 5.3 verification — 2026-10-30

Implemented shared completed-GP selection through evidence.analysisWindow for v2 comparisons, conservative best finish/qualifying/DNF denominators, bounded official standings, teammate lookup and source-round/lag metadata. Full-calendar projections preserve held qualifying before an unheld GP, distinguish Not held/Cancelled/Not applicable/Unavailable, suppress future cumulative values and retain chart gaps. V1 paths preserve baseline behavior. Selection helper sections were left intact.

Saved synthetic fixture: app/shared/analysis-window.test.ts. Five cases cover ongoing held window; pre-GP qualifying; cancelled/unheld states; held source gaps; zero completed GPs; lagging fractional official standings; unknown retirement status and missing substitute driver. Existing comparison/selectors/progress tests cover historical v1, zero/tie rules, qualifying before grid and six equally weighted categories.

Verification: node --test app/shared/selectors.test.ts app/shared/comparison.test.ts app/shared/progress-model.test.ts app/shared/analysis-window.test.ts — 24/24 passed. npm.cmd run check — passed. PowerShell npm shim is disabled; npm.cmd was used. Tests use synthetic saved evidence, not a live 2026 audit. Browser integration, acquisition and complete year coverage are outside this story and are not claimed.
