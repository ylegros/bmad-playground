import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { utcTimestamp } from '../shared/validation.ts';
import { queuedFetch } from './jolpica.ts';

export interface ProviderPage { sourceUrl: string; observedAt: string; payload: Record<string, any> }
const pendingPages = new Map<string, Promise<ProviderPage>>();
// Raw provider envelopes stay outside public exports. A saved page keeps its real
// observation time; resuming acquisition never relabels it as freshly fetched.
export function providerCache(directory = resolve('.cache/iteration-three/provider'), allowNetwork = true, refresh = false) {
  const observations = new Map<string, ProviderPage>();
  async function fetchPage(url: string): Promise<Record<string, any>> {
    const operationKey = `${resolve(directory)}|${allowNetwork}|${refresh}|${url}`;
    let task = pendingPages.get(operationKey);
    if (!task) {
      task = loadPage(url);
      pendingPages.set(operationKey, task);
    }
    try { const page = await task; observations.set(url, page); return page.payload; }
    finally { if (pendingPages.get(operationKey) === task) pendingPages.delete(operationKey); }
  }
  async function loadPage(url: string): Promise<ProviderPage> {
    const key = createHash('sha256').update(url).digest('hex');
    const filename = join(directory, `${key}.json`);
    let page: ProviderPage | undefined;
    if (!refresh) try {
      const raw = JSON.parse(await readFile(filename, 'utf8'));
      if (raw.sourceUrl === url && utcTimestamp(raw.observedAt) && raw.payload?.MRData) page = raw;
    } catch { /* A missing/corrupt raw page is acquired again through the queue. */ }
    if (!page) {
      if (!allowNetwork) throw new Error(`Saved provider page missing or corrupt: ${url}`);
      const payload = await queuedFetch(url);
      page = { sourceUrl: url, observedAt: new Date().toISOString(), payload };
      await mkdir(directory, { recursive: true });
      const temporary = `${filename}.${randomUUID()}.tmp`;
      await writeFile(temporary, JSON.stringify(page));
      await rename(temporary, filename);
    }
    return page;
  }
  return { fetchPage, observations };
}
