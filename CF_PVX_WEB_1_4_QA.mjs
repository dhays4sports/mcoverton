import assert from 'node:assert/strict';
import { mapWebToPvx } from './server/web-pvx-mapping-core.mjs';
const buyer = mapWebToPvx({ entryType:'buyer', customerSelection:'buying_home', routePath:'/buyer/', propertyAddress:'100 Main St', closingDate:'2026-09-05', occupancy:'primary_home', partnerId:'sample-realty', partnerName:'Sample Realty', rush:true });
assert.equal(buyer.discovery.answers.shoppingReason, 'buying_home');
assert.equal(buyer.discovery.answers.ownershipDuration, 'buying_now');
assert.equal(buyer.context.buyer.closingDate, '2026-09-05');
assert.equal(buyer.context.buyer.occupancy, 'primary_home');
assert.equal(buyer.context.buyer.rush, true);
assert.equal(buyer.attribution.partnerId, 'sample-realty');
assert.equal(buyer.entry.address.source, 'customer-reported');
assert.equal(buyer.entry.address.confirmed, false);
assert.equal(buyer.consent.contact, false);
console.log(JSON.stringify({ sprint: '408-CF-PVX-WEB-1.4', pass: true, checks: 9 }));

