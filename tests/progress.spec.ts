import {test,expect,type Page} from '@playwright/test';
import {seasonFixture} from './fixtures';
async function mock(page:Page){
 await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[2010,2021].map(season=>({season,verified:true,lastCheckedRound:2,knownGaps:[]}))}}}));
 await page.route(/\/api\/v1\/seasons\/(2010|2021)$/,route=>route.fulfill({json:{data:seasonFixture(Number(route.request().url().split('/').pop()))}}));
}
test('multi-select state, metric, category, season and Back remain compatible',async({page})=>{
 await mock(page);await page.goto('/?view=progress&entity=alpha');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 await page.getByRole('checkbox',{name:'Blair Example',exact:true}).first().check();
 const evidence=page.getByRole('table',{name:/matching graph evidence/});
 await expect(evidence).toContainText('Alex Example');await expect(evidence).toContainText('Blair Example');
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('gp');
 await expect(evidence).toContainText('Engine');
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('constructors');
 await expect(page.getByRole('combobox',{name:'Progress metric'})).toHaveValue('cumulative');
 await expect(page.getByText('Choose at least one team',{exact:false})).toBeVisible();
 await page.getByRole('checkbox',{name:'First Racing',exact:true}).check();
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('drivers');
 await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true}).first()).toBeChecked();
 await expect(page.getByRole('combobox',{name:'Progress metric'})).toHaveValue('gp');
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true}).first()).not.toBeChecked();
 await expect(evidence).toHaveCount(0);
 await expect(page).not.toHaveURL(/graphDrivers|graphConstructors|entity=/);
 await page.goBack();await expect(evidence).toBeVisible();
 await page.reload();await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true}).first()).toBeChecked();
});
test('inspection keys and pointer share matching round evidence and mobile plot scrolls',async({page})=>{
 await mock(page);await page.goto('/?view=progress&graphDrivers=alpha,beta&graphMetric=gp');
 const control=page.getByRole('slider',{name:'Inspect round'}),details=page.getByLabel('Round details');
 await control.focus();await page.keyboard.press('End');await expect(control).toHaveAttribute('aria-valuenow','2');await expect(details).toContainText('Engine');
 await expect(page.locator('.evolution-chart [aria-live=polite]')).toContainText('Alex Example: 1');
 await expect(page.locator('.evolution-chart [aria-live=polite]')).toContainText('Blair Example: R');
 await expect(page.locator('.evolution-chart [aria-live=polite]')).toContainText('Engine');
 await page.keyboard.press('ArrowRight');await expect(control).toHaveAttribute('aria-valuenow','2');
 await page.keyboard.press('ArrowLeft');await expect(control).toHaveAttribute('aria-valuenow','1');
 await page.keyboard.press('ArrowLeft');await expect(control).toHaveAttribute('aria-valuenow','1');
 await page.keyboard.press('ArrowRight');await expect(control).toHaveAttribute('aria-valuenow','2');
 await page.keyboard.press('Home');await expect(control).toHaveAttribute('aria-valuenow','1');
 const chart=page.getByRole('img',{name:/GP result/});const box=(await chart.boundingBox())!;
 await page.mouse.move(box.x+box.width-35,box.y+90);await expect(control).toHaveAttribute('aria-valuenow','2');await expect(details).toContainText('Engine');
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('qualifying');
 await expect(details).toContainText('20');await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText('Unavailable');
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.chart-scroll').evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true);
 await control.focus();await expect(control).toBeFocused();
});
test('more than six series retain distinct line identities after deselection and metric changes',async({page})=>{
 await mock(page);
 const data=seasonFixture();
 for(let i=0;i<8;i++){const id=`extra${i}`;data.drivers[id]={id,name:`Extra ${i}`,code:`X${i}`,nationality:'Test'};data.driverStandings.push({round:1,driverId:id,constructorIds:['first'],position:{kind:'value',value:i+1},points:{kind:'value',value:i}});}
 await page.route('**/api/v1/seasons/2021',route=>route.fulfill({json:{data}}));
 const ids=['alpha',...Object.keys(data.drivers).filter(id=>id.startsWith('extra'))];
 await page.goto(`/?view=progress&graphDrivers=${ids.join(',')}`);
 const paths=page.locator('.evolution-chart .series-lines > path');
 await expect(paths).toHaveCount(9);
 const styles=await paths.evaluateAll(elements=>elements.map(element=>`${element.getAttribute('stroke')}/${element.getAttribute('stroke-dasharray')}`));
 expect(new Set(styles).size).toBe(9);
 const previous=await page.getByTestId('series-extra5').getAttribute('stroke-dasharray');
 await page.getByRole('button',{name:'Remove Alex Example',exact:true}).click();
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('rank');
 await expect(page.getByTestId('series-extra5')).toHaveAttribute('stroke-dasharray',previous!);
});
test('rendered points rise upward and rank one stays above larger ranks',async({page})=>{
 await mock(page);await page.goto('/?view=progress&graphDrivers=alpha,beta');
 const ys=async(id:string)=>page.locator(`[data-series="${id}"] circle`).evaluateAll(elements=>elements.map(element=>Number(element.getAttribute('cy'))));
 await expect(page.getByTestId('series-alpha')).toBeVisible();
 const points=await ys('alpha');expect(points[1]).toBeLessThan(points[0]);
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('rank');
 const alpha=await ys('alpha'),beta=await ys('beta');expect(alpha[0]).toBeLessThan(beta[0]);expect(beta[0]).toBeLessThan(beta[1]);
});
test('explicit year changes clear every selection while history restores prior choices',async({page})=>{
 await mock(page);
 await page.goto('/?view=progress&season=2021&graphDrivers=alpha,beta&graphConstructors=first&entity=alpha&a=alpha&b=gamma');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 const before=await page.evaluate(()=>history.length);
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).not.toBeChecked();
 await expect(page).not.toHaveURL(/graphDrivers|graphConstructors|entity=|[?&][ab]=/);
 expect(await page.evaluate(()=>history.length)).toBe(before+1);
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2021');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).not.toBeChecked();
 await page.goBack();await page.goBack();
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 await expect(page).toHaveURL(/graphConstructors=first/);
 await page.getByRole('link',{name:/Compare/}).click();
 await expect(page.getByRole('combobox',{name:'Driver A',exact:true})).toHaveValue('alpha');
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await expect(page.getByRole('combobox',{name:'Driver A',exact:true})).toHaveValue('');
 await expect(page.getByRole('combobox',{name:'Driver B',exact:true})).toHaveValue('');
 await page.getByRole('combobox',{name:'Driver A',exact:true}).selectOption('alpha');
 await expect(page.getByRole('combobox',{name:'Driver B',exact:true})).toHaveValue('gamma');
});

test('Select all unions matches, keeps nonmatches and adds history only for effective actions',async({page})=>{
 await mock(page);await page.goto('/?view=progress&graphDrivers=beta');
 const search=page.getByRole('searchbox',{name:'Search drivers'}),all=page.getByRole('button',{name:'Select all',exact:true});
 const historyLength=()=>page.evaluate(()=>history.length);
 await search.fill('ALEX');const before=await historyLength();
 await all.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText('Blair Example');
 await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText('Alex Example');
 await expect(all).toBeFocused();expect(await historyLength()).toBe(before+1);
 await expect(page).toHaveURL(/graphDrivers=alpha%2Cbeta/);
 await all.click();expect(await historyLength()).toBe(before+1);
 await expect(page.locator('.entity-picker [aria-live=polite]')).toContainText('Selection unchanged. 1 matches. 2 selected.');
 await search.fill('NO MATCH');await all.click();expect(await historyLength()).toBe(before+1);
 await expect(page.locator('.entity-picker [aria-live=polite]')).toContainText('No matches. Selection unchanged.');
 await page.getByRole('button',{name:'Clear selection',exact:true}).click();
 await expect(page).not.toHaveURL(/graphDrivers|entity=/);expect(await historyLength()).toBe(before+2);
 await page.getByRole('button',{name:'Clear selection',exact:true}).click();expect(await historyLength()).toBe(before+2);
 await page.goBack();await expect(page.getByRole('button',{name:'Remove Alex Example',exact:true})).toBeVisible();
 await page.goForward();await expect(page.getByText('Choose at least one driver',{exact:false})).toBeVisible();
});

test('explicit empty graph overrides legacy; full constructor selection stays isolated',async({page})=>{
 await mock(page);await page.goto('/?view=progress&entity=alpha&graphDrivers=&graphConstructors=first');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).not.toBeChecked();
 await page.getByRole('button',{name:'Select all',exact:true}).click();
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('constructors');
 await page.getByRole('button',{name:'Select all',exact:true}).click();
 const count=Object.keys(seasonFixture().constructors).length;
 await expect(page.locator('.evolution-chart [data-series]')).toHaveCount(count);
 await page.getByRole('button',{name:'Clear selection',exact:true}).click();
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('drivers');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 await page.reload();await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
});

test('full field remains inspectable with local scrolling at narrow and doubled text size',async({page})=>{
 await mock(page);const data=seasonFixture();
 for(let i=0;i<32;i++){const id=`field${i}`;data.drivers[id]={id,name:`Field driver ${i} long readable name`,code:`F${i}`,nationality:'Test'};}
 await page.route('**/api/v1/seasons/2021',route=>route.fulfill({json:{data}}));
 await page.setViewportSize({width:390,height:844});await page.goto('/?view=progress');
 await page.getByRole('button',{name:'Select all',exact:true}).click();
 await expect(page.locator('.evolution-chart [data-series]')).toHaveCount(Object.keys(data.drivers).length);
 await expect(page.getByRole('columnheader',{name:'Field driver 31 long readable name',exact:true})).toHaveCount(1);
 await page.getByRole('searchbox',{name:'Search drivers'}).fill('no such match');
 await expect(page.locator('.evolution-chart [data-series]')).toHaveCount(Object.keys(data.drivers).length);
 await page.addStyleTag({content:'html{font-size:200%}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const chartRegion=page.getByRole('region',{name:'Season evolution chart',exact:true});await chartRegion.focus();await expect(chartRegion).toBeFocused();
 const slider=page.getByRole('slider',{name:'Inspect round'});await slider.focus();await page.keyboard.press('End');
 await expect(page.getByLabel('Round details')).toContainText('Field driver 31 long readable name');
 await page.getByRole('button',{name:'Remove Field driver 31 long readable name',exact:true}).click();
 await page.goBack();await expect(page.getByRole('button',{name:'Remove Field driver 31 long readable name',exact:true})).toBeVisible();
});

test('refresh failure retains source and selection; replacement removes only invalid IDs',async({page})=>{
 await mock(page);let reject=true;
 const replacement=seasonFixture();delete replacement.drivers.beta;
 replacement.results=replacement.results.filter(row=>row.driverId!=='beta');replacement.qualifying=replacement.qualifying.filter(row=>row.driverId!=='beta');replacement.driverStandings=replacement.driverStandings.filter(row=>row.driverId!=='beta');
 replacement.refreshedAt='2026-10-29T10:00:00Z';replacement.snapshotId='replacement-progress-test';
 await page.route('**/api/v1/seasons/2021/refresh',route=>reject?route.fulfill({status:503,json:{error:{code:'UPSTREAM',message:'Temporary fixture failure'}}}):route.fulfill({json:{data:replacement}}));
 await page.goto('/?view=progress&graphDrivers=alpha,beta');await expect(page.getByRole('button',{name:'Remove Blair Example',exact:true})).toBeVisible();
 const timestamp=await page.locator('.snapshot-meta').textContent();
 await page.getByRole('button',{name:'Refresh data',exact:false}).click();
 await expect(page.getByRole('alert')).toContainText('Could not refresh');
 await expect(page.getByRole('button',{name:'Remove Blair Example',exact:true})).toBeVisible();await expect(page.locator('.snapshot-meta')).toHaveText(timestamp!);
 reject=false;await page.getByRole('button',{name:'Refresh data',exact:false}).click();
 await expect(page.getByRole('button',{name:'Remove Blair Example',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Remove Alex Example',exact:true})).toBeVisible();
 await expect(page).toHaveURL(/graphDrivers=alpha(?:&|$)/);await expect(page.getByRole('status').filter({hasText:'Some previous graph selections'})).toContainText('beta');
});

test('delayed old-season response cannot replace the active season selection context',async({page})=>{
 await mock(page);let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);
 await page.route('**/api/v1/seasons/2010',async route=>{await gate;await route.fulfill({json:{data:seasonFixture(2010)}});});
 await page.goto('/?view=progress&graphDrivers=alpha');await expect(page.getByRole('button',{name:'Select all',exact:true})).toBeVisible();
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2021');
 await page.getByRole('button',{name:'Select all',exact:true}).click();release();
 await expect(page).toHaveURL(/season=2021/);await expect(page).toHaveURL(/graphDrivers=alpha%2Cbeta%2Cgamma/);
 await expect(page.locator('.snapshot-meta')).toContainText('2 rounds checked');await expect(page.getByRole('table',{name:/matching graph evidence/})).toHaveCount(1);
});

test('numeric point labels follow metric values while evidence retains statuses and gaps',async({page})=>{
 await mock(page);await page.goto('/?view=progress&graphDrivers=alpha,beta&graphMetric=qualifying');
 await expect(page.locator('[data-series="alpha"] .point-value')).toHaveText(['1','1']);
 await expect(page.locator('[data-series="beta"] .point-value')).toHaveText(['20']);
 await expect(page.locator('.series-legend svg text')).toHaveCount(0);
 await expect(page.locator('.series-legend')).toContainText('Blair Example');
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('gp');
 await expect(page.locator('[data-series="beta"] .point-value')).toHaveText(['2','20']);
 await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText('Engine');
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('gpPoints');
 await expect(page.locator('[data-series="beta"] .point-value')).toHaveText(['18','0']);
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('constructors');
 await page.getByRole('checkbox',{name:'Second Racing',exact:true}).check();
 await expect(page.locator('[data-series="second"] .point-value')).toHaveText(['0']);
});

test('coincident complete fractional negative labels stay separated and locally scrollable',async({page})=>{
 await mock(page);const data=seasonFixture(),numeric=-123456789.12345679;
 for(let i=0;i<28;i++){
  const id=`coincident${i}`;data.drivers[id]={id,name:`Coincident driver ${i}`,code:`C${i}`,nationality:'Test'};
  for(const round of [1,2]) data.driverStandings.push({round,driverId:id,constructorIds:['first'],position:{kind:'value',value:i+1},points:{kind:'value',value:numeric}});
 }
 await page.route('**/api/v1/seasons/2021',route=>route.fulfill({json:{data}}));
 await page.setViewportSize({width:390,height:844});
 await page.goto(`/?view=progress&graphDrivers=${Object.keys(data.drivers).filter(id=>id.startsWith('coincident')).join(',')}`);
 await expect(page.locator('.point-value')).toHaveCount(56);
 await expect(page.locator('.point-value').first()).toHaveText(String(numeric));
 await page.addStyleTag({content:'html{zoom:2}'});
 const bounds=await page.locator('.point-value').evaluateAll(elements=>elements.map(element=>{
  const text=element as SVGTextElement,box=text.getBBox(),svg=text.ownerSVGElement!;
  return {round:element.parentElement!.getAttribute('data-round'),x:box.x,y:box.y,width:box.width,height:box.height,chartWidth:svg.viewBox.baseVal.width,chartHeight:svg.viewBox.baseVal.height};
 }));
 for(const box of bounds){expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(box.chartWidth);expect(box.y+box.height).toBeLessThanOrEqual(box.chartHeight);}
 for(const round of ['1','2']){
  const labels=bounds.filter(box=>box.round===round).sort((a,b)=>a.y-b.y);
  for(let i=1;i<labels.length;i++)expect(labels[i].y).toBeGreaterThanOrEqual(labels[i-1].y+labels[i-1].height);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.chart-scroll').evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true);
 const slider=page.getByRole('slider',{name:'Inspect round'});await slider.focus();await page.keyboard.press('End');
 await expect(slider).toHaveAttribute('aria-valuenow','2');
 await expect(page.getByLabel('Round details')).toContainText(String(numeric));
 const markerIsInChart=()=>page.locator('.inspection-marker').evaluate(element=>{
  const marker=element.getBoundingClientRect(),container=element.closest('.chart-scroll')!.getBoundingClientRect();
  return marker.x>=container.left&&marker.x<=container.right;
 });
 expect(await markerIsInChart()).toBe(true);
 await page.keyboard.press('Home');await expect(slider).toHaveAttribute('aria-valuenow','1');
 expect(await markerIsInChart()).toBe(true);
 const ticks=await page.locator('.value-axis-tick').evaluateAll(elements=>elements.map(element=>(element as SVGTextElement).getBBox().x));
 expect(ticks.every(x=>x>=0)).toBe(true);
 expect(await page.locator('.chart-round-axis').evaluate(element=>{
  const axis=element.getBoundingClientRect(),container=element.closest('.chart-scroll')!.getBoundingClientRect();
  return axis.top>=container.top&&axis.bottom<=container.bottom;
 })).toBe(true);
});

test('grouped wrapping options share driver selection and guidance precedes controls',async({page})=>{
 await mock(page);await page.setViewportSize({width:390,height:844});
 await page.goto('/?view=progress');
 const groups=page.locator('.driver-option-group');
 await expect(groups).toHaveCount(2);
 const beta=page.getByRole('checkbox',{name:'Blair Example',exact:true});
 await expect(beta).toHaveCount(2);await beta.nth(1).check();
 await expect(beta.nth(0)).toBeChecked();
 await expect(page.getByRole('button',{name:'Remove Blair Example',exact:true})).toHaveCount(1);
 await expect(page.locator('.selection-count')).toHaveText('3 matches / 1 selected');
 const order=await page.evaluate(()=>{const heading=document.querySelector('.selection-heading')!;return !!(heading.compareDocumentPosition(document.querySelector('.progress-controls')!)&Node.DOCUMENT_POSITION_FOLLOWING);});
 expect(order).toBe(true);
 await page.getByRole('searchbox',{name:'Search drivers'}).fill('Alex');
 await page.getByRole('button',{name:'Select all',exact:true}).click();
 await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText('Blair Example');
 await page.addStyleTag({content:'html{zoom:2}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('checkbox',{name:'Alex Example',exact:true}).focus();
 await page.keyboard.press('Space');await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).not.toBeChecked();
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('constructors');
 await expect(page.getByText('Choose at least one team to explore season evolution.',{exact:true})).toBeVisible();
 await expect(page.locator('.entity-options > .inline-options')).toHaveCount(1);
});
