import { dataSource } from './data-source';
import inventory from '../../public/media/inventory.json';
import investigations from '../../public/media/investigations.json';
import credits from '../../public/media/credits.json';
import { calendarDate, utcTimestamp, validAssetPath } from '../shared/validation';
export interface MediaAsset { kind: string; identity: string; seasons: number[]; filename: string; sourceUrl: string; creator: string; license: string; licenseUrl: string; attribution: string; portraitDate: string; cropNotes: string }
export interface MediaFallback { kind: string; identity: string; season: number; reason: string }
interface InventorySlot { kind:string; identity:string; season:number; status:string; filename?:string; sourceUrl?:string; creator?:string; license?:string; licenseUrl?:string; attribution?:string; photographDate?:string; cropNotes?:string; applicableSeasons?:number[]; sha256?:string; bytes?:number; width?:number; height?:number; attemptedSources?:string[]; blocker?:string; visualCheck?:string; visualEvidence?:string; reviewedAt?:string; acceptance?:string }
interface InventoryCoverage { season:number; kind:string; total:number; actual:number; exceptions:number; unresolved:number }
export interface MediaInvestigation {kind:string;identity:string;season:number;status:string;attemptedSources:string[];blocker:string;visualCheck:string;visualEvidence:string;reviewedAt:string;acceptance?:string}
interface MediaInventory {inventoryVersion:number;checkedAt:string;coverage:InventoryCoverage[];slots:InventorySlot[]}
interface MediaState {credits:{assets:MediaAsset[];fallbacks:MediaFallback[]};inventory:MediaInventory;investigations:MediaInvestigation[]}
export let mediaCredits: MediaState['credits'] = credits;
export let mediaInventory: MediaInventory = inventory;
export let mediaInvestigations: MediaInvestigation[] = investigations;
export function mediaAcceptance() {const accepted=mediaInvestigations.filter(item=>item.acceptance==='accepted-by-user').length;return {total:mediaInvestigations.length,accepted,pending:mediaInvestigations.length-accepted};}
// Initial compiled defaults support SSR. Runtime release metadata replaces all bindings together.
function mappings(assets:MediaAsset[],kind:'portrait'|'constructor') {const result:Record<number,Record<string,string>>={};for(const asset of assets.filter(a=>a.kind===kind))for(const year of asset.seasons)(result[year]??={})[asset.identity]=asset.filename;return result;}
export let portraitMappings=mappings(mediaCredits.assets,'portrait');
export let constructorMappings=mappings(mediaCredits.assets,'constructor');
const text=(v:unknown):v is string=>typeof v==='string'&&!!v.trim();
const url=(v:unknown)=>{try{return text(v)&&['https:','http:'].includes(new URL(v).protocol);}catch{return false;}};
const kind=(v:unknown)=>v==='portrait'||v==='constructor';
const year=(v:unknown):v is number=>Number.isInteger(v)&&Number(v)>=2010&&Number(v)<=2026;
const slotKey=(v:{kind:string;identity:string;season:number})=>`${v.season}/${v.kind}/${v.identity}`;
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
export function validMediaMetadata(rawCredits:unknown,rawInventory:unknown,rawInvestigations:unknown):boolean {
 try {
 const c=rawCredits as MediaState['credits'],i=rawInventory as MediaInventory,e=rawInvestigations as MediaInvestigation[];
 if(!c||!Array.isArray(c.assets)||!Array.isArray(c.fallbacks)||!i||i.inventoryVersion!==2||!utcTimestamp(i.checkedAt)||!Array.isArray(i.slots)||!Array.isArray(i.coverage)||!Array.isArray(e))return false;
 const keys=new Set<string>(),assetKeys=new Map<string,MediaAsset>();
 for(const a of c.assets){if(!kind(a.kind)||!text(a.identity)||!Array.isArray(a.seasons)||!a.seasons.length||new Set(a.seasons).size!==a.seasons.length||!a.seasons.every(year)||!validAssetPath(`media/${a.filename}`)||!url(a.sourceUrl)||!url(a.licenseUrl)||![a.creator,a.license,a.attribution,a.cropNotes].every(text)||!(a.portraitDate==='unknown'||calendarDate(a.portraitDate)))return false;for(const season of a.seasons){const k=slotKey({...a,season});if(assetKeys.has(k))return false;assetKeys.set(k,a);}}
 if(c.fallbacks.some(f=>!kind(f.kind)||!text(f.identity)||!year(f.season)||!text(f.reason)))return false;
 const exceptions=new Map<string,MediaInvestigation>();
 for(const item of e){const key=slotKey(item);if(exceptions.has(key)||!kind(item.kind)||!text(item.identity)||!year(item.season)||item.status!=='exception'||!Array.isArray(item.attemptedSources)||!item.attemptedSources.length||!item.attemptedSources.every(url)||!text(item.blocker)||item.blocker.trim().length<32||!text(item.visualCheck)||!validAssetPath(item.visualEvidence)||!utcTimestamp(item.reviewedAt)||assetKeys.has(key))return false;exceptions.set(key,item);}
 for(const row of i.slots){const key=slotKey(row);if(keys.has(key)||!kind(row.kind)||!text(row.identity)||!year(row.season)||!['mapped','exception','unresolved'].includes(row.status))return false;keys.add(key);
 if(row.status==='mapped'){const a=assetKeys.get(key);if(!a||row.filename!==a.filename||row.sourceUrl!==a.sourceUrl||row.creator!==a.creator||row.license!==a.license||row.licenseUrl!==a.licenseUrl||row.attribution!==a.attribution||row.photographDate!==a.portraitDate||row.cropNotes!==a.cropNotes||!same(row.applicableSeasons,a.seasons)||!/^[a-f0-9]{64}$/.test(row.sha256??'')||!Number.isInteger(row.bytes)||Number(row.bytes)<=0||!Number.isInteger(row.width)||Number(row.width)<=0||!Number.isInteger(row.height)||Number(row.height)<=0)return false;}
 if(row.status==='exception'){const item=exceptions.get(key);if(!item||!['attemptedSources','blocker','visualCheck','visualEvidence','reviewedAt','acceptance'].every(field=>same(row[field as keyof InventorySlot],item[field as keyof MediaInvestigation])))return false;}
 if(row.status==='unresolved'&&(assetKeys.has(key)||exceptions.has(key)))return false;}
 if([...assetKeys.keys(),...exceptions.keys()].some(k=>!keys.has(k)))return false;
 const counts=new Set<string>();for(const row of i.coverage){const key=`${row.season}/${row.kind}`;if(counts.has(key)||!kind(row.kind)||!year(row.season)||![row.total,row.actual,row.exceptions,row.unresolved].every(n=>Number.isInteger(n)&&n>=0))return false;counts.add(key);const group=i.slots.filter(s=>s.season===row.season&&s.kind===row.kind);if(row.total!==group.length||row.actual!==group.filter(s=>s.status==='mapped').length||row.exceptions!==group.filter(s=>s.status==='exception').length||row.unresolved!==group.filter(s=>s.status==='unresolved').length)return false;}
 return i.slots.every(s=>counts.has(`${s.season}/${s.kind}`));
 }catch{return false;}
}
const loaded=new Map<string,MediaState>();
const pending=new Map<string,Promise<MediaState>>();
let mediaGeneration=0;
let active:{key:string;generation:number;promise:Promise<void>}|undefined;
/** Capture one same-origin immutable release before requesting any metadata. */
export function loadMediaMetadata(options:{source?:Pick<typeof dataSource,'mode'|'mediaPath'>;fetcher?:typeof fetch}={}):Promise<void> {
 const source=options.source??dataSource,fetcher=options.fetcher??fetch;
 const paths=['credits.json','inventory.json','investigations.json'].map(name=>source.mediaPath(name));
 if(paths.some((p,index)=>!p.startsWith('/')||p.startsWith('//')||p.includes('..')||/[?#\\]/.test(p)||!p.endsWith('/'+['credits.json','inventory.json','investigations.json'][index])))return Promise.reject(new Error('Invalid media metadata paths'));
 const roots=paths.map(p=>p.slice(0,p.lastIndexOf('/')+1));if(new Set(roots).size!==1)return Promise.reject(new Error('Mixed media metadata release'));
 const key=paths.join('|');if(active?.key===key&&active.generation===mediaGeneration)return active.promise;
 const generation=++mediaGeneration;
 let request=source.mode==='bundled'?loaded.get(key):undefined;
 let task=pending.get(key);
 if(!request&&!task){task=Promise.all(paths.map(async path=>{const response=await fetcher(path,{cache:'no-store'});if(!response.ok)throw new Error('Could not load image metadata. Retry loading the season list.');return response.json() as Promise<unknown>;})).then(([c,i,e])=>{if(!validMediaMetadata(c,i,e))throw new Error('Image metadata is invalid or belongs to a different generation.');return {credits:c,inventory:i,investigations:e} as MediaState;});pending.set(key,task);}
 const promise=(async()=>{try{request??=await task!;if(generation!==mediaGeneration)throw new Error('Obsolete image metadata response');const state=structuredClone(request);const portraits=mappings(state.credits.assets,'portrait'),constructors=mappings(state.credits.assets,'constructor');mediaCredits=state.credits;mediaInventory=state.inventory;mediaInvestigations=state.investigations;portraitMappings=portraits;constructorMappings=constructors;if(source.mode==='bundled')loaded.set(key,state);}finally{if(pending.get(key)===task)pending.delete(key);if(active?.generation===generation)active=undefined;}})();
 active={key,generation,promise};return promise;
}
export function seasonMediaCoverage(snapshot:{season:number;drivers:Record<string,unknown>;constructors:Record<string,unknown>}) {return (['portrait','constructor'] as const).map(kind=>{const identities=Object.keys(kind==='portrait'?snapshot.drivers:snapshot.constructors);const rows=identities.map(identity=>mediaInventory.slots.find(row=>row.season===snapshot.season&&row.kind===kind&&row.identity===identity));const actual=rows.filter(row=>row?.status==='mapped'&&mediaCredits.assets.some(a=>a.kind===kind&&a.identity===row.identity&&a.filename===row.filename&&a.seasons.includes(snapshot.season))).length;const exceptions=rows.filter(row=>row?.status==='exception'&&mediaInvestigations.some(item=>item.kind===kind&&item.identity===row.identity&&item.season===snapshot.season)).length;return {season:snapshot.season,kind,total:identities.length,actual,exceptions,unresolved:identities.length-actual-exceptions};});}
export const mediaUrl=(filename:string)=>dataSource.mediaPath(filename);
export const mediaEvidenceUrl=(path:string)=>{if(!validAssetPath(path))throw new Error('Invalid visual evidence path');return mediaUrl(`evidence/${path}`);};
export function mappedMedia(kind:'portrait'|'constructor',identity:string,season:number):MediaAsset|undefined {const filename=(kind==='portrait'?portraitMappings:constructorMappings)[season]?.[identity];return filename?mediaCredits.assets.find(a=>a.filename===filename&&a.identity===identity&&a.kind===kind&&a.seasons.includes(season)):undefined;}
