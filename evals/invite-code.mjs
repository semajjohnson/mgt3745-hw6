// evals/invite-code.mjs
//
// Both builders' invite-code generators, transcribed from the committed zips so
// one test can run against both. Each function is a faithful port of the
// original, with its source file and line cited. Nothing here is my own design.

/**
 * bolt.new (Tripcast).
 * Source: builds/bolt.zip → project/supabase/migrations/
 *   20261020130853_20261020_create_trips_and_members.sql, lines 170-172,
 *   inside the create_trip() PL/pgSQL function:
 *
 *     v_code := replace(gen_random_uuid()::text, '-', '')
 *               || upper(to_hex(floor(random() * 1000000)::int));
 *     v_code := substr(v_code, 1, 32);
 *
 * A UUID with its dashes removed is already 32 characters, so the appended hex
 * is always truncated away. The trip name is never read.
 */
export function boltInviteCode(tripName, randomUuid, randomInt) {
  const code = randomUuid.replace(/-/g, '') + randomInt.toString(16).toUpperCase();
  return code.slice(0, 32);
}

/**
 * Google AI Studio (Trip Moments).
 * Source: builds/aistudio.zip → src/main.ts, lines 184-186,
 *   inside createTrip():
 *
 *     const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
 *                               .replace(/(^-|-$)/g, '');
 *     const randomSuffix = Math.random().toString(36).substring(2, 8);
 *     const inviteToken = `${sanitizedName || 'trip'}-${randomSuffix}`;
 */
export function aiStudioInviteCode(tripName, randomSuffix) {
  const sanitizedName = tripName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${sanitizedName || 'trip'}-${randomSuffix}`;
}
