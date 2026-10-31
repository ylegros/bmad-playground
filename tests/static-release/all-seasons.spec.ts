import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { BundledManifestV2, SeasonSnapshotV2 } from '../../app/shared/contracts';
import { validBundledManifestV2, validBundledSnapshotV2 } from '../../app/shared/evidence';

const directory=process.env.PREVIEW_DIRECTORY;
if(!directory)throw new Error('PREVIEW_DIRECTORY must name the isolated real static release.');
const releaseDirectory=resolve(directory);
const read=(path:string)=>JSON.parse(readFileSync(resolve(releaseDirectory,path),'utf8'));

test('real immutable release loads all 17 audited seasons and local media without API or external access',async({page})=>{
 const manifest=read('bundled/manifest.json') as BundledManifestV2;
 expect(validBundledManifestV2(manifest)).toBe(true);
 expect(manifest.seasons.map(row=>row.season)).toEqual(Array.from({length:17},(_,i)=>2010+i));
 const releaseRoot=manifest.seasons[0].assetPath.split('/').slice(0,-1).join('/');
 expect(new Set(manifest.seasons.map(row=>row.assetPath.split('/').slice(0,-1).join('/')))).toEqual(new Set([releaseRoot]));
 const forbidden:string[]=[],mediaRequests:string[]=[];
 await page.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(url.origin!=='http://127.0.0.1:3104'||url.pathname.startsWith('/api/')){forbidden.push(url.href);return route.abort();}
  if(/\.(jpg|jpeg|png|svg)$/.test(url.pathname))mediaRequests.push(url.pathname);
  return route.continue();
 });
 await page.goto('/');
 expect(await page.evaluate(async()=>(await fetch('/bundled/manifest.json')).json())).toEqual(manifest);
 await expect(page.locator('.snapshot-meta')).toContainText('Bundled season data');
 await expect(page.getByRole('combobox',{name:'Season',exact:true}).locator('option')).toHaveCount(17);
 await expect(page.getByRole('button',{name:/Refresh data|Verify season/})).toHaveCount(0);
 for(const entry of manifest.seasons){
  await test.step(String(entry.season),async()=>{
   const snapshot=read(entry.assetPath) as SeasonSnapshotV2;
   expect(validBundledSnapshotV2(snapshot,entry)).toBe(true);
   expect(snapshot.audit.status).toBe('verified');
   expect(snapshot.analysisRounds).toEqual(snapshot.schedule.filter(row=>row.sessions.gp.lifecycle==='held').map(row=>row.round));
   await page.getByRole('combobox',{name:'Season',exact:true}).selectOption(String(entry.season));
   const evidence=page.getByRole('region',{name:'Season evidence'});
   await expect(evidence).toContainText(`Analyzed GP rounds (${snapshot.analysisRounds.length}): ${snapshot.analysisRounds.join(', ')}`);
   await expect(evidence).toContainText(snapshot.lifecycle==='ongoing'?'Ongoing / Season to date':'Complete season');
   const sourceRound=Math.max(...snapshot.driverStandings.filter(row=>snapshot.analysisRounds.includes(row.round)).map(row=>row.round));
   const standing=snapshot.driverStandings.find(row=>row.round===sourceRound)!;
   const driver=snapshot.drivers[standing.driverId];
   const standings=page.getByRole('table').first();
   await expect(standings).toContainText(driver.name);
   const row=standings.getByRole('row').filter({hasText:driver.name});
   if(standing.points.kind==='value')await expect(row).toContainText(String(standing.points.value));
   const served=await page.evaluate(async path=>(await fetch('/'+path)).json(),entry.assetPath);
   expect(served).toEqual(snapshot);
   const sourceTime=await page.evaluate(date=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(date)),snapshot.refreshedAt);
   await expect(page.locator('.snapshot-meta')).toContainText(sourceTime);
  });
 }
 const credits=read(`${releaseRoot}/media/credits.json`);
 const inventory=read(`${releaseRoot}/media/inventory.json`);
 const investigations=read(`${releaseRoot}/media/investigations.json`) as {acceptance:string}[];
 expect(investigations).toHaveLength(44);
 expect(investigations.every(row=>row.acceptance==='accepted-by-user')).toBe(true);
 const exceptions=inventory.slots.filter((row:{status:string})=>row.status==='exception');
 expect(exceptions).toHaveLength(44);
 expect(exceptions.every((row:{acceptance:string})=>row.acceptance==='accepted-by-user')).toBe(true);
 expect(await page.evaluate(async path=>(await fetch('/'+path)).json(),`${releaseRoot}/media/investigations.json`)).toEqual(investigations);
 expect(inventory.inventoryVersion).toBe(2);
 for(const year of manifest.seasons.map(row=>row.season)){
  expect(inventory.coverage.filter((row:{season:number})=>row.season===year)).toHaveLength(2);
 }
 const loadedCredits=await page.evaluate(async path=>(await fetch('/'+path)).json(),`${releaseRoot}/media/credits.json`);
 expect(loadedCredits).toEqual(credits);
 const decoded=await page.evaluate(async({root,files})=>Promise.all(files.map(async(filename:string)=>{
  const image=new Image();image.src='/'+root+'/media/'+filename;
  try{await image.decode();return {filename,valid:image.naturalWidth>0};}catch{return {filename,valid:false};}
 })),{root:releaseRoot,files:credits.assets.map((row:{filename:string})=>row.filename)});
 expect(decoded.filter(row=>!row.valid)).toEqual([]);
 expect(decoded.length).toBeGreaterThan(0);
 const representative=read(manifest.seasons.find(row=>row.season===2021)!.assetPath) as SeasonSnapshotV2;
 const names=Object.values(representative.drivers).sort((a,b)=>a.id.localeCompare(b.id));
 await page.goto(`/?season=2021&view=progress&category=drivers&graphDrivers=${names[0].id}`);
 await expect(page.getByRole('region',{name:'Season evolution evidence'})).toContainText(names[0].name);
 await page.getByRole('button',{name:'Select all',exact:true}).click();
 await expect(page.getByRole('button',{name:/^Remove /})).toHaveCount(names.length);
 await expect(page.getByRole('region',{name:'Season evolution evidence'}).getByRole('columnheader')).toHaveCount(names.length+1);
 await page.goBack();
 await expect(page.getByRole('button',{name:/^Remove /})).toHaveCount(1);
 await page.goto(`/?season=2021&view=compare&a=${names[0].id}&b=${names[1].id}`);
 await expect(page.getByRole('region',{name:'Six-category comparison summary'})).toBeVisible();
 const rendered=page.locator('.portrait-frame img');
 expect(await rendered.count()).toBeGreaterThan(0);
 for(const image of await rendered.all())await expect.poll(()=>image.evaluate((element:HTMLImageElement)=>element.complete&&element.naturalWidth>0)).toBe(true);
 expect(mediaRequests.every(path=>path.startsWith('/'+releaseRoot+'/media/'))).toBe(true);
 await page.getByText('Image credits',{exact:true}).click();
 await expect(page.locator('#image-credits')).toContainText('All 44 documented exceptions were accepted for this release.');
 expect(forbidden).toEqual([]);
});
