import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { clearRingCentralTokenCache, SMS_EVENT_FILTER } from './server/ringcentral-client.mjs';
import { handleRingCentralWebhook } from './server/ringcentral-sms-connection-core.mjs';
import { smsLiveConversationId } from './server/sms-outbound-gateway.mjs';
import { applySmsConsentCommand, smsPermissionSnapshot } from './server/sms-consent-core.mjs';
import { normalizeSmsCommand, normalizeSmsIntent, SMS_RUSH_ACKNOWLEDGEMENT } from './server/sms-conversation-core.mjs';
import { normalizeSmsOrchestration, resolveSmsInboundRoute } from './server/sms-orchestrator-core.mjs';
import { createSmsHandoff, createSmsHandoffToken, handleSmsHandoffRead, smsHandoffKey, SMS_HANDOFF_SCHEMA_VERSION } from './server/sms-handoff-core.mjs';
import { mapSmsToPvx } from './server/sms-pvx-mapping-core.mjs';

const require = createRequire(import.meta.url);
const checkpoint = require('./assets/js/pvx-checkpoint.js');
class MemoryStore { constructor(){this.values=new Map()} async get(key){return this.values.get(String(key))||null} async setJSON(key,value,options={}){key=String(key);if(options.onlyIfNew&&this.values.has(key))throw new Error('D1 UNIQUE constraint');this.values.set(key,structuredClone(value))} async delete(key){this.values.delete(String(key))} async list({prefix=''}={}){return{blobs:[...this.values.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key}))}} }

for (const [input, expected] of [['STOP','stop'],['START','start'],['HELP','help'],['RESTART','restart'],['DYLAN','human'],['AGENT','human'],['HUMAN','human'],['PERSON','human']]) assert.equal(normalizeSmsCommand(input), expected);
assert.equal(normalizeSmsIntent('buying a home'), 'buyer');
assert.equal(normalizeSmsIntent('review my current home coverage'), 'home_review');
assert.equal(normalizeSmsIntent('home and auto'), 'bundle');
assert.match(SMS_RUSH_ACKNOWLEDGEMENT, /does not guarantee coverage, eligibility, or turnaround time/i);

const base = { id:'sms-live-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', state:'buyer_closing_date_requested', intent:'buyer', orchestration:normalizeSmsOrchestration({state:'buyer_closing_date_requested',intent:'buyer'},{occurredAt:'2026-08-21T00:00:00Z'}) };
const stopped = applySmsConsentCommand(base, 'stop', { occurredAt:'2026-08-21T00:01:00Z' });
assert.equal(stopped.smsConsent.status, 'opted_out');
assert.equal(stopped.orchestration.automationMode, 'suppressed');
assert.equal(stopped.orchestration.workflow.state, 'buyer_closing_date_requested');
assert.equal(smsPermissionSnapshot(stopped).allowed, false);
const restarted = applySmsConsentCommand(stopped, 'start', { occurredAt:'2026-08-21T00:02:00Z' });
assert.equal(restarted.smsConsent.status, 'active');
assert.equal(restarted.orchestration.ownership.owner, 'producer');
assert.equal(restarted.orchestration.automationMode, 'human_only');
assert.equal(restarted.orchestration.workflow.state, 'buyer_closing_date_requested');
assert.equal(resolveSmsInboundRoute({}, 'Hi Dylan').route, 'producer');
assert.equal(resolveSmsInboundRoute({ ...base, orchestration: { ...base.orchestration, ownership:{...base.orchestration.ownership,owner:'producer'}, automationMode:'human_only' } }, 'Friday works').route, 'producer');

const runtimeStore=new MemoryStore(),runtimeSends=[];
const runtimeEnv={RINGCENTRAL_SERVER_URL:'https://platform.ringcentral.com',RINGCENTRAL_CLIENT_ID:'id',RINGCENTRAL_CLIENT_SECRET:'secret',RINGCENTRAL_JWT_TOKEN:'jwt',RINGCENTRAL_FROM_NUMBER:'+14085550123',RINGCENTRAL_WEBHOOK_URL:'https://coveragefit.example/api/sms/ringcentral/webhook',RINGCENTRAL_WEBHOOK_VALIDATION_TOKEN:'validation-secret',RINGCENTRAL_CONVERSATION_HASH_SECRET:'conversation-secret-at-least-32-characters'};
let providerCount=0;const runtimeFetch=async(url,init={})=>{if(url.endsWith('/restapi/oauth/token'))return Response.json({access_token:'token',expires_in:3600});if(url.endsWith('/sms')){providerCount+=1;runtimeSends.push(JSON.parse(init.body));return Response.json({id:`provider-${providerCount}`})}throw new Error(`Unexpected URL ${url}`)};
const webhookPayload=({id,subject,contact,direction='Inbound'})=>({uuid:`uuid-${id}`,event:SMS_EVENT_FILTER,timestamp:'2026-08-21T00:00:00Z',body:{id,to:direction==='Inbound'?[{phoneNumber:runtimeEnv.RINGCENTRAL_FROM_NUMBER,target:true}]:[{phoneNumber:contact,target:true}],from:{phoneNumber:direction==='Inbound'?contact:runtimeEnv.RINGCENTRAL_FROM_NUMBER},type:'SMS',direction,creationTime:'2026-08-21T00:00:00Z',subject}});
const webhookRequest=(payload,token='validation-secret')=>new Request(runtimeEnv.RINGCENTRAL_WEBHOOK_URL,{method:'POST',headers:{'Validation-Token':token,'Content-Type':'application/json'},body:JSON.stringify(payload)});
clearRingCentralTokenCache();
const runtimePhone='+14085557777',firstPayload=webhookPayload({id:'runtime-1',subject:'buying a home',contact:runtimePhone});
let webhookResponse=await handleRingCentralWebhook(webhookRequest(firstPayload),{env:runtimeEnv,store:runtimeStore,fetchImpl:runtimeFetch,now:new Date('2026-08-21T00:00:00Z')});
let webhookBody=await webhookResponse.json();assert.equal(webhookBody.routedTo,'coveragefit');assert.equal(webhookBody.deduped,false);assert.equal(runtimeSends.length,1);
webhookResponse=await handleRingCentralWebhook(webhookRequest(firstPayload),{env:runtimeEnv,store:runtimeStore,fetchImpl:runtimeFetch,now:new Date('2026-08-21T00:00:01Z')});webhookBody=await webhookResponse.json();assert.equal(webhookBody.deduped,true);assert.equal(runtimeSends.length,1);
webhookResponse=await handleRingCentralWebhook(webhookRequest(webhookPayload({id:'runtime-bad',subject:'buying a home',contact:'+14085557770'}),'wrong'),{env:runtimeEnv,store:runtimeStore,fetchImpl:runtimeFetch});assert.equal(webhookResponse.status,401);
webhookResponse=await handleRingCentralWebhook(webhookRequest(webhookPayload({id:'runtime-out',subject:'Dylan here — I can help.',contact:runtimePhone,direction:'Outbound'})),{env:runtimeEnv,store:runtimeStore,fetchImpl:runtimeFetch,now:new Date('2026-08-21T00:00:02Z')});webhookBody=await webhookResponse.json();assert.equal(webhookBody.manualTakeover,true);
const runtimeConversationId=await smsLiveConversationId(runtimePhone,runtimeEnv.RINGCENTRAL_FROM_NUMBER,runtimeEnv.RINGCENTRAL_CONVERSATION_HASH_SECRET),runtimeConversation=await runtimeStore.get(`sms-live-conversations/${runtimeConversationId}`);assert.equal(runtimeConversation.orchestration.ownership.owner,'producer');assert.equal(runtimeConversation.orchestration.automationMode,'human_only');
const ambiguousSends=runtimeSends.length;webhookResponse=await handleRingCentralWebhook(webhookRequest(webhookPayload({id:'runtime-ambiguous',subject:'Hi Dylan',contact:'+14085557778'})),{env:runtimeEnv,store:runtimeStore,fetchImpl:runtimeFetch,now:new Date('2026-08-21T00:00:03Z')});webhookBody=await webhookResponse.json();assert.equal(webhookBody.routedTo,'producer');assert.equal(webhookBody.replied,false);assert.equal(runtimeSends.length,ambiguousSends);

for (const [intent, reason] of [['buyer',''],['home_review','price'],['bundle','']]) {
  const mapping = mapSmsToPvx({ intent, conversationId:`sms-live-${intent}`, propertyAddress:'100 Main St', reviewReason:reason, mobile:'+14085551212' });
  assert.equal(mapping.canEnterPvx, true);
  assert.equal(mapping.destination, '/pvx/start/');
  assert.equal(mapping.contact.callConsent, false);
  assert.equal(mapping.contact.emailConsent, false);
  assert.equal(mapping.semantics.discoveryAffectsProtectionScore, false);
}
assert.equal(mapSmsToPvx({intent:'other',conversationId:'sms-live-other'}).producerSafeFallback, true);

const handoffs=new MemoryStore(),journeys=new MemoryStore(),operations=new MemoryStore();
const conversation={id:'sms-live-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',state:'coveragefit_ready',intent:'buyer',contactPhone:'+14085551212',answers:{propertyAddress:'100 Main St, San Jose, CA 95112',closingDate:'2026-09-05',occupancy:'primary_home'},smsConsent:{status:'active',providerStatus:'unknown'},orchestration:{automationMode:'automated',ownership:{owner:'coveragefit'}},transcript:[{direction:'inbound',body:'Buying 100 Main St',occurredAt:'2026-08-21T00:00:00Z'}],createdAt:'2026-08-21T00:00:00Z'};
await operations.setJSON(`sms-live-conversations/${conversation.id}`,conversation);
const makeRead=token=>new Request('https://coveragefit.example/api/sms/handoff/read',{method:'POST',headers:{origin:'https://coveragefit.example','content-type':'application/json'},body:JSON.stringify({token})});
const valid=await createSmsHandoff(conversation,{store:handoffs,operationsStore:operations,origin:'https://coveragefit.example',now:new Date('2026-08-21T00:01:00Z')});
let response=await handleSmsHandoffRead(makeRead(valid.token),{store:handoffs,journeyStore:journeys,operationsStore:operations,now:new Date('2026-08-21T00:02:00Z')});
assert.equal(response.status,200);
let body=await response.json();
assert.equal(body.pvx.destination,'/pvx/start/');
assert.equal(JSON.stringify(body).includes(valid.token),false);
assert.equal(valid.url.includes('100%20Main'),false);
assert.match(response.headers.get('set-cookie')||'',/HttpOnly; Secure; SameSite=Strict/);
response=await handleSmsHandoffRead(makeRead(valid.token),{store:handoffs,journeyStore:journeys,operationsStore:operations,now:new Date('2026-08-21T00:03:00Z')});
assert.equal(response.status,409);

response=await handleSmsHandoffRead(makeRead('sh_!!!!!!!!!!!!!!!!!!!!!!'),{store:handoffs,journeyStore:journeys,operationsStore:operations});
assert.equal(response.status,404);
const expired=await createSmsHandoff(conversation,{store:handoffs,origin:'https://coveragefit.example',now:new Date('2026-08-21T00:04:00Z')});
const expiredKey=await smsHandoffKey(expired.token),expiredRecord=await handoffs.get(expiredKey);expiredRecord.expiresAt='2026-08-21T00:04:01Z';await handoffs.setJSON(expiredKey,expiredRecord);
response=await handleSmsHandoffRead(makeRead(expired.token),{store:handoffs,journeyStore:journeys,operationsStore:operations,now:new Date('2026-08-21T00:05:00Z')});
assert.equal(response.status,410);

const legacyToken=createSmsHandoffToken(),legacyConversationId='sms-live-cccccccccccccccccccccccccccccccc';
await handoffs.setJSON(await smsHandoffKey(legacyToken),{schemaVersion:SMS_HANDOFF_SCHEMA_VERSION,build:'RC-SMS-1.9.6',createdAt:'2026-08-21T00:00:00Z',expiresAt:'2026-08-22T00:00:00Z',payload:{source:'408farmers_sms',reviewContext:'Reviewing current home coverage',propertyAddress:'200 Pine St',reviewReason:'renewal',conversationId:legacyConversationId}});
await operations.setJSON(`sms-live-conversations/${legacyConversationId}`,{id:legacyConversationId,state:'coveragefit_ready',intent:'home_review',contactPhone:'+14085550000',answers:{propertyAddress:'200 Pine St',reviewReason:'renewal'},smsConsent:{status:'active'},orchestration:{ownership:{owner:'coveragefit'},automationMode:'automated'}});
response=await handleSmsHandoffRead(makeRead(legacyToken),{store:handoffs,journeyStore:journeys,operationsStore:operations,now:new Date('2026-08-21T01:00:00Z')});
assert.equal(response.status,200);
assert.equal((await response.json()).pvx.seed.discovery.answers.shoppingReason,'renewal_increase');

const raceHandoff=await createSmsHandoff(conversation,{store:handoffs,origin:'https://coveragefit.example',now:new Date('2026-08-21T02:00:00Z')});
const raced=await Promise.all([1,2].map(()=>handleSmsHandoffRead(makeRead(raceHandoff.token),{store:handoffs,journeyStore:journeys,operationsStore:operations,now:new Date('2026-08-21T02:01:00Z')})));
assert.deepEqual(raced.map(item=>item.status).sort((a,b)=>a-b),[200,409]);

const activeChannel=checkpoint.resolveChannelConsent({bridge:{smsConversationId:'sms-live-x',contact:{smsConsent:{status:'active',providerStatus:'unknown'}}},preferredMethod:'text',contactRequested:true});
assert.equal(activeChannel.sms,true);assert.equal(activeChannel.call,false);assert.equal(activeChannel.email,false);
assert.equal(checkpoint.resolveChannelConsent({bridge:{smsConversationId:'sms-live-x',contact:{smsConsent:{status:'opted_out',providerStatus:'blocked'}}},preferredMethod:'text',contactRequested:true,explicitSms:true}).sms,false);
assert.equal(checkpoint.resolveChannelConsent({bridge:{smsConversationId:'sms-live-x',contact:{smsConsent:{status:'active'}}},preferredMethod:'call',contactRequested:true}).call,true);
assert.equal(checkpoint.resolveChannelConsent({bridge:{smsConversationId:'sms-live-x',contact:{smsConsent:{status:'active'}}},preferredMethod:'email',contactRequested:true}).email,true);

const resolver=fs.readFileSync('assets/js/sms-handoff-resolver.js','utf8'),page=fs.readFileSync('pvx/snapshot/index.html','utf8');
assert.equal(resolver.includes("'/home/'"),false);
assert.ok(page.indexOf('id="pvxSnapshotContent"')<page.indexOf('id="pvxCheckpoint"'));
assert.ok(page.includes('not a review of your current policy'));
assert.equal(fs.readFileSync('assets/js/protection-score.js','utf8').includes('coveragefit_pvx_sms_bridge_v1'),false);
for(const path of ['functions/api/sms/handoff/read.js','functions/api/pvx/sms-journey.js','sms/continue/index.html','server/sms-pvx-mapping-core.mjs','server/pvx-sms-journey-core.mjs'])assert.ok(fs.existsSync(path));
console.log(JSON.stringify({sprint:'CF-PVX-SMS-1.5',pass:true,checks:75}));
