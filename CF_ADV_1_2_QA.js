#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const sha = rel => crypto.createHash('sha256').update(read(rel)).digest('hex');
const checks = [];
const check = (name, condition) => { assert(condition, name); checks.push(name); };

const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
check('release remains compatible after CoverageFit 3.20.73', ['3.20.73','3.20.74','3.20.75','3.20.76','3.20.77','3.20.78','3.20.79','3.20.80','3.20.81','3.20.82','3.20.83'].includes(version) && pkg.version === version);

const contract = require('./assets/js/advisory-discovery-contract.js');
global.CoverageFitAdvisoryDiscoveryContract = contract;
delete require.cache[require.resolve('./assets/js/advisory-signal-engine.js')];
const engine = require('./assets/js/advisory-signal-engine.js');

check('signal engine has stable version and build', engine.VERSION === '1.0.0' && engine.BUILD === 'CF-ADV-1.2');
check('signal engine API is frozen', Object.isFrozen(engine));
check('signal engine identifier is stable', engine.ENGINE_ID === 'coveragefit-advisory-signal-engine-v1');
check('roadmap rule families are bounded to four', engine.RULES.length === 4 && engine.RULES.map(rule => rule.id).join('|') === 'vehicle-dependency|home-commitment|incumbent-relationship|tradeoff-preference');

const evidence = key => [{ source: 'coveragefit_assessment', key, label: key }];
const record = (value, key, label = '') => ({ value, label, source: 'coveragefit_assessment', evidenceRefs: evidence(key) });

const complete = contract.create({
  product: 'home',
  primaryPriority: record('balance', 'primaryPriority', 'Find the right balance'),
  lifestyleDependencies: [
    record('yes', 'onlyVehicle', 'Only vehicle'),
    record('yes', 'dailyUse', 'Used every day')
  ],
  protectionProfile: {
    source: 'coveragefit_assessment',
    facts: [
      record('primaryResidence', 'homeOwnership', 'Primary residence'),
      record('longTerm', 'stayIntent', 'Planning to stay long term')
    ]
  },
  currentRelationship: {
    source: 'coveragefit_assessment',
    carrier: record('AAA', 'currentCarrier', 'AAA'),
    tenure: record('12 years', 'currentCarrierTenure', '12 years'),
    likes: [record('service', 'likesService', 'Service')]
  }
});

check('1.1 normalizer preserves distinct same-value facts by evidence identity', complete.lifestyleDependencies.length === 2);
const facts = engine.collectExplicitFacts(complete);
check('direct facts are exposed separately from derived signals', facts.homeOwnership.length === 1 && facts.stayIntent.length === 1 && !('status' in facts.homeOwnership[0]));
check('fact extraction keeps evidence references', Object.values(facts).flat().every(item => item.evidenceRefs?.length > 0));

const detailed = engine.deriveDetailed(complete);
check('complete fixture derives four roadmap signals', detailed.signals.length === 4);
const byKey = Object.fromEntries(detailed.signals.map(signal => [signal.key, signal]));
check('vehicle dependency derives high', byKey['vehicleDependency.high']?.status === 'active');
check('home commitment derives high', byKey['homeCommitment.high']?.status === 'active');
check('incumbent relationship derives strong', byKey['incumbentRelationship.strong']?.status === 'active');
check('tradeoff preference derives balanced', byKey['tradeoffPreference.balanced']?.status === 'active');
check('every active signal is evidence-backed', detailed.signals.filter(signal => signal.status === 'active').every(signal => signal.evidenceRefs.length > 0));
check('signals use stable engine-owned IDs', detailed.signals.every(signal => signal.id.startsWith('cfadv12-')));
check('signals distinguish interpretation from raw facts by living only in customerSignals shape', detailed.signals.every(signal => typeof signal.key === 'string' && signal.key.includes('.')) && complete.customerSignals.length === 0);

const applied = engine.apply(complete);
check('apply stores derived interpretations in customerSignals', applied.customerSignals.length === 4 && applied.customerSignals.every(engine.ownsSignal));
check('apply does not rewrite direct discovery facts', applied.primaryPriority.value === complete.primaryPriority.value && applied.protectionProfile.facts.length === complete.protectionProfile.facts.length && applied.lifestyleDependencies.length === complete.lifestyleDependencies.length);
check('apply leaves future anchor and reaction layers inert', applied.recommendationAnchors.length === 0 && applied.recommendationResponses.length === 0);
check('repeat apply is idempotent for engine signals', engine.apply(applied).customerSignals.length === applied.customerSignals.length);

const withExternalSignal = contract.create({
  ...complete,
  customerSignals: [{
    id: 'external-signal-1',
    key: 'external.context',
    label: 'External context',
    status: 'candidate',
    confidence: 0.4,
    source: 'producer_note',
    evidenceRefs: [{ source: 'producer_note', key: 'note-1', label: 'Producer note' }]
  }]
});
const reapplied = engine.apply(withExternalSignal);
check('apply preserves non-engine signal records', reapplied.customerSignals.some(signal => signal.id === 'external-signal-1'));
check('apply replaces only its own prior outputs', reapplied.customerSignals.filter(engine.ownsSignal).length === 4);

const conflictRecord = (value, key, label, evidenceLabel) => ({
  value,
  label,
  source: 'coveragefit_assessment',
  evidenceRefs: [{ source: 'coveragefit_assessment', key, label: evidenceLabel }]
});
const conflictProfile = contract.create({
  product: 'home',
  lifestyleDependencies: [
    conflictRecord('yes', 'onlyVehicle', 'Only vehicle yes', 'Only vehicle answer A'),
    conflictRecord('no', 'onlyVehicle', 'Only vehicle no', 'Only vehicle answer B'),
    conflictRecord('yes', 'dailyUse', 'Daily use', 'Daily use answer')
  ],
  protectionProfile: {
    source: 'coveragefit_assessment',
    facts: [
      conflictRecord('primaryResidence', 'homeOwnership', 'Primary residence', 'Ownership answer'),
      conflictRecord('longTerm', 'stayIntent', 'Long-term', 'Stay intent answer A'),
      conflictRecord('sellingSoon', 'stayIntent', 'Selling soon', 'Stay intent answer B')
    ]
  }
});
const conflictSignals = engine.derive(conflictProfile);
const vehicleCandidate = conflictSignals.find(signal => signal.id === 'cfadv12-vehicle-dependency');
const homeCandidate = conflictSignals.find(signal => signal.id === 'cfadv12-home-commitment');
check('conflicting vehicle evidence produces candidate', vehicleCandidate?.status === 'candidate' && vehicleCandidate.key === 'vehicleDependency.needsConfirmation');
check('conflicting home evidence produces candidate', homeCandidate?.status === 'candidate' && homeCandidate.key === 'homeCommitment.needsConfirmation');
check('candidate retains conflicting evidence rather than overwriting', vehicleCandidate.evidenceRefs.length === 3 && homeCandidate.evidenceRefs.length === 3);
check('candidate confidence is explicitly bounded', vehicleCandidate.confidence === 0.5 && homeCandidate.confidence === 0.5);

const unsupported = contract.create({
  product: 'home',
  primaryPriority: { value: 'surprise me', label: 'Surprise me', source: 'coveragefit_assessment', evidenceRefs: evidence('primaryPriority') },
  protectionProfile: { source: 'coveragefit_assessment', facts: [record('primaryResidence', 'homeOwnership')] }
});
check('unrecognized values fail closed', engine.derive(unsupported).length === 0);

const noEvidence = contract.create({
  product: 'home',
  primaryPriority: { value: 'balance', source: 'coveragefit_assessment' },
  protectionProfile: { source: 'coveragefit_assessment', facts: [
    { value: 'primaryResidence', source: 'coveragefit_assessment' },
    { value: 'longTerm', source: 'coveragefit_assessment' }
  ] }
});
check('untraceable facts fail closed', engine.derive(noEvidence).length === 0);

const partial = contract.create({
  product: 'home',
  protectionProfile: { source: 'coveragefit_assessment', facts: [record('primaryResidence', 'homeOwnership')] }
});
check('incomplete rule inputs do not produce an active signal', engine.derive(partial).length === 0);

for (const [priority, expected] of [
  ['balance', 'tradeoffPreference.balanced'],
  ['keep cost down', 'tradeoffPreference.price'],
  ['strongest protection', 'tradeoffPreference.protection']
]) {
  const profile = contract.create({ product: 'home', primaryPriority: record(priority, 'primaryPriority') });
  check(`explicit priority ${priority} maps deterministically`, engine.derive(profile).some(signal => signal.key === expected && signal.status === 'active'));
}

const shortTenure = contract.create({
  product: 'home',
  currentRelationship: {
    source: 'coveragefit_assessment',
    tenure: record('4 years', 'currentCarrierTenure'),
    likes: [record('service', 'likesService')]
  }
});
check('service satisfaction alone does not overstate incumbent strength', engine.derive(shortTenure).every(signal => signal.key !== 'incumbentRelationship.strong'));

const monthlyTenure = contract.create({
  product: 'home',
  currentRelationship: {
    source: 'coveragefit_assessment',
    tenure: record('144 months', 'currentCarrierTenure'),
    likes: [record('service', 'likesService')]
  }
});
check('tenure parser handles explicit months deterministically', engine.derive(monthlyTenure).some(signal => signal.key === 'incumbentRelationship.strong'));

const runtime = read('assets/js/advisory-signal-engine.js');
check('runtime has no Protection Score dependency', !runtime.includes('CoverageFitProtectionScore') && !runtime.includes('protection-score'));
check('runtime has no recommendation engine dependency', !runtime.includes('CoverageFitRecommendation') && !runtime.includes('recommendation-engine'));
check('runtime contains no recommendation-anchor generation', !runtime.includes('becauseYouToldUs') && !runtime.includes('recommendationAnchors'));

const assessmentHtml = read('assessment/index.html');
check('Home assessment loads signal engine after discovery contract', assessmentHtml.indexOf('/assets/js/advisory-signal-engine.js') > assessmentHtml.indexOf('/assets/js/advisory-discovery-contract.js'));
check('Home assessment loads signal engine before assessment engine', assessmentHtml.indexOf('/assets/js/advisory-signal-engine.js') < assessmentHtml.indexOf('/assets/js/assessment-engine.js'));
const assessmentEngine = read('assets/js/assessment-engine.js');
check('assessment engine applies signals to the existing discoveryProfile', assessmentEngine.includes('const advisorySignals = window.CoverageFitAdvisorySignalEngine || null;') && assessmentEngine.includes('Object.assign(discoveryProfile, advisorySignals.apply(discoveryProfile));'));
check('assessment keeps the CF-ADV-1.1 seed contract intact', (assessmentEngine.includes('const discoveryProfile = advisoryDiscovery?.seedFromExistingContext?.({') || assessmentEngine.includes('let discoveryProfile = advisoryDiscovery?.seedFromExistingContext?.({')));

check('Protection Score implementation is byte-compatible', sha('assets/js/protection-score.js') === '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8');
check('recommendation engine is byte-compatible', sha('assets/js/recommendation-engine.js') === '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18');
check('legacy Workspace adapter is byte-compatible', sha('assets/js/workspace-data.js') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');

const jsonContract = JSON.parse(read('CF_ADV_1_2_SIGNAL_ENGINE_CONTRACT.json'));
check('release JSON contract matches runtime identifiers', jsonContract.engineVersion === engine.VERSION && jsonContract.engineId === engine.ENGINE_ID && jsonContract.build === engine.BUILD);
check('release JSON contract explicitly protects score and recommendation boundaries', jsonContract.protectedBoundaries.affectsProtectionScore === false && jsonContract.protectedBoundaries.affectsRecommendationRanking === false && jsonContract.protectedBoundaries.generatesRecommendationLanguage === false);
check('release JSON contract documents candidate conflict semantics', jsonContract.conflictPolicy.conflictingRecognizedEvidenceProducesCandidate === true && jsonContract.conflictPolicy.silentOverwrite === false);

const roadmap = read('CF-ADV-ROADMAP.md');
check('authoritative roadmap remains complete through certification', roadmap.includes('CF-ADV-1.3') && roadmap.includes('CF-ADV-2.5') && roadmap.includes('CF-ADV-3.3') && roadmap.includes('Resumption instructions'));

console.log(JSON.stringify({ suite: 'CF-ADV-1.2', pass: true, checks: checks.length, checks }, null, 2));
