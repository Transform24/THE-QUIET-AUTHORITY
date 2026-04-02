# Remote Trigger Registry

All Claude Remote Control triggers for Sanctuary Grace Ministry workflows.
Create each trigger via Claude Code (`/schedule` or `RemoteTrigger` tool) and record IDs here.

---

## Active Triggers

| # | Agent | Trigger ID | Schedule | Last Run | Status |
|---|-------|-----------|----------|----------|--------|
| 01 | Repurpose Agent | [ADD ID] | Manual | — | Pending setup |
| 02 | Pin Creation Agent | [ADD ID] | Manual | — | Pending setup |
| 03 | Storefront Sync | [ADD ID] | Every Monday 6:00 AM | — | Pending setup |
| 04 | Lead Tracker | [ADD ID] | On Formspree webhook | — | Pending setup |
| 05 | Weekly Report | [ADD ID] | Every Monday 7:00 AM | — | Pending setup |

---

## How to Create a Trigger

In Claude Code terminal:
```
/schedule
```
Then follow the prompts — give it the agent prompt from `workflows/agents/`.

Or use the RemoteTrigger tool directly:
```
Action: create
Name: [agent name]
Prompt: [paste prompt from agent file]
Schedule: [cron expression or "manual"]
```

---

## Cron Reference

| Schedule | Cron Expression |
|----------|----------------|
| Every Monday 7 AM | `0 7 * * 1` |
| Every Monday 6 AM | `0 6 * * 1` |
| Daily 9 AM | `0 9 * * *` |
| Manual only | (no cron — run trigger manually) |

---

## Webhook URLs (for Formspree + Stripe)

Once triggers are created, the run URL follows this pattern:
```
https://api.claude.ai/v1/code/triggers/[TRIGGER_ID]/run
```

Add this URL to:
- Formspree → Settings → Webhooks (for Agent 04)
- Stripe → Webhooks (for future payment events)
