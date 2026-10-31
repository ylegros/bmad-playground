import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seasonFixture } from '../../tests/fixtures.ts';
import { progress } from './selectors.ts';
import { metricCell, evolutionSeries, chartGeometry, selectedEntities, validMetric } from './progress-model.ts';
test('evolution projects official points, true zero, gaps and source retirement status',()=>{
 const snapshot=seasonFixture();
 assert.deepEqual(evolutionSeries(snapshot,'drivers',['alpha'],'cumulative')[0].rows.map(row=>row.value),[25,50]);
 assert.equal(metricCell(progress(snapshot,'drivers','beta')[1],'gpPoints').value,0);
 assert.equal(metricCell(progress(snapshot,'drivers','beta')[1],'points').value,null);
 assert.equal(metricCell(progress(snapshot,'drivers','alpha')[0],'sprint').text,'Not applicable');
 assert.equal(metricCell(progress(snapshot,'drivers','beta')[1],'gp').value,20);
 assert.match(metricCell(progress(snapshot,'drivers','beta')[1],'gp').text,/Engine/);
 assert.equal(metricCell(progress(snapshot,'drivers','alpha')[1],'adjustment').value,-3);
});
test('category and selection validation preserves canonical IDs and only valid metrics',()=>{
 const snapshot=seasonFixture();
 assert.deepEqual(selectedEntities(snapshot,'drivers','alpha,first,alpha,beta'),['alpha','beta']);
 assert.equal(validMetric('constructors','gp'),'cumulative');assert.equal(validMetric('constructors','rank'),'rank');
});
test('geometry leaves absent classifications as gaps and ranks place 1 at top',()=>{
 const series=evolutionSeries(seasonFixture(),'drivers',['alpha'],'gp');
 series[0].rows.push({...series[0].rows[0],round:3,value:null},{...series[0].rows[0],round:4,value:4});
 const geometry=chartGeometry(series,true);
 assert.equal(geometry.paths[0].split('M').length-1,2);
 assert.ok(geometry.y(1)<geometry.y(4));
 assert.ok(chartGeometry(series,false).y(1)>chartGeometry(series,false).y(4));
});
test('retained results do not override unavailable session metadata',()=>{
 const snapshot=seasonFixture();
 snapshot.schedule[1].qualifying='unavailable';snapshot.schedule[1].gp='unavailable';snapshot.schedule[1].sprint='unavailable';
 const row=progress(snapshot,'drivers','alpha')[1];
 assert.equal(row.qualifyingPosition?.kind,'value');assert.equal(row.gpResult?.position.kind,'value');assert.equal(row.sprintResult?.position.kind,'value');
 for(const metric of ['qualifying','gp','sprint'] as const) assert.deepEqual(metricCell(row,metric),{value:null,text:'Unavailable'});
 row.sprint='not-applicable';assert.deepEqual(metricCell(row,'sprint'),{value:null,text:'Not applicable'});
});
import { canonicalSelection, matchingEntities, changeSelection } from './progress-model.ts';
test('full-list name matching and additive selection are deterministic and idempotent',()=>{
 const snapshot=seasonFixture();
 assert.deepEqual(matchingEntities(snapshot,'drivers','ALEX').map(item=>item.id),['alpha']);
 assert.equal(matchingEntities(snapshot,'drivers','').length,Object.keys(snapshot.drivers).length);
 assert.deepEqual(matchingEntities(snapshot,'drivers','no such identity'),[]);
 const union=changeSelection(['beta'],{type:'add',ids:matchingEntities(snapshot,'drivers','alex').map(item=>item.id)});
 assert.deepEqual(union,{ids:['alpha','beta'],changed:true});
 assert.deepEqual(changeSelection(union.ids,{type:'add',ids:['alpha','alpha']}),{ids:['alpha','beta'],changed:false});
 assert.deepEqual(changeSelection(union.ids,{type:'add',ids:[]}),{ids:['alpha','beta'],changed:false});
 assert.deepEqual(changeSelection(union.ids,{type:'remove',id:'alpha'}),{ids:['beta'],changed:true});
 assert.deepEqual(changeSelection(union.ids,{type:'clear'}),{ids:[],changed:true});
 assert.deepEqual(changeSelection([],{type:'clear'}),{ids:[],changed:false});
 assert.deepEqual(canonicalSelection(['beta','alpha','beta']),['alpha','beta']);
 assert.deepEqual(selectedEntities(snapshot,'drivers',null),[]);
 assert.deepEqual(matchingEntities(snapshot,'constructors','FIRST').map(item=>item.id),['first']);
});
