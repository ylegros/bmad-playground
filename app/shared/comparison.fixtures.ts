import type { SeasonSnapshot } from './contracts.ts';
import { value, unavailable } from './contracts.ts';

// Frozen adversarial participation/status cases, defined before summary implementation.
export function comparisonFixture(): SeasonSnapshot {
  return {
    schemaVersion: 1, snapshotId: 'comparison-fixture', season: 2021, refreshedAt: '2026-10-29T00:00:00Z',
    coverage: { checkedRounds: [1, 2], gaps: [] },
    drivers: Object.fromEntries(['a', 'b', 'substitute'].map(id => [id, { id, name: id, code: id, nationality: 'Test' }])),
    constructors: { team: { id: 'team', name: 'Test Racing', nationality: 'Test' } },
    schedule: [1, 2].map(round => ({ round, name: `GP ${round}`, date: '2021-01-01', gp: 'complete', qualifying: 'complete', sprint: 'not-applicable' })),
    results: [
      { round: 1, kind: 'gp', driverId: 'a', constructorId: 'team', position: value(1), classification: '1', status: 'Finished', points: value(25) },
      { round: 2, kind: 'gp', driverId: 'a', constructorId: 'team', position: value(17), classification: '17', status: 'Engine', points: value(0) },
      { round: 1, kind: 'gp', driverId: 'b', constructorId: 'team', position: value(2), classification: '2', status: 'Finished', points: value(18) },
      { round: 2, kind: 'gp', driverId: 'b', constructorId: 'team', position: value(3), classification: '3', status: 'Finished', points: value(15) },
      { round: 2, kind: 'gp', driverId: 'substitute', constructorId: 'team', position: unavailable(), classification: 'R', status: 'Unmapped future status', points: value(0) },
    ],
    qualifying: ['a','b'].flatMap((driverId, index) => [1,2].map(round => ({ round, driverId, constructorId: 'team', position: value(index + 1) }))),
    driverStandings: [
      { round: 2, driverId: 'a', constructorIds: ['team'], position: value(2), points: value(25) },
      { round: 2, driverId: 'b', constructorIds: ['team'], position: value(1), points: value(33) },
    ], constructorStandings: [],
  };
}
export const retirementCases = Object.freeze([
  ['Engine', true], ['Retired', true], ['Collision damage', true], ['Finished', false], ['+1 Lap', false], ['+10 Laps', false],
  ['Did not start', false], ['DNS', false], ['Disqualified', false], ['DSQ', false], ['Unmapped future status', undefined],
] as const);
