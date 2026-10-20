# COMPARISON.md

Feature: F2, Create a trip and invite members. Spec copied unchanged from `mehtaaashi05/mgt3745-team-Alpha-` at commit `5731bf0d1855f2e91fd7387c55fdc8e5633af116`. Both builders received the identical prompt in `prompts/PROMPT.md`, one run each, no retries.

| Builder | Project name | Build time | Model |
|---|---|---|---|
| bolt.new | Tripcast | 8 minutes | <Opus 5.5> |
| Google AI Studio | Trip Moments | 5m 7s | <Opus 5.5> |

## Row by Row

| EARS row | bolt.new | Evidence | AI Studio | Evidence |
|---|---|---|---|---|
| F2-1. WHEN a signed-in person creates a trip with a name, the app shall make them its creator and give them an invite link. | Fail | Trip creation and link generation are written correctly, but the dashboard fails to load trips: infinite recursion in the `trip_members` access policy, which queries `trip_members`, while the `trips` policy queries it too. The creator's display name is also never stored, so members render as "Member <uuid prefix>". | Pass | Creating a trip as Marcus produced a trip with him as creator and a visible invite link. |
| F2-2. IF someone tries to join a trip without a valid invite link, THEN the app shall refuse and show no trip details. | Pass | An invalid code returns a "not valid" message and renders no trip details. | Fail | Signed in as Elena, a non-member, with no invite link used: the trip page showed the name, creator, note, member count, and the invite link itself. "All Trips" lists trips marked "Not a member" with a button to open each. Only the moments section checks membership. |
| F2-3. The app shall give each trip one reusable invite link. | Partial | `invite_code` is unique per trip and reusable by design, but no one can actually use it: `join-view.js` destructures `{ data: session }` from `getSession()` then checks `session.data?.session`, which is always undefined, so even signed-in users are bounced to the dashboard. | Partial | One code per trip and reusable, but reuse only works between invented people inside one browser, since everything lives in localStorage. The code is the trip name plus six `Math.random()` characters ("lisbon-casual-moments-token"), so the link leaks the trip name. |

**Totals: bolt.new 1 of 3. AI Studio 2 of 3.**

## Scope Creep
| Builder | Files created or changed the feature did not need | Features added that F2 does not ask for | Things FEATURES.md excludes |
|---|---|---|---|
| bolt.new | 8: `package.json`, `package-lock.json`, `supabase-client.js`, `.env`, two `supabase/migrations/*.sql`, `public/vite.svg`, `.gitignore` | Remove member; a display-name field at sign-up that is never saved | None |
| AI Studio | 1 (`metadata.json`) | Remove member, leave trip, delete trip permanently, sample moments, a text-message preview, a Feature Verification Controls panel, a person switcher | None |

Both also broke the prompt's "no framework, no dependencies" instruction. bolt added Vite and `@supabase/supabase-js` plus two Supabase tables and two server functions. AI Studio's `package.json` is still the Build tab's template, named "react-example," listing React, Tailwind, Express, `@google/genai`, and motion, with application logic in TypeScript requiring a Vite build.

Neither builder received the exclusions list from FEATURES.md, so nothing here violates a stated exclusion. That omission is mine, and it is a finding about the prompt rather than the builders.

## Style Compliance

| Builder | Passes | Violations |
|---|---|---|
| bolt.new | All color tokens correct, accent only on focus outlines, every alert carries words, 44rem content width, 44px tap targets, Arial | `.member-role` at 12px, under the 14px minimum. Spacing at 10px, 12px, 2px, 4px, breaking the 8px step. Placeholder text at 0.7 opacity on muted, a likely contrast failure. |
| AI Studio | Every token defined once as a CSS variable, accent only on focus outlines, 44px targets, 44rem width, 4px radius, 8px steps, nothing loaded from another origin, errors and confirmations carry words, destructive buttons labeled | Five colors invented that are not tokens: two message backgrounds, two border greys, one hover shade. |

The prompt carried STYLE.md's tokens but not the note that body text is 16px, so AI Studio used 14px, the stated minimum, as its body size. That is a direct result of what I cut from the prompt.

## Judgment Eval

<Second grader's name or model, the prompt given if a model, the question set, and the agreement rate.>

## Spec Gaps

Every place both builders guessed, or guessed differently, with the change that would close it.

| # | Gap | What each builder did | Proposed change |
|---|---|---|---|
| 1 | F2-1 says "a signed-in person" but never says what signing in is, and F2 does not state its dependency on F1. | bolt built real email and password auth on Supabase. AI Studio faked it with a dropdown over localStorage. | Add to F2: "F2 depends on F1. A person is signed in when F1-1 has created their account and session." |
| 2 | "Valid invite link" is never defined. | bolt invented a unique code per trip and refused unknown codes. AI Studio built the code from the trip name plus six random characters, leaking the trip name. | Add an EARS row: "The app shall generate each invite link from random characters that do not encode the trip name or any member's name." |
| 3 | "Trip details" is never defined, so F2-2 cannot be checked precisely. | bolt showed nothing on an invalid code. AI Studio showed name, creator, note, member count, and the invite link to a non-member who used no link at all. | Revise F2-2: "IF a person who is not a member of a trip requests it without a valid invite link, THEN the app shall show no trip name, creator, note, member count, moments, or invite link." |
| 4 | Nothing says where trips are stored. | bolt chose Supabase, a vendor absent from TOOLS.md and contrary to ADR-001's Worker and D1 decision. AI Studio chose localStorage, which makes a shared invite link impossible. | Not a FEATURES.md change: ARCHITECTURE.md already decides this. The gap is that the prompt carried no architecture, which is a process fix. |
| 5 | Nothing says whether a removed member can rejoin with the same reusable link. | bolt added Remove member on its own; a removed member can rejoin immediately. | Add an EARS row, or an explicit exclusion if removal is out of scope for Phase 2. |

## Recommendation Criteria and Weights

Committed before either builder was scored.

| Criterion | Weight (1 to 5) | Why this weight |
|---|---|---|
| Satisfies the F2 EARS rows | 5 | The rows are the specification. A builder that misses the row the feature turns on has not built the feature. |
| Fits ADR-001: Cloudflare Workers, D1, no added vendor | 5 | ADR-001 names the stack and the crossing. A builder that reaches for a different backend creates an undocumented Trust Boundary crossing the team would have to account for or undo. |
| Correctness of what it did build | 4 | Code that reads correctly but does not run costs the same review time and produces nothing testable. |
| Respects the stated constraints: no framework, no dependencies | 3 | Both failed this, so it separates the two only by degree. Weighted below the rows themselves. |
| Honesty of its own summary | 3 | A builder that reports compliance it does not have makes review more expensive, because nothing it says can be taken at face value. |
| Style compliance | 2 | Both were close. Real, but the cheapest category to fix by hand. |

### Scores (commit after the weights)

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

*bolt, ADR-001 fit = 1.* It chose Supabase on its own: a vendor absent from TOOLS.md, holding trip data, member records, and my real email address, against an ADR that names Cloudflare Workers and D1. This is no longer hypothetical — signing in created an account there.

*bolt, correctness = 1.* Nothing past sign-in works. The dashboard is one error message with no create-trip form, so F2-1 is unreachable rather than degraded.

*AI Studio, EARS rows = 3 not 5.* It passes 2 of 3, but the row it fails is the one the feature turns on: a non-member sees the trip name, creator, note, member count, and the invite link itself.

*Both, honesty = 2.* bolt's summary claimed nothing loads from another origin while calling Supabase on every action. AI Studio's claimed no external dependencies and that trip details are never shown without a valid link. Both are checkably false.

**Recommendation: Google AI Studio for F2 in Phase 2.**

It produced a running application that honors the team's architecture by default — no added vendor, no account elsewhere — and its failure is a visibility bug in code we can read and fix. bolt produced a more ambitious system that does not run and that quietly moved our data to a third party.

**What gets harder with this choice.** AI Studio faked sign-in with a person-switcher over `localStorage`, so it built nothing toward F1 and nothing that survives leaving the browser. bolt, for all its faults, produced real authentication and a real database schema — work we will now do ourselves. Choosing AI Studio trades a working demo today for more backend work in Phase 2, and its 14px body text came from a prompt omission that will recur unless STYLE.md travels whole.

**Second consequence worth naming.** My verdicts are not equally evidenced. AI Studio's come from driving the app as a non-member; bolt's come from reading source, because bolt never got past sign-in. A builder that cannot be run cannot be reviewed the same way, which is itself an argument for the recommendation and a caveat on the scores.

## Handoff

<Link to the pull request or issue you open in the team repository proposing the FEATURES.md changes from Spec Gaps above.>
### Decision

<Which builder your team should use for this feature in Phase 2, why, and at least one thing that gets harder with that choice. Tie the reasoning to your team's ADR-001 stack.>

## Handoff to the Team

Pull request or issue proposing a FEATURES.md change: <URL>
