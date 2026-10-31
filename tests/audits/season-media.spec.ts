import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import type {SeasonSnapshotV2} from '../../app/shared/contracts';

for(let season=2010;season<=2026;season++)test(`${season} canonical portraits and constructor identities load from local files`,async({page})=>{
  test.setTimeout(120_000);
  const snapshot:SeasonSnapshotV2=JSON.parse(readFileSync(`.cache/seasons-v2/${season}.json`,'utf8')).snapshot;
  const credits=JSON.parse(readFileSync('public/media/credits.json','utf8'));
  const blocked:string[]=[];
  await page.route('**/*',route=>{
    if(new URL(route.request().url()).origin!=='http://127.0.0.1:3002'){blocked.push(route.request().url());return route.abort();}
    return route.continue();
  });
  const ids=Object.keys(snapshot.drivers);
  await page.goto(`/?season=${season}&view=compare&a=${ids[0]}&b=${ids[1]}`);
  for(const id of ids){
    await page.getByRole('combobox',{name:'Driver A',exact:true}).selectOption(id);
    // The same-driver state deliberately omits the summary; choose another B.
    if(id===ids[1])await page.getByRole('combobox',{name:'Driver B',exact:true}).selectOption(ids[0]);
    const asset=credits.assets.find((a:{kind:string;identity:string;seasons:number[]})=>a.kind==='portrait'&&a.identity===id&&a.seasons.includes(season));
    expect(asset,`${id} has a credited canonical-season portrait`).toBeTruthy();
    const image=page.locator('.summary-identity.driver-a .portrait-frame img');
    await expect(image).toHaveAttribute('src',`/media/${asset.filename}`);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
  await page.goto(`/?season=${season}&category=constructors`);
  for(const id of Object.keys(snapshot.constructors)){
    const identity=page.locator('.constructor-identity').filter({has:page.getByText(snapshot.constructors[id].name,{exact:true})}).first();
    await expect(identity).toBeVisible();
    const asset=credits.assets.find((a:{kind:string;identity:string;seasons:number[]})=>a.kind==='constructor'&&a.identity===id&&a.seasons.includes(season));
    if(asset){
      const image=identity.locator('img');await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute('src',`/media/${asset.filename}`);
      await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
    }else{await expect(identity.locator('img')).toHaveCount(0);await expect(identity.locator(':scope > span')).toHaveCount(1);}
  }
  expect(blocked).toEqual([]);
});
