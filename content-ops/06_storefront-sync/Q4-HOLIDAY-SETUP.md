# Q4 Holiday Setup Checklist
*Sanctuary Grace Ministry. Written 2026-10-12. Follow the parts in order, one step at a time. Part 1 is yours to do. Parts 2 to 4 record what was checked.*

## Part 1. Save the Printful key as a GitHub secret (Grace does this)

Why: the storefront filter keeps unfinished items hidden until the Printful key is saved and accepted. The key lives only in GitHub. It is never pasted into chat and never written into a file.

**A. Copy the token from Printful**
1. Open `https://developers.printful.com` and sign in with the same login you use for the Printful dashboard.
2. Open the page where tokens are made. It is usually called Tokens or Private tokens. Printful moves its menus now and then, so follow the wording on the page.
3. Choose to create a new token.
4. Name it `Sanctuary Grace`.
5. Choose the store `Sanctuary Grace Shop`.
6. Give it read access only: products, orders and store information. Do not tick anything that can change or delete.
7. Create it. Printful shows the token one time. Click the copy button. Leave that browser tab open until step B is done.

**B. Save it in GitHub**
1. Open `https://github.com/Transform24/THE-QUIET-AUTHORITY`.
2. Click Settings (the top row of tabs, far right).
3. On the left, click Secrets and variables, then Actions.
4. Click the green New repository secret button.
5. In the Name box, type exactly: `SANCTUARY_GRACE_KEY`
6. In the Secret box, paste the token you copied.
7. Click Add secret.
8. You will see `SANCTUARY_GRACE_KEY` in the list with no value shown. That is correct. GitHub never shows a value again.
9. Close the Printful tab.

**C. Tell Claude it is saved**
Say only: "The key is saved." Do not paste the key. If a key is ever pasted into chat, stop, delete it at Printful and make a new one.

**D. What happens next**
1. Claude runs `node scripts/storefront-visibility.mjs --activate` from a GitHub Action. It checks that Printful accepts the key and then sets `token_activated` to true in `storefront-visibility.json`. This Action is not built yet. Claude will build it when you say the key is saved, and will ask you first.
2. Activating the key does not show anything by itself. An item appears only when its status in `storefront-visibility.json` is changed to `complete`, after it passes the brand check.

**One thing to know before you start**
The 2026-09-18 Printful handoff note in Drive says the Quick Store has no product API. If that is still true, the key may let us read orders and store details but not the product list. Claude will report plainly what the key can and cannot read. The hiding rule works either way, because it does not depend on the product list.

## Part 2. Security audit (read from Cloudflare on 2026-10-12)

| Check | Result |
|---|---|
| Cloudflare zone `sanctuary-grace.com` | Active, full setup, not paused |
| SSL mode | Full |
| Always Use HTTPS | On |
| Minimum TLS | 1.2 |
| Automatic HTTPS rewrites | On |
| Website addresses (four A records and `www`) | All proxied, pointing to GitHub Pages |
| MailerLite sign key (`litesrv._domainkey`) | Present, not proxied (correct) |
| SPF, MailerLite verification, Cloudflare mail key | Present, one SPF record |
| DMARC | Present, monitoring only (`p=none`) |
| Worker `lively-dew-924c` secret names | The five in the blueprint, and no others: `MAILERLITE_API_KEY`, `RESTORE_ACCESS_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_TEST_SECRET_KEY`, `TWWP_SEED_SECRET` |
| Raw keys inside the three Worker scripts read | None found |
| Raw keys in the repository (all files) | None found |
| `.env` ignored by git | Yes |
| Worker routes | 9: gates one to five and `_sgcheck` (sg-gates), `how-to-pray.html` and `_hubcheck` (sg-hubs), and `shop.sanctuary-grace.com/*` (wilderness-shop) |

What was read, and what was not:
- Only names were read for secrets. No secret value was read or printed.
- GitHub Actions secrets cannot be read from here. The workflows ask for these names: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GH_SECRETS_PAT`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `IG_DEFAULT_IMAGE_URL`, `PINTEREST_ACCESS_TOKEN`, `PINTEREST_APP_ID`, `PINTEREST_APP_SECRET`, `PINTEREST_REFRESH_TOKEN`, `SUBSTACK_COOKIE_ID`, `YOUTUBE_API_KEY`, `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`. Whether each one exists and is still valid is for you to check in GitHub Settings, Secrets and variables, Actions.
- `SANCTUARY_GRACE_KEY` is not read by any workflow yet. It will appear in that list after Part 1.

Things to look at:
1. `shop.sanctuary-grace.com` is served by a Cloudflare Worker named `wilderness-shop`. It is not in any of the three repositories, so its pages cannot be edited or filtered from here. The blueprint does not mention this route yet.
2. One em dash was found inside the `lively-dew-924c` Worker script. It is outside the repository, so it was left alone.
3. DMARC is still monitoring only.

## Part 3. Carrier note (October 12, 2026)
UPS Mail Innovations is recorded as the wall art carrier setting from October 12, 2026, as you told us. It could not be confirmed from here because the Printful dashboard is not reachable. Please check it once: Printful, Settings, Shipping, and look for UPS Mail Innovations on the wall art products. Then tell Claude "carrier confirmed" and the note in `_system/integrations.md` will be marked confirmed.

## Part 4. What the filter does (so nothing is a surprise)
- `storefront-visibility.json` lists every storefront item and its status. `storefront-filter.js` hides any item that is not `complete`.
- Items that need the Printful key also stay hidden until the key is active.
- Today 17 wall art pages are `complete` and 3 Printful shop links are `unverified`: the Overflow apparel button and the Pour It Out tote button on `the-secret-place-foyer.html`, and the Sanctuary Grace Shop line in the Packing List (`manifest.js`).
- The brief mentioned 42 unfinished merchandise templates. Those 42 are not in the repository, in the Cloudflare Worker scripts or in Drive, so they cannot be counted here. Only the 3 shop links above were found and hidden. Any other item is added to the list by giving it a `data-shop-item` name and an entry in the registry.
- Nothing is deleted or moved. Product files, Printful records and the Canva monogram files are not touched. Only what a visitor sees changes.
- To check the rules: `node scripts/storefront-visibility.mjs --check`.
