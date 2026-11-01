import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { BundledManifestV2, SeasonSnapshotV2 } from '../../app/shared/contracts';
import { evolutionSeries, type GraphMetric, type ProgressCategory } from '../../app/shared/progress-model';

const directory=process.env.PREVIEW_DIRECTORY;
if(!directory)throw new Error('PREVIEW_DIRECTORY must name the static release under test.');
const read=(path:string)=>JSON.parse(readFileSync(resolve(directory,path),'utf8'));

test('iteration four real bundled values and bottom disclosures stay usable without external requests',async({page})=>{
  const forbidden:string[]=[];
  await page.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.origin!=='http://127.0.0.1:3104'||url.pathname.startsWith('/api/')){
      forbidden.push(url.href);return route.abort();
    }
    return route.continue();
  });
  const manifest=read('bundled/manifest.json') as BundledManifestV2;
  const entry=manifest.seasons.find(row=>row.season===2026)!;
  const snapshot=read(entry.assetPath) as SeasonSnapshotV2;
  const ids=Object.keys(snapshot.drivers).sort();
  await page.goto(`/?season=2026&view=progress&graphDrivers=${ids.join(',')}&graphMetric=qualifying`);
  const information=page.locator('details').filter({has:page.locator('summary').filter({hasText:/^Season information/})});
  const coverage=page.locator('details').filter({has:page.locator('summary').filter({hasText:/^Season coverage/})});
  await expect(information).not.toHaveAttribute('open','');
  await expect(coverage).not.toHaveAttribute('open','');
  await expect(page.getByRole('region',{name:'Season evidence'})).not.toBeVisible();
  expect(await information.evaluate(element=>Boolean(element.compareDocumentPosition(document.querySelector('.progress-panel')!)&Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
  const before=await page.evaluate(()=>({url:location.href,length:history.length}));
  await information.locator('summary').focus();await page.keyboard.press('Enter');
  await expect(page.getByRole('region',{name:'Season evidence'})).toContainText('Ongoing / Season to date');
  await coverage.locator('summary').click();
  expect(await page.evaluate(()=>({url:location.href,length:history.length}))).toEqual(before);
  await expect(coverage).toContainText('2010: Verified');
  await expect(coverage).toContainText('2026: Verified');

  for(const item of evolutionSeries(snapshot,'drivers',ids,'qualifying')){
    const labels=page.locator(`[data-series="${item.id}"] .point-value`);
    await expect(labels).toHaveText(item.rows.filter(row=>row.value!==null).map(row=>String(row.value)));
  }
  await expect(page.locator('.series-legend svg text')).toHaveCount(0);
  const labelIssues=()=>page.locator('.chart-scroll svg[role="img"]').evaluate(svg=>{
    const root=svg as SVGSVGElement,frame=root.viewBox.baseVal;
    const text=Array.from(root.querySelectorAll('text')).map(node=>({node,box:node.getBBox()}));
    const labels=text.filter(row=>row.node.classList.contains('point-value'));
    const markers=Array.from(root.querySelectorAll('circle')).map(node=>node.getBBox());
    const overlaps=(a:DOMRect,b:DOMRect)=>a.x<b.x+b.width-0.5&&a.x+a.width>b.x+0.5&&a.y<b.y+b.height-0.5&&a.y+a.height>b.y+0.5;
    const issues:string[]=[];
    for(const {node,box} of text)if(box.x<-.5||box.y<-.5||box.x+box.width>frame.width+.5||box.y+box.height>frame.height+.5)issues.push(`clipped ${node.textContent}`);
    for(let i=0;i<labels.length;i++){
      for(let j=i+1;j<labels.length;j++)if(overlaps(labels[i].box,labels[j].box))issues.push(`labels overlap ${i}/${j}`);
      if(markers.some(marker=>overlaps(labels[i].box,marker)))issues.push(`label overlaps marker ${i}`);
    }
    return issues.slice(0,10);
  });
  const inspection=page.getByRole('slider',{name:'Inspect round'});
  await inspection.focus();await page.keyboard.press('End');
  await expect(inspection).toHaveAttribute('aria-valuenow',String(snapshot.schedule.length));
  await page.keyboard.press('Home');
  await expect(inspection).toHaveAttribute('aria-valuenow','1');
  for(const [layout,width,zoom] of [['desktop',1280,1],['narrow',390,1],['zoom',1280,2]] as const){
    await page.setViewportSize({width,height:1000});
    await page.evaluate(value=>{document.documentElement.style.zoom=String(value)},zoom);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const chart=page.getByRole('region',{name:'Season evolution chart',exact:true});
    await chart.focus();await expect(chart).toBeFocused();
    expect(await labelIssues()).toEqual([]);
    await chart.screenshot({path:`.site-artifacts/iteration-four/bundled-${layout}-graph.png`});
    await information.screenshot({path:`.site-artifacts/iteration-four/bundled-${layout}-information.png`});
  }
  await page.evaluate(()=>{document.documentElement.style.zoom='1'});
  await page.getByRole('link',{name:'01 Standings'}).click();
  await expect(information).toHaveAttribute('open','');
  await page.getByRole('combobox',{name:'Season',exact:true}).selectOption('2021');
  await expect(page.getByRole('region',{name:'Season evidence'})).toContainText('Complete season');
  await expect(information).toHaveAttribute('open','');
  await expect(coverage).toHaveAttribute('open','');
  const historical=read(manifest.seasons.find(row=>row.season===2021)!.assetPath) as SeasonSnapshotV2;
  const checkLabels=async(category:ProgressCategory,selected:string[],metric:GraphMetric)=>{
    const selection=category==='drivers'?'graphDrivers':'graphConstructors';
    await page.goto(`/?season=2021&view=progress&category=${category}&${selection}=${selected.join(',')}&graphMetric=${metric}`);
    for(const item of evolutionSeries(historical,category,selected,metric)){
      await expect(page.locator(`[data-series="${item.id}"] .point-value`)).toHaveText(item.rows.filter(row=>row.value!==null).map(row=>String(row.value)));
    }
    expect(await labelIssues()).toEqual([]);
  };
  const drivers=['hamilton','max_verstappen'];
  await checkLabels('drivers',drivers,'cumulative');
  await expect(page.locator('.point-value').filter({hasText:'395.5'})).toHaveCount(1);
  await checkLabels('drivers',drivers,'sprintPoints');
  await checkLabels('drivers',drivers,'adjustment');
  await checkLabels('constructors',['mercedes','red_bull'],'cumulative');
  await page.reload();
  await expect(information).not.toHaveAttribute('open','');
  await expect(coverage).not.toHaveAttribute('open','');
  expect(forbidden).toEqual([]);
});
