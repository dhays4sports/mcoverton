import assert from 'node:assert/strict';
import {
  createOrReusePvxWebJourney, handlePvxWebBootstrap, handlePvxWebJourney,
  PVX_WEB_RESUME_COOKIE, pvxWebJourneyKey
} from './server/pvx-web-journey-core.mjs';

class Store {
  constructor() { this.map = new Map(); }
  async get(key) { return structuredClone(this.map.get(String(key)) || null); }
  async setJSON(key, value, options = {}) { if (options.onlyIfNew && this.map.has(String(key))) throw new Error('duplicate'); this.map.set(String(key), structuredClone(value)); }
}

const store = new Store();
const payload = { bootstrap_id: 'pvxb_abcdefghijklmnop', entry_type: 'buyer', customer_selection: 'buying_home', route_path: '/buyer/' };
const first = await createOrReusePvxWebJourney(payload, { store, sourceOrigin: 'https://408farmers.com', now: new Date('2026-08-21T00:00:00Z') });
const second = await createOrReusePvxWebJourney(payload, { store, sourceOrigin: 'https://408farmers.com', now: new Date('2026-08-21T00:01:00Z') });
assert.equal(first.record.journeyId, second.record.journeyId);
assert.equal(second.reused, true);
assert.ok(await store.get(await pvxWebJourneyKey(first.token)));

const request = new Request('https://review.408farmers.com/api/pvx/web-bootstrap', {
  method: 'POST',
  headers: { Origin: 'https://408farmers.com', 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ bootstrap_id: 'pvxb_qrstuvwxyzABCDEF', entry_type: 'home', customer_selection: 'review_owned_home' })
});
const response = await handlePvxWebBootstrap(request, { store, now: new Date('2026-08-21T00:02:00Z') });
assert.equal(response.status, 303);
assert.equal(response.headers.get('location'), '/pvx/web/');
assert.match(response.headers.get('set-cookie') || '', new RegExp(`${PVX_WEB_RESUME_COOKIE}=pvxw_`));
assert.match(response.headers.get('set-cookie') || '', /HttpOnly; Secure; SameSite=Lax/);
assert.equal(response.headers.get('location').includes('home'), false);

const rejected = await handlePvxWebBootstrap(new Request('https://review.408farmers.com/api/pvx/web-bootstrap', {
  method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(payload)
}), { store });
assert.equal(rejected.status, 403);

const cookie = response.headers.get('set-cookie').split(';')[0];
const load = await handlePvxWebJourney(new Request('https://review.408farmers.com/api/pvx/web-journey', {
  method: 'POST', headers: { Origin: 'https://review.408farmers.com', Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'load' })
}), { store, now: new Date('2026-08-21T00:03:00Z') });
assert.equal(load.status, 200);
const loaded = await load.json();
assert.equal(loaded.journey.seed.consent.contact, false);
assert.equal(loaded.journey.seed.semantics.discoveryAffectsProtectionScore, false);
assert.equal(JSON.stringify(loaded).includes('evil.example'), false);

console.log(JSON.stringify({ sprint: '408-CF-PVX-WEB-1.1', pass: true, checks: 15 }));

