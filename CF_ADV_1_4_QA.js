const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const checks = [];
const check = (name, condition) => { if (!condition) throw new Error(`FAIL: ${name}`); checks.push(name); };

const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
check('release remains compatible after CoverageFit 3.20.75', ['3.20.75','3.20.76','3.20.77','3.20.78','3.20.79','3.20.80','3.20.81','3.20.82','3.20.83'].includes(version) && pkg.version === version);
check('CF-ADV-1.4 sprint record remains present after later advisory releases', /CF-ADV-1\.4/.test(read('SPRINT-CF-ADV-1.4.md')));

const discovery = require('./assets/js/advisory-discovery-contract.js');
global.CoverageFitAssessmentContinuity = {
  getDraft() {
    return {
      advisoryOpening: {
        completed: true,
        reason: {
          key: 'coverage_check', value: 'coverage_check', label: 'I want to make sure I’m properly covered', source: 'coveragefit_assessment',
          evidenceRefs: [{ source: 'coveragefit_assessment', key: 'reasonForReview', label: 'What’s bringing you here today?' }]
        },
        priority: {
          key: 'balance', value: 'balance', label: 'Find the right balance', source: 'coveragefit_assessment',
          evidenceRefs: [{ source: 'coveragefit_assessment', key: 'primaryPriority', label: 'What matters most in this review?' }]
        }
      }
    };
  },
  save() { return true; }
};
const opening = require('./assets/js/advisory-opening.js');
const signals = require('./assets/js/advisory-signal-engine.js');
const anchors = require('./assets/js/advisory-recommendation-anchor-contract.js');

check('opening runtime identifiers are versioned', opening.VERSION === '1.0.0' && opening.BUILD === 'CF-ADV-1.4' && opening.CONTRACT_ID === 'coveragefit-advisory-opening-v1');
check('opening exposes exactly eight reason choices', opening.REASONS.length === 8);
check('opening exposes exactly four priority choices', opening.PRIORITIES.length === 4);
for (const key of ['price_increase','comparing_options','buying_home','renewal_coming','unhappy_current','coverage_check','life_change','other']) {
  check(`reason option ${key} exists`, opening.REASONS.some(option => option.key === key));
}
for (const key of ['price','balance','protection','unsure']) {
  check(`priority option ${key} exists`, opening.PRIORITIES.some(option => option.key === key));
}

check('premium wording maps to price increase reason', opening.reasonKeyForText('My premium went up again') === 'price_increase');
check('home purchase wording maps to buying-home reason', opening.reasonKeyForText('I am purchasing a new home') === 'buying_home');
check('renewal wording maps to renewal reason', opening.reasonKeyForText('My renewal is coming up') === 'renewal_coming');
check('coverage-fit wording maps to coverage-check reason', opening.reasonKeyForText('I want to make sure I am properly covered') === 'coverage_check');
check('unrecognized wording fails to bounded other reason', opening.reasonKeyForText('A unique personal reason') === 'other');
check('price preference classifier is deterministic', opening.priorityKeyForText('Keep my cost down') === 'price');
check('balance preference classifier is deterministic', opening.priorityKeyForText('Find the right balance') === 'balance');
check('protection preference classifier is deterministic', opening.priorityKeyForText('Strong practical protection') === 'protection');
check('explicit uncertainty remains uncertainty', opening.priorityKeyForText("I'm not sure yet") === 'unsure');

const directReason = opening.recordFromReason('buying_home');
check('direct reason is stored as assessment evidence', directReason.source === 'coveragefit_assessment' && directReason.evidenceRefs[0].key === 'reasonForReview');
check('direct reason preserves customer-visible wording', directReason.label === 'I’m buying a home');
const otherReason = opening.recordFromReason('other', 'My escrow officer asked me to review it');
check('other reason preserves customer raw wording', otherReason.label === 'My escrow officer asked me to review it');
check('empty other reason remains incomplete rather than invented', opening.recordFromReason('other', '').label === '');
const directPriority = opening.recordFromPriority('balance');
check('direct priority is stored as assessment evidence', directPriority.source === 'coveragefit_assessment' && directPriority.evidenceRefs[0].key === 'primaryPriority');

check('restored completed opening is recognized', opening.isComplete() === true);
const state = opening.getState();
check('restored reason remains direct customer evidence', state.reason.key === 'coverage_check' && state.reason.inherited === false);
check('restored priority remains explicit', state.priority.key === 'balance');
const profile = opening.getDiscoveryProfile();
check('opening emits the existing advisory discovery contract', profile.contractId === discovery.CONTRACT_ID && profile.schemaVersion === discovery.SCHEMA_VERSION);
check('opening stores reasonForReview', profile.reasonForReview.value === 'coverage_check' && profile.reasonForReview.label.includes('properly covered'));
check('opening stores primaryPriority', profile.primaryPriority.value === 'balance' && profile.primaryPriority.label === 'Find the right balance');
check('opening preserves reason wording as customer statement', profile.customerStatements.some(statement => statement.text === 'I want to make sure I’m properly covered'));
check('reason statement is evidence-backed', profile.customerStatements[0].evidenceRefs.some(ref => ref.key === 'reasonForReview'));
check('opening does not create recommendation reactions', profile.recommendationResponses.length === 0);
check('opening does not create recommendation anchors itself', profile.recommendationAnchors.length === 0);

const signaled = signals.apply(profile);
check('balance priority produces existing CF-ADV-1.2 tradeoff signal', signaled.customerSignals.some(signal => signal.key === 'tradeoffPreference.balanced' && signal.status === 'active'));
check('tradeoff signal retains primary-priority evidence', signaled.customerSignals.find(signal => signal.key === 'tradeoffPreference.balanced').evidenceRefs.some(ref => ref.key === 'primaryPriority'));
const anchored = anchors.build(signaled, [{ name:'Water-Loss Terms', tag:'Water-Loss Terms', insight:'Review water terms', question:'How does the policy handle water?' }])[0];
check('existing eligible recommendation can use opening tradeoff signal', anchored.personalized === true && anchored.supportingSignalKeys.includes('tradeoffPreference.balanced'));
check('opening preference does not manufacture recommendation topics', anchors.build(signaled, []).length === 0);

let unsure = discovery.create({ product:'home', primaryPriority:{ value:'unsure', label:'I’m not sure yet', source:'coveragefit_assessment', evidenceRefs:[{source:'coveragefit_assessment',key:'primaryPriority',label:'priority'}] } });
unsure = signals.apply(unsure);
check('explicit unsure priority creates no inferred tradeoff preference', !unsure.customerSignals.some(signal => signal.key.startsWith('tradeoffPreference.')));

// Trusted 408FARMERS context is resolved at call time so future connected fields remain zero-repeat compatible.
global.CoverageFitPersonalization = { get: () => ({ flags:{hasProfile:true}, journey:{ reviewReason:'Buying a home before closing', homeReviewGoal:'coverage_fit' } }) };
global.CoverageFitAssessmentPrefill = { applied:true, reviewContext:'Buying a home before closing', profile:{ primaryPriority:'Keep my cost down' } };
global.CoverageFitConversionHandoff = { get: () => ({ flags:{trustedContract:true} }) };
const trusted = opening.trustedContext();
check('trusted handoff reason is inherited rather than re-authored', trusted.reason.inherited === true && trusted.reason.label === 'Buying a home before closing');
check('trusted handoff reason uses 408FARMERS source', trusted.reason.source === '408farmers_handoff');
check('trusted handoff reason retains intake evidence', trusted.reason.evidenceRefs.some(ref => ref.key === 'reviewContext'));
check('trusted future priority can also be inherited', trusted.priority.inherited === true && trusted.priority.key === 'price');
check('trusted future priority retains priority evidence', trusted.priority.evidenceRefs.some(ref => ref.key === 'primaryPriority'));

global.CoverageFitPersonalization = { get: () => ({ flags:{hasProfile:true}, journey:{ homeReviewGoal:'farmers_fit' } }) };
global.CoverageFitAssessmentPrefill = { applied:true, profile:{} };
const goalOnly = opening.trustedContext();
check('bounded 408 homeReviewGoal can supply reason when reviewContext is absent', goalOnly.reason.label === 'See whether Farmers may be worth comparing' && goalOnly.reason.evidenceRefs.some(ref => ref.key === 'homeReviewGoal'));

global.CoverageFitPersonalization = { get: () => ({ flags:{hasProfile:false}, journey:{ reviewReason:'stale local text' } }) };
global.CoverageFitAssessmentPrefill = { applied:false, profile:null };
global.CoverageFitConversionHandoff = { get: () => ({ flags:{trustedContract:false} }) };
const untrusted = opening.trustedContext();
check('untrusted context is not silently treated as connected customer fact', untrusted.reason === null && untrusted.priority === null);

const html = read('assessment/index.html');
check('assessment includes advisory opening stylesheet', html.includes('/assets/css/advisory-opening.css'));
check('assessment includes advisory opening section before quiz', html.indexOf('id="advisoryOpening"') > html.indexOf('data-property-confirmation') && html.indexOf('id="advisoryOpening"') < html.indexOf('id="quiz"'));
check('opening UI contains all eight reason radio values', opening.REASONS.every(option => html.includes(`name="advisory_reason" value="${option.key}"`)));
check('opening UI contains all four priority radio values', opening.PRIORITIES.every(option => html.includes(`name="advisory_priority" value="${option.key}"`)));
check('opening UI visibly states score boundary', html.includes('These answers do not change your Protection Score.'));
check('opening UI supports connected reason without repetition', html.includes('id="advisoryConnectedReason"') && html.includes('We’ll carry this forward so you do not have to repeat yourself.'));
check('opening UI supports connected priority without repetition', html.includes('id="advisoryConnectedPriority"') && html.includes('advisoryEditPriorityBtn'));
check('opening UI lets customer correct connected reason', html.includes('id="advisoryEditReasonBtn"'));
check('other reason has a bounded free-text field', html.includes('id="advisoryOtherReason"') && html.includes('maxlength="300"'));
check('opening script loads after discovery contract', html.indexOf('/assets/js/advisory-opening.js') > html.indexOf('/assets/js/advisory-discovery-contract.js'));
check('opening script loads after continuity', html.indexOf('/assets/js/advisory-opening.js') > html.indexOf('/assets/js/assessment-continuity.js'));
check('opening script loads before property confirmation', html.indexOf('/assets/js/advisory-opening.js') < html.indexOf('/assets/js/property-confirmation.js'));
check('opening script loads before assessment engine', html.indexOf('/assets/js/advisory-opening.js') < html.indexOf('/assets/js/assessment-engine.js'));

const openingRuntime = read('assets/js/advisory-opening.js');
check('opening runtime has no Protection Score dependency', !openingRuntime.includes('CoverageFitProtectionScore') && !openingRuntime.includes('protection-score'));
check('opening runtime has no recommendation generation dependency', !openingRuntime.includes('CoverageFitRecommendationEngine') && !openingRuntime.includes('recommendation-engine'));
check('opening runtime writes only existing advisory contract', openingRuntime.includes('CoverageFitAdvisoryDiscoveryContract') && openingRuntime.includes('reasonForReview: reasonRecord') && openingRuntime.includes('primaryPriority: priorityRecord'));
check('opening runtime preserves explicit unknown priority', openingRuntime.includes("key: 'unsure'"));
check('opening runtime emits completion event', openingRuntime.includes('coveragefit:advisory-opening-completed'));
check('opening runtime persists continuity state', openingRuntime.includes('advisoryOpening: draftValue()'));

const propertyRuntime = read('assets/js/property-confirmation.js');
check('property confirmation routes into advisory opening', propertyRuntime.includes('CoverageFitAdvisoryOpening') && propertyRuntime.includes('advisoryOpening?.start'));
check('property resume routes through advisory opening', propertyRuntime.includes("resume: true"));
check('property does not force quiz visible when opening is active', propertyRuntime.includes("quiz.style.display = advisoryStarted ? 'none' : ''"));

const assessment = read('assets/js/assessment-engine.js');
check('assessment engine reads advisory opening additively', assessment.includes('const advisoryOpening = window.CoverageFitAdvisoryOpening || null;'));
check('selected opening reason becomes active review reason', assessment.includes('return advisoryOpening?.getReviewReason?.()'));
check('assessment merges opening discovery into seeded discovery profile', assessment.includes('advisoryDiscovery.merge(discoveryProfile, openingDiscovery)'));
check('signal derivation occurs after opening merge', assessment.indexOf('advisoryDiscovery.merge(discoveryProfile, openingDiscovery)') < assessment.indexOf('advisorySignals.apply(discoveryProfile)'));
check('assessment rerenders after opening completion', assessment.includes("window.addEventListener('coveragefit:advisory-opening-completed'"));
check('assessment analytics explicitly records unchanged score formula', assessment.includes('scoreFormulaChanged: false'));
check('report reviewContext uses active advisory reason', assessment.includes('reviewContext: activeReviewReason()'));
check('retake resets opening deliberately', assessment.includes("advisoryOpening?.reset?.({ preserveInherited: true })"));

const continuityRuntime = read('assets/js/assessment-continuity.js');
check('continuity recognizes an incomplete advisory opening on resume', continuityRuntime.includes('activeDraft.advisoryOpening && !activeDraft.advisoryOpening.completed'));
check('resume copy identifies saved review setup before substantive questions', continuityRuntime.includes('Your review setup is saved'));
check('resume scroll targets a visible advisory opening first', continuityRuntime.includes('#advisoryOpening:not([hidden])'));

const css = read('assets/css/advisory-opening.css');
check('opening has mobile single-column choices', /@media\(max-width:760px\).*advisory-choice-grid\{grid-template-columns:1fr\}/.test(css));
check('opening provides focus-visible state', css.includes('input:focus-visible+.advisory-choice__card'));
check('opening honors reduced motion', css.includes('@media(prefers-reduced-motion:reduce)'));
check('connected state is not color-only because it contains explicit text elements', html.includes('Connected from your request') && html.includes('Priority connected from your request'));

check('Protection Score implementation is byte-compatible', sha('assets/js/protection-score.js') === '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8');
check('recommendation engine is byte-compatible', sha('assets/js/recommendation-engine.js') === '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18');
check('home recommendation rules are byte-compatible', sha('assets/js/home-recommendation-rules.js') === '0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629');
check('legacy Workspace adapter is byte-compatible', sha('assets/js/workspace-data.js') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');

const contract = JSON.parse(read('CF_ADV_1_4_OPENING_CONTRACT.json'));
check('CF-ADV-1.4 release JSON contract remains historically accurate', contract.contractId === opening.CONTRACT_ID && contract.contractVersion === opening.VERSION && contract.build === opening.BUILD && contract.release === '3.20.75' && Number(version.split('.')[2]) >= 75);
check('release JSON contract documents eight reasons and four priorities', contract.reasonOptions.length === 8 && contract.priorityOptions.length === 4);
check('release JSON contract documents explicit unknown priority', contract.priorityOptions.some(option => option.key === 'unsure' && option.explicitUnknown === true));
check('release JSON contract prohibits score impact', contract.protectedBoundaries.affectsProtectionScore === false && contract.protectedBoundaries.changesQuestionWeights === false && contract.protectedBoundaries.changesAnswerImpacts === false);
check('release JSON contract prohibits recommendation creation/reranking', contract.protectedBoundaries.changesRecommendationGeneration === false && contract.protectedBoundaries.changesRecommendationRanking === false);
check('release JSON contract documents zero-repeat correction path', contract.zeroRepeat.trustedReasonIsReaskedByDefault === false && contract.zeroRepeat.connectedValuesVisible === true && contract.zeroRepeat.customerCanCorrect === true);

const roadmap = read('CF-ADV-ROADMAP.md');
check('roadmap marks CF-ADV-1.4 complete', roadmap.includes('CF-ADV-1.4 — “Why Are We Here?” Opening — COMPLETE'));
check('roadmap advances to CF-ADV-1.5', roadmap.includes('Next: `CF-ADV-1.5 — Current Relationship Discovery`'));
check('roadmap resumption instructions include opening contract', roadmap.includes('CF_ADV_1_4_OPENING_CONTRACT.json'));
check('roadmap remains complete through certification', roadmap.includes('CF-ADV-2.5') && roadmap.includes('CF-ADV-3.3'));

console.log(JSON.stringify({ suite:'CF-ADV-1.4', pass:true, checkCount:checks.length, checks }, null, 2));
