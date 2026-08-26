import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SIGNAL_CLASSES, INSIGHT_DELTA_STATES, snapshotSignalSurface, validInsightDelta } from './server/pvx-meaningful-signal-core.mjs';

assert.ok(Number(fs.readFileSync('VERSION', 'utf8').trim().split('.')[2]) >= 152);
assert.equal(Object.keys(SIGNAL_CLASSES).length, 12);
assert.deepEqual(INSIGHT_DELTA_STATES, ['added','confirmed','changed','resolved','still_needed','removed_due_to_stale_evidence']);
const topic = { topicKey:'rebuild', label:'Rebuilding assumptions', status:'worth_reviewing', recommendation:false, evidenceRefs:['upgradeSummary'], becauseYouToldUs:'You updated the home.' };
const surface = snapshotSignalSurface({ whatDylanWouldLookAtFirst:[topic, topic, {...topic,topicKey:'service',label:'Service'}, {...topic,topicKey:'cost',label:'Cost'}, {...topic,topicKey:'extra',label:'Extra'}] });
assert.equal(surface.topicCount, 3);
assert.equal(surface.countLabel, '3 areas worth reviewing');
assert.deepEqual(surface.topics.map(item => item.scanLabel), ['01','02','03']);
assert.equal(surface.numberingMeaning, 'scan_order_only');
assert.equal(surface.guardrails.policyDeficiencyFound, false);
assert.equal(validInsightDelta({state:'added',key:'roof',evidenceRefs:['roof.age'],recommendation:false}), true);
assert.equal(validInsightDelta({state:'added',key:'roof',evidenceRefs:[],recommendation:false}), false);
assert.equal(validInsightDelta({state:'added',key:'roof',evidenceRefs:['roof.age'],recommendation:true}), false);
console.log(JSON.stringify({sprint:'CF-PVX-INSIGHT-1.0',pass:true,checks:13}));
