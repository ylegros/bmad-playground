import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {exportSite, publicSnapshotV2} from './export-site.mjs';
import {candidateSeasons, validBundledManifestV2, validBundledSnapshotV2} from '../app/shared/evidence.ts';

// Delivery verification reads committed cache bytes; it never refreshes or acquires data.
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const manifestBefore = await readFile('public/bundled/manifest.json');
const localBefore = await readFile('.cache/seasons-v2/2026.json');
async function releaseHashes(directory) {
 const files=await readdir(directory,{withFileTypes:true});
 const hashes=[];
 for(const file of files.sort((a,b)=>a.name.localeCompare(b.name))) {
  const filename=join(directory,file.name);
  if(file.isDirectory())hashes.push(...await releaseHashes(filename));
  else hashes.push([filename,createHash('sha256').update(await readFile(filename)).digest('hex')]);
 }
 return hashes;
}
const previousRoots=[...new Set(JSON.parse(manifestBefore).seasons.map(row=>row.assetPath.slice(0,row.assetPath.lastIndexOf('/'))))];
const previousReleaseBytes=await Promise.all(previousRoots.map(root=>releaseHashes(join('public',root))));
await assert.rejects(exportSite({iterationThree:true, cacheDirectory:'.cache/seasons-v2', mediaDirectory:'missing-delivery-media'}),error=>error.code==='ENOENT'&&String(error.path).includes('missing-delivery-media'));
assert.deepEqual(await readFile('public/bundled/manifest.json'),manifestBefore);
assert.deepEqual(await readFile('.cache/seasons-v2/2026.json'),localBefore);
assert.deepEqual(await Promise.all(previousRoots.map(root=>releaseHashes(join('public',root)))),previousReleaseBytes);
const manifest = await exportSite({iterationThree:true, cacheDirectory:'.cache/seasons-v2'});
assert.ok(validBundledManifestV2(manifest));
assert.deepEqual(manifest.seasons.map(row=>row.season),candidateSeasons);
for(const entry of manifest.seasons) {
 const local=(await read(`.cache/seasons-v2/${entry.season}.json`)).snapshot;
 const bundled=await read(`public/${entry.assetPath}`);
 assert.ok(validBundledSnapshotV2(bundled,entry));
 assert.deepEqual(bundled,publicSnapshotV2(local));
}
const entry=manifest.seasons.find(row=>row.season===2026);
const snapshot=(await read('.cache/seasons-v2/2026.json')).snapshot;
const releaseRoot=entry.assetPath.slice(0,entry.assetPath.lastIndexOf('/'));
const credits=await read(`public/${releaseRoot}/media/credits.json`);
const inventory=await read(`public/${releaseRoot}/media/inventory.json`);
const report={verifiedAt:new Date().toISOString(),releaseId:releaseRoot.split('/').at(-1),exportedAt:manifest.exportedAt,
 snapshotId:snapshot.snapshotId,refreshedAt:snapshot.refreshedAt,auditId:snapshot.audit.auditId,auditedAt:snapshot.audit.auditedAt,
 analysisRounds:snapshot.analysisRounds,cutoff:snapshot.schedule.find(row=>row.round===snapshot.analysisRounds.at(-1)),
 localCacheSha256:createHash('sha256').update(localBefore).digest('hex'),
 verifiedSeasonCount:manifest.seasons.length,payloadsMatchLocal:true,sourceMetadataMatches:true,
 failedExportRetainedManifest:true,failedExportRetainedLocal:true,failedExportRetainedReleaseFiles:true,creditedAssets:credits.assets.length,
 mediaCoverage2026:inventory.coverage.filter(row=>row.season===2026),publicationPerformed:false};
await mkdir('_bmad-output/implementation-artifacts/next-iteration/bundle',{recursive:true});
await writeFile('_bmad-output/implementation-artifacts/next-iteration/bundle/verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
