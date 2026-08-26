#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(root, rel));
const sha = rel => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, rel))).digest('hex');
const checks = [];
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); };

const api = require('./assets/js/advisory-recommendation-cards.js');
const contract = JSON.parse(read('CF_ADV_1_12_RECOMMENDATION_CARD_CONTRACT.json'));
const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
const reportHtml = read('home/report/index.html');
const js = read('assets/js/advisory-recommendation-cards.js');
const css = read('assets/css/advisory-recommendation-cards.css');

check('release advances to 3.20.83', version === '3.20.83' && pkg.version === version);
check('package names recommendation cards', /Why This Fits You Recommendation Cards/i.test(pkg.description));
check('runtime exists', exists('assets/js/advisory-recommendation-cards.js'));
check('stylesheet exists', exists('assets/css/advisory-recommendation-cards.css'));
check('contract exists', exists('CF_ADV_1_12_RECOMMENDATION_CARD_CONTRACT.json'));
check('sprint doc exists', exists('SPRINT-CF-ADV-1.12.md'));
check('runtime identity stable', api.VERSION === '1.0.0' && api.BUILD === 'CF-ADV-1.12');
check('runtime contract matches JSON', api.CONTRACT_ID === contract.id);
check('three-card cap matches contract', api.MAX_CARDS === 3 && contract.maxCards === 3);
check('reaction control set exposes four future durable states', api.REACTION_STATES.length === 4);
check('reaction states match roadmap', api.REACTION_STATES.map(x => x.value).join('|') === 'accepted_logic|needs_explanation|prefers_savings|undecided');

const ev = key => [{ source: 'coveragefit_assessment', key, label: `Evidence ${key}` }];
const recommendations = [
  {
    name: 'Dwelling Rebuilding Estimate',
    ruleId: 'home-priority-1',
    priority: 'high',
    impactLabel: 'High priority',
    clientExplanation: 'Your response made the rebuilding estimate worth confirming.',
    conversationStarter: 'Can we confirm the current rebuilding estimate?',
    evidenceQuality: 'confirmed',
    evidenceLabel: 'Clear response captured',
    supportingAnswers: ['I have not reviewed the rebuilding amount recently.'],
    findingType: 'consideration'
  },
  {
    name: 'Water-Loss Terms',
    ruleId: 'home-priority-2',
    priority: 'high',
    clientExplanation: 'Your response made water-loss terms worth confirming.',
    conversationStarter: 'Can we confirm the water-loss deductible and terms?',
    evidenceQuality: 'needs-verification',
    evidenceLabel: 'Needs policy verification',
    supportingAnswers: ['I am not sure how my water deductible works.'],
    findingType: 'uncertainty'
  },
  {
    name: 'Liability Limits',
    ruleId: 'home-priority-3',
    clientExplanation: 'Your response made liability limits worth confirming.',
    evidenceQuality: 'partial',
    evidenceLabel: 'Partial evidence'
  },
  { name: 'Fourth topic that must be capped' }
];

const report = {
  assessment: 'home',
  discoveryProfile: {
    recommendationAnchors: [{
      id: 'cfadv13-dwelling-rebuilding-estimate',
      recommendationKey: 'Dwelling Rebuilding Estimate',
      recommendationTitle: 'Dwelling Rebuilding Estimate',
      personalized: true,
      genericFallback: false,
      supportingSignalKeys: ['homeCommitment.high'],
      becauseYouToldUs: 'You told us this is your primary home and you expect to stay there long term.',
      personalMeaning: 'Long-term ownership makes rebuilding assumptions personally relevant.',
      whyThisFits: 'The rebuilding estimate is already on your review list, and your long-term connection to the home gives that discussion personal context.',
      discussionPrompt: 'Can we confirm how the rebuilding estimate works today?',
      priceTradeoff: 'Compare the protection gained with the premium tradeoff.',
      copyVariants: {
        customer: {
          becauseYouToldUs: 'You told us this is your primary home and you expect to stay there long term.',
          personalMeaning: 'Long-term ownership makes rebuilding assumptions personally relevant.',
          whyThisFits: 'The rebuilding estimate is already on your review list, and your long-term connection to the home gives that discussion personal context.',
          discussionPrompt: 'Can we confirm how the rebuilding estimate works today?',
          priceTradeoff: 'Compare the protection gained with the premium tradeoff.'
        }
      },
      source: 'coveragefit_assessment',
      evidenceRefs: [...ev('homeOwnership'), ...ev('stayIntent')]
    }, {
      id: 'cfadv13-water-loss-terms',
      recommendationKey: 'Water-Loss Terms',
      recommendationTitle: 'Water-Loss Terms',
      personalized: true,
      becauseYouToldUs: 'This sentence must not be trusted without evidence.',
      whyThisFits: 'Unsafe personalization.',
      evidenceRefs: []
    }]
  }
};

const sourceReport = JSON.stringify(report);
const sourceRecs = JSON.stringify(recommendations);
const model = api.derive(report, recommendations);
check('derive does not mutate report', JSON.stringify(report) === sourceReport);
check('derive does not mutate recommendations', JSON.stringify(recommendations) === sourceRecs);
check('model schema is v1', model.schemaVersion === '1.0' && model.contractId === contract.id);
check('card count capped at three', model.cards.length === 3);
check('recommendation order preserved', model.cards.map(c => c.topic).join('|') === 'Dwelling Rebuilding Estimate|Water-Loss Terms|Liability Limits');
check('personalized card count is evidence-gated', model.diagnostics.personalizedCardCount === 1 && model.diagnostics.genericCardCount === 2);
check('policy verified card count stays zero', model.diagnostics.policyVerifiedCardCount === 0);
check('durable reaction count stays zero', model.diagnostics.durableReactionCount === 0);

const rebuild = model.cards[0];
const water = model.cards[1];
check('personalized card gets fit label', rebuild.fitStatus.key === 'personal_context_match' && /fits your review/i.test(rebuild.fitStatus.label));
check('because-you-told-us copy comes from stored evidence-backed anchor', /primary home/.test(rebuild.provenance.becauseYouToldUs) && /long term/.test(rebuild.provenance.becauseYouToldUs));
check('personalized card retains exact anchor evidence refs', rebuild.provenance.evidenceRefs.some(r => r.key === 'homeOwnership') && rebuild.provenance.evidenceRefs.some(r => r.key === 'stayIntent'));
check('personal meaning remains separate from assessment finding', /Long-term ownership/.test(rebuild.provenance.personalMeaning) && !rebuild.assessmentFinding.detail.includes('Long-term ownership'));
check('assessment finding keeps established recommendation explanation', rebuild.assessmentFinding.detail === recommendations[0].clientExplanation);
check('clear assessment answer is not issued-policy verification', rebuild.assessmentFinding.issuedPolicyVerified === false && rebuild.assessmentFinding.issuedPolicyDeficiencyConfirmed === false);
check('card does not recommend a coverage change', rebuild.assessmentFinding.changeRecommended === false);
check('clear answer scope note distinguishes policy evidence', /does not verify/i.test(rebuild.assessmentFinding.scopeNote) && /issued policy/i.test(rebuild.assessmentFinding.scopeNote));
check('supporting answer stays in finding lane', rebuild.assessmentFinding.supportingAnswers[0] === recommendations[0].supportingAnswers[0]);
check('producer review reason is customer-facing advisory rationale', /long-term connection/.test(rebuild.producerReviewReason.detail));
check('producer recommendation remains pending verification', rebuild.producerReviewReason.recommendationPendingVerification === true);
check('discussion prompt is preserved', rebuild.producerReviewReason.discussionPrompt === 'Can we confirm how the rebuilding estimate works today?');
check('tradeoff stays separate', /premium tradeoff/.test(rebuild.tradeoff.detail));

check('evidence-less personalized anchor fails closed', water.personalized === false && water.provenance.hasPersonalEvidence === false);
check('evidence-less anchor cannot emit because-you-told-us copy', water.provenance.becauseYouToldUs === '');
check('generic topic receives neutral fit status', water.fitStatus.key === 'context_to_confirm');
check('needs-verification card says policy verification is still required', water.assessmentFinding.label === 'Needs policy verification' && /issued policy still needs to be checked/i.test(water.assessmentFinding.scopeNote));
check('generic producer reason does not claim a change is needed', /whether he would recommend leaving it alone or changing anything/.test(water.producerReviewReason.detail));

for (const card of model.cards) {
  check(`${card.topic}: customer fact is not policy finding`, card.guardrails.customerFactIsPolicyFinding === false);
  check(`${card.topic}: customer preference is not policy finding`, card.guardrails.customerPreferenceIsPolicyFinding === false);
  check(`${card.topic}: answer is not issued policy verification`, card.guardrails.assessmentAnswerIsIssuedPolicyVerification === false);
  check(`${card.topic}: score unaffected`, card.guardrails.affectsProtectionScore === false);
  check(`${card.topic}: eligibility unaffected`, card.guardrails.createsRecommendationEligibility === false);
  check(`${card.topic}: ranking unaffected`, card.guardrails.changesRecommendationRanking === false);
  check(`${card.topic}: reaction not stored in discovery profile`, card.guardrails.reactionStoredInDiscoveryProfile === false);
  check(`${card.topic}: reaction cannot bind coverage`, card.guardrails.reactionBindsCoverage === false);
  check(`${card.topic}: reaction is draft only`, card.reaction.state === 'not_captured' && card.reaction.persisted === false && card.reaction.controls.length === 4);
}

const html = api.renderCardHtml(rebuild);
check('rendered card shows because-you-told-us lane', html.includes('Because you told us') && html.includes('primary home'));
check('rendered card shows finding verification lane', html.includes('What we found / need to verify'));
check('rendered card shows Dylan review lane', html.includes('Why Dylan wants to review it'));
check('rendered card contains reaction-control mount', html.includes('data-advisory-card-reaction') && html.includes('Makes sense') && html.includes('Explain this') && html.includes('Prioritize cost') && html.includes('Not sure yet'));
check('rendered card does not claim policy deficiency', !/your policy is deficient|policy is deficient/i.test(html));

const unsafe = api.derive({ discoveryProfile: { recommendationAnchors: [{ recommendationKey: 'Unsafe', personalized: true, becauseYouToldUs: '<script>alert(1)</script>', evidenceRefs: ev('x') }] } }, [{ name: 'Unsafe', clientExplanation: '<img src=x onerror=alert(1)>' }]).cards[0];
const unsafeHtml = api.renderCardHtml(unsafe);
check('render escapes customer-authored/advisory HTML', !unsafeHtml.includes('<script>') && unsafeHtml.includes('&lt;script&gt;'));
check('render escapes recommendation HTML', !unsafeHtml.includes('<img src=x') && unsafeHtml.includes('&lt;img'));

check('report loads recommendation-card stylesheet', reportHtml.includes('/assets/css/advisory-recommendation-cards.css'));
check('report loads recommendation-card runtime after report engine', reportHtml.indexOf('report-engine.js') < reportHtml.indexOf('advisory-recommendation-cards.js'));
check('report page 2 uses new rationale heading', reportHtml.includes('Why this fits your review') && reportHtml.includes('See the reason behind each discussion topic'));
check('report copy separates context, assessment finding, and policy verification', /keeps your personal context separate from what the assessment found and what still needs policy verification/i.test(reportHtml));
check('runtime renders into existing priorities mount', js.includes("getElementById('priorities')"));
check('runtime uses existing recommendation engine only for eligible topics', js.includes("engine.generate('home'") && !js.includes('registerProduct('));
check('runtime reads existing recommendation anchors', js.includes('discoveryProfile?.recommendationAnchors'));
check('runtime never writes recommendationResponses', !/recommendationResponses\s*[:=]/.test(js));
check('runtime does not write localStorage or sessionStorage reactions', !/setItem\s*\(/.test(js));
check('reaction UI is explicitly page-local', js.includes('Selected for this page only'));
check('CSS provides 44px reaction targets', /min-height:44px/.test(css));
check('CSS hides draft reactions in print', /@media print/.test(css) && /advisory-card-reaction/.test(css));

check('Protection Score implementation remains byte-identical', sha('assets/js/protection-score.js') === '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8');
check('recommendation engine remains byte-identical', sha('assets/js/recommendation-engine.js') === '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18');
check('home recommendation rules remain byte-identical', sha('assets/js/home-recommendation-rules.js') === '0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629');
check('legacy Workspace adapter remains byte-identical', sha('assets/js/workspace-data.js') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');
check('report engine remains byte-identical', sha('assets/js/report-engine.js') === 'da603a0aace35e59c35fbc4d8e75395c6f2328fe7fb0df6991e0110ae7e2068b');
check('private report core remains byte-identical', sha('server/prospect-report-core.mjs') === '4b7fd6023be641fd2055e5b24720c3b2d5cecf9e194a3e6650bdccfabe0f18f5');
check('private report access runtime remains byte-identical', sha('assets/js/prospect-report-access.js') === '89173d5b218e9b7d8d78c106e427c3edb2faf894fac64ccbdd3a52babd3eed70');

check('contract requires evidence for personalized rationale', contract.traceability.becauseYouToldUsRequiresPersonalEvidence === true && contract.traceability.personalEvidenceRefsRequired === true);
check('contract separates preference from finding', contract.traceability.customerPreferenceIsNotPolicyFinding === true && contract.traceability.assessmentFindingRemainsSeparate === true);
check('contract refuses policy verification claims', contract.policyEvidenceBoundary.assessmentResponseIsIssuedPolicyVerification === false && contract.policyEvidenceBoundary.issuedPolicyDeficiencyConfirmedByCard === false);
check('contract defers durable reactions to 1.13', contract.reactionBoundary.draftOnly === true && contract.reactionBoundary.writesRecommendationResponses === false && contract.reactionBoundary.durableCaptureSprint === 'CF-ADV-1.13');
check('contract protects recommendation eligibility/ranking', contract.protectedBoundaries.createsRecommendationTopics === false && contract.protectedBoundaries.affectsRecommendationEligibility === false && contract.protectedBoundaries.affectsRecommendationRanking === false);

const roadmap = read('CF-ADV-ROADMAP.md');
check('roadmap marks 1.12 complete', roadmap.includes('CF-ADV-1.12 implementation status — COMPLETE in v3.20.83'));
check('roadmap advances to 1.13', roadmap.includes('Next: `CF-ADV-1.13 — Recommendation Buy-In Capture`'));
check('authoritative roadmap still reaches final certification', roadmap.includes('CF-ADV-3.3') && roadmap.includes('Resumption instructions'));

console.log(JSON.stringify({ suite: 'CF-ADV-1.12', pass: true, checks: checks.length, checks }, null, 2));
