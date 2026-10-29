import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { SeasonSnapshot } from '../shared/contracts.ts';
import { SnapshotService, validSnapshot } from './service.ts';
import { fetchCollection, DataError, buildSnapshot } from './jolpica.ts';
import { makeServer } from './index.ts';

const snapshot = (): SeasonSnapshot => ({ schemaVersion: 1, snapshotId: 'first', season: 2010, refreshedAt: '2026-10-29T01:00:00Z', coverage: { checkedRounds: [1], gaps: [] }, schedule: [{ round: 1, name: 'Test GP', date: '2010-03-14', gp: 'complete', sprint: 'not-applicable', qualifying: 'complete' }], drivers: { test: { id: 'test', name: 'Test Driver', code: 'TST', nationality: 'Test' } }, constructors: { team: { id: 'team', name: 'Test Team', nationality: 'Test' } }, results: [{ round: 1, kind: 'gp', driverId: 'test', constructorId: 'team', position: { kind: 'value', value: 1 }, classification: '1', status: 'Finished', points: { kind: 'value', value: 25 } }], qualifying: [{ round: 1, driverId: 'test', constructorId: 'team', position: { kind: 'value', value: 1 } }], driverStandings: [{ round: 1, driverId: 'test', constructorIds: ['team'], position: { kind: 'value', value: 1 }, points: { kind: 'value', value: 25 } }], constructorStandings: [{ round: 1, constructorId: 'team', position: { kind: 'value', value: 1 }, points: { kind: 'value', value: 25 } }] });
test('cache validation safely rejects malformed nested records and false complete coverage', () => {
  assert.equal(validSnapshot(snapshot(), 2010), true);
  const malformed: unknown[] = [null, { ...snapshot(), schedule: [null] }, { ...snapshot(), results: [null] }, { ...snapshot(), drivers: { test: null } }, { ...snapshot(), driverStandings: [null] }, { ...snapshot(), qualifying: [null] }, { ...snapshot(), constructorStandings: [null] }];
  for (const raw of malformed) assert.equal(validSnapshot(raw, 2010), false);
  for (const field of ['results', 'qualifying', 'driverStandings', 'constructorStandings'] as const) assert.equal(validSnapshot({ ...snapshot(), [field]: [] }, 2010), false);
  const duplicate = snapshot(); duplicate.qualifying.push(duplicate.qualifying[0]); assert.equal(validSnapshot(duplicate, 2010), false);
  const unknown = snapshot(); unknown.driverStandings[0].constructorIds = ['unknown']; assert.equal(validSnapshot(unknown, 2010), false);
  const missing = snapshot(); missing.schedule[0].gp = 'unavailable'; assert.equal(validSnapshot(missing, 2010), false);
});
test('all nested session pages are consumed, including a race split across pages', async () => {
  const offsets: number[] = [];
  const rows = await fetchCollection('2010/results', 'RaceTable', 'Races', async url => {
    const offset = Number(new URL(url).searchParams.get('offset')); offsets.push(offset);
    return { MRData: { total: '3', offset: String(offset), limit: '2', RaceTable: { season: '2010', Races: [{ season: '2010', round: '1', Results: offset === 0 ? [{ points: '0' }, { points: '12.5' }] : [{ points: '1' }] }] } } };
  });
  assert.deepEqual(offsets, [0, 2]); assert.equal(rows.length, 2);
});
test('standings pagination counts driver entries, not containing lists', async () => {
  const offsets: number[] = [];
  await fetchCollection('2010/1/driverStandings', 'StandingsTable', 'StandingsLists', async url => {
    const offset = Number(new URL(url).searchParams.get('offset')); offsets.push(offset);
    return { MRData: { total: '3', offset: String(offset), limit: '2', StandingsTable: { season: '2010', StandingsLists: [{ season: '2010', DriverStandings: offset === 0 ? [{}, {}] : [{}] }] } } };
  });
  assert.deepEqual(offsets, [0, 2]);
});
test('truncated pages reject instead of accepting incomplete data', async () => {
  await assert.rejects(fetchCollection('2010/results', 'RaceTable', 'Races', async () => ({ MRData: { total: '5', offset: '0', limit: '100', RaceTable: { season: '2010', Races: [] } } })), (error: unknown) => error instanceof DataError && error.code === 'UPSTREAM_PAGINATION');
});
test('refresh failure retains complete cached snapshot and timestamp; duplicate refreshes share work', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'pitwall-test-'));
  let calls = 0; let fail = false;
  const service = new SnapshotService(directory, async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); if (fail) throw new Error('upstream unavailable'); return snapshot(); });
  try {
    const [a, b] = await Promise.all([service.get(2010), service.get(2010)]);
    assert.equal(a.snapshotId, b.snapshotId); assert.equal(calls, 1);
    const before = await readFile(join(directory, '2010.json'), 'utf8'); fail = true;
    await assert.rejects(service.get(2010, true));
    assert.equal(await readFile(join(directory, '2010.json'), 'utf8'), before);
    assert.equal((await service.get(2010)).refreshedAt, a.refreshedAt);
    assert.equal(calls, 2);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('incomplete audit cannot replace an existing valid cache', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'pitwall-test-'));
  let incomplete = false;
  const service = new SnapshotService(directory, async () => { const s = snapshot(); if (incomplete) s.coverage.gaps.push('Missing GP'); return s; });
  try {
    await service.get(2010); incomplete = true;
    await assert.rejects(service.get(2010, true), (error: unknown) => error instanceof DataError && error.code === 'INCOMPLETE_COVERAGE');
    assert.equal((await service.cached(2010))?.snapshotId, 'first');
    assert.equal((await service.manifest()).seasons[0].verified, true);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('HTTP envelopes return audited manifest, snapshot and unsupported-year error', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'pitwall-test-'));
  const service = new SnapshotService(directory, async () => snapshot());
  const server = makeServer(service);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const first = await fetch(`${base}/api/v1/seasons/2010`);
    assert.equal(first.status, 200); assert.equal((await first.json()).data.snapshotId, 'first');
    const manifest = await (await fetch(`${base}/api/v1/seasons`)).json();
    assert.equal(manifest.data.seasons[0].verified, true);
    const invalid = await fetch(`${base}/api/v1/seasons/1999`);
    assert.equal(invalid.status, 400); assert.equal((await invalid.json()).error.code, 'UNSUPPORTED_SEASON');
  } finally { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); await rm(directory, { recursive: true, force: true }); }
});
test('explicit refresh racing a cached GET executes upstream exactly once and duplicate refreshes join', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'pitwall-test-'));
  let calls = 0;
  const service = new SnapshotService(directory, async () => ({ ...snapshot(), snapshotId: `version-${++calls}` }));
  try {
    await service.get(2010);
    const original = service.cached.bind(service);
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    service.cached = async year => { await gate; return original(year); };
    const get = service.get(2010);
    const refreshA = service.get(2010, true); const refreshB = service.get(2010, true);
    release();
    assert.equal((await get).snapshotId, 'version-1');
    assert.equal((await refreshA).snapshotId, 'version-2'); assert.equal((await refreshB).snapshotId, 'version-2'); assert.equal(calls, 2);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('cache checksum detects lost records even when surviving records satisfy structural validation', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'pitwall-test-'));
  const service = new SnapshotService(directory, async () => snapshot());
  try {
    await service.get(2010);
    const file = join(directory, '2010.json'); const envelope = JSON.parse(await readFile(file, 'utf8'));
    assert.ok(envelope.checksum); envelope.snapshot.results[0].points.value = 100;
    await writeFile(file, JSON.stringify(envelope)); assert.equal(await service.cached(2010), undefined);
    await writeFile(file, JSON.stringify(snapshot())); assert.equal(await service.cached(2010), undefined);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('strict calendar dates and UTC timestamps reject rollover or ambiguous formats', () => {
  for (const date of ['2010-02-30', '03/14/2010', '2010-3-14']) { const s = snapshot(); s.schedule[0].date = date; assert.equal(validSnapshot(s, 2010), false); }
  for (const timestamp of ['2026-10-29', '2026-10-29T01:00:00+00:00', '2026-02-30T01:00:00Z']) { const s = snapshot(); s.refreshedAt = timestamp; assert.equal(validSnapshot(s, 2010), false); }
});

// Deterministic provider-shaped fixture: one classified participant in every historical round.
function providerFixture(season = 2010, options: { wrongSeason?: boolean; shortCalendar?: boolean; missingSprint?: boolean; badPoints?: boolean; badStatus?: boolean } = {}) {
  const Driver = { driverId: 'test', givenName: 'Test', familyName: 'Driver' };
  const Constructor = { constructorId: 'team', name: 'Test Team' };
  const rounds = season === 2010 ? 19 : 22;
  const schedule = Array.from({ length: rounds - (options.shortCalendar ? 1 : 0) }, (_, i) => ({ season: String(season), round: String(i + 1), raceName: `Race ${i + 1}`, date: `${season}-01-01` }));
  return async (url: string) => {
    const parsed = new URL(url); const parts = parsed.pathname.replace('/ergast/f1/', '').replace('.json', '').split('/');
    const endpoint = parts.at(-1); const offset = Number(parsed.searchParams.get('offset'));
    let table = 'RaceTable'; let field = 'Races'; let records: Record<string, any>[];
    if (endpoint === String(season)) records = schedule;
    else if (endpoint === 'results' || endpoint === 'qualifying' || endpoint === 'sprint') {
      const key = endpoint === 'results' ? 'Results' : endpoint === 'sprint' ? 'SprintResults' : 'QualifyingResults';
      const selected = endpoint === 'sprint' ? schedule.filter(r => season === 2021 && [10,14,19].includes(Number(r.round)) && !(options.missingSprint && r.round === '10')) : schedule;
      records = selected.map(r => ({ ...r, [key]: [{ Driver, Constructor, position: '1', positionText: 'R', status: options.badStatus ? null : 'Retired', points: options.badPoints ? 'not-a-number' : r.round === '1' ? '0' : '12.5' }] }));
    } else {
      table = 'StandingsTable'; field = 'StandingsLists';
      const key = endpoint === 'driverStandings' ? 'DriverStandings' : 'ConstructorStandings';
      records = [{ season: String(season), round: parts[1], [key]: [{ Driver, Constructor, Constructors: [Constructor], position: '1', points: '99.5' }] }];
    }
    return { MRData: { total: String(records.length), limit: '2', offset: String(offset), [table]: { season: options.wrongSeason ? '1999' : String(season), [field]: records.slice(offset, offset + 2) } } };
  };
}
test('actual adapter normalizes paginated provider fixture without replacing official totals', async () => {
  const s = await buildSnapshot(2010, providerFixture());
  assert.equal(validSnapshot(s, 2010), true); assert.equal(s.results.length, 19);
  assert.deepEqual(s.results[0].points, { kind: 'value', value: 0 }); assert.deepEqual(s.results[1].points, { kind: 'value', value: 12.5 });
  assert.equal(s.results[0].classification, 'R'); assert.equal(s.results[0].status, 'Retired');
  assert.deepEqual(s.driverStandings[0].points, { kind: 'value', value: 99.5 });
  assert.equal(s.schedule[0].sprint, 'not-applicable');
});
test('historical sprint calendar remains authoritative without optional schedule metadata', async () => {
  const s = await buildSnapshot(2021, providerFixture(2021, { missingSprint: true }));
  assert.equal(s.schedule[9].sprint, 'unavailable'); assert.ok(s.coverage.gaps.includes('Round 10: sprint unavailable'));
});
test('adapter rejects wrong season, wrong calendar, malformed numbers and invalid status', async () => {
  for (const options of [{ wrongSeason: true }, { shortCalendar: true }, { badPoints: true }, { badStatus: true }]) {
    await assert.rejects(buildSnapshot(2010, providerFixture(2010, options)), (error: unknown) => error instanceof DataError);
  }
});
