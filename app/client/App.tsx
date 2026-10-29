import { useEffect, useRef, useState } from 'react';
import type { Metric, SeasonSnapshot, SupportManifest } from '../shared/contracts';
import { displayMetric, finalStandings, progress, resultText, teammate } from '../shared/selectors';
import { SeasonOperations } from './operations';

type View = 'standings' | 'progress' | 'compare';
type Category = 'drivers' | 'constructors';
const timestamp = (date: string) => new Intl.DateTimeFormat(undefined, {dateStyle:'medium',timeStyle:'long'}).format(new Date(date));
async function request<T>(path: string, method = 'GET'): Promise<T> {
  const response = await fetch(path, {method});
  const envelope = await response.json();
  if (!response.ok) throw new Error(envelope.error?.message || 'The data service is unavailable.');
  return envelope.data;
}
function Table({caption, headers, children}: {caption:string; headers:string[]; children:React.ReactNode}) {
  return <div className="table-scroll" role="region" aria-label={caption} tabIndex={0}><table><caption>{caption}</caption><thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
function Field({label, value, options, onChange, empty}: {label:string; value:string; options:{value:string;label:string}[];onChange:(value:string)=>void;empty?:string}) {
  return <label className="field"><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value)}>{empty && <option value="">{empty}</option>}{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
export default function App() {
  const [query, setQuery] = useState(() => new URLSearchParams(location.search));
  const [manifest, setManifest] = useState<SupportManifest>();
  const [snapshots,setSnapshots] = useState<Record<number,SeasonSnapshot>>({});
  const [pending,setPending] = useState<Record<number,string>>({});
  const [errors,setErrors] = useState<Record<number,string>>({});
  const [manifestError,setManifestError] = useState('');
  const [manifestAttempt,setManifestAttempt] = useState(0);
  const [setupPending,setSetupPending] = useState<number>();
  const [setupError,setSetupError] = useState('');
  const [setupSuccess,setSetupSuccess] = useState('');
  const [manifestSyncError,setManifestSyncError] = useState('');
  const [manifestSyncPending,setManifestSyncPending] = useState(false);
  const [success,setSuccess] = useState<Record<number,string>>({});
  const operations = useRef(new SeasonOperations());
  const latestSeason = manifest?.seasons.filter(item=>item.verified).sort((a,b)=>b.season-a.season)[0]?.season;
  const requestedSeason = Number(query.get('season'));
  const season = manifest?.seasons.some(item=>item.verified && item.season===requestedSeason) ? requestedSeason : latestSeason;
  const snapshot = season ? snapshots[season] : undefined;
  const rawView = query.get('view');
  const view: View = rawView==='progress'||rawView==='compare' ? rawView : 'standings';
  const heading = useRef<HTMLHeadingElement>(null);
  const previousView = useRef(view);
  useEffect(()=>{
    if(previousView.current!==view) heading.current?.focus();
    previousView.current=view;
  },[view]);
  const category: Category = query.get('category')==='constructors' ? 'constructors' : 'drivers';
  const entity = query.get('entity') || '';
  const a = query.get('a') || '';
  const b = query.get('b') || '';
  function navigate(values:Record<string,string|number|undefined>, replace=false) {
    const next = new URLSearchParams(location.search);
    for (const [key,value] of Object.entries(values)) if (value===undefined || value==='') next.delete(key); else next.set(key,String(value));
    const url = `${location.pathname}?${next}`;
    if (replace) history.replaceState(null,'',url); else history.pushState(null,'',url);
    setQuery(next);
  }
  useEffect(()=>{const back=()=>setQuery(new URLSearchParams(location.search));addEventListener('popstate',back);return()=>removeEventListener('popstate',back);},[]);
  useEffect(()=>{let active=true;setManifestError('');request<SupportManifest>('/api/v1/seasons').then(data=>{if(active)setManifest(data);}).catch(error=>{if(active)setManifestError(error.message);});return()=>{active=false;};},[manifestAttempt]);
  async function load(year:number,refresh=false) {
    const op = operations.current.begin(year);
    setPending(previous=>({...previous,[year]:refresh?'Refreshing':'Loading'}));
    setErrors(previous=>({...previous,[year]:''}));
    setSuccess(previous=>({...previous,[year]:''}));
    try {
      const data = await request<SeasonSnapshot>(`/api/v1/seasons/${year}${refresh?'/refresh':''}`,refresh?'POST':'GET');
      if (!operations.current.isCurrent(year,op)) return;
      if(data.season!==year) throw new Error('The service returned a different season. Please retry.');
      setSnapshots(previous=>({...previous,[year]:data}));
      setSuccess(previous=>({...previous,[year]:`${year} ${refresh?'refreshed':'loaded'} successfully. Snapshot ${timestamp(data.refreshedAt)}.`}));
    } catch(error) {if(operations.current.isCurrent(year,op))setErrors(previous=>({...previous,[year]:error instanceof Error?error.message:'Could not load data.'}));}
    finally {if(operations.current.isCurrent(year,op))setPending(previous=>({...previous,[year]:''}));}
  }
  async function syncManifest() {
    setManifestSyncPending(true);setManifestSyncError('');
    try { setManifest(await request<SupportManifest>('/api/v1/seasons')); }
    catch(error) {setManifestSyncError(error instanceof Error?error.message:'Could not update the season list.');}
    finally {setManifestSyncPending(false);}
  }
  async function verifySeason(year:number) {
    if (setupPending) return;
    if (season && !query.has('season')) navigate({season},true);
    setSetupPending(year);setSetupError('');setSetupSuccess('');
    try {
      const data = await request<SeasonSnapshot>(`/api/v1/seasons/${year}/refresh`,'POST');
      if(data.season!==year) throw new Error('The service returned a different season. Please retry.');
      setSnapshots(previous=>({...previous,[year]:data}));
      setManifest(previous=>({seasons:[...(previous?.seasons.filter(item=>item.season!==year)||[]),{season:year,verified:true,lastCheckedRound:Math.max(0,...data.coverage.checkedRounds),knownGaps:data.coverage.gaps}]}));
      if (!season) navigate({season:year});
      setSuccess(previous=>({...previous,[year]:`${year} verified and loaded successfully.`}));
      setSetupSuccess(`${year} verified and available in the season selector.`);
      await syncManifest();
    } catch(error) {setSetupError(error instanceof Error?error.message:'Could not verify season data.');}
    finally {setSetupPending(undefined);}
  }
  useEffect(()=>{if(season && !snapshots[season]) void load(season);},[season]);
  const driverOptions = snapshot ? Object.values(snapshot.drivers).sort((x,y)=>x.name.localeCompare(y.name)).map(driver=>({value:driver.id,label:driver.name})) : [];
  const constructorOptions = snapshot ? Object.values(snapshot.constructors).sort((x,y)=>x.name.localeCompare(y.name)).map(team=>({value:team.id,label:team.name})) : [];
  const validEntity = snapshot && (category==='drivers'?snapshot.drivers[entity]:snapshot.constructors[entity]) ? entity : '';
  const validA = snapshot?.drivers[a] ? a : '';
  const validB = snapshot?.drivers[b] ? b : '';
  const initial = snapshot && validA ? teammate(snapshot,validA,'first') : undefined;
  const latest = snapshot && validA ? teammate(snapshot,validA,'latest') : undefined;
  const changeA = (id:string) => navigate({a:id,b:snapshot?teammate(snapshot,id,'latest'):undefined});
  const showProgress = (id:string,kind:Category) => navigate({view:'progress',category:kind,entity:id});
  const showCompare = (id:string) => navigate({view:'compare',a:id,b:snapshot?teammate(snapshot,id,'latest'):undefined});
  const busy = season ? pending[season] : '';
  const unverifiedSeasons = [2010,2021].filter(year=>!manifest?.seasons.some(item=>item.season===year&&item.verified));
  const removedSelection = snapshot && ((view==='progress' && entity && !validEntity) || (view==='compare' && ((a && !validA) || (b && !validB))));
  return <><a className="skip" href="#main">Skip to analysis</a><header className="app-header"><div className="brand"><span className="brand-mark" aria-hidden="true">//</span><div>F1 Dashboard<small>YOUR SEASON. EVERY ROUND.</small></div></div><div className="header-actions"><Field label="Season" value={String(season||'')} options={manifest?.seasons.filter(item=>item.verified).map(item=>({value:String(item.season),label:String(item.season)}))||[]} onChange={year=>navigate({season:year,entity:undefined,a:undefined,b:undefined})}/><button className="primary" disabled={!season||!!busy} onClick={()=>season&&void load(season,true)}>{busy==='Refreshing'?'Refreshing…':'↻ Refresh data'}</button></div></header><div className="workspace"><aside className="sidebar"><p className="eyebrow">THE PIT WALL</p><nav aria-label="Main navigation">{(['standings','progress','compare'] as View[]).map((item,index)=><a key={item} href={`?${new URLSearchParams({...Object.fromEntries(query),view:item})}`} aria-current={view===item?'page':undefined} onClick={event=>{event.preventDefault();navigate({view:item});}}><span className="nav-number">0{index+1}</span>{item==='standings'?'Standings':item==='progress'?'Progress':'Compare'}</a>)}</nav><div className="sidebar-note"><span className="status-dot"/> Historical analysis<p>Official results.<br/>Round by round.</p><small>Source: Jolpica F1</small></div></aside><main id="main"><div className="page-heading"><div><p className="eyebrow">SEASON {season||'—'} / {view==='standings'?'CHAMPIONSHIP':view==='progress'?'ROUND BY ROUND':'HEAD TO HEAD'}</p><h1 ref={heading} tabIndex={-1}>{view==='standings'?'Championship standings':view==='progress'?'Season progress':'Driver comparison'}</h1><p className="intro">{view==='standings'?'The championship order, with every point accounted for.':view==='progress'?'Follow the results behind the championship.':'Two drivers. The same rounds. All the detail.'}</p></div><span className="season-stamp" aria-hidden="true">{season||'F1'}</span></div><div className="snapshot-meta">{snapshot?<><span>Snapshot · {timestamp(snapshot.refreshedAt)}</span><span>{snapshot.coverage.checkedRounds.length} rounds checked</span></>:<span>Local season workspace</span>}</div><div aria-live="polite" aria-atomic="true">{busy&&<p className="notice">{busy} {season}… {snapshot?'Your current snapshot remains available.':'Initial season loading may take a few minutes.'}</p>}</div>{manifestError&&<div className="notice error" role="alert">Could not load supported seasons. {manifestError} <button onClick={()=>setManifestAttempt(value=>value+1)}>Try again</button></div>}{season&&errors[season]&&<div className="notice error" role="alert">{snapshot?`Could not refresh. Showing data last refreshed ${timestamp(snapshot.refreshedAt)}.`:'Could not load this season. Try again or choose another season.'} <span>{errors[season]}</span> <button disabled={!!busy} onClick={()=>void load(season,!!snapshot)}>Try again</button></div>}{snapshot?.coverage.gaps.length ? <details className="notice"><summary>Coverage notes ({snapshot.coverage.gaps.length})</summary><ul>{snapshot.coverage.gaps.map(gap=><li key={gap}>{gap}</li>)}</ul></details>:null}
  <div className="sr-only" aria-live="polite" aria-atomic="true">{season&&!busy&&success[season]}</div>
  <div className="sr-only" aria-live="polite" aria-atomic="true">{setupSuccess}</div>
  {manifestSyncError&&<div className="notice" role="status">Season verification succeeded and its snapshot is available. Could not update the season list: {manifestSyncError} <button disabled={manifestSyncPending} onClick={()=>void syncManifest()}>{manifestSyncPending?'Updating season list…':'Retry season list'}</button></div>}
  {manifest&&unverifiedSeasons.length>0&&<section className={`panel setup-panel ${latestSeason?'setup-compact':''}`}><h2>{latestSeason?'Add another season':'Set up your first season'}</h2><p>{latestSeason?'Verify another season while continuing to explore the loaded snapshot.':'Verify and download an official season snapshot before opening the pit wall.'} This checks results, qualifying and standings and may take a few minutes.</p><div className="setup-actions">{unverifiedSeasons.map(year=><button className="primary" key={year} disabled={!!setupPending} onClick={()=>void verifySeason(year)}>{setupPending===year?`Verifying ${year}…`:`Verify season data · ${year}`}</button>)}</div><p role="status">{setupPending?`Verifying ${setupPending}. Keep this application running while the source data is checked.`:''}</p>{setupError&&<p className="notice error" role="alert">Could not verify season data. {setupError} Try again when the source is available.</p>}</section>}
  {removedSelection&&<p className="notice" role="status">A previous selection is not available in this snapshot. Choose another entry to continue.</p>}
  {snapshot&&view==='standings'&&<section className="panel"><div className="panel-header"><h2>Season classification</h2><div className="segmented" aria-label="Standings category">{(['drivers','constructors'] as Category[]).map(kind=><button key={kind} aria-pressed={category===kind} onClick={()=>navigate({category:kind})}>{kind==='drivers'?'Drivers':'Constructors'}</button>)}</div></div>{category==='drivers'?<Table caption={`Driver standings · ${season} · official round ${Math.max(0,...snapshot.driverStandings.map(row=>row.round))}`} headers={['Pos','Driver','Constructor','Points','Explore']}>{finalStandings(snapshot.driverStandings).map(row=><tr key={row.driverId}><td className="number rank">{displayMetric(row.position)}</td><th scope="row">{snapshot.drivers[row.driverId]?.name||row.driverId}{initial!==latest&&initial===row.driverId&&<small className="annotation">Initial teammate of {snapshot.drivers[validA]?.name}</small>}</th><td>{row.constructorIds.map(id=>snapshot.constructors[id]?.name||id).join(' / ')||'Unavailable'}</td><td className="number strong">{displayMetric(row.points)}</td><td className="row-actions"><button aria-label={`View progress for ${snapshot.drivers[row.driverId]?.name}`} onClick={()=>showProgress(row.driverId,'drivers')}>Progress <span aria-hidden="true">↗</span></button><button aria-label={`Compare ${snapshot.drivers[row.driverId]?.name}`} onClick={()=>showCompare(row.driverId)}>Compare</button></td></tr>)}</Table>:<Table caption={`Constructor standings · ${season} · official round ${Math.max(0,...snapshot.constructorStandings.map(row=>row.round))}`} headers={['Pos','Constructor','Points','Explore']}>{finalStandings(snapshot.constructorStandings).map(row=><tr key={row.constructorId}><td className="number rank">{displayMetric(row.position)}</td><th scope="row">{snapshot.constructors[row.constructorId]?.name||row.constructorId}</th><td className="number strong">{displayMetric(row.points)}</td><td className="row-actions"><button aria-label={`View progress for ${snapshot.constructors[row.constructorId]?.name}`} onClick={()=>showProgress(row.constructorId,'constructors')}>Progress <span aria-hidden="true">↗</span></button></td></tr>)}</Table>}{!(category==='drivers'?snapshot.driverStandings:snapshot.constructorStandings).length&&<p className="empty">No official standings available for this season.</p>}</section>}
  {snapshot&&view==='progress'&&<section className="panel"><div className="panel-header controls"><Field label="Category" value={category} options={[{value:'drivers',label:'Drivers'},{value:'constructors',label:'Constructors'}]} onChange={kind=>navigate({category:kind,entity:undefined})}/><Field label={category==='drivers'?'Driver':'Constructor'} value={validEntity} options={category==='drivers'?driverOptions:constructorOptions} empty="Choose an entry" onChange={id=>navigate({entity:id})}/></div>{!validEntity?<div className="empty"><span className="empty-symbol" aria-hidden="true">↗</span><h2>Choose your focus</h2><p>Select a driver or constructor to follow their season.</p></div>:<><h2 className="analysis-title">{(category==='drivers'?snapshot.drivers[validEntity]:snapshot.constructors[validEntity])?.name} <span>· {season}</span></h2><p className="table-help">Round points are earned in GP and Sprint sessions. Championship totals and positions use official standings. Championship adjustment is the change in official points minus points earned this round; it can reflect penalties or other official adjustments.</p><Table caption={`${(category==='drivers'?snapshot.drivers[validEntity]:snapshot.constructors[validEntity])?.name} · ${season} · round-by-round progress`} headers={category==='drivers'?['Round / Grand Prix','GP qualifying','GP result','Sprint result','GP points','Sprint points','Round points','Championship points','Championship adjustment','Championship pos']:['Round / Grand Prix','GP points','Sprint points','Round points','Championship points','Championship adjustment','Championship pos']}>{progress(snapshot,category,validEntity).map(row=><tr key={row.round}><th scope="row"><span className="round-label">{String(row.round).padStart(2,'0')}</span>{row.name}</th>{category==='drivers'&&<><td className="number">{displayMetric(row.qualifyingPosition)}</td><td>{resultText(row.gpResult)}</td><td>{row.sprint==='not-applicable'?'Not applicable':resultText(row.sprintResult)}</td></>}<td className="number">{displayMetric(row.gpPoints)}</td><td className="number">{row.sprint==='not-applicable'?'Not applicable':displayMetric(row.sprintPoints)}</td><td className="number strong">{displayMetric(row.points)}</td><td className="number">{displayMetric(row.cumulative)}</td><td className="number">{displayMetric(row.adjustment)}</td><td className="number">{displayMetric(row.rank)}</td></tr>)}</Table></>}</section>}
  {snapshot&&view==='compare'&&<section className="panel"><div className="panel-header controls"><Field label="Driver A" value={validA} options={driverOptions} empty="Choose driver A" onChange={changeA}/><span className="versus" aria-hidden="true">VS</span><Field label="Driver B" value={validB} options={driverOptions} empty="Choose driver B" onChange={id=>navigate({b:id})}/></div>{validA&&<p className="table-help">{latest?`Latest teammate: ${snapshot.drivers[latest]?.name}.`:'No teammate available for this season. Choose another driver.'}{initial&&initial!==latest?` Initial teammate: ${snapshot.drivers[initial]?.name}.`:''} You can choose any two season drivers.</p>}{!validA||!validB?<div className="empty"><span className="empty-symbol" aria-hidden="true">⇄</span><h2>Choose two drivers from {season}</h2><p>Start with a driver to select their latest teammate automatically.</p></div>:validA===validB?<p className="notice">Choose a different driver for the second selection.</p>:<Comparison snapshot={snapshot} a={validA} b={validB} metric={query.get('metric')||'cumulative'} setMetric={metric=>navigate({metric})}/>}</section>}
  {!snapshot&&!busy&&!manifestError&&!manifest&&!errors[season||0]&&<p className="notice">Preparing the season workspace…</p>}<footer>F1 Dashboard <span>Independent personal analysis · Data provided by Jolpica F1</span></footer></main></div></>;
}
type ProgressRow = ReturnType<typeof progress>[number];
function Comparison({snapshot,a,b,metric,setMetric}:{snapshot:SeasonSnapshot;a:string;b:string;metric:string;setMetric:(metric:string)=>void}) {
  const options = [{value:'cumulative',label:'Championship points'},{value:'points',label:'Round points'},{value:'qualifying',label:'GP qualifying position'},{value:'gp',label:'GP race result'},{value:'sprint',label:'Sprint result'}];
  const selected = options.some(option=>option.value===metric)?metric:'cumulative';
  const left = progress(snapshot,'drivers',a), right = progress(snapshot,'drivers',b);
  const cell = (row:ProgressRow):string => selected==='gp'?resultText(row.gpResult):selected==='sprint'?(row.sprint==='not-applicable'?'Not applicable':resultText(row.sprintResult)):displayMetric(selected==='qualifying'?row.qualifyingPosition:row[selected as 'cumulative'|'points'] as Metric|undefined);
  const shared = left.some((row,index)=>(row.gpResult&&right[index]?.gpResult)||(row.sprintResult&&right[index]?.sprintResult));
  return <><div className="comparison-heading"><h2><span className="driver-a">{snapshot.drivers[a].name}</span> <span className="against">/</span> <span className="driver-b">{snapshot.drivers[b].name}</span><small>SEASON {snapshot.season}</small></h2><Field label="Compare measure" value={selected} options={options} onChange={setMetric}/></div>{!shared&&<p className="notice">No shared results. Available records remain aligned by round.</p>}<Table caption={`${snapshot.drivers[a].name} and ${snapshot.drivers[b].name} · ${snapshot.season} · ${options.find(option=>option.value===selected)?.label}`} headers={['Round / Grand Prix',snapshot.drivers[a].name,snapshot.drivers[b].name]}>{left.map((row,index)=><tr key={row.round}><th scope="row"><span className="round-label">{String(row.round).padStart(2,'0')}</span>{row.name}</th><td className="number driver-a">{cell(row)}</td><td className="number driver-b">{cell(right[index])}</td></tr>)}</Table><p className="table-help">Unavailable means no source value. Zero means an awarded total of 0. Sprint results stay separate from Grand Prix results.</p></>;
}



