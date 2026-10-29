import { value, unavailable, type Metric, type SeasonSnapshot } from './contracts.ts';
import { finalStandings, progress } from './selectors.ts';

export type Direction = 'higher' | 'lower';
export type ComparisonOutcome = 'a' | 'b' | 'tied' | 'unavailable';
export type ComparisonMeasure = 'cumulative' | 'points' | 'qualifying' | 'gp' | 'sprint';
export const comparisonMeasures = [
  { value: 'cumulative', label: 'Championship points', direction: 'higher' },
  { value: 'points', label: 'Round points', direction: 'higher' },
  { value: 'qualifying', label: 'GP qualifying position', direction: 'lower' },
  { value: 'gp', label: 'GP race result', direction: 'lower' },
  { value: 'sprint', label: 'Sprint result', direction: 'lower' },
] as const;
export function compareValues(a: Metric | undefined, b: Metric | undefined, direction: Direction): ComparisonOutcome {
  if (a?.kind !== 'value' || b?.kind !== 'value' || !Number.isFinite(a.value) || !Number.isFinite(b.value)) return 'unavailable';
  if (a.value === b.value) return 'tied';
  return (direction === 'higher' ? a.value > b.value : a.value < b.value) ? 'a' : 'b';
}
export function roundMetric(row: ReturnType<typeof progress>[number], measure: ComparisonMeasure): Metric | undefined {
  if (measure === 'gp') return row.gp === 'complete' ? row.gpResult?.position : undefined;
  if (measure === 'sprint') return row.sprint === 'complete' ? row.sprintResult?.position : undefined;
  if (measure === 'qualifying') return row.qualifying === 'complete' ? row.qualifyingPosition : undefined;
  return row[measure];
}
// Exact, audited statuses from the verified 2010/2021 snapshots. Never infer from classification/position.
export const retirementStatuses = Object.freeze([
  'Accident', 'Brakes', 'Clutch', 'Collision', 'Collision damage', 'Damage', 'Driveshaft', 'Electrical', 'Engine',
  'Exhaust', 'Front wing', 'Fuel pressure', 'Fuel pump', 'Gearbox', 'Hydraulics', 'Mechanical', 'Oil leak',
  'Overheating', 'Power Unit', 'Power loss', 'Puncture', 'Rear wing', 'Retired', 'Spun off', 'Steering',
  'Suspension', 'Technical', 'Throttle', 'Track rod', 'Turbo', 'Vibrations', 'Wheel', 'Wheel nut',
]);
const nonRetirementStatuses = new Set(['Finished', 'Did not start', 'Did not qualify', 'Did not prequalify', 'Withdrawn', 'Illness', 'Disqualified', 'Excluded', 'DNS', 'DSQ', '+1 Lap', '+2 Laps', '+3 Laps', '+4 Laps', '+5 Laps', '+6 Laps', '+7 Laps', '+8 Laps', '+9 Laps', '+10 Laps']);
export function isRetirement(status: string): boolean | undefined {
  if (retirementStatuses.includes(status)) return true;
  return nonRetirementStatuses.has(status) ? false : undefined;
}
export interface RoundEvidence { round: number; name: string; reason?: string }
export interface SummaryCategory {
  id: string; label: string; direction: Direction; a: Metric; b: Metric; outcome: ComparisonOutcome;
  explanation: string; eligible: RoundEvidence[]; ties: RoundEvidence[]; excluded: RoundEvidence[];
  samples: { a: number; b: number; scheduled: number }; details: string[]; bar: boolean;
}
function category(input: Omit<SummaryCategory, 'outcome'>): SummaryCategory {
  return { ...input, outcome: compareValues(input.a, input.b, input.direction) };
}
export function scoreCategories(rows: Pick<SummaryCategory, 'outcome'>[]) {
  const a = rows.filter(row => row.outcome === 'a').length, b = rows.filter(row => row.outcome === 'b').length;
  const tied = rows.filter(row => row.outcome === 'tied').length, missing = rows.filter(row => row.outcome === 'unavailable').length;
  return { a, b, tied, unavailable: missing, comparable: a + b + tied, verdict: a + b + tied === 0 ? 'insufficient' as const : a === b ? 'draw' as const : a > b ? 'a' as const : 'b' as const };
}
export function comparisonSummary(snapshot: SeasonSnapshot, driverA: string, driverB: string) {
  if (driverA === driverB || !snapshot.drivers[driverA] || !snapshot.drivers[driverB]) return undefined;
  const left = progress(snapshot, 'drivers', driverA), right = progress(snapshot, 'drivers', driverB);
  const scheduled = snapshot.schedule.length;
  function headToHead(measure: 'gp' | 'qualifying', label: string): SummaryCategory {
    const eligible: RoundEvidence[] = [], ties: RoundEvidence[] = [], excluded: RoundEvidence[] = [];
    let a = 0, b = 0;
    left.forEach((row, index) => {
      const outcome = compareValues(roundMetric(row, measure), roundMetric(right[index], measure), 'lower');
      const evidence = { round: row.round, name: row.name };
      if (outcome === 'unavailable') excluded.push({ ...evidence, reason: 'Comparable authoritative positions unavailable for one or both drivers.' });
      else { eligible.push(evidence); if (outcome === 'a') a++; else if (outcome === 'b') b++; else ties.push(evidence); }
    });
    return category({ id: measure, label, direction: 'higher', a: eligible.length ? value(a) : unavailable('No eligible rounds.'), b: eligible.length ? value(b) : unavailable('No eligible rounds.'),
      eligible, ties, excluded, samples: { a: eligible.length, b: eligible.length, scheduled }, bar: true, details: [],
      explanation: `${eligible.length} eligible rounds; ${ties.length} tied; ${excluded.length} excluded. GP and sprint rankings are separate.` });
  }
  const empty = { eligible: [], ties: [], excluded: [], samples: { a: 0, b: 0, scheduled }, details: [] };
  const official = finalStandings(snapshot.driverStandings);
  const officialA = official.find(row => row.driverId === driverA), officialB = official.find(row => row.driverId === driverB);
  function seasonMetric(driver: string, kind: 'best' | 'dnf') {
    const records = [...snapshot.schedule].sort((a,b)=>a.round-b.round).map(round => ({ round, result: snapshot.results.find(row => row.kind === 'gp' && row.round === round.round && row.driverId === driver) }));
    const samples = records.filter(row => row.round.gp === 'complete' && row.result).length;
    if (!scheduled || samples !== scheduled) return { metric: unavailable(`Authoritative driver records cover ${samples} of ${scheduled} scheduled GPs; absence does not prove nonparticipation.`), samples, details: [] as string[] };
    if (kind === 'best') {
      if (records.some(row => row.result!.position.kind !== 'value')) return { metric: unavailable('Numeric GP classification is missing in the season coverage.'), samples, details: [] as string[] };
      const best = Math.min(...records.map(row => row.result!.position.kind === 'value' ? row.result!.position.value : Infinity));
      return { metric: value(best), samples, details: records.filter(row => row.result!.position.kind === 'value' && row.result!.position.value === best).map(row => `Round ${row.round.round} ${row.round.name}: ${row.result!.classification} · ${row.result!.status}`) };
    }
    const unknown = records.filter(row => isRetirement(row.result!.status) === undefined);
    if (unknown.length) return { metric: unavailable(`Unmapped source status: ${[...new Set(unknown.map(row => row.result!.status))].join(', ')}.`), samples, details: [] as string[] };
    return { metric: value(records.filter(row => isRetirement(row.result!.status) === true).length), samples,
      details: records.filter(row => isRetirement(row.result!.status) === true).map(row => `Round ${row.round.round} ${row.round.name}: ${row.result!.classification} · ${row.result!.status}`) };
  }
  function seasonCategory(kind: 'best' | 'dnf', label: string) {
    const a = seasonMetric(driverA, kind), b = seasonMetric(driverB, kind);
    return category({ ...empty, id: kind, label, direction: 'lower', a: a.metric, b: b.metric, bar: false,
      samples: { a: a.samples, b: b.samples, scheduled }, details: [...a.details.map(text => `${snapshot.drivers[driverA].name}: ${text}`), ...b.details.map(text => `${snapshot.drivers[driverB].name}: ${text}`)],
      explanation: kind === 'best' ? 'Lowest authoritative GP classification; requires records for every scheduled GP.' : 'Retirement-status allowlist; numeric classification does not override retirement. DNS, disqualification, illness and finishes are excluded. Unknown statuses make totals unavailable.' });
  }
  function bestQualifyingCategory() {
    function metric(driver: string) {
      const records = snapshot.schedule.map(round => ({ round, result: snapshot.qualifying.find(row => row.round === round.round && row.driverId === driver) }));
      const authoritative = records.filter(({ round, result }) => round.qualifying === 'complete' && result?.position.kind === 'value' && Number.isFinite(result.position.value));
      const samples = authoritative.length;
      if (!scheduled || samples !== scheduled) return { metric: unavailable(`Authoritative numeric GP qualifying records in complete qualifying sessions cover ${samples} of ${scheduled} scheduled GPs; incomplete sessions or missing driver qualifying records prevent a season best.`), samples, details: [] as string[] };
      const best = Math.min(...authoritative.map(({ result }) => result!.position.kind === 'value' ? result!.position.value : Infinity));
      return { metric: value(best), samples, details: authoritative.filter(({ result }) => result!.position.kind === 'value' && result!.position.value === best).map(({ round }) => `${snapshot.drivers[driver].name}: Round ${round.round} ${round.name}: GP qualifying rank ${best}`) };
    }
    const a = metric(driverA), b = metric(driverB);
    return category({ ...empty, id: 'best-qualifying', label: 'Best GP qualifying rank', direction: 'lower', a: a.metric, b: b.metric, bar: false,
      samples: { a: a.samples, b: b.samples, scheduled }, details: [...a.details, ...b.details],
      explanation: 'Lowest authoritative GP qualifying position before starting-grid penalties; requires a numeric driver record in a complete qualifying session for every scheduled GP. Sprint ranking is separate.' });
  }
  const rows = [headToHead('gp', 'GP race head-to-head'), headToHead('qualifying', 'GP qualifying head-to-head'),
    category({ ...empty, id: 'championship', label: 'Official championship points', direction: 'higher', a: officialA?.points ?? unavailable('No final official standing.'), b: officialB?.points ?? unavailable('No final official standing.'), bar: true,
      samples: { a: officialA ? 1 : 0, b: officialB ? 1 : 0, scheduled }, explanation: `Official standings at round ${Math.max(0,...official.map(row=>row.round))}; includes sprint points and official adjustments. Championship position never breaks a tie.` }),
    seasonCategory('best', 'Best GP finish'), bestQualifyingCategory(), seasonCategory('dnf', 'GP DNFs')];
  return { rows, ...scoreCategories(rows) };
}
export function barProportions(row: Pick<SummaryCategory, 'a' | 'b' | 'bar' | 'outcome'>): [number, number] | undefined {
  if (!row.bar || row.outcome === 'unavailable' || row.a.kind !== 'value' || row.b.kind !== 'value' || row.a.value < 0 || row.b.value < 0 || row.a.value + row.b.value <= 0) return undefined;
  return [100 * row.a.value / (row.a.value + row.b.value), 100 * row.b.value / (row.a.value + row.b.value)];
}
