import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fetchCollection } from '../app/server/jolpica.ts';
import { providerCache } from '../app/server/provider-cache.ts';

const years = process.argv.slice(2).map(Number);
if (!years.length || years.some(year => !Number.isInteger(year) || year < 2010 || year > 2026)) throw new Error('Pass selected candidate years 2010-2026.');
const cache = providerCache();
const directory = resolve('.cache/iteration-three/acquisition');
await mkdir(directory, { recursive: true });
for (const season of [...new Set(years)]) {
  const calendar = JSON.parse(await readFile(resolve(`app/fixtures/iteration-three/audited-calendars/${season}.json`), 'utf8'));
  if (calendar.season !== season || !Array.isArray(calendar.schedule) || !calendar.schedule.length || calendar.schedule.some(r => !Number.isInteger(r.round) || r.round < 1 || !r.sessions?.gp?.provenance?.length || !['held', 'unheld', 'cancelled'].includes(r.sessions.gp.lifecycle))) throw new Error(`Reviewed session evidence required for ${season}.`);
  const rounds = calendar.schedule.filter(r => r.sessions.gp.lifecycle === 'held').map(r => r.round);
  const attemptId = randomUUID();
  const report = { season, attemptId, startedAt: new Date().toISOString(), status: 'acquiring', heldRounds: rounds, endpoints: [], failures: [] };
  async function save() {
    const filename = join(directory, `${season}-standings.json`);
    const temporary = `${filename}.${attemptId}.tmp`;
    await writeFile(temporary, JSON.stringify(report, null, 2));
    await rename(temporary, filename);
    await writeFile(join(directory, `${season}-standings.${attemptId}.json`), JSON.stringify(report, null, 2));
  }
  await save();
  try {
    // Explicit round endpoints preserve official round authority. Do not query
    // future/unheld standings, infer them from a final total, or synthesize ranks.
    for (const round of rounds) for (const endpoint of ['driverStandings', 'constructorStandings']) {
      const path = `${season}/${round}/${endpoint}`;
      const lists = await fetchCollection(path, 'StandingsTable', 'StandingsLists', cache.fetchPage);
      if (lists.some(list => Number(list.round) !== round)) throw new Error(`Official standings source round mismatch: ${path}`);
      report.endpoints.push({ path, containers: lists.length });
      await save();
      console.log(JSON.stringify({ season, round, endpoint, status: 'saved', observedPages: cache.observations.size }));
    }
    report.status = 'raw-saved-not-verified';
  } catch (error) {
    report.status = 'failed'; report.failures.push({ code: error?.code ?? 'ACQUISITION_FAILURE', message: String(error) });
    process.exitCode = 1;
  }
  report.finishedAt = new Date().toISOString(); await save();
  if (report.failures.length) { console.error(JSON.stringify(report.failures)); break; }
}
