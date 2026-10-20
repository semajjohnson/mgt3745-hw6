# COMPARISON.md

Feature: F2, Create a trip and invite members. Spec copied unchanged from `mehtaaashi05/mgt3745-team-Alpha-` at commit `5731bf0d1855f2e91fd7387c55fdc8e5633af116`. Both builders received the identical prompt in `prompts/PROMPT.md`, one run each, no retries.

| Builder | Project name | Build time | Model |
|---|---|---|---|
| bolt.new | Tripcast | 8 minutes | <fill in> |
| Google AI Studio | Trip Moments | 5m 7s | <fill in> |

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
| bolt.new | <count> | Remove member | None |
| AI Studio | <count> | Leave trip, delete trip permanently, sample moments, a text-message preview, a Feature Verification Controls panel, a person switcher | None |

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

| Criterion | Weight | bolt.new | AI Studio |
|---|---|---|---|
| <criterion> | <weight> | <1 to 5> | <1 to 5> |
| **Weighted total** | | <total> | <total> |

### Decision

<Which builder your team should use for this feature in Phase 2, why, and at least one thing that gets harder with that choice. Tie the reasoning to your team's ADR-001 stack.>

## Handoff to the Team

Pull request or issue proposing a FEATURES.md change: <URL>
