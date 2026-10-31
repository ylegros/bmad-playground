import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {inventoryMedia} from './media-inventory.mjs';
import {evidenceFixture} from '../app/shared/evidence.fixtures.ts';
const source=JSON.parse(await readFile('public/media/credits.json','utf8')).assets[0];
const asset={...source,kind:'portrait',identity:'a',seasons:[2026],filename:'a.jpg'};
const exception={kind:'constructor',identity:'team',season:2026,status:'exception',attemptedSources:['https://example.org/team'],blocker:'Candidate mark belongs to a successor identity introduced in 2027',visualCheck:'Reviewed source mark; rejected historical mismatch',visualEvidence:'evidence/source-review.jpg',reviewedAt:'2026-10-30T00:00:00Z'};
async function setup(fn){const dir=await mkdtemp(join(tmpdir(),'media-inventory-'));try{await writeFile(join(dir,'a.jpg'),await readFile(`public/media/${source.filename}`));await mkdir(join(dir,'evidence'));await writeFile(join(dir,'evidence/source-review.jpg'),await readFile(`public/media/${source.filename}`));await fn(dir);}finally{await rm(dir,{recursive:true,force:true});}}
test('canonical denominator, actual bytes, explicit exception, reused seasons and generic fallback distinction',async()=>setup(async mediaDirectory=>{
 const opts={snapshots:[evidenceFixture()],credits:{assets:[asset],fallbacks:[{kind:'constructor',identity:'team',season:2026,reason:'Not vetted'}]},mediaDirectory,evidenceDirectory:mediaDirectory};
 const report=await inventoryMedia(opts);assert.deepEqual(report.coverage.map(c=>[c.total,c.actual,c.exceptions,c.unresolved]),[[1,1,0,0],[1,0,0,1]]);assert.match(report.slots[0].sha256,/^[a-f0-9]{64}$/);assert.ok(report.slots[0].width>0);
 await assert.rejects(inventoryMedia({...opts,strict:true}),/unresolved/);
 const complete=await inventoryMedia({...opts,investigations:[exception],strict:true});assert.equal(complete.coverage[1].exceptions,1);
 const older=evidenceFixture(2025);
 const reused=await inventoryMedia({...opts,snapshots:[older,evidenceFixture()],credits:{assets:[{...asset,seasons:[2025,2026]}]}});assert.deepEqual(reused.coverage.filter(c=>c.kind==='portrait').map(c=>c.actual),[1,1]);
}));
test('missing corrupt duplicate wrong identity/season and incomplete provenance reject',async()=>setup(async mediaDirectory=>{
 const opts={snapshots:[evidenceFixture()],credits:{assets:[asset]},mediaDirectory,evidenceDirectory:mediaDirectory};
 for(const modified of [{...asset,sourceUrl:''},{...asset,licenseUrl:'javascript:alert(1)'},{...asset,portraitDate:'2026-02-30'},{...asset,seasons:[2026,2026]},{...asset,identity:'wrong'},{...asset,filename:'../escape.jpg'},{...asset,filename:'missing.jpg'}]) await assert.rejects(inventoryMedia({...opts,credits:{assets:[modified]}}));
 await assert.rejects(inventoryMedia({...opts,credits:{assets:[asset,asset]}}),/Duplicate/);
 await assert.rejects(inventoryMedia({...opts,investigations:[{...exception,attemptedSources:[]}]}),/Incomplete/);
 await assert.rejects(inventoryMedia({...opts,investigations:[{...exception,blocker:'Not vetted'}]}),/Incomplete/);
 await assert.rejects(inventoryMedia({...opts,investigations:[{...exception,visualEvidence:''}]}),/Incomplete/);
 await assert.rejects(inventoryMedia({...opts,investigations:[{...exception,visualEvidence:'evidence/missing.png'}]}),/Missing visual/);
 await assert.rejects(inventoryMedia({...opts,investigations:[{...exception,kind:'portrait',identity:'a'}]}),/Duplicate/);
 await writeFile(join(mediaDirectory,'a.jpg'),'not an image');await assert.rejects(inventoryMedia(opts),/Undecodable/);
}));
