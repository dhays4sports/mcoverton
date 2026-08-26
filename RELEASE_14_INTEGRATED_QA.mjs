import assert from 'node:assert/strict';
import {homeProfileDelta,policyEvidenceDelta} from './server/pvx-insight-delta-core.mjs';
import {buildCombinedReview,reconcileFacts} from './server/pvx-revision-story-core.mjs';
import {nextUsefulUnlock} from './server/pvx-next-unlock-core.mjs';
const h={revisionId:'2H_a',revision:'2H',contents:{}},p={revisionId:'2P_a',revision:'2P',contents:{}};
for(const reportRevisions of [[h,p],[p,h]]){const combined=buildCombinedReview({reportRevisions,homeProfile:{},currentPolicyProfile:{}},'2026-08-22T00:00:00Z');assert.equal(combined.revision,'3');assert.equal(combined.guardrails.personalDiscoveryAffectsScore,false)}
const conflict=reconcileFacts({roof:{age:{value:10,source:'customer_reported'}}},{coverage:{age:{value:12,source:'document_identified'}}});assert.equal(conflict[0].status,'conflict_ask_once');
const homeDelta=homeProfileDelta({}, {}, {stillNeeded:[]}, []);assert.equal(homeDelta.summary.newTopics,0);assert.equal(homeDelta.guardrails.quoteReadinessIsEligibility,false);
const policyDelta=policyEvidenceDelta({}, {}, {meaningfulPolicyEvidence:false}, []);assert.equal(policyDelta.hasChanges,false);assert.equal(policyDelta.guardrails.personalDiscoveryAffectsScore,false);
assert.equal(nextUsefulUnlock({homeProfilePath:{status:'complete'}}).primary.path,'current_policy');
console.log('Release 14 integrated QA: PASS');
