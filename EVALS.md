# EVALS.md

Committed 2026-10-19, before either builder was opened. Feature under test: F2, Create a trip and invite members (F2-1, F2-2, F2-3), from `context/FEATURES.md` at team commit `5731bf0d1855f2e91fd7387c55fdc8e5633af116`.

## Prediction Stake

Committed before either builder was opened. Do not edit these predictions after the commit; resolve them beneath.

### Tight (a count)

bolt.new will satisfy 2 of my 3 EARS rows; AI Studio will satisfy 2 of 3. Both will fail or only partially satisfy F2-2, because the spec says a join must be refused without a "valid invite link" and never says what makes a link valid, so each builder has to invent a validity rule.

**Resolution (2026-10-20):** bolt.new satisfied 1 of 3; AI Studio satisfied 2 of 3. The prediction was wrong on both counts, and wrong in an instructive way. I predicted both would fail F2-2 because "valid invite link" is undefined. bolt handled it correctly: an invalid code returns a refusal and shows no trip details. AI Studio failed it outright — a signed-in non-member reaches a trip page without any link and sees the name, creator, note, member count, and the invite link itself. Meanwhile bolt lost F2-1, which I expected it to pass, because joining is broken by a destructuring bug and the dashboard hits an infinite-recursion error in its own access policies. The undefined term produced a failure in exactly one builder, so it is a builder weakness and a spec gap at the same time.

### Loose (a direction with a reason)

bolt.new will produce more files than the feature needs and AI Studio will produce fewer. bolt starts from a React and Tailwind scaffold regardless of the task: in HW5 its output carried nine dependencies the generated code never imported, while AI Studio returned plain HTML, CSS, and JavaScript with none.

**Resolution (2026-10-20):** Half right, and the half that was wrong is the more useful one. bolt did produce more than the feature needed: Vite, @supabase/supabase-js, two server functions, two database tables with access policies, and a "Remove member" feature F2 never mentions. But AI Studio did not produce fewer. Its `package.json` is still the template, named "react-example," listing React, Tailwind, Express, @google/genai, and motion, and its application logic is TypeScript requiring a Vite build. My reasoning came from HW5, where AI Studio returned plain HTML, CSS, and JavaScript with no dependencies. That result did not generalize: the difference was the Build tab's project scaffold, not the model's restraint.

### Open (a question the builds can answer)

F2-1 says "a signed-in person," but F1 Accounts is not in this prompt. Will either builder treat sign-in as out of scope, or will it build an account system nobody asked for? Whichever happens says something about how each builder handles a dependency the spec names but does not define.

**Resolution (2026-10-20):** Neither builder treated sign-in as out of scope, and each invented a different mechanism. bolt built real email and password authentication on Supabase, with accounts persisted to a third-party service that appears nowhere in TOOLS.md. AI Studio faked it: a dropdown switches between invented people, and everything lives in one browser's localStorage, so the invite link cannot actually reach another person's phone. Both answers are defensible from a prompt that says "a signed-in person" and never says what signing in is. The gap is in the spec, but the consequences differ sharply — one creates an undocumented Trust Boundary crossing, the other makes F2-3's "reusable" link untestable.

## Error Log

Most frequent first. Your top row is the first finding in COMPARISON.md.

| Error | Builder | Frequency | EARS row | Evidence |
|---|---|---|---|---|
| <what went wrong> | <bolt / AI Studio / both> | <count> | <ID> | <file and line, screenshot, or test> |

## Error Log

| Error | Builder | Frequency | EARS row | Evidence |
|---|---|---|---|---|
| Builder invented a sign-in mechanism the spec never defines | both | 2 | F2-1 | bolt: Supabase email/password auth. AI Studio: a person-switcher dropdown over localStorage. |
| Builder added dependencies after an explicit no-dependency instruction | both | 2 | prompt instruction | bolt: Vite, @supabase/supabase-js. AI Studio: template `package.json` named "react-example" listing React, Tailwind, Express, @google/genai, motion. |
| Builder shipped features F2 did not ask for | both | 2 | scope | bolt: Remove member. AI Studio: leave trip, delete trip, sample moments, text-message preview, verification panel, person switcher. |
| Builder's own summary claimed compliance it did not have | both | 2 | prompt instruction | bolt claimed "nothing is loaded from another origin" while calling Supabase on every action and referencing bolt.new og:image URLs. AI Studio claimed no external dependencies and that trip details are never shown without a valid link. |
| Undefined spec terms forced a guess: "valid invite link," "trip details" | both | 2 | F2-2 | Each builder invented its own validity rule and its own idea of what counts as a detail. |
| Non-member sees full trip details with no invite link | AI Studio | 1 | F2-2 | Signed in as Elena, a non-member: trip name, creator, note, member count, and the invite link all visible. "All Trips" lists trips marked "Not a member" with an open button. |
| A valid invite link cannot be used to join | bolt | 1 | F2-1, F2-3 | `join-view.js` destructures `{ data: session }` from `getSession()`, then checks `session.data?.session`, which is always undefined. |
| Dashboard fails to load trips | bolt | 1 | F2-1 | Infinite recursion in the `trip_members` access policy, which queries `trip_members`; the `trips` policy queries it too. |
| Invite code leaks the trip name | AI Studio | 1 | F2-2 | Code is the trip name plus six `Math.random()` characters: "lisbon-casual-moments-token". |
| Style values off-token | bolt | 1 | style | `.member-role` at 12px under the 14px minimum; spacing at 10px, 12px, 2px, 4px; placeholder text at 0.7 opacity on muted. |
| Colors used that are not tokens | AI Studio | 1 | style | Five invented colors: two message backgrounds, two border greys, one hover shade. |
| Display name collected but never stored | bolt | 1 | F2-1 | Members render as "Member <uuid prefix>"; the creator's row reads "You (creator)" to every viewer. |