import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url),api=require('./assets/js/pvx-experiment-governance.js'),registry=JSON.parse(fs.readFileSync('CF_PVX_EXPERIMENT_REGISTRY.json','utf8')),draft=registry.experiments[0];
assert.equal(registry.contractId,api.CONTRACT_ID);assert.equal(api.validateExperiment(draft).valid,true);assert.equal(api.canActivate(draft),false);
const active={...draft,status:'active',reviews:{semantic:'approved',accessibility:'approved',privacy:'approved'}};assert.equal(api.canActivate(active),true);
const id='pvxa_abcdefghijklmnop';const first=api.assignVariant(active,id),second=api.assignVariant(active,id);assert.deepEqual(first,second);assert.equal(first.containsPii,false);assert(['control','evidence_first'].includes(first.variant));
for(const bad of[
  {...active,hypothesis:'Use urgency and fear to force action'},
  {...active,variants:[...active.variants,{key:'countdown',weight:1,presentationId:'fake countdown'}]},
  {...active,reviews:{semantic:'pending',accessibility:'approved',privacy:'approved'}},
  {...active,protectedContracts:active.protectedContracts.filter(item=>item!=='consent')},
  {...active,rollback:{method:'none',controlVariant:'control'}}
])assert.equal(api.validateExperiment(bad).valid,false);
assert.throws(()=>api.assignVariant(active,'avery@example.com'));
const docs=fs.readFileSync('SPRINT-CF-PVX-LEARN-1.2.md','utf8');assert.match(docs,/minimum detectable effect/);assert.match(docs,/No result may be called significant/);assert.doesNotMatch(JSON.stringify(registry),/"status": "active"/);
console.log('CF-PVX-LEARN-1.2 QA: PASS');
