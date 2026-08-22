# Make.com — Historical Record (confirmed dead, never actually running)

*Archived 2026-08-22. Kept per ICM convention. Do not treat anything below as current. Current status: `_system/status.md`.*

Earlier versions of `CLAUDE.md` described Make.com as "the automation layer" and claimed a specific webhook was "wired" and "fires on every assessment submit":

> `https://hook.us2.make.com/r4tscqqr8qzff82pr3dcxi1a3w5yn7xy` — fires with `name`, `email`, `profile_key`, `profile_name`, `source`.

This was confirmed dead in a prior session: **zero Make.com references exist anywhere in the actual running code.** It was never wired into `index.html`'s `submitAndReveal()` flow (which only calls Formspree, per `SITE-CONTEXT.md`). Zapier was also considered and explicitly never adopted.

Any future doc, agent output, or code comment claiming Make.com is live should be treated as stale and corrected.
