import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { mapWebToPvx, validateWebPvxMapping } from './server/web-pvx-mapping-core.mjs';
import { createOrReusePvxWebJourney, resolvePvxWebDestination, pvxWebResumeCookie } from './server/pvx-web-journey-core.mjs';
import { authorizeIdentityReconciliation } from './server/pvx-web-reconciliation-core.mjs';
import { projectUnifiedProducerRecord } from './server/pvx-unified-producer-record-core.mjs';

const require = createRequire(import.meta.url);
const read = file => fs.readFileSync(file, 'utf8');
const version = read('VERSION').trim();
const farmers = process.env.FARMERS408_ROOT || path.resolve('../408farmers');
assert.match(version, /^3\.20\.\d+$/);
assert.ok(Number(version.split('.')[2]) >= 151);
assert.equal(JSON.parse(read('package.json')).version, version);
assert.equal(fs.existsSync(path.join(farmers, 'handoff-manifest.json')), true);

const cases = [
  ['homepage','start_snapshot','shoppingReason'],
  ['home','review_owned_home','shoppingReason'],
  ['buyer','buying_home','improvementPriorities'],
  ['home_auto','review_home_auto','improvementPriorities'],
  ['professional','review_professional_home','shoppingReason'],
  ['qr','start_snapshot','shoppingReason'],
  ['flyer','start_snapshot','shoppingReason']
];
for (const [entry_type,customer_selection,next] of cases) {
  const mapped = mapWebToPvx({ entry_type, customer_selection, route_path:`/${entry_type}/`, campaign_id:'campaign_context_only' });
  assert.equal(validateWebPvxMapping(mapped).valid, true);
  assert.equal(mapped.discovery.currentQuestionId, next);
  assert.equal(mapped.semantics.discoveryAffectsProtectionScore, false);
  assert.equal(mapped.consent.contact, false);
}

class Store { constructor(){this.map=new Map()} async get(key){return structuredClone(this.map.get(String(key))||null)} async setJSON(key,value,options={}){if(options.onlyIfNew&&this.map.has(String(key)))throw new Error('duplicate');this.map.set(String(key),structuredClone(value))} }
const store = new Store();
const first = await createOrReusePvxWebJourney({bootstrap_id:'pvxb_finalacceptance1',entry_type:'buyer',customer_selection:'buying_home',route_path:'/buyer/'},{store,sourceOrigin:'https://408farmers.com',now:new Date('2026-08-21T12:00:00Z')});
const replay = await createOrReusePvxWebJourney({bootstrap_id:'pvxb_finalacceptance1',entry_type:'buyer',customer_selection:'buying_home',route_path:'/buyer/'},{store,sourceOrigin:'https://408farmers.com',now:new Date('2026-08-21T12:01:00Z')});
assert.equal(first.record.journeyId,replay.record.journeyId);
assert.equal(replay.reused,true);
assert.equal(resolvePvxWebDestination(first.record),'/pvx/start/');
assert.match(pvxWebResumeCookie(first.token),/HttpOnly; Secure; SameSite=Lax/);

const discovery = require('./assets/js/pvx-discovery.js');
const topics = require('./assets/js/pvx-review-topic-engine.js');
const snapshotModel = require('./assets/js/pvx-snapshot-model.js');
let profile = discovery.initialState();
const answers = {shoppingReason:'buying_home',improvementPriorities:['understanding'],ownershipDuration:'buying_now',stayIntent:'long_term',upgradeSummary:'some',otherProperties:'none',claimExperience:'none',permissionToAdvise:'yes'};
for (const [question,value] of Object.entries(answers)) profile=discovery.captureAnswer(profile,question,value);
profile=discovery.completeProfile(profile,'2026-08-21T12:02:00Z');
const reviewTopics=topics.derive(profile);
const snapshot=snapshotModel.derive(profile,reviewTopics);
assert.equal(snapshot.title,'Your CoverageFit Snapshot');
assert.equal(snapshot.contactRequiredToView,false);
assert.equal(snapshot.recommendations.length,0);
assert.equal(snapshot.policyFindings.length,0);
assert.ok(snapshot.whatDylanWouldLookAtFirst.length<=3);

const scoredReview=require('./assets/js/pvx-policy-scored-review.js');
assert.equal(scoredReview.review({policyProfile:{}}).scoreAvailable,false);
assert.equal(scoredReview.review({policyProfile:{documents:[{id:'doc'}]}}).scoreAvailable,true);
const identity=authorizeIdentityReconciliation({phoneMatch:true,emailMatch:true});
assert.equal(identity.merge,false);
const producer=projectUnifiedProducerRecord({checkpointId:'cp',snapshot,consent:{reportSaved:true,contact:false},contact:{name:'Hidden'},leadCheckpoints:[{checkpointType:'snapshot_saved',reportRevision:'1'}],authorization:{bindAuthorized:false}},{journeyId:first.record.journeyId,currentStage:'snapshot_saved',seed:first.record.seed},null);
assert.deepEqual(producer.contact,{});
assert.equal(producer.latestReportRevision,'1');
assert.equal(producer.ownership.silentlyReassigned,false);

const manifest=JSON.parse(fs.readFileSync(path.join(farmers,'handoff-manifest.json'),'utf8'));
assert.match(manifest.nativeWebConvergence.integrationRelease,/^408-CF-PVX-(?:WEB-2\.5|HOOK-1\.[0-3])$/);
assert.ok(Number(manifest.nativeWebConvergence.receiver.split('.').at(-1))>=151);
assert.equal(manifest.nativeWebConvergence.liveConfigurationChanged,false);
for (const file of ['assessment/index.html','assets/js/protection-score.js','agent/workspace/index.html','pvx/snapshot/index.html','pvx/home-profile/index.html','pvx/policy/index.html','sms/continue/index.html']) assert.equal(fs.existsSync(file),true,file);
const deployment=JSON.parse(read('wrangler.example.jsonc'));
assert.equal(deployment.d1_databases[0].binding,'COVERAGEFIT_DB');
assert.equal(deployment.r2_buckets[0].binding,'POLICY_FILES');
assert.ok(deployment.secrets.required.includes('COVERAGEFIT_PRODUCER_ACCESS_TOKEN'));
console.log(JSON.stringify({sprint:'408-CF-PVX-WEB-2.5',pass:true,checks:59,entries:cases.length}));
