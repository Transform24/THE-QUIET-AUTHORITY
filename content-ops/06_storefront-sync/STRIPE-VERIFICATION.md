# Stripe Link Verification
*Checked 2026-10-12 from the repository and from Cloudflare. Stripe itself could not be opened.*

## What could and could not be checked
- The Stripe connection in this session is not signed in, and the checkout addresses cannot be opened from the cloud environment. So no link was clicked live and no Stripe account setting was read.
- Live checks of price and status are Grace's: Stripe dashboard, Payment links.
- API keys: the Worker `lively-dew-924c` holds `STRIPE_SECRET_KEY` and `STRIPE_TEST_SECRET_KEY`. Only the names were read. Whether the two keys belong to the same account as the links below can only be confirmed in Stripe.

## Front door links (gates), page against smoke test
All six match exactly. The daily smoke test expects these values, and each gate page carries the same one.

| Gate | Page | Link ending |
|---|---|---|
| 1 | `gate-one.html` | `fZu4gz18I5C11Iw0sacQU0E` |
| 2 | `gate-two.html` | `6oU3cv8Bac0pcna0sacQU0x` |
| 3 | `gate-three.html` | `9B600j9FefcB0EscaScQU0y` |
| 4 | `gate-four.html` | `dRmdR9g3CfcB72Qgr8cQU0z` |
| 5 | `gate-five.html` | `6oU00j4kU9Sh3QE7UCcQU0A` |
| 6 | `gate-six.html` | `eVq8wP8Ba0hHgDqej0cQU0B` |

## Other Stripe links in use
- Digital art download, $29.99: `library.html`, ending `3cIcN5cRqfcB1Iwgr8cQU0D`.
- The Woman Who Pours, `the-woman-who-pours.html`, ending `cNi14n6t2d4t2MAa2KcQU0G`.
- Names and Attributes ebook, `names-and-attributes-ebook.html`, ending `bJecN5dVu6G50Es2AicQU0H`.
- Study blueprints, `secret-place-architecture-of-intimacy.html` and `manifest.js`, ending `6oU8wPbNmggFevigr8cQU0F`.
- Weekly devotional and book links on `discover-your-profile.html` are the same as `circle-of-silence/products.md` and the product registry.

## The old Gate One link
- Retired link: `eVqfZh8Ba8Od0Es8YGcQU0w`.
- On the website: no page carries it. The gate page carries the current link.
- Two Workers still contain it on purpose. `sg-gates` swaps it for the current link if a stored page still has it. `lively-dew-924c` keeps it in its purchase check so that people who bought through it keep their access. Removing it there would lock out earlier buyers.
- In Stripe: the 2026-10-08 record says it is still active. It could not be checked from here. Deactivating it in Stripe is Grace's step, and is safe for the site because no page shows it.
- Two records still listed it as the live link. Both now name the current link and mark the old one retired: `circle-of-silence/gate-1-hakria.md` and `circle-of-silence/products.md`.

## Legacy redirects cleaned
- No checkout redirect through Beacons, Systeme.io or Make.com remains in a public page or script. See `content-ops/06_marketing_ops/MAILERLITE-INTEGRATION.md` and `_system/integrations.md`.

## Not verified (needs Grace)
1. That each link above is active and shows the right price in Stripe.
2. That the two Stripe keys in the Worker belong to the connected account.
3. That the old Gate One link is deactivated.
