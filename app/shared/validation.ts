import type { SeasonSnapshot, SupportManifest, BundledManifest, BundledSeason } from './contracts.ts';
export function calendarDate(raw: unknown): boolean { return typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(Date.parse(raw)) && new Date(raw).toISOString().slice(0, 10) === raw; }
export function utcTimestamp(raw: unknown): boolean { return typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(raw) && Number.isFinite(Date.parse(raw)) && new Date(raw).toISOString() === (raw.includes('.') ? raw : raw.replace('Z', '.000Z')); }
export function validSnapshot(raw: unknown, season: number): raw is SeasonSnapshot {
  try {
  const s = raw as SeasonSnapshot;
  const metric = (m: unknown) => { const v = m as {kind?: string;value?: number;reason?: string}; return !!v && (v.kind === 'value' ? typeof v.value === 'number' && Number.isFinite(v.value) : v.kind === 'unavailable' && typeof v.reason === 'string'); };
  const position = (m: unknown) => metric(m) && ((m as {kind:string}).kind === 'unavailable' || (Number.isInteger((m as {value:number}).value) && (m as {value:number}).value > 0));
  if (!(!!s && s.schemaVersion === 1 && s.season === season && typeof s.snapshotId === 'string' && utcTimestamp(s.refreshedAt) && Array.isArray(s.schedule) && s.schedule.length > 0 && !!s.drivers && !!s.constructors && Array.isArray(s.results) && Array.isArray(s.qualifying) && Array.isArray(s.driverStandings) && Array.isArray(s.constructorStandings) && Array.isArray(s.coverage?.checkedRounds) && Array.isArray(s.coverage?.gaps))) return false;
  const rounds = new Set(s.schedule.map(r => r.round));
  if (rounds.size !== s.schedule.length || s.schedule.some(r => !Number.isInteger(r.round) || r.round < 1 || typeof r.name !== 'string' || !calendarDate(r.date) || !['complete','unavailable'].includes(r.gp) || !['complete','unavailable'].includes(r.qualifying) || !['complete','unavailable','not-applicable'].includes(r.sprint))) return false;
  if (s.coverage.checkedRounds.length !== rounds.size || new Set(s.coverage.checkedRounds).size !== rounds.size || s.coverage.checkedRounds.some(r => !rounds.has(r)) || s.coverage.gaps.some(g => typeof g !== 'string')) return false;
  if (Array.isArray(s.drivers) || Array.isArray(s.constructors) || Object.entries(s.drivers).some(([id, d]) => !d || d.id !== id || typeof d.name !== 'string') || Object.entries(s.constructors).some(([id, c]) => !c || c.id !== id || typeof c.name !== 'string')) return false;
  const resultKeys = s.results.map(r => `${r.round}/${r.kind}/${r.driverId}`);
  if (new Set(resultKeys).size !== resultKeys.length) return false;
  if (s.results.some(r => !rounds.has(r.round) || !['gp','sprint'].includes(r.kind) || !s.drivers[r.driverId] || !s.constructors[r.constructorId] || !position(r.position) || !metric(r.points) || typeof r.status !== 'string' || typeof r.classification !== 'string')) return false;
  if (s.qualifying.some(r => !rounds.has(r.round) || !s.drivers[r.driverId] || !s.constructors[r.constructorId] || !position(r.position))) return false;
  if (s.driverStandings.some(r => !rounds.has(r.round) || !s.drivers[r.driverId] || !Array.isArray(r.constructorIds) || r.constructorIds.some(id => !s.constructors[id]) || !position(r.position) || !metric(r.points))) return false;
  if (s.constructorStandings.some(r => !rounds.has(r.round) || !s.constructors[r.constructorId] || !position(r.position) || !metric(r.points))) return false;
  for (const keys of [s.qualifying.map(r => `${r.round}/${r.driverId}`), s.driverStandings.map(r => `${r.round}/${r.driverId}`), s.constructorStandings.map(r => `${r.round}/${r.constructorId}`)]) if (new Set(keys).size !== keys.length) return false;
  for (const round of s.schedule) {
    if (round.gp === 'complete' && !s.results.some(r => r.round === round.round && r.kind === 'gp')) return false;
    if (round.sprint === 'complete' && !s.results.some(r => r.round === round.round && r.kind === 'sprint')) return false;
    if (round.sprint === 'not-applicable' && s.results.some(r => r.round === round.round && r.kind === 'sprint')) return false;
    if (round.qualifying === 'complete' && !s.qualifying.some(r => r.round === round.round)) return false;
    if (!s.driverStandings.some(r => r.round === round.round) || !s.constructorStandings.some(r => r.round === round.round)) return false;
    if (!s.coverage.gaps.length && (round.gp !== 'complete' || round.qualifying !== 'complete' || round.sprint === 'unavailable')) return false;
  }
  return true;
  } catch { return false; }
}
export const supportedSeasons = [2010, 2021] as const;
export function validSupportManifest(raw: unknown): raw is SupportManifest {
  try {
    const manifest = raw as SupportManifest;
    return !!manifest && Array.isArray(manifest.seasons) && manifest.seasons.length > 0 && manifest.seasons.length <= 2 &&
      new Set(manifest.seasons.map(s => s.season)).size === manifest.seasons.length && manifest.seasons.every(s =>
        supportedSeasons.includes(s.season as 2010 | 2021) && typeof s.verified === 'boolean' &&
        Number.isInteger(s.lastCheckedRound) && s.lastCheckedRound >= 0 && Array.isArray(s.knownGaps) &&
        s.knownGaps.every(gap => typeof gap === 'string') && (!s.verified || (s.lastCheckedRound > 0 && !s.knownGaps.length)));
  } catch { return false; }
}
// Restrict assets to ordinary relative paths: no origin, query, encoding or traversal.
export function validAssetPath(path: unknown): path is string {
  return typeof path === 'string' && /^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_.-]+)+$/.test(path) &&
    path.split('/').every(part => part !== '.' && part !== '..');
}
export function validBundledManifest(raw: unknown): raw is BundledManifest {
  try {
    const manifest = raw as BundledManifest;
    if (!validSupportManifest(manifest) || manifest.seasons.length !== 2 || manifest.bundleVersion !== 1 || !utcTimestamp(manifest.exportedAt)) return false;
    const releases = new Set<string>();
    for (const season of manifest.seasons) {
      if (!season.verified || season.schemaVersion !== 1 || typeof season.snapshotId !== 'string' || !season.snapshotId.trim() ||
        !utcTimestamp(season.refreshedAt) || !validAssetPath(season.assetPath) ||
        !new RegExp(`^bundled/releases/[A-Za-z0-9_-]+/${season.season}\\.json$`).test(season.assetPath)) return false;
      releases.add(season.assetPath.split('/')[2]);
    }
    return releases.size === 1;
  } catch { return false; }
}
export function validBundledSnapshot(raw: unknown, entry: BundledSeason): raw is SeasonSnapshot {
  return validSnapshot(raw, entry.season) && raw.snapshotId === entry.snapshotId && raw.schemaVersion === entry.schemaVersion &&
    raw.refreshedAt === entry.refreshedAt && raw.coverage.gaps.length === 0 &&
    Math.max(...raw.coverage.checkedRounds) === entry.lastCheckedRound;
}
