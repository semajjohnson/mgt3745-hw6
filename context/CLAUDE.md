# CLAUDE.md: Team AI Governance

This file governs every AI assistant used on this repository, whatever the tool. The syllabus AI and provenance policy is the floor; this file may be stricter and never looser. On shared work, this file takes precedence over any member's personal settings.

## Approved Tools

| Tool | Allowed role in our RACI | Notes |
|---|---|---|
| GitHub Copilot (in Codespaces) | R for drafts; C for review suggestions | Recorded in TOOLS.md |
| Claude (chat) | C only in Phase 1 | Critique and explanation; no files pasted except context files |
| bolt.new | R for specification probes and bounded builds with a DDR | Output never committed without a DDR and a human review |

A tool not in this table is not used on this repository until a pull request adds it here and to TOOLS.md, approved by the Implementer.

## What AI May Do

- Draft text or code that a named member then reviews, edits, and commits as the Accountable person.
- Critique a draft artifact. The critique is summarized in the pull request description.
- Run a specification probe against FEATURES.md.

## What AI May Never Do Here

1. **Merge a pull request, approve a review, or push to main.** Merging is a human act by a named reviewer, every time.
2. **Edit a committed Prediction Stake or a DACI decision.** Those are records of what someone believed at a moment; changing them destroys their value.
3. **Receive any personal information or data.
4. **Be listed as Accountable, Driver, or Approver** in TEAM.md or any DACI.

## The DDR Rule

Any AI output that is committed, in whole or in part, beyond a single-line suggestion, gets a DDR in `docs/` linked from the pull request description. Every pull request description ends with an AI Use line: None, or the DDR link.

## When We Disagree About AI Use

The owner of the affected file is the Driver. The Implementer is the Approver. The decision is recorded as a DACI.

## Standards

Code and document format rules are in STANDARDS.md. Tools and their crossings are in TOOLS.md. Read both before generating anything.
