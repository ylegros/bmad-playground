import { test, expect } from '@playwright/test';
import { evidenceFixture } from '../app/shared/evidence.fixtures';
import { supportEntryV2, candidateSeasons } from '../app/shared/evidence';

test('ongoing evidence, full candidate status and failed refresh retain one generation',async({page})=>{
  const snapshot=evidenceFixture();
  const entry=supportEntryV2(snapshot);
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:candidateSeasons.map(season=>season===2026?entry:{season,verified:false,lastCheckedRound:0,knownGaps:['Audit not completed']})}}}));
  await page.route('**/api/v1/seasons/2026',route=>route.fulfill({json:{data:snapshot}}));
  await page.route('**/api/v1/seasons/2026/refresh',route=>route.fulfill({status:503,json:{error:{message:'Source temporarily unavailable'}}}));
  await page.goto('/?season=2026&view=progress&graphDrivers=a');
  await page.getByText('Season information \u00b7 2026',{exact:true}).click();
  const evidence=page.getByRole('region',{name:'Season evidence'});
  await expect(evidence).toContainText('Ongoing / Season to date');
  await expect(evidence).toContainText('Analyzed GP rounds (1): 1');
  await expect(evidence).toContainText('Current standings');
  await expect(page.getByRole('table').first()).toContainText('Not held');
  await page.getByText('Season coverage · 2010–2026',{exact:true}).click();
  await expect(page.getByText('2011: Unverified',{exact:false})).toBeVisible();
  const before=await evidence.textContent();
  await page.getByRole('button',{name:'Refresh data'}).click();
  await expect(page.getByRole('alert')).toContainText('Could not refresh');
  expect(await evidence.textContent()).toBe(before);
  // Official championship adjustment is preserved; awarded GP points were 25.5.
  await expect(page.getByRole('table').first()).toContainText('24.5');
});

test('zero completed GPs show explicit unavailable comparison state',async({page})=>{
  const snapshot=evidenceFixture();
  snapshot.analysisRounds=[];snapshot.results=[];snapshot.qualifying=[];snapshot.driverStandings=[];snapshot.constructorStandings=[];
  snapshot.audit.endpoints=snapshot.audit.endpoints.filter(entry=>!entry.sourceUrl.includes('Standings'));
  snapshot.schedule[0].gp='unavailable';snapshot.schedule[0].qualifying='unavailable';
  snapshot.schedule[0].sessions.gp.lifecycle='unheld';snapshot.schedule[0].sessions.qualifying.lifecycle='unheld';
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[supportEntryV2(snapshot)]}}}));
  await page.route('**/api/v1/seasons/2026',route=>route.fulfill({json:{data:snapshot}}));
  await page.goto('/?season=2026');
  await expect(page.getByRole('status').filter({hasText:'No completed GPs'})).toBeVisible();
  await page.getByText('Season information \u00b7 2026',{exact:true}).click();
  await expect(page.getByRole('region',{name:'Season evidence'})).toContainText('Drivers: Unavailable');
  await expect(page.getByText('No official standings available for this season.')).toBeVisible();
});

test('pre-GP qualifying stays visible without a comparison marker and cancelled rounds stay explicit',async({page})=>{
  const snapshot=evidenceFixture();
  snapshot.drivers.b={...snapshot.drivers.a,id:'b',name:'B'};
  snapshot.driverStandings.push({...snapshot.driverStandings[0],driverId:'b',position:{kind:'value',value:2},points:{kind:'value',value:0}});
  snapshot.schedule[1].qualifying='complete';snapshot.schedule[1].sessions.qualifying.lifecycle='held';
  snapshot.qualifying.push({round:2,driverId:'a',constructorId:'team',position:{kind:'value',value:1}},{round:2,driverId:'b',constructorId:'team',position:{kind:'value',value:2}});
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[supportEntryV2(snapshot)]}}}));
  await page.route('**/api/v1/seasons/2026',route=>route.fulfill({json:{data:snapshot}}));
  await page.goto('/?season=2026&view=compare&a=a&b=b&metric=qualifying');
  await page.getByText('Season information \u00b7 2026',{exact:true}).click();
  await expect(page.getByRole('region',{name:'Season evidence'})).toContainText('outside completed-GP comparisons');
  const future=page.getByRole('row').filter({has:page.getByRole('rowheader',{name:/GP 2/})});
  await expect(future.locator('td').nth(0)).toHaveText('1');
  await expect(future.locator('td').nth(1)).toHaveText('2');
  await expect(future.locator('.comparison-better')).toHaveCount(0);
  await page.getByRole('combobox',{name:'Compare measure'}).selectOption('gp');
  await expect(future).toContainText('Not held');
  snapshot.schedule[1].gp='unavailable';snapshot.schedule[1].qualifying='unavailable';
  snapshot.schedule[1].sessions.gp.lifecycle='cancelled';snapshot.schedule[1].sessions.qualifying.lifecycle='cancelled';
  snapshot.qualifying=snapshot.qualifying.filter(row=>row.round!==2);
  await page.reload();
  await expect(future).toContainText('Cancelled');
});


test('bottom disclosures retain independent expansion across surfaces and seasons, then reset on reload',async({page})=>{
  const ongoing=evidenceFixture();
  const complete=evidenceFixture(2021);complete.schedule=complete.schedule.slice(0,1);complete.coverage.checkedRounds=[1];complete.lifecycle='complete';complete.audit.completion=complete.audit.provenance;
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[supportEntryV2(ongoing),supportEntryV2(complete)]}}}));
  await page.route('**/api/v1/seasons/2026',route=>route.fulfill({json:{data:ongoing}}));
  await page.route('**/api/v1/seasons/2021',route=>route.fulfill({json:{data:complete}}));
  await page.goto('/?season=2026');
  const info=page.locator('.season-disclosure').nth(0),coverage=page.locator('.season-disclosure').nth(1);
  await expect(info.locator('summary')).toHaveText('Season information \u00b7 2026');
  await expect(info).not.toHaveAttribute('open');await expect(coverage).not.toHaveAttribute('open');
  const url=page.url(),historyLength=await page.evaluate(()=>history.length);
  await info.locator('summary').focus();await page.keyboard.press('Enter');
  await expect(info).toHaveAttribute('open','');await expect(info.locator('summary')).toBeFocused();
  await expect(coverage).not.toHaveAttribute('open');
  await coverage.locator('summary').focus();await page.keyboard.press('Space');
  await expect(coverage).toHaveAttribute('open','');await expect(coverage.locator('summary')).toBeFocused();
  expect(page.url()).toBe(url);expect(await page.evaluate(()=>history.length)).toBe(historyLength);
  for(const view of ['Progress','Compare','Standings']){
    await page.getByRole('link',{name:new RegExp(view)}).click();
    await expect(info).toHaveAttribute('open','');await expect(coverage).toHaveAttribute('open','');
    expect(await page.locator('.panel').last().evaluate(element=>!!(element.compareDocumentPosition(document.querySelector('.season-disclosure')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  }
  await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2021');
  await expect(info.locator('summary')).toHaveText('Season information \u00b7 2021');
  await expect(info).toContainText('Complete season');await expect(info).toContainText('Final standings');
  await expect(info).toHaveAttribute('open','');await expect(coverage).toHaveAttribute('open','');
  await info.locator('summary').click();await expect(info).not.toHaveAttribute('open');await expect(coverage).toHaveAttribute('open','');
  await page.goBack();
  await expect(page.getByRole('combobox',{name:'Season',exact:true})).toHaveValue('2026');
  await expect(info.locator('summary')).toHaveText('Season information \u00b7 2026');
  await expect(info).toContainText('Ongoing / Season to date');
  await expect(info).not.toHaveAttribute('open');await expect(coverage).toHaveAttribute('open','');
  await page.goBack();
  await expect(page.getByRole('heading',{level:1})).toHaveText('Driver comparison');
  await expect(info.locator('summary')).toHaveText('Season information \u00b7 2026');
  await expect(info).not.toHaveAttribute('open');await expect(coverage).toHaveAttribute('open','');
  // Toggles update ephemeral state without replacing the remaining Forward entries.
  const beforeToggleHistory=await page.evaluate(()=>history.length),beforeToggleUrl=page.url();
  await info.locator('summary').click();await coverage.locator('summary').click();
  await expect(info).toHaveAttribute('open','');await expect(coverage).not.toHaveAttribute('open');
  expect(page.url()).toBe(beforeToggleUrl);expect(await page.evaluate(()=>history.length)).toBe(beforeToggleHistory);
  await page.goForward();
  await expect(page.getByRole('heading',{level:1})).toHaveText('Championship standings');
  await expect(info).toContainText('Ongoing / Season to date');
  await expect(info).toHaveAttribute('open','');await expect(coverage).not.toHaveAttribute('open');
  await page.goForward();
  await expect(page.getByRole('combobox',{name:'Season',exact:true})).toHaveValue('2021');
  await expect(info.locator('summary')).toHaveText('Season information \u00b7 2021');
  await expect(info).toContainText('Complete season');await expect(info).toContainText('Final standings');
  await expect(info).toHaveAttribute('open','');await expect(coverage).not.toHaveAttribute('open');
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.reload();await expect(info).not.toHaveAttribute('open');await expect(coverage).not.toHaveAttribute('open');
});


test('an expanded disclosure never combines a loading season with the previous evidence',async({page})=>{
  const first=evidenceFixture(),next=evidenceFixture(2021);
  let deliverNext:()=>void=()=>{};
  const gate=new Promise<void>(resolve=>{deliverNext=resolve;});
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[supportEntryV2(first),supportEntryV2(next)]}}}));
  await page.route('**/api/v1/seasons/2026',route=>route.fulfill({json:{data:first}}));
  await page.route('**/api/v1/seasons/2021',async route=>{await gate;await route.fulfill({json:{data:next}});});
  await page.goto('/?season=2026');
  const info=page.locator('.season-disclosure').first();
  await expect(info.locator('summary')).toContainText('2026');
  await info.locator('summary').click();await expect(info).toContainText('Audited');
  await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2021');
  await expect(info.locator('summary')).toContainText('2021');
  await expect(info).toContainText('Loading season 2021');await expect(info).not.toContainText('Audited');
  await expect(info).not.toContainText('Ongoing / Season to date');
  deliverNext();await expect(info).toContainText('Audited');await expect(info).toHaveAttribute('open','');
});
