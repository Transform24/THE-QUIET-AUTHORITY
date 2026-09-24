---
name: sanctuary-grace-consistency-sweep
description: "Runs the other five Sanctuary Grace checks (property-map, tool-stack-check, brand-check, flow-check, audit) across every live page in one pass instead of only the page being touched, so a fix made once actually reaches every gate and property it applies to."
---

# Sanctuary Grace: Consistency Sweep

The other five skills each protect one page at the moment it's built or edited. None of them protect the pages nobody happened to touch that day. Every repeat bug in this ministry's history traces back to that gap: a fix landed on Gate 1 and never reached Gates 2-6, a script was written for one gate and never for its siblings, a citation was corrected on one file and the live copy elsewhere kept the error. This skill closes that gap by looping the existing checks across the whole page list instead of trusting that a single-page fix propagated.

## When to run this, not just the other five

- Any time a fix touches a shared source (`_system/brand-tokens.md`/`.json`, a Worker constant, a citation, a scripture-anchor doc) rather than one page's own content.
- Any time Grace asks for a cross-property audit, a "what's actually live" check, or says something feels inconsistent across gates.
- NOT needed for a single new page build in isolation — the other five skills already cover that page on its own.

## The page list (update this list itself the moment a page is added or retired, first step of any sweep)

index.html, foyer.html, the-quiet-authority-foyer.html, the-secret-place-foyer.html, gate-zero.html, gate-one.html, gate-two.html, gate-three.html, gate-four.html, gate-five.html, gate-six.html, the-secret-place.html, secret-place-architecture-of-intimacy.html, secret-place-printable-cards.html, daily-sanctuary.html, library.html, restore-access.html, names-of-god.html, hebrew-names-of-god-reference-guide.html, lord-teach-us-to-pray.html, save-my-progress.html, renewal-engine.html, the four wound-profile pages (guilty-giver.html, depleted-survivor.html, striving-achiever.html, lost-wanderer.html), privacy.html, 404.html.

## The loop

For each page in the list, in order, without stopping to report mid-sweep:

1. Read the page's actual live/committed source, never a remembered version of it.
2. Run `sanctuary-grace-property-map` — confirm which property this page belongs to and that its own copy says so correctly.
3. Run `sanctuary-grace-tool-stack-check` — confirm nothing on the page depends on a retired or paused tool (Systeme.io, Beacons-as-primary, anything the tool-stack-check's own list flags as dead).
4. Run `sanctuary-grace-brand-check` — rendered colors/fonts against `_system/brand-tokens.json`, no em dash, every scripture KJV-flagged, correct voice, correct property name in the copy.
5. Run `sanctuary-grace-flow-check` if the page is a gate or checkout step.
6. Run `sanctuary-grace-audit`'s Playwright pass against the page.
7. Log every fail as one line in `_system/TASK_LOG.md`: page name, which check failed, what was wrong. Fix mechanical fails in the same pass. Log non-mechanical fails as open items, do not guess a fix.

Finish the full list before reporting anything back. One consolidated report at the end, grouped by which pages failed which check, not a page-by-page narration.

## Propagation

If the same fail shows up on more than one page, the bug is in a shared source file, not in each page individually. Fix the source once (`_system/brand-tokens.md`, the Worker constant, the architecture doc), then re-run only the pages that failed on that specific check, don't re-sweep the whole list twice. Confirm `_system/TASK_LOG.md` and the Registry artifact both reflect the fix before closing it out.
