// evals/invite-code.test.mjs
//
// One test, run against both builders' logic for the same EARS row.
//
// F2-2. IF someone tries to join a trip without a valid invite link, THEN the
//       app shall refuse and show no trip details.
//
// An invite link that contains the trip's own name discloses a trip detail to
// anyone who sees the link, which is the thing F2-2 exists to prevent. The spec
// never says what an invite code may contain, so each builder decided for
// itself. This test is the same for both.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boltInviteCode, aiStudioInviteCode } from './invite-code.mjs';

const TRIP_NAME = 'Weekend in Lisbon';
const SECRET_WORDS = ['weekend', 'lisbon'];

// Fixed inputs so the test is deterministic; each builder's own randomness is
// supplied rather than generated, so a failure is about the design, not luck.
const FIXED_UUID = '3f2a9c14-8b7e-4d55-9a01-7c6e2b8f4d13';
const FIXED_INT = 918273;
const FIXED_SUFFIX = 'k9x2qd';

const builds = [
  { name: 'bolt.new (Tripcast)', code: boltInviteCode(TRIP_NAME, FIXED_UUID, FIXED_INT) },
  { name: 'Google AI Studio (Trip Moments)', code: aiStudioInviteCode(TRIP_NAME, FIXED_SUFFIX) },
];

for (const build of builds) {
  test(`F2-2: ${build.name} generates an invite code that discloses no trip detail`, () => {
    const lowered = build.code.toLowerCase();
    for (const word of SECRET_WORDS) {
      assert.ok(
        !lowered.includes(word),
        `invite code "${build.code}" contains "${word}" from the trip name, so the link itself reveals a trip detail (F2-2)`
      );
    }
  });

  test(`F2-3: ${build.name} generates a non-empty invite code for a named trip`, () => {
    assert.ok(build.code.length > 0, 'a trip must receive an invite code');
  });
}
