export type Metric = { kind: 'value'; value: number } | { kind: 'unavailable'; reason: string };
export type Availability = 'complete' | 'unavailable' | 'not-applicable';
export interface Driver { id: string; name: string; code: string; nationality: string }
export interface Constructor { id: string; name: string; nationality: string }
export interface RaceRound { round: number; name: string; date: string; gp: Availability; sprint: Availability; qualifying: Availability }
export interface SessionResult { round: number; kind: 'gp' | 'sprint'; driverId: string; constructorId: string; position: Metric; classification: string; status: string; points: Metric }
export interface QualifyingResult { round: number; driverId: string; constructorId: string; position: Metric }
export interface DriverStanding { round: number; driverId: string; constructorIds: string[]; position: Metric; points: Metric }
export interface ConstructorStanding { round: number; constructorId: string; position: Metric; points: Metric }
export interface SeasonSnapshot {
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
