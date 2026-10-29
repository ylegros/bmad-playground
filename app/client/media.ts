import { dataSource } from './data-source';
﻿import credits from '../../public/media/credits.json';
export interface MediaAsset { kind: string; identity: string; seasons: number[]; filename: string; sourceUrl: string; creator: string; license: string; licenseUrl: string; attribution: string; portraitDate: string; cropNotes: string }
export interface MediaFallback { kind: string; identity: string; season: number; reason: string }
export const mediaCredits: {assets:MediaAsset[];fallbacks:MediaFallback[]} = credits;
// Credits explicitly map canonical identity + season; no modern aliases or name joins.
function mappings(kind: 'portrait' | 'constructor'): Record<number, Record<string, string>> {
  const result: Record<number, Record<string, string>> = {};
  for (const asset of mediaCredits.assets.filter(asset => asset.kind === kind)) {
    for (const season of asset.seasons) (result[season] ??= {})[asset.identity] = asset.filename;
  }
  return result;
}
export const portraitMappings = mappings('portrait');
export const constructorMappings = mappings('constructor');
export const mediaUrl = (filename: string) => dataSource.mediaPath(filename);
export function mappedMedia(kind: 'portrait' | 'constructor', identity: string, season: number): MediaAsset | undefined {
  const filename = (kind === 'portrait' ? portraitMappings : constructorMappings)[season]?.[identity];
  return filename ? mediaCredits.assets.find(asset=>asset.filename===filename&&asset.identity===identity&&asset.kind===kind&&asset.seasons.includes(season)) : undefined;
}
