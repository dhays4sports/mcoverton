const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(root, rel));
const hash = rel => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, rel))).digest('hex');
const checks = [];
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); };

const api = require('./assets/js/advisory-results-model.js');
const contract = JSON.parse(read('CF_ADV_1_11_RESULTS_MODEL_CONTRACT.json'));
const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
const assessmentHtml = read('assessment/index.html');
const reportHtml = read('home/report/index.html');
const assessmentJs = read('assets/js/assessment-engine.js');
const interactiveJs = read('assets/js/interactive-snapshot.js');
const css = read('assets/css/advisory-results-model.css');

const rec = (value, label, key) => ({
  value,
  label,
  source: 'coveragefit_assessment',
  evidenceRefs: [{ source: 'coveragefit_assessment', key, label: `Evidence ${key}` }]
});

check('release remains compatible after 3.20.82', ['3.20.82','3.20.83'].includes(version) && pkg.version === version);
check('package remains compatible after results model', /Your CoverageFit Results Model|Why This Fits You Recommendation Cards/i.test(pkg.description));
check('runtime exists', exists('assets/js/advisory-results-model.js'));
check('stylesheet exists', exists('assets/css/advisory-results-model.css'));
check('contract exists', exists('CF_ADV_1_11_RESULTS_MODEL_CONTRACT.json'));
check('sprint doc exists', exists('SPRINT-CF-ADV-1.11.md'));
check('runtime identity stable', api.VERSION === '1.0.0' && api.BUILD === 'CF-ADV-1.11');
check('runtime contract matches JSON', api.CONTRACT_ID === contract.id);
check('home context limit matches contract', api.MAX_CONTEXT_ITEMS === 3 && contract.limits.home_context_items === 3);
check('outcome limit matches contract', api.MAX_OUTCOMES === 2 && contract.limits.hardest_outcomes === 2);
check('strength limit matches contract', api.MAX_STRENGTHS === 3 && contract.limits.strong_starting_points === 3);
check('discussion limit matches contract', api.MAX_TOPICS === 3 && contract.limits.worth_discussing_topics === 3);
check('results hierarchy starts with why reviewing', contract.hierarchy[0] === 'why_reviewing');
check('results hierarchy ends with review readiness', contract.hierarchy.at(-1) === 'review_readiness');

const fixture = {
  assessment: 'home',
  createdAt: '2026-08-20T16:00:00.000Z',
  reviewContext: 'renewal',
  score: 78,
  status: 'Strong Foundation',
  scoreMethodology: { id: 'coveragefit-protection-score-v1', version: '1.1.0' },
  discoveryProfile: {
    product: 'home',
    reasonForReview: rec('renewal_coming', 'My renewal is coming up', 'reasonForReview'),
    primaryPriority: rec('balance', 'Find the right balance', 'primaryPriority'),
    householdContext: {
      facts: [
        rec('primary_residence', 'Yes — this is the home I live in most of the time', 'homeOwnership'),
        rec('6_10', '6–10 years', 'residenceTenure'),
        rec('partner', 'Spouse / partner', 'householdReliance'),
        rec('children', 'Children / dependents', 'householdReliance')
      ]
    },
    lifestyleDependencies: [
      rec('5_plus', '5+ years / long term', 'stayIntent'),
      rec('significant', 'Yes — significant improvements or remodeling', 'homeImprovements'),
      rec('meaningful', 'Meaningful disruption — it would take real coordination', 'displacementDisruption')
    ],
    outcomeConcerns: [
      rec('out_of_pocket', 'A major unexpected out-of-pocket expense', 'outcomeConcerns'),
      rec('temporary_displacement', 'Having to live somewhere else temporarily', 'outcomeConcerns'),
      rec('water_loss', 'A serious water loss', 'outcomeConcerns')
    ]
  },
  strengths: ['Dwelling protection was recently reviewed.', 'Liability limits were reviewed.', 'Deductible is understood.', 'Extra strength'],
  priorities: [
    { tag: 'Water damage', insight: 'Confirm how water loss and the deductible work together.', evidenceQuality: 'confirmed' },
    { tag: 'Liability', insight: 'Confirm the current liability limit.', evidenceQuality: 'partial' },
    { tag: 'Rebuilding', insight: 'Review reconstruction assumptions.', evidenceQuality: 'needs-verification' },
    { tag: 'Extra topic', insight: 'Should not render.' }
  ]
};
const sourceCopy = JSON.stringify(fixture);
const model = api.derive(fixture);

check('derive does not mutate report', JSON.stringify(fixture) === sourceCopy);
check('model schema is v1', model.schemaVersion === '1.0');
check('model product is home', model.product === 'home');
check('generated timestamp follows report', model.generatedAt === fixture.createdAt);
check('why reviewing uses explicit customer evidence', model.whyReviewing.label === 'My renewal is coming up' && model.whyReviewing.personalized === true);
check('why reviewing retains evidence', model.whyReviewing.evidenceRefs.length === 1);
check('what matters uses explicit priority', model.whatMattersMost.label === 'Find the right balance' && model.whatMattersMost.personalized === true);
check('what matters retains evidence', model.whatMattersMost.evidenceRefs.length === 1);
check('home context capped at three', model.homeContext.length === 3);
check('stay horizon is first home context item', model.homeContext[0].id === 'stay-intent');
check('household reliance is second home context item', model.homeContext[1].id === 'household-reliance');
check('household reliance combines explicit household facts', /Spouse \/ partner/.test(model.homeContext[1].value) && /Children \/ dependents/.test(model.homeContext[1].value));
check('displacement is third home context item', model.homeContext[2].id === 'displacement');
check('lower-priority improvements omitted by three-item cap', !model.homeContext.some(item => item.id === 'improvements'));
check('hardest outcomes capped at two', model.hardestOutcomes.length === 2);
check('hardest outcomes preserve customer rank', model.hardestOutcomes[0].rank === 1 && model.hardestOutcomes[1].rank === 2);
check('hardest outcome label preserved', model.hardestOutcomes[0].label === 'A major unexpected out-of-pocket expense');
check('strong starting points capped at three', model.strongStartingPoints.length === 3);
check('worth discussing capped at three', model.worthDiscussing.length === 3);
check('worth discussing preserves scored topic order', model.worthDiscussing.map(item => item.topic).join('|') === 'Water damage|Liability|Rebuilding');
check('worth discussing retains educational summary', /Confirm how water loss/.test(model.worthDiscussing[0].summary));
check('review readiness score unchanged', model.reviewReadiness.score === 78);
check('review readiness status unchanged', model.reviewReadiness.status === 'Strong Foundation');
check('review readiness methodology preserved', model.reviewReadiness.methodologyId === 'coveragefit-protection-score-v1' && model.reviewReadiness.methodologyVersion === '1.1.0');
check('score formula boundary false', model.reviewReadiness.scoreFormulaChanged === false && model.guardrails.scoreFormulaChanged === false);
check('score number boundary false', model.guardrails.scoreNumberChanged === false);
check('recommendation eligibility boundary false', model.guardrails.recommendationEligibilityChanged === false);
check('recommendation ranking boundary false', model.guardrails.recommendationRankingChanged === false);
check('advisory context not coverage finding', model.guardrails.advisoryContextIsCoverageFinding === false);
check('advisory context not recommendation', model.guardrails.advisoryContextIsRecommendation === false);
check('report access security boundary false', model.guardrails.reportAccessSecurityChanged === false);
check('price priority not negative', model.guardrails.customerChoosingPriceIsNegative === false);

const priceModel = api.derive({
  assessment: 'home',
  score: 92,
  status: 'Well Prepared',
  discoveryProfile: { primaryPriority: rec('price', 'Keep my cost down', 'primaryPriority') }
});
check('price-first label is shown verbatim without judgment', priceModel.whatMattersMost.label === 'Keep my cost down');
check('price-first does not lower score', priceModel.reviewReadiness.score === 92);
check('price-first does not fabricate discussion topics', priceModel.worthDiscussing.length === 0);

const unsureModel = api.derive({
  assessment: 'home',
  score: 80,
  discoveryProfile: {
    primaryPriority: rec('unsure', 'I’m not sure yet', 'primaryPriority'),
    householdContext: { facts: [rec('unsure', 'I’m not sure', 'homeOwnership'), rec('prefer_not_to_answer', 'Prefer not to answer', 'householdReliance')] },
    lifestyleDependencies: [rec('unsure', 'I’m not sure yet', 'stayIntent'), rec('prefer_not_to_answer', 'Prefer not to answer', 'displacementDisruption')],
    outcomeConcerns: [rec('unsure', 'I’m not sure yet', 'outcomeConcerns'), rec('prefer_not_to_answer', 'Prefer not to answer', 'outcomeConcerns')]
  }
});
check('unsure priority becomes neutral state', unsureModel.whatMattersMost.label === 'Still deciding' && unsureModel.whatMattersMost.personalized === false);
check('unknown home facts fail closed', unsureModel.homeContext.length === 0);
check('unknown outcomes fail closed', unsureModel.hardestOutcomes.length === 0);

const noEvidenceModel = api.derive({
  assessment: 'home',
  reviewContext: 'Annual Protection Review',
  score: 75,
  discoveryProfile: {
    reasonForReview: { value: 'renewal_coming', label: 'My renewal is coming up', evidenceRefs: [] },
    primaryPriority: { value: 'protection', label: 'Protect myself as strongly as practical', evidenceRefs: [] },
    lifestyleDependencies: [{ value: '5_plus', label: '5+ years / long term', evidenceRefs: [] }]
  }
});
check('evidence-less reason does not personalize claim', noEvidenceModel.whyReviewing.personalized === false);
check('evidence-less reason falls back to existing report context', noEvidenceModel.whyReviewing.label === 'Annual Protection Review');
check('evidence-less priority does not personalize claim', noEvidenceModel.whatMattersMost.personalized === false);
check('evidence-less home context suppressed', noEvidenceModel.homeContext.length === 0);

const legacyModel = api.derive({
  assessment: 'home',
  reviewContext: 'Home Purchase Review',
  score: 66,
  status: 'Review Recommended',
  strengths: ['Structured review completed.'],
  priorities: [{ tag: 'Rebuilding', insight: 'Confirm rebuilding assumptions.' }]
});
check('legacy report can derive model without discovery profile', legacyModel.whyReviewing.label === 'Home Purchase Review');
check('legacy report gets neutral priority fallback', legacyModel.whatMattersMost.label === 'Not specified yet');
check('legacy report keeps strengths', legacyModel.strongStartingPoints.length === 1);
check('legacy report keeps scored discussion agenda', legacyModel.worthDiscussing.length === 1);
check('legacy score remains unchanged', legacyModel.reviewReadiness.score === 66);

check('assessment loads results model before assessment engine', assessmentHtml.indexOf('advisory-results-model.js') > 0 && assessmentHtml.indexOf('advisory-results-model.js') < assessmentHtml.indexOf('assessment-engine.js'));
check('assessment engine references results model', assessmentJs.includes('CoverageFitAdvisoryResultsModel'));
check('assessment engine persists advisory results', assessmentJs.includes('report.advisoryResults = advisoryResults.derive(report)'));
check('report loads results model stylesheet', reportHtml.includes('/assets/css/advisory-results-model.css'));
check('report loads results model runtime after report engine', reportHtml.indexOf('report-engine.js') < reportHtml.indexOf('advisory-results-model.js'));
check('report has Your CoverageFit heading', reportHtml.includes('id="your-coveragefit-title"') && reportHtml.includes('Start with what matters to you.'));
check('report declares advisory context boundary', reportHtml.includes('not a judgment about your current policy') && reportHtml.includes('not a coverage recommendation'));
check('why/priority context appears before strengths', reportHtml.indexOf('data-advisory-results-context') < reportHtml.indexOf('id="prospect-strengths-title"'));
check('strong starting points appear before worth discussing', reportHtml.indexOf('id="prospect-strengths-title"') < reportHtml.indexOf('data-advisory-results-discussion'));
check('worth discussing appears before review readiness', reportHtml.indexOf('data-advisory-results-discussion') < reportHtml.indexOf('data-cf-interactive-snapshot'));
check('review readiness appears before disclaimer', reportHtml.indexOf('data-cf-interactive-snapshot') < reportHtml.indexOf('prospect-report-disclaimer'));
check('detailed licensed review topics remain on page two', (reportHtml.includes('Three focused questions for your licensed review') || reportHtml.includes('See the reason behind each discussion topic')) && reportHtml.includes('id="priorities"'));
check('report page count unchanged', (reportHtml.match(/Page [123] of 3/g) || []).length === 3);
check('interactive score copy calls score supporting diagnostic', interactiveJs.includes('A supporting diagnostic—not the headline.'));
check('interactive score copy says priorities remain context', interactiveJs.includes('Your priorities and situation above remain the context'));
check('interactive score uses Review Readiness Score label', interactiveJs.includes('Review Readiness Score'));
check('results CSS supports mobile', css.includes('@media(max-width:620px)'));
check('results CSS supports reduced motion', css.includes('@media(prefers-reduced-motion:reduce)'));
check('results CSS supports print', css.includes('@media print'));
check('results CSS avoids hiding report context on mobile', !/max-width:620px[\s\S]{0,500}display\s*:\s*none/.test(css));

const expectedHashes = {
  'assets/js/protection-score.js': '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8',
  'assets/js/home-recommendation-rules.js': '0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629',
  'assets/js/recommendation-engine.js': '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18',
  'assets/js/workspace-data.js': '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2',
  'assets/js/prospect-report-access.js': '89173d5b218e9b7d8d78c106e427c3edb2faf894fac64ccbdd3a52babd3eed70',
  'server/prospect-report-core.mjs': '4b7fd6023be641fd2055e5b24720c3b2d5cecf9e194a3e6650bdccfabe0f18f5'
};
for (const [rel, expected] of Object.entries(expectedHashes)) {
  check(`${rel} remains byte-identical`, hash(rel) === expected);
}
check('private report access runtime unchanged', contract.boundaries.report_access_security_changed === false);
check('report TTL unchanged by contract', contract.boundaries.report_ttl_changed === false);
check('score methodology unchanged by contract', contract.boundaries.score_methodology_changed === false);

check('roadmap marks 1.11 complete', /CF-ADV-1\.11 implementation status — COMPLETE in v3\.20\.82/.test(read('CF-ADV-ROADMAP.md')));
check('roadmap advances to 1.12', /Next: `CF-ADV-1\.12 — “Why This Fits You” Recommendation Cards`/.test(read('CF-ADV-ROADMAP.md')));
check('changelog records 1.11', /3\.20\.82 — CF-ADV-1\.11/.test(read('CHANGELOG.md')));
check('release highlights records 1.11', /v3\.20\.82 — CF-ADV-1\.11/.test(read('RELEASE_HIGHLIGHTS.md')));

console.log(JSON.stringify({
  suite: 'CF-ADV-1.11 QA',
  version,
  passed: checks.length,
  failed: 0,
  checks
}, null, 2));
