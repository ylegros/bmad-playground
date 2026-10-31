import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildAuditedSnapshot, type AuditedCalendar } from './evidence-ingestion.ts';
import type { ProviderPage } from './provider-cache.ts';
import { SnapshotService } from './service.ts';
const provenance = [{ sourceUrl: 'https://official.example/calendar', observedAt: '2026-10-30T00:00:00Z', note: 'Independent session evidence' }];
function fixture() {
  const calendar: AuditedCalendar = { season: 2026, lifecycle: 'ongoing', provenance, completion: [], schedule: [1,2].map(round => ({round,date:`2026-01-0${round}`,sessions:{gp:{lifecycle:round===1?'held':'unheld',applicable:true,provenance},qualifying:{lifecycle:round===1?'held':'unheld',applicable:true,provenance},sprint:{lifecycle:'unheld',applicable:false,provenance}}})) };
  const observations = new Map<string, ProviderPage>();
  const source = {observations, async fetchPage(url:string): Promise<Record<string, any>> {
    const path = new URL(url).pathname;
    const standings = path.includes('Standings');
    const schedule = path.endsWith('/2026.json');
    const payload = {MRData:{total:schedule?'2':'0',offset:'0',limit:'100',[standings?'StandingsTable':'RaceTable']:{season:'2026',[standings?'StandingsLists':'Races']:schedule?calendar.schedule.map(r=>({season:'2026',round:String(r.round),date:r.date,raceName:`Race ${r.round}`})):[]}}};
    observations.set(url,{sourceUrl:url,observedAt:'2026-10-29T01:00:00Z',payload});return payload;
  }};
  return {calendar,source};
}
test('successful-empty held gaps stay verified in shared window; future lifecycle remains distinct',async()=>{
  const {calendar,source}=fixture();const s=await buildAuditedSnapshot(2026,calendar,source);
  assert.deepEqual(s.analysisRounds,[1]);assert.equal(s.audit.status,'verified');
  assert.equal(s.schedule[1].sessions.gp.lifecycle,'unheld');assert.equal(s.schedule[1].gp,'unavailable');
  assert.equal(s.refreshedAt,'2026-10-29T01:00:00Z');assert.equal(s.coverage.gaps.length,4);
  assert.ok(s.audit.endpoints.every(e=>e.expectedPages===e.fetchedPages));
});
test('unknown lifecycle, missing provenance, calendar mismatch and truncated acquisition fail closed',async()=>{
  {const {calendar,source}=fixture();calendar.schedule[0].sessions.gp.lifecycle='unknown';await assert.rejects(buildAuditedSnapshot(2026,calendar,source));}
  {const {calendar,source}=fixture();source.fetchPage=async()=>({});await assert.rejects(buildAuditedSnapshot(2026,calendar,source));}
  {const {calendar,source}=fixture();calendar.schedule[0].sessions.gp.provenance=[];await assert.rejects(buildAuditedSnapshot(2026,calendar,source));}
  {const {calendar,source}=fixture();source.fetchPage=async()=>{throw new Error('Truncated acquisition');};await assert.rejects(buildAuditedSnapshot(2026,calendar,source));}
});
test('cancelled GP remains in calendar outside analysis; complete season needs independent completion',async()=>{
  const {calendar,source}=fixture();
  calendar.schedule[1].sessions.gp.lifecycle='cancelled';
  calendar.schedule[1].sessions.qualifying.lifecycle='cancelled';
  calendar.lifecycle='complete';
  await assert.rejects(buildAuditedSnapshot(2026,calendar,source));
  calendar.completion=provenance;
  const s=await buildAuditedSnapshot(2026,calendar,source);
  assert.deepEqual(s.analysisRounds,[1]);assert.equal(s.schedule[1].sessions.gp.lifecycle,'cancelled');
});
test('v2 generation and matching support commit separately from baseline; failed refresh preserves exact bytes',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'audited-ingestion-'));
  try {
    const {calendar,source}=fixture();const snapshot=await buildAuditedSnapshot(2026,calendar,source);let fail=false;
    const operations:(boolean|undefined)[]=[];
    const service=new SnapshotService(directory,async(_year,refresh)=>{operations.push(refresh);if(fail)throw new Error('transport');return snapshot;});
    await service.get(2026);const file=join(service.v2Directory,'2026.json');const before=await readFile(file,'utf8');
    const entry=(await service.manifest()).seasons.find(s=>s.season===2026)!;
    assert.equal((entry as {snapshotId?:string}).snapshotId,snapshot.snapshotId);assert.equal(entry.verified,true);assert.equal((await service.manifest()).seasons.length,17);
    fail=true;await assert.rejects(service.get(2026,true));assert.equal(await readFile(file,'utf8'),before);assert.equal((await service.get(2026)).refreshedAt,snapshot.refreshedAt);
    assert.deepEqual(operations,[false,true]);
  }finally{await rm(directory,{recursive:true,force:true});}
});
