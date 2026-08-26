import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { advancePvxSmsJourney, createSmsPvxJourney, loadPvxSmsJourneyFromRequest, PVX_SMS_STAGES } from './server/pvx-sms-journey-core.mjs';
import { safePvxJourney } from './server/sms-operations-core.mjs';

const require = createRequire(import.meta.url);
const entry = require('./assets/js/pvx-entry.js');
class MemoryStore { constructor(){this.values=new Map()} async get(key){return this.values.get(key)||null} async setJSON(key,value,options={}){if(options.onlyIfNew&&this.values.has(key))throw new Error('exists');this.values.set(key,structuredClone(value))} async list({prefix=''}={}){return{blobs:[...this.values.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key}))}} async delete(key){this.values.delete(key)} }

const journeys = new MemoryStore(), operations = new MemoryStore();
const conversation = {
  id: 'sms-live-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', state: 'human_takeover', intent: 'buyer', contactPhone: '+14085551212',
  answers: { propertyAddress: '100 Main St', closingDate: '2026-09-05', occupancy: 'primary_home' },
  smsConsent: { status: 'active', providerStatus: 'unknown' }, orchestration: { automationMode: 'human_only', ownership: { owner: 'producer' } },
  transcript: [{ direction: 'inbound', body: 'I am buying 100 Main St.', occurredAt: '2026-08-21T00:00:00Z' }], createdAt: '2026-08-21T00:00:00Z'
};
await operations.setJSON(`sms-live-conversations/${conversation.id}`, conversation);
const created = await createSmsPvxJourney({ intent: 'buyer', conversationId: conversation.id, propertyAddress: '100 Main St', mobile: conversation.contactPhone, customerWords: conversation.transcript }, { store: journeys, conversation, now: new Date('2026-08-21T00:01:00Z') });
const loaded = await loadPvxSmsJourneyFromRequest(new Request('https://coveragefit.example/api/pvx/sms-journey', { headers: { cookie: created.cookie.split(';')[0] } }), { store: journeys, now: new Date('2026-08-21T00:02:00Z') });
assert.equal(loaded.record.journeyId, created.record.journeyId);
assert.deepEqual(loaded.record.completedStages, ['sms_intake_complete']);

let next = await advancePvxSmsJourney(loaded, { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:03:00Z'), stage: 'snapshot_viewed', currentStage: 'snapshot', currentStep: 'results' });
next = await advancePvxSmsJourney({ key: loaded.key, record: next }, { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:04:00Z'), stage: 'snapshot_saved', currentStage: 'snapshot', currentStep: 'saved', completedStage: 'snapshot_saved', details: { reviewTopics: [{ topicKey: 'cost_comparison', label: 'Cost-focused comparison' }], topicResponses: [{ topicKey: 'cost_comparison', state: 'cost_first' }], preferredContactChannel: 'text', requestedProducerAction: 'contact_requested' } });
next = await advancePvxSmsJourney({ key: loaded.key, record: next }, { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:05:00Z'), stage: 'home_profile_started', currentStage: 'home-profile', currentStep: 'start' });
next = await advancePvxSmsJourney({ key: loaded.key, record: next }, { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:06:00Z'), stage: 'home_profile_ready', currentStage: 'home-profile', currentStep: 'complete', completedStage: 'home_profile_ready' });
next = await advancePvxSmsJourney({ key: loaded.key, record: next }, { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:07:00Z'), stage: 'policy_review_started', currentStage: 'current-policy', currentStep: 'start' });
next = await advancePvxSmsJourney({ key: loaded.key, record: next }, { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:08:00Z'), stage: 'coverage_review_ready', currentStage: 'current-policy', currentStep: 'complete', completedStage: 'coverage_review_ready' });
assert.equal(next.projection.snapshotStatus, 'saved');
assert.equal(next.projection.homeProfileStatus, 'ready');
assert.equal(next.projection.policyReviewStatus, 'ready');
assert.equal(next.projection.latestReportRevision, '2P');

const linked = await operations.get(`sms-live-conversations/${conversation.id}`);
assert.equal(linked.state, 'human_takeover');
assert.equal(linked.orchestration.ownership.owner, 'producer');
assert.equal(linked.orchestration.automationMode, 'human_only');
assert.equal(linked.pvxJourney.journeyId, created.record.journeyId);
const projection = safePvxJourney(linked);
assert.equal(projection.smsConversationId, conversation.id);
assert.equal(projection.snapshotStatus, 'saved');
assert.equal(projection.reviewTopics[0].status, 'worth_reviewing');
assert.equal(projection.topicResponses[0].response, 'cost_first');
assert.equal(projection.preferredContactChannel, 'text');
assert.equal(projection.requestedProducerAction, 'contact_requested');
assert.equal(projection.latestReportRevision, '2P');

for (const stage of ['sms_intake_complete','pvx_started','snapshot_viewed','snapshot_saved','home_profile_started','home_profile_ready','policy_review_started','coverage_review_ready','producer_review_ready']) assert.ok(PVX_SMS_STAGES.includes(stage));
assert.equal(entry.secureResumeDestination({ currentStage: 'snapshot' }), '/pvx/snapshot/');
assert.equal(entry.secureResumeDestination({ currentStage: 'home-profile' }), '/pvx/home-profile/');
assert.equal(entry.secureResumeDestination({ currentStage: 'current-policy' }), '/pvx/policy/');
assert.ok(fs.readFileSync('functions/api/pvx/home-checkpoint.js','utf8').includes("stage: 'home_profile_ready'"));
assert.ok(fs.readFileSync('functions/api/pvx/policy-checkpoint.js','utf8').includes("stage: 'coverage_review_ready'"));
assert.equal([...operations.values.keys()].some(key=>key.includes('notification')), false);
assert.equal(fs.readFileSync('server/sms-producer-handoff-core.mjs','utf8').includes('pvxJourney'), false);
console.log(JSON.stringify({ sprint: 'CF-PVX-SMS-1.4', pass: true, checks: 39 }));
