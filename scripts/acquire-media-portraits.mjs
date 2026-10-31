import {readFile,writeFile,mkdir} from 'node:fs/promises';
const headers={'User-Agent':'F1PitWallMediaAudit/0.3 (canonical historical image provenance research)'};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const get=async url=>{for(let attempt=0;attempt<3;attempt++){const response=await fetch(url,{headers,signal:AbortSignal.timeout(25000)});if(response.status===429){const seconds=Number(response.headers.get('retry-after'))||30;console.log(JSON.stringify({status:'rate-limited',retryAfterSeconds:seconds}));if(seconds>60)throw Error(`Rate limited; retry after ${seconds} seconds`);await wait(seconds*1000);continue;}if(!response.ok)throw Error(`HTTP ${response.status}: ${url}`);return response.json();}throw Error('Rate limited after bounded retries');};
const api=(base,values)=>{const u=new URL(base);for(const [k,v]of Object.entries(values))u.searchParams.set(k,v);return u;};
const entities=JSON.parse(await readFile('.cache/media-acquisition/canonical-identities.json','utf8'));const credits=JSON.parse(await readFile('public/media/credits.json','utf8'));const targets=Object.values(entities.drivers).filter(d=>!credits.assets.some(a=>a.kind==='portrait'&&a.identity===d.id));
await mkdir('.cache/media-acquisition/portraits',{recursive:true});let records=[];try{records=JSON.parse(await readFile('.cache/media-acquisition/portrait-candidates.json','utf8')).records;}catch{}
const titles=targets.map(d=>decodeURIComponent(new URL(d.url).pathname.split('/wiki/')[1]).replaceAll('_',' '));
let entityRaw;try{entityRaw=JSON.parse(await readFile('.cache/media-acquisition/wikidata-portraits.json','utf8'));}catch{entityRaw=await get(api('https://www.wikidata.org/w/api.php',{action:'wbgetentities',format:'json',sites:'enwiki',titles:titles.join('|'),props:'claims|labels|sitelinks'}));await writeFile('.cache/media-acquisition/wikidata-portraits.json',JSON.stringify(entityRaw));}
const byTitle=new Map(Object.entries(entityRaw.entities).map(([qid,entity])=>[entity.sitelinks?.enwiki?.title,{qid,entity}]));
const missingTitles=titles.filter(t=>!byTitle.has(t));
if(missingTitles.length){
 let redirects;try{redirects=JSON.parse(await readFile('.cache/media-acquisition/wikipedia-portrait-redirects.json','utf8'));}catch{redirects=await get(api('https://en.wikipedia.org/w/api.php',{action:'query',format:'json',prop:'pageprops',ppprop:'wikibase_item',redirects:'1',titles:missingTitles.join('|')}));await writeFile('.cache/media-acquisition/wikipedia-portrait-redirects.json',JSON.stringify(redirects));}
 const pages=Object.values(redirects.query.pages);const qids=pages.map(p=>p.pageprops?.wikibase_item).filter(Boolean);
 let resolved;try{resolved=JSON.parse(await readFile('.cache/media-acquisition/wikidata-redirected-portraits.json','utf8'));}catch{resolved=await get(api('https://www.wikidata.org/w/api.php',{action:'wbgetentities',format:'json',ids:qids.join('|'),props:'claims|sitelinks|labels'}));await writeFile('.cache/media-acquisition/wikidata-redirected-portraits.json',JSON.stringify(resolved));}
 for(const title of missingTitles){let target=title;for(let n=0;n<5;n++){const redirection=redirects.query.redirects?.find(r=>r.from===target);if(!redirection)break;target=redirection.to;}const qid=pages.find(p=>p.title===target)?.pageprops?.wikibase_item;const entity=resolved.entities[qid];if(entity)byTitle.set(title,{qid,entity});}
}
for(const driver of targets){if(records.some(r=>r.id===driver.id&&r.filename))continue;try{
 const title=decodeURIComponent(new URL(driver.url).pathname.split('/wiki/')[1]).replaceAll('_',' ');
 const pair=byTitle.get(title);if(!pair)throw Error('Canonical Wikipedia link has no matching Wikidata sitelink');const {qid,entity}=pair;
 const image=entity.claims?.P18?.[0]?.mainsnak?.datavalue?.value;if(!image)throw Error('Canonical Wikidata entity has no P18 image');
 await wait(700);const source=await get(api('https://commons.wikimedia.org/w/api.php',{action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata|size',iiurlwidth:'480',titles:'File:'+image}));const page=Object.values(source.query.pages)[0];const info=page.imageinfo?.[0];if(!info)throw Error('Commons metadata unavailable');
 const data=await fetch(info.thumburl??info.url,{headers,signal:AbortSignal.timeout(25000)});if(!data.ok)throw Error(`Image HTTP ${data.status}`);const type=data.headers.get('content-type');if(!type?.startsWith('image/'))throw Error('Not image bytes');const filename=`portrait-${driver.id}-canonical.${type.includes('png')?'png':'jpg'}`;await writeFile('.cache/media-acquisition/portraits/'+filename,Buffer.from(await data.arrayBuffer()));
 const record={...driver,qid,wikipediaTitle:title,commonsTitle:'File:'+image,filename,downloadedAt:new Date().toISOString(),info};records=records.filter(r=>r.id!==driver.id);records.push(record);console.log(JSON.stringify({id:driver.id,qid,image,status:'downloaded-not-visually-approved'}));
 }catch(error){records=records.filter(r=>r.id!==driver.id);records.push({...driver,error:error.message,attemptedAt:new Date().toISOString()});console.log(JSON.stringify({id:driver.id,error:error.message}));if(/Rate limited/.test(error.message))break;}
 await writeFile('.cache/media-acquisition/portrait-candidates.json',JSON.stringify({records},null,2));
}
