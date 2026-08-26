import assert from 'node:assert/strict';
import fs from 'node:fs';
import {homeProfileDelta} from './server/pvx-insight-delta-core.mjs';

const version=Number(fs.readFileSync(new URL('./VERSION',import.meta.url),'utf8').trim().split('.').at(-1));
assert.ok(version>=156,'CF-PVX-INSIGHT-1.4 requires v3.20.156 or later');
const profile={
  physicalCharacteristics:{
    yearBuilt:{value:1988,source:'customer_confirmed',evidenceRefs:['home:yearBuilt']},
    livingArea:{value:1842,source:'property_source_reported',evidenceRefs:['property:livingArea']}
  },
  roof:{
    age:{value:null,source:'conflict',evidenceRefs:['customer:roofAge','property:roofAge']},
    material:{value:null,source:'unknown',evidenceRefs:[]}
  }
};
const delta=homeProfileDelta({advisoryReviewTopics:[]},profile,{stillNeeded:['roof.material']},[]);
assert.equal(delta.summary.confirmed,1);
assert.equal(delta.summary.added,1);
assert.equal(delta.summary.stillNeeded,1,'duplicate unknown/readiness references collapse to one still-needed item');
assert.equal(delta.summary.newTopics,0);
assert.equal(delta.guardrails.quoteReadinessIsEligibility,false);
assert.equal(delta.guardrails.recommendationCreated,false);
assert.equal(delta.guardrails.protectionScoreChanged,false);
console.log('CF-PVX-INSIGHT-1.4 QA: PASS');
