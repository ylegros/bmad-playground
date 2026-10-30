import { useState } from 'react';
import type { SeasonSnapshot } from '../shared/contracts';
import { mappedMedia, mediaCredits, mediaUrl } from './media';
import './comparison.css';

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
    <div><strong>{name}</strong>{portrait&&<><span className="identity-season">Season {snapshot.season}</span><div className="identity-teams">{teams.map(team=><ConstructorIdentity key={team} snapshot={snapshot} id={team}/>)}</div>{asset&&<small className="portrait-date">Portrait from {asset.portraitDate==='unknown'?'date unknown':asset.portraitDate.slice(0,4)}; selected season {snapshot.season}. <a href="#image-credits" onClick={event=>{event.preventDefault();const credits=document.querySelector<HTMLDetailsElement>('#image-credits');if(credits){credits.open=true;credits.querySelector<HTMLElement>('summary')?.focus();credits.scrollIntoView({block:'start'});}}}>Image details</a></small>}</>}</div>
  </div>;
}
export function ImageCredits() {
  return <details id="image-credits" className="image-credits"><summary>Image credits</summary><p>All images are bundled locally. Photo dates describe the source photographs, not the selected season. Unavailable driver portraits use initials; unavailable team logos leave the team name alone. Team trademarks remain with their owners; no endorsement is implied.</p>
    <ul>{mediaCredits.assets.map(asset=><li key={asset.filename}><strong>{asset.identity} · {asset.seasons.join(', ')}</strong><p>{asset.attribution}</p><p><a href={asset.sourceUrl}>Original source</a> · Creator: {asset.creator} · <a href={asset.licenseUrl}>{asset.license}</a> · Photo date: {asset.portraitDate} · File: {asset.filename}</p><p>{asset.cropNotes}</p></li>)}</ul>
    <details><summary>Documented identity fallbacks ({mediaCredits.fallbacks.length})</summary><ul>{mediaCredits.fallbacks.map(fallback=><li key={`${fallback.kind}-${fallback.identity}-${fallback.season}`}>{fallback.identity} · {fallback.season} · {fallback.kind}: {fallback.reason}</li>)}</ul></details>
    <a href={mediaUrl('credits.json')}>Download complete image credits JSON</a>
  </details>;
}
