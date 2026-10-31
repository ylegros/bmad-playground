import { useRef, useState } from 'react';
import type { SeasonSnapshot } from '../shared/contracts';
import { mappedMedia, mediaCredits, mediaUrl, mediaInventory, mediaInvestigations, seasonMediaCoverage, mediaEvidenceUrl, mediaAcceptance } from './media';
import './comparison.css';
import './media-credits.css';
let creditsReturnFocus: HTMLElement | undefined;
function openCredits(trigger: HTMLElement) {
  const credits=document.querySelector<HTMLDetailsElement>('#image-credits');
  if(credits){creditsReturnFocus=trigger;credits.open=true;credits.querySelector<HTMLElement>('summary')?.focus();credits.scrollIntoView({block:'start'});}
}

function MediaFrame({kind,id,name,season}:{kind:'portrait'|'constructor';id:string;name:string;season:number}) {
  const asset=mappedMedia(kind,id,season);
  const [failed,setFailed]=useState<string>();
  if(kind==='constructor'&&(!asset||failed===asset.filename)) return null;
  const initials=name.split(/\s+/).map(part=>part[0]).filter(Boolean).slice(0,2).join('');
  return <span className={`identity-frame ${kind}-frame`} data-fallback={!asset||failed===asset.filename?'true':undefined}>
    {asset&&failed!==asset.filename?<img src={mediaUrl(asset.filename)} alt="" width={kind==='portrait'?240:100} height={kind==='portrait'?300:40} loading="lazy" style={id==='russell'?{objectPosition:'42% center'}:undefined} onError={()=>setFailed(asset.filename)}/>:<span aria-hidden="true">{kind==='portrait'?initials:name}</span>}
  </span>;
}
export function ConstructorIdentity({snapshot,id}:{snapshot:SeasonSnapshot;id:string}) {
  const name=snapshot.constructors[id]?.name||id;
  const asset=mappedMedia('constructor',id,snapshot.season);
  return <span className="constructor-identity"><MediaFrame key={`${id}-${snapshot.season}-${asset?.filename??''}`} kind="constructor" id={id} name={name} season={snapshot.season}/><span>{name}</span></span>;
}
export function DriverIdentity({snapshot,id,portrait=false}:{snapshot:SeasonSnapshot;id:string;portrait?:boolean}) {
  const name=snapshot.drivers[id]?.name||id;
  const teams=[...new Set([...snapshot.driverStandings.filter(row=>row.driverId===id).flatMap(row=>row.constructorIds),...snapshot.results.filter(row=>row.driverId===id).map(row=>row.constructorId),...snapshot.qualifying.filter(row=>row.driverId===id).map(row=>row.constructorId)])];
  const asset=mappedMedia('portrait',id,snapshot.season);
  return <div className={`driver-identity ${portrait?'with-portrait':''}`}>
    {portrait&&<MediaFrame key={`${id}-${snapshot.season}`} kind="portrait" id={id} name={name} season={snapshot.season}/>}
    <div><strong>{name}</strong>{portrait&&<><span className="identity-season">Season {snapshot.season}</span><div className="identity-teams">{teams.map(team=><ConstructorIdentity key={team} snapshot={snapshot} id={team}/>)}</div>{asset&&<small className="portrait-date">Portrait from {asset.portraitDate==='unknown'?'date unknown':asset.portraitDate.slice(0,4)}; selected season {snapshot.season}. <a href="#image-credits" onClick={event=>{event.preventDefault();openCredits(event.currentTarget);}}>Image details</a></small>}</>}</div>
  </div>;
}

export function ImageCredits({snapshot}:{snapshot?:SeasonSnapshot} = {}) {
  const details=useRef<HTMLDetailsElement>(null);
  const close=()=>{if(details.current)details.current.open=false;(creditsReturnFocus?.isConnected?creditsReturnFocus:details.current?.querySelector<HTMLElement>('summary'))?.focus();creditsReturnFocus=undefined;};
  const coverage=snapshot?seasonMediaCoverage(snapshot):mediaInventory.coverage;
  const acceptance=mediaAcceptance();
  return <details ref={details} id="image-credits" className="image-credits" onKeyDown={event=>{if(event.key==='Escape'&&details.current?.open){event.preventDefault();close();}}} onToggle={()=>{if(!details.current?.open&&creditsReturnFocus){creditsReturnFocus.focus();creditsReturnFocus=undefined;}}}><summary onClick={event=>{if(!details.current?.open)creditsReturnFocus=event.currentTarget;}}>Image credits</summary><button type="button" onClick={close}>Close image credits</button><p>All images are bundled locally. Photo dates describe the source photographs, not the selected season. Unavailable driver portraits use initials; unavailable team logos leave the team name alone. Team trademarks remain with their owners; no endorsement is implied.</p>
    <div className="media-coverage-scroll" role="region" aria-label="Image coverage" tabIndex={0}><table><caption>Image coverage: actual images and investigated exceptions are counted separately. Unresolved slots remain open.</caption><thead><tr><th>Season</th><th>Kind</th><th>Actual / total</th><th>Investigated exceptions</th><th>Unresolved</th></tr></thead><tbody>{coverage.map(row=><tr key={`${row.season}-${row.kind}`}><td>{row.season}</td><td>{row.kind==='portrait'?'Driver photographs':'Constructor logos'}</td><td>{row.actual} / {row.total}</td><td>{row.exceptions}</td><td>{row.unresolved}</td></tr>)}</tbody></table></div><p>Inventory checked {mediaInventory.checkedAt}. {acceptance.pending>0?`${acceptance.pending} documented exceptions await acceptance.`:acceptance.total>0?`All ${acceptance.total} documented exceptions were accepted for this release.`:''} Image decoding checks file integrity; historical identity and crop checks are recorded in the season evidence.</p>
    <ul>{mediaCredits.assets.map(asset=><li key={`${asset.kind}-${asset.identity}-${asset.filename}`}><strong>{asset.identity} · {asset.seasons.join(', ')}</strong><p>{asset.attribution}</p><p><a href={asset.sourceUrl}>Original source</a> · Creator: {asset.creator} · <a href={asset.licenseUrl}>{asset.license}</a> · Photo date: {asset.portraitDate} · File: {asset.filename}</p><p>{asset.cropNotes}</p></li>)}</ul>
    {mediaInvestigations.length>0&&<details><summary>Investigated exceptions ({mediaInvestigations.length})</summary><ul>{mediaInvestigations.map(item=><li key={`${item.kind}-${item.identity}-${item.season}`}>{item.identity} · {item.season}: {item.blocker}<p>{item.visualCheck} · <a href={mediaEvidenceUrl(item.visualEvidence)}>Visual review evidence</a> · {item.reviewedAt} · {item.acceptance==='accepted-by-user'?'Accepted exception':'Awaiting acceptance'}</p><ul>{item.attemptedSources.map(url=><li key={url}><a href={url}>Attempted source</a></li>)}</ul></li>)}</ul></details>}
    <details><summary>Legacy fallback notes ({mediaCredits.fallbacks.length}; not counted as investigated exceptions)</summary><ul>{mediaCredits.fallbacks.map(fallback=><li key={`${fallback.kind}-${fallback.identity}-${fallback.season}`}>{fallback.identity} · {fallback.season} · {fallback.kind}: {fallback.reason}</li>)}</ul></details>
    <a href={mediaUrl('credits.json')}>Download complete image credits JSON</a>
  </details>;
}
