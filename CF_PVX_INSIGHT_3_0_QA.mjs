import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),topics=require('./assets/js/pvx-review-topic-engine.js'),snapshot=require('./assets/js/pvx-snapshot-model.js');
const cases=[
  {answers:{}},
  {answers:{stayIntent:'long_term'}},
  {answers:{stayIntent:'long_term',improvementPriorities:['agent_access']}},
  {answers:{stayIntent:'long_term',improvementPriorities:['agent_access'],otherProperties:'rental',ownershipDuration:'10_plus',upgradeSummary:'yes_major'}}
];
cases.forEach((discovery,index)=>{const found=topics.derive(discovery,{}),model=snapshot.derive(discovery,found);assert.equal(model.signalSurface.topicCount,index);assert.equal(model.whatDylanWouldLookAtFirst.length,index);assert(model.whatDylanWouldLookAtFirst.every((topic,position)=>topic.scanOrder===position+1&&topic.recommendation===false));assert.equal(model.contactRequiredToView,false);assert.equal(model.anonymousPreview,true);});
const html=fs.readFileSync('pvx/snapshot/index.html','utf8'),foundation=fs.readFileSync('assets/css/pvx-experience-foundation.css','utf8'),results=fs.readFileSync('assets/css/pvx-snapshot-results.css','utf8'),insight=fs.readFileSync('assets/css/pvx-insight-snapshot.css','utf8'),topicCards=fs.readFileSync('assets/js/pvx-review-topic-cards.js','utf8'),discovery=fs.readFileSync('assets/js/pvx-discovery.js','utf8'),checkpoint=fs.readFileSync('assets/js/pvx-checkpoint-view.js','utf8'),resume=fs.readFileSync('server/pvx-web-journey-core.mjs','utf8');
for(const id of['Your CoverageFit','pvxSnapshotCount','pvxSnapshotPrimaryLabel','pvxSnapshotPrimaryBecause','pvx-snapshot-primary-action'])assert(html.includes(id));
assert(html.indexOf('Your CoverageFit')<html.indexOf('pvxSnapshotCount'));assert(html.indexOf('pvxSnapshotCount')<html.indexOf('pvxSnapshotPrimaryLabel'));assert(html.indexOf('pvxSnapshotPrimaryBecause')<html.indexOf('pvxSnapshotContent'));
assert.match(foundation,/min-height:\s*44px/);assert.match(foundation,/font-size:\s*16px/);assert.match(foundation,/prefers-reduced-motion/);assert.match(results,/@media\(max-width:640px\)/);assert.match(insight,/width:\s*100%/);assert.match(topicCards,/aria-label="Review order/);
assert.match(html,/Skip to your Snapshot/);assert.match(topicCards,/<details/);assert.match(discovery,/pvxDiscoveryBack/);assert.match(checkpoint,/pvxContinueWithoutSave/);assert.match(checkpoint,/reportSaved:false,contact:false/);assert.match(resume,/HttpOnly; Secure; SameSite=Lax/);assert.match(resume,/resolvePvxWebDestination/);
const cert=fs.readFileSync('CONSUMER_INFORMATION_SURFACE_CERTIFICATION.md','utf8');assert.match(cert,/deferred to controlled production pilot telemetry/);assert.doesNotMatch(cert,/under three minutes.*passed/i);
console.log('CF-PVX-INSIGHT-3.0 QA: PASS');
