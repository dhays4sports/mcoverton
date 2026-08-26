import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mapSmsToPvx, validateSmsPvxMapping, SMS_PVX_MAPPING_CONTRACT } from './server/sms-pvx-mapping-core.mjs';

const buyer = mapSmsToPvx({
  intent: 'buyer', conversationId: 'sms-live-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', propertyAddress: '100 Main St, San Jose, CA 95112',
  closingDate: '2026-09-05', occupancy: 'primary_home', autoReview: true, rushRequested: true,
  mobile: '+14085551212', smsConsent: { status: 'active', providerStatus: 'unknown' }
});
assert.equal(buyer.contractId, SMS_PVX_MAPPING_CONTRACT);
assert.equal(buyer.destination, '/pvx/start/');
assert.equal(buyer.discovery.answers.shoppingReason, 'buying_home');
assert.equal(buyer.discovery.answers.ownershipDuration, 'buying_now');
assert.equal(buyer.discovery.currentQuestionId, 'improvementPriorities');
assert.equal(buyer.contact.preferredMethod, 'text');
assert.equal(buyer.contact.contactConsent, false);
assert.equal(buyer.homeProfilePrefill.sourceEvidence.occupancy, 'customer-reported');
assert.equal(buyer.operational.priority, 'rush');
assert.equal(validateSmsPvxMapping(buyer).valid, true);

const home = mapSmsToPvx({ intent: 'home_review', conversationId: 'sms-live-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', propertyAddress: '200 Pine St, San Jose, CA 95113', reviewReason: 'price' });
assert.equal(home.discovery.answers.shoppingReason, 'comparison');
assert.equal(home.discovery.currentQuestionId, 'improvementPriorities');
assert.equal(validateSmsPvxMapping(home).valid, true);

const bundle = mapSmsToPvx({ intent: 'bundle', conversationId: 'sms-live-cccccccccccccccccccccccccccccccc', propertyAddress: '300 Oak St, San Jose, CA 95114', occupancy: 'primary_home', bundleStatus: 'both_insured' });
assert.equal(bundle.bundleContext.requested, true);
assert.equal(bundle.discovery.answers.shoppingReason, 'something_else');

const other = mapSmsToPvx({ intent: 'other', conversationId: 'sms-live-dddddddddddddddddddddddddddddddd', requestCategory: 'life' });
assert.equal(other.canEnterPvx, false);
assert.equal(other.producerSafeFallback, true);
assert.equal(other.destination, '');
assert.equal(validateSmsPvxMapping(other).valid, true);

assert.equal(fs.readFileSync('server/ringcentral-client.mjs','utf8').includes('CF-PVX-SMS'), false);
assert.equal(fs.readFileSync('server/ringcentral-sms-connection-core.mjs','utf8').includes('CF-PVX-SMS'), false);
assert.equal(fs.readFileSync('server/sms-conversation-core.mjs','utf8').includes('CF-PVX-SMS'), false);
console.log(JSON.stringify({ sprint: 'CF-PVX-SMS-1.0', pass: true, checks: 20 }));
