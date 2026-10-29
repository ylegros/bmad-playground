import type { SeasonSnapshot } from '../app/shared/contracts.ts';
import { value } from '../app/shared/contracts.ts';

// Deliberately small synthetic season for UI behavior tests; never product data.
export function seasonFixture(season = 2021): SeasonSnapshot {
  const drivers = { alpha: { id:'alpha',name:'Alex Example',code:'ALE',nationality:'Test' }, beta: {id:'beta',name:'Blair Example',code:'BLA',nationality:'Test'}, gamma: {id:'gamma',name:'Casey Example',code:'CAS',nationality:'Test'} };
  const constructors = { first: {id:'first',name:'First Racing',nationality:'Test'}, second: {id:'second',name:'Second Racing',nationality:'Test'} };
  return {
    schemaVersion:1,snapshotId:`fixture-${season}`,season,refreshedAt:'2026-10-28T12:00:00Z',
    coverage:{checkedRounds:[1,2],gaps:[]},drivers,constructors,
    schedule:[{round:1,name:'Opening Grand Prix',date:`${season}-03-01`,gp:'complete',qualifying:'complete',sprint:'not-applicable'}, {round:2,name:'Sprint Grand Prix',date:`${season}-07-01`,gp:'complete',qualifying:'complete',sprint:'complete'}],
    results:[
      {round:1,kind:'gp',driverId:'alpha',constructorId:'first',position:value(1),classification:'1',status:'Finished',points:value(25)},
      {round:1,kind:'gp',driverId:'beta',constructorId:'first',position:value(2),classification:'2',status:'Finished',points:value(18)},
      {round:2,kind:'gp',driverId:'alpha',constructorId:'first',position:value(1),classification:'1',status:'Finished',points:value(25)},
      {round:2,kind:'gp',driverId:'beta',constructorId:'second',position:value(20),classification:'R',status:'Engine',points:value(0)},
      {round:2,kind:'gp',driverId:'gamma',constructorId:'first',position:value(2),classification:'2',status:'Finished',points:value(18)},
      {round:2,kind:'sprint',driverId:'alpha',constructorId:'first',position:value(1),classification:'1',status:'Finished',points:value(3)},
      {round:2,kind:'sprint',driverId:'gamma',constructorId:'first',position:value(2),classification:'2',status:'Finished',points:value(2)},
    ],
    qualifying:[{round:1,driverId:'alpha',constructorId:'first',position:value(1)},{round:2,driverId:'alpha',constructorId:'first',position:value(1)},{round:2,driverId:'beta',constructorId:'second',position:value(20)}],
    driverStandings:[
      {round:1,driverId:'alpha',constructorIds:['first'],position:value(1),points:value(25)},
      {round:1,driverId:'beta',constructorIds:['first'],position:value(2),points:value(18)},
      {round:2,driverId:'alpha',constructorIds:['first'],position:value(1),points:value(50)},
      {round:2,driverId:'beta',constructorIds:['first','second'],position:value(3),points:value(18)},
      {round:2,driverId:'gamma',constructorIds:['first'],position:value(2),points:value(20)},
    ],
    constructorStandings:[{round:1,constructorId:'first',position:value(1),points:value(43)},{round:2,constructorId:'first',position:value(1),points:value(88)},{round:2,constructorId:'second',position:value(2),points:value(0)}],
  };
}
