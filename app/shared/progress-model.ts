import type { Metric, SeasonSnapshot } from './contracts.ts';
import { displayMetric, progress, resultText, sessionUnavailable } from './selectors.ts';
export type ProgressCategory = 'drivers' | 'constructors';
export const graphMetrics = [
  {id:'cumulative',label:'Championship points',unit:'points',rank:false},
  {id:'points',label:'Round points',unit:'points',rank:false},
  {id:'gpPoints',label:'GP points',unit:'points',rank:false},
  {id:'sprintPoints',label:'Sprint points',unit:'points',rank:false},
  {id:'adjustment',label:'Championship adjustment',unit:'points',rank:false},
  {id:'rank',label:'Championship pos',unit:'position',rank:true},
  {id:'qualifying',label:'GP qualifying position',unit:'position',rank:true,driverOnly:true},
  {id:'gp',label:'GP result',unit:'position',rank:true,driverOnly:true},
  {id:'sprint',label:'Sprint result',unit:'position',rank:true,driverOnly:true},
] as const;
export type GraphMetric = typeof graphMetrics[number]['id'];
export const metricOptions = (category:ProgressCategory) => graphMetrics.filter(metric=>!('driverOnly' in metric)||category==='drivers');
export const validMetric = (category:ProgressCategory, id:string|null):GraphMetric => metricOptions(category).find(metric=>metric.id===id)?.id || 'cumulative';
export function selectedEntities(snapshot:SeasonSnapshot, category:ProgressCategory, raw:string|null):string[] {
  const available = snapshot[category];
  return canonicalSelection((raw||'').split(',').filter(id=>Object.hasOwn(available,id)));
}
export const canonicalSelection = (ids:readonly string[]) => [...new Set(ids)].sort();
export function matchingEntities(snapshot:SeasonSnapshot,category:ProgressCategory,search:string) {
  return Object.values(snapshot[category]).filter(entity=>entity.name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}
export type SelectionAction = {type:'add';ids:readonly string[]}|{type:'remove';id:string}|{type:'clear'};
export function changeSelection(ids:readonly string[],action:SelectionAction) {
  const next=canonicalSelection(action.type==='clear'?[]:action.type==='remove'?ids.filter(id=>id!==action.id):[...ids,...action.ids]);
  return {ids:next,changed:next.join(',')!==canonicalSelection(ids).join(',')};
}
export type ProgressRow = ReturnType<typeof progress>[number];
export function metricCell(row:ProgressRow, metric:GraphMetric):{value:number|null;text:string} {
  if ('sessions' in row) {
    const kind = metric === 'qualifying' ? 'qualifying' : metric === 'sprint' || metric === 'sprintPoints' ? 'sprint' : 'gp';
    const missing = sessionUnavailable(row, kind);
    const heldOfficial = (metric === 'cumulative' || metric === 'rank') && row.sessions.gp.lifecycle === 'held';
    if (missing?.kind === 'unavailable' && !heldOfficial) return { value:null, text:missing.reason };
  }
  if((metric==='sprint'||metric==='sprintPoints')&&row.sprint==='not-applicable') return {value:null,text:'Not applicable'};
  if((metric==='qualifying'&&row.qualifying!=='complete')||(metric==='gp'&&row.gp!=='complete')||(metric==='sprint'&&row.sprint!=='complete')) return {value:null,text:'Unavailable'};
  const result = metric==='gp'?row.gpResult:metric==='sprint'?row.sprintResult:undefined;
  const source:Metric|undefined = metric==='qualifying'?row.qualifyingPosition:metric==='gp'||metric==='sprint'?result?.position:row[metric];
  if (result) return {value:source?.kind==='value'?source.value:null,text:resultText(result)};
  if ('sessions' in row && source?.kind !== 'value') return {value:null,text:source?.kind === 'unavailable' ? source.reason : 'Unavailable: authoritative driver or standings record missing'};
  return {value:source?.kind==='value'?source.value:null,text:metric==='gp'||metric==='sprint'?resultText(result):displayMetric(source)};
}
export function evolutionSeries(snapshot:SeasonSnapshot,category:ProgressCategory,ids:string[],metric:GraphMetric) {
  return ids.map(id=>({id,name:snapshot[category][id].name,rows:progress(snapshot,category,id).map(row=>({round:row.round,name:row.name,...metricCell(row,metric)}))}));
}
export type EvolutionSeries = ReturnType<typeof evolutionSeries>;
export function chartGeometry(series:EvolutionSeries,rank:boolean,width=900,height=300,rightPadding=30,leftPadding=60) {
  const values=series.flatMap(item=>item.rows.flatMap(row=>row.value===null?[]:[row.value]));
  const minimum=rank?1:Math.min(0,...values), maximum=Math.max(rank?2:1,...values);
  const count=series[0]?.rows.length||0;
  const x=(index:number)=>leftPadding+(count<=1?(width-leftPadding-rightPadding)/2:index*(width-leftPadding-rightPadding)/(count-1));
  const y=(value:number)=>24+(rank?(value-minimum):(maximum-value))*(height-70)/(maximum-minimum);
  const paths=series.map(item=>{
    let previous=false;
    return item.rows.map((row,index)=>{if(row.value===null){previous=false;return '';}const point=`${previous?'L':'M'}${x(index)},${y(row.value)}`;previous=true;return point;}).filter(Boolean).join(' ');
  });
  const ticks=[0,.25,.5,.75,1].map(fraction=>{
    const value=minimum+(maximum-minimum)*fraction;
    return {value,text:String(Number(value.toFixed(2)))};
  });
  return {minimum,maximum,x,y,paths,ticks,leftPadding};
}

/** Reserve one label column per round; spread collisions without changing data anchors. */
export function chartValueLayout(series:EvolutionSeries,rank:boolean) {
  const count=series[0]?.rows.length||0;
  const labelWidth=Math.max(9,...series.flatMap(item=>item.rows.flatMap(row=>row.value===null?[]:[String(row.value).length*9])));
  const density=Math.max(0,...Array.from({length:count},(_,round)=>series.filter(item=>item.rows[round]?.value!=null).length));
  const height=Math.max(300,density*24+70), rightPadding=labelWidth+30;
  const ticks=chartGeometry(series,rank).ticks;
  const leftPadding=Math.max(60,...ticks.map(tick=>tick.text.length*8+24));
  const width=Math.max(900,leftPadding+rightPadding+Math.max(0,count-1)*(labelWidth+44));
  const geometry=chartGeometry(series,rank,width,height,rightPadding,leftPadding);
  const labels=series.map(()=>[] as {roundIndex:number;text:string;x:number;y:number;pointX:number;pointY:number;width:number}[]);
  for(let roundIndex=0;roundIndex<count;roundIndex++) {
    const points=series.flatMap((item,seriesIndex)=>{
      const value=item.rows[roundIndex]?.value;
      return value==null?[]:[{seriesIndex,value,pointY:geometry.y(value)}];
    }).sort((a,b)=>a.pointY-b.pointY||a.seriesIndex-b.seriesIndex);
    const positions:number[]=[];
    points.forEach((point,index)=>positions.push(Math.max(point.pointY,index?positions[index-1]+24:24)));
    for(let index=positions.length-1;index>=0;index--) positions[index]=Math.min(positions[index],index===positions.length-1?height-46:positions[index+1]-24);
    points.forEach((point,index)=>{
      const text=String(point.value),pointX=geometry.x(roundIndex);
      labels[point.seriesIndex].push({roundIndex,text,x:pointX+12,y:positions[index],pointX,pointY:point.pointY,width:text.length*9});
    });
  }
  return {width,height,rightPadding,geometry,labels};
}
