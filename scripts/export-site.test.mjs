import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { exportSite } from './export-site.mjs';
import { inventoryMedia } from './media-inventory.mjs';
import { seasonFixture } from '../tests/fixtures.ts';

test('validated cache and sanitized payload exports preserve source identity and reject invalid releases atomically', async () => {
  const root = await mkdtemp(join(tmpdir(),'pitwall-export-'));
  const cacheDirectory=join(root,'cache'), payloadDirectory=join(root,'payloads'), mediaDirectory=join(root,'media'), outputDirectory=join(root,'public/bundled');
  try {
    for (const directory of [cacheDirectory,payloadDirectory,mediaDirectory]) await mkdir(directory,{recursive:true});
    const options={cacheDirectory,mediaDirectory,outputDirectory};
    const writeCache=async (year,snapshot,checksum) => writeFile(join(cacheDirectory,`${year}.json`),JSON.stringify({snapshot,checksum:checksum??createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')}));
    for (const year of [2010,2021]) { await writeCache(year,seasonFixture(year)); await writeFile(join(payloadDirectory,`${year}.json`),JSON.stringify(seasonFixture(year))); }
    const credits={assets:[{kind:'portrait',identity:'alpha',seasons:[2010,2021],filename:'portrait.png',sourceUrl:'https://example.com/source',creator:'Test creator',license:'CC0',licenseUrl:'https://example.com/license',attribution:'Test asset',portraitDate:'unknown',cropNotes:'Unmodified test asset'}],fallbacks:[{kind:'portrait',identity:'beta',season:2010,reason:'No vetted image'}]};
    credits.fallbacks = [2010,2021].flatMap(season => {
      const snapshot = seasonFixture(season);
      return [...Object.keys(snapshot.drivers).filter(id => id !== 'alpha').map(identity => ({kind:'portrait',identity,season,reason:'Synthetic test identity; no image supplied.'})),
        ...Object.keys(snapshot.constructors).map(identity => ({kind:'constructor',identity,season,reason:'Synthetic test identity; no image supplied.'}))];
    });
    await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify(credits));
    const png=await readFile(resolve('tests/fixtures/media/one-pixel.png'));
    await writeFile(join(mediaDirectory,'portrait.png'),png);
    await writeFile(join(mediaDirectory,'investigations.json'),'[]');
    const inventory=await inventoryMedia({snapshots:[seasonFixture(2010),seasonFixture(2021)],credits,mediaDirectory,checkedAt:'2026-10-30T00:00:00Z'});
    await writeFile(join(mediaDirectory,'inventory.json'),JSON.stringify(inventory));
    const manifest=await exportSite(options);
    assert.deepEqual(manifest.seasons.map(s=>s.season),[2010,2021]);
    const expanded={...credits,assets:credits.assets.map(asset=>({...asset,seasons:[2010,2011,2021]})),fallbacks:[...credits.fallbacks,{kind:'constructor',identity:'future-team',season:2011,reason:'Synthetic future-season identity.'}]};
    await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify(expanded));
    const filtered=await exportSite(options);
    assert.equal(filtered.seasons[0].assetPath,manifest.seasons[0].assetPath,'unoffered valid applicability must not change legacy generation');
    await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify(credits));
    const before=await readFile(join(outputDirectory,'manifest.json'),'utf8');
    for (const entry of manifest.seasons) {
      const exported=JSON.parse(await readFile(resolve(outputDirectory,'..',entry.assetPath),'utf8'));
      assert.equal(exported.snapshotId,seasonFixture(entry.season).snapshotId);
      assert.equal(exported.refreshedAt,seasonFixture(entry.season).refreshedAt);
      assert.equal(exported.checksum,undefined);
    }
    const releaseDirectory=join(outputDirectory,'releases',manifest.seasons[0].assetPath.split('/')[2]);
    const exportedInventory=JSON.parse(await readFile(join(releaseDirectory,'media/inventory.json'),'utf8'));
    assert.equal(exportedInventory.checkedAt,'2026-10-30T00:00:00Z');
    assert.deepEqual(exportedInventory.slots.filter(row=>row.status==='mapped').map(row=>row.applicableSeasons),[[2010,2021],[2010,2021]]);
    assert.ok(exportedInventory.slots.filter(row=>row.status==='mapped').every(row=>row.width===1&&row.height===1&&row.bytes===png.length));
    assert.deepEqual((await readdir(releaseDirectory)).sort(),['2010.json','2021.json','media']);
    await exportSite(options); // Exact existing content can be reused.
    const stable=await readFile(join(outputDirectory,'manifest.json'),'utf8');
    for (const file of ['2010.json','media/portrait.png','media/credits.json','media/inventory.json','media/investigations.json']) {
      const path=join(releaseDirectory,file), original=await readFile(path);
      for (const action of [()=>writeFile(path,'corrupt'),()=>rm(path)]) {
        await action();
        await assert.rejects(exportSite(options),/corrupt or incomplete/);
        assert.equal(await readFile(join(outputDirectory,'manifest.json'),'utf8'),stable);
        await writeFile(path,original);
      }
    }
    await writeFile(join(outputDirectory,'manifest.json'),before);
    for (const patch of [{kind:'unknown'},{identity:'missing'},{seasons:null},{seasons:[]},{seasons:[2000]},{portraitDate:'2010-02-30'},{cropNotes:null},{licenseUrl:'javascript:alert(1)'},{sourceUrl:''},{creator:''},{license:''},{attribution:''},{filename:'../private'}]) {
      await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify({...credits,assets:[{...credits.assets[0],...patch}]}));
      await assert.rejects(exportSite(options),/credits or provenance/);
      assert.equal(await readFile(join(outputDirectory,'manifest.json'),'utf8'),before);
    }
    for (const patch of [{kind:'unknown'},{identity:'missing'},{season:2000},{reason:''}]) {
      await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify({...credits,fallbacks:[{...credits.fallbacks[0],...patch}]}));
      await assert.rejects(exportSite(options),/credits or provenance/);
    }
    for (const invalid of [
      {...credits,fallbacks:credits.fallbacks.slice(1)},
      {...credits,fallbacks:[...credits.fallbacks,credits.fallbacks[0]]},
      {...credits,fallbacks:[...credits.fallbacks,{kind:'portrait',identity:'alpha',season:2010,reason:'Conflicts with image'}]},
      {...credits,assets:[...credits.assets,{...credits.assets[0],filename:'second.png'}]}
    ]) {
      await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify(invalid));
      await assert.rejects(exportSite(options),/credits or provenance/);
      assert.equal(await readFile(join(outputDirectory,'manifest.json'),'utf8'),before);
    }
    await writeFile(join(mediaDirectory,'credits.json'),JSON.stringify(credits));
    const injected=seasonFixture(2010);
    for (const record of [injected,injected.coverage,...injected.schedule,Object.values(injected.drivers)[0],Object.values(injected.constructors)[0],...injected.results,...injected.qualifying,...injected.driverStandings,...injected.constructorStandings,injected.results[0].position,injected.results[0].points]) record.privateMetadata='DO_NOT_PUBLISH';
    await writeCache(2010,injected);
    const clean=await exportSite(options);
    assert.equal(clean.seasons[0].assetPath,manifest.seasons[0].assetPath,'unknown metadata cannot alter public release');
    const publicJson=await readFile(join(releaseDirectory,'2010.json'),'utf8');
    assert.equal(publicJson.includes('DO_NOT_PUBLISH'),false);
    assert.deepEqual(JSON.parse(publicJson),seasonFixture(2010));
    await writeFile(join(outputDirectory,'manifest.json'),before);
    const rejects=async change => { await writeCache(2010,seasonFixture(2010)); await change(); await assert.rejects(exportSite(options)); assert.equal(await readFile(join(outputDirectory,'manifest.json'),'utf8'),before); };
    await rejects(()=>writeCache(2010,seasonFixture(2010),'wrong'));
    for (const patch of [{season:2021},{schemaVersion:2},{snapshotId:''},{refreshedAt:'bad'},{coverage:{checkedRounds:[1,2],gaps:['not verified']}}]) await rejects(()=>writeCache(2010,{...seasonFixture(2010),...patch}));
    await rejects(()=>rm(join(cacheDirectory,'2010.json')));
    await writeCache(2010,seasonFixture(2010));
    for(const name of ['inventory.json','investigations.json']) {
      const original=await readFile(join(mediaDirectory,name));await rejects(()=>rm(join(mediaDirectory,name)));await writeFile(join(mediaDirectory,name),original);
    }
    await rejects(()=>rm(join(mediaDirectory,'portrait.png')));
    await writeFile(join(mediaDirectory,'portrait.png'),Buffer.concat([png,Buffer.from('changed valid PNG bytes')]));
    const sanitized=await exportSite({payloadDirectory,mediaDirectory,outputDirectory});
    assert.equal(sanitized.seasons[0].snapshotId,'fixture-2010');
    assert.notEqual(sanitized.seasons[0].assetPath,manifest.seasons[0].assetPath,'changed media receives a new release path');
    await writeFile(join(payloadDirectory,'2021.json'),JSON.stringify({...seasonFixture(),season:2010}));
    await assert.rejects(exportSite({payloadDirectory,mediaDirectory,outputDirectory}));
  } finally { await rm(root,{recursive:true,force:true}); }
});
