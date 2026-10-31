import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { reserveProviderRequest } from './provider-budget.ts';
import { providerCache } from './provider-cache.ts';
import { queuedFetch, DataError } from './jolpica.ts';

test('queuedFetch reserves each real retry and rejects a full durable budget before fetch', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'provider-queue-'));
  const originalCwd = process.cwd();
  const originalFetch = globalThis.fetch;
  let attempts = 0;
  try {
    process.chdir(directory);
    globalThis.fetch = async () => {
      attempts++;
      return attempts === 1
        ? new Response('temporarily unavailable', { status: 503, headers: { 'retry-after': '0' } })
        : Response.json({ MRData: { total: '0' } });
    };
    assert.deepEqual(await queuedFetch('https://provider.example/retry'), { MRData: { total: '0' } });
    const ledger = join(directory, '.cache', 'iteration-three', 'provider-budget.json');
    const reserved = JSON.parse(await readFile(ledger, 'utf8')).attempts;
    assert.equal(attempts, 2);
    assert.equal(reserved.length, 2);
    assert.ok(reserved.every((timestamp: unknown) => typeof timestamp === 'number' && Number.isFinite(timestamp)));

    await writeFile(ledger, JSON.stringify({ version: 1, attempts: Array(450).fill(Date.now()) }));
    await assert.rejects(queuedFetch('https://provider.example/blocked'),
      (error: unknown) => error instanceof DataError && error.code === 'RATE_BUDGET');
    assert.equal(attempts, 2, 'a full durable budget must reject before invoking fetch');
    assert.equal(JSON.parse(await readFile(ledger, 'utf8')).attempts.length, 450);
  } finally {
    globalThis.fetch = originalFetch;
    process.chdir(originalCwd);
    await rm(directory, { recursive: true, force: true });
  }
});

test('durable reservations survive separate calls; expiry does not reset current-hour budget', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'provider-budget-'));
  try {
    const current = Date.now();
    await writeFile(join(directory, 'provider-budget.json'), JSON.stringify({version:1,attempts:Array(449).fill(current - 1000)}));
    await reserveProviderRequest(directory, () => current);
    assert.equal(JSON.parse(await readFile(join(directory,'provider-budget.json'),'utf8')).attempts.length,450);
    await assert.rejects(reserveProviderRequest(directory, () => current), /Hourly upstream/);
    await reserveProviderRequest(directory, () => current + 3_600_001);
    assert.equal(JSON.parse(await readFile(join(directory,'provider-budget.json'),'utf8')).attempts.length,1);
  } finally { await rm(directory,{recursive:true,force:true}); }
});
test('missing legacy ledger seeds conservatively; corrupt ledger never resets itself', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'provider-budget-'));
  try {
    await mkdir(join(directory,'provider'));
    await writeFile(join(directory,'provider','legacy.json'),JSON.stringify({observedAt:new Date().toISOString()}));
    await assert.rejects(reserveProviderRequest(directory), /Hourly upstream/);
    await writeFile(join(directory,'provider-budget.json'),JSON.stringify({version:1,attempts:['invalid']}));
    await assert.rejects(reserveProviderRequest(directory), /corrupt/);
  } finally { await rm(directory,{recursive:true,force:true}); }
});
test('duplicate saved-page reads coalesce across cache instances and retain original observations', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'provider-pages-'));
  try {
    const url = 'https://api.jolpi.ca/ergast/f1/2026.json?limit=100&offset=0';
    const observedAt = '2026-01-01T01:00:00Z';
    const filename = join(directory,`${createHash('sha256').update(url).digest('hex')}.json`);
    await writeFile(filename,JSON.stringify({sourceUrl:url,observedAt,payload:{MRData:{total:'0'}}}));
    const first=providerCache(directory,false),second=providerCache(directory,false);
    const [a,b]=await Promise.all([first.fetchPage(url),second.fetchPage(url)]);
    assert.equal(a,b);assert.equal(first.observations.get(url)?.observedAt,observedAt);assert.equal(second.observations.get(url)?.observedAt,observedAt);
    // Explicit refresh must not relabel a saved page as a newly fetched source.
    await assert.rejects(providerCache(directory,false,true).fetchPage(url),/missing or corrupt/);
    await writeFile(filename,JSON.stringify({sourceUrl:url,observedAt:'bad',payload:{MRData:{}}}));
    await assert.rejects(first.fetchPage(url),/missing or corrupt/);
  } finally { await rm(directory,{recursive:true,force:true}); }
});
