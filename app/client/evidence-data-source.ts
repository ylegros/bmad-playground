import type { SeasonSnapshotV2, SupportManifest, BundledManifestV2 } from '../shared/contracts.ts';
import { validSnapshotV2, validSupportManifestV2, validBundledManifestV2, validBundledSnapshotV2, supportEntryV2, candidateSeasons } from '../shared/evidence.ts';
import { validVersionedSupportManifest } from '../shared/versioned.ts';
/** Explicit v2 seam: never falls back to v1 or switches bundled requests to API. */
export function createEvidenceDataSource(mode: 'local'|'bundled', base = '/', fetcher: typeof fetch = fetch) {
  if (!['local','bundled'].includes(mode) || !base.startsWith('/') || base.startsWith('//') || base.includes('..') || /[?#\\]/.test(base)) throw new Error('Invalid evidence data source configuration');
  const asset = (p: string) => `${base.endsWith('/') ? base : `${base}/`}${p}`;
  let bundle: BundledManifestV2 | undefined;
  const entries = new Map<number, ReturnType<typeof supportEntryV2>>();
  async function json(path: string, method = 'GET') { const response = await fetcher(path,{method,cache:'no-store'}); if (!response.ok) throw new Error('Could not load v2 evidence'); return response.json() as Promise<unknown>; }
  async function loadManifest(): Promise<SupportManifest> {
    const raw = await json(mode === 'local' ? '/api/v1/seasons' : asset('bundled/manifest.json'));
    if (mode === 'bundled') { if (!validBundledManifestV2(raw)) throw new Error('Invalid v2 bundle'); bundle = raw; return {seasons:raw.seasons}; }
    const manifest = (raw as {data?:unknown})?.data;
    if (!validVersionedSupportManifest(manifest)) throw new Error('Invalid versioned support manifest');
    return {...manifest,seasons:manifest.seasons.map(e => entries.get(e.season) ?? e)};
  }
  async function season(year: number, refresh = false): Promise<SeasonSnapshotV2> {
    if (!candidateSeasons.includes(year)) throw new Error('Invalid candidate season');
    if (mode === 'bundled') {
      if (refresh) throw new Error('Bundled evidence cannot refresh');
      if (!bundle) await loadManifest();
      const entry = bundle!.seasons.find(e => e.season === year); if (!entry) throw new Error('Season absent from immutable bundle');
      const raw = await json(asset(entry.assetPath)); if (!validBundledSnapshotV2(raw,entry)) throw new Error('V2 bundle generation mismatch'); return raw;
    }
    const envelope = await json(`/api/v1/seasons/${year}${refresh ? '/refresh' : ''}`,refresh ? 'POST':'GET') as {data?:unknown};
    if (!validSnapshotV2(envelope?.data,year)) throw new Error('Invalid v2 season evidence');
    entries.set(year,supportEntryV2(envelope.data)); return envelope.data;
  }
  return mode === 'local' ? {mode,loadManifest,loadSeason:(year:number) => season(year),refreshSeason:(year:number) => season(year,true)} : {mode,loadManifest,loadSeason:(year:number) => season(year)};
}
