import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,cp,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {evidenceFixture} from '../app/shared/evidence.fixtures.ts';
import {candidateSeasons,validBundledSnapshotV2} from '../app/shared/evidence.ts';
import {inventoryMedia} from './media-inventory.mjs';
import {exportSite} from './export-site.mjs';
import {prepareSiteSource} from './prepare-site-source.mjs';

// Synthetic saved fixtures validate contracts only; these never establish real acquisition.
test('complete synthetic 17-year v2 release preserves evidence and retains good pointer on failures',async()=>{
 const root=await mkdtemp(join(tmpdir(),'export-v2-'));
 try {
  const payloadDirectory=join(root,'data'),mediaDirectory=join(root,'media'),outputDirectory=join(root,'bundled');
  await mkdir(payloadDirectory);await mkdir(mediaDirectory);await writeFile(join(mediaDirectory,'visual.png'),'synthetic visual check evidence');
  const snapshots=candidateSeasons.map(season=>({...evidenceFixture(season),snapshotId:`test-only-${season}`}));
  for(const s of snapshots)await writeFile(join(payloadDirectory,`${s.season}.json`),JSON.stringify(s));
  const credits={assets:[],fallbacks:[]};
  const investigations=snapshots.flatMap(s=>['portrait','constructor'].map(kind=>({kind,identity:kind==='portrait'?'a':'team',season:s.season,status:'exception',attemptedSources:['https://example.org/test-only'],blocker:'Synthetic test identity has no real acquisition; this is test evidence only.',visualCheck:'Synthetic fallback inspected for this contract test.',visualEvidence:'media/visual.png',reviewedAt:'2026-10-30T00:00:00Z'})));
  credits.fallbacks=investigations.map(({kind,identity,season,blocker})=>({kind,identity,season,reason:blocker}));
  const inventory=await inventoryMedia({snapshots,credits,investigations,mediaDirectory,evidenceDirectory:root,strict:true});
  for(const [name,value] of Object.entries({'credits.json':credits,'investigations.json':investigations,'inventory.json':inventory}))await writeFile(join(mediaDirectory,name),JSON.stringify(value));
  const options={exportedAt:'2026-10-30T00:00:00Z',payloadDirectory,mediaDirectory,outputDirectory,evidenceDirectory:root,iterationThree:true};
  const manifest=await exportSite(options);assert.equal(manifest.bundleVersion,2);assert.equal(manifest.seasons.length,17);
  const release=join(outputDirectory,'releases',manifest.seasons[0].assetPath.split('/')[2]);
  for(const entry of manifest.seasons){const s=JSON.parse(await readFile(join(release,`${entry.season}.json`),'utf8'));assert.ok(validBundledSnapshotV2(s,entry));assert.equal(s.refreshedAt,'2026-10-29T00:00:00Z');}
  const good=await readFile(join(outputDirectory,'manifest.json'),'utf8');
  const rejects=async()=>{await assert.rejects(exportSite(options));assert.equal(await readFile(join(outputDirectory,'manifest.json'),'utf8'),good);};
  await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify({...credits,fallbacks:credits.fallbacks.map((row,i)=>i?row:{...row,reason:{secret:'PRIVATE'}})}));await rejects();await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify(credits));
  await writeFile(join(mediaDirectory,'inventory.json'),JSON.stringify({...inventory,scope:{secret:'PRIVATE'}}));
  const scoped=await exportSite(options);assert.equal(scoped.seasons[0].assetPath,manifest.seasons[0].assetPath);assert.equal((await readFile(join(release,'media/inventory.json'),'utf8')).includes('PRIVATE'),false);
  await writeFile(join(mediaDirectory,'inventory.json'),JSON.stringify(inventory));
  await rm(join(payloadDirectory,'2011.json'));await rejects();await writeFile(join(payloadDirectory,'2011.json'),JSON.stringify(snapshots[1]));
  await writeFile(join(payloadDirectory,'2010.json'),JSON.stringify({...snapshots[0],schemaVersion:1}));await rejects();
  const badAudit=structuredClone(snapshots[0]);badAudit.audit.endpoints[0].fetchedPages=0;await writeFile(join(payloadDirectory,'2010.json'),JSON.stringify(badAudit));await rejects();
  const injected=structuredClone(snapshots[0]);injected.audit.provenance[0].secret='PRIVATE';await writeFile(join(payloadDirectory,'2010.json'),JSON.stringify(injected));
  const clean=await exportSite(options);assert.equal(clean.seasons[0].assetPath,manifest.seasons[0].assetPath);assert.equal((await readFile(join(release,'2010.json'),'utf8')).includes('PRIVATE'),false);
  const wrongInventory=structuredClone(inventory);wrongInventory.coverage[0].actual=99;await writeFile(join(mediaDirectory,'inventory.json'),JSON.stringify(wrongInventory));await rejects();await writeFile(join(mediaDirectory,'inventory.json'),JSON.stringify(inventory));
  const source=join(root,'source'),destination=join(root,'site');await mkdir(source);
  for(const name of ['app/client','app/shared','scripts/export-site.mjs','scripts/media-inventory.mjs','package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html']){await mkdir(dirname(join(source,name)),{recursive:true});await cp(resolve(name),join(source,name),{recursive:true});}
  const packageInput=JSON.parse(await readFile(join(source,'package.json'),'utf8'));packageInput.privateMetadata={secret:'PRIVATE'};await writeFile(join(source,'package.json'),JSON.stringify(packageInput));
  await mkdir(join(source,'public'),{recursive:true});await cp(mediaDirectory,join(source,'public/media'),{recursive:true});await cp(mediaDirectory,join(source,'media'),{recursive:true});
  await mkdir(join(source,'.cache/seasons-v2'),{recursive:true});
  for(const snapshot of snapshots)await writeFile(join(source,'.cache/seasons-v2',`${snapshot.season}.json`),JSON.stringify({snapshot,checksum:createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')}));
  await mkdir(join(destination,'.openai'),{recursive:true});const hosting={project_id:'synthetic-only',static:{directory:'dist'},audience:'anyone-with-link'};await writeFile(join(destination,'.openai/hosting.json'),JSON.stringify(hosting));
  await prepareSiteSource(destination,source,{iterationThree:true,bundleDirectory:join(root,'isolated/bundled')});assert.deepEqual(JSON.parse(await readFile(join(destination,'.openai/hosting.json'),'utf8')),hosting);
  await assert.rejects(readFile(join(source,'public/bundled/manifest.json')),'isolated preparation does not promote the workspace manifest');
  assert.equal((await readFile(join(destination,'package.json'),'utf8')).includes('PRIVATE'),false);
  await assert.rejects(readFile(join(destination,'.cache/seasons-v2/2010.json')));
  await symlink(resolve('node_modules'),join(destination,'node_modules'),'junction');
  const built=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','build'],{cwd:destination,encoding:'utf8',shell:process.platform==='win32'});assert.equal(built.status,0,built.stdout+'\n'+built.stderr);
  await writeFile(join(release,'2010.json'),'corrupt');await rejects();
 }finally{await rm(root,{recursive:true,force:true});}
});
