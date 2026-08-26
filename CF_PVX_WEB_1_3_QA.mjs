import assert from 'node:assert/strict';
import { mapWebToPvx } from './server/web-pvx-mapping-core.mjs';
const homepage = mapWebToPvx({ entryType: 'homepage', customerSelection: 'start_snapshot', routePath: '/' });
assert.deepEqual(homepage.discovery.answers, {});
assert.equal(homepage.consent.contact, false);
const home = mapWebToPvx({ entryType: 'home', customerSelection: 'review_owned_home', routePath: '/home/' });
assert.deepEqual(home.discovery.answers, {});
assert.equal(home.entry.customerSelection, 'review_owned_home');
assert.equal(home.semantics.pageRouteIsDiscoveryAnswer, false);
assert.equal(home.semantics.discoveryAffectsProtectionScore, false);
console.log(JSON.stringify({ sprint: '408-CF-PVX-WEB-1.3', pass: true, checks: 7 }));

