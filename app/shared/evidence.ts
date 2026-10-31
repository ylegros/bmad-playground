import type { SeasonSnapshotV1, SeasonSnapshotV2, SupportedSeasonV2, SupportManifestV2, BundledManifestV2, BundledSeasonV2, SeasonAuditV2, RaceRoundV2, EvidenceProvenance, MediaSlotV2 } from './contracts.ts';
import { validSnapshot, utcTimestamp, validAssetPath, calendarDate } from './validation.ts';
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const url = (v: unknown): v is string => { try { return text(v) && ['https:', 'http:'].includes(new URL(v).protocol); } catch { return false; } };
const provenance = (p: EvidenceProvenance[]) => Array.isArray(p) && p.every(v => v && url(v.sourceUrl) && utcTimestamp(v.observedAt) && text(v.note));
const canonical = (v: unknown): unknown => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort(([a],[b]) => a.localeCompare(b)).map(([k,value]) => [k,canonical(value)])) : v;
const same = (a: unknown, b: unknown) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
export const candidateSeasons = Object.freeze(Array.from({ length: 17 }, (_, i) => 2010 + i));
export function analysisWindow(snapshot: SeasonSnapshotV2): number[] { return snapshot.schedule.filter(r => r.sessions.gp.lifecycle === 'held').map(r => r.round).sort((a,b) => a-b); }
export function validAuditV2(a: SeasonAuditV2): boolean {
  return !!a && text(a.auditId) && utcTimestamp(a.auditedAt) && ['verified','pending','failed'].includes(a.status) && provenance(a.provenance) && a.provenance.length > 0 && provenance(a.completion) &&
    Array.isArray(a.failures) && a.failures.every(text) && Array.isArray(a.endpoints) && a.endpoints.length > 0 && a.endpoints.every(e => url(e.sourceUrl) && Number.isInteger(e.expectedPages) && e.expectedPages > 0 && Number.isInteger(e.fetchedPages) && e.fetchedPages >= 0 && e.fetchedPages <= e.expectedPages) &&
    new Set(a.endpoints.map(e => new URL(e.sourceUrl).origin + new URL(e.sourceUrl).pathname)).size === a.endpoints.length &&
    (a.status !== 'verified' || (!a.failures.length && a.endpoints.every(e => e.expectedPages === e.fetchedPages))) &&
    (!a.migration || (a.migration.fromSchemaVersion === 1 && text(a.migration.snapshotId) && utcTimestamp(a.migration.migratedAt)));
}
function validEndpointInventory(audit: SeasonAuditV2, season: number, rounds: number[]) {
  if(audit.status!=='verified')return true;
  const required=[`${season}.json`,`${season}/results.json`,`${season}/qualifying.json`,`${season}/sprint.json`,...rounds.flatMap(round=>[`${season}/${round}/driverStandings.json`,`${season}/${round}/constructorStandings.json`])];
  const actual=audit.endpoints.map(entry=>new URL(entry.sourceUrl).pathname);
  return actual.length===required.length&&required.every(path=>actual.some(value=>value.endsWith('/'+path)));
}
export function validSnapshotV2(raw: unknown, season: number): raw is SeasonSnapshotV2 {
  try {
    const s = raw as SeasonSnapshotV2;
    if (!s || s.schemaVersion !== 2 || !candidateSeasons.includes(season) || !text(s.snapshotId) || !['ongoing','complete'].includes(s.lifecycle) || !validAuditV2(s.audit)) return false;
    if (!validSnapshot({ ...s, schemaVersion: 1 }, season, true)) return false;
    if (Object.values(s.drivers).some(d => !text(d.id) || !text(d.name) || typeof d.code !== 'string' || !text(d.nationality)) || Object.values(s.constructors).some(c => !text(c.id) || !text(c.name) || !text(c.nationality))) return false;
    if (!same(s.analysisRounds, analysisWindow(s))) return false;
    if (!validEndpointInventory(s.audit,s.season,s.analysisRounds)) return false;
    if (s.schedule.some((r,i) => i > 0 && r.round <= s.schedule[i-1].round)) return false;
    for (const r of s.schedule) for (const kind of ['gp','qualifying','sprint'] as const) {
      const e = r.sessions[kind];
      if (!e || typeof e.applicable !== 'boolean' || !['held','unheld','cancelled','unknown'].includes(e.lifecycle) || !provenance(e.provenance)) return false;
      if ((kind !== 'sprint' && !e.applicable) || (!e.applicable && (r[kind] !== 'not-applicable' || e.lifecycle === 'held')) || (e.applicable && r[kind] === 'not-applicable')) return false;
      if (e.lifecycle !== 'unknown' && !e.provenance.length) return false;
      if (e.lifecycle !== 'held' && r[kind] === 'complete') return false;
      const records = kind === 'qualifying' ? s.qualifying.filter(v => v.round === r.round) : s.results.filter(v => v.round === r.round && v.kind === kind);
      if (records.length && (e.lifecycle !== 'held' || r[kind] !== 'complete')) return false;
      if (e.lifecycle === 'held' && r[kind] === 'unavailable' && !s.coverage.gaps.some(gap=>gap.startsWith(`Round ${r.round}: ${kind} `))) return false;
      if (s.audit.status === 'verified' && e.lifecycle === 'unknown') return false;
    }
    for(const round of s.analysisRounds)for(const [kind,rows] of [['driver',s.driverStandings],['constructor',s.constructorStandings]] as const){
      if(!rows.some(row=>row.round===round)&&!s.coverage.gaps.some(gap=>gap.startsWith(`Round ${round}: ${kind} standings `)))return false;
    }
    if (s.driverStandings.some(r => !s.analysisRounds.includes(r.round)) || s.constructorStandings.some(r => !s.analysisRounds.includes(r.round))) return false;
    if (s.lifecycle === 'complete' && (!s.audit.completion.length || s.schedule.some(r => r.sessions.gp.lifecycle === 'unheld' || r.sessions.gp.lifecycle === 'unknown'))) return false;
    return true;
  } catch { return false; }
}
export function supportEntryV2(s: SeasonSnapshotV2): SupportedSeasonV2 {
  if (!validSnapshotV2(s, s.season)) throw new Error('Invalid v2 snapshot');
  return structuredClone({ season: s.season, schemaVersion: 2, snapshotId: s.snapshotId, refreshedAt: s.refreshedAt, verified: s.audit.status === 'verified', lastCheckedRound: Math.max(0,...s.analysisRounds), knownGaps: s.coverage.gaps, lifecycle: s.lifecycle, analysisRounds: s.analysisRounds, audit: s.audit });
}
function validEntry(e: SupportedSeasonV2): boolean {
  return !!e && candidateSeasons.includes(e.season) && e.schemaVersion === 2 && text(e.snapshotId) && utcTimestamp(e.refreshedAt) && typeof e.verified === 'boolean' && ['ongoing','complete'].includes(e.lifecycle) && validAuditV2(e.audit) && e.verified === (e.audit.status === 'verified') && Array.isArray(e.analysisRounds) && e.analysisRounds.every((r,i,a) => Number.isInteger(r) && r > 0 && (i === 0 || r > a[i-1])) && validEndpointInventory(e.audit,e.season,e.analysisRounds) && e.lastCheckedRound === Math.max(0,...e.analysisRounds) && Array.isArray(e.knownGaps) && e.knownGaps.every(text) && (e.lifecycle !== 'complete' || e.audit.completion.length > 0);
}
export function validSupportManifestV2(raw: unknown): raw is SupportManifestV2 {
  try { const m = raw as SupportManifestV2; return m.schemaVersion === 2 && Array.isArray(m.seasons) && m.seasons.length > 0 && m.seasons.length <= 17 && new Set(m.seasons.map(e => e.season)).size === m.seasons.length && m.seasons.every(validEntry); } catch { return false; }
}
export function validBundledManifestV2(raw: unknown): raw is BundledManifestV2 {
  try { const m = raw as BundledManifestV2; return m.bundleVersion === 2 && utcTimestamp(m.exportedAt) && validSupportManifestV2({schemaVersion:2,seasons:m.seasons}) && m.seasons.every(e => e.verified && validAssetPath(e.assetPath) && new RegExp(`^bundled/releases/[A-Za-z0-9_-]+/${e.season}\\.json$`).test(e.assetPath)) && new Set(m.seasons.map(e => e.assetPath.split('/')[2])).size === 1; } catch { return false; }
}
export function validBundledSnapshotV2(raw: unknown, entry: BundledSeasonV2): raw is SeasonSnapshotV2 { return validEntry(entry) && validSnapshotV2(raw,entry.season) && same(supportEntryV2(raw), (({assetPath: _, ...rest}) => rest)(entry)); }
export function migrateSnapshotV1(source: SeasonSnapshotV1, evidence: { snapshotId: string; lifecycle: 'ongoing'|'complete'; schedule: RaceRoundV2[]; audit: SeasonAuditV2; migratedAt: string }): SeasonSnapshotV2 {
  if (!validSnapshot(source,source.season) || !text(evidence.snapshotId) || evidence.snapshotId === source.snapshotId || evidence.audit.auditId === source.snapshotId || !utcTimestamp(evidence.migratedAt) || !same(evidence.schedule.map(({sessions: _,...r}) => r),source.schedule)) throw new Error('Migration requires matching explicit calendar evidence and distinct identity');
  const result: SeasonSnapshotV2 = structuredClone({...source,schemaVersion:2,snapshotId:evidence.snapshotId,lifecycle:evidence.lifecycle,schedule:evidence.schedule,audit:{...evidence.audit,migration:{fromSchemaVersion:1,snapshotId:source.snapshotId,migratedAt:evidence.migratedAt}},analysisRounds:[]});
  result.analysisRounds = analysisWindow(result);
  if (!validSnapshotV2(result,result.season) || result.audit.status !== 'verified') throw new Error('Migration evidence is incomplete or contradictory');
  return result;
}
export function validMediaSlotV2(raw: unknown, s: SeasonSnapshotV2): raw is MediaSlotV2 {
  try { const m = raw as MediaSlotV2; if (m.season !== s.season || !['portrait','constructor'].includes(m.kind) || !(m.kind === 'portrait' ? s.drivers[m.identity] : s.constructors[m.identity])) return false;
    if (m.status === 'exception') return Array.isArray(m.attemptedSources) && m.attemptedSources.length > 0 && m.attemptedSources.every(url) && text(m.blocker) && text(m.visualCheck);
    return m.status === 'mapped' && validAssetPath(`media/${m.filename}`) && url(m.sourceUrl) && text(m.creator) && text(m.license) && url(m.licenseUrl) && text(m.attribution) && Array.isArray(m.applicableSeasons) && new Set(m.applicableSeasons).size === m.applicableSeasons.length && m.applicableSeasons.includes(s.season) && m.applicableSeasons.every(y => candidateSeasons.includes(y)) && (m.photographDate === 'unknown' || calendarDate(m.photographDate)) && text(m.cropNotes) && text(m.visualCheck);
  } catch { return false; }
}
/** Full denominator validation: missing and duplicate slots never become acquired images. */
export function mediaCoverageV2(slots: MediaSlotV2[], snapshot: SeasonSnapshotV2) {
  const keys = slots.map(m => `${m.kind}/${m.identity}`);
  if (new Set(keys).size !== keys.length || slots.some(m => !validMediaSlotV2(m,snapshot))) throw new Error('Invalid or duplicate media slot');
  return (['portrait','constructor'] as const).map(kind => {
    const identities = Object.keys(kind === 'portrait' ? snapshot.drivers : snapshot.constructors);
    const rows = slots.filter(m => m.kind === kind);
    if (rows.length !== identities.length || identities.some(id => !rows.some(m => m.identity === id))) throw new Error('Incomplete media slot inventory');
    return {kind,season:snapshot.season,total:identities.length,actual:rows.filter(m => m.status === 'mapped').length,exceptions:rows.filter(m => m.status === 'exception').length};
  });
}
