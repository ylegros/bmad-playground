import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, cp, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { prepareSiteSource } from './prepare-site-source.mjs';
import { seasonFixture } from '../tests/fixtures.ts';

test('isolated Site source preserves identity, excludes unrelated inputs and builds without server/cache', async () => {
  const root = await mkdtemp(join(tmpdir(),'pitwall-source-'));
  const source = join(root,'input'), destination = join(root,'site');
  try {
    await mkdir(source,{recursive:true});
    for (const file of ['app/client','app/shared','public/media','scripts/export-site.mjs','package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html']) {
      await mkdir(resolve(source,file,'..'),{recursive:true});
      await cp(resolve(file),join(source,file),{recursive:true});
    }
    await mkdir(join(source,'.cache/seasons'),{recursive:true});
    for(const year of [2010,2021]) {
      const snapshot=seasonFixture(year);
      snapshot.drivers.leclerc={id:'leclerc',name:'Charles Leclerc',code:'LEC',nationality:'Monégasque'};
      const checksum=createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
      await writeFile(join(source,'.cache/seasons',`${year}.json`),JSON.stringify({snapshot,checksum}));
    }
    const credits=JSON.parse(await readFile(join(source,'public/media/credits.json'),'utf8'));
    credits.assets=credits.assets.filter(asset=>asset.identity==='leclerc');
    credits.fallbacks=[2010,2021].flatMap(season=>{const snapshot=seasonFixture(season);return [
      ...Object.keys(snapshot.drivers).map(identity=>({kind:'portrait',identity,season,reason:'Synthetic fixture identity.'})),
      ...Object.keys(snapshot.constructors).map(identity=>({kind:'constructor',identity,season,reason:'Synthetic fixture identity.'})),
      ...(season===2010?[{kind:'portrait',identity:'leclerc',season,reason:'Only 2021 test portrait supplied.'}]:[])];});
    await writeFile(join(source,'public/media/credits.json'),JSON.stringify(credits));
    await writeFile(join(source,'public/unrelated.txt'),'must not publish');
    await mkdir(join(destination,'.openai'),{recursive:true});
    const identity={project_id:'test-only-source-identity',static:{directory:'dist'},custom:'preserved'};
    await writeFile(join(destination,'.openai/hosting.json'),JSON.stringify(identity));
    await prepareSiteSource(destination,source);
    assert.deepEqual(JSON.parse(await readFile(join(destination,'.openai/hosting.json'),'utf8')),identity);
    assert.deepEqual((await readdir(join(destination,'public'))).sort(),['bundled','media']);
    assert.deepEqual((await readdir(join(destination,'app'))).sort(),['client','shared']);
    await assert.rejects(readFile(join(destination,'.cache/seasons/2021.json')));
    assert.equal(JSON.parse(await readFile(join(destination,'data/2021.json'),'utf8')).checksum,undefined);
    await symlink(resolve('node_modules'),join(destination,'node_modules'),'junction');
    const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','build'],{cwd:destination,encoding:'utf8',shell:process.platform==='win32'});
    assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
    await assert.rejects(prepareSiteSource(source,source),/separate checkout/);
  } finally { await rm(root,{recursive:true,force:true}); }
});
