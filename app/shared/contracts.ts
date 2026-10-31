export type Metric = { kind: 'value'; value: number } | { kind: 'unavailable'; reason: string };
export type Availability = 'complete' | 'unavailable' | 'not-applicable';
export interface Driver { id: string; name: string; code: string; nationality: string }
export interface Constructor { id: string; name: string; nationality: string }
export interface RaceRound { round: number; name: string; date: string; gp: Availability; sprint: Availability; qualifying: Availability }
export interface SessionResult { round: number; kind: 'gp' | 'sprint'; driverId: string; constructorId: string; position: Metric; classification: string; status: string; points: Metric }
export interface QualifyingResult { round: number; driverId: string; constructorId: string; position: Metric }
export interface DriverStanding { round: number; driverId: string; constructorIds: string[]; position: Metric; points: Metric }
export interface ConstructorStanding { round: number; constructorId: string; position: Metric; points: Metric }
export interface SeasonSnapshotV1 {
  schemaVersion: 1; snapshotId: string; season: number; refreshedAt: string;
  coverage: { checkedRounds: number[]; gaps: string[] };
  schedule: RaceRound[]; drivers: Record<string, Driver>; constructors: Record<string, Constructor>;
  results: SessionResult[]; qualifying: QualifyingResult[];
  driverStandings: DriverStanding[]; constructorStandings: ConstructorStanding[];
}
export interface SupportedSeason { season: number; verified: boolean; lastCheckedRound: number; knownGaps: string[] }
export interface SupportManifest { seasons: SupportedSeason[] }
export type ApiSuccess<T> = { data: T };
export type ApiFailure = { error: { code: string; message: string; retryAfterSeconds?: number } };
export const value = (n: number): Metric => ({ kind: 'value', value: n });
export const unavailable = (reason = 'Unavailable'): Metric => ({ kind: 'unavailable', reason });

// V1 remains the approved baseline. V2 consumers must opt into these explicit types.
export type SeasonSnapshot = SeasonSnapshotV1 | SeasonSnapshotV2;
export type SessionLifecycle = 'held' | 'unheld' | 'cancelled' | 'unknown';
export interface EvidenceProvenance { sourceUrl: string; observedAt: string; note: string }
export interface SessionEvidence { lifecycle: SessionLifecycle; applicable: boolean; provenance: EvidenceProvenance[] }
export interface RaceRoundV2 extends RaceRound { sessions: { gp: SessionEvidence; qualifying: SessionEvidence; sprint: SessionEvidence } }
export interface SeasonAuditV2 {
  auditId: string; auditedAt: string; status: 'verified' | 'pending' | 'failed';
  provenance: EvidenceProvenance[];
  endpoints: { sourceUrl: string; expectedPages: number; fetchedPages: number }[];
  failures: string[];
  completion: EvidenceProvenance[];
  migration?: { fromSchemaVersion: 1; snapshotId: string; migratedAt: string };
}
export interface SeasonSnapshotV2 extends Omit<SeasonSnapshotV1, 'schemaVersion' | 'schedule'> {
  schemaVersion: 2; lifecycle: 'ongoing' | 'complete'; analysisRounds: number[];
  audit: SeasonAuditV2; schedule: RaceRoundV2[];
}
export interface SupportedSeasonV2 extends SupportedSeason {
  schemaVersion: 2; snapshotId: string; refreshedAt: string;
  lifecycle: 'ongoing' | 'complete'; analysisRounds: number[]; audit: SeasonAuditV2;
}
export interface SupportManifestV2 { schemaVersion: 2; seasons: SupportedSeasonV2[] }
export interface BundledSeasonV2 extends SupportedSeasonV2 { assetPath: string }
export interface BundledManifestV2 { bundleVersion: 2; exportedAt: string; seasons: BundledSeasonV2[] }
export type VersionedSeasonSnapshot = SeasonSnapshotV1 | SeasonSnapshotV2;
export type MediaSlotV2 = { kind: 'portrait' | 'constructor'; identity: string; season: number } & (
  { status: 'mapped'; filename: string; sourceUrl: string; creator: string; license: string; licenseUrl: string;
    attribution: string; applicableSeasons: number[]; photographDate: string; cropNotes: string; visualCheck: string }
  | { status: 'exception'; attemptedSources: string[]; blocker: string; visualCheck: string });

export interface BundledSeason extends SupportedSeason { snapshotId: string; schemaVersion: 1; refreshedAt: string; assetPath: string }
export interface BundledManifest { bundleVersion: 1; exportedAt: string; seasons: BundledSeason[] }
interface DataReader { loadManifest(): Promise<SupportManifest>; loadSeason(year: number): Promise<SeasonSnapshot>; mediaPath(filename: string): string }
export type DataSource = (DataReader & { mode: 'local'; refreshSeason(year: number): Promise<SeasonSnapshot> }) | (DataReader & { mode: 'bundled' });
