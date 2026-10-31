import type { SeasonSnapshot } from '../shared/contracts';
import { compareValues, comparisonMeasures, roundMetric, type ComparisonMeasure } from '../shared/comparison';
import { displayMetric, progress, resultText } from '../shared/selectors';
import ComparisonSummary from './ComparisonSummary';
import { metricCell } from '../shared/progress-model';
import './comparison.css';

export default function Comparison({snapshot,a,b,metric,setMetric}:{snapshot:SeasonSnapshot;a:string;b:string;metric:string;setMetric:(metric:string)=>void}) {
  const measure=comparisonMeasures.find(option=>option.value===metric)||comparisonMeasures[0];
  const selected:ComparisonMeasure=measure.value;
  const left=progress(snapshot,'drivers',a),right=progress(snapshot,'drivers',b);
  const names=[snapshot.drivers[a].name,snapshot.drivers[b].name];
  const text=(row:typeof left[number]):string=>'sessions' in row?metricCell(row,selected).text:selected==='gp'?resultText(row.gpResult):selected==='sprint'?(row.sprint==='not-applicable'?'Not applicable':resultText(row.sprintResult)):displayMetric(roundMetric(row,selected));
  const shared=left.some((row,index)=>(row.gpResult&&right[index]?.gpResult)||(row.sprintResult&&right[index]?.sprintResult));
  const caption=`${names[0]} and ${names[1]} · ${snapshot.season} · ${measure.label}`;
  return <><ComparisonSummary snapshot={snapshot} a={a} b={b}/><div className="comparison-heading"><h2>Round-by-round evidence</h2><label className="field"><span>Compare measure</span><select value={selected} onChange={event=>setMetric(event.target.value)}>{comparisonMeasures.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>{!shared&&<p className="notice">No shared results. Available records remain aligned by round.</p>}
    <p className="table-help">&#10003; marks the favorable value within this pair; ties and unavailable values have no marker. {measure.direction==='higher'?'Higher points are better.':'Lower authoritative numeric positions are better.'} GP and sprint comparisons stay separate.</p>
    <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}><table><caption>{caption}</caption><thead><tr>{['Round / Grand Prix',...names].map(header=><th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{left.map((row,index)=>{
      const other=right[index],outcome=snapshot.schemaVersion===2&&!snapshot.analysisRounds.includes(row.round)?'unavailable':compareValues(roundMetric(row,selected),roundMetric(other,selected),measure.direction);
      return <tr key={row.round}><th scope="row"><span className="round-label">{String(row.round).padStart(2,'0')}</span>{row.name}</th>{[row,other].map((entry,side)=>{const better=outcome===(side===0?'a':'b');return <td key={side} className={`number driver-${side===0?'a':'b'} ${better?'comparison-better':''}`}><span>{text(entry)}</span>{better&&<span className="better-label"><span aria-hidden="true">&#10003;</span><span className="sr-only">{names[side]}, {measure.label}, {measure.direction} is better</span></span>}{outcome==='tied'&&<small className="comparison-tied">Tied</small>}</td>})}</tr>;
    })}</tbody></table></div><p className="table-help">Unavailable means no source value. Zero means an awarded total of 0. Source classification and status are retained; a better pair value does not imply a race win.</p></>;
}
