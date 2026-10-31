import { describe, it, expect } from 'vitest';
import { createDataSource } from './data-source';
import { seasonFixture } from '../../tests/fixtures';
import type { BundledManifest } from '../shared/contracts';

const bundle = (): BundledManifest => ({ bundleVersion: 1, exportedAt: '2026-10-29T01:00:00Z', seasons: [2010,2021].map(season => ({season, verified: true, lastCheckedRound: 2, knownGaps: [], snapshotId: `fixture-${season}`, schemaVersion: 1, refreshedAt: seasonFixture(season).refreshedAt, assetPath: `bundled/releases/test/${season}.json`})) });
describe('data adapters', () => {
  it('bundled mode resolves direct domain JSON beneath build base and exposes no refresh', async () => {
    const paths: string[] = [];
    const fetcher = async (path: string | URL | Request) => { paths.push(String(path)); return Response.json(String(path).endsWith('manifest.json') ? bundle() : seasonFixture(2021)); };
    const source = createDataSource('bundled', '/pit-wall/', fetcher);
    expect(source).not.toHaveProperty('refreshSeason');
    expect((await source.loadManifest()).seasons).toHaveLength(2);
    expect(source.mediaPath('credits.json')).toBe('/pit-wall/bundled/releases/test/media/credits.json');
    expect(source.mediaPath('portrait.jpg')).toBe('/pit-wall/bundled/releases/test/media/portrait.jpg');
    expect(()=>source.mediaPath('../credentials')).toThrow();
    expect((await source.loadSeason(2021)).season).toBe(2021);
    expect(paths).toEqual(['/pit-wall/bundled/manifest.json', '/pit-wall/bundled/releases/test/2021.json']);
  });
  it('rejects payload season, snapshot, timestamp, schema and coverage mismatches', async () => {
    for (const patch of [{season:2010}, {snapshotId:'other'}, {refreshedAt:'2026-10-27T12:00:00Z'}, {schemaVersion:2}, {coverage:{checkedRounds:[1,2],gaps:['missing']}}]) {
      const source = createDataSource('bundled', '/', async path => Response.json(String(path).endsWith('manifest.json') ? bundle() : {...seasonFixture(), ...patch}));
      await expect(source.loadSeason(2021)).rejects.toThrow('does not match');
    }
  });
  it('rejects unsafe or mixed-release manifests and API envelopes', async () => {
    const cases: unknown[] = [{data:bundle()}, {...bundle(), bundleVersion:2}];
    for (const path of ['https://example.com/data.json','../other.json','bundled/releases/other/2010.json']) { const bad = bundle(); bad.seasons[0].assetPath = path; cases.push(bad); }
    for (const bad of cases) await expect(createDataSource('bundled', '/', async () => Response.json(bad)).loadManifest()).rejects.toThrow('manifest is invalid');
  });
  it('can retry failed bundled reads without ever requesting an API', async () => {
    const paths: string[] = []; let fail = true;
    const source = createDataSource('bundled','/',async path => { paths.push(String(path)); if (fail) return Response.json({}, {status:503}); return Response.json(String(path).endsWith('manifest.json') ? bundle() : seasonFixture()); });
    await expect(source.loadSeason(2021)).rejects.toThrow(); fail = false;
    expect((await source.loadSeason(2021)).season).toBe(2021);
    expect(paths.every(path=>path.startsWith('/bundled/'))).toBe(true);
  });
  it('local mode alone unwraps API envelopes and posts explicit refresh', async () => {
    const calls: [string, string | undefined][] = [];
    const source = createDataSource('local','/',async (path, options) => { calls.push([String(path),options?.method]); return Response.json({data:String(path).endsWith('/seasons') ? {seasons:bundle().seasons} : seasonFixture()}); });
    expect((await source.loadManifest()).seasons).toHaveLength(2);
    await source.loadSeason(2021);
    if (source.mode === 'local') await source.refreshSeason(2021);
    expect(calls).toEqual([['/api/v1/seasons','GET'],['/api/v1/seasons/2021','GET'],['/api/v1/seasons/2021/refresh','POST']]);
    await expect(source.loadSeason(2000)).rejects.toThrow('2010 through 2026');
  });
  it('rejects invalid build configuration', () => {
    expect(()=>createDataSource('auto')).toThrow('Invalid data mode');
    expect(()=>createDataSource('bundled','https://example.com/')).toThrow('build base');
  });
  it('pins a loaded immutable release when a later deployment changes the manifest',async()=>{
    let changed=false;
    const source=createDataSource('bundled','/',async path=>{
      const manifest=bundle();if(changed)for(const entry of manifest.seasons)entry.assetPath=entry.assetPath.replace('/test/','/next/');
      return Response.json(String(path).endsWith('manifest.json')?manifest:seasonFixture());
    });
    await source.loadManifest();changed=true;
    await expect(source.loadManifest()).rejects.toThrow('release changed');
    expect(source.mediaPath('credits.json')).toBe('/bundled/releases/test/media/credits.json');
    expect((await source.loadSeason(2021)).snapshotId).toBe('fixture-2021');
  });
});
