import { unavailable, value, type Metric, type SeasonSnapshot, type SessionResult } from './contracts.ts';

export const displayMetric = (metric?: Metric): string => metric?.kind === 'value' ? String(metric.value) : 'Unavailable';
export function finalStandings<T extends { round: number }>(rows: T[]): T[] {
  const last = Math.max(0, ...rows.map(row => row.round));
  return rows.filter(row => row.round === last);
}
export function teammate(snapshot: SeasonSnapshot, driverId: string, boundary: 'first' | 'latest'): string | undefined {
  const shared = snapshot.results.flatMap(entry => entry.driverId !== driverId ? [] : snapshot.results
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
  return [...snapshot.schedule].sort((a,b) => a.round-b.round).map(round => {
    const entries = snapshot.results.filter(entry => entry.round === round.round && (category === 'drivers' ? entry.driverId === id : entry.constructorId === id));
    const gp = entries.filter(entry => entry.kind === 'gp');
    const sprint = entries.filter(entry => entry.kind === 'sprint');
    const gpPoints = round.gp === 'complete' ? sum(gp) : unavailable();
    const sprintPoints = round.sprint === 'complete' ? sum(sprint) : unavailable();
    const points = gpPoints.kind === 'value' && (round.sprint === 'not-applicable' || sprintPoints.kind === 'value')
      ? value(gpPoints.value + (sprintPoints.kind === 'value' ? sprintPoints.value : 0)) : unavailable();
    const official = category === 'drivers' ? snapshot.driverStandings.find(entry => entry.round === round.round && entry.driverId === id) : snapshot.constructorStandings.find(entry => entry.round === round.round && entry.constructorId === id);
    const previous = round.round === 1 ? value(0) : category === 'drivers' ? snapshot.driverStandings.find(entry => entry.round === round.round-1 && entry.driverId === id)?.points : snapshot.constructorStandings.find(entry => entry.round === round.round-1 && entry.constructorId === id)?.points;
    const adjustment = official?.points.kind === 'value' && previous?.kind === 'value' && points.kind === 'value' ? value(official.points.value - previous.value - points.value) : unavailable();
    return { ...round, qualifyingPosition: snapshot.qualifying.find(entry => entry.round === round.round && entry.driverId === id)?.position,
      gpResult: gp[0], sprintResult: sprint[0], gpPoints, sprintPoints, points, cumulative: official?.points, rank: official?.position, adjustment };
  });
}
export function resultText(result?: SessionResult): string {
  if (!result) return 'Unavailable';
  const classified = result.classification || displayMetric(result.position);
  return result.status === 'Finished' ? classified : `${classified} · ${result.status}`;
}
