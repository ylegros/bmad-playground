import { test, expect, type Page } from '@playwright/test';
import { seasonFixture } from './fixtures';

async function mockSeasons(page: Page) {
  await page.route('**/api/v1/seasons', route => route.fulfill({json:{data:{seasons:[2010,2021].map(season=>({season,verified:true,lastCheckedRound:2,knownGaps:[]}))}}}));
  await page.route(/\/api\/v1\/seasons\/(2010|2021)$/, route => route.fulfill({json:{data:seasonFixture(Number(route.request().url().split('/').pop()))}}));
}

test('standings, both progress categories, teammate comparison and Back', async ({page}) => {
  await mockSeasons(page);
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Championship standings'})).toBeVisible();
  await expect(page.getByRole('combobox',{name:'Season',exact:true})).toHaveValue('2021');
  await page.getByRole('button',{name:'View progress for Alex Example',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Season progress',exact:true})).toBeFocused();
  await expect(page.getByRole('table')).toContainText('GP qualifying');
  await expect(page.getByRole('table')).toContainText('Not applicable');
  await expect(page.getByRole('table')).toContainText('Championship adjustment');
  await page.goBack();
  await expect(page.getByRole('heading',{name:'Championship standings'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Championship standings',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Compare Alex Example',exact:true}).click();
  await expect(page.getByRole('combobox',{name:'Driver B',exact:true})).toHaveValue('gamma');
  await expect(page.getByText('Initial teammate: Blair Example.',{exact:false})).toBeVisible();
  await page.getByRole('link',{name:'Standings'}).click();
  await expect(page.getByText('Initial teammate of Alex Example',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Constructors',exact:true}).click();
  await page.getByRole('button',{name:'View progress for First Racing',exact:true}).click();
  await expect(page.getByRole('table')).toContainText('Championship pos');
  await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
  await expect(page.getByText('Choose your focus',{exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Season progress'})).toBeVisible();
});

test('arbitrary comparison preserves missing versus zero and nonfinish status', async ({page}) => {
  await mockSeasons(page);
  await page.goto('/?view=compare&a=beta&b=gamma');
  await page.getByRole('combobox',{name:'Compare measure',exact:true}).selectOption('gp');
  await expect(page.getByRole('table')).toContainText('R · Engine');
  await expect(page.getByRole('table')).toContainText('Unavailable');
  await page.getByRole('combobox',{name:'Compare measure',exact:true}).selectOption('points');
  const row=page.getByRole('row').filter({hasText:'Sprint Grand Prix'});
  await expect(row).toContainText('Unavailable');
  await page.getByRole('combobox',{name:'Driver B',exact:true}).selectOption('beta');
  await expect(page.getByText('Choose a different driver for the second selection.')).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
});

test('failed refresh retains snapshot, timestamp and selections; retry replaces all', async ({page}) => {
  await mockSeasons(page);
  let fail=true;
  await page.route('**/api/v1/seasons/2021/refresh', route => {
    if(fail) return route.fulfill({status:503,json:{error:{code:'UPSTREAM_NETWORK',message:'Synthetic network failure'}}});
    const data=seasonFixture();data.snapshotId='new';data.refreshedAt='2026-10-29T15:00:00Z';
    data.driverStandings.find(row=>row.driverId==='alpha'&&row.round===2)!.points={kind:'value',value:99};
    return route.fulfill({json:{data}});
  });
  await page.goto('/?view=compare&a=alpha&b=beta');
  await expect(page.getByRole('table')).toBeVisible();
  const before=(await page.locator('.snapshot-meta').textContent())!;
  await page.getByRole('button',{name:'Refresh data'}).click();
  await expect(page.getByRole('alert')).toContainText('Could not refresh. Showing data last refreshed');
  await expect(page.locator('.snapshot-meta')).toHaveText(before);
  await expect(page.getByRole('combobox',{name:'Driver B',exact:true})).toHaveValue('beta');
  fail=false;await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('.snapshot-meta')).not.toHaveText(before);
  await expect(page.getByRole('table')).toContainText('99');
});

test('cold failure retries without displaying another season', async ({page}) => {
  await mockSeasons(page);
  let fail=true;
  await page.route('**/api/v1/seasons/2021', route => fail?route.fulfill({status:502,json:{error:{code:'FAILED',message:'Synthetic initial error'}}}):route.fulfill({json:{data:seasonFixture()}}));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Could not load this season');
  await expect(page.getByRole('table')).toHaveCount(0);
  fail=false;await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.getByRole('table')).toContainText('Alex Example');
});

test('late response from old season never overwrites selected season', async ({page}) => {
  await mockSeasons(page);
  let release!:()=>void;const held=new Promise<void>(resolve=>{release=resolve;});
  await page.route('**/api/v1/seasons/2021', async route=>{await held;await route.fulfill({json:{data:seasonFixture(2021)}});});
  await page.goto('/?season=2021');
  await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
  await expect(page.getByRole('table')).toContainText('2010');
  release();await page.waitForResponse('**/api/v1/seasons/2021');
  await expect(page.getByRole('combobox',{name:'Season',exact:true})).toHaveValue('2010');
  await expect(page.getByRole('table')).toContainText('2010');
  await expect(page.getByRole('table')).not.toContainText('2021');
});

test('mobile controls stay on page and wide progress table scrolls locally', async ({page}) => {
  await mockSeasons(page);await page.setViewportSize({width:390,height:844});
  await page.goto('/?view=progress&entity=alpha');
  await expect(page.getByRole('table')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const region=page.getByRole('region');
  expect(await region.evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true);
  await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to analysis'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeInViewport();
});

test('fresh setup retries verification and can add second season without changing selection', async ({page}) => {
  const verified = new Set<number>();let fail=true;
  await page.route('**/api/v1/seasons',route=>route.fulfill({json:{data:{seasons:[2010,2021].map(season=>({season,verified:verified.has(season),lastCheckedRound:verified.has(season)?2:0,knownGaps:[]}))}}}));
  await page.route(/\/api\/v1\/seasons\/(2010|2021)\/refresh$/,route=>{
    if(fail)return route.fulfill({status:502,json:{error:{code:'FAILED',message:'Synthetic setup failure'}}});
    const year=Number(route.request().url().split('/').at(-2));verified.add(year);
    return route.fulfill({json:{data:seasonFixture(year)}});
  });
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Set up your first season'})).toBeVisible();
  await page.getByRole('button',{name:'Verify season data · 2010',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('Could not verify season data');
  fail=false;await page.getByRole('button',{name:'Verify season data · 2010',exact:true}).click();
  await expect(page.getByRole('table')).toContainText('2010');
  await expect(page.getByRole('combobox',{name:'Season',exact:true})).toHaveValue('2010');
  await page.getByRole('button',{name:'Verify season data · 2021',exact:true}).click();
  await expect(page.getByRole('button',{name:'Verify season data · 2021',exact:true})).toHaveCount(0);
  await expect(page.getByRole('combobox',{name:'Season',exact:true})).toHaveValue('2010');
  await expect(page.getByRole('table')).toContainText('2010');
  await expect(page.getByRole('combobox',{name:'Season',exact:true}).locator('option')).toHaveCount(2);
});

test('successful verification survives season-list failure and retries only the list', async ({page}) => {
  let verified=false,failList=false,posts=0;
  await page.route('**/api/v1/seasons',route=>failList
    ?route.fulfill({status:502,json:{error:{code:'FAILED',message:'Synthetic season-list failure'}}})
    :route.fulfill({json:{data:{seasons:[{season:2010,verified,lastCheckedRound:verified?2:0,knownGaps:[]}]}}}));
  await page.route('**/api/v1/seasons/2010/refresh',route=>{
    posts++;verified=true;failList=true;
    return route.fulfill({json:{data:seasonFixture(2010)}});
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Verify season data · 2010',exact:true}).click();
  await expect(page.getByRole('table')).toContainText('2010');
  await expect(page.getByText('Season verification succeeded',{exact:false})).toBeVisible();
  expect(posts).toBe(1);
  failList=false;
  await page.getByRole('button',{name:'Retry season list',exact:true}).click();
  await expect(page.getByRole('button',{name:'Retry season list',exact:true})).toHaveCount(0);
  expect(posts).toBe(1);
  await expect(page.getByRole('table')).toContainText('Alex Example');
});

test('live cached 2021 snapshot renders real standings and sprint points', async ({page,request}) => {
  const manifest=await request.get('/api/v1/seasons');
  expect(manifest.ok()).toBe(true);
  const data=(await manifest.json()).data;
  expect(data.seasons.filter((season:{verified:boolean})=>season.verified).map((season:{season:number})=>season.season)).toEqual([2010,2021]);
  await page.goto('/?season=2021');
  await expect(page.getByRole('table')).toContainText('Max Verstappen');
  await expect(page.getByRole('table')).toContainText('395.5');
  await page.screenshot({path:'test-results/first-iteration-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'View progress for Lewis Hamilton',exact:true}).click();
  const british=page.getByRole('row').filter({hasText:'British Grand Prix'});
  await expect(british).toContainText('27');
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'test-results/first-iteration-mobile.png',fullPage:true});
  await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
  await page.getByRole('link',{name:'Standings'}).click();
  await expect(page.getByRole('table')).toContainText('Sebastian Vettel');
  await expect(page.getByRole('table')).toContainText('256');
});

