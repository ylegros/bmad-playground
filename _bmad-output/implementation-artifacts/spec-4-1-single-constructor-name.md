---
title: '4.1 Keep one constructor name when its logo is unavailable'
type: 'bugfix'
created: '2026-10-30'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent">

## Intent

Correct the shared constructor identity renderer so missing, unusable or failed logos leave exactly one visible accessible team name and no empty badge. Valid historical logos remain decorative beside that name. Failure state must reset for a different identity, season or resolved asset. Preserve driver portrait initials, canonical mappings, styling and analysis behavior.

Verify missing, valid, failed and recovered images in local and bundled modes at desktop, narrow and 200% zoom. Record Story 4.1 evidence separately from historical release and media acquisition evidence. No acquisition or publication is included.

</frozen-after-approval>

## Implementation Notes

- Investigation: `app/client/Identity.tsx` owns all constructor frames. Current fallback repeats the name and keeps an empty badge; failure is keyed only by filename. `media.ts` owns canonical season mappings and adapter-relative URLs; retain those contracts. Existing browser media tests and hosted configuration provide verification seams.
- No unresolved intent choices or irreversible operations. Small footprint: shared renderer, focused browser checks and iteration-three evidence/tracking. User authorized preserving the existing dirty planning tree.
- Implemented missing/failed constructor frame omission and keyed recovery. Credits text follows the new behavior. Tests cover initial mappings, deliberate load failure, retained-component season recovery, accessible names, exact driver initials and responsive local/bundled rendering. Full results are in `iteration-three-verification.md`.

## Review Triage Log

- Medium, patched: recovery test originally checked an unrelated first logo after cold navigation. It now warms both seasons, fails Ferrari, retains a DOM marker and checks Ferrari's reused file after the season change. The key also includes canonical identity and filename; those independent mutations were inspected in code rather than browser-injected.
- Medium, patched: absent mappings were not directly tested. Three component tests now cover absence, correct decorative mapping and wrong-season exclusion.
- Low, patched: driver fallback check only asserted a visible frame. Browser checks now assert LH/MV, aria-hidden fallback initials and full readable names. Missing-portrait behavior is unchanged; this story does not alter that branch.
