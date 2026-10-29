import { test } from 'node:test';
import assert from 'node:assert/strict';
import { value, type SeasonSnapshot, type SessionResult } from './contracts.ts';
import { displayMetric, finalStandings, progress, teammate, resultText } from './selectors.ts';

const fixture = ():SeasonSnapshot => ({schemaVersion:1,snapshotId:'test',season:2021,refreshedAt:'2026-10-29T00:00:00Z',coverage:{checkedRounds:[1,2],gaps:[]},schedule:[{round:1,name:'First',date:'2021-01-01',gp:'complete',sprint:'not-applicable',qualifying:'complete'},{round:2,name:'Second',date:'2021-01-02',gp:'complete',sprint:'complete',qualifying:'complete'}],drivers:{},constructors:{},results:[],qualifying:[],driverStandings:[],constructorStandings:[]});
const result = (driverId:string,round:number,kind:'gp'|'sprint',points:number,constructorId='team'):SessionResult=>({driverId,round,kind,constructorId,points:value(points),position:value(1),classification:'1',status:'Finished'});
test('driver round points distinguish zero, no sprint, missing sprint and official adjustments',()=>{
  const data=fixture();data.results=[result('a',1,'gp',0),result('a',2,'gp',12.5)];
  data.driverStandings=[{round:1,driverId:'a',constructorIds:['team'],position:value(1),points:value(0)},{round:2,driverId:'a',constructorIds:['team'],position:value(2),points:value(9.5)}];
  const rows=progress(data,'drivers','a');
  assert.equal(displayMetric(rows[0].points),'0');assert.equal(rows[0].sprint,'not-applicable');assert.equal(displayMetric(rows[1].points),'Unavailable');assert.equal(displayMetric(rows[1].cumulative),'9.5');
  data.results.push(result('a',2,'sprint',3));assert.equal(displayMetric(progress(data,'drivers','a')[1].points),'15.5');
  assert.equal(displayMetric(progress(data,'drivers','a')[1].adjustment),'-6');
  assert.equal(displayMetric(rows[0].adjustment),'0');
  data.driverStandings=data.driverStandings.filter(row=>row.round!==1);
  assert.equal(displayMetric(progress(data,'drivers','a')[1].adjustment),'Unavailable');
});
test('constructor earned points sum session affiliations without substituting championship totals',()=>{
  const data=fixture();data.results=[result('a',2,'gp',10),result('b',2,'gp',2),result('a',2,'sprint',3),result('b',2,'sprint',0),result('c',2,'gp',20,'other')];
  data.constructorStandings=[{round:2,constructorId:'team',position:value(2),points:value(50)}];
  const row=progress(data,'constructors','team')[1];assert.equal(displayMetric(row.points),'15');assert.equal(displayMetric(row.cumulative),'50');
  assert.equal(displayMetric(row.adjustment),'Unavailable');
  data.constructorStandings.push({round:1,constructorId:'team',position:value(1),points:value(40.5)});
  assert.equal(displayMetric(progress(data,'constructors','team')[1].adjustment),'-5.5');
  data.schedule[1].sprint='unavailable';assert.equal(displayMetric(progress(data,'constructors','team')[1].points),'Unavailable');
});
test('teammates are season-relative with GP preference and driver ID tie break',()=>{
  const data=fixture();data.results=[result('a',1,'gp',0),result('initial',1,'gp',0),result('a',2,'gp',0),result('latest-z',2,'gp',0),result('latest-b',2,'gp',0),result('a',2,'sprint',0),result('sprint',2,'sprint',0)];
  assert.equal(teammate(data,'a','first'),'initial');assert.equal(teammate(data,'a','latest'),'latest-b');assert.equal(teammate(data,'absent','latest'),undefined);
});
test('official final standings use last reported round and nonfinishes retain source status',()=>{
  assert.deepEqual(finalStandings([{round:1,id:'old'},{round:3,id:'new'}]),[{round:3,id:'new'}]);
  assert.equal(resultText({...result('a',1,'gp',0),classification:'R',status:'Engine'}),'R · Engine');
});
