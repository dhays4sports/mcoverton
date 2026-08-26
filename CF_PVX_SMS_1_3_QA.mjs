import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createSmsPvxJourney } from './server/pvx-sms-journey-core.mjs';
import { handlePVXCheckpoint } from './server/pvx-checkpoint-core.mjs';

const require = createRequire(import.meta.url);
const checkpoint = require('./assets/js/pvx-checkpoint.js');
class MemoryStore { constructor(){this.values=new Map()} async get(key){return this.values.get(key)||null} async setJSON(key,value,options={}){if(options.onlyIfNew&&this.values.has(key))throw new Error('exists');this.values.set(key,structuredClone(value))} async delete(key){this.values.delete(key)} }

const snapshot = {
  contractId: 'coveragefit-discovery-only-snapshot-v1', reportRevision: '1', guardrails: { discoveryOnly: true },
  whyReviewing: { evidenceRef: 'discovery.shoppingReason', label: 'Buying a home' }, wantsToImprove: [], homeContext: [], whatSeemsImportant: [],
  whatDylanWouldLookAtFirst: [{ status: 'worth_reviewing', evidenceRefs: ['discovery.shoppingReason'], recommendation: false, label: 'Cost-focused comparison' }],
  policyFindings: [], recommendations: []
};
const activeBridge = { smsConversationId: 'sms-live-active', contact: { smsConsent: { status: 'active', providerStatus: 'unknown' } } };
assert.deepEqual(checkpoint.resolveChannelConsent({ bridge: activeBridge, preferredMethod: 'text', contactRequested: true }), { contact: true, sms: true, call: false, email: false, smsSource: 'existing_global_sms_consent', existingSms: true, suppressed: false });
const stopped = checkpoint.resolveChannelConsent({ bridge: { smsConversationId: 'sms-live-stopped', contact: { smsConsent: { status: 'opted_out', providerStatus: 'blocked' } } }, preferredMethod: 'text', contactRequested: true, explicitSms: true });
assert.equal(stopped.sms, false);
assert.equal(stopped.suppressed, true);
assert.equal(checkpoint.resolveChannelConsent({ bridge: activeBridge, preferredMethod: 'call', contactRequested: true }).call, true);
assert.equal(checkpoint.resolveChannelConsent({ bridge: activeBridge, preferredMethod: 'email', contactRequested: true }).email, true);

const records = new MemoryStore(), journeys = new MemoryStore(), operations = new MemoryStore();
const conversation = { id: 'sms-live-active', intent: 'buyer', contactPhone: '+14085551212', smsConsent: { status: 'active', providerStatus: 'unknown' }, state: 'coveragefit_ready', orchestration: { ownership: { owner: 'producer' } } };
await operations.setJSON(`sms-live-conversations/${conversation.id}`, conversation);
const journey = await createSmsPvxJourney({ intent: 'buyer', conversationId: conversation.id, propertyAddress: '100 Main St', mobile: conversation.contactPhone, smsConsent: conversation.smsConsent }, { store: journeys, conversation, now: new Date('2026-08-21T00:00:00Z') });
const makeRequest = (consent, mobile = '+14085551212') => new Request('https://coveragefit.example/api/pvx/checkpoint', { method: 'POST', headers: { origin: 'https://coveragefit.example', cookie: journey.cookie.split(';')[0], 'content-type': 'application/json' }, body: JSON.stringify({ action: 'create', snapshot, contact: { name: 'A Customer', mobile, preferredMethod: 'text', requestType: 'text' }, consent: { reportSaved: true, contact: true, sms: consent }, attribution: { smsConversationId: 'untrusted-id' } }) });
let response = await handlePVXCheckpoint(makeRequest(true), { store: records, journeyStore: journeys, operationsStore: operations, now: new Date('2026-08-21T00:01:00Z') });
assert.equal(response.status, 201);
let result = await response.json();
assert.equal(result.checkpoint.smsPermitted, true);
assert.equal(result.checkpoint.callPermitted, false);
assert.equal(result.checkpoint.emailPermitted, false);
const saved = [...records.values.values()].find(value => value.recordType === 'pvx_checkpoint');
assert.equal(saved.attribution.smsConversationId, conversation.id);
assert.equal(saved.attribution.smsJourneyId, journey.record.journeyId);
assert.equal(saved.consent.smsSource, 'existing_global_sms_consent');
assert.equal(saved.authorization.bindAuthorized, false);
assert.equal(saved.snapshot.guardrails.protectionScoreCreated, false);

conversation.smsConsent = { status: 'opted_out', providerStatus: 'blocked' };
await operations.setJSON(`sms-live-conversations/${conversation.id}`, conversation);
response = await handlePVXCheckpoint(makeRequest(true), { store: records, journeyStore: journeys, operationsStore: operations, now: new Date('2026-08-21T00:02:00Z') });
result = await response.json();
assert.equal(result.checkpoint.smsPermitted, false);
const latest = [...records.values.values()].filter(value => value.recordType === 'pvx_checkpoint').at(-1);
assert.equal(latest.consent.smsSource, 'authoritative_sms_suppression');

response = await handlePVXCheckpoint(makeRequest(true, '+14085559999'), { store: records, journeyStore: journeys, operationsStore: operations, now: new Date('2026-08-21T00:03:00Z') });
assert.equal((await response.json()).checkpoint.smsPermitted, false);

const page = fs.readFileSync('pvx/snapshot/index.html', 'utf8');
assert.ok(page.indexOf('id="pvxSnapshotContent"') < page.indexOf('id="pvxCheckpoint"'));
assert.ok(page.indexOf('Your CoverageFit Snapshot') < page.indexOf('contactConsent'));
assert.ok(page.includes('without pretending we have evaluated your current policy'));
assert.ok(page.includes('not a review of your current policy'));
assert.equal(fs.readFileSync('assets/js/pvx-checkpoint-view.js', 'utf8').includes('leadCaptureStatus ='), false);
assert.equal(fs.readFileSync('assets/js/protection-score.js', 'utf8').includes('smsJourneyId'), false);
console.log(JSON.stringify({ sprint: 'CF-PVX-SMS-1.3', pass: true, checks: 27 }));
