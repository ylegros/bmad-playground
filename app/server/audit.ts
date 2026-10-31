import { mkdir, writeFile, rename } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { SnapshotService, candidateSeasons } from './service.ts';
import { DataError } from './jolpica.ts';
import { loadAuditedSnapshot } from './evidence-ingestion.ts';
// Explicit per-year saved-page audits never launch provider acquisition.
const season = Number(process.argv[2]);
if (!candidateSeasons.includes(season)) {
  console.error('Usage: npm run audit:data -- YEAR (2010-2026; saved pages and reviewed calendar required)');
  process.exitCode = 1;
} else {
  const directory = resolve('_bmad-output/implementation-artifacts/iteration-three/data');
  await mkdir(directory, { recursive: true });
  const filename = join(directory, `${season}.json`);
  const attemptId = randomUUID();
  async function report(value: Record<string, unknown>) {
    const temporary = `${filename}.${attemptId}.tmp`;
    await writeFile(temporary, JSON.stringify({ season, attemptId, ...value }, null, 2));
    await rename(temporary, filename);
    await writeFile(join(directory, `${season}.${attemptId}.json`), JSON.stringify({ season, attemptId, ...value }, null, 2));
  }
  const startedAt = new Date().toISOString();
  await report({ status: 'in-progress', startedAt, note: 'Saved-page audit; previous committed snapshot retained until complete validation.' });
  try {
    const snapshot = await new SnapshotService(undefined,year=>loadAuditedSnapshot(year,false,false)).get(season, true);
    await report({ status: 'verified', startedAt, finishedAt: new Date().toISOString(), snapshotId: snapshot.snapshotId,
      refreshedAt: snapshot.refreshedAt, gaps: snapshot.coverage.gaps,
      audit: snapshot.schemaVersion === 2 ? snapshot.audit : undefined });
    console.log(JSON.stringify({ season, snapshotId: snapshot.snapshotId, gaps: snapshot.coverage.gaps }));
  } catch (error) {
    const failure = { code: error instanceof DataError ? error.code : 'AUDIT_FAILURE', message: error instanceof Error ? error.message : String(error) };
    await report({ status: 'failed', startedAt, finishedAt: new Date().toISOString(), failures: [failure], note: 'No partial snapshot promoted; rerun resumes from saved source pages with original observation times.' });
    console.error(JSON.stringify({ season, ...failure })); process.exitCode = 1;
  }
}
