import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSmsHandoff, handleSmsHandoffRead, smsHandoffKey } from './server/sms-handoff-core.mjs';
import { handlePvxSmsJourney, PVX_SMS_RESUME_COOKIE } from './server/pvx-sms-journey-core.mjs';

class MemoryStore {
  constructor() { this.values = new Map(); }
  async get(key) { return this.values.get(key) || null; }
  async setJSON(key, value, options = {}) {
    if (options.onlyIfNew && this.values.has(key)) throw new Error('exists');
    this.values.set(key, structuredClone(value));
  }
  async list({ prefix = '' } = {}) { return { blobs: [...this.values.keys()].filter(key => key.startsWith(prefix)).map(key => ({ key })) }; }
}

const handoffs = new MemoryStore();
const journeys = new MemoryStore();
const operations = new MemoryStore();
const conversation = {
  id: 'sms-live-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', state: 'coveragefit_ready', intent: 'buyer', contactPhone: '+14085551212',
  answers: { propertyAddress: '100 Main St, San Jose, CA 95112', closingDate: '2026-09-05', occupancy: 'primary_home', autoReview: true, priority: 'rush', rushRequested: true },
  smsConsent: { status: 'active', providerStatus: 'unknown', source: 'inbound' },
  orchestration: { automationMode: 'automated', ownership: { owner: 'automation' } },
  attribution: { partnerId: 'partner-1', partnerName: 'Example Realtor' },
  transcript: [{ direction: 'inbound', body: 'I am buying 100 Main St', occurredAt: '2026-08-21T00:00:00.000Z' }],
  createdAt: '2026-08-21T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z'
};
await operations.setJSON(`sms-live-conversations/${conversation.id}`, conversation);
const handoff = await createSmsHandoff(conversation, { store: handoffs, operationsStore: operations, origin: 'https://coveragefit.example', now: new Date('2026-08-21T00:01:00.000Z') });
assert.match(handoff.url, /^https:\/\/coveragefit\.example\/sms\/continue\/\?token=sh_/);
assert.equal(handoff.url.includes('+1408'), false);

const request = new Request('https://coveragefit.example/api/sms/handoff/read', {
  method: 'POST', headers: { origin: 'https://coveragefit.example', 'content-type': 'application/json' }, body: JSON.stringify({ token: handoff.token })
});
const response = await handleSmsHandoffRead(request, { store: handoffs, journeyStore: journeys, operationsStore: operations, now: new Date('2026-08-21T00:02:00.000Z') });
assert.equal(response.status, 200);
assert.match(response.headers.get('set-cookie') || '', new RegExp(`${PVX_SMS_RESUME_COOKIE}=pvxs_`));
assert.match(response.headers.get('set-cookie') || '', /HttpOnly; Secure; SameSite=Strict/);
const body = await response.json();
assert.equal(body.pvx.destination, '/pvx/start/');
assert.equal(body.pvx.seed.discovery.currentQuestionId, 'improvementPriorities');
assert.equal(body.pvx.seed.contact.callConsent, false);
assert.equal(body.pvx.seed.contact.emailConsent, false);
assert.equal(body.pvx.seed.operational.priority, 'rush');
assert.equal(JSON.stringify(body).includes(handoff.token), false);
assert.equal(body.pvx.seed.evidence.customerWords[0].words, 'I am buying 100 Main St');

const consumed = await handoffs.get(await smsHandoffKey(handoff.token));
assert.ok(consumed.consumedAt);
assert.equal(consumed.payload.propertyAddress, undefined);
const updatedConversation = await operations.get(`sms-live-conversations/${conversation.id}`);
assert.equal(updatedConversation.pvxJourney.journeyId, body.pvx.journeyId);
assert.equal(updatedConversation.smsConsent.status, 'active');

const cookie = (response.headers.get('set-cookie') || '').split(';')[0];
const load = await handlePvxSmsJourney(new Request('https://coveragefit.example/api/pvx/sms-journey', {
  method: 'POST', headers: { origin: 'https://coveragefit.example', cookie, 'content-type': 'application/json' }, body: JSON.stringify({ action: 'load' })
}), { store: journeys, operationsStore: operations, now: new Date('2026-08-21T00:03:00.000Z') });
assert.equal(load.status, 200);
assert.equal((await load.json()).journey.journeyId, body.pvx.journeyId);

const replay = await handleSmsHandoffRead(new Request('https://coveragefit.example/api/sms/handoff/read', {
  method: 'POST', headers: { origin: 'https://coveragefit.example', 'content-type': 'application/json' }, body: JSON.stringify({ token: handoff.token })
}), { store: handoffs, journeyStore: journeys, operationsStore: operations, now: new Date('2026-08-21T00:04:00.000Z') });
assert.equal(replay.status, 409);
assert.equal((await replay.json()).error.code, 'handoff_consumed');

const resolver = fs.readFileSync('assets/js/sms-handoff-resolver.js', 'utf8');
const continuePage = fs.readFileSync('sms/continue/index.html', 'utf8');
assert.equal(resolver.includes("location.replace('/transition/')"), false);
assert.equal(resolver.includes("destination:'/home/'"), false);
assert.equal(continuePage.includes('href="/home/"'), false);
assert.equal(continuePage.includes('href="/pvx/start/"'), true);
assert.equal(fs.readFileSync('server/ringcentral-client.mjs', 'utf8').includes('CF-PVX-SMS'), false);
assert.equal(fs.readFileSync('server/sms-conversation-core.mjs', 'utf8').includes('CF-PVX-SMS'), false);
console.log(JSON.stringify({ sprint: 'CF-PVX-SMS-1.1', pass: true, checks: 27 }));
