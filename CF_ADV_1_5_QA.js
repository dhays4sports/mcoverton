#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const sha = rel => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, rel))).digest('hex');
const checks = [];
const check = (name, condition) => { assert(condition, name); checks.push(name); };

const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
check('release advances to CoverageFit 3.20.76', ['3.20.76','3.20.77','3.20.78','3.20.79','3.20.80','3.20.81','3.20.82','3.20.83'].includes(version) && pkg.version === version);
check('package remains compatible after CF-ADV-1.5', /CF-ADV-1\.(5|6|7|8|9|10|11|12)/.test(pkg.description));

const discovery = require('./assets/js/advisory-discovery-contract.js');
global.CoverageFitAdvisoryDiscoveryContract = discovery;
global.CoverageFitAssessmentContinuity = {
  getDraft() {
    return {
      advisoryOpening: { completed: true },
      advisoryRelationship: {
        completed: true,
        carrier: {
          key: 'known', value: 'State Farm', label: 'State Farm', source: 'coveragefit_assessment',
          evidenceRefs: [{ source:'coveragefit_assessment', key:'currentCarrier', label:'Who are you insured with now?' }]
        },
        tenure: {
          key: '10_plus', value: '10_plus', label: '10 years or more', source: 'coveragefit_assessment',
          evidenceRefs: [{ source:'coveragefit_assessment', key:'currentCarrierTenure', label:'How long have you been with your current company?' }]
        },
        likes: [{
          key: 'service', value: 'service', label: 'Customer service / responsiveness', source: 'coveragefit_assessment',
          evidenceRefs: [{ source:'coveragefit_assessment', key:'currentCarrierLikes', label:'What have you liked about your current insurance relationship?' }]
        }],
        wouldChange: [{
          key: 'price', value: 'price', label: 'Price / premium', source: 'coveragefit_assessment',
          evidenceRefs: [{ source:'coveragefit_assessment', key:'currentCarrierWouldChange', label:'If you could change one thing about your current insurance, what would it be?' }]
        }],
        mustKeep: [{
          key: 'service', value: 'service', label: 'Responsive service / support', source: 'coveragefit_assessment',
          evidenceRefs: [{ source:'coveragefit_assessment', key:'currentCarrierMustKeep', label:'What do you definitely want to keep?' }]
        }],
        completedAt: new Date().toISOString()
      }
    };
  },
  save() { return true; }
};
delete require.cache[require.resolve('./assets/js/advisory-relationship-discovery.js')];
const relationship = require('./assets/js/advisory-relationship-discovery.js');
const signals = require('./assets/js/advisory-signal-engine.js');
const workspace = require('./assets/js/advisory-workspace-data.js');

check('relationship runtime identifiers are versioned', relationship.VERSION === '1.0.0' && relationship.BUILD === 'CF-ADV-1.5' && relationship.CONTRACT_ID === 'coveragefit-current-relationship-discovery-v1');
check('relationship runtime API is frozen', Object.isFrozen(relationship));
check('tenure catalog has seven explicit choices', relationship.TENURES.length === 7);
for (const key of ['under_1','1_2','3_5','6_9','10_plus','unsure','prefer_not_to_answer']) {
  check(`tenure option ${key} exists`, relationship.TENURES.some(option => option.key === key));
}
check('likes catalog supports service as direct evidence', relationship.LIKES.some(option => option.key === 'service' && /service/i.test(option.label)));
check('likes catalog preserves explicit none', relationship.LIKES.some(option => option.key === 'none' && option.exclusive === true));
check('likes catalog preserves explicit unknown', relationship.LIKES.some(option => option.key === 'unsure' && option.explicitUnknown === true));
check('likes catalog preserves prefer-not-to-answer', relationship.LIKES.some(option => option.key === 'prefer_not_to_answer' && option.preferNotToAnswer === true));
check('would-change catalog distinguishes price', relationship.WOULD_CHANGE.some(option => option.key === 'price'));
check('would-change catalog distinguishes service', relationship.WOULD_CHANGE.some(option => option.key === 'service'));
check('would-change catalog can record satisfaction', relationship.WOULD_CHANGE.some(option => option.key === 'nothing'));
check('must-keep catalog includes service continuity', relationship.MUST_KEEP.some(option => option.key === 'service'));
check('must-keep catalog includes coverage continuity', relationship.MUST_KEEP.some(option => option.key === 'coverage'));
check('carrier supports explicit unknown state', relationship.CARRIER_STATES.some(option => option.key === 'unsure' && option.explicitUnknown === true));
check('carrier supports prefer-not-to-answer state', relationship.CARRIER_STATES.some(option => option.key === 'prefer_not_to_answer' && option.preferNotToAnswer === true));

const unsureCarrier = relationship.carrierRecord('unsure');
check('unknown carrier is stored explicitly rather than blank', unsureCarrier.value === 'unsure' && unsureCarrier.label === 'I’m not sure' && unsureCarrier.explicitUnknown === true);
const privateCarrier = relationship.carrierRecord('prefer_not_to_answer');
check('prefer-not-to-answer carrier is explicit', privateCarrier.value === 'prefer_not_to_answer' && privateCarrier.preferNotToAnswer === true);
const knownCarrier = relationship.carrierRecord('AAA');
check('known carrier preserves raw company name', knownCarrier.value === 'AAA' && knownCarrier.label === 'AAA');
check('known carrier is evidence-backed', knownCarrier.evidenceRefs.some(ref => ref.key === 'currentCarrier'));

const tenure = relationship.tenureRecord('10_plus');
check('tenure record preserves deterministic 10-plus key', tenure.value === '10_plus' && tenure.label === '10 years or more');
check('tenure record is evidence-backed', tenure.evidenceRefs.some(ref => ref.key === 'currentCarrierTenure'));
const unsureTenure = relationship.tenureRecord('unsure');
check('unknown tenure stays explicit', unsureTenure.value === 'unsure' && unsureTenure.explicitUnknown === true);
const noTenure = relationship.tenureRecord('prefer_not_to_answer');
check('tenure prefer-not-to-answer stays explicit', noTenure.value === 'prefer_not_to_answer' && noTenure.preferNotToAnswer === true);

const pendingOther = relationship.choiceRecord(relationship.LIKES, 'other', '', 'currentCarrierLikes', 'likes');
check('blank custom other remains a pending explicit selection', pendingOther.key === 'other' && pendingOther.label === '');
const customLike = relationship.choiceRecord(relationship.LIKES, 'other', 'They answer the phone when I call', 'currentCarrierLikes', 'likes');
check('custom like preserves customer wording', customLike.label === 'They answer the phone when I call');
check('custom like retains likes evidence key', customLike.evidenceRefs.some(ref => ref.key === 'currentCarrierLikes'));
const priceChange = relationship.choiceRecord(relationship.WOULD_CHANGE, 'price', '', 'currentCarrierWouldChange', 'change');
check('price problem remains a raw customer choice', priceChange.value === 'price' && priceChange.label === 'Price / premium');
const keepService = relationship.choiceRecord(relationship.MUST_KEEP, 'service', '', 'currentCarrierMustKeep', 'keep');
check('service preservation remains a raw customer choice', keepService.value === 'service' && /service/i.test(keepService.label));

check('restored relationship is complete', relationship.isComplete() === true);
const state = relationship.getState();
check('restored carrier remains direct assessment evidence', state.carrier.label === 'State Farm' && state.carrier.source === 'coveragefit_assessment');
check('restored tenure remains explicit', state.tenure.key === '10_plus');
check('restored likes remain distinct from would-change', state.likes[0].key === 'service' && state.wouldChange[0].key === 'price');
check('restored must-keep is preserved', state.mustKeep[0].key === 'service');

const profile = relationship.getDiscoveryProfile();
check('relationship emits existing discovery contract', profile.contractId === discovery.CONTRACT_ID && profile.schemaVersion === discovery.SCHEMA_VERSION);
check('relationship stores carrier in currentRelationship', profile.currentRelationship.carrier.value === 'State Farm');
check('relationship stores tenure in currentRelationship', profile.currentRelationship.tenure.value === '10_plus');
check('relationship stores likes in currentRelationship', profile.currentRelationship.likes.some(item => item.value === 'service'));
check('relationship stores wouldChange in currentRelationship', profile.currentRelationship.wouldChange.some(item => item.value === 'price'));
check('relationship stores mustKeep in currentRelationship', profile.currentRelationship.mustKeep.some(item => item.value === 'service'));
check('relationship does not create recommendation responses', profile.recommendationResponses.length === 0);
check('relationship does not create recommendation anchors', profile.recommendationAnchors.length === 0);
check('relationship does not itself create signals', profile.customerSignals.length === 0);

const signaled = signals.apply(profile);
const incumbent = signaled.customerSignals.find(signal => signal.key === 'incumbentRelationship.strong');
check('qualifying tenure plus explicit service preference activates existing signal', Boolean(incumbent && incumbent.status === 'active'));
check('strong-incumbent signal retains tenure evidence', incumbent.evidenceRefs.some(ref => ref.key === 'currentCarrierTenure'));
check('strong-incumbent signal retains service-like evidence', incumbent.evidenceRefs.some(ref => ref.key === 'currentCarrierLikes'));

let unknownProfile = discovery.create({
  product:'home',
  currentRelationship:{
    tenure:{value:'unsure',label:"I'm not sure",source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'currentCarrierTenure',label:'tenure'}]},
    likes:[{value:'service',label:'Customer service / responsiveness',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'currentCarrierLikes',label:'likes'}]}]
  }
});
unknownProfile = signals.apply(unknownProfile);
check('unknown tenure does not activate strong-incumbent signal', !unknownProfile.customerSignals.some(signal => signal.key === 'incumbentRelationship.strong'));

let privateProfile = discovery.create({
  product:'home',
  currentRelationship:{
    tenure:{value:'prefer_not_to_answer',label:'Prefer not to answer',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'currentCarrierTenure',label:'tenure'}]},
    likes:[{value:'prefer_not_to_answer',label:'Prefer not to answer',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'currentCarrierLikes',label:'likes'}]}]
  }
});
privateProfile = signals.apply(privateProfile);
check('prefer-not-to-answer does not become positive relationship evidence', !privateProfile.customerSignals.some(signal => signal.key === 'incumbentRelationship.strong'));

const summary = relationship.getRelationshipSummary();
check('relationship summary distinguishes price issue from service strength', summary.wouldChange.includes('Price / premium') && summary.likes.includes('Customer service / responsiveness'));
check('relationship summary exposes do-not-break context', summary.mustKeep.includes('Responsive service / support'));

const wsSnapshot = workspace.getSnapshot({
  workspaceData: { getSnapshot: () => ({ product:'home', source:{consultationId:'cfadv15-fixture'} }) },
  report: { discoveryProfile: profile },
  contract: discovery
});
check('Workspace advisory adapter retains current relationship profile', wsSnapshot.discoveryProfile.currentRelationship.carrier.value === 'State Farm');
check('Workspace advisory adapter retains price problem', wsSnapshot.discoveryProfile.currentRelationship.wouldChange.some(item => item.value === 'price'));
check('Workspace advisory adapter retains must-keep context', wsSnapshot.discoveryProfile.currentRelationship.mustKeep.some(item => item.value === 'service'));

global.CoverageFitPersonalization = { get: () => ({ flags:{hasProfile:true}, journey:{ currentCarrierTenure:'12 years' } }) };
global.CoverageFitAssessmentPrefill = { applied:true, profile:{ currentCarrier:'AAA', currentCarrierTenure:'12 years' } };
global.CoverageFitConversionHandoff = { get: () => ({ flags:{trustedContract:true} }) };
const trusted = relationship.trustedContext();
check('trusted carrier is inherited from connected intake', trusted.carrier?.label === 'AAA' && trusted.carrier.inherited === true);
check('trusted carrier retains 408FARMERS source', trusted.carrier?.source === '408farmers_handoff');
check('trusted carrier retains currentCarrier evidence', trusted.carrier?.evidenceRefs.some(ref => ref.key === 'currentCarrier'));
check('trusted tenure maps 12 years to 10-plus', trusted.tenure?.key === '10_plus' && trusted.tenure.inherited === true);
check('trusted tenure retains currentCarrierTenure evidence', trusted.tenure?.evidenceRefs.some(ref => ref.key === 'currentCarrierTenure'));

global.CoverageFitPersonalization = { get: () => ({ flags:{hasProfile:false}, journey:{ currentCarrier:'stale' } }) };
global.CoverageFitAssessmentPrefill = { applied:false, profile:{ currentCarrier:'stale' } };
global.CoverageFitConversionHandoff = { get: () => ({ flags:{trustedContract:false} }) };
const untrusted = relationship.trustedContext();
check('untrusted carrier context is not silently inherited', untrusted.carrier === null && untrusted.tenure === null);

const html = read('assessment/index.html');
check('assessment includes relationship stylesheet', html.includes('/assets/css/advisory-relationship.css'));
check('relationship section follows opening and precedes quiz', html.indexOf('id="advisoryRelationship"') > html.indexOf('id="advisoryOpening"') && html.indexOf('id="advisoryRelationship"') < html.indexOf('id="quiz"'));
check('relationship UI frames incumbent value positively', html.includes('What already works for you?'));
check('relationship UI contains current carrier question', html.includes('Who are you insured with now?'));
check('relationship UI contains tenure question', html.includes('How long have you been with your current company?'));
check('relationship UI contains likes question', html.includes('What have you liked about them?'));
check('relationship UI contains would-change question', html.includes('If you could change one thing about your current insurance, what would it be?'));
check('relationship UI contains must-keep question', html.includes('What do you definitely want to keep?'));
check('relationship UI visibly rejects loyalty-as-defect framing', html.includes('Loyalty is not a problem to fix'));
check('relationship UI visibly states score boundary', html.includes('none of these answers change your Protection Score'));
check('relationship UI supports connected carrier without repetition', html.includes('id="advisoryConnectedCarrier"') && html.includes('id="advisoryEditCarrierBtn"'));
check('relationship UI supports connected tenure without repetition', html.includes('id="advisoryConnectedTenure"') && html.includes('id="advisoryEditTenureBtn"'));
check('relationship UI exposes unknown carrier state', html.includes('name="advisory_carrier_state" value="unsure"'));
check('relationship UI exposes prefer-not-to-answer carrier state', html.includes('name="advisory_carrier_state" value="prefer_not_to_answer"'));
check('relationship UI exposes all tenure values', relationship.TENURES.every(option => html.includes(`name="advisory_tenure" value="${option.key}"`)));
check('relationship UI exposes all likes values', relationship.LIKES.every(option => html.includes(`name="advisory_likes" value="${option.key}"`)));
check('relationship UI exposes all would-change values', relationship.WOULD_CHANGE.every(option => html.includes(`name="advisory_would_change" value="${option.key}"`)));
check('relationship UI exposes all must-keep values', relationship.MUST_KEEP.every(option => html.includes(`name="advisory_must_keep" value="${option.key}"`)));
check('relationship custom fields are bounded', ['advisoryLikesOther','advisoryChangeOther','advisoryKeepOther'].every(id => html.includes(`id="${id}"`) ) && (html.match(/maxlength="300"/g) || []).length >= 4);
check('relationship script loads after opening', html.indexOf('/assets/js/advisory-relationship-discovery.js') > html.indexOf('/assets/js/advisory-opening.js'));
check('relationship script loads before property confirmation', html.indexOf('/assets/js/advisory-relationship-discovery.js') < html.indexOf('/assets/js/property-confirmation.js'));
check('relationship script loads before assessment engine', html.indexOf('/assets/js/advisory-relationship-discovery.js') < html.indexOf('/assets/js/assessment-engine.js'));

const runtime = read('assets/js/advisory-relationship-discovery.js');
check('relationship runtime has no Protection Score dependency', !runtime.includes('CoverageFitProtectionScore') && !runtime.includes('protection-score'));
check('relationship runtime has no recommendation-engine dependency', !runtime.includes('CoverageFitRecommendationEngine') && !runtime.includes('recommendation-engine'));
check('relationship runtime writes only existing advisory discovery contract', runtime.includes('CoverageFitAdvisoryDiscoveryContract') && runtime.includes('currentRelationship'));
check('relationship runtime persists dedicated continuity state', runtime.includes('advisoryRelationship: draftValue()'));
check('relationship runtime emits completion event', runtime.includes('coveragefit:advisory-relationship-completed'));
check('relationship runtime stores custom wording as customer statements', runtime.includes('customerStatements: customStatements'));
check('relationship runtime enforces exclusive unknown/none multiselect behavior', runtime.includes('option.exclusive') && runtime.includes('candidate?.exclusive'));

const openingRuntime = read('assets/js/advisory-opening.js');
check('opening hands off to relationship step when available', openingRuntime.includes('CoverageFitAdvisoryRelationshipDiscovery?.start'));
check('opening does not expose quiz underneath active relationship, lifestyle, or outcome step', openingRuntime.includes("(relationshipStarted || lifestyleStarted || outcomeStarted) ? 'none' : ''"));

const propertyRuntime = read('assets/js/property-confirmation.js');
check('property confirmation knows relationship step', propertyRuntime.includes('CoverageFitAdvisoryRelationshipDiscovery'));
check('property flow tries opening before relationship', propertyRuntime.indexOf('advisoryOpening?.start') < propertyRuntime.indexOf('advisoryRelationship?.start'));
check('property resume can enter relationship step', propertyRuntime.includes("advisoryRelationship?.start?.({ resume: true"));

const assessment = read('assets/js/assessment-engine.js');
check('assessment engine reads relationship discovery additively', assessment.includes('const advisoryRelationship = window.CoverageFitAdvisoryRelationshipDiscovery || null;'));
check('assessment merges relationship discovery into discovery profile', assessment.includes('advisoryDiscovery.merge(discoveryProfile, relationshipDiscovery)'));
check('relationship merge occurs before signal derivation', assessment.indexOf('advisoryDiscovery.merge(discoveryProfile, relationshipDiscovery)') < assessment.indexOf('advisorySignals.apply(discoveryProfile)'));
check('relationship merge occurs before recommendation anchoring', assessment.indexOf('advisoryDiscovery.merge(discoveryProfile, relationshipDiscovery)') < assessment.indexOf('advisoryAnchors.apply(discoveryProfile'));
check('retake resets relationship direct answers', assessment.includes("advisoryRelationship?.reset?.({ preserveInherited: true })"));
check('assessment records relationship completion without score change', assessment.includes("window.addEventListener('coveragefit:advisory-relationship-completed'") && assessment.includes('scoreFormulaChanged: false'));

const continuity = read('assets/js/assessment-continuity.js');
check('continuity recognizes incomplete relationship stage', continuity.includes('relationshipPending'));
check('resume copy identifies saved current-insurance context', continuity.includes('Your current-insurance context is saved'));
check('resume scroll can target relationship step', continuity.includes('#advisoryRelationship:not([hidden])'));

const css = read('assets/css/advisory-relationship.css');
check('relationship UI has mobile layout', css.includes('@media(max-width:760px)') && css.includes('.advisory-choice-grid--compact{grid-template-columns:1fr}'));
check('relationship text input has visible focus treatment', css.includes('.advisory-relationship__text-input:focus'));
check('relationship compact controls preserve 44px touch target', css.includes('min-height:44px'));
check('relationship mobile text inputs preserve 16px form sizing', css.includes('font-size:16px'));
check('relationship minor controls have focus-visible treatment', css.includes('input:focus-visible+span'));
check('relationship UI honors reduced motion', css.includes('@media(prefers-reduced-motion:reduce)'));

check('Protection Score implementation remains byte-compatible', sha('assets/js/protection-score.js') === '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8');
check('recommendation engine remains byte-compatible', sha('assets/js/recommendation-engine.js') === '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18');
check('home recommendation rules remain byte-compatible', sha('assets/js/home-recommendation-rules.js') === '0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629');
check('legacy Workspace adapter remains byte-compatible', sha('assets/js/workspace-data.js') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');

const contractJson = JSON.parse(read('CF_ADV_1_5_RELATIONSHIP_CONTRACT.json'));
check('relationship JSON contract matches runtime', contractJson.contractId === relationship.CONTRACT_ID && contractJson.contractVersion === relationship.VERSION && contractJson.build === relationship.BUILD && contractJson.release === '3.20.76');
check('relationship JSON contract uses existing discovery store', contractJson.output.store === 'discoveryProfile.currentRelationship' && contractJson.output.parallelStoreCreated === false);
check('relationship JSON contract documents all five question outcomes', contractJson.output.fields.includes('carrier') && contractJson.output.fields.includes('tenure') && contractJson.output.fields.includes('likes') && contractJson.output.fields.includes('wouldChange') && contractJson.output.fields.includes('mustKeep'));
check('relationship JSON contract protects explicit unknown states', contractJson.traceability.unknownsAreExplicit === true && contractJson.traceability.preferNotToAnswerIsExplicit === true);
check('relationship JSON contract protects zero-repeat', contractJson.zeroRepeat.trustedCarrierIsReaskedByDefault === false && contractJson.zeroRepeat.connectedValuesVisible === true && contractJson.zeroRepeat.customerCanCorrect === true);
check('relationship JSON contract prohibits score impact', contractJson.protectedBoundaries.affectsProtectionScore === false && contractJson.protectedBoundaries.changesQuestionWeights === false && contractJson.protectedBoundaries.changesAnswerImpacts === false);
check('relationship JSON contract prohibits recommendation creation/reranking', contractJson.protectedBoundaries.createsRecommendationTopics === false && contractJson.protectedBoundaries.changesRecommendationRanking === false);
check('relationship JSON contract documents loyalty as non-defect', contractJson.dontBreakContext.loyaltyIsNotNegative === true);

const roadmap = read('CF-ADV-ROADMAP.md');
check('roadmap marks CF-ADV-1.5 complete', roadmap.includes('CF-ADV-1.5 — Current Relationship Discovery — COMPLETE'));
check('roadmap advances to CF-ADV-1.6', roadmap.includes('Next: `CF-ADV-1.6 — Lifestyle & Dependency Discovery`'));
check('roadmap resumption instructions include relationship contract', roadmap.includes('CF_ADV_1_5_RELATIONSHIP_CONTRACT.json'));
check('roadmap remains complete through certification', roadmap.includes('CF-ADV-2.5') && roadmap.includes('CF-ADV-3.3'));

console.log(JSON.stringify({ suite:'CF-ADV-1.5', pass:true, checkCount:checks.length, checks }, null, 2));
