import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const host = require('./assets/js/pvx-host-aware.js');
const events = require('./assets/js/pvx-consumer-events.js');
assert.equal(host.resolveMode({ hostname: 'review.408farmers.com', bridge: null }), '408farmers');
assert.equal(host.resolveMode({ hostname: 'coveragefit.com', bridge: null }), 'coveragefit');
assert.equal(host.resolveMode({ hostname: 'coveragefit.com', bridge: { entry: { source: '408farmers_web' } } }), '408farmers');
const safe = events.event('native_entry_selected', { entryType: 'buyer', routeKey: '/buyer/', phone: '4085551212', address: '100 Main' });
assert.equal('phone' in safe.detail, false);
assert.equal('address' in safe.detail, false);
assert.equal(safe.detail.entryType, 'buyer');
for (const page of ['start','discovery','refine','snapshot','continue','home-profile','policy','progress','web']) assert.ok(fs.readFileSync(`pvx/${page}/index.html`, 'utf8').includes('pvx-host-aware.js'), page);
assert.ok(fs.readFileSync('assets/css/pvx-experience-foundation.css', 'utf8').startsWith('@import url("/assets/css/pvx-host-aware.css")'));
console.log(JSON.stringify({ sprint: '408-CF-PVX-WEB-1.2', pass: true, checks: 17 }));

