# Integration: Formspree → MailerLite

Connect your site's lead capture forms to your MailerLite email list.
Every assessment submission, waitlist signup, and gallery signup
automatically adds the contact to MailerLite.

---

## Recommended Method: Zapier (Free)

**Why Zapier:** Your site is static (GitHub Pages). No backend server.
Zapier sits in the middle — Formspree fires, Zapier catches it, adds to MailerLite.
Free plan: 100 tasks/month = plenty until you hit 100+ submissions/month.

### Step-by-Step Setup

**BEFORE YOU START — gather these:**
- [ ] Formspree account login (formspree.io)
- [ ] MailerLite account login (mailerlite.com)
- [ ] Your MailerLite Group name (create one called "Quiet Authority Leads")
- [ ] Zapier account (zapier.com — free)

---

### Part 1: Set Up MailerLite Groups

1. Log into **mailerlite.com**
2. Go to **Subscribers → Groups**
3. Create these groups:
   - `Quiet Authority — Assessment`
   - `Quiet Authority — Circle Waitlist`
   - `Quiet Authority — Gallery Preview`
4. Note the Group IDs (you'll need them in Zapier)

---

### Part 2: Create the Zapier Zap

1. Go to **zapier.com → Create Zap**

**TRIGGER:**
- App: `Formspree`
- Event: `New Submission`
- Account: connect your Formspree account
- Form: select your form (ID: `xzdkgbbq`)
- Test trigger — submit a test form on your site first

**FILTER (optional but recommended):**
- Add a Filter step
- Condition: `source` contains `Assessment` (or whatever source field matches)
- This lets you route different form sources to different MailerLite groups

**ACTION:**
- App: `MailerLite`
- Event: `Create/Update Subscriber`
- Account: connect your MailerLite account
- Map fields:
  - Email → `{{email}}`
  - First Name → `{{name}}`
  - Group → `Quiet Authority — Assessment`
  - Custom field `silence_profile` → `{{profile}}`

2. **Test & Publish** the Zap

---

### Part 3: Create One Zap Per Form Source

You have 3 forms on the site. Create 3 Zaps (or one Zap with paths):

| Form Source | MailerLite Group |
|-------------|-----------------|
| `Assessment` (main form) | Quiet Authority — Assessment |
| `Circle of Silence Waitlist` | Quiet Authority — Circle Waitlist |
| `Gallery Wall Art Preview List` | Quiet Authority — Gallery Preview |

Each Zap filters by the `source` field in the Formspree submission.

---

### Part 4: Set Up MailerLite Welcome Sequence

Once subscribers land in MailerLite, trigger an automation:

1. Go to **MailerLite → Automations → Create Automation**
2. Trigger: `When subscriber joins group` → `Quiet Authority — Assessment`
3. Add emails:
   - Email 1 (immediately): Welcome + their Silence Profile reminder
   - Email 2 (day 3): Devotional or teaching related to their profile
   - Email 3 (day 7): Soft CTA to Beacons storefront or Circle of Silence

---

## Long-Term: Replace Formspree with MailerLite Embed

When you're ready to simplify further, replace the email capture form
in index.html with a MailerLite embedded form — direct to your list,
no Zapier needed.

The Beacons email embed is already on the site (line 647 in index.html).
MailerLite embed would replace the Formspree calls in:
- `submitEmail()` function — main assessment email capture
- `joinWaitlist()` function — Circle of Silence waitlist
- `joinGalleryList()` function — Gallery preview list

Instructions for that swap: see `workflows/agents/03-storefront-sync-agent.md`

---

## MailerLite Custom Fields to Create

Before setting up Zapier, add these custom fields in MailerLite:
(Subscribers → Fields → Add field)

| Field Name | Type | Source |
|-----------|------|--------|
| `silence_profile` | Text | From assessment result |
| `source` | Text | Which form they came from |
| `joined_date` | Date | Auto |

---

## Testing Checklist

- [ ] Submit the assessment with a test email
- [ ] Check Formspree dashboard — submission received
- [ ] Check Zapier task history — Zap fired
- [ ] Check MailerLite — subscriber added to correct group
- [ ] Check MailerLite — automation triggered
- [ ] Receive welcome email in test inbox
