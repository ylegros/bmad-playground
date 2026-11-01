import { useRef, useState } from 'react';
import { chartValueLayout, type EvolutionSeries } from '../shared/progress-model';
const colors=['#78b7ff','#d6a0ea','#80d5a7','#ffc77b','#ff9caa','#bed17a'];
const dashFor=(index:number)=>index===0?'':index===1?'9 5':`${3+index*2} 4 ${2+index} 5`;
export default function EvolutionChart({series,rank,label}:{series:EvolutionSeries;rank:boolean;label:string}) {
  const styles=useRef(new Map<string,number>());
  const chartScroll=useRef<HTMLDivElement>(null);
  const identity=(id:string)=>{if(!styles.current.has(id))styles.current.set(id,styles.current.size);return styles.current.get(id)!;};
  series.forEach(item=>identity(item.id));
  const [inspected,setInspected]=useState(0);
  const [announcement,setAnnouncement]=useState('');
  const count=series[0]?.rows.length||0, index=Math.min(inspected,Math.max(0,count-1));
  const {width,height,geometry,labels}=chartValueLayout(series,rank);
  function inspect(next:number,announce=false) {
    const bounded=Math.max(0,Math.min(count-1,next));setInspected(bounded);
    if(announce&&chartScroll.current) {
      const container=chartScroll.current;
      container.scrollTo({left:Math.max(0,geometry.x(bounded)-container.clientWidth/2),behavior:'instant'});
    }
    if(announce&&bounded!==index) setAnnouncement(`Round ${series[0].rows[bounded].round}, ${series[0].rows[bounded].name}. ${series.map(item=>`${item.name}: ${item.rows[bounded].text}`).join('; ')}.`);
  }
  function inspectPointer(event:React.PointerEvent<SVGSVGElement>|React.MouseEvent<SVGSVGElement>) {
    const bounds=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-bounds.left)*width/bounds.width;
    inspect(count<=1?0:Math.round((x-geometry.x(0))/(geometry.x(count-1)-geometry.x(0))*(count-1)));
  }
  if(!count) return <p className="table-help">No scheduled rounds are available.</p>;
  return <div className="evolution-chart">
    <h2>{label}</h2>
    <ul className="series-legend">{series.map(item=><li key={item.id}><svg width="44" height="18" aria-hidden="true"><path d="M2 9 H42" stroke={colors[identity(item.id)%colors.length]} strokeWidth="3" strokeDasharray={dashFor(identity(item.id))}/></svg>{item.name}</li>)}</ul>
    <p id="inspection-help" className="table-help">Inspect rounds with Left/Right and Home/End, or point to a round. Missing values create gaps. Value labels connect to their points; scroll the chart to read all rounds.</p>
    <div ref={chartScroll} className="chart-scroll" role="region" aria-label="Season evolution chart" tabIndex={0}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{width,minWidth:width}} height={height} aria-label={label} role="img" onPointerMove={inspectPointer} onClick={inspectPointer}>
        {geometry.ticks.map(tick=><g key={tick.value}><line x1={geometry.leftPadding} x2={width-12} y1={geometry.y(tick.value)} y2={geometry.y(tick.value)} stroke="#68717f" strokeDasharray="2 5"/><text className="value-axis-tick" x={geometry.leftPadding-12} y={geometry.y(tick.value)+4} textAnchor="end" fill="#c9cdd5" fontSize="12" fontFamily="monospace">{tick.text}</text></g>)}
        <g className="series-lines">{series.map((item,i)=><path key={item.id} data-testid={`series-${item.id}`} d={geometry.paths[i]} fill="none" stroke={colors[identity(item.id)%colors.length]} strokeWidth="3" strokeDasharray={dashFor(identity(item.id))}/>)}</g>
        {series.map((item,i)=><g key={item.id} data-series={item.id}>
          {labels[i].map(point=><g key={item.rows[point.roundIndex].round} data-round={item.rows[point.roundIndex].round}>
            <circle cx={point.pointX} cy={point.pointY} r="4" fill="#20242c" stroke={colors[identity(item.id)%colors.length]} strokeWidth="2"/>
            <path className="value-leader" d={`M${point.pointX},${point.pointY} L${point.x-3},${point.y}`} fill="none" stroke={colors[identity(item.id)%colors.length]} strokeDasharray={dashFor(identity(item.id))}/>
            <rect x={point.x-2} y={point.y-11} width={point.width+4} height="22" rx="2" fill="#20242c"/>
            <text className="point-value" x={point.x} y={point.y+5} fill={colors[identity(item.id)%colors.length]} fontSize="14" fontFamily="monospace" aria-label={`${item.name}, round ${item.rows[point.roundIndex].round}: ${point.text}`}>{point.text}</text>
            <title>{`${item.name}, round ${item.rows[point.roundIndex].round}: ${item.rows[point.roundIndex].text}`}</title>
          </g>)}
        </g>)}
        <line className="inspection-marker" x1={geometry.x(index)} x2={geometry.x(index)} y1="20" y2={height-50} stroke="#f5f6f8" strokeDasharray="4 4" pointerEvents="none"/>
      </svg>
      <div className="chart-round-axis" style={{width,minWidth:width}} aria-label="Round axis">
        <svg width={width} height="24" aria-hidden="true">{series[0].rows.map((row,i)=><text key={row.round} x={geometry.x(i)} y="17" textAnchor="middle" fill="#c9cdd5" fontSize="12">{row.round}</text>)}</svg>
        <span>Round (chronological)</span>
      </div>
    </div>
    <div className="round-control" role="slider" aria-label="Inspect round" aria-describedby="inspection-help" aria-valuemin={1} aria-valuemax={count} aria-valuenow={index+1} aria-valuetext={`Round ${series[0].rows[index].round}, ${series[0].rows[index].name}`} tabIndex={0} onKeyDown={event=>{const next=event.key==='ArrowLeft'?index-1:event.key==='ArrowRight'?index+1:event.key==='Home'?0:event.key==='End'?count-1:undefined;if(next!==undefined){event.preventDefault();inspect(next,true);}}}>Inspect round {series[0].rows[index].round} · {series[0].rows[index].name}</div>
    <div className="round-details" aria-label="Round details"><h3>Round {series[0].rows[index].round} · {series[0].rows[index].name}</h3><dl>{series.map(item=><div key={item.id}><dt>{item.name}</dt><dd>{item.rows[index].text}</dd></div>)}</dl></div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
