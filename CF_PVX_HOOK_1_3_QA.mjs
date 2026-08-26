import assert from 'node:assert/strict';
import fs from 'node:fs';
import { conversationalInvitation, normalizeAiCallerSeed, validateConversationalSeed } from './server/pvx-conversational-return-core.mjs';
import { mapWebToPvx, validateWebPvxMapping } from './server/web-pvx-mapping-core.mjs';

const buyer=mapWebToPvx({entry_type:'ai_caller',customer_selection:'secure_continue',conversation_intent:'buyer',conversation_id:'ai_123',conversation_answers:{improvementPriorities:['understanding'],stayIntent:'long_term'},conversation_words:{stayIntent:'We plan to stay here for years.'},customer_words:'I am buying the house and plan to stay.'});
assert.equal(validateWebPvxMapping(buyer).valid,true);
assert.equal(buyer.canEnterPvx,true);
assert.equal(buyer.discovery.answers.shoppingReason,'buying_home');
assert.equal(buyer.discovery.answers.ownershipDuration,'buying_now');
assert.equal(buyer.discovery.answers.stayIntent,'long_term');
assert.equal(buyer.discovery.currentQuestionId,'upgradeSummary');
assert.equal(buyer.evidence.exactCustomerWords,'I am buying the house and plan to stay.');
assert.equal(buyer.context.conversation.originalWordsPreserved,true);
assert.deepEqual(buyer.consent,{reportSaved:false,contact:false,sms:false,call:false,email:false,knownContactIsPermission:false});
for(const intent of['','ambiguous','other','dylan','agent','human','person']){
  const seed=normalizeAiCallerSeed({conversation_intent:intent,conversation_answers:{stayIntent:'long_term'}});
  assert.equal(seed.producerSafeFallback,true);
  assert.deepEqual(seed.answers,{});
  assert.equal(validateConversationalSeed(seed).valid,true);
}
for(const channel of['sms','ai_caller']){
  const invite=conversationalInvitation(channel);
  assert.match(invite.title,/Snapshot/);
  assert.match(invite.body,/first unanswered question/);
  assert.deepEqual(invite.promises,{policyFinding:false,eligibility:false,price:false,responseTime:false});
}
const smsPage=fs.readFileSync('sms/continue/index.html','utf8');
const resolver=fs.readFileSync('assets/js/sms-handoff-resolver.js','utf8');
const smsRuntime=fs.readFileSync('server/sms-conversation-core.mjs','utf8');
const ringRuntime=fs.readFileSync('server/ringcentral-sms-connection-core.mjs','utf8');
assert.match(smsPage,/Snapshot is ready to continue/);
assert.match(resolver,/first unanswered question/);
for(const source of[smsRuntime,ringRuntime]){
  assert.match(source,/personal CoverageFit Snapshot/);
  assert.match(source,/first unanswered question/);
  assert.doesNotMatch(source,/guaranteed|eligible|underinsured|policy deficiency/i);
}
assert.match(fs.readFileSync('CF_PVX_HOOK_1_3_PROTECTED_SMS_HASH_CHANGE.md','utf8'),/copy-only/i);
console.log('408-CF-PVX-HOOK-1.3 QA: PASS');
