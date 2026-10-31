import {readFile,readdir,mkdir,cp,writeFile} from 'node:fs/promises';import {join,dirname} from 'node:path';
import {inventoryMedia} from './media-inventory.mjs';
const root='_bmad-output/implementation-artifacts/iteration-three/media';await mkdir(root+'/research/portraits',{recursive:true});await mkdir(root+'/research/logos',{recursive:true});
const snapshots=[];for(const file of (await readdir('.cache/seasons-v2')).sort()){if(!/^\d{4}\.json$/.test(file))continue;const raw=JSON.parse(await readFile('.cache/seasons-v2/'+file,'utf8'));if(raw.snapshot?.audit?.status==='verified')snapshots.push(raw.snapshot);}
const credits=JSON.parse(await readFile('public/media/credits.json','utf8'));const baselineExceptions=JSON.parse(await readFile('public/media/investigations.json','utf8'));
const portraits=JSON.parse(await readFile('.cache/media-acquisition/portrait-candidates.json','utf8')).records.filter(r=>r.filename);
const logos=JSON.parse(await readFile('.cache/media-acquisition/logo-candidates.json','utf8')).records.filter(r=>r.filename);
const strip=v=>String(v??'').replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replace(/\s+/g,' ').trim();
const photoDate=v=>/^\d{4}-\d{2}-\d{2}/.test(v??'')?v.slice(0,10):'unknown';
function addReviewed(kind,id,years,filename,record,note,sourceDirectory){
 const applicable=years.filter(year=>snapshots.some(s=>s.season===year&&s[kind==='portrait'?'drivers':'constructors'][id]));
 const missing=applicable.filter(year=>!credits.assets.some(a=>a.kind===kind&&a.identity===id&&a.seasons.includes(year)));if(!missing.length)return;
 let asset=credits.assets.find(a=>a.kind===kind&&a.identity===id&&a.filename===filename);
 if(!asset){const info=record.info;const m=info.extmetadata;const creator=strip(m.Artist?.value)||'Unknown author';const license=strip(m.LicenseShortName?.value);if(!license||!info.descriptionurl)throw Error('Missing provenance for '+id);const licenseUrl=m.LicenseUrl?.value||info.descriptionurl+'#Licensing';asset={kind,identity:id,seasons:[],filename,sourceUrl:info.descriptionurl,creator,license,licenseUrl,attribution:strip(m.Attribution?.value)||`${record.commonsTitle??record.title} by ${creator}, ${license}. Wikimedia thumbnail; source content unmodified.`,portraitDate:kind==='portrait'?photoDate(m.DateTimeOriginal?.value):'unknown',cropNotes:note};credits.assets.push(asset);}
 asset.seasons=[...new Set([...asset.seasons,...missing])].sort((a,b)=>a-b);if(sourceDirectory)copies.push([sourceDirectory+'/'+record.filename,'public/media/'+filename]);
}
const copies=[];
for(const s of snapshots)for(const id of Object.keys(s.drivers)){
 if(credits.assets.some(a=>a.kind==='portrait'&&a.identity===id&&a.seasons.includes(s.season)))continue;
 const prior=credits.assets.find(a=>a.kind==='portrait'&&a.identity===id);
 if(prior){prior.seasons=[...new Set([...prior.seasons,s.season])].sort((a,b)=>a-b);continue;}
 const r=portraits.find(r=>r.id===id);if(!r)throw Error('No reviewed photograph for '+id);
 addReviewed('portrait',id,[s.season],r.filename,r,'Real driver photograph selected through canonical provider URL / Wikipedia redirect / Wikidata P18 identity binding. Source thumbnail unmodified; CSS 4:5 crop; source photograph date disclosed independently of season. Visually reviewed in new-portraits contact sheets.','.cache/media-acquisition/portraits');
}
function reuse(id,filename,years){const a=credits.assets.find(a=>a.kind==='constructor'&&a.identity===id&&a.filename===filename);if(!a)throw Error('Unknown approved asset '+filename);for(const y of years)if(snapshots.some(s=>s.season===y&&s.constructors[id])&&!credits.assets.some(other=>other.kind==='constructor'&&other.identity===id&&other.seasons.includes(y)))a.seasons.push(y);a.seasons=[...new Set(a.seasons)].sort((a,b)=>a-b);}
const years=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
reuse('ferrari','constructor-ferrari-2010-2021.jpg',years(2010,2026));
reuse('mclaren','constructor-mclaren-2010.jpg',[2011,2012,2013]);reuse('mclaren','constructor-mclaren-2021.png',[2017,2018,2019,2020]);
reuse('mercedes','constructor-mercedes-2010.png',[2011]);reuse('mercedes','constructor-mercedes-2021.png',[2020,2022,2023,2024,2025]);
reuse('red_bull','constructor-red_bull-2010.png',[2011,2012]);reuse('renault','constructor-renault-2010.png',[2011,2016,2017,2018,2019,2020]);reuse('sauber','constructor-sauber-2010.png',years(2011,2018));reuse('virgin','constructor-virgin-2010.png',[2011]);reuse('alpine','constructor-alpine-2021.png',years(2022,2026));reuse('williams','williams-2020.png',[2020]);
// Prefer explicitly dated variants over preliminary generic marks; preserve approved baseline2010/2021.
for(const a of credits.assets)if(a.kind==='constructor'&&a.identity==='williams')a.seasons=a.seasons.filter(y=>![2014,2015,2016,2017,2018,2022,2023,2024,2025].includes(y));
const decisions=[
 ['cadillac','File:Cadillac Formula 1 Team logo.png',[2026],'Cadillac Formula1 Team debut mark, source datedMay2025 and canonical team category explicitly identifies2026 inauguration.'],
 ['williams','File:20150130002217!Williams Martini Racing logo.png',[2014,2015,2016,2017,2018],'Williams Martini Racing partnership-era wordmark; official Williams history places Martini at the2014 hybrid-era transition.'],
 ['williams','File:Williams Racing 2022 logo.svg',[2022,2023,2024],'Williams Racing2022 wordmark, predates the2025 Atlassian identity and does not substitute the2010 AT&T brand.'],
 ['mclaren','File:McLaren Mercedes logo.png',[2014],'Exact McLaren Mercedes2014 official-source wordmark; Commons upload1February2014. No Vodafone or Honda period substituted.'],
 ['mercedes','File:Mercedes AMG Petronas logo.png',[2012,2013],'Mercedes AMG Petronas2013 historical metallic wordmark from the official team site; AMG-era identity, not GP2010 or2020 version.'],
 ['mercedes','File:Mercedes AMG Petronas F1 Logo.svg (2014 revision)',[2014,2015,2016,2017,2018,2019],'Archived July2014 Mercedes AMG Petronas wordmark revision, explicitly retrieved before theSeptember2020 replacement; modern2020 mark is not substituted.'],
 ['hrt','File:HRT new logo.jpg',[2011],'HRT Formula One Team mark, source dated24July2011; exact historical identity distinct from2010 Hispania text and2012 gold variant.'],
 ['hrt','File:HRT F1 TEAM 2012.svg',[2012],'Source explicitly labels gold HRT Formula1 Team logo for2012 season.'],
 ['sauber','File:Logo of Stake F1 Team Kick Sauber.png',[2024,2025],'Stake F1 Team Kick Sauber mark, explicitly datedJanuary2024; not reused for older Sauber or2026 Audi.'],
 ['racing_point','File:SportPesa-Racing-Point-logo-2019.jpg',[2019],'Exact SportPesa Racing Point2019 mark, source dated13February2019; not BWT2020 or Force India predecessor.'],
 ['mclaren','File:McLaren Racing logo.png',years(2022,2026),'Papaya speedmark-era McLaren Racing mark, source dated2022; official McLaren logo history distinguishes this from earlier mono-black era.'],
 ['mclaren','File:Mclaren Honda 2015.png',[2015,2016],'McLaren Honda partnership-era team wordmark, exact source identifies2015; no unrelated contemporary McLaren brand substituted.'],
 ['williams','File:Atlassian Williams F1 Team logo.svg',[2026],'Atlassian Williams F1 Team2026 rebrand; official31December2025 article confirms new name/logo fromJanuary2026.'],
 ['williams','File:Williams racing2025logo.jpg',[2025],'Atlassian Williams Racing2025 logo, verified against official2025 launch; not the F1 Team/Forward W rebrand introducedJanuary2026.'],
 ['haas','File:Haas F1 Team Logo.svg',[2016,2017,2018,2020,2022],'Sponsor-free Haas F1 Team mark; does not insert Rich Energy, Uralkali or MoneyGram into a different era.'],
 ['haas','File:Rich Energy Haas F1 Team Logo.svg',[2019],'Rich Energy Haas mark for its2019 sponsorship period; does not imply this sponsor covered the entire season.'],
 ['haas','File:MoneyGram Haas F1 Team Logo.svg',[2023,2024,2025],'MoneyGram Haas partnership-era mark; Wikidata logo qualifiers record start2023.'],
 ['haas','File:TGR Haas F1 Team Logo (2026).svg',[2026],'TGR Haas F1 Team2026 mark, explicitly dated2026 by source.'],
 ['racing_point','File:BWT Racing Point Logo.svg',[2020],'BWT Racing Point2020 team branding, not reused for the2019 SportPesa period or Force India predecessor.'],
 ['lotus_f1','File:Lotus F1 Team logo.jpg',[2012,2013,2014,2015],'Photograph of the Enstone Lotus F1 Team badge; distinct from2010/2011 Lotus Racing/Team Lotus canonical identity. Whole badge contained.'],
 ['caterham','File:Caterham F1 Team logo.jpg',[2012,2013],'Caterham F1 Team historical green/gold wordmark, source dated2011 before the2012 team-name change.'],
 ['caterham','File:Caterham F1 Team logo (2014).svg',[2014],'Source explicitly identifies2014 Caterham F1 Team logo; not used for earlier Caterham seasons.'],
 ['manor','File:Manor F1 Team logo.png',[2015],'Historical Manor Marussia red wordmark for2015 identity; distinct from2016 Manor Racing emblem.'],
 ['manor','File:Logo Manor F1.png',[2016],'Manor Racing blue/orange emblem, source dated2016; distinct from2015 Manor Marussia wordmark.'],
 ['lotus_racing','File:Logo Team Lotus T128.jpg',[2011],'Photograph of the real Team Lotus T1282011 badge; not the Enstone Lotus successor or a generated drawing.'],
 ['audi','File:Audif1.com logo17 (cropped).svg',[2026],'Source is Revolut Audi F1 Team mark published for2026 debut; no Sauber predecessor substitution.'],
 ['mercedes','File:Mercedes-AMG Petronas F1 Team logo (2026).svg',[2026],'Source explicitly identifies2026 Mercedes-AMG Petronas F1 Team logo.'],
 ['marussia','File:Marussia logo on one of their F1 cars (7448443504).jpg',[2012,2013,2014],'Licensed close photograph of actual Marussia team wordmark/emblem on its car,2012 source. Brand occupies the central panel; whole real mark retained, no generated recreation.']
];
for(const[id,title,ys,note]of decisions){const r=logos.find(r=>r.title===title);if(!r)continue;const name=`constructor-${id}-${r.filename}`;addReviewed('constructor',id,ys,name,r,note+' Source image content unmodified; contained without cutting the mark.','.cache/media-acquisition/logos');}
const baselineMeta=JSON.parse(await readFile(root+'/research/metadata.json','utf8')).records;
for(const[id,index,ys,note]of [['force_india',0,years(2012,2018),'Sahara Force India wordmark; mapped only within Sahara-era seasons.2018 use denotes that season initial team identity, not a current successor.'],['williams',1,[2016,2017,2018,2019],'Williams W as documented in its2016 source; not inferred into2010 AT&T era.'],['aston_martin',5,[2024,2025,2026],'Aston Martin Aramco2024-era logo, no2021 Cognizant substitution.'],['alfa',6,[2023],'Alfa Romeo F1 Team Stake2023 brand; not used for Racing Orlen2019–2022.']]){const r=baselineMeta[index];addReviewed('constructor',id,ys,`constructor-${id}-reviewed-${index}.${r.filename.split('.').pop()}`,r,note+' Source content unchanged; real mark contained.',root+'/research');}
credits.assets=credits.assets.filter(a=>a.seasons.length>0);
for(const[src,dst]of copies){await mkdir(dirname(dst),{recursive:true});await cp(src,dst);}
for(const r of portraits)await cp('.cache/media-acquisition/portraits/'+r.filename,root+'/research/portraits/'+r.filename);
for(const r of logos)await cp('.cache/media-acquisition/logos/'+r.filename,root+'/research/logos/'+r.filename);
await writeFile(root+'/research/portraits/metadata.json',JSON.stringify({observedAt:new Date().toISOString(),records:portraits.map(r=>({...r,title:r.commonsTitle}))},null,2));await writeFile(root+'/research/logos/metadata.json',JSON.stringify({observedAt:new Date().toISOString(),records:logos},null,2));
// New unfilled constructor slots remain unresolved until their specific source investigation is recorded.
const offered=new Set(snapshots.map(s=>s.season));const investigations=baselineExceptions.filter(e=>offered.has(e.season)&&!credits.assets.some(a=>a.kind===e.kind&&a.identity===e.identity&&a.seasons.includes(e.season)));
const report=await inventoryMedia({snapshots,credits,investigations,strict:false});
await writeFile('public/media/credits.json',JSON.stringify(credits,null,2)+'\n');await writeFile('public/media/investigations.json',JSON.stringify(investigations,null,2)+'\n');await writeFile('public/media/inventory.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.coverage,null,2));
