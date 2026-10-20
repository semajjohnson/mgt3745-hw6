# TOOLS.md

One row per external service. No credentials in this file, ever.

| Service | Trusted with | Credentials live | Data crossing the boundary | Switching cost |
|---|---|---|---|---|
| GitHub | The project repository, source files, issues, pull requests, reviews, and commit history | Each member's own GitHub account; no credentials in the repository | Committed material and collaboration activity are stored by GitHub in a public repository. Aashi Mehta is the Implementer's contact for repository settings. | Low to moderate: clone the Git repository and move collaboration to another Git host. |
| GitHub Copilot | Project files and prompts explicitly supplied for drafting or review | Each user's own GitHub account; no credentials in the repository | This drafting task supplied project documentation for critiquing and review. Do not provide secrets or real-user private data. A human artifact owner must verify suggestions. | Low: turn it off and continue editing directly. |
| bolt.new / StackBlitz | Only the approved `context/FEATURES.md` and one specification-probe prompt | Rishika's StackBlitz account; no credentials in the repository | FEATURES.md crossed to bolt.new and StackBlitz on 2026-10-07 for the probe; no customer data, synthetic or otherwise, was included. Rishika is accountable." | Low: document assumptions and exclusions manually without generated output. |
| Claude (chat) | Context files first drafts and critique | Each member's own account | Only files from /context and /docs are pasted into Claude, by the member doing the pasting, who is accountable for what they paste. | Low: stop using it |
