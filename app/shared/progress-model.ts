import type { Metric, SeasonSnapshot } from './contracts.ts';
import { displayMetric, progress, resultText } from './selectors.ts';
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
  return [...new Set((raw||'').split(',').filter(id=>Object.hasOwn(available,id)))];
}
export type ProgressRow = ReturnType<typeof progress>[number];
export function metricCell(row:ProgressRow, metric:GraphMetric):{value:number|null;text:string} {
  if((metric==='sprint'||metric==='sprintPoints')&&row.sprint==='not-applicable') return {value:null,text:'Not applicable'};
  if((metric==='qualifying'&&row.qualifying!=='complete')||(metric==='gp'&&row.gp!=='complete')||(metric==='sprint'&&row.sprint!=='complete')) return {value:null,text:'Unavailable'};
  const result = metric==='gp'?row.gpResult:metric==='sprint'?row.sprintResult:undefined;
  const source:Metric|undefined = metric==='qualifying'?row.qualifyingPosition:metric==='gp'||metric==='sprint'?result?.position:row[metric];
  return {value:source?.kind==='value'?source.value:null,text:metric==='gp'||metric==='sprint'?resultText(result):displayMetric(source)};
}
export function evolutionSeries(snapshot:SeasonSnapshot,category:ProgressCategory,ids:string[],metric:GraphMetric) {
  return ids.map(id=>({id,name:snapshot[category][id].name,rows:progress(snapshot,category,id).map(row=>({round:row.round,name:row.name,...metricCell(row,metric)}))}));
}
export type EvolutionSeries = ReturnType<typeof evolutionSeries>;
export function chartGeometry(series:EvolutionSeries,rank:boolean,width=900,height=300) {
  const values=series.flatMap(item=>item.rows.flatMap(row=>row.value===null?[]:[row.value]));
  const minimum=rank?1:Math.min(0,...values), maximum=Math.max(rank?2:1,...values);
  const count=series[0]?.rows.length||0;
  const x=(index:number)=>60+(count<=1?(width-90)/2:index*(width-90)/(count-1));
  const y=(value:number)=>24+(rank?(value-minimum):(maximum-value))*(height-70)/(maximum-minimum);
  const paths=series.map(item=>{
    let previous=false;
    return item.rows.map((row,index)=>{if(row.value===null){previous=false;return '';}const point=`${previous?'L':'M'}${x(index)},${y(row.value)}`;previous=true;return point;}).filter(Boolean).join(' ');
  });
  return {minimum,maximum,x,y,paths};
}
