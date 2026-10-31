import type { SeasonSnapshot, SupportedSeason, SupportManifest } from './contracts.ts';
import { validSnapshot, validSupportManifest } from './validation.ts';
import { candidateSeasons, validSnapshotV2, supportEntryV2, validSupportManifestV2 } from './evidence.ts';

export function validVersionedSnapshot(raw: unknown, season: number): raw is SeasonSnapshot {
  return (raw as { schemaVersion?: unknown })?.schemaVersion === 2 ? validSnapshotV2(raw, season) : validSnapshot(raw, season);
}
export function supportForSnapshot(snapshot: SeasonSnapshot): SupportedSeason {
  if (snapshot.schemaVersion === 2) return supportEntryV2(snapshot);
  return { season: snapshot.season, verified: snapshot.coverage.gaps.length === 0,
    lastCheckedRound: Math.max(0, ...snapshot.coverage.checkedRounds), knownGaps: [...snapshot.coverage.gaps] };
}
export function validVersionedSupportManifest(raw: unknown): raw is SupportManifest {
  try {
    const manifest = raw as SupportManifest;
    return !!manifest && Array.isArray(manifest.seasons) && manifest.seasons.length > 0 && manifest.seasons.length <= 17 &&
      new Set(manifest.seasons.map(entry => entry.season)).size === manifest.seasons.length && manifest.seasons.every(entry => {
        if ('schemaVersion' in entry && entry.schemaVersion !== 1) return entry.schemaVersion === 2 && validSupportManifestV2({schemaVersion:2,seasons:[entry]});
        return candidateSeasons.includes(entry.season) && typeof entry.verified === 'boolean' && Number.isInteger(entry.lastCheckedRound) && entry.lastCheckedRound >= 0 && Array.isArray(entry.knownGaps) && entry.knownGaps.every(gap => typeof gap === 'string') &&
          (!entry.verified || validSupportManifest({seasons:[entry]}));
      });
  } catch { return false; }
}
// Prefer committed per-season metadata over any older manifest response.
export function mergeCommittedSupport(manifest: SupportManifest, snapshots: Record<number, SeasonSnapshot>): SupportManifest {
  const entries = new Map(manifest.seasons.map(entry => [entry.season, entry]));
  for (const snapshot of Object.values(snapshots)) entries.set(snapshot.season, supportForSnapshot(snapshot));
  return { seasons: [...entries.values()].sort((a,b) => a.season - b.season) };
}
