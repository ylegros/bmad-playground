import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import type { SeasonSnapshot, SupportManifest } from '../shared/contracts.ts';
import { buildSnapshot, DataError } from './jolpica.ts';

export const candidateSeasons = [2010, 2021];
export const snapshotChecksum = (snapshot: unknown): string => createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
export function calendarDate(raw: unknown): boolean { return typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(Date.parse(raw)) && new Date(raw).toISOString().slice(0, 10) === raw; }
function utcTimestamp(raw: unknown): boolean { return typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(raw) && Number.isFinite(Date.parse(raw)) && new Date(raw).toISOString() === (raw.includes('.') ? raw : raw.replace('Z', '.000Z')); }
export function validSnapshot(raw: unknown, season: number): raw is SeasonSnapshot {
  try {
  const s = raw as SeasonSnapshot;
  const metric = (m: unknown) => { const v = m as {kind?: string;value?: number;reason?: string}; return !!v && (v.kind === 'value' ? typeof v.value === 'number' && Number.isFinite(v.value) : v.kind === 'unavailable' && typeof v.reason === 'string'); };
  if (!(!!s && s.schemaVersion === 1 && s.season === season && typeof s.snapshotId === 'string' && utcTimestamp(s.refreshedAt) && Array.isArray(s.schedule) && s.schedule.length > 0 && !!s.drivers && !!s.constructors && Array.isArray(s.results) && Array.isArray(s.qualifying) && Array.isArray(s.driverStandings) && Array.isArray(s.constructorStandings) && Array.isArray(s.coverage?.checkedRounds) && Array.isArray(s.coverage?.gaps))) return false;
  const rounds = new Set(s.schedule.map(r => r.round));
  if (rounds.size !== s.schedule.length || s.schedule.some(r => !Number.isInteger(r.round) || r.round < 1 || typeof r.name !== 'string' || !calendarDate(r.date) || !['complete','unavailable'].includes(r.gp) || !['complete','unavailable'].includes(r.qualifying) || !['complete','unavailable','not-applicable'].includes(r.sprint))) return false;
  if (s.coverage.checkedRounds.length !== rounds.size || new Set(s.coverage.checkedRounds).size !== rounds.size || s.coverage.checkedRounds.some(r => !rounds.has(r)) || s.coverage.gaps.some(g => typeof g !== 'string')) return false;
  if (Array.isArray(s.drivers) || Array.isArray(s.constructors) || Object.entries(s.drivers).some(([id, d]) => !d || d.id !== id || typeof d.name !== 'string') || Object.entries(s.constructors).some(([id, c]) => !c || c.id !== id || typeof c.name !== 'string')) return false;
  const resultKeys = s.results.map(r => `${r.round}/${r.kind}/${r.driverId}`);
  if (new Set(resultKeys).size !== resultKeys.length) return false;
  if (s.results.some(r => !rounds.has(r.round) || !['gp','sprint'].includes(r.kind) || !s.drivers[r.driverId] || !s.constructors[r.constructorId] || !metric(r.position) || !metric(r.points) || typeof r.status !== 'string' || typeof r.classification !== 'string')) return false;
  if (s.qualifying.some(r => !rounds.has(r.round) || !s.drivers[r.driverId] || !s.constructors[r.constructorId] || !metric(r.position))) return false;
  if (s.driverStandings.some(r => !rounds.has(r.round) || !s.drivers[r.driverId] || !Array.isArray(r.constructorIds) || r.constructorIds.some(id => !s.constructors[id]) || !metric(r.position) || !metric(r.points))) return false;
  if (s.constructorStandings.some(r => !rounds.has(r.round) || !s.constructors[r.constructorId] || !metric(r.position) || !metric(r.points))) return false;
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
export class SnapshotService {
  private active = new Map<number, { promise: Promise<SeasonSnapshot>; refresh: boolean }>();
  directory: string;
  private loader: typeof buildSnapshot;
  constructor(directory = resolve('.cache/seasons'), loader = buildSnapshot) { this.directory = directory; this.loader = loader; }
  async cached(season: number): Promise<SeasonSnapshot | undefined> {
    try { const envelope = JSON.parse(await readFile(join(this.directory, `${season}.json`), 'utf8')); return typeof envelope?.checksum === 'string' && envelope.checksum === snapshotChecksum(envelope.snapshot) && validSnapshot(envelope.snapshot, season) ? envelope.snapshot : undefined; } catch { return undefined; }
  }
  async manifest(): Promise<SupportManifest> {
    const seasons = await Promise.all(candidateSeasons.map(async season => { const s = await this.cached(season); return { season, verified: !!s && s.coverage.gaps.length === 0, lastCheckedRound: s ? Math.max(...s.coverage.checkedRounds) : 0, knownGaps: s?.coverage.gaps ?? ['Initial season audit not completed'] }; }));
    return { seasons };
  }
  async get(season: number, refresh = false): Promise<SeasonSnapshot> {
    if (!candidateSeasons.includes(season)) throw new DataError('UNSUPPORTED_SEASON', 'This iteration supports only 2010 and 2021.', 400);
    const pending = this.active.get(season); if (pending && (!refresh || pending.refresh)) return pending.promise;
    const task = (async () => {
      if (pending) { try { await pending.promise; } catch { /* An explicit refresh may recover from a failed initial load. */ } }
      if (!refresh) { const cached = await this.cached(season); if (cached) return cached; }
      const start = Date.now();
      try {
        const snapshot = await this.loader(season);
        if (!validSnapshot(snapshot, season)) throw new DataError('INVALID_SNAPSHOT', 'Season validation failed.');
        if (snapshot.coverage.gaps.length) throw new DataError('INCOMPLETE_COVERAGE', `Season audit found gaps: ${snapshot.coverage.gaps.join('; ')}`);
        await mkdir(this.directory, { recursive: true });
        const temp = join(this.directory, `${season}.${randomUUID()}.tmp`);
        await writeFile(temp, JSON.stringify({ checksum: snapshotChecksum(snapshot), snapshot })); await rename(temp, join(this.directory, `${season}.json`));
        console.info(JSON.stringify({ operation: refresh ? 'refresh' : 'initial-load', season, snapshotId: snapshot.snapshotId, durationMs: Date.now() - start }));
        return snapshot;
      } catch (error) { console.error(JSON.stringify({ operation: refresh ? 'refresh' : 'initial-load', season, durationMs: Date.now() - start, code: error instanceof DataError ? error.code : 'INTERNAL_ERROR' })); throw error; }
    })();
    const operation = { promise: task, refresh }; this.active.set(season, operation);
    try { return await task; } finally { if (this.active.get(season) === operation) this.active.delete(season); }
  }
}
