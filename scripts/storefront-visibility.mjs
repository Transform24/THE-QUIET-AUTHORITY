#!/usr/bin/env node
// Storefront visibility checker.
//   node scripts/storefront-visibility.mjs --check      proves the rules, writes nothing
//   node scripts/storefront-visibility.mjs --activate   sets token_activated to true, only if
//                                                       SANCTUARY_GRACE_KEY is set and Printful accepts it
// The key value is read from the environment only. It is never printed or saved.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const regPath = path.join(root, 'storefront-visibility.json');
const STATUSES = ['complete', 'draft', 'unverified'];
const EM = String.fromCharCode(0x2014);

function fail(msg) { console.error('FAIL: ' + msg); process.exit(1); }
function loadReg() {
  try { return JSON.parse(fs.readFileSync(regPath, 'utf8')); } catch (e) { fail('storefront-visibility.json is missing or not valid JSON'); }
}

function pagesWithItems() {
  const out = [];
  const skip = new Set(['node_modules', '.git', '_archive', 'out', 'public']);
  (function walk(d) {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      if (skip.has(f.name)) continue;
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(html|js)$/.test(f.name)) out.push(p);
    }
  })(root);
  return out;
}

function check() {
  const reg = loadReg();
  const raw = fs.readFileSync(regPath, 'utf8');
  if (raw.includes(EM)) fail('the registry contains an em dash');
  if (typeof reg.token_activated !== 'boolean') fail('token_activated must be true or false');
  if (reg.token_secret_name !== 'SANCTUARY_GRACE_KEY') fail('token_secret_name must be SANCTUARY_GRACE_KEY');
  if (/(sk_live_|sk_test_|rk_live_|ghp_|github_pat_)/.test(raw)) fail('a secret pattern is in the registry');
  const ids = Object.keys(reg.items || {});
  if (!ids.length) fail('no items registered');
  for (const id of ids) {
    const it = reg.items[id];
    if (!STATUSES.includes(it.status)) fail(id + ': status must be one of ' + STATUSES.join(', '));
    if (typeof it.needs_token !== 'boolean') fail(id + ': needs_token must be true or false');
  }
  // every tag in a page or script must be registered, and every registered item must be used
  const used = new Set();
  const tagged = [];
  for (const f of pagesWithItems()) {
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/data-shop-item="([a-z0-9-]+)"/g)) { used.add(m[1]); tagged.push([path.relative(root, f), m[1]]); }
    if (path.basename(f) === 'manifest.js') for (const m of s.matchAll(/shop:\s*'([a-z0-9-]+)'/g)) { used.add(m[1]); tagged.push([path.relative(root, f), m[1]]); }
  }
  for (const [f, id] of tagged) if (!reg.items[id]) fail(f + ': "' + id + '" is not in the registry, so it would stay hidden');
  for (const id of ids) if (!used.has(id)) fail(id + ' is registered but no page uses it');
  // the page script must keep the safe behaviour
  const js = fs.readFileSync(path.join(root, 'storefront-filter.js'), 'utf8');
  if (!/status !== 'complete'/.test(js) || !/needs_token && REG.token_activated !== true/.test(js)) fail('storefront-filter.js no longer enforces the rules');
  if (js.includes(EM)) fail('storefront-filter.js contains an em dash');
  // simulate the rule for each item
  const show = (it, token) => it.status === 'complete' && (!it.needs_token || token === true);
  const hiddenNow = ids.filter(id => !show(reg.items[id], reg.token_activated));
  const afterKey = ids.filter(id => !show(reg.items[id], true));
  console.log('OK: storefront visibility is valid');
  console.log('    items: ' + ids.length + ' registered, ' + (ids.length - hiddenNow.length) + ' visible, ' + hiddenNow.length + ' hidden now');
  console.log('    token_activated: ' + reg.token_activated + ' (hidden after the key is active: ' + afterKey.length + ', until marked complete)');
  console.log('    tags found in pages: ' + tagged.length + ', all registered');
}

async function activate() {
  const key = process.env.SANCTUARY_GRACE_KEY;
  if (!key) fail('SANCTUARY_GRACE_KEY is not set, so nothing was changed');
  let status;
  try {
    const r = await fetch('https://api.printful.com/v2/stores', { headers: { Authorization: 'Bearer ' + key } });
    status = r.status;
  } catch (e) { fail('could not reach Printful, so nothing was changed'); }
  if (status !== 200) fail('Printful answered ' + status + ', so nothing was changed');
  const reg = loadReg();
  reg.token_activated = true;
  fs.writeFileSync(regPath, JSON.stringify(reg, null, 2) + '\n');
  console.log('OK: Printful accepted the key. token_activated is now true. Items still show only when marked complete.');
}

const arg = process.argv[2];
if (arg === '--check') check();
else if (arg === '--activate') await activate();
else { console.log('Use --check or --activate'); process.exit(2); }
