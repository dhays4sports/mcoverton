import assert from 'node:assert/strict';
import fs from 'node:fs';
import {policyEvidenceDelta} from './server/pvx-insight-delta-core.mjs';

const patch=Number(fs.readFileSync(new URL('./VERSION',import.meta.url),'utf8').trim().split('.').at(-1));
assert.ok(patch>=157);
const policy={coverage:{dwelling:{value:550000,source:'document_identified',evidenceRefs:['policy:dwelling']},deductible:{value:2500,source:'customer_confirmed',evidenceRefs:['customer:deductible']},water:{value:null,source:'unknown',evidenceRefs:[]}}};
const blocked=policyEvidenceDelta({},policy,{meaningfulPolicyEvidence:false},[]);
assert.equal(blocked.hasChanges,false);
const delta=policyEvidenceDelta({},policy,{meaningfulPolicyEvidence:true},[{recommendationKey:'verify-rebuild',label:'Verify rebuilding assumptions',status:'actual_recommendation',evidenceRefs:['policy:dwelling']}]);
assert.equal(delta.hasChanges,true);
assert.equal(delta.summary.added,1);
assert.equal(delta.summary.confirmed,1);
assert.equal(delta.summary.changed,1);
assert.deepEqual(delta.stillNeeded,['coverage.water']);
assert.equal(delta.guardrails.personalDiscoveryAffectsScore,false);
assert.equal(delta.guardrails.bindAuthorized,false);
console.log('CF-PVX-INSIGHT-1.5 QA: PASS');
