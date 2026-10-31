import { test, expect, type Page } from '@playwright/test';
import { seasonFixture } from './fixtures';
import type { SeasonSnapshot, SeasonSnapshotV2 } from '../app/shared/contracts';
import { evidenceFixture } from '../app/shared/evidence.fixtures';
import { supportForSnapshot } from '../app/shared/versioned';

async function mock(page:Page, snapshot=seasonFixture()) {
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[supportForSnapshot(snapshot)]}}}));
  await page.route(`**/api/v1/seasons/${snapshot.season}`,route=>route.fulfill({json:{data:snapshot}}));
}
function auditedComparisonFixture():SeasonSnapshotV2 {
  const base=seasonFixture(), evidence=evidenceFixture(base.season);
  const held={...evidence.schedule[0].sessions.gp};
  return {...base,schemaVersion:2,lifecycle:'ongoing',analysisRounds:[1,2],audit:{...evidence.audit,endpoints:[...evidence.audit.endpoints,...['driverStandings','constructorStandings'].map(kind=>({sourceUrl:`https://example.org/ergast/f1/${base.season}/2/${kind}.json?limit=100`,expectedPages:1,fetchedPages:1}))]},schedule:base.schedule.map(round=>({...round,sessions:{gp:{...held},qualifying:{...held},sprint:round.sprint==='not-applicable'?{...held,lifecycle:'unheld',applicable:false}:{...held}}}))};
}
function portraitFixture():SeasonSnapshot {
  const s=seasonFixture(); const ids:Record<string,string>={alpha:'leclerc',beta:'russell',gamma:'gamma'};
  s.drivers=Object.fromEntries(Object.values(s.drivers).map(driver=>[ids[driver.id],{...driver,id:ids[driver.id],name:driver.id==='alpha'?'Charles Leclerc':driver.id==='beta'?'George Russell':driver.name}]));
  s.results=s.results.map(row=>({...row,driverId:ids[row.driverId]}));s.qualifying=s.qualifying.map(row=>({...row,driverId:ids[row.driverId]}));s.driverStandings=s.driverStandings.map(row=>({...row,driverId:ids[row.driverId]}));
  return s;
}
test('six-category verdict exposes complete evidence and pair-relative highlights',async({page})=>{
  await mock(page);await page.goto('/?view=compare&a=alpha&b=beta');
  const summary=page.getByRole('region',{name:'Six-category comparison summary'});
  await expect(summary.locator('.summary-metric')).toHaveCount(6);
  await expect(summary).toContainText('Each category has equal weight.');
  await expect(summary).toContainText('5 comparable of 6');
  await expect(summary.getByRole('heading',{name:'Best GP qualifying rank',exact:true})).toBeVisible();
  await expect(summary).toContainText('qualifying records');
  await expect(summary.locator('.better-label').first()).toContainText('Alex Example, GP race head-to-head, higher is better');
  expect(await summary.locator('.better-label').first().evaluate(element=>{const clone=element.cloneNode(true) as HTMLElement;clone.querySelectorAll('.sr-only').forEach(node=>node.remove());return clone.textContent;})).toBe('\u2713');
  await summary.getByText('Evidence and availability · GP qualifying head-to-head',{exact:true}).click();
  await expect(summary).toContainText('Eligible rounds (1): 2 Sprint Grand Prix');
  await expect(summary).toContainText('Excluded rounds (1): 1 Opening Grand Prix');
  await page.getByRole('combobox',{name:'Compare measure',exact:true}).selectOption('gp');
  const row=page.getByRole('row').filter({hasText:'Sprint Grand Prix'});
  await expect(row.locator('td').first()).toHaveClass(/comparison-better/);
  await expect(row.locator('td').first().locator('.sr-only')).toHaveText('Alex Example, GP race result, lower is better');
  expect(await row.locator('td').first().locator('.better-label').evaluate(element=>{const clone=element.cloneNode(true) as HTMLElement;clone.querySelectorAll('.sr-only').forEach(node=>node.remove());return clone.textContent;})).toBe('\u2713');
  await expect(row.locator('td').last()).toContainText('R · Engine');
  await expect(row.locator('td').last().locator('.better-label')).toHaveCount(0);
  await page.getByRole('combobox',{name:'Driver B',exact:true}).selectOption('alpha');
  await expect(summary).toHaveCount(0);await expect(page.getByRole('table')).toHaveCount(0);
});
test('no comparable categories says insufficient data; ties receive no markers',async({page})=>{
  const data=auditedComparisonFixture();data.results=[];data.qualifying=[];
  data.schedule=data.schedule.map(round=>({...round,gp:'unavailable',qualifying:'unavailable',sprint:round.sprint==='not-applicable'?'not-applicable':'unavailable'}));
  data.coverage.gaps=data.schedule.flatMap(round=>['gp','qualifying',...(round.sprint==='not-applicable'?[]:['sprint'])].map(kind=>`Round ${round.round}: ${kind} authoritative records unavailable`));
  data.driverStandings=data.driverStandings.map(row=>({...row,points:{kind:'unavailable',reason:'Official points unavailable'}}));
  await mock(page,data);await page.goto('/?view=compare&a=alpha&b=beta');
  await expect(page.getByRole('heading',{name:'Insufficient data',exact:true})).toBeVisible();
  await expect(page.locator('.comparison-bar')).toHaveCount(0);
  await expect(page.locator('.comparison-better')).toHaveCount(0);
});
test('portraits stay local, credits disclose dates, image errors preserve named frames',async({page})=>{
  const external:string[]=[];page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1'))external.push(request.url());});
  await mock(page,portraitFixture());await page.goto('/?view=compare&a=leclerc&b=russell');
  await expect(page.locator('.portrait-frame img')).toHaveCount(2);
  await expect(page.locator('.portrait-frame img').first()).toHaveJSProperty('complete',true);
  await page.getByRole('link',{name:'Image details',exact:true}).first().click();
  await expect(page.locator('#image-credits')).toHaveAttribute('open','');
  await expect(page.locator('#image-credits>summary')).toBeFocused();
  await expect(page.locator('#image-credits')).toContainText('Gil Zetbase');
  await expect(page.locator('#image-credits')).toContainText('CC BY-SA 4.0');
  await expect(page.locator('#image-credits')).toContainText('2020-04-23');
  await expect(page.getByText('Portrait from 2020; selected season 2021.',{exact:false})).toBeVisible();
  await page.route('**/media/leclerc.jpg',route=>route.abort());
  await page.reload();
  await expect(page.locator('.summary-identity.driver-a .portrait-frame')).toHaveAttribute('data-fallback','true');
  await expect(page.locator('.summary-identity.driver-a')).toContainText('Charles Leclerc');
  await expect(page.locator('.summary-identity.driver-a .portrait-frame img')).toHaveCount(0);
  expect(external).toEqual([]);
});
test('comparison reflows at mobile and 200 percent zoom without page overflow',async({page})=>{
  await mock(page);await page.setViewportSize({width:390,height:844});await page.goto('/?view=compare&a=alpha&b=beta');
  await expect(page.getByRole('region',{name:'Six-category comparison summary'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>{document.documentElement.style.zoom='2';});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByText('Image credits',{exact:true}).focus();
  await expect(page.locator('#image-credits>summary')).toBeFocused();
});

test('qualifying summary ranks, ties and missing coverage keep markers consistent',async({page})=>{
  const data=auditedComparisonFixture();
  data.qualifying.push({round:1,driverId:'beta',constructorId:'first',position:{kind:'value',value:3}});
  data.qualifying.forEach(row=>{row.position={kind:'value',value:row.driverId==='alpha'?2:3};});
  Object.assign(data.results[0],{grid:7});
  await mock(page,data);await page.goto('/?view=compare&a=alpha&b=beta&metric=qualifying');
  const best=page.getByRole('article',{name:'Best GP qualifying rank',exact:true});
  await expect(best.locator('.summary-value').first().locator('strong')).toHaveText('2');
  await expect(best.locator('.is-better')).toHaveCount(1);
  await expect(best.locator('.sr-only')).toHaveText('Alex Example, Best GP qualifying rank, lower is better');
  await best.locator('summary').click();
  await expect(best).toContainText('Sample sizes: Alex Example 2; Blair Example 2. Analysis-window GPs: 2.');
  data.qualifying.forEach(row=>{row.position={kind:'value',value:2};});
  await page.goto('/?view=compare&a=alpha&b=beta&metric=qualifying', {waitUntil:'domcontentloaded'});await expect(best).toContainText('Tied');
  await expect(best.locator('.better-label')).toHaveCount(0);await expect(best.locator('.is-better')).toHaveCount(0);
  await expect(page.locator('.comparison-better')).toHaveCount(0);
  data.schedule[0].qualifying='unavailable';data.coverage.gaps=['Round 1: qualifying authoritative records unavailable'];
  data.qualifying=data.qualifying.filter(row=>row.round!==1);
  await page.goto('/?view=compare&a=alpha&b=beta&metric=qualifying', {waitUntil:'domcontentloaded'});await expect(best).toContainText('cover 1 of 2 analysis-window GPs');
  await expect(best.locator('.better-label')).toHaveCount(0);
});
