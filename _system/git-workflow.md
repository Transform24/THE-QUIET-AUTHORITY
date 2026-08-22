# Git Workflow

- **Always work on `main` branch** for routine work. Never create feature branches unless explicitly permitted, or per the branch protocol below.
- **Never switch branches or directories** without asking first.
- **All work happens in the repo root.** No navigation unless explicitly requested.
- **Single source of truth:** `main` branch only. All commits go directly to `main` unless following the branch protocol below.
- If a feature branch exists, merge it into `main` immediately and delete it.

## Branch protocol (for PR-based changes)

- Branch naming: `claude/[task]-[4-char-id]` → PR → squash merge → never force-push main.
- After every squash merge: immediately rebase any open dependent branches onto `origin/main` before opening the next PR — prevents duplicate-commit merge conflicts.
- Before opening a PR: always run `git fetch origin && git rebase origin/main` to surface conflicts early.
- When a branch conflicts with already-squash-merged commits: cherry-pick only the new commits onto a fresh branch from main rather than fighting the rebase.
- Before opening a PR for a user-facing UI change: complete the Mobile / UX Checklist in `SITE-CONTEXT.md` and include results in the PR body. Never skip it to ship faster.
