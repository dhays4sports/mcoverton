import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  appendReadinessExpression, appendChangeScopeExpression, appendProducerObservation,
  clearCurrentExpression, markCurrentExpressionStale, readinessState
} from './server/pvx-readiness-core.mjs';
import {handlePVXReadiness} from './server/pvx-readiness-api-core.mjs';
import {hashToken} from './server/pvx-checkpoint-core.mjs';

if(process.env.COVERAGEFIT_REGRESSION!=='1')assert.equal(fs.readFileSync('VERSION','utf8').trim(),'3.20.179');
const base={checkpointId:'c1'};
const first=appendReadinessExpression(base,{expressionId:'pvr_first123',state:'exploring',sourceCheckpoint:'snapshot',expressedAt:'2026-08-22T00:00:00Z'});
const second=appendReadinessExpression(first,{expressionId:'pvr_second12',state:'open_if_fit',sourceCheckpoint:'policy_review',expressedAt:'2026-08-23T00:00:00Z'});
assert.equal(readinessState(second).currentActionReadiness.state,'open_if_fit');
assert.equal(second.actionReadinessExpressions.length,2);
assert.equal(second.actionReadinessExpressions[1].supersedesExpressionId,'pvr_first123');
const scoped=appendChangeScopeExpression(second,{expressionId:'pvs_scope1234',scope:'either',sourceCheckpoint:'producer_conversation',sourceReadinessExpressionId:'pvr_second12',expressedAt:'2026-08-24T00:00:00Z'});
assert.equal(readinessState(scoped).currentChangeScope.scope,'either');
const cleared=clearCurrentExpression(scoped,'actionReadinessExpressions',{expressionId:'pvr_clear1234',expressedAt:'2026-08-25T00:00:00Z'});
assert.equal(readinessState(cleared).currentActionReadiness,null);
assert.equal(cleared.actionReadinessExpressions.length,3);
const stale=markCurrentExpressionStale(scoped,'changeScopeExpressions',{expressionId:'pvs_stale1234',expressedAt:'2026-08-25T00:00:00Z'});
assert.equal(readinessState(stale).currentChangeScope,null);
assert.throws(()=>appendReadinessExpression(base,{expressionId:'pvr_prod1234',state:'exploring',sourceCheckpoint:'producer_conversation',source:'producer_recorded_customer_statement'}),/preserved wording/);
const observed=appendProducerObservation(base,{observationId:'pvo_observe12',producerId:'dylan',observation:'Customer asked to slow down.'});
assert.equal(observed.producerObservations[0].customerStatement,false);

const token='pvx_'+('a'.repeat(43)),records=new Map(),key=`pvx/checkpoint/${await hashToken(token)}`;
records.set(key,{...first,createdAt:'2026-08-22T00:00:00Z',expiresAt:'2026-09-22T00:00:00Z',checkpointType:'snapshot_saved'});
const store={get:async key=>records.get(key)||null,setJSON:async(key,value)=>records.set(key,value)};
const request=new Request('https://coveragefit.test/api/pvx/readiness',{method:'POST',headers:{Origin:'https://coveragefit.test','Content-Type':'application/json'},body:JSON.stringify({action:'append_readiness',token,expression:{expressionId:'pvr_api12345',state:'wants_explanation_first',sourceCheckpoint:'home_profile',expressedAt:'2026-08-23T00:00:00Z'}})});
const response=await handlePVXReadiness(request,{store,now:new Date('2026-08-26T00:00:00Z')});
assert.equal(response.status,200);
const body=await response.json();assert.equal(body.state.currentActionReadiness.state,'wants_explanation_first');
assert.equal(body.state.inferred,false);
console.log(JSON.stringify({sprint:'CF-PVX-READY-1.3',pass:true,checks:15}));

