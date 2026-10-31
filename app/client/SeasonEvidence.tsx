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
  return `${category === 'drivers'?'Driver':'Constructor'} standings · ${snapshot.season} · official round ${source}${snapshot.schemaVersion === 2 ? ` · ${standingState(snapshot,source)} standings` : ''}`;
}
export default function SeasonEvidence({snapshot,manifest}:{snapshot?:SeasonSnapshot;manifest?:SupportManifest}) {
  const rounds=snapshot?analysisSchedule(snapshot).map(row=>row.round):[];
  const drivers=snapshot?finalStandings(snapshot.driverStandings,snapshot)[0]?.round:undefined;
  const constructors=snapshot?finalStandings(snapshot.constructorStandings,snapshot)[0]?.round:undefined;
  const sourceText=(source:number|undefined)=>source===undefined?'Unavailable':`${standingState(snapshot!,source)} standings at round ${source}; ${rounds.filter(round=>round>source).length} analyzed GPs behind`;
  return <>
    {snapshot?.schemaVersion===2&&<section className="notice" aria-label="Season evidence">
      <strong>{snapshot.lifecycle==='ongoing'?'Ongoing / Season to date':'Complete season'}</strong>
      <p>Audit: {snapshot.audit.status} · Audited {new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(snapshot.audit.auditedAt))}</p>
      <p>Source freshness (oldest page): {new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'long'}).format(new Date(snapshot.refreshedAt))}</p>
      <p>Analyzed GP rounds ({rounds.length}): {rounds.join(', ')||'None'}. Metric samples are shown with their evidence.</p>
      {!rounds.length&&<p role="status">No completed GPs. GP comparison categories are unavailable.</p>}
      <p>Standings — Drivers: {sourceText(drivers)}. Constructors: {sourceText(constructors)}.</p>
      {snapshot.schedule.some(row=>!rounds.includes(row.round)&&(row.qualifying==='complete'||row.sprint==='complete'))&&<p>Held qualifying or sprint sessions before an unheld GP remain visible, outside completed-GP comparisons.</p>}
    </section>}
    {manifest&&<details className="notice"><summary>Season coverage · 2010–2026</summary><ul>{candidateSeasons.map(year=>{
      const entry=manifest.seasons.find(item=>item.season===year);
      return <li key={year}>{year}: {entry?.verified?'Verified':'Unverified / unavailable in this release'}{entry?.knownGaps.length?` · ${entry.knownGaps.join('; ')}`:''}</li>;
    })}</ul></details>}
  </>;
}
