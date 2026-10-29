import {test,expect,type Page} from '@playwright/test';
import {seasonFixture} from './fixtures';
async function mock(page:Page){
 await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[2010,2021].map(season=>({season,verified:true,lastCheckedRound:2,knownGaps:[]}))}}}));
 await page.route(/\/api\/v1\/seasons\/(2010|2021)$/,route=>route.fulfill({json:{data:seasonFixture(Number(route.request().url().split('/').pop()))}}));
}
test('multi-select state, metric, category, season and Back remain compatible',async({page})=>{
 await mock(page);await page.goto('/?view=progress&entity=alpha');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 await page.getByRole('checkbox',{name:'Blair Example',exact:true}).check();
 const evidence=page.getByRole('table',{name:/matching graph evidence/});
 await expect(evidence).toContainText('Alex Example');await expect(evidence).toContainText('Blair Example');
 await page.getByRole('combobox',{name:'Progress metric'}).selectOption('gp');
 await expect(evidence).toContainText('Engine');
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('constructors');
 await expect(page.getByRole('combobox',{name:'Progress metric'})).toHaveValue('cumulative');
 await expect(page.getByText('Choose at least one constructor',{exact:false})).toBeVisible();
 await page.getByRole('checkbox',{name:'First Racing',exact:true}).check();
 await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('drivers');
 await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true})).toBeChecked();
 await expect(page.getByRole('combobox',{name:'Progress metric'})).toHaveValue('gp');
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true})).toBeChecked();
 await page.getByRole('button',{name:'Clear selection',exact:true}).click();
 await expect(page.getByText('Choose at least one driver',{exact:false})).toBeVisible();
 await page.goBack();await expect(evidence).toBeVisible();
 await page.reload();await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true})).toBeChecked();
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
 const paths=page.locator('.evolution-chart [data-series] > path');
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
test('season changes explain unavailable graph IDs while retaining compatible selections',async({page})=>{
 await mock(page);const data=seasonFixture(2010);delete data.drivers.beta;
 data.results=data.results.filter(row=>row.driverId!=='beta');
 data.qualifying=data.qualifying.filter(row=>row.driverId!=='beta');
 data.driverStandings=data.driverStandings.filter(row=>row.driverId!=='beta');
 await page.route('**/api/v1/seasons/2010',route=>route.fulfill({json:{data}}));
 await page.goto('/?view=progress&graphDrivers=alpha,beta');
 await expect(page.getByRole('checkbox',{name:'Blair Example',exact:true})).toBeChecked();
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await expect(page.getByRole('status').filter({hasText:'Some previous graph selections'})).toContainText('beta');
 await expect(page.getByRole('checkbox',{name:'Alex Example',exact:true})).toBeChecked();
 await expect(page.getByRole('table',{name:/matching graph evidence/})).toContainText('Alex Example');
 await expect(page.getByRole('table',{name:/matching graph evidence/})).not.toContainText('Blair Example');
});
