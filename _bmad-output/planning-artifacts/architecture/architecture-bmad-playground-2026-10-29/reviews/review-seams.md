# Seam review

Verdict: two bounded consistency holes; no stack or service split change needed.

## 1. Same-season responses can regress a successful refresh (medium)

AD-5 prevents obsolete selection responses and mixed snapshot versions, but does not order responses for the same selected season. Independently implemented API client A can finish a cached GET after refresh handler B returns a newly committed snapshot. A commits the old GET because its season and selection are still current. Every surface consistently shows the old immutable snapshot, satisfying the stated rules while losing the refresh result and timestamp.

Close with one client request-generation rule for all loads and refreshes of a season: only the newest relevant operation may commit, or invalidate pending reads when refresh starts. Random snapshotId equality alone cannot establish ordering. Verify delayed cached GET after successful refresh.

## 2. Round-earned points lack a missing-driver-entry rule (medium)

AD-2 explicitly makes absent results unavailable; AD-3 permits summing when required session availability is known. These do not say whether session availability means the endpoint is complete or this driver's record exists. A selector can use a complete sprint endpoint and treat an absent driver entry as zero when adding GP points. Another selector can propagate unavailable from that missing entry. Both retain missing sprint results and known GP components correctly but produce different round-earned totals for the same snapshot. This is particularly visible when a driver misses one session or a replacement competes.

Close by distinguishing session-level completeness from entity participation and specifying exactly when an absent entity contributes zero versus unavailable to earned-point aggregates. Apply the same rule to constructors, including entities that have no entries at an event; preserve the separate unavailable result display. Add one fixture for a complete sprint endpoint with a driver absent and present in the GP.

## Checked and adequately bounded

Shared shapes are intentionally deferred behind a contracts-first implementation gate; units importing that single contract cannot legitimately invent competing wire shapes. Snapshot ownership is singular, provider parsing is isolated, standings authority avoids inferred scoring, and teammate tie ordering is deterministic. Do not expand this personal single-process MVP with distributed storage, accounts, or extra services to resolve these findings.
