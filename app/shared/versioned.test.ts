import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evidenceFixture } from './evidence.fixtures.ts';
import { mergeCommittedSupport, supportForSnapshot, validVersionedSnapshot, validVersionedSupportManifest } from './versioned.ts';

test('committed v2 support overrides delayed metadata and keeps other candidate statuses', () => {
  const snapshot=evidenceFixture();
  const stale={...supportForSnapshot(snapshot),snapshotId:'old'};
  const merged=mergeCommittedSupport({seasons:[stale,{season:2011,verified:false,lastCheckedRound:0,knownGaps:['Audit not completed']}]},{2026:snapshot});
  assert.deepEqual(merged.seasons.find(row=>row.season===2026),supportForSnapshot(snapshot));
  assert.equal(merged.seasons.find(row=>row.season===2011)?.verified,false);
  assert.equal(validVersionedSupportManifest(merged),true);
  assert.equal(validVersionedSnapshot({...snapshot,schemaVersion:99},2026),false);
});

test('a pending v2 year cannot claim verified support and historical guards do not reject v2 years', () => {
  const snapshot=evidenceFixture();
  snapshot.audit.status='pending';
  const entry=supportForSnapshot(snapshot);
  assert.equal(entry.verified,false);
  assert.equal(validVersionedSupportManifest({seasons:[{...entry,verified:true}]}),false);
  assert.equal(validVersionedSupportManifest({seasons:[entry]}),true);
});
