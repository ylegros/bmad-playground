import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fetchCollection } from '../app/server/jolpica.ts';
import { providerCache } from '../app/server/provider-cache.ts';

const years = process.argv.slice(2).map(Number);
if (!years.length || years.some(year => !Number.isInteger(year) || year < 2010 || year > 2026)) throw new Error('Pass individual candidate years 2010-2026.');
const cache = providerCache();
await mkdir('.cache/iteration-three/acquisition', { recursive: true });
for (const year of years) {
  const report = { year, status: 'acquiring', startedAt: new Date().toISOString(), endpoints: [], failures: [] };
  try {
    for (const endpoint of ['', '/results', '/qualifying', '/sprint']) {
      const rows = await fetchCollection(`${year}${endpoint}`, 'RaceTable', 'Races', cache.fetchPage);
      report.endpoints.push({ endpoint: `${year}${endpoint}`, containers: rows.length });
      console.log(JSON.stringify({ year, endpoint, status: 'saved', pages: cache.observations.size }));
    }
    report.status = 'raw-saved-not-verified';
  } catch (error) {
    report.status = 'failed'; report.failures.push(String(error));
    console.error(JSON.stringify({ year, status: 'failed', error: String(error) }));
  }
  report.finishedAt = new Date().toISOString();
  await writeFile(resolve(`.cache/iteration-three/acquisition/${year}.json`), JSON.stringify(report, null, 2));
  if (report.failures.length) break;
}
