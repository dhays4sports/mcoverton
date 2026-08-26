import assert from 'node:assert/strict';
import fs from 'node:fs';
import {hashToken} from './server/pvx-checkpoint-core.mjs';
import {REENTRY_REASONS,reentryPlan,handlePVXReadinessReentry,latestReentryUpdate} from './server/pvx-readiness-reentry-core.mjs';
import {projection} from './server/pvx-progress-center-core.mjs';

if(process.env.COVERAGEFIT_REGRESSION!=='1')assert.equal(fs.readFileSync('VERSION','utf8').trim(),'3.20.189');
assert.deepEqual(Object.keys(REENTRY_REASONS),['renewal_approaching','premium_changed','considering_comparison','ready_to_continue']);
const exact=reentryPlan('ready_to_continue',{resumeState:{exactStage:'home-profile',exactStep:'roof-age'}});assert.equal(exact.route,'/pvx/home-profile/');assert.equal(exact.exactStep,'roof-age');assert.equal(exact.readinessRefreshRequired,false);assert.equal(exact.changeScopeRequired,false);
const comparison=reentryPlan('considering_comparison',{resumeState:{exactStage:'continuation',exactStep:'choice'}});assert.equal(comparison.changeScopeRelevant,true);assert.equal(comparison.guardrails.leadCreated,false);assert.equal(comparison.guardrails.contactPlanCreated,false);

const token=`pvx_${'a'.repeat(43)}`,key=`pvx/checkpoint/${await hashToken(token)}`,records=new Map(),writes=[];
const original={createdAt:'2026-08-22T00:00:00.000Z',expiresAt:'2027-08-22T00:00:00.000Z',resumeState:{status:'active',exactStage:'policy-review',exactStep:'document-review',updatedAt:'2026-08-22T00:00:00.000Z'},leadCheckpoints:[{checkpointType:'snapshot_saved'}],producerContactRequests:[{requestId:'contact_1'}],contact:{purpose:'selected_topics'},consent:{contact:true},snapshot:{whatDylanWouldLookAtFirst:[]}};records.set(key,structuredClone(original));
const store={get:async id=>structuredClone(records.get(id)),setJSON:async(id,value)=>{records.set(id,structuredClone(value));writes.push(structuredClone(value));}};
const call=(reasonKey,exactWords='')=>handlePVXReadinessReentry(new Request('https://coveragefit.example/api/pvx/reentry',{method:'POST',headers:{Origin:'https://coveragefit.example','Content-Type':'application/json'},body:JSON.stringify({token,reasonKey,exactWords})}),{store,now:new Date('2026-08-22T01:00:00.000Z')});
let response=await call('renewal_approaching','My renewal is next month.');let body=await response.json();assert.equal(response.status,201);assert.equal(body.deltaCreated,true);assert.equal(body.plan.route,'/pvx/policy/');assert.equal(body.resumeState.exactStep,'document-review');assert.equal(writes.at(-1).leadCheckpoints.length,1);assert.equal(writes.at(-1).producerContactRequests.length,1);
response=await call('renewal_approaching','My renewal is next month.');body=await response.json();assert.equal(response.status,200);assert.equal(body.created,false);assert.equal(records.get(key).reentryUpdates.length,1);
response=await call('considering_comparison');body=await response.json();assert.equal(response.status,201);assert.equal(body.deltaCreated,false);assert.equal(body.plan.changeScopeRelevant,true);assert.equal(records.get(key).actionReadinessExpressions,undefined);assert.equal(records.get(key).changeScopeExpressions,undefined);
const latest=latestReentryUpdate(records.get(key));assert.equal(latest.reasonKey,'considering_comparison');assert.equal(latest.inferred,false);
const view=projection(records.get(key),token);assert.equal(view.latestReturnUpdate.reasonKey,'considering_comparison');assert.equal(view.readiness.inferred,false);
const html=fs.readFileSync('pvx/update/index.html','utf8'),client=fs.readFileSync('assets/js/pvx-life-event-view.js','utf8');assert.ok(html.includes('What brings you back today?'));assert.ok(html.includes('I’m ready to continue.'));assert.ok(html.includes('It is not required.'));assert.ok(client.includes('/api/pvx/reentry'));assert.ok(!client.includes('innerHTML'));
console.log(JSON.stringify({sprint:'CF-PVX-READY-LIVE-2.1',pass:true,checks:25}));
