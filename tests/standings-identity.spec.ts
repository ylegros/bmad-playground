import {test,expect} from '@playwright/test';

for(const category of ['drivers','constructors']) test(`${category} standings use a logo or a single fallback identity`,async({page})=>{
 await page.goto(`/?season=2021&view=standings&category=${category}`);
 const identities=page.locator('table .constructor-identity');
 await expect(identities.first()).toBeVisible();
 for(const identity of await identities.all()) {
  const image=identity.locator('img');
  if(await image.count()) {
   await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
   const name=await image.getAttribute('alt');expect(name).toBeTruthy();
   await expect(identity).toHaveText('');
   expect((await identity.ariaSnapshot()).split(name!).length-1).toBe(1);
   await image.evaluate(img=>img.dispatchEvent(new Event('error')));
   await expect(identity).toHaveText(name!);
   await expect(identity.locator('.constructor-frame')).toHaveCount(0);
   expect((await identity.ariaSnapshot()).split(name!).length-1).toBe(1);
  } else {expect((await identity.innerText()).trim()).not.toBe('');}
 }
 for(const [width,zoom] of [[390,1],[1280,2]]) {
  await page.setViewportSize({width,height:1000});await page.evaluate(value=>{document.documentElement.style.zoom=String(value);},zoom);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const action=page.getByRole('button',{name:/View progress for/}).first();
  await action.focus();await expect(action).toBeFocused();await expect(action).toBeVisible();
 }
 await page.getByRole('button',{name:/View progress for/}).first().press('Enter');
 await expect(page).toHaveURL(/view=progress/);
});

test('failed constructor image recovers when canonical identity changes in a retained row',async({page})=>{
 await page.goto('/?season=2021&view=standings&category=constructors');
 const ferrari=page.locator('table .constructor-identity').filter({has:page.getByRole('img',{name:'Ferrari',exact:true})});
 await expect(ferrari).toBeVisible();
 await ferrari.locator('img').evaluate(img=>img.dispatchEvent(new Event('error')));
 await expect(page.locator('table .constructor-identity').filter({hasText:/^Ferrari$/})).toBeVisible();
 await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2010');
 await expect(page.getByRole('img',{name:'Ferrari',exact:true})).toBeVisible();
});
