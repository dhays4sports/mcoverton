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
check('release remains compatible after CoverageFit 3.20.74', ['3.20.74','3.20.75','3.20.76','3.20.77','3.20.78','3.20.79','3.20.80','3.20.81','3.20.82','3.20.83'].includes(version) && pkg.version === version);

const discovery = require('./assets/js/advisory-discovery-contract.js');
global.CoverageFitAdvisoryDiscoveryContract = discovery;
delete require.cache[require.resolve('./assets/js/advisory-signal-engine.js')];
const signals = require('./assets/js/advisory-signal-engine.js');
global.CoverageFitAdvisorySignalEngine = signals;
delete require.cache[require.resolve('./assets/js/advisory-recommendation-anchor-contract.js')];
const anchors = require('./assets/js/advisory-recommendation-anchor-contract.js');

check('anchor contract identifiers are stable', anchors.VERSION === '1.0.0' && anchors.BUILD === 'CF-ADV-1.3' && anchors.CONTRACT_ID === 'coveragefit-advisory-recommendation-anchor-v1');
check('anchor contract API is frozen', Object.isFrozen(anchors));
check('engine ownership prefix is sprint-specific', anchors.ENGINE_ANCHOR_PREFIX === 'cfadv13-');

const ev = key => [{ source: 'coveragefit_assessment', key, label: key }];
const rec = (value, key) => ({ value, label: value, source: 'coveragefit_assessment', evidenceRefs: ev(key) });
const recommendations = [
  { name: 'Dwelling Rebuilding Estimate', ruleId: 'home-priority-1', clientExplanation: 'Review the rebuilding estimate.', conversationStarter: 'Can we confirm the rebuilding estimate?' },
  { name: 'Water-Loss Terms', ruleId: 'home-priority-2', clientExplanation: 'Review the water-loss terms.', conversationStarter: 'Can we confirm the water-loss terms?' },
  { name: 'Rental Transportation', ruleId: 'auto-rental-1', clientExplanation: 'Review replacement transportation.', conversationStarter: 'Can we confirm rental transportation?' }
];

const normalizedRecs = anchors.normalizeRecommendations([
  recommendations[0], recommendations[0], recommendations[1]
]);
check('eligible recommendation normalization de-duplicates by topic identity', normalizedRecs.length === 2);
check('eligible recommendation identity preserves existing topic name', normalizedRecs[0].recommendationKey === 'Dwelling Rebuilding Estimate');
check('eligible recommendation metadata preserves existing source id', normalizedRecs[0].recommendationSourceId === 'home-priority-1');

const emptyProfile = discovery.create({ product: 'home' });
const generic = anchors.build(emptyProfile, [recommendations[1]], { timestamp: '2026-08-19T20:00:00Z' })[0];
check('missing advisory evidence produces a generic anchor', generic.personalized === false && generic.genericFallback === true);
check('generic anchor does not fabricate because-you-told-us copy', generic.becauseYouToldUs === '' && generic.personalMeaning === '');
check('generic anchor carries no fake customer evidence', generic.evidenceRefs.length === 0 && generic.supportingSignalKeys.length === 0);
check('generic anchor preserves established recommendation explanation', generic.whyThisFits === 'Review the water-loss terms.');
check('generic anchor preserves established recommendation conversation starter', generic.discussionPrompt === 'Can we confirm the water-loss terms?');
check('generic anchor is valid without personalization warnings', discovery.validate(discovery.create({ product: 'home', recommendationAnchors: [generic] })).warnings.length === 0);

let profile = discovery.create({
  product: 'home',
  primaryPriority: rec('balance', 'primaryPriority'),
  protectionProfile: {
    source: 'coveragefit_assessment',
    facts: [rec('primaryResidence', 'homeOwnership'), rec('longTerm', 'stayIntent')]
  }
});
profile = signals.apply(profile);
const detailed = anchors.buildDetailed(profile, recommendations.slice(0, 2), { timestamp: '2026-08-19T20:00:00Z' });
check('two eligible topics produce exactly two anchors', detailed.anchors.length === 2);
check('active evidence-backed signals are counted', detailed.diagnostics.activeEvidenceBackedSignalCount === 2);
check('personalized anchor count is deterministic', detailed.diagnostics.personalizedAnchorCount === 2 && detailed.diagnostics.genericAnchorCount === 0);

const rebuilding = detailed.anchors.find(item => item.recommendationKey === 'Dwelling Rebuilding Estimate');
const water = detailed.anchors.find(item => item.recommendationKey === 'Water-Loss Terms');
check('home commitment is the primary rationale for a rebuilding topic', rebuilding.supportingSignalKeys[0] === 'homeCommitment.high');
check('rebuilding because-you-told-us copy is customer-contextual', rebuilding.becauseYouToldUs.includes('primary home') && rebuilding.becauseYouToldUs.includes('long term'));
check('home commitment anchor carries source evidence', rebuilding.evidenceRefs.some(ref => ref.key === 'homeOwnership') && rebuilding.evidenceRefs.some(ref => ref.key === 'stayIntent'));
check('tradeoff preference can supplement a topic-specific anchor', rebuilding.supportingSignalKeys.includes('tradeoffPreference.balanced') && rebuilding.evidenceRefs.some(ref => ref.key === 'primaryPriority'));
check('supplemental tradeoff metadata is present', rebuilding.priceTradeoff.includes('protection gained') && rebuilding.priceTradeoff.includes('premium'));
check('unrelated water topic does not misuse home commitment', water.supportingSignalKeys.length === 1 && water.supportingSignalKeys[0] === 'tradeoffPreference.balanced');
check('balanced preference creates a direct customer-linked rationale', water.becauseYouToldUs.includes('balance between price and protection'));

for (const [priority, expectedPhrase] of [
  ['keep cost down', 'keeping the cost down'],
  ['strongest protection', 'protecting yourself as strongly as practical'],
  ['balance', 'right balance between price and protection']
]) {
  let p = discovery.create({ product: 'home', primaryPriority: rec(priority, 'primaryPriority') });
  p = signals.apply(p);
  const a = anchors.build(p, [recommendations[1]], { timestamp: '2026-08-19T20:00:00Z' })[0];
  check(`explicit ${priority} preference personalizes deterministically`, a.personalized === true && a.becauseYouToldUs.includes(expectedPhrase));
  check(`explicit ${priority} preference includes price tradeoff`, a.priceTradeoff.length > 20);
}

let vehicle = discovery.create({
  product: 'auto',
  lifestyleDependencies: [rec('yes', 'onlyVehicle'), rec('yes', 'dailyUse')]
});
vehicle = signals.apply(vehicle);
const rentalAnchor = anchors.build(vehicle, [recommendations[2]], { timestamp: '2026-08-19T20:00:00Z' })[0];
check('vehicle dependency personalizes only an eligible transportation topic', rentalAnchor.personalized === true && rentalAnchor.supportingSignalKeys.includes('vehicleDependency.high'));
check('vehicle dependency copy focuses on continuity, not fear', rentalAnchor.personalMeaning.includes('normal routine') && rentalAnchor.buyInPrompt.includes('transportation'));
const unrelatedVehicle = anchors.build(vehicle, [recommendations[1]], { timestamp: '2026-08-19T20:00:00Z' })[0];
check('vehicle dependency does not overreach into unrelated topics', unrelatedVehicle.personalized === false);

const candidateOnly = discovery.create({
  product: 'home',
  customerSignals: [{
    id: 'cfadv12-home-commitment',
    key: 'homeCommitment.needsConfirmation',
    label: 'Home commitment',
    status: 'candidate',
    confidence: 0.5,
    source: 'coveragefit_assessment',
    evidenceRefs: ev('homeOwnership')
  }]
});
const candidateResult = anchors.buildDetailed(candidateOnly, [recommendations[0]], { timestamp: '2026-08-19T20:00:00Z' });
check('candidate signals never personalize recommendation anchors', candidateResult.anchors[0].personalized === false);
check('candidate signals are explicitly diagnosed as ignored', candidateResult.diagnostics.candidateSignalsIgnored.includes('homeCommitment.needsConfirmation'));

const incumbentOnly = discovery.create({
  product: 'home',
  customerSignals: [{
    id: 'cfadv12-incumbent-relationship',
    key: 'incumbentRelationship.strong',
    label: 'Strong incumbent relationship',
    status: 'active',
    confidence: 0.97,
    source: 'coveragefit_assessment',
    evidenceRefs: [
      { source: 'coveragefit_assessment', key: 'currentCarrierTenure', label: 'tenure' },
      { source: 'coveragefit_assessment', key: 'likesService', label: 'service' }
    ]
  }]
});
check('incumbent relationship is not misused as coverage-fit rationale', anchors.build(incumbentOnly, [recommendations[0]])[0].personalized === false);

const noRecommendations = anchors.build(profile, []);
check('signals alone can never manufacture a recommendation topic', noRecommendations.length === 0);
check('eligibility helper accepts only topics in supplied recommendation set', anchors.isEligibleAnchor(rebuilding, recommendations) === true && anchors.isEligibleAnchor({ recommendationKey: 'Invented Coverage' }, recommendations) === false);
check('all generated anchors stay inside the supplied eligible set', detailed.anchors.every(anchor => anchors.isEligibleAnchor(anchor, recommendations.slice(0, 2))));

const external = discovery.create({
  ...profile,
  recommendationAnchors: [{
    id: 'external-anchor-1',
    recommendationKey: 'External Topic',
    whyThisFits: 'External advisory note.',
    source: 'producer_note'
  }]
});
const applied = anchors.apply(external, recommendations.slice(0, 2), { timestamp: '2026-08-19T20:00:00Z' });
check('apply preserves non-engine anchors', applied.recommendationAnchors.some(anchor => anchor.id === 'external-anchor-1'));
check('apply replaces only its own prior outputs', applied.recommendationAnchors.filter(anchors.ownsAnchor).length === 2);
const reapplied = anchors.apply(applied, recommendations.slice(0, 2), { timestamp: '2026-08-19T20:00:00Z' });
check('repeat apply is idempotent for engine-owned anchors', reapplied.recommendationAnchors.filter(anchors.ownsAnchor).length === 2);
check('apply leaves customer recommendation responses untouched', reapplied.recommendationResponses.length === applied.recommendationResponses.length);

check('customer-facing and producer-facing variants are retained', rebuilding.copyVariants.customer.discussionPrompt.length > 0 && rebuilding.copyVariants.producer.discussionPrompt.length > 0);
check('producer variant includes buy-in prompt', rebuilding.copyVariants.producer.buyInPrompt === rebuilding.buyInPrompt && rebuilding.buyInPrompt.length > 0);
check('customer variant does not masquerade as producer buy-in script', rebuilding.copyVariants.customer.buyInPrompt === '');

const allCopy = detailed.anchors.concat([rentalAnchor]).map(anchor => JSON.stringify(anchor.copyVariants)).join(' ').toLowerCase();
for (const banned of ['scare', 'sue-happy', 'lawsuit', 'ruin you', 'catastrophic']) {
  check(`copy avoids fear-default token ${banned}`, !allCopy.includes(banned));
}

const runtime = read('assets/js/advisory-recommendation-anchor-contract.js');
check('anchor runtime has no Protection Score dependency', !runtime.includes('CoverageFitProtectionScore') && !runtime.includes('protection-score'));
check('anchor runtime has no recommendation-engine generation dependency', !runtime.includes('CoverageFitRecommendationEngine') && !runtime.includes('recommendation-engine'));
check('anchor runtime cannot create topics without an eligible recommendation input', runtime.includes('normalizeRecommendations(eligibleRecommendations)') && runtime.includes('recommendations.map(item => buildAnchor'));

const assessmentHtml = read('assessment/index.html');
check('assessment loads anchor contract after discovery signal engine', assessmentHtml.indexOf('/assets/js/advisory-recommendation-anchor-contract.js') > assessmentHtml.indexOf('/assets/js/advisory-signal-engine.js'));
check('assessment loads anchor contract before assessment engine', assessmentHtml.indexOf('/assets/js/advisory-recommendation-anchor-contract.js') < assessmentHtml.indexOf('/assets/js/assessment-engine.js'));
const assessmentEngine = read('assets/js/assessment-engine.js');
check('assessment engine exposes anchor contract additively', assessmentEngine.includes('const advisoryAnchors = window.CoverageFitAdvisoryRecommendationAnchorContract || null;'));
check('assessment applies anchors only after established priority rows exist', assessmentEngine.indexOf('const priorityRows =') < assessmentEngine.indexOf('advisoryAnchors.apply(discoveryProfile, priorityRows'));
check('assessment stores anchors inside existing discoveryProfile only', assessmentEngine.includes('Object.assign(discoveryProfile, anchored);'));

check('Protection Score implementation is byte-compatible', sha('assets/js/protection-score.js') === '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8');
check('recommendation engine is byte-compatible', sha('assets/js/recommendation-engine.js') === '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18');
check('home recommendation rules are byte-compatible', sha('assets/js/home-recommendation-rules.js') === '0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629');
check('legacy Workspace adapter is byte-compatible', sha('assets/js/workspace-data.js') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');

const jsonContract = JSON.parse(read('CF_ADV_1_3_RECOMMENDATION_ANCHOR_CONTRACT.json'));
check('release JSON contract matches runtime identifiers', jsonContract.contractVersion === anchors.VERSION && jsonContract.contractId === anchors.CONTRACT_ID && jsonContract.build === anchors.BUILD);
check('release JSON contract protects recommendation semantics', jsonContract.protectedBoundaries.createsRecommendationTopics === false && jsonContract.protectedBoundaries.affectsRecommendationRanking === false && jsonContract.protectedBoundaries.affectsProtectionScore === false);
check('release JSON contract documents generic fallback', jsonContract.missingEvidencePolicy.genericFallback === true && jsonContract.missingEvidencePolicy.fabricatedPersonalization === false);
check('release JSON contract requires evidence for personalized because-you-told-us copy', jsonContract.traceability.personalizedBecauseYouToldUsRequiresEvidence === true);

const roadmap = read('CF-ADV-ROADMAP.md');
check('roadmap marks CF-ADV-1.3 complete and advances to 1.4', roadmap.includes('CF-ADV-1.3 — Recommendation Anchor Contract — COMPLETE') && roadmap.includes('Next: `CF-ADV-1.4'));
check('authoritative roadmap remains complete through certification', roadmap.includes('CF-ADV-2.5') && roadmap.includes('CF-ADV-3.3') && roadmap.includes('Resumption instructions'));

console.log(JSON.stringify({ suite: 'CF-ADV-1.3', pass: true, checks: checks.length, checks }, null, 2));
