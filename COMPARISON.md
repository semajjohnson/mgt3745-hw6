# COMPARISON.md

Feature: F2, Create a trip and invite members. Specification copied unchanged from `mehtaaashi05/mgt3745-team-Alpha-` at commit `5731bf0d1855f2e91fd7387c55fdc8e5633af116`. Both builders received the identical prompt in `prompts/PROMPT.md`, one run each, no retries.

| Builder | Project name | Build time | Model |
|---|---|---|---|
| bolt.new | Tripcast | 8 minutes | _(as reported by bolt.new; not recorded)_ |
| Google AI Studio | Trip Moments | 5m 7s | _(as reported by AI Studio; not recorded)_ |

**The first finding, from the top row of the EVALS.md error log:** both builders invented a sign-in mechanism the specification never defines. F2-1 says "a signed-in person" and F2 never states its dependency on F1, so each builder filled the silence on its own. bolt built real email and password authentication on Supabase, a vendor absent from TOOLS.md and contrary to ADR-001, and handed back a `.env` file holding a live Supabase URL and anon key in a project whose own `.gitignore` does not list `.env`. AI Studio faked it with a person-switcher over `localStorage`, which makes F2-3's reusable link impossible to exercise across devices. One silent sentence in the spec produced an undocumented vendor crossing in one build and an untestable Must-be row in the other.

## Row by Row

| EARS row | bolt.new | Evidence | AI Studio | Evidence |
|---|---|---|---|---|
| F2-1. WHEN a signed-in person creates a trip with a name, the app shall make them its creator and give them an invite link. | Fail | `create_trip()` is written correctly but cannot be reached. After signing in, the entire dashboard is "We could not load your trips," with four 500s against the Supabase host on a `created_at.desc` query, consistent with the `trip_members` policy querying `trip_members`. No create form is reachable. The display name collected at sign-up is also never stored: `views/trip-detail-view.js:162` renders `Member ${userId.slice(0, 8)}`. `docs/bolt-f2-1-dashboard-error.png`, `docs/bolt-f2-1-console-500.png` | Pass | Creating a trip as Marcus produced a trip with him as creator and a visible invite link. `docs/aistudio-f2-1-trip-created.png` |
| F2-2. IF someone tries to join a trip without a valid invite link, THEN the app shall refuse and show no trip details. | Pass | `join_trip()` returns NULL for an unknown code and the view renders no trip details. The invite code is 32 random hex characters and discloses nothing about the trip, confirmed by `evals/invite-code.test.mjs`. | Fail | Two ways. Signed in as Elena, a non-member using no invite link, the trip page showed the name, creator, note, member count and the invite link itself; "All Trips" lists trips marked "Not a member" with a button to open each, and only the moments section checks membership (`docs/aistudio-f2-2-nonmember-sees-trip.png`). And the invite code is built from the trip name at `src/main.ts:184-186`, so the link leaks the trip even where a refusal works. |
| F2-3. The app shall give each trip one reusable invite link. | Partial | `invite_code` is unique per trip and reusable by design, but no one can use it: `views/join-view.js` destructures `{ data: session }` from `getSession()` then checks `session.data?.session`, which is always undefined, so even signed-in users are bounced to the dashboard. | Pass | One token per trip, reusable. The caveat is that everything lives in `localStorage`, so reuse only happens between invented people inside one browser and the link cannot reach another device. |

**Totals: bolt.new 1 of 3. AI Studio 2 of 3.**

**An asymmetry worth stating.** AI Studio's verdicts come from driving the application as a non-member. bolt's come mostly from reading source, because bolt never got past sign-in. A build that cannot be run cannot be reviewed the same way, and that difference is itself an argument about delegation cost.

## Code Eval

`evals/invite-code.test.mjs` runs one assertion against both builders' invite-code generators, transcribed from the committed zips with their source files and line numbers cited in `evals/invite-code.mjs`. The question is F2-2's: does the invite link itself disclose a trip detail?

```
node --test "evals/*.test.mjs"
```

Four tests, three pass. bolt's generator returns 32 random hex characters and passes. AI Studio's returns `weekend-in-lisbon-k9x2qd` and fails, because the trip name is in the link. Same test, same row, opposite results.

## Scope Creep

Counted from the committed zips, excluding `node_modules`.

| | bolt.new | AI Studio |
|---|---:|---:|
| Files created | 16 | 10 |
| Files the feature did not need | 6 | 7 |
| Packages declared | 2 | 19 |
| Packages the generated code imports | 2 | 0 |

**bolt's six:** `.bolt/config.json`, `.env`, `.gitignore`, `package.json`, `package-lock.json`, `public/vite.svg`. The two Supabase migrations and four view files are arguably the feature, since bolt chose a backend to implement it.

**AI Studio's seven:** `.env.example`, `.gitignore`, `README.md`, `metadata.json`, `package.json`, `tsconfig.json`, `vite.config.ts`. Only `index.html`, `src/main.ts` and `src/style.css` carry the feature.

**Features neither was asked for.** bolt added email and password sign-up and a Remove member action. AI Studio added a person-switcher, seeded demo data, a destination-note field, a copyable text-message preview, a reset-demo control, and a "Feature Verification Controls" panel that runs its own acceptance walkthrough.

**Dependencies, where the two differ most.** bolt declared two packages, Vite and `@supabase/supabase-js`, and imports both. AI Studio declared nineteen across dependencies and devDependencies, including React, React DOM, Tailwind, express, `lucide-react`, `motion` and `@google/genai`, and its `src/main.ts` imports none of them; the `package.json` is still named `react-example`. Both broke the prompt's no-dependency instruction, but only one shipped a package list its own code never touches.

**Stated exclusions.** FEATURES.md excludes editing photos, direct messaging, connecting to other social media, and business accounts. Neither build violates one outright. AI Studio's text-message preview composes a message for the user to copy rather than sending anything, so it sits beside the direct-messaging exclusion without crossing it. The exclusions were not in my prompt, so nothing here was tested.

## Style Compliance

| | bolt.new | AI Studio |
|---|---|---|
| Used all 8 supplied tokens | Yes | Yes |
| Colors used that are not tokens | 4 | 5 |
| Text below the 14px minimum | Yes, one `font-size: 12px` on `.member-role` | No, all four sizes are tokens, none below 14px |
| Spacing off the 8px grid | Yes: 10px, 12px, 2px | No |
| Loads a stylesheet or font from another origin | No | No |
| Calls any other origin | Yes: Supabase on every action, plus `og:image` and `twitter:image` pointing at `bolt.new` | No, `localStorage` only |

Both builders took the eight tokens exactly as given, which is the clearest thing the prompt transmitted. Both then invented tints, borders and a hover shade, because the prompt names none. That is a gap in my style rules rather than disobedience.

Both also render user data through `innerHTML`, each escaping first with its own hand-written helper (`main.js:159`, `src/main.ts:1142`). STANDARDS.md forbids `innerHTML` with user data outright, so both would fail a strict reading. STANDARDS.md was not in my prompt, which is my omission.

## Judgment Eval

`docs/JUDGMENT.md`. Twenty-four binary questions, twelve per build, graded by me and by Gemini working from `grader-packet.zip` with no analysis of mine included.

**Agreement: 24 of 24, 100%.** The verdicts matched everywhere. The grader's evidence did not survive an audit: it cited a test file absent from the packet, cited a screenshot showing the opposite of its claim, contradicted its own verdict on one item, and misstated bolt's dependency count. Two citations were exact and correct. The audit is in JUDGMENT.md and the finding is in the EVALS.md error log. Perfect agreement from a grader whose reasoning fails inspection is not independent confirmation of my column.

## Spec Gaps

Every place both builders guessed, or guessed differently. Each one is a change my team could make to FEATURES.md.

| # | Gap | What each builder did | Proposed change |
|---|---|---|---|
| 1 | F2-1 says "a signed-in person" but never says what signing in is, and F2 does not state its dependency on F1. | bolt built email and password auth on Supabase. AI Studio faked it with a dropdown over `localStorage`. | Add to F2: "F2 depends on F1. A person is signed in when F1-1 has created their account and established their session." |
| 2 | "Valid invite link" is never defined, so each builder invented a validity rule and a code format. | bolt: 32 random hex characters. AI Studio: the slugified trip name plus six random characters. | Add an EARS row: "The app shall generate each invite link from random characters that do not encode the trip name, any member's name, or the trip's creation date." |
| 3 | "Trip details" is never defined, so F2-2 cannot be checked precisely. | bolt showed nothing on an invalid code. AI Studio showed name, creator, note, member count and the invite link to a non-member who used no link at all. | Revise F2-2: "IF a person who is not a member of a trip requests it without a valid invite link, THEN the app shall show no trip name, creator, note, member count, moments, or invite link." |
| 4 | Nothing says where trips are stored. | bolt chose Supabase, a vendor absent from TOOLS.md and contrary to ADR-001. AI Studio chose `localStorage`, which makes a shared invite link impossible. | Not a FEATURES.md change: ARCHITECTURE.md already decides this. The gap is that no architecture travelled with the prompt, which is a process fix for Phase 2 delegations. |
| 5 | Nothing says whether a removed member can rejoin with the same reusable link. | bolt added Remove member on its own; a removed member can rejoin immediately. | Add an EARS row, or an explicit exclusion if member removal is out of scope for Phase 2. |
| 6 | STYLE.md names eight tokens and no tint, border or hover shade. | bolt invented 4 colors, AI Studio 5, all of them tints, borders or hover states. | Add tokens for a surface tint, a border and a hover state, or state that derived shades of existing tokens are permitted. |

## Recommendation Criteria and Weights

Committed before either builder was scored.

| Criterion | Weight (1 to 5) | Why this weight |
|---|---:|---|
| Satisfies the F2 EARS rows | 5 | The rows are the specification. A builder that misses the row the feature turns on has not built the feature. |
| Fits ADR-001: Cloudflare Workers, D1, no added vendor | 5 | ADR-001 names the stack and the crossing. A builder that reaches for a different backend creates a Trust Boundary crossing the team would have to account for or undo. |
| Correctness of what it did build | 4 | Code that reads correctly but does not run costs the same review time and produces nothing testable. |
| Respects the stated constraints: no framework, no dependencies | 3 | Both failed this, so it separates them only by degree. Weighted below the rows themselves. |
| Honesty of its own summary | 3 | A builder that reports compliance it does not have makes review more expensive, because nothing it says can be taken at face value. |
| Style compliance | 2 | Both were close, and it is the cheapest category to fix by hand. |

## Scores and Recommendation

Scores assigned after the criteria and weights above were committed.

| Criterion | Weight | bolt.new | AI Studio |
|---|---:|---:|---:|
| Satisfies the F2 EARS rows | 5 | 2 (10) | 3 (15) |
| Fits ADR-001: Workers, D1, no added vendor | 5 | 1 (5) | 3 (15) |
| Correctness of what it did build | 4 | 1 (4) | 4 (16) |
| Respects the no-framework, no-dependency instruction | 3 | 2 (6) | 2 (6) |
| Honesty of its own summary | 3 | 2 (6) | 2 (6) |
| Style compliance | 2 | 3 (6) | 4 (8) |
| **Weighted total (max 110)** | | **37** | **66** |

**Why the low scores.**

*bolt, ADR-001 fit = 1.* It chose Supabase on its own: a vendor absent from TOOLS.md, holding trip data, member records and my real email address, against an ADR that names Cloudflare Workers and D1. This stopped being hypothetical when signing in created an account there, and it returned a `.env` carrying that project's live URL and anon key.

*bolt, correctness = 1.* Nothing past sign-in works. The dashboard is one error message with no create form, so F2-1 is unreachable rather than degraded.

*AI Studio, EARS rows = 3 not 5.* It passes 2 of 3, but the row it fails is the one the feature turns on, and it fails it twice: a non-member sees everything, and the invite link leaks the trip name.

*AI Studio, ADR-001 fit = 3 not 5.* It added no vendor, which is the important part, but it put everything in `localStorage` rather than anything resembling D1, so none of its storage work carries into Phase 2.

*Both, honesty = 2.* bolt's summary claimed nothing loads from another origin while calling Supabase on every action and carrying `bolt.new` image URLs in its `index.html`. AI Studio's claimed no external dependencies and that trip details are never shown without a valid link. Both are checkably false.

**Recommendation: Google AI Studio for F2 in Phase 2.**

It produced a running application that honors the team's architecture by default, with no added vendor, no account created elsewhere and no credential returned, and its failure is a visibility bug in code we can read and fix in an afternoon. bolt produced a more ambitious system that does not run and that quietly moved our data to a third party.

**What gets harder with this choice.** AI Studio faked sign-in with a person-switcher over `localStorage`, so it built nothing toward F1 and nothing that survives leaving the browser. bolt, for all its faults, produced working authentication and a real database schema with row-level policies, which is work the team will now do itself. Choosing AI Studio trades a working demo today for more backend work in Phase 2. Its F2-2 failure is also the kind that is easy to under-fix: hiding the trip page from non-members does not fix an invite link that carries the trip's name, and both have to be done.

**A second consequence.** My verdicts are not equally evidenced. AI Studio's come from driving the app as a non-member; bolt's come from reading source, because bolt never ran past sign-in. That asymmetry argues for the recommendation and is a caveat on the scores at the same time.

## Handoff

Pull request proposing a FEATURES.md change: https://github.com/mehtaaashi05/mgt3745-team-Alpha-/pull/68

Proposes spec gaps 1, 2 and 3 as changes to F2: the dependency on F1, a definition of "trip details" in F2-2, and a new F2-4 on what an invite link may encode. Gaps 5 and 6 are noted in the pull request but not proposed as rows. Gap 4 is an architecture note rather than a FEATURES.md change, since ARCHITECTURE.md already decides where trips are stored; the gap is that no architecture travelled with my prompt, which is a process fix for Phase 2 delegations.

Rishika owns FEATURES.md, so this is a proposal rather than a decision. The team decides whether to merge it.