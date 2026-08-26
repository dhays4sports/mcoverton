import assert from 'node:assert/strict';import fs from 'node:fs';import {deriveRespectfulPathway} from './server/pvx-respectful-pathways-core.mjs';
if(process.env.COVERAGEFIT_REGRESSION!=='1')assert.equal(fs.readFileSync('VERSION','utf8').trim(),'3.20.181');
const price=deriveRespectfulPathway({discovery:{answers:{improvementPriorities:['price_only']}}});assert.equal(price.kind,'cost_focused');assert.match(price.customerNarrative,/Price is the priority/);assert.equal(price.createsTopic,false);assert.equal(price.createsRecommendation,false);assert.equal(price.affectsProtectionScore,false);
const loyal=deriveRespectfulPathway({currentRelationship:{tenure:{value:'25 years'},mustKeep:[]}});assert.equal(loyal.kind,'continuity');assert.match(loyal.customerNarrative,/preserve what is working/);assert.ok(!/outdated|deficien|underinsured/i.test(loyal.customerNarrative));
const explore=deriveRespectfulPathway({readiness:{state:'exploring'}});assert.equal(explore.kind,'exploring');assert.match(explore.customerNarrative,/own pace/);
const unsure=deriveRespectfulPathway({readiness:{state:'not_sure'}});assert.equal(unsure.kind,'not_sure');assert.match(unsure.customerNarrative,/complete answer/);assert.equal(unsure.negativeLabel,false);
const html=fs.readFileSync('pvx/snapshot/index.html','utf8');assert.ok(html.includes('pvxRespectfulPathway'));assert.ok(html.includes('pvx-respectful-pathways.js'));
console.log(JSON.stringify({sprint:'CF-PVX-READY-1.5',pass:true,checks:15}));
