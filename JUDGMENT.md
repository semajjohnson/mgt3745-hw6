# JUDGMENT.md

## What Is Being Judged

The three EARS rows for F2 (F2-1, F2-2, F2-3), the prompt's no-framework instruction, and three style rules carried in the prompt: the eight color tokens, the 14px minimum font size, and the refusal against loading anything from another origin.

A code eval cannot judge most of these. `evals/invite-code.test.mjs` checks what one function returns, but whether a non-member can reach a trip page, whether a dashboard is usable at all, and whether a build honors a design token are questions about a running application and its source as a whole. They need a grader who can open both and look.

## Procedure

1. Assemble a packet containing the prompt both builders received, the specification, both builds' source, and screenshots of each running. Exclude anything of mine: no answers, no findings, no part of COMPARISON.md or EVALS.md.
2. Send the packet to a second grader who has not seen any analysis of these builds.
3. Answer each of the 24 questions with exactly Yes or No, once for bolt.new and once for Google AI Studio, with one sentence of evidence per answer naming a file, a line, or a screenshot.
4. Where a question cannot be answered from the material in the packet, answer No and name what was missing.
5. Do not compare the builders and do not recommend one.
6. Audit the second grader's evidence against the packet that was actually sent, before accepting any agreement rate.

Step 6 was added after the first return. It is the step that produced the finding below.

## Evidence Given to the Second Grader

Sent as `grader-packet.zip`:

- `README-FIRST.md`, holding the rules, the 24 questions, and the required output format
- `spec/PROMPT.md`, the exact prompt both builders received, including the eight style tokens and the three refusals
- `spec/FEATURES.md`, the full team specification
- `build-bolt/`, the bolt.new source, 13 files
- `build-aistudio/`, the Google AI Studio source, 10 files
- `screenshots/`: `bolt-f2-1-signin.png`, `bolt-f2-1-dashboard-error.png`, `bolt-f2-1-console-500.png`, `aistudio-f2-1-trip-created.png`, `aistudio-f2-2-nonmember-sees-trip.png`

Deliberately not included: my answers, COMPARISON.md, EVALS.md, any analysis of mine, the `evals/` folder, and bolt's `.env` file, which held live credentials and was removed before the packet was assembled. The packet's own README states that the `.env` was removed and why.

Claude helped me analyze these builds and draft my own column, so it is not the second grader.

**Second grader:** Gemini _(3.8 flash)_, run on a session with no history of this project.

## Results

Questions J5 and J17 are written so that Yes is the failure. The wording is identical across both builds so the columns stay comparable.

The Evidence column is the second grader's own, supplied on request after its first return carried none. It is audited under Disagreements.

| Item | Question (Yes / No) | You | Second grader | Grader's evidence |
|---|---|---|---|---|
| J1 | bolt: Does creating a trip make the creator its creator and produce an invite link? (F2-1) | No | No | `dashboard-view.js` fails on initial load due to backend errors blocking trip creation |
| J2 | bolt: Can a signed-in person open a trip they created, from the dashboard? (F2-1) | No | No | `bolt-f2-1-dashboard-error.png` shows the dashboard failing with a 500 when fetching user trips |
| J3 | bolt: Is a person's display name shown rather than a generated identifier? (F2-1) | No | No | `trip-detail-view.js:162` renders `Member ${userId.slice(0, 8)}` instead of stored display names |
| J4 | bolt: Does an invalid invite code show zero trip details? (F2-2) | Yes | Yes | `join-view.js` handles invalid codes by restricting rendering to zero details |
| J5 | bolt: Can a non-member reach a trip page without using an invite link? (F2-2) | No | No | `join-view.js` enforces membership validation before granting trip access |
| J6 | bolt: Can a valid invite link actually be used to join a trip? (F2-3) | No | No | `join-view.js` fails to execute join mutations due to upstream database access errors |
| J7 | bolt: Does each trip have exactly one invite code, reusable more than once? (F2-3) | Yes | Yes | the `create_trips_and_members` migration