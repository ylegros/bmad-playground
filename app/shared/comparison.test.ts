import { test } from 'node:test';
import assert from 'node:assert/strict';
import { value, unavailable } from './contracts.ts';
import { comparisonFixture, retirementCases } from './comparison.fixtures.ts';
import { compareValues, comparisonSummary, scoreCategories, isRetirement, barProportions } from './comparison.ts';

test('metric directions, ties, zero and missing stay distinct', () => {
  assert.equal(compareValues(value(0), value(1), 'lower'), 'a');
  assert.equal(compareValues(value(0), value(1), 'higher'), 'b');
  assert.equal(compareValues(value(0), value(0), 'higher'), 'tied');
  assert.equal(compareValues(value(0), unavailable(), 'higher'), 'unavailable');
  assert.equal(compareValues(undefined, value(1), 'lower'), 'unavailable');
});
test('exact retirement policy excludes DNS/DSQ/finished and unknown remains unknown', () => {
  for (const [status, expected] of retirementCases) assert.equal(isRetirement(status), expected, status);
});
test('six fixed categories preserve classified retirement and score best qualifying', () => {
  const result = comparisonSummary(comparisonFixture(), 'a','b')!;
  assert.equal(result.rows.length, 6);
  assert.deepEqual(result.rows.find(row=>row.id==='gp')!.a, value(1));
  assert.deepEqual(result.rows.find(row=>row.id==='dnf')!.a, value(1));
  assert.deepEqual(result.rows.find(row=>row.id==='best')!.a, value(1));
  assert.equal(result.rows.find(row=>row.id==='best-qualifying')!.outcome, 'a');
  assert.equal(result.comparable, 6);
  assert.equal(result.tied, 1);
  assert.equal(comparisonSummary(comparisonFixture(),'a','a'), undefined);
});
test('missing participation and substitute gaps cannot create season best/count', () => {
  const data = comparisonFixture();
  const result = comparisonSummary(data,'a','substitute')!;
  for (const id of ['best','dnf']) assert.equal(result.rows.find(row=>row.id===id)!.b.kind,'unavailable');
  data.results = data.results.filter(row=>!(row.round===1&&row.driverId==='a'));
  const missing = comparisonSummary(data,'a','b')!;
  assert.equal(missing.rows.find(row=>row.id==='best')!.a.kind,'unavailable');
});
test('unknown status blocks DNF but not authoritative numeric classification', () => {
  const data = comparisonFixture(); data.results[1].status='Unmapped future status';
  const result=comparisonSummary(data,'a','b')!;
  assert.equal(result.rows.find(row=>row.id==='dnf')!.a.kind,'unavailable');
  assert.equal(result.rows.find(row=>row.id==='best')!.a.kind,'value');
});
test('head-to-head evidence counts ties and exclusions; no eligible is unavailable', () => {
  const data=comparisonFixture(); data.qualifying[2].position=value(1); data.qualifying.pop();
  const row=comparisonSummary(data,'a','b')!.rows.find(row=>row.id==='qualifying')!;
  assert.equal(row.eligible.length,1); assert.equal(row.ties.length,1); assert.equal(row.excluded.length,1);
  data.qualifying=[]; assert.equal(comparisonSummary(data,'a','b')!.rows.find(row=>row.id==='qualifying')!.outcome,'unavailable');
});
test('equal category weights produce 4-2, draw and insufficient with ties counted', () => {
  assert.equal(scoreCategories(['a','a','a','a','b','b'].map(outcome=>({outcome:outcome as 'a'|'b'}))).verdict,'a');
  assert.equal(scoreCategories([{outcome:'a'},{outcome:'b'},{outcome:'tied'}]).verdict,'draw');
  assert.equal(scoreCategories([{outcome:'unavailable'}]).verdict,'insufficient');
  assert.equal(scoreCategories([{outcome:'tied'}]).comparable,1);
});
test('bars require nonnegative comparable positive totals and never show ranks', () => {
  const base={a:value(0),b:value(4),bar:true,outcome:'b' as const}; assert.deepEqual(barProportions(base),[0,100]);
  assert.equal(barProportions({...base,b:value(0)}),undefined);
  assert.equal(barProportions({...base,a:value(-1)}),undefined);
  assert.equal(barProportions({...base,bar:false}),undefined);
});

test('best qualifying ignores penalized grid and race/sprint ranking; lower wins and ties get no vote', () => {
  const data = comparisonFixture();
  data.qualifying.forEach(row => { row.position = value(row.driverId === 'a' ? 2 : 3); });
  Object.assign(data.results[0], { grid: 7 });
  let result = comparisonSummary(data, 'a', 'b')!;
  let row = result.rows.find(row => row.id === 'best-qualifying')!;
  assert.deepEqual(row.a, value(2)); assert.equal(row.outcome, 'a');
  assert.deepEqual(row.samples, { a: 2, b: 2, scheduled: 2 }); assert.equal(row.bar, false);
  assert.equal(result.a, 3); assert.equal(result.b, 2); assert.equal(result.verdict, 'a');
  data.qualifying.forEach(row => { row.position = value(2); });
  result = comparisonSummary(data, 'a', 'b')!;
  assert.equal(result.rows.find(row => row.id === 'best-qualifying')!.outcome, 'tied');
  assert.equal(result.verdict, 'b');
});
test('best qualifying requires complete sessions and authoritative numeric driver coverage', () => {
  for (const gap of ['session', 'record', 'numeric', 'nonfinite', 'empty'] as const) {
    const data = comparisonFixture();
    if (gap === 'session') data.schedule[0].qualifying = 'unavailable';
    if (gap === 'record') data.qualifying = data.qualifying.filter(row => !(row.round === 1 && row.driverId === 'a'));
    if (gap === 'numeric') data.qualifying.find(row => row.round === 1 && row.driverId === 'a')!.position = unavailable('Missing qualifying position');
    if (gap === 'nonfinite') data.qualifying.find(row => row.round === 1 && row.driverId === 'a')!.position = value(NaN);
    if (gap === 'empty') data.schedule = [];
    const row = comparisonSummary(data, 'a', 'b')!.rows.find(row => row.id === 'best-qualifying')!;
    assert.equal(row.a.kind, 'unavailable', gap);
    if (row.a.kind === 'unavailable') { assert.match(row.a.reason, /qualifying/); assert.doesNotMatch(row.a.reason, /schema|starting-grid/); }
    assert.equal(row.samples.a, gap === 'empty' ? 0 : 1, gap);
  }
});
