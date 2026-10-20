# HW6: Two Builders, One Specification

> Replace every line in angle brackets. A README that still carries template placeholders loses points.

## Feature

**Team repository:** <URL of your team repository>
**Spec provenance:** copied from commit `<full commit hash>` on <YYYY-MM-DD>

**Feature:** <ID and name from your team's FEATURES.md>

<Paste the feature's EARS rows here, unchanged. At least three rows, including at least one IF row.>

## See It Work

## See It Work

| bolt.new (Tripcast) | Google AI Studio (Trip Moments) |
|---|---|
| ![Signed in, the dashboard shows only "We could not load your trips"](docs/bolt-f2-1-dashboard-error.png) | ![Elena, not a member and using no invite link, sees the trip name, creator, note, member count, and the invite link](docs/aistudio-f2-2-nonmember-sees-trip.png) |

One prompt, two builders. bolt.new built an account system the spec never asked for and then could not load a single trip. AI Studio built a working app that shows a non-member everything F2-2 says to hide.

<Replace the two images above with your own screenshots, or one side-by-side GIF.>

## Status

<One or two sentences: how many EARS rows each builder satisfied, and your recommendation in one line.>

## How to Run the Evals

```bash
npm test
```

<Say what the test checks and what output to expect.>

## Links

- [EVALS.md](EVALS.md): Prediction Stake and error log
- [COMPARISON.md](COMPARISON.md): evidence, spec gaps, and recommendation
- [JUDGMENT.md](JUDGMENT.md): judgment eval and agreement rate
- [prompts/PROMPT.md](prompts/PROMPT.md): the exact input both builders received
- [builds/](builds/): bolt.zip and aistudio.zip
- [docs/DDR-001.md](docs/DDR-001.md) (bolt.new), [docs/DDR-002.md](docs/DDR-002.md) (AI Studio)
- Team pull request or issue: <URL>
- Deployed Worker (only if you completed the proxy step): <URL>

## Hours

<Total hours spent, with a one-line breakdown.>

## AI Use

<Every tool that wrote more than a line or two, each with a link to its DDR.>
