import type { BundledManifest, DataSource, SeasonSnapshot, SupportManifest } from '../shared/contracts';
import { validBundledManifest, validBundledSnapshot, validSnapshot, validSupportManifest, supportedSeasons, validAssetPath } from '../shared/validation';

type Fetcher = typeof fetch;
export function createDataSource(mode: string, base = '/', fetcher: Fetcher = fetch): DataSource {
  if (mode !== 'local' && mode !== 'bundled') throw new Error(`Invalid data mode: ${mode}`);
  if (!base.startsWith('/') || base.startsWith('//') || base.includes('..') || /[?#\\]/.test(base)) throw new Error('The build base must be a same-origin absolute path.');
  const asset = (path: string) => `${base.endsWith('/') ? base : `${base}/`}${path}`;
  const mediaName = (filename: string) => { if (!validAssetPath(`media/${filename}`)) throw new Error('Invalid media filename.'); return filename; };
  const checkYear = (year: number) => { if (!supportedSeasons.includes(year as 2010 | 2021)) throw new Error('Only verified 2010 and 2021 seasons are supported.'); };
  async function json(path: string, method = 'GET', bundled = false): Promise<unknown> {
    const response = await fetcher(path, { method, ...(bundled ? { cache: 'no-store' as const } : {}) });
    const raw = await response.json();
    if (!response.ok) throw new Error(bundled ? 'Could not load bundled season data.' : raw?.error?.message || 'The data service is unavailable.');
    return raw;
  }
  if (mode === 'local') {
    async function season(year: number, refresh = false): Promise<SeasonSnapshot> {
      checkYear(year);
      const envelope = await json(`/api/v1/seasons/${year}${refresh ? '/refresh' : ''}`, refresh ? 'POST' : 'GET') as { data?: unknown };
      if (!validSnapshot(envelope?.data, year)) throw new Error('The data service returned an invalid or different season. Please retry.');
      return envelope.data;
    }
    return { mode, async loadManifest(): Promise<SupportManifest> {
      const envelope = await json('/api/v1/seasons') as { data?: unknown };
      if (!validSupportManifest(envelope?.data)) throw new Error('The data service returned an invalid season list.');
      return envelope.data;
    }, loadSeason: year => season(year), refreshSeason: year => season(year, true), mediaPath: filename => asset(`media/${mediaName(filename)}`) };
  }
  let manifest: BundledManifest | undefined;
  let pending: Promise<BundledManifest> | undefined;
  async function loadManifest(): Promise<BundledManifest> {
    if (pending) return pending;
    pending = (async () => {
      const raw = await json(asset('bundled/manifest.json'), 'GET', true);
      if (!validBundledManifest(raw)) throw new Error('The bundled manifest is invalid. Retry loading bundled data.');
      manifest = raw;
      return raw;
    })();
    try { return await pending; } finally { pending = undefined; }
  }
  return { mode, loadManifest, mediaPath(filename) {
    if (!manifest) throw new Error('Load the bundled manifest before resolving media.');
    const release = manifest.seasons[0].assetPath.split('/').slice(0,-1).join('/');
    return asset(`${release}/media/${mediaName(filename)}`);
  }, async loadSeason(year): Promise<SeasonSnapshot> {
    checkYear(year);
    const current = manifest ?? await loadManifest();
    const entry = current.seasons.find(item => item.season === year)!;
    const raw = await json(asset(entry.assetPath), 'GET', true);
    if (!validBundledSnapshot(raw, entry)) throw new Error('The bundled snapshot does not match its verified manifest. Retry loading bundled data.');
    return raw;
  } };
}

export const dataSource = createDataSource(import.meta.env.VITE_DATA_MODE ?? 'local', import.meta.env.BASE_URL ?? '/');
