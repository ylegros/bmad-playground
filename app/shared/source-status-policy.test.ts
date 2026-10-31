import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isRetirement, comparisonSummary } from './comparison.ts';
import { comparisonFixture } from './comparison.fixtures.ts';
const fixtures = JSON.parse(readFileSync(new URL('./source-status-policy.fixtures.json', import.meta.url),'utf8')) as {status:string;expected:boolean|'unavailable';classification:string;sourceUrl:string}[];
test('actual cached newly investigated statuses use only individually evidenced exact mappings',()=>{
 for(const row of fixtures)assert.equal(isRetirement(row.status),row.expected==='unavailable'?undefined:row.expected,`${row.status} ${row.sourceUrl}`);
 assert.equal(isRetirement('lapped'),undefined);assert.equal(isRetirement('+12 Laps'),undefined);
});
test('long lap deficits cannot be generalized to finishes; mechanical labels may mean withdrawal',()=>{
 for(const status of ['+11 Laps','+14 Laps','+42 Laps'])assert.ok(fixtures.some(row=>row.status===status&&row.classification==='R'));
 assert.ok(fixtures.some(row=>row.status==='Fuel system'&&row.classification==='W'));
});
test('explicit Lapped and Withdrew statuses improve DNF samples without creating retirements',()=>{
 const s=comparisonFixture();s.results[0].status='Lapped';s.results[1].status='Withdrew';
 let dnf=comparisonSummary(s,'a','b')!.rows.find(row=>row.id==='dnf')!;
 assert.deepEqual(dnf.a,{kind:'value',value:0});
 s.results[1].status='Fuel system';dnf=comparisonSummary(s,'a','b')!.rows.find(row=>row.id==='dnf')!;
 assert.equal(dnf.a.kind,'unavailable');
});
