import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import type { SeasonSnapshot, SupportManifest } from '../shared/contracts.ts';
import { DataError } from './jolpica.ts';
import { loadAuditedSnapshot } from './evidence-ingestion.ts';
import { candidateSeasons as candidates } from '../shared/evidence.ts';
import { validVersionedSnapshot, supportForSnapshot } from '../shared/versioned.ts';

export const candidateSeasons = [...candidates];
export const snapshotChecksum = (snapshot: unknown): string => createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
export { calendarDate, validSnapshot } from '../shared/validation.ts';
export class SnapshotService {
  private active = new Map<number, { promise: Promise<SeasonSnapshot>; refresh: boolean }>();
  directory: string;
  v2Directory: string;
  private loader: (season: number, refresh?: boolean) => Promise<SeasonSnapshot>;
  constructor(directory = resolve('.cache/seasons'), loader: (season: number, refresh?: boolean) => Promise<SeasonSnapshot> = loadAuditedSnapshot, v2Directory = directory === resolve('.cache/seasons') ? resolve('.cache/seasons-v2') : join(directory, 'v2')) { this.directory = directory; this.v2Directory = v2Directory; this.loader = loader; }
  async cached(season: number): Promise<SeasonSnapshot | undefined> {
    for (const directory of [this.v2Directory, this.directory]) {
      try { const envelope = JSON.parse(await readFile(join(directory, `${season}.json`), 'utf8'));
        if (typeof envelope?.checksum === 'string' && envelope.checksum === snapshotChecksum(envelope.snapshot) && validVersionedSnapshot(envelope.snapshot, season) && (directory !== this.v2Directory || envelope.snapshot.schemaVersion === 2 && envelope.snapshot.audit.status === 'verified')) return envelope.snapshot;
      } catch { /* Continue to separate approved baseline cache. */ }
    }
    return undefined;
  }
  async manifest(): Promise<SupportManifest> {
    const seasons = await Promise.all(candidateSeasons.map(async season => { const s = await this.cached(season); return s ? supportForSnapshot(s) : { season, verified: false, lastCheckedRound: 0, knownGaps: ['Initial season audit not completed'] }; }));
    return { seasons };
  }
  async get(season: number, refresh = false): Promise<SeasonSnapshot> {
    if (!candidateSeasons.includes(season)) throw new DataError('UNSUPPORTED_SEASON', 'Season must be a candidate between 2010 and 2026.', 400);
    const pending = this.active.get(season); if (pending && (!refresh || pending.refresh)) return pending.promise;
    const task = (async () => {
      if (pending) { try { await pending.promise; } catch { /* An explicit refresh may recover from a failed initial load. */ } }
      if (!refresh) { const cached = await this.cached(season); if (cached) return cached; }
      const start = Date.now();
      try {
        const snapshot = await this.loader(season, refresh);
        if (!validVersionedSnapshot(snapshot, season)) throw new DataError('INVALID_SNAPSHOT', 'Season validation failed.');
        if (snapshot.schemaVersion === 2 ? snapshot.audit.status !== 'verified' : snapshot.coverage.gaps.length) throw new DataError('INCOMPLETE_COVERAGE', `Season audit found gaps: ${snapshot.coverage.gaps.join('; ')}`);
        const target = snapshot.schemaVersion === 2 ? this.v2Directory : this.directory;
        await mkdir(target, { recursive: true });
        const temp = join(target, `${season}.${randomUUID()}.tmp`);
        await writeFile(temp, JSON.stringify({ checksum: snapshotChecksum(snapshot), snapshot })); await rename(temp, join(target, `${season}.json`));
        console.info(JSON.stringify({ operation: refresh ? 'refresh' : 'initial-load', season, snapshotId: snapshot.snapshotId, durationMs: Date.now() - start }));
        return snapshot;
      } catch (error) { console.error(JSON.stringify({ operation: refresh ? 'refresh' : 'initial-load', season, durationMs: Date.now() - start, code: error instanceof DataError ? error.code : 'INTERNAL_ERROR' })); throw error; }
    })();
    const operation = { promise: task, refresh }; this.active.set(season, operation);
    try { return await task; } finally { if (this.active.get(season) === operation) this.active.delete(season); }
  }
}
