import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evidenceFixture} from './evidence.fixtures.ts';
import {validSnapshotV2, validBundledManifestV2, validBundledSnapshotV2,supportEntryV2,migrateSnapshotV1} from './evidence.ts';
import {createEvidenceDataSource} from '../client/evidence-data-source.ts';
import type {SeasonSnapshot} from './contracts.ts';
test('ongoing, complete, source gaps, zero GP and unknown pending lifecycle',() => {
 const s=evidenceFixture(); assert.ok(validSnapshotV2(s,2026));
 s.schedule[1].sessions.gp.lifecycle='cancelled'; s.lifecycle='complete'; s.audit.completion=s.audit.provenance; assert.ok(validSnapshotV2(s,2026));
 s.schedule[0].gp='unavailable';s.results=[];s.coverage.gaps=['Round 1: gp source gap'];assert.ok(validSnapshotV2(s,2026));
 s.schedule[0].sessions.gp.lifecycle='unknown';s.analysisRounds=[];s.driverStandings=[];s.constructorStandings=[];s.lifecycle='ongoing';s.audit.status='pending';assert.ok(validSnapshotV2(s,2026));
 s.audit.status='verified'; assert.equal(validSnapshotV2(s,2026),false);
});
test('reject malformed generation, windows, canonical identities, applicability and provenance',() => {
 const mutations:((s:ReturnType<typeof evidenceFixture>)=>void)[]=[s=>{s.analysisRounds=[1,1]},s=>{s.analysisRounds=[2]},s=>{s.analysisRounds=[]},s=>{s.results[0].driverId='missing'},s=>{s.schedule[0].sessions.sprint.applicable=true},s=>{s.audit.provenance[0].observedAt='yesterday'},s=>{s.schedule[0].sessions.gp.provenance=[]},s=>{s.audit.endpoints[0].fetchedPages=0},s=>{s.refreshedAt='invalid'}];
 for(const mutate of mutations){const s=evidenceFixture();mutate(s);assert.equal(validSnapshotV2(s,2026),false);}
 assert.equal(validSnapshotV2({...evidenceFixture(),schemaVersion:3},2026),false);
});
test('pure explicit v1 migration preserves scoring/source timestamp and fails on contradictory evidence',()=>{
 const s=evidenceFixture();s.schedule=s.schedule.slice(0,1);s.coverage.checkedRounds=[1];s.lifecycle='complete';s.audit.completion=s.audit.provenance;
 const {audit:_,analysisRounds:__,lifecycle:___,...rest}=s;
 const v1:SeasonSnapshot={...rest,schemaVersion:1,snapshotId:'original-v1',schedule:s.schedule.map(({sessions:_,...r})=>r)};const before=structuredClone(v1);
 const evidence={snapshotId:'migrated-v2',lifecycle:s.lifecycle,schedule:s.schedule,audit:s.audit,migratedAt:'2026-10-30T01:00:00Z'};
 const migrated=migrateSnapshotV1(v1,evidence);assert.deepEqual(v1,before);assert.deepEqual(migrated.results,v1.results);assert.equal(migrated.refreshedAt,v1.refreshedAt);assert.equal(migrated.audit.migration?.snapshotId,v1.snapshotId);
 assert.throws(()=>migrateSnapshotV1(v1,{...evidence,schedule:[]}));assert.deepEqual(v1,before);
});
test('fixture bundle and local seams accept v2 and reject changed generation without API fallback',async()=>{
 const s=evidenceFixture();const entry={...supportEntryV2(s),assetPath:'bundled/releases/fixture/2026.json'};const manifest={bundleVersion:2,exportedAt:s.audit.auditedAt,seasons:[entry]};
 assert.ok(validBundledManifestV2(manifest));assert.ok(validBundledSnapshotV2(s,entry));
 for(const change of [{snapshotId:'other'},{refreshedAt:'2026-10-30T00:00:00Z'},{analysisRounds:[]},{audit:{...s.audit,auditId:'other'}},{schemaVersion:1}])assert.equal(validBundledSnapshotV2({...s,...change},entry),false);
 const paths:string[]=[];let bad=false;
 const fetcher=(async(path:unknown)=>{paths.push(String(path));return new Response(JSON.stringify(String(path).endsWith('manifest.json')?manifest:bad?{...s,snapshotId:'other'}:s));}) as typeof fetch;
 const bundled=createEvidenceDataSource('bundled','/site/',fetcher);assert.deepEqual(await bundled.loadSeason(2026),s);bad=true;await assert.rejects(bundled.loadSeason(2026));assert.ok(paths.every(p=>p.startsWith('/site/bundled/')));
 const local=createEvidenceDataSource('local','/',(async()=>new Response(JSON.stringify({data:s}))) as typeof fetch);assert.deepEqual(await local.loadSeason(2026),s);
});

test('media inventory counts every canonical slot once and distinguishes investigated exceptions',async()=>{
 const {mediaCoverageV2,validMediaSlotV2}=await import('./evidence.ts');const s=evidenceFixture();
 const slot={kind:'portrait' as const,identity:'a',season:2026,status:'mapped' as const,filename:'a.jpg',sourceUrl:'https://example.org/a',creator:'Photographer',license:'CC BY',licenseUrl:'https://example.org/license',attribution:'Photographer',applicableSeasons:[2026],photographDate:'unknown',cropNotes:'Centered',visualCheck:'Face checked'};
 const exception={kind:'constructor' as const,identity:'team',season:2026,status:'exception' as const,attemptedSources:['https://example.org/team'],blocker:'Historical mark unavailable under reusable terms',visualCheck:'Reviewed source mark'};
 assert.deepEqual(mediaCoverageV2([slot,exception],s).map(r=>[r.total,r.actual,r.exceptions]),[[1,1,0],[1,0,1]]);
 assert.throws(()=>mediaCoverageV2([slot],s));assert.throws(()=>mediaCoverageV2([slot,slot,exception],s));assert.equal(validMediaSlotV2({...slot,applicableSeasons:[2025]},s),false);assert.equal(validMediaSlotV2({...exception,attemptedSources:[]},s),false);
});

test('verified evidence requires exact endpoint families and per-round missing-record gaps',()=>{
  const absent=evidenceFixture();absent.driverStandings=[];
  assert.equal(validSnapshotV2(absent,2026),false);
  absent.coverage.gaps=['Round 2: driver standings unrelated gap'];
  assert.equal(validSnapshotV2(absent,2026),false);
  absent.coverage.gaps=['Round 1: driver standings successful-empty source gap'];
  assert.equal(validSnapshotV2(absent,2026),true);
  const held=evidenceFixture();held.results=[];held.schedule[0].gp='unavailable';
  held.coverage.gaps=['Round 1: qualifying unrelated gap'];
  assert.equal(validSnapshotV2(held,2026),false);
  held.coverage.gaps=['Round 1: gp successful-empty source gap'];
  assert.equal(validSnapshotV2(held,2026),true);
  for(const mutate of [
    (s:ReturnType<typeof evidenceFixture>)=>{s.audit.endpoints.splice(1,1)},
    (s:ReturnType<typeof evidenceFixture>)=>{s.audit.endpoints.push({...s.audit.endpoints[0]})},
    (s:ReturnType<typeof evidenceFixture>)=>{s.audit.endpoints[1].sourceUrl='https://example.org/2025/results.json'},
  ]){const s=evidenceFixture();mutate(s);assert.equal(validSnapshotV2(s,2026),false);}
});

test('explicit local v2 seam accepts actual mixed service manifest and keeps unchecked candidates disabled',async()=>{
  const s=evidenceFixture();const manifest={seasons:[supportEntryV2(s),{season:2011,verified:false,lastCheckedRound:0,knownGaps:['Audit not completed']}]};
  const source=createEvidenceDataSource('local','/',(async path=>Response.json({data:String(path).endsWith('/seasons')?manifest:s})) as typeof fetch);
  assert.deepEqual(await source.loadManifest(),manifest);
  assert.deepEqual(await source.loadSeason(2026),s);
});
