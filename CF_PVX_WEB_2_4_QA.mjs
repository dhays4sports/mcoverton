import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { mapWebToPvx, validateWebPvxMapping } from './server/web-pvx-mapping-core.mjs';
import { authorizeIdentityReconciliation, reconcilePvxField } from './server/pvx-web-reconciliation-core.mjs';
import { createPvxWebResumeToken, createPvxWebReturnToken, pvxWebResumeCookie, PVX_WEB_RESUME_PATTERN, PVX_WEB_RETURN_PATTERN } from './server/pvx-web-journey-core.mjs';
import { projectUnifiedProducerRecord } from './server/pvx-unified-producer-record-core.mjs';

const require = createRequire(import.meta.url);
const read = file => fs.readFileSync(file, 'utf8');
const version = read('VERSION').trim();
assert.match(version, /^3\.20\.\d+$/);
assert.ok(Number(version.split('.')[2]) >= 150);
assert.equal(JSON.parse(read('package.json')).version, version);

const campaign = mapWebToPvx({ entry_type:'qr', route_path:'/home/qr/94539/rate/', campaign_id:'home_94539_rate', campaign_zip:'94539', customer_selection:'start_snapshot' });
assert.equal(validateWebPvxMapping(campaign).valid, true);
assert.deepEqual(campaign.discovery.answers, {});
assert.equal(campaign.semantics.campaignContextIsDiscoveryAnswer, false);
assert.equal(campaign.semantics.pageRouteIsDiscoveryAnswer, false);
assert.equal(campaign.semantics.advisoryReviewTopicIsRecommendation, false);
assert.equal(campaign.semantics.topicResponseIsRecommendationResponse, false);
assert.equal(campaign.semantics.snapshotSavedIsContactPermission, false);
assert.equal(campaign.semantics.smsPermissionIsCallOrEmailPermission, false);
assert.equal(campaign.semantics.quoteReadinessIsCarrierEligibility, false);
assert.equal(campaign.semantics.discoveryAffectsProtectionScore, false);
assert.equal(campaign.semantics.occupationProvesEligibility, false);
assert.equal(campaign.semantics.bindAuthorized, false);
assert.deepEqual(campaign.consent, { reportSaved:false, contact:false, sms:false, call:false, email:false, knownContactIsPermission:false });
const professional = mapWebToPvx({ entry_type:'professional', professional_program:'teachers', customer_selection:'review_professional_home' });
assert.equal(professional.context.professional.eligibilityDetermined, false);
assert.equal(professional.context.professional.discountDetermined, false);

const identity = authorizeIdentityReconciliation({ phoneMatch:true, emailMatch:true });
assert.equal(identity.merge, false);
assert.equal(identity.contactMatchOnly, true);
assert.equal(identity.silentMerge, false);
const conflict = reconcilePvxField('property.address', [{source:'discovery',value:'A',evidenceStatus:'customer_reported'},{source:'home_profile',value:'B',evidenceStatus:'customer_reported'}]);
assert.equal(conflict.status, 'conflict_needs_confirmation');

const resumeToken = createPvxWebResumeToken();
const returnToken = createPvxWebReturnToken();
assert.match(resumeToken, PVX_WEB_RESUME_PATTERN);
assert.match(returnToken, PVX_WEB_RETURN_PATTERN);
const cookie = pvxWebResumeCookie(resumeToken);
for (const marker of ['HttpOnly','Secure','SameSite=Lax']) assert.match(cookie, new RegExp(marker));

const snapshot = require('./assets/js/pvx-snapshot-model.js').derive({answers:{}}, []);
assert.equal(snapshot.contactRequiredToView, false);
assert.equal(snapshot.guardrails.policyDeficiencyFound, false);
assert.equal(snapshot.guardrails.protectionScoreCreated, false);
assert.deepEqual(snapshot.recommendations, []);
const projected = projectUnifiedProducerRecord({checkpointId:'c',consent:{reportSaved:true,contact:false},contact:{name:'Private'},snapshot,authorization:{bindAuthorized:false}}, null, null);
assert.deepEqual(projected.contact, {});
assert.equal(projected.ownership.silentlyReassigned, false);

const checkpoint = read('server/pvx-checkpoint-core.mjs');
assert.match(checkpoint, /action === 'contact'/);
assert.match(checkpoint, /report_save_required/);
assert.match(checkpoint, /authoritative_sms_suppression/);
assert.match(checkpoint, /bindAuthorized:\s*false/);
const upload = read('server/pvx-policy-intake-core.mjs');
for (const marker of ['MAX_FILE','MAX_TOTAL','file_type_rejected','tokenHash','private']) assert.match(upload, new RegExp(marker, 'i'));
const producer = read('server/pvx-unified-producer-record-core.mjs');
assert.match(producer, /authorizeProducer/);
assert.match(read('server/consultation-inbox-core.mjs'), /headers\.get\('authorization'\)/);
assert.match(producer, /Cache-Control.*no-store/);
assert.match(read('server/pvx-web-journey-core.mjs'), /frame-ancestors 'none'/);
console.log(JSON.stringify({ sprint:'408-CF-PVX-WEB-2.4', pass:true, checks:38 }));
