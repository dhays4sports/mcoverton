import assert from 'node:assert/strict';
import fs from 'node:fs';
import { handlePVXCheckpoint } from './server/pvx-checkpoint-core.mjs';

assert.ok(Number(fs.readFileSync('VERSION','utf8').trim().split('.')[2])>=155);
class Store{constructor(){this.map=new Map()}async get(key){return structuredClone(this.map.get(String(key))||null)}async setJSON(key,value){this.map.set(String(key),structuredClone(value))}}
const snapshot={schemaVersion:'1.0',contractId:'coveragefit-discovery-only-snapshot-v1',reportRevision:'1',title:'Your CoverageFit Snapshot',whyReviewing:null,wantsToImprove:[],homeContext:[],whatSeemsImportant:[],whatDylanWouldLookAtFirst:[],policyFindings:[],recommendations:[],guardrails:{discoveryOnly:true}};
const store=new Store();
const request=new Request('https://coveragefit.com/api/pvx/checkpoint',{method:'POST',headers:{Origin:'https://coveragefit.com','Content-Type':'application/json'},body:JSON.stringify({action:'continue',snapshot,consent:{reportSaved:false,contact:false},idempotencyKey:'pvxc_insightcontinue123456'})});
const response=await handlePVXCheckpoint(request,{store,now:new Date('2026-08-21T17:00:00Z')});
const body=await response.json();
assert.equal(response.status,201);
assert.equal(body.checkpoint.checkpointType,'journey_continued');
assert.equal(body.checkpoint.reportSaved,false);
assert.match(body.access.continuationPath,/^\/pvx\/continue\/\?token=pvx_/);
const record=[...store.map.values()].find(value=>value?.recordType==='pvx_journey_state');
assert.equal(record.leadCheckpoints.length,0);
assert.equal(record.reportRevisions.length,0);
const html=fs.readFileSync('pvx/snapshot/index.html','utf8');
assert.match(html,/pvxContinueWithoutSave/);
assert.doesNotMatch(html,/id="pvxContactRequest" hidden/);
const client=fs.readFileSync('assets/js/pvx-checkpoint.js','utf8');
assert.match(client,/contact_only/);
assert.match(client,/continuingIsSaving:false/);
console.log(JSON.stringify({sprint:'CF-PVX-INSIGHT-1.3',pass:true,checks:11}));
