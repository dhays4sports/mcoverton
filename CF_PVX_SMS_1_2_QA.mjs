import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { mapSmsToPvx } from './server/sms-pvx-mapping-core.mjs';

const require = createRequire(import.meta.url);
const discovery = require('./assets/js/pvx-discovery.js');
const snapshot = require('./assets/js/pvx-snapshot-model.js');

const buyer = mapSmsToPvx({
  intent: 'buyer', conversationId: 'sms-live-buyer', propertyAddress: '100 Main St, San Jose, CA 95112',
  closingDate: '2026-09-05', occupancy: 'primary_home', autoReview: true, priority: 'rush',
  customerWords: [{ direction: 'inbound', body: 'Buying 100 Main and I need it quickly.' }]
});
assert.equal(buyer.discovery.answers.shoppingReason, 'buying_home');
assert.equal(buyer.discovery.answers.ownershipDuration, 'buying_now');
assert.deepEqual(buyer.discovery.prefilledQuestionIds.sort(), ['ownershipDuration', 'shoppingReason']);
assert.equal(buyer.discovery.currentQuestionId, 'improvementPriorities');
assert.equal(discovery.nextUnansweredQuestion(buyer.discovery, 'shoppingReason'), 'improvementPriorities');
assert.equal(discovery.nextUnansweredQuestion(buyer.discovery, 'improvementPriorities'), 'stayIntent');
assert.ok(discovery.QUESTIONS.find(question => question.id === 'ownershipDuration').options.some(option => option.value === 'buying_now'));
assert.equal(snapshot.labelFor('ownershipDuration', 'buying_now'), 'Buying the home now');
assert.equal(buyer.homeProfilePrefill.occupancy, 'primary_home');
assert.equal(buyer.homeProfilePrefill.sourceEvidence.occupancy, 'customer-reported');
assert.equal(buyer.homebuyerContext.closingDate, '2026-09-05');
assert.equal(buyer.bundleContext.requested, true);
assert.equal(buyer.operational.priority, 'rush');

const review = mapSmsToPvx({ intent: 'home_review', conversationId: 'sms-live-review', propertyAddress: '200 Pine St', reviewReason: 'renewal' });
assert.equal(review.discovery.answers.shoppingReason, 'renewal_increase');
assert.equal(review.discovery.currentQuestionId, 'improvementPriorities');
assert.equal(discovery.nextUnansweredQuestion(review.discovery, 'shoppingReason'), 'improvementPriorities');

const bundle = mapSmsToPvx({ intent: 'bundle', conversationId: 'sms-live-bundle', propertyAddress: '300 Oak St', occupancy: 'primary_home', bundleStatus: 'home_only' });
assert.equal(bundle.discovery.answers.shoppingReason, 'something_else');
assert.equal(bundle.bundleContext.requested, true);
assert.equal(bundle.bundleContext.bundleStatus, 'home_only');

for (const intent of ['other', '']) {
  const producer = mapSmsToPvx({ intent, conversationId: `sms-live-${intent || 'ambiguous'}` });
  assert.equal(producer.canEnterPvx, false);
  assert.equal(producer.producerSafeFallback, true);
}

const entrySource = fs.readFileSync('assets/js/pvx-entry.js', 'utf8');
const discoverySource = fs.readFileSync('assets/js/pvx-discovery.js', 'utf8');
const homeSource = fs.readFileSync('assets/js/pvx-home-profile-view.js', 'utf8');
assert.equal(entrySource.includes("normalized.city || 'Confirmed'"), false);
assert.equal(entrySource.includes("normalized.postalCode || '00000'"), false);
assert.equal(discoverySource.includes('Question ${index+1} of'), false);
assert.equal(discovery.validateCatalog().valid, true);
assert.ok(homeSource.includes("source:'customer_reported'"));
assert.ok(homeSource.includes('coveragefit_pvx_sms_bridge_v1'));
assert.equal(fs.readFileSync('assets/js/protection-score.js', 'utf8').includes('coveragefit_pvx_sms_bridge_v1'), false);
console.log(JSON.stringify({ sprint: 'CF-PVX-SMS-1.2', pass: true, checks: 30 }));
