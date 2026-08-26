import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mapWebToPvx, validateWebPvxMapping } from './server/web-pvx-mapping-core.mjs';

const buyer = mapWebToPvx({ entryType: 'buyer', customerSelection: 'buying_home', routePath: '/buyer/', campaign: 'partner-card' });
assert.equal(validateWebPvxMapping(buyer).valid, true);
assert.equal(buyer.discovery.answers.shoppingReason, 'buying_home');
assert.equal(buyer.discovery.answers.ownershipDuration, 'buying_now');
assert.equal(buyer.consent.contact, false);
assert.equal(buyer.semantics.discoveryAffectsProtectionScore, false);

const campaignOnly = mapWebToPvx({ entryType: 'flyer', campaign: 'rate-flyer', routePath: '/home/qr/95124/rate/' });
assert.deepEqual(campaignOnly.discovery.answers, {});
assert.equal(campaignOnly.attribution.campaign, 'rate-flyer');
assert.equal(campaignOnly.semantics.campaignContextIsDiscoveryAnswer, false);

const professional = mapWebToPvx({ entryType: 'professional', professionalProgram: 'healthcare', occupation: 'Nurse', customerSelection: 'review_professional_home' });
assert.equal(professional.context.professional.active, true);
assert.equal(professional.context.professional.eligibilityDetermined, false);
assert.deepEqual(professional.discovery.answers, {});

const renter = mapWebToPvx({ entryType: 'home_auto', customerSelection: 'renter' });
assert.equal(renter.canEnterPvx, false);
assert.equal(renter.fallbackDestination, '/contact/?intent=renters');

assert.ok(fs.existsSync('CF-PVX-WEB-MAPPING-CONTRACT.json'));
assert.ok(fs.existsSync('CF_PVX_WEB_PROTECTED_HASH_BASELINE.sha256'));
console.log(JSON.stringify({ sprint: '408-CF-PVX-WEB-1.0', pass: true, checks: 16 }));

