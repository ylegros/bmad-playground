import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const manifest=JSON.parse(readFileSync('public/bundled/manifest.json','utf8'));


test('complete bundled analysis works with external and API requests blocked', async ({ page }) => {
  const forbidden: string[] = [];
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://127.0.0.1:3103' || url.pathname.startsWith('/api/')) {
      forbidden.push(url.href); return route.abort();
    }
    return route.continue();
  });
  await page.goto('/');
  await expect(page.locator('.snapshot-meta')).toContainText('Bundled season data');
  const sourceTimestamp=async(season:number)=>{
    const entry=manifest.seasons.find((entry:{season:number})=>entry.season===season);
    const expected=await page.evaluate(date=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(date)),entry.refreshedAt);
    await expect(page.locator('.snapshot-meta')).toContainText(expected);
    const exportTime=await page.evaluate(date=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(date)),manifest.exportedAt);
    expect(expected).not.toBe(exportTime);
  };
  await sourceTimestamp(2021);
  const credits=JSON.parse(readFileSync('public/media/credits.json','utf8'));
  const mediaRoot='/'+manifest.seasons[0].assetPath.split('/').slice(0,-1).join('/')+'/media/';
  const decoded=await page.evaluate(async({mediaRoot,files})=>Promise.all(files.map(async(filename:string)=>{
    const image=new Image();image.src=mediaRoot+filename;
    try{await image.decode();return image.naturalWidth>0;}catch{return false;}
  })),{mediaRoot,files:credits.assets.map((asset:{filename:string})=>asset.filename)});
  expect(decoded).toEqual(credits.assets.map(()=>true));
  await expect(page.getByRole('button', { name: /Refresh data|Verify season/ })).toHaveCount(0);
  await expect(page.getByRole('table')).toContainText('Max Verstappen');
  await page.getByRole('combobox', { name: 'Season', exact: true }).selectOption('2010');
  await expect(page.getByRole('table')).toContainText('Sebastian Vettel');
  await sourceTimestamp(2010);
  await page.goto('/?season=2021&view=compare&a=leclerc&b=russell&metric=qualifying');
  const bahrain = page.getByRole('row').filter({ hasText: 'Bahrain Grand Prix' });
  await expect(bahrain).toContainText('4');
  await expect(bahrain).toContainText('15');
  await expect(bahrain.locator('td').first()).toHaveClass(/comparison-better/);
  await expect(bahrain.locator('.sr-only')).toHaveText('Charles Leclerc, GP qualifying position, lower is better');
  expect(await bahrain.locator('.better-label').evaluate(element=>{const clone=element.cloneNode(true) as HTMLElement;clone.querySelectorAll('.sr-only').forEach(node=>node.remove());return clone.textContent;})).toBe('\u2713');
  await expect(page.getByText('Best GP qualifying rank', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Compare measure', exact: true }).selectOption('gp');
  await expect(bahrain).toContainText('6');
  await expect(bahrain).toContainText('14');
  await page.goto('/?season=2021&view=progress&category=drivers&graphDrivers=leclerc,russell&graphMetric=cumulative');
  await expect(page.getByRole('table').first()).toContainText('Charles Leclerc');
  const inspector = page.getByRole('slider', { name: 'Inspect round' });
  await inspector.focus(); await page.keyboard.press('End');
  await expect(inspector).toHaveAttribute('aria-valuenow', '22');
  await page.keyboard.press('Home');
  await expect(inspector).toHaveAttribute('aria-valuenow', '1');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: 'test-results/iteration-two-hosted-mobile.png', fullPage: true });
  expect(forbidden).toEqual([]);
});

test('bundled identity failure retries static data without live fallback', async ({ page }) => {
  let fail = true;
  const api: string[] = [];
  await page.route('**/api/**', route => { api.push(route.request().url()); return route.abort(); });
  await page.route('**/bundled/releases/*/2021.json', async route => {
    if (!fail) return route.continue();
    const response = await route.fetch();
    const data = await response.json(); data.snapshotId = 'incorrect';
    return route.fulfill({ json: data });
  });
  await page.goto('/?season=2021');
  await expect(page.getByRole('alert')).toContainText('Could not load bundled season data');
  fail = false;
  await page.getByRole('button', { name: 'Retry loading bundled data' }).click();
  await expect(page.getByRole('table')).toContainText('Max Verstappen');
  expect(api).toEqual([]);
});
