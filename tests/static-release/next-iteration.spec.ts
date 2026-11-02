import {test, expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

test('prepared 2026 release matches local evidence across surfaces and static retry',async({page})=>{
 const directory=process.env.PREVIEW_DIRECTORY!;
 const receipt=JSON.parse(readFileSync('_bmad-output/implementation-artifacts/next-iteration/data/2026-refresh.json','utf8'));
 const manifest=JSON.parse(readFileSync(resolve(directory,'bundled/manifest.json'),'utf8'));
 const entry=manifest.seasons.find((row:{season:number})=>row.season===2026);
 const local=JSON.parse(readFileSync('.cache/seasons-v2/2026.json','utf8')).snapshot;
 const snapshot=JSON.parse(readFileSync(resolve(directory,entry.assetPath),'utf8'));
 for(const field of ['snapshotId','season','refreshedAt','lifecycle','analysisRounds','audit','coverage','schedule','results','qualifying','driverStandings','constructorStandings'])expect(snapshot[field]).toEqual(local[field]);
 expect(entry.snapshotId).toBe(local.snapshotId);
 expect(snapshot.analysisRounds.at(-1)).toBe(receipt.round);
 expect(manifest.exportedAt).not.toBe(snapshot.refreshedAt);
 const forbidden:string[]=[];
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.origin!=='http://127.0.0.1:3104'||url.pathname.startsWith('/api/')){forbidden.push(url.href);return route.abort();}
  return route.continue();
 });
 for(const query of ['view=standings','view=progress&category=drivers&graphDrivers=norris','view=compare&a=norris&b=piastri']){
  await page.goto('/?season=2026&'+query);
  await expect(page.locator('.snapshot-meta')).toContainText('Bundled season data');
  await page.locator('.season-disclosure').first().locator('summary').click();
  await expect(page.getByRole('region',{name:'Season evidence'})).toContainText('Analyzed GP rounds ('+snapshot.analysisRounds.length+'): '+snapshot.analysisRounds.join(', '));
  await expect(page.getByRole('region',{name:'Season evidence'})).toContainText('Ongoing / Season to date');
  expect(await page.evaluate(async path=>(await fetch('/'+path)).json(),entry.assetPath)).toEqual(snapshot);
 }
 // Reject the static payload once, then allow the existing retry flow to recover.
 let rejectOnce=true;
 await page.route('**/'+entry.assetPath,route=>rejectOnce?(rejectOnce=false,route.fulfill({status:503,contentType:'application/json',body:'{}'})):route.continue());
 await page.goto('/?season=2026');
 await page.getByRole('button',{name:/Retry loading bundled data/}).click();
 await expect(page.locator('.snapshot-meta')).toContainText('Bundled season data');
 await expect(page.getByRole('table').first()).toContainText('Norris');
 expect(forbidden).toEqual([]);
});
