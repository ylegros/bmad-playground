import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { SeasonSnapshotV2, SessionEvidence } from './contracts.ts';
import { value } from './contracts.ts';
import { comparisonFixture } from './comparison.fixtures.ts';
import { comparisonSummary } from './comparison.ts';
import { progress } from './selectors.ts';
import { evolutionSeries, metricCell, chartGeometry } from './progress-model.ts';

// Saved synthetic evidence: does not claim any live-season verification.
export function ongoingFixture(): SeasonSnapshotV2 {
  const base = comparisonFixture();
  const evidence = (lifecycle: SessionEvidence['lifecycle'], applicable = true): SessionEvidence => ({ lifecycle, applicable, provenance: [{sourceUrl:'https://example.com/calendar',observedAt:'2026-10-30T00:00:00Z',note:'Synthetic saved lifecycle evidence'}] });
  return {...base,schemaVersion:2,lifecycle:'ongoing',analysisRounds:[1,2],audit:{auditId:'synthetic',auditedAt:'2026-10-30T00:00:00Z',status:'verified',provenance:[],completion:[],failures:[],endpoints:[]},schedule:[...base.schedule.map(row=>({...row,sessions:{gp:evidence('held'),qualifying:evidence('held'),sprint:evidence('unheld',false)}})),...['unheld','cancelled'].map((state,index)=>({round:index+3,name:state,date:'2026-11-01',gp:'unavailable' as const,qualifying:'complete' as const,sprint:'not-applicable' as const,sessions:{gp:evidence(state as 'unheld'|'cancelled'),qualifying:evidence('held'),sprint:evidence('unheld',false)}}))]};
}
test('all six categories share completed GP window; future qualifying does not enter comparison',()=>{
 const s=ongoingFixture();s.qualifying.push({round:3,driverId:'a',constructorId:'team',position:value(1)});
 const summary=comparisonSummary(s,'a','b')!;
 assert.deepEqual(summary.analysisRounds,[1,2]);
 assert.ok(summary.rows.every(row=>row.samples.scheduled===2));
 assert.equal(summary.rows.find(row=>row.id==='best-qualifying')!.a.kind,'value');
 const rows=progress(s,'drivers','a');assert.equal(metricCell(rows[2],'qualifying').value,1);
 assert.equal(metricCell(rows[2],'cumulative').text,'Not held');assert.equal(metricCell(rows[3],'gp').text,'Cancelled');
 const series=evolutionSeries(s,'drivers',['a'],'cumulative');assert.equal(series[0].rows[2].value,null);assert.equal(series[0].rows[3].value,null);
 assert.equal((chartGeometry(series,false).paths[0].match(/L/g)||[]).length,0);
});
test('held source gap remains in conservative denominator and breaks GP path',()=>{
 const s=ongoingFixture();s.schedule[1].gp='unavailable';s.results=s.results.filter(row=>row.round!==2);
 const summary=comparisonSummary(s,'a','b')!;assert.equal(summary.rows.find(row=>row.id==='best')!.a.kind,'unavailable');
 assert.deepEqual(summary.rows.find(row=>row.id==='best')!.samples,{a:1,b:1,scheduled:2});
 assert.equal(summary.rows.find(row=>row.id==='gp')!.excluded.length,1);
 assert.equal(metricCell(progress(s,'drivers','a')[1],'gp').value,null);
});
test('zero held GPs invents no category values or wins',()=>{
 const s=ongoingFixture();s.schedule.forEach(row=>{row.sessions.gp.lifecycle='unheld';row.gp='unavailable';});s.analysisRounds=[];
 const summary=comparisonSummary(s,'a','b')!;assert.equal(summary.comparable,0);assert.equal(summary.unavailable,6);
 assert.ok(summary.rows.every(row=>row.samples.scheduled===0));
});
test('official lag and fractional points retain source without extrapolation',()=>{
 const s=ongoingFixture();s.driverStandings.forEach(row=>{row.round=1;row.points=value(12.5);});
 const summary=comparisonSummary(s,'a','b')!;assert.equal(summary.standingsSourceRound,1);assert.equal(summary.standingsLag,1);
 assert.deepEqual(summary.rows.find(row=>row.id==='championship')!.a,value(12.5));
 assert.equal(metricCell(progress(s,'drivers','a')[1],'cumulative').value,null);
});
test('unknown status and substitute evidence remain conservative over held window',()=>{
 const s=ongoingFixture();s.results[1].status='Unknown status';
 assert.equal(comparisonSummary(s,'a','b')!.rows.find(row=>row.id==='dnf')!.a.kind,'unavailable');
 const summary=comparisonSummary(s,'a','substitute')!;
 for(const id of ['best','best-qualifying','dnf'])assert.equal(summary.rows.find(row=>row.id===id)!.b.kind,'unavailable');
});

test('held GP result gap preserves authoritative official cumulative points and rank',()=>{
 const s=ongoingFixture();s.schedule[1].gp='unavailable';s.results=s.results.filter(row=>row.round!==2);
 const row=progress(s,'drivers','a')[1];
 assert.deepEqual(metricCell(row,'cumulative'),{value:25,text:'25'});
 assert.deepEqual(metricCell(row,'rank'),{value:2,text:'2'});
 assert.equal(metricCell(row,'gp').value,null);
});
test('unavailable numeric GP and sprint positions retain source classification and status text',()=>{
 const s=ongoingFixture();s.results[0].position={kind:'unavailable',reason:'No numeric classification'};s.results[0].classification='R';s.results[0].status='Retired';
 s.schedule[0].sprint='complete';s.schedule[0].sessions.sprint={...s.schedule[0].sessions.gp};
 s.results.push({...s.results[0],kind:'sprint'});
 const row=progress(s,'drivers','a')[0];
 for(const metric of ['gp','sprint'] as const){const cell=metricCell(row,metric);assert.equal(cell.value,null);assert.match(cell.text,/R.*Retired/);}
});
test('adjustment uses preceding held GP across cancellation and never skips a held standings gap',()=>{
 const s=ongoingFixture();s.schedule[0].sessions.gp.lifecycle='cancelled';s.schedule[0].gp='unavailable';
 s.schedule[2].sessions.gp.lifecycle='held';s.schedule[2].gp='complete';s.analysisRounds=[2,3];
 s.results.push({...s.results[1],round:3,points:value(10)});
 s.driverStandings.push({...s.driverStandings[0],round:3,points:value(37.5)});
 let rows=progress(s,'drivers','a');
 assert.deepEqual(rows[1].adjustment,value(25)); // First held GP starts from zero.
 assert.deepEqual(rows[2].adjustment,value(2.5));
 s.schedule[1].sessions.gp.lifecycle='cancelled';s.schedule[1].gp='unavailable';s.schedule[0].sessions.gp.lifecycle='held';s.schedule[0].gp='complete';s.analysisRounds=[1,3];
 s.driverStandings.push({...s.driverStandings[0],round:1,points:value(25)});
 rows=progress(s,'drivers','a');assert.deepEqual(rows[2].adjustment,value(2.5));
 s.schedule[1].sessions.gp.lifecycle='held';s.schedule[1].gp='unavailable';s.analysisRounds=[1,2,3];
 s.driverStandings=s.driverStandings.filter(row=>row.round!==2);
 assert.equal(progress(s,'drivers','a')[2].adjustment.kind,'unavailable');
});
