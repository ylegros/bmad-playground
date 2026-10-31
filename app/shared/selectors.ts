import { unavailable, value, type Metric, type VersionedSeasonSnapshot as SeasonSnapshot, type RaceRound, type RaceRoundV2, type SessionResult } from './contracts.ts';
import { analysisWindow } from './evidence.ts';

export function analysisSchedule(snapshot: SeasonSnapshot) {
  const rounds = snapshot.schemaVersion === 2 ? new Set(analysisWindow(snapshot)) : undefined;
  return snapshot.schedule.filter(round => !rounds || rounds.has(round.round));
}
export function sessionUnavailable(round: RaceRound | RaceRoundV2, kind: 'gp' | 'qualifying' | 'sprint'): Metric | undefined {
  if ('sessions' in round) {
    const session = round.sessions[kind];
    if (!session.applicable) return unavailable('Not applicable');
    if (session.lifecycle === 'unheld') return unavailable('Not held');
    if (session.lifecycle === 'cancelled') return unavailable('Cancelled');
    if (session.lifecycle === 'unknown') return unavailable('Unavailable: session lifecycle unknown');
  }
  return round[kind] === 'complete' ? undefined : unavailable(round[kind] === 'not-applicable' ? 'Not applicable' : 'Unavailable: authoritative session records missing');
}

export const displayMetric = (metric?: Metric): string => metric?.kind === 'value' ? String(metric.value) : 'Unavailable';
export function finalStandings<T extends { round: number }>(rows: T[], snapshot?: SeasonSnapshot): T[] {
  const allowed = snapshot ? new Set(analysisSchedule(snapshot).map(row => row.round)) : undefined;
  const candidates = allowed ? rows.filter(row => allowed.has(row.round)) : rows;
  const last = Math.max(0, ...candidates.map(row => row.round));
  return candidates.filter(row => row.round === last);
}
export function teammate(snapshot: SeasonSnapshot, driverId: string, boundary: 'first' | 'latest'): string | undefined {
  const rounds = new Set(analysisSchedule(snapshot).map(row => row.round));
  const results = snapshot.results.filter(entry => rounds.has(entry.round));
  const shared = results.flatMap(entry => entry.driverId !== driverId ? [] : results
    .filter(other => other.driverId !== driverId && other.round === entry.round && other.kind === entry.kind && other.constructorId === entry.constructorId)
    .map(other => ({ round: entry.round, kind: entry.kind, id: other.driverId })));
  shared.sort((a, b) => (boundary === 'first' ? a.round - b.round : b.round - a.round) || (a.kind === b.kind ? 0 : a.kind === 'gp' ? -1 : 1) || a.id.localeCompare(b.id));
  return shared[0]?.id;
}
function sum(entries: SessionResult[]): Metric {
  if (!entries.length || entries.some(entry => entry.points.kind !== 'value')) return unavailable();
  return value(entries.reduce((total, entry) => total + (entry.points.kind === 'value' ? entry.points.value : 0), 0));
}
export function progress(snapshot: SeasonSnapshot, category: 'drivers' | 'constructors', id: string) {
  const analyzed = analysisSchedule(snapshot).map(round => round.round).sort((a,b) => a-b);
  return [...snapshot.schedule].sort((a,b) => a.round-b.round).map(round => {
    const entries = snapshot.results.filter(entry => entry.round === round.round && (category === 'drivers' ? entry.driverId === id : entry.constructorId === id));
    const gp = entries.filter(entry => entry.kind === 'gp');
    const sprint = entries.filter(entry => entry.kind === 'sprint');
    const gpPoints = sessionUnavailable(round, 'gp') ?? sum(gp);
    const sprintPoints = sessionUnavailable(round, 'sprint') ?? sum(sprint);
    const points = gpPoints.kind === 'value' && (round.sprint === 'not-applicable' || sprintPoints.kind === 'value')
      ? value(gpPoints.value + (sprintPoints.kind === 'value' ? sprintPoints.value : 0)) : unavailable();
    const inWindow = snapshot.schemaVersion === 1 || analysisWindow(snapshot).includes(round.round);
    const official = !inWindow ? undefined : category === 'drivers' ? snapshot.driverStandings.find(entry => entry.round === round.round && entry.driverId === id) : snapshot.constructorStandings.find(entry => entry.round === round.round && entry.constructorId === id);
    const priorRound = snapshot.schemaVersion === 2 ? analyzed[analyzed.indexOf(round.round)-1] : round.round-1;
    const firstRound = snapshot.schemaVersion === 2 ? inWindow && round.round === analyzed[0] : round.round === 1;
    const previous = firstRound ? value(0) : category === 'drivers' ? snapshot.driverStandings.find(entry => entry.round === priorRound && entry.driverId === id)?.points : snapshot.constructorStandings.find(entry => entry.round === priorRound && entry.constructorId === id)?.points;
    const adjustment = official?.points.kind === 'value' && previous?.kind === 'value' && points.kind === 'value' ? value(official.points.value - previous.value - points.value) : unavailable();
    return { ...round, qualifyingPosition: ('sessions' in round ? sessionUnavailable(round, 'qualifying') : undefined) ?? snapshot.qualifying.find(entry => entry.round === round.round && entry.driverId === id)?.position,
      gpResult: gp[0], sprintResult: sprint[0], gpPoints, sprintPoints, points, cumulative: official?.points, rank: official?.position, adjustment };
  });
}
export function resultText(result?: SessionResult): string {
  if (!result) return 'Unavailable';
  const classified = result.classification || displayMetric(result.position);
  return result.status === 'Finished' ? classified : `${classified} · ${result.status}`;
}
