# EVALS.md

Feature under test: F2, Create a trip and invite members (F2-1, F2-2, F2-3), from `context/FEATURES.md` at team commit `5731bf0d1855f2e91fd7387c55fdc8e5633af116`.

**On the commit timing, stated plainly.** These three predictions were written on 2026-10-19, before either builder was opened. The commit did not land until 2026-10-20 at 14:05, which is after both builds ran that morning. The assignment's test is the commit timestamp, and by that test this stake is late. I am recording that rather than letting the file's date stand in for the commit's, because `git log` shows the difference and a prediction is only worth something if the account of it is accurate. The prediction text has not been edited since it was written; the resolutions beneath each one were added on 2026-10-20.

## Prediction Stake

### Tight (a count)

bolt.new will satisfy 2 of my 3 EARS rows; AI Studio will satisfy 2 of 3. Both will fail or only partially satisfy F2-2, because the spec says a join must be refused without a "valid invite link" and never says what makes a link valid, so each builder has to invent a validity rule.

**Resolution (2026-10-20):** bolt.new satisfied 1 of 3; AI Studio satisfied 2 of 3. Wrong on both counts, and wrong in an instructive way. I predicted both would fail F2-2 because "valid invite link" is undefined. bolt handled it correctly: an invalid code returns a refusal and shows no trip details, and `evals/invite-code.test.mjs` confirms its generated code discloses nothing about the trip. AI Studio failed F2-2 twice over: a signed-in non-member reaches a trip page with no link at all and sees the name, creator, note, member count and the invite link itself, and its invite code is built from the trip name, so the link leaks the trip even where a refusal works. Meanwhile bolt lost F2-1, which I expected it to pass, because joining is broken by a destructuring bug and the dashboard returns 500s from its own access policies. The undefined term produced a failure in exactly one builder, which makes it a builder weakness and a spec gap at the same time.

### Loose (a direction with a reason)

bolt.new will produce more files than the feature needs and AI Studio will produce fewer. bolt starts from a React and Tailwind scaffold regardless of the task: in HW5 its output carried nine dependencies the generated code never imported, while AI Studio returned plain HTML, CSS, and JavaScript with none.

**Resolution (2026-10-20):** Right about the direction, wrong about the cause, and the cause is the finding. bolt did produce more files: 16 against AI Studio's 10, excluding `node_modules`. But my reasoning was that bolt starts from a React and Tailwind scaffold, which is what happened in HW5. This time it was the reverse. bolt shipped a plain Vite starter declaring two packages, Vite and `@supabase/supabase-js`, both of which its code actually imports. AI Studio shipped a `package.json` still named `react-example` declaring nineteen packages — React, React DOM, Tailwind, express, `lucide-react`, `motion`, `@google/genai` — none of which its own `src/main.ts` imports. The scaffold a builder begins from is not a stable property of the builder; it changed between HW5 and HW6 for both of them. A prediction about dependencies turns out to be a prediction about this week's starter template.

### Open (a question the builds can answer)

F2-1 says "a signed-in person," but F1 Accounts is not in this prompt. Will either builder treat sign-in as out of scope, or will it build an account system nobody asked for? Whichever happens says something about how each builder handles a dependency the spec names but does not define.

**Resolution (2026-10-20):** Neither treated sign-in as out of scope, and each invented a different mechanism. bolt built real email and password authentication on Supabase, with accounts persisted to a third-party service that appears nowhere in TOOLS.md, and returned a `.env` file holding a live Supabase URL and anon key in a project whose own `.gitignore` does not list `.env`. AI Studio faked it: a dropdown switches between invented people and everything lives in one browser's `localStorage`, so the invite link cannot reach another person's phone and F2-3's "reusable" cannot be exercised across people at all. Both answers are defensible from a prompt that says "a signed-in person" and never says what signing in is. The consequences are not comparable: one created an undocumented vendor crossing and handed a credential back into my repository, the other made a Must-be feature untestable.

## Error Log

Most frequent first. My top row is the first finding in COMPARISON.md.

| Error | Builder | Frequency | EARS row | Evidence |
|---|---|---:|---|---|
| Invented a sign-in mechanism the spec never defines | both | 2 | F2-1 | bolt: Supabase email and password auth, `views/auth-view.js`. AI Studio: person-switcher over `localStorage`, `src/main.ts`. |
| Shipped features F2 did not ask for | both | 2 | scope | bolt: Remove member. AI Studio: person switcher, seeded demo data, destination-note field, text-message preview, reset control, verification panel. |
| Undefined spec terms forced a guess: "valid invite link", "trip details" | both | 2 | F2-2 | Each invented its own validity rule and its own idea of what counts as a detail. |
| Added dependencies against an explicit no-dependency instruction | both | 2 | prompt instruction | bolt declared 2 and imports both. AI Studio declared 19 and imports none; `package.json` is still named `react-example`. |
| The builder's own summary claimed compliance it did not have | both | 2 | prompt instruction | bolt claimed nothing loads from another origin while calling Supabase on every action, and `index.html` carries `og:image` pointing at `bolt.new`. AI Studio claimed no external dependencies and that trip details are never shown without a valid link. |
| Rendered user data through `innerHTML`, escaped by a hand-written helper | both | 2 | standards | bolt `main.js:159`, AI Studio `src/main.ts:1142`. STANDARDS.md forbids `innerHTML` with user data; STANDARDS.md was not in my prompt. |
| Invented colors STYLE.md does not define | both | 2 | style | bolt added 4, AI Studio 5, all tints, borders and hover shades. Both used all 8 supplied tokens correctly. |
| Non-member sees full trip details with no invite link | AI Studio | 1 | F2-2 | Signed in as Elena, a non-member: name, creator, note, member count and invite link all visible. `docs/aistudio-f2-2-nonmember-sees-trip.png` |
| Invite code built from the trip name, leaking it | AI Studio | 1 | F2-2 | `src/main.ts:184-186`. Produces `weekend-in-lisbon-k9x2qd`. Caught by `evals/invite-code.test.mjs`. |
| A valid invite link cannot be used to join | bolt | 1 | F2-1, F2-3 | `views/join-view.js` destructures `{ data: session }` from `getSession()`, then checks `session.data?.session`, which is always undefined. |
| Dashboard returns 500, trips never load | bolt | 1 | F2-1 | Four 500s against the Supabase host on a `created_at.desc` query, consistent with the self-referential `trip_members` access policy. |
| Returned a `.env` with live credentials, not gitignored | bolt | 1 | crossing | `project/.env` holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; `project/.gitignore` does not list `.env`. |
| Display name collected at sign-up but never stored | bolt | 1 | F2-1 | Members render as "Member <uuid prefix>"; the creator's row reads "You (creator)" to every viewer. |
| Text below the 14px minimum, spacing off the 8px grid | bolt | 1 | style | `.member-role` at 12px; padding at 10px, 12px, 2px. AI Studio defines all four sizes as tokens, none below 14px. |
| Second grader produced evidence it could not have had | Gemini 3.8 (judgment eval) | 1 | rubric | J8 cites `evals/invite-code.test.mjs`, absent from the packet; J18 cites a screenshot showing the opposite of its claim; J9 misstates bolt's dependency count. All 24 verdicts agreed. |
| My own prediction stake committed after the builds ran | process | 1 | stake | Written 2026-10-19, committed 2026-10-20 at 14:05, after both builds. Recorded at the top of this file. |