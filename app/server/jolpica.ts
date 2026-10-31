import { randomUUID } from 'node:crypto';
import { value, unavailable } from '../shared/contracts.ts';
import type { SeasonSnapshot, Metric, RaceRound } from '../shared/contracts.ts';
import { reserveProviderRequest, ProviderBudgetError } from './provider-budget.ts';

export class DataError extends Error { code: string; status: number; constructor(code: string, message: string, status = 502) { super(message); this.code = code; this.status = status; } }
type Row = Record<string, any>;
let queue: Promise<unknown> = Promise.resolve();
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function queuedFetch(url: string): Promise<Row> {
  const task = queue.then(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try { await reserveProviderRequest(); }
      catch (error) { if (error instanceof ProviderBudgetError) throw new DataError(error.code, error.message, error.status); throw error; }
      let response: Response;
      try { response = await fetch(url, { headers: { 'User-Agent': 'PitWall/0.1 personal-dashboard' }, signal: AbortSignal.timeout(25_000) }); }
      catch (error) { if (attempt < 2) { await sleep(1000 * (attempt + 1)); continue; } throw new DataError('UPSTREAM_NETWORK', `Could not reach Jolpica: ${String(error)}`); }
      if (response.ok) { try { return await response.json() as Row; } catch { throw new DataError('UPSTREAM_FORMAT', 'Jolpica returned invalid JSON.'); } }
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        const header = response.headers.get('retry-after');
        const delay = header ? (/^\d+$/.test(header) ? Number(header) * 1000 : Date.parse(header) - Date.now()) : 1500 * (attempt + 1);
        if (delay > 60_000) throw new DataError('UPSTREAM_RATE_LIMIT', 'Jolpica requested a long retry delay. Please retry later.', 503);
        await sleep(Math.max(1000, delay || 1000)); continue;
      }
      throw new DataError('UPSTREAM_HTTP', `Jolpica request failed (${response.status}).`);
    }
    throw new DataError('UPSTREAM_HTTP', 'Jolpica retries exhausted.');
  });
  queue = task.catch(() => undefined); return task;
}

export async function fetchCollection(path: string, table: string, field: string, fetcher = queuedFetch): Promise<Row[]> {
  const rows: Row[] = []; let offset = 0; let expected: number | undefined;
  for (;;) {
    const payload = await fetcher(`https://api.jolpi.ca/ergast/f1/${path}.json?limit=100&offset=${offset}`);
    const mr = payload?.MRData;
    if (!mr || !/^\d+$/.test(String(mr.total)) || !/^\d+$/.test(String(mr.offset)) || !Array.isArray(mr[table]?.[field])) throw new DataError('UPSTREAM_FORMAT', `Malformed ${path} page.`);
    const total = Number(mr.total); const limit = Number(mr.limit);
    if (Number(mr.offset) !== offset || !Number.isInteger(limit) || limit <= 0 || (expected !== undefined && total !== expected)) throw new DataError('UPSTREAM_PAGINATION', `Inconsistent pagination for ${path}.`);
    expected = total;
    const page: Row[] = mr[table][field];
    const expectedSeason = path.split('/')[0];
    if (String(mr[table].season) !== expectedSeason) throw new DataError('UPSTREAM_SEASON', `Wrong season in ${path} table.`);
    const nestedKey = table === 'StandingsTable' ? (path.endsWith('driverStandings') ? 'DriverStandings' : 'ConstructorStandings') : path.endsWith('/results') ? 'Results' : path.endsWith('/qualifying') ? 'QualifyingResults' : path.endsWith('/sprint') ? 'SprintResults' : undefined;
    if (page.some(row => !row || typeof row !== 'object' || String(row.season) !== expectedSeason || (nestedKey && (!Array.isArray(row[nestedKey]) || row[nestedKey].some((entry: unknown) => !entry || typeof entry !== 'object'))))) throw new DataError('UPSTREAM_FORMAT', `Malformed or wrong-season ${path} records.`);
    // RaceTable pages count nested session records rather than race objects.
    const count = table === 'RaceTable' && /\/(results|qualifying|sprint)$/.test(path)
      ? page.reduce((n, race) => n + (race.Results ?? race.QualifyingResults ?? race.SprintResults ?? []).length, 0)
      : table === 'StandingsTable' ? page.reduce((n, list) => n + (list.DriverStandings ?? list.ConstructorStandings ?? []).length, 0) : page.length;
    if (count === 0 && offset < total) throw new DataError('UPSTREAM_PAGINATION', `Truncated ${path} response.`);
    rows.push(...page); offset += count;
    if (offset >= total) { if (offset !== total) throw new DataError('UPSTREAM_PAGINATION', `Count mismatch for ${path}.`); return rows; }
  }
}
const metric = (raw: unknown): Metric => {
  if (raw === undefined || raw === null) return unavailable();
  if ((typeof raw !== 'string' && typeof raw !== 'number') || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(String(raw)) || !Number.isFinite(Number(raw))) throw new DataError('UPSTREAM_FORMAT', 'Malformed numeric metric.');
  return value(Number(raw));
};
export async function buildSnapshot(season: number, fetcher = queuedFetch, auditedCalendar?: { rounds: number; sprints: number[]; heldRounds?: number[] }): Promise<SeasonSnapshot> {
  const collect = (path: string, table: string, field: string) => fetchCollection(path, table, field, fetcher);
  const snapshot: SeasonSnapshot = { schemaVersion: 1, snapshotId: randomUUID(), season, refreshedAt: '', coverage: { checkedRounds: [], gaps: [] }, schedule: [], drivers: {}, constructors: {}, results: [], qualifying: [], driverStandings: [], constructorStandings: [] };
  const addDriver = (d: Row) => { if (!d || typeof d.driverId !== 'string' || !d.driverId || typeof d.givenName !== 'string' || !d.givenName || typeof d.familyName !== 'string' || !d.familyName) throw new DataError('UPSTREAM_FORMAT', 'Invalid driver identity.'); snapshot.drivers[d.driverId] = { id: d.driverId, name: `${d.givenName} ${d.familyName}`, code: d.code ?? '', nationality: d.nationality ?? '' }; };
  const addConstructor = (c: Row) => { if (!c || typeof c.constructorId !== 'string' || !c.constructorId || typeof c.name !== 'string' || !c.name) throw new DataError('UPSTREAM_FORMAT', 'Invalid constructor identity.'); snapshot.constructors[c.constructorId] = { id: c.constructorId, name: c.name, nationality: c.nationality ?? '' }; };
  const schedule = await collect(`${season}`, 'RaceTable', 'Races');
  if (!schedule.length) throw new DataError('NO_SCHEDULE', 'No schedule returned for this season.');
  const calendars: Record<number, { rounds: number; sprints: number[] }> = { 2010: { rounds: 19, sprints: [] }, 2021: { rounds: 22, sprints: [10,14,19] } };
  const calendar = auditedCalendar ?? calendars[season];
  if (!calendar || schedule.length !== calendar.rounds || new Set(schedule.map(r => Number(r.round))).size !== calendar.rounds || schedule.some(r => !/^\d+$/.test(String(r.round)) || Number(r.round) < 1 || Number(r.round) > calendar.rounds || typeof r.raceName !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.date) || !Number.isFinite(Date.parse(r.date)) || new Date(r.date).toISOString().slice(0,10) !== r.date)) throw new DataError('UPSTREAM_CALENDAR', 'Historical season schedule does not match the verified calendar.');
  snapshot.schedule = schedule.map((r): RaceRound => ({ round: Number(r.round), name: r.raceName, date: r.date, gp: 'unavailable', sprint: calendar.sprints.includes(Number(r.round)) ? 'unavailable' : 'not-applicable', qualifying: 'unavailable' })).sort((a,b) => a.round-b.round);
  for (const [endpoint, key, kind] of [['results', 'Results', 'gp'], ['sprint', 'SprintResults', 'sprint'], ['qualifying', 'QualifyingResults', 'qualifying']] as const) {
    const races = await collect(`${season}/${endpoint}`, 'RaceTable', 'Races');
    for (const race of races) {
      const round = snapshot.schedule.find(r => r.round === Number(race.round));
      if (!round || !Array.isArray(race[key])) throw new DataError('UPSTREAM_FORMAT', `Invalid ${endpoint} race.`);
      if (kind === 'sprint' && !calendar.sprints.includes(round.round)) throw new DataError('UPSTREAM_CALENDAR', 'Unexpected sprint round.');
      if (race[key].length) round[kind] = 'complete';
      for (const entry of race[key]) {
        addDriver(entry.Driver); addConstructor(entry.Constructor);
        if (kind === 'qualifying') snapshot.qualifying.push({ round: round.round, driverId: entry.Driver.driverId, constructorId: entry.Constructor.constructorId, position: metric(entry.position) });
        else {
          if (typeof entry.status !== 'string' || !entry.status.trim() || typeof entry.positionText !== 'string' || !entry.positionText.trim()) throw new DataError('UPSTREAM_FORMAT', 'Missing or malformed result classification/status.');
          snapshot.results.push({ round: round.round, kind, driverId: entry.Driver.driverId, constructorId: entry.Constructor.constructorId, position: metric(entry.position), classification: entry.positionText, status: entry.status, points: metric(entry.points) });
        }
      }
    }
  }
  for (const round of snapshot.schedule) {
    if (auditedCalendar?.heldRounds && !auditedCalendar.heldRounds.includes(round.round)) {
      snapshot.coverage.checkedRounds.push(round.round);
      continue;
    }
    for (const [endpoint, key] of [['driverStandings', 'DriverStandings'], ['constructorStandings', 'ConstructorStandings']] as const) {
      const lists = await collect(`${season}/${round.round}/${endpoint}`, 'StandingsTable', 'StandingsLists');
      // Standings pagination totals count entries, not containing StandingsLists.
      for (const list of lists) for (const row of list[key] ?? []) {
        if (Number(list.round) !== round.round) throw new DataError('UPSTREAM_FORMAT', 'Official standings round mismatch.');
        if (endpoint === 'driverStandings') { if (!Array.isArray(row.Constructors)) throw new DataError('UPSTREAM_FORMAT', 'Malformed standings affiliations.'); addDriver(row.Driver); row.Constructors.forEach(addConstructor); snapshot.driverStandings.push({ round: round.round, driverId: row.Driver.driverId, constructorIds: row.Constructors.map((c: Row) => c.constructorId), position: metric(row.position), points: metric(row.points) }); }
        else { addConstructor(row.Constructor); snapshot.constructorStandings.push({ round: round.round, constructorId: row.Constructor.constructorId, position: metric(row.position), points: metric(row.points) }); }
      }
    }
    if (round.gp !== 'complete') snapshot.coverage.gaps.push(`Round ${round.round}: GP results unavailable`);
    if (round.qualifying !== 'complete') snapshot.coverage.gaps.push(`Round ${round.round}: qualifying unavailable`);
    if (round.sprint === 'unavailable') snapshot.coverage.gaps.push(`Round ${round.round}: sprint unavailable`);
    if (!snapshot.driverStandings.some(s => s.round === round.round) || !snapshot.constructorStandings.some(s => s.round === round.round)) snapshot.coverage.gaps.push(`Round ${round.round}: official standings unavailable`);
    snapshot.coverage.checkedRounds.push(round.round);
  }
  snapshot.refreshedAt = new Date().toISOString(); return snapshot;
}
