import assert from 'node:assert/strict';
import fs from 'node:fs';
import {appendImmutableRevision,reconcileFacts,buildCombinedReview,revisionStory} from './server/pvx-revision-story-core.mjs';

assert.ok(Number(fs.readFileSync(new URL('./VERSION',import.meta.url),'utf8').trim().split('.').at(-1))>=158);
const first={revisionId:'2H_a',revision:'2H',contents:{value:1}},same={revisionId:'2H_b',revision:'2H',contents:{value:1}},changed={revisionId:'2H_c',revision:'2H',contents:{value:2}};
let ledger=appendImmutableRevision([],first);ledger=appendImmutableRevision(ledger,same);assert.equal(ledger.length,1);ledger=appendImmutableRevision(ledger,changed);assert.equal(ledger.length,2);
const reconciled=reconcileFacts({roof:{age:{value:12,source:'customer_confirmed',evidenceRefs:['home:roof']}}},{coverage:{age:{value:10,source:'document_identified',evidenceRefs:['policy:roof']}}});
assert.equal(reconciled[0].status,'trusted_confirmation');
const record={createdAt:'2026-08-22T00:00:00Z',snapshot:{whatDylanWouldLookAtFirst:[{topicKey:'roof'}]},homeProfile:{},currentPolicyProfile:{},reportRevisions:[{revisionId:'2H_a',revision:'2H',contents:{}},{revisionId:'2P_a',revision:'2P',contents:{}}],recommendations:[{status:'actual_recommendation'}],topicResponses:[{recordType:'topicResponse'}],recommendationResponses:[{recordType:'recommendationResponse'}]};
const combined=buildCombinedReview(record,'2026-08-22T01:00:00Z');assert.equal(combined.revision,'3');assert.equal(combined.immutable,true);assert.ok(combined.printIdentification.includes('revision 3'));assert.equal(combined.contents.topicResponses[0].recordType,'topicResponse');assert.equal(combined.contents.recommendationResponses[0].recordType,'recommendationResponse');
record.reportRevisions.push(combined);const story=revisionStory(record);assert.deepEqual(story.map(item=>item.revision),['1','2H','2P','3']);assert.equal(story.every(item=>item.immutable),true);
console.log('CF-PVX-INSIGHT-1.6 QA: PASS');
