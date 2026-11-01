import { useState } from 'react';
import type { SeasonSnapshot, SupportManifest } from '../shared/contracts';
import { candidateSeasons } from '../shared/evidence';
import { analysisSchedule, finalStandings } from '../shared/selectors';

function standingState(snapshot:SeasonSnapshot,source:number|undefined){
  const last=Math.max(0,...analysisSchedule(snapshot).map(row=>row.round));
  return snapshot.schemaVersion===2&&snapshot.lifecycle==='complete'&&last>0&&source===last?'Final':'Current';
}

export function standingsCaption(snapshot: SeasonSnapshot, category: 'drivers'|'constructors') {
  const rows = category === 'drivers' ? snapshot.driverStandings : snapshot.constructorStandings;
  const source = finalStandings<{round:number}>(rows, snapshot)[0]?.round ?? 0;
  const lag=analysisSchedule(snapshot).filter(row=>row.round>source).length;
  return `${category === 'drivers'?'Driver':'Constructor'} standings · ${snapshot.season} · official round ${source}${snapshot.schemaVersion === 2 ? ` · ${standingState(snapshot,source)} standings · ${lag} analyzed GPs behind` : ''}`;
}
export default function SeasonEvidence({snapshot,manifest,season,loading=false}:{snapshot?:SeasonSnapshot;manifest?:SupportManifest;season?:number;loading?:boolean}) {
  const [informationOpen,setInformationOpen]=useState(false);
  const [coverageOpen,setCoverageOpen]=useState(false);
  const rounds=snapshot?analysisSchedule(snapshot).map(row=>row.round):[];
  const drivers=snapshot?finalStandings(snapshot.driverStandings,snapshot)[0]?.round:undefined;
  const constructors=snapshot?finalStandings(snapshot.constructorStandings,snapshot)[0]?.round:undefined;
  const sourceText=(source:number|undefined)=>source===undefined?'Unavailable':`${standingState(snapshot!,source)} standings at round ${source}; ${rounds.filter(round=>round>source).length} analyzed GPs behind`;
  return <>
    <details className="notice season-disclosure" open={informationOpen} onToggle={event=>setInformationOpen(event.currentTarget.open)}>
      <summary>Season information{snapshot||season?` · ${snapshot?.season??season}`:''}</summary>
      <section className="disclosure-content" aria-label="Season evidence">
    {snapshot?.schemaVersion===2?<>
      <strong>{snapshot.lifecycle==='ongoing'?'Ongoing / Season to date':'Complete season'}</strong>
      <p>Audit: {snapshot.audit.status} · Audited {new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(snapshot.audit.auditedAt))}</p>
      <p>Source freshness (oldest page): {new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(snapshot.refreshedAt))}</p>
      <p>Analyzed GP rounds ({rounds.length}): {rounds.join(', ')||'None'}. Metric samples are shown with their evidence.</p>
      {!rounds.length&&<p role="status">No completed GPs. GP comparison categories are unavailable.</p>}
      <p>Standings — Drivers: {sourceText(drivers)}. Constructors: {sourceText(constructors)}.</p>
      {snapshot.schedule.some(row=>!rounds.includes(row.round)&&(row.qualifying==='complete'||row.sprint==='complete'))&&<p>Held qualifying or sprint sessions before an unheld GP remain visible, outside completed-GP comparisons.</p>}
    </>:snapshot?<><p>Snapshot season: {snapshot.season}. Source freshness: {new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(snapshot.refreshedAt))}</p><p>Detailed lifecycle audit is unavailable for this snapshot format.</p></>:<p>{loading?`Loading season ${season??'information'}…`:'Season evidence is unavailable. Load or verify a season to inspect its evidence.'}</p>}
    {!!snapshot?.coverage.gaps.length&&<><h2>Coverage notes ({snapshot.coverage.gaps.length})</h2><ul>{snapshot.coverage.gaps.map(gap=><li key={gap}>{gap}</li>)}</ul></>}
      </section>
    </details>
    <details className="notice season-disclosure" open={coverageOpen} onToggle={event=>setCoverageOpen(event.currentTarget.open)}><summary>Season coverage · 2010–2026</summary><div className="disclosure-content">{manifest?<ul>{candidateSeasons.map(year=>{
      const entry=manifest.seasons.find(item=>item.season===year);
      return <li key={year}>{year}: {entry?.verified?'Verified':'Unverified / unavailable in this release'}{entry?.knownGaps.length?` · ${entry.knownGaps.join('; ')}`:''}</li>;
    })}</ul>:<p>Season verification inventory is unavailable while supported seasons are loading. Use the inline retry action if loading fails.</p>}</div></details>
  </>;
}
