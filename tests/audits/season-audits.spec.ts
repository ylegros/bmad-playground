import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { SeasonSnapshotV2 } from '../../app/shared/contracts';

const years=(process.env.AUDIT_YEARS??'2010,2021').split(',').map(Number);
for(const year of years)test(`${year} real audited snapshot supports standings, progress and comparison`,async({page})=>{
  const snapshot:SeasonSnapshotV2=JSON.parse(readFileSync(`.cache/seasons-v2/${year}.json`,'utf8')).snapshot;
  const external:string[]=[];
  await page.route('**/*',route=>{
    if(new URL(route.request().url()).origin!=='http://127.0.0.1:3002'){external.push(route.request().url());return route.abort();}
    return route.continue();
  });
  await page.goto(`/?season=${year}`);
  const evidence=page.getByRole('region',{name:'Season evidence'});
  await expect(evidence).toContainText(snapshot.lifecycle==='ongoing'?'Ongoing / Season to date':'Complete season');
  await expect(evidence).toContainText(`Analyzed GP rounds (${snapshot.analysisRounds.length}): ${snapshot.analysisRounds.join(', ')}`);
  const officialRound=Math.max(...snapshot.driverStandings.map(row=>row.round));
  const leader=snapshot.driverStandings.find(row=>row.round===officialRound&&row.position.kind==='value'&&row.position.value===1)!;
  const row=page.getByRole('row').filter({has:page.getByRole('rowheader',{name:snapshot.drivers[leader.driverId].name,exact:true})});
  await expect(row).toContainText(leader.points.kind==='value'?String(leader.points.value):'Unavailable');
  if(year===2010)await expect(row).toContainText('256');
  if(year===2021)await expect(row).toContainText('395.5');

  await page.getByRole('link',{name:'02 Progress'}).click();
  await page.getByRole('button',{name:'Select all',exact:true}).click();
  const selected=page.locator('.selected-entities button[aria-label^="Remove "]');
  await expect(selected).toHaveCount(Object.keys(snapshot.drivers).length);
  await expect(page.getByRole('table').first().locator('tbody tr')).toHaveCount(snapshot.schedule.length);
  const inspect=page.getByRole('slider',{name:'Inspect round'});await inspect.focus();await page.keyboard.press('End');
  await expect(inspect).toHaveAttribute('aria-valuenow',String(snapshot.schedule.length));

  const pair=snapshot.driverStandings.filter(row=>row.round===officialRound).slice(0,2).map(row=>row.driverId);
  await page.goto(`/?season=${year}&view=compare&a=${pair[0]}&b=${pair[1]}`);
  await expect(page.locator('.summary-metric')).toHaveCount(6);
  await expect(page.locator('.comparison-summary')).toContainText(snapshot.drivers[pair[0]].name);
  for(const [layout,width,zoom] of [['desktop',1280,1],['narrow',390,1],['zoom',1280,2]] as const){
    await page.setViewportSize({width,height:1000});await page.evaluate(z=>{document.documentElement.style.zoom=String(z)},zoom);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.locator('.comparison-summary').screenshot({path:`.site-artifacts/iteration-three/data-${year}-${layout}.png`});
  }
  expect(external).toEqual([]);
});
