import { readFile, realpath, stat, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { validAssetPath, calendarDate, validSnapshot, utcTimestamp } from '../app/shared/validation.ts';
import { validSnapshotV2, validMediaSlotV2 } from '../app/shared/evidence.ts';
const text = v => typeof v === 'string' && !!v.trim();
const webUrl = v => { try { return text(v) && ['https:','http:'].includes(new URL(v).protocol); } catch { return false; } };
const key = (kind,id,year) => `${year}/${kind}/${id}`;
function assetSlot(asset,season,visualCheck) { return {kind:asset.kind,identity:asset.identity,season,status:'mapped',filename:asset.filename,sourceUrl:asset.sourceUrl,creator:asset.creator,license:asset.license,licenseUrl:asset.licenseUrl,attribution:asset.attribution,applicableSeasons:asset.seasons,photographDate:asset.portraitDate,cropNotes:asset.cropNotes,visualCheck}; }
/** Report mode retains unresolved rows; strict mode requires the full denominator accounted for. */
export async function inventoryMedia({snapshots,credits,investigations=[],mediaDirectory=resolve('public/media'),evidenceDirectory=resolve('.'),strict=false,checkedAt=new Date().toISOString()} = {}) {
  if (!Array.isArray(snapshots) || !snapshots.length || new Set(snapshots.map(s=>s.season)).size !== snapshots.length || snapshots.some(s=>!(s.schemaVersion === 1 ? validSnapshot(s,s.season):validSnapshotV2(s,s.season)))) throw new Error('Invalid canonical season snapshots');
  if (!credits || !Array.isArray(credits.assets) || !Array.isArray(investigations)) throw new Error('Invalid media metadata');
  const slots = new Map(); const files = new Map(); const root = await realpath(mediaDirectory);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const asset of credits.assets) {
      if (!asset || !['portrait','constructor'].includes(asset.kind) || !text(asset.identity) || !Array.isArray(asset.seasons) || !asset.seasons.length || new Set(asset.seasons).size !== asset.seasons.length || asset.seasons.some(y=>!Number.isInteger(y)||y<2010||y>2026) || !validAssetPath(`media/${asset.filename}`) || !/\.(png|jpe?g|webp)$/i.test(asset.filename) || !webUrl(asset.sourceUrl) || !webUrl(asset.licenseUrl) || ![asset.creator,asset.license,asset.attribution,asset.cropNotes].every(text) || !(asset.portraitDate === 'unknown' || calendarDate(asset.portraitDate))) throw new Error(`Invalid provenance: ${asset?.identity ?? 'unknown'}`);
      // Only validate offered seasons; unrelated existing approved mappings remain intact.
      const seasons=asset.seasons.filter(y=>snapshots.some(s=>s.season===y)); if (!seasons.length) continue;
      let file=files.get(asset.filename);
      if (!file) {
        const path=await realpath(resolve(root,asset.filename)).catch(()=>{throw new Error(`Missing media file: ${asset.filename}`)});
        if (relative(root,path).startsWith('..') || !(await stat(path)).isFile()) throw new Error(`Unsafe media file: ${asset.filename}`);
        const bytes=await readFile(path); const mime=/\.png$/i.test(asset.filename)?'image/png':/\.webp$/i.test(asset.filename)?'image/webp':'image/jpeg';
        const size=await page.evaluate(async data=>{const img=new Image();img.src=data;await img.decode();return {width:img.naturalWidth,height:img.naturalHeight};},`data:${mime};base64,${bytes.toString('base64')}`).catch(()=>{throw new Error(`Undecodable media file: ${asset.filename}`)});
        if (!size.width || !size.height) throw new Error(`Empty image: ${asset.filename}`);
        file={filename:asset.filename,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,...size}; files.set(asset.filename,file);
      }
      for(const season of seasons) {
        const snapshot=snapshots.find(s=>s.season===season);const slot=assetSlot(asset,season,'Decoded image; human identity/crop review remains separately recorded');
        if (!validMediaSlotV2(slot,snapshot)) throw new Error(`Wrong canonical identity or season: ${key(asset.kind,asset.identity,season)}`);
        const id=key(asset.kind,asset.identity,season);if(slots.has(id))throw new Error(`Duplicate media slot: ${id}`);slots.set(id,{...slot,...file});
      }
    }
    for(const item of investigations) {
      if (!snapshots.some(s=>s.season===item.season)) continue;
      const snapshot=snapshots.find(s=>s.season===item.season);
      if (!validMediaSlotV2(item,snapshot) || item.status !== 'exception' || item.blocker.trim().length < 32 || /^(not vetted|unavailable|missing|no image|fallback)[.! ]*$/i.test(item.blocker.trim()) || !validAssetPath(item.visualEvidence) || !utcTimestamp(item.reviewedAt) || (item.acceptance!==undefined&&!['accepted-by-user','pending-user-review'].includes(item.acceptance))) throw new Error(`Incomplete investigated exception: ${item.identity}`);
      const evidenceRoot=await realpath(evidenceDirectory);
      const evidencePath=await realpath(resolve(evidenceRoot,item.visualEvidence)).catch(()=>{throw new Error(`Missing visual evidence: ${item.identity}`)});
      if(relative(evidenceRoot,evidencePath).startsWith('..') || !(await stat(evidencePath)).isFile() || (await stat(evidencePath)).size === 0) throw new Error(`Invalid visual evidence: ${item.identity}`);
      const id=key(item.kind,item.identity,item.season);if(slots.has(id))throw new Error(`Duplicate media slot: ${id}`);slots.set(id,item);
    }
    const rows=snapshots.flatMap(s=>(['portrait','constructor']).flatMap(kind=>Object.keys(s[kind==='portrait'?'drivers':'constructors']).sort().map(identity=>slots.get(key(kind,identity,s.season))??{kind,identity,season:s.season,status:'unresolved',reason:'No validated mapped image or structured investigation; legacy fallback prose is not investigation evidence.'})));
    const coverage=snapshots.flatMap(s=>(['portrait','constructor']).map(kind=>{const group=rows.filter(r=>r.season===s.season&&r.kind===kind);return {season:s.season,kind,total:group.length,actual:group.filter(r=>r.status==='mapped').length,exceptions:group.filter(r=>r.status==='exception').length,unresolved:group.filter(r=>r.status==='unresolved').length};}));
    if(strict&&coverage.some(c=>c.unresolved))throw new Error('Incomplete media inventory: unresolved slots remain');
    const exceptionRows=rows.filter(r=>r.status==='exception');
    const accepted=exceptionRows.filter(r=>r.acceptance==='accepted-by-user').length;
    const scope=exceptionRows.length===0?'Inventory evidence; no investigated exceptions':accepted===exceptionRows.length?`Inventory evidence; all ${accepted} documented exceptions accepted by user`:`Inventory evidence; ${exceptionRows.length-accepted} documented exceptions await user acceptance`;
    return {inventoryVersion:2,checkedAt,scope,coverage,slots:rows};
  } finally { await browser.close(); }
}
export async function main(args=process.argv.slice(2)) {
  const options={snapshots:[],credits:JSON.parse(await readFile('public/media/credits.json','utf8')),investigations:JSON.parse(await readFile('public/media/investigations.json','utf8'))};let output;
  for(let i=0;i<args.length;i++) {const flag=args[i];if(flag==='--strict'){options.strict=true;continue;}const value=args[++i];if(!value)throw new Error(`Missing value for ${flag}`);if(flag==='--snapshot'){const raw=JSON.parse(await readFile(value,'utf8'));options.snapshots.push(raw.snapshot??raw);}else if(flag==='--output')output=value;else if(flag==='--media-dir')options.mediaDirectory=value;else throw new Error(`Unknown option ${flag}`);}
  const inventory=await inventoryMedia(options);if(output){await mkdir(dirname(resolve(output)),{recursive:true});await writeFile(output,JSON.stringify(inventory,null,2)+'\n');}process.stdout.write(JSON.stringify(inventory.coverage,null,2)+'\n');return inventory;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(error=>{process.stderr.write(error.message+'\n');process.exitCode=1;});
