# /ship — Full Ship Sequence

Run the complete ship sequence for the current branch. Execute each step in order; abort and report if any step fails.

## Steps

1. **Secret scan** — grep the current diff for `sk_live_`, `sk_test_`, `rk_live_`, `API_KEY=`, `SECRET=`. If any match found, stop immediately and warn the user to remove the secret before proceeding.

2. **Tests** — run `node test-flow.mjs` if it exists. Abort if any test fails. Report pass count.

3. **Mobile / UX audit** — review every changed screen against the checklist in CLAUDE.md Section 8:
   - Body text ≥ 16px on mobile, secondary ≥ 14px
   - No duplicate image src attributes in product cards
   - New-user flow intact (landing → questions → email → reveal → results)
   - Returning-user flow intact (gate set → skip to results)
   - Shop tab: Stripe products before Amazon
   Report each item as PASS or FAIL. Fix any FAILs before continuing.

4. **Rebase** — fetch `origin/main` and rebase the current branch. Resolve any conflicts. Report if rebase was clean or if conflicts were resolved.

5. **Commit** — stage all changes and commit with a clear conventional message describing what changed and why.

6. **Push** — `git push -u origin <branch>`.

7. **PR** — open a pull request to `main` with:
   - Title: concise (under 70 chars)
   - Body: summary bullets + mobile/UX audit results + test results

8. **Merge** — squash merge the PR.

9. **Confirm** — report the merge SHA and live URL: `https://transform24.github.io/THE-QUIET-AUTHORITY/`
