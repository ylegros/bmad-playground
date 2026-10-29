import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validSnapshot } from './validation.ts';
import { seasonFixture } from '../../tests/fixtures.ts';
test('positions are positive integers while awarded points can be fractional or negative',()=>{
  for(const collection of ['results','qualifying','driverStandings','constructorStandings'] as const){
    for(const invalid of [0,-1,1.5]){
      const snapshot=seasonFixture();snapshot[collection][0].position={kind:'value',value:invalid};
      assert.equal(validSnapshot(snapshot,2021),false);
    }
  }
  const snapshot=seasonFixture();snapshot.results[0].points={kind:'value',value:0.5};snapshot.driverStandings[0].points={kind:'value',value:-1};
  assert.equal(validSnapshot(snapshot,2021),true);
});
