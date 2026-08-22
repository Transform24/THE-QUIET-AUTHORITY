# Subagent Permissions

- Project-level permissions live in `.claude/settings.json` (checked into repo) — subagents inherit these automatically.
- Local user settings (`settings.local.json`, gitignored) are NOT inherited by subagents — never put required permissions there.
- When a subagent is denied a tool (e.g., Drive download, WebFetch), add it to `.claude/settings.json` under `permissions.allow` and retry.
- Current project permissions: `mcp__9b844449__download_file_content` (Google Drive downloads).
- When spawning a subagent for Drive work, confirm `.claude/settings.json` has the permission before dispatching.
