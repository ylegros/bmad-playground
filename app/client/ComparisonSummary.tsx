import type { Metric, SeasonSnapshot } from '../shared/contracts';
import { barProportions, comparisonSummary, type Direction, type SummaryCategory } from '../shared/comparison';
import { displayMetric } from '../shared/selectors';
import { DriverIdentity } from './Identity';
import './comparison-summary.css';

function SummaryValue({metric,better,name,label,direction}:{metric:Metric;better:boolean;name:string;label:string;direction:Direction}) {
  return <div className={`summary-value ${better?'is-better':''}`}><span className="summary-driver">{name}</span><strong>{displayMetric(metric)}</strong>{better&&<span className="better-label"><span aria-hidden="true">&#10003;</span><span className="sr-only">{name}, {label}, {direction} is better</span></span>}{metric.kind==='unavailable'&&<small>{metric.reason}</small>}</div>;
}
function Evidence({row,names}:{row:SummaryCategory;names:[string,string]}) {
  return <details className="summary-evidence"><summary>Evidence and availability · {row.label}</summary><p>{row.explanation}</p><p>Sample sizes: {names[0]} {row.samples.a}; {names[1]} {row.samples.b}. Analysis-window GPs: {row.samples.scheduled}.</p>
    {(row.id==='gp'||row.id==='qualifying')&&<><p>Eligible rounds ({row.eligible.length}): {row.eligible.map(round=>`${round.round} ${round.name}`).join('; ')||'None'}.</p><p>Tied rounds ({row.ties.length}): {row.ties.map(round=>`${round.round} ${round.name}`).join('; ')||'None'}.</p><p>Excluded rounds ({row.excluded.length}): {row.excluded.map(round=>`${round.round} ${round.name}: ${round.reason}`).join('; ')||'None'}.</p></>}{row.details.length>0&&<ul>{row.details.map(detail=><li key={detail}>{detail}</li>)}</ul>}</details>;
}
function Track({row}:{row:SummaryCategory}) {
  // Presentation only: the shared policy remains the sole owner of outcomes.
  const a=row.a.kind==='value'?row.a.value:undefined,b=row.b.kind==='value'?row.b.value:undefined;
  const numeric=a!==undefined&&b!==undefined&&Number.isFinite(a)&&Number.isFinite(b);
  const negative=numeric&&(a<0||b<0);
  const zero=numeric&&a===0&&b===0;
  const rankTie=!row.bar&&row.id!=='dnf'&&row.outcome==='tied';
  const neutral=row.outcome==='unavailable'||!numeric||negative||zero||rankTie;
  const bars=!neutral?barProportions({...row,bar:row.bar||row.id==='dnf'}):undefined;
  const message=neutral?(row.outcome==='unavailable'||!numeric?'Unavailable for category scoring':negative?'Negative values · magnitude not shown':rankTie?'Tied':'Both values are zero · no proportional magnitude'):row.outcome==='tied'?'Tied':!bars?'Position markers · lower is better':undefined;
  return <div className="metric-track"><div className={`summary-track ${neutral?'is-neutral':bars?'is-proportional':'is-position'}`} aria-hidden="true">
    {bars?<><span style={{width:`${bars[0]}%`}}/><span style={{width:`${bars[1]}%`}}/></>:!neutral?<><span className={`position-marker marker-a ${row.outcome==='a'?'favorable':''}`}>A</span><span className={`position-marker marker-b ${row.outcome==='b'?'favorable':''}`}>B</span></>:null}
  </div>{message&&<small className="track-caption">{message}</small>}</div>;
}
export default function ComparisonSummary({snapshot,a,b}:{snapshot:SeasonSnapshot;a:string;b:string}) {
  const result=comparisonSummary(snapshot,a,b); if(!result)return null;
  const names:[string,string]=[snapshot.drivers[a].name,snapshot.drivers[b].name];
  const verdict=result.verdict==='insufficient'?'Insufficient data':result.verdict==='draw'?`Draw: ${result.a}–${result.b}`:`${names[result.verdict==='a'?0:1]} leads ${Math.max(result.a,result.b)}–${Math.min(result.a,result.b)} on category wins`;
  return <section className="comparison-summary" aria-label="Six-category comparison summary"><div className="summary-identity driver-a"><DriverIdentity snapshot={snapshot} id={a} portrait/></div><div className="scorecard"><p className="eyebrow">SEASON {snapshot.season} · HEAD TO HEAD</p><h2>{verdict}</h2><p className="score-explanation">Each category has equal weight. {result.comparable} comparable of 6 · {result.tied} tied · {result.unavailable} unavailable. Tied and unavailable categories award no vote.</p>
    <div className="summary-column-names"><strong className="driver-a">A · {names[0]}</strong><strong className="driver-b">B · {names[1]}</strong></div>
    {result.rows.map(row=><article className="summary-metric" key={row.id} aria-label={row.label}><h3>{row.label}</h3>{row.direction==='lower'&&<p className="metric-direction">Lower is better</p>}<div className="compact-metric-values"><SummaryValue metric={row.a} better={row.outcome==='a'} name={names[0]} label={row.label} direction={row.direction}/><Track row={row}/><SummaryValue metric={row.b} better={row.outcome==='b'} name={names[1]} label={row.label} direction={row.direction}/></div><Evidence row={row} names={names}/></article>)}
    </div><div className="summary-identity driver-b"><DriverIdentity snapshot={snapshot} id={b} portrait/></div></section>;
}
