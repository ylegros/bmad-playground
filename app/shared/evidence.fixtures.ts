import type { SeasonSnapshotV2 } from './contracts.ts';
import { value } from './contracts.ts';
export function evidenceFixture(season = 2026): SeasonSnapshotV2 {
  const provenance = [{sourceUrl:'https://example.org/calendar',observedAt:'2026-10-30T00:00:00Z',note:'Independently reviewed session lifecycle'}];
  return {schemaVersion:2,snapshotId:'evidence-fixture-v2',season,refreshedAt:'2026-10-29T00:00:00Z',lifecycle:'ongoing',analysisRounds:[1],coverage:{checkedRounds:[1,2],gaps:[]},
    audit:{auditId:'audit-fixture-v2',auditedAt:'2026-10-30T00:00:00Z',status:'verified',provenance,endpoints:[`${season}`,`${season}/results`,`${season}/qualifying`,`${season}/sprint`,`${season}/1/driverStandings`,`${season}/1/constructorStandings`].map(path=>({sourceUrl:`https://example.org/ergast/f1/${path}.json?limit=100`,expectedPages:1,fetchedPages:1})),failures:[],completion:[]},
    drivers:{a:{id:'a',name:'A',code:'AAA',nationality:'Test'}},constructors:{team:{id:'team',name:'Team',nationality:'Test'}},
    schedule:[1,2].map(round => ({round,name:`GP ${round}`,date:'2026-01-01',gp:round === 1 ? 'complete':'unavailable',qualifying:round === 1 ? 'complete':'unavailable',sprint:'not-applicable',sessions:{gp:{lifecycle:round === 1 ? 'held':'unheld',applicable:true,provenance},qualifying:{lifecycle:round === 1 ? 'held':'unheld',applicable:true,provenance},sprint:{lifecycle:'unheld',applicable:false,provenance}}})),
    results:[{round:1,kind:'gp',driverId:'a',constructorId:'team',position:value(1),classification:'1',status:'Finished',points:value(25.5)}],qualifying:[{round:1,driverId:'a',constructorId:'team',position:value(2)}],driverStandings:[{round:1,driverId:'a',constructorIds:['team'],position:value(1),points:value(24.5)}],constructorStandings:[{round:1,constructorId:'team',position:value(1),points:value(24.5)}]};
}
