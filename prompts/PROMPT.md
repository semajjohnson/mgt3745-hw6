# PROMPT.md

The exact text both builders received, unchanged between them. Paste it below.

---

Build this feature as a working web page. Use only HTML, CSS, and JavaScript with no framework and no dependencies, and follow the style tokens and refusals below.

## Feature: F2, Create a trip and invite members

F2-1. WHEN a signed-in person creates a trip with a name, the app shall make them its creator and give them an invite link.

F2-2. IF someone tries to join a trip without a valid invite link, THEN the app shall refuse and show no trip details.

F2-3. The app shall give each trip one reusable invite link.

## Who this is for

**Profile 1.** A full-time working professional who travels casually. He shares trip moments by texting friends directly, many times a day while traveling, instead of posting to social media. He sends photos, short stories, and places he loved, in the moment. He has little patience for long reviews or blogging.

Job statement: when something funny or worth remembering happens on a trip, I want to share it with my friends right away without the pressure of a public post, so I can bring them along on what I am doing.

Success looks like: his friends on the trip and at home see the moment the same day, and it stays together with the rest of the trip instead of scattered across text threads.

## Style

Tokens: text #172B40, muted #46586B, surface #F7F9FB, primary #123552, on-primary #FFFFFF, accent #B16D00, error #922020, success #1D4D2B. Body font Arial, Helvetica, sans-serif. Minimum font size 14px. Spacing in multiples of 8px. Corner radius 4px. Content width capped at 44rem. Minimum tap target 44px.

The accent color is used only for focus outlines, never for text.

Refusals:
1. No color-only signaling. Every error and confirmation carries words, not just a red border.
2. No icon-only destructive buttons. A button that removes something says what it does.
3. No stylesheets, fonts, or scripts from another origin. Everything is local.

---

## Retries

None.

---
