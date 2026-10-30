import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { checkConstructorIdentity } from './identity-checks';
test('constructor fallback keeps one name and recovers locally', async ({ page }) => {
  await checkConstructorIdentity(page, 'local');
});
for (const season of [2010, 2021]) test(`every ${season} driver portrait and mapped team mark loads locally`,async({page})=>{
  test.setTimeout(90_000);
  const snapshot=JSON.parse(readFileSync(`.cache/seasons/${season}.json`,'utf8')).snapshot;
  const credits=JSON.parse(readFileSync('public/media/credits.json','utf8'));
  const external:string[]=[];
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1'))external.push(r.url());});
  await page.route('**/api/v1/seasons',r=>r.fulfill({json:{data:{seasons:[{season,verified:true,lastCheckedRound:snapshot.schedule.length,knownGaps:[]}]}}}));
  await page.route(`**/api/v1/seasons/${season}`,r=>r.fulfill({json:{data:snapshot}}));
  const ids=Object.keys(snapshot.drivers);
  for (const id of ids) {
    const other=ids.find(candidate=>candidate!==id)!;
    await page.goto(`/?view=compare&season=${season}&a=${id}&b=${other}`);
    const image=page.locator('.summary-identity.driver-a .portrait-frame img');
    await expect(image).toHaveCount(1);
    await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
    const asset=credits.assets.find((a:{kind:string;identity:string;seasons:number[]})=>a.kind==='portrait'&&a.identity===id&&a.seasons.includes(season));
    await expect(image).toHaveAttribute('src',`/media/${asset.filename}`);
  }
  await page.goto(`/?season=${season}&view=standings&category=constructors`);
  for(const asset of credits.assets.filter((a:{kind:string;seasons:number[]})=>a.kind==='constructor'&&a.seasons.includes(season))){
    const image=page.locator(`.constructor-frame img[src="/media/${asset.filename}"]`).first();
    await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
  await page.goto(`/?view=compare&season=${season}&a=${season===2010?'alonso':'hamilton'}&b=${season===2010?'vettel':'max_verstappen'}`);
  for(const [name,width,zoom] of [['desktop',1280,1],['narrow',390,1],['zoom',1280,2]] as const){
    await page.setViewportSize({width,height:1000});await page.evaluate(z=>{document.documentElement.style.zoom=String(z);},zoom);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const contained=await page.locator('.comparison-summary').evaluate(summary=>{const bounds=summary.getBoundingClientRect();return [...summary.children].every(child=>{const rect=child.getBoundingClientRect();return rect.left>=bounds.left-1&&rect.right<=bounds.right+1;});});
    expect(contained).toBe(true);
    await page.locator('.comparison-summary').screenshot({path:`.site-artifacts/media-${season}-${name}.png`});
  }
  expect(external).toEqual([]);
});
