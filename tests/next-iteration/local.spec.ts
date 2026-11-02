import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import type {SeasonSnapshotV2} from '../../app/shared/contracts';

test('refreshed 2026 evidence and next-iteration UX agree across all three surfaces',async({page})=>{
 const receipt=JSON.parse(readFileSync('_bmad-output/implementation-artifacts/next-iteration/data/2026-refresh.json','utf8'));
 const snapshot=JSON.parse(readFileSync('.cache/seasons-v2/2026.json','utf8')).snapshot as SeasonSnapshotV2;
 expect(snapshot.snapshotId).toBe(receipt.snapshotId);
 expect(snapshot.analysisRounds.at(-1)).toBe(receipt.round);
 const forbidden:string[]=[];
 const origin=new URL(test.info().project.use.baseURL!).origin;
 await page.route('**/*',route=>{
  if(new URL(route.request().url()).origin!==origin){forbidden.push(route.request().url());return route.abort();}
  return route.continue();
 });
 await page.goto('/?season=2026');
 await expect(page.getByRole('table').first()).toHaveAccessibleName(new RegExp(`official round ${receipt.round}`));
 await page.locator('.season-disclosure').first().locator('summary').click();
 const seasonEvidence=page.getByRole('region',{name:'Season evidence'});
 await expect(seasonEvidence).toContainText(`Analyzed GP rounds (${snapshot.analysisRounds.length}): ${snapshot.analysisRounds.join(', ')}`);
 await expect(seasonEvidence).toContainText('Ongoing / Season to date');
 const ids=Object.keys(snapshot.drivers);
 const a=ids.includes('norris')?'norris':ids[0],b=ids.includes('piastri')?'piastri':ids.find(id=>id!==a)!;
 await page.goto(`/?season=2026&view=progress&graphDrivers=${a},${b}`);
 await expect(page.getByRole('heading',{name:'Choose your focus',exact:true})).toBeVisible();
 await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText(snapshot.schedule.find(row=>row.round===receipt.round)!.name);
 await page.goto(`/?season=2026&view=compare&a=${a}&b=${b}`);
 await expect(page.getByRole('heading',{name:'Choose two drivers from 2026',exact:true})).toBeVisible();
 await expect(page.locator('.summary-metric')).toHaveCount(6);
 await expect(page.locator('.summary-value > strong')).toHaveCount(12);
 await expect(page.locator('.comparison-bar')).toHaveCount(0);
 await page.locator('.season-disclosure').first().locator('summary').click();
 await expect(page.getByRole('region',{name:'Season evidence'})).toContainText(`Analyzed GP rounds (${snapshot.analysisRounds.length})`);
 await page.locator('.comparison-summary').screenshot({path:'.site-artifacts/next-iteration-compare-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.comparison-summary').screenshot({path:'.site-artifacts/next-iteration-compare-narrow.png'});
 await page.setViewportSize({width:1280,height:900});
 await page.addStyleTag({content:'html{zoom:2}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.summary-identity.driver-a strong')).toHaveText(snapshot.drivers[a].name);
 await expect(page.locator('.summary-identity.driver-b strong')).toHaveText(snapshot.drivers[b].name);
 await expect(page.locator('.summary-value > strong')).toHaveCount(12);
 const detail=page.locator('.summary-evidence summary').first();
 await detail.focus();await detail.press('Enter');
 await expect(page.locator('.summary-evidence').first()).toHaveAttribute('open','');
 expect(forbidden).toEqual([]);
});
