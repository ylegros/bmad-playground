import { mkdir, readFile, readdir, rename, rmdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export class ProviderBudgetError extends Error {
  code = 'RATE_BUDGET'; status = 503;
}
// Reservation happens durably before each attempt, including retries. An atomic
// directory lock serializes reservations across process restarts and instances.
export async function reserveProviderRequest(directory = resolve('.cache/iteration-three'), now = Date.now): Promise<void> {
  await mkdir(directory, { recursive: true });
  const lock = join(directory, 'provider-budget.lock');
  let acquired = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { await mkdir(lock); acquired = true; break; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; await pause(100); }
  }
  if (!acquired) throw new ProviderBudgetError('Provider budget lock is busy; stop other acquisition processes before retrying. A lock left by a terminated process requires operator inspection.');
  try {
    const filename = join(directory, 'provider-budget.json');
    let times: number[];
    try {
      const raw = JSON.parse(await readFile(filename, 'utf8'));
      if (raw.version !== 1 || !Array.isArray(raw.attempts) || raw.attempts.some((t: unknown) => typeof t !== 'number' || !Number.isFinite(t))) throw new ProviderBudgetError('Provider budget ledger is corrupt; refusing to reset the request budget.');
      times = raw.attempts;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      // Older acquisition had no durable attempt count. Seed a conservative full
      // budget at its latest saved observation, rather than treating it as zero.
      let latest = 0;
      try {
        for (const name of await readdir(join(directory, 'provider'))) {
          if (!name.endsWith('.json')) continue;
          const page = JSON.parse(await readFile(join(directory, 'provider', name), 'utf8'));
          const observed = Date.parse(page.observedAt);
          if (!Number.isFinite(observed)) throw new ProviderBudgetError('Legacy page observation is invalid; cannot seed provider budget.');
          latest = Math.max(latest, observed);
        }
      } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
      times = latest ? Array(450).fill(latest) : [];
    }
    times = times.filter(t => t >= now() - 3_600_000);
    if (times.length >= 450) throw new ProviderBudgetError('Hourly upstream request budget reached. Retry after the oldest reservation expires.');
    const latest = Math.max(0, ...times);
    await pause(Math.max(0, 510 - (now() - latest)));
    times.push(now());
    const temporary = `${filename}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify({ version: 1, attempts: times }));
    await rename(temporary, filename);
  } finally { await rmdir(lock); }
}
