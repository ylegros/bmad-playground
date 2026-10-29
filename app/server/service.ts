import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import type { SeasonSnapshot, SupportManifest } from '../shared/contracts.ts';
import { buildSnapshot, DataError } from './jolpica.ts';

export const candidateSeasons = [2010, 2021];
export const snapshotChecksum = (snapshot: unknown): string => createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
export { calendarDate, validSnapshot } from '../shared/validation.ts';
import { validSnapshot } from '../shared/validation.ts';
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
