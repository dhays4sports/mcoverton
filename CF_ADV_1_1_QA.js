#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const checks = [];
const check = (name, condition) => { assert(condition, name); checks.push(name); };

const contract = require('./assets/js/advisory-discovery-contract.js');

const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
check('release remains compatible with CF-ADV-1.1 baseline', /^3\.20\.\d+$/.test(version) && Number(version.split('.')[2]) >= 72 && pkg.version === version);

check('contract is versioned for CF-ADV-1.1', contract.VERSION === '1.0.0' && contract.SCHEMA_VERSION === '1.0' && contract.BUILD === 'CF-ADV-1.1');
check('contract API is frozen', Object.isFrozen(contract));
check('contract identifier is stable', contract.CONTRACT_ID === 'coveragefit-advisory-discovery-profile-v1');

const blank = contract.create({ product: 'home' });
const expectedFields = [
  'reasonForReview','currentRelationship','primaryPriority','secondaryPriorities','lifestyleDependencies',
  'householdContext','protectionProfile','outcomeConcerns','currentCoveragePreferences','customerStatements',
  'customerSignals','recommendationAnchors','recommendationResponses'
];
check('blank profile contains complete advisory field set', expectedFields.every(key => Object.prototype.hasOwnProperty.call(blank, key)));
check('future derived/reaction layers are inert by default', blank.customerSignals.length === 0 && blank.recommendationAnchors.length === 0 && blank.recommendationResponses.length === 0);
check('guardrails separate advisory discovery from score and binding', blank.guardrails.discoveryDoesNotAffectProtectionScore === true && blank.guardrails.buyInIsNotBindingAuthorization === true && blank.guardrails.recommendationIsNotCustomerDecision === true);
check('empty contract does not pretend discovery exists', contract.hasDiscovery(blank) === false);

const seeded = contract.seedFromExistingContext({
  product: 'home',
  reviewReason: 'Renewal increased',
  prospect: { currentCarrier: 'AAA', integration: { sessionId: 'session-123', entry: 'home-review' } }
});
check('existing review reason seeds without invention', seeded.reasonForReview?.value === 'Renewal increased' && seeded.reasonForReview?.source === '408farmers_handoff');
check('existing carrier seeds current relationship', seeded.currentRelationship?.carrier?.value === 'AAA');
check('seeded facts retain evidence refs', seeded.reasonForReview.evidenceRefs[0]?.key === 'reviewContext' && seeded.currentRelationship.carrier.evidenceRefs[0]?.key === 'currentCarrier');
check('seed context does not derive future signals early', seeded.customerSignals.length === 0 && seeded.recommendationAnchors.length === 0);
check('seeded contract reports meaningful discovery', contract.hasDiscovery(seeded) === true);

const enriched = contract.merge(seeded, {
  product: 'home',
  primaryPriority: { value: 'balance', label: 'Find the right balance', source: 'coveragefit_assessment' },
  outcomeConcerns: [{ value: 'unexpected_expense', label: 'A major unexpected out-of-pocket expense', source: 'coveragefit_assessment' }],
  customerStatements: [{ id: 'statement-priority', topic: 'priority', text: 'I want a balance between price and protection.', source: 'coveragefit_assessment', sourceKey: 'primaryPriority' }]
});
check('merge preserves inherited reason and carrier', enriched.reasonForReview.value === 'Renewal increased' && enriched.currentRelationship.carrier.value === 'AAA');
check('merge adds later discovery without parallel state', enriched.primaryPriority.value === 'balance' && enriched.outcomeConcerns.length === 1 && enriched.customerStatements.length === 1);

const unsupportedSignal = contract.create({
  product: 'home',
  customerSignals: [{ key: 'homeCommitment', label: 'High home commitment', status: 'active' }]
});
const signalValidation = contract.validate(unsupportedSignal);
check('unsupported signal is warned rather than silently trusted', signalValidation.valid === true && signalValidation.warnings.some(message => message.includes('has no evidence reference')));

const supportedAnchor = contract.create({
  product: 'home',
  recommendationAnchors: [{
    recommendationKey: 'water',
    becauseYouToldUs: 'You said a large unexpected expense is one of your biggest concerns.',
    source: 'coveragefit_consultation',
    evidenceRefs: [{ source: 'coveragefit_assessment', key: 'outcomeConcerns', label: 'Unexpected expense selected' }]
  }]
});
check('future anchors have an evidence-backed contract location', contract.validate(supportedAnchor).warnings.length === 0 && supportedAnchor.recommendationAnchors[0].evidenceRefs.length === 1);

const contractJson = JSON.parse(read('CF_ADV_1_1_CONTRACT.json'));
check('JSON contract matches runtime identifiers', contractJson.schemaVersion === contract.SCHEMA_VERSION && contractJson.contractVersion === contract.VERSION && contractJson.contractId === contract.CONTRACT_ID);
check('JSON contract explicitly isolates score behavior', Object.values(contractJson.scorePolicy).every(value => value === false));
check('JSON contract preserves zero-repeat semantics', contractJson.zeroRepeat.preserveExistingTrustedHandoff === true && contractJson.zeroRepeat.doNotReaskKnownFields === true);

const assessmentHtml = read('assessment/index.html');
const businessAssessmentHtml = read('business/assessment/index.html');
const assessmentEngine = read('assets/js/assessment-engine.js');
const scoreEngine = read('assets/js/protection-score.js');
check('assessment loads advisory contract before assessment engine', assessmentHtml.indexOf('/assets/js/advisory-discovery-contract.js') > -1 && assessmentHtml.indexOf('/assets/js/advisory-discovery-contract.js') < assessmentHtml.indexOf('/assets/js/assessment-engine.js'));
check('all assessment-engine routes load advisory contract first', businessAssessmentHtml.indexOf('/assets/js/advisory-discovery-contract.js') > -1 && businessAssessmentHtml.indexOf('/assets/js/advisory-discovery-contract.js') < businessAssessmentHtml.indexOf('/assets/js/assessment-engine.js'));
check('assessment payload includes discoveryProfile', (assessmentEngine.includes('const discoveryProfile = advisoryDiscovery?.seedFromExistingContext?.({') || assessmentEngine.includes('let discoveryProfile = advisoryDiscovery?.seedFromExistingContext?.({')) && assessmentEngine.includes('      discoveryProfile,'));
check('Protection Score engine has no advisory contract dependency', !scoreEngine.includes('AdvisoryDiscovery') && !scoreEngine.includes('discoveryProfile'));

// Workspace transport contract: the additive advisory adapter should normalize new profiles and safely expose an empty profile for legacy reports.
global.CoverageFitAdvisoryDiscoveryContract = contract;
delete require.cache[require.resolve('./assets/js/workspace-data.js')];
const workspace = require('./assets/js/workspace-data.js');
global.CoverageFitWorkspaceData = workspace;
delete require.cache[require.resolve('./assets/js/advisory-workspace-data.js')];
const advisoryWorkspace = require('./assets/js/advisory-workspace-data.js');
const readySnapshot = advisoryWorkspace.getSnapshot({ report: {
  assessment: 'home',
  createdAt: '2026-08-19T19:00:00-07:00',
  score: 82,
  status: 'Strong Foundation',
  strengths: ['Structured review complete'],
  priorities: [{ name: 'Water protection', tag: 'Water protection', insight: 'Confirm terms', evidenceQuality: 'confirmed' }],
  discoveryProfile: enriched
}, propertyProfile: null, consultationRecord: null });
check('advisory Workspace snapshot exposes normalized discoveryProfile', readySnapshot.discoveryProfile?.contractId === contract.CONTRACT_ID && readySnapshot.discoveryProfile?.primaryPriority?.value === 'balance');
const legacySnapshot = advisoryWorkspace.getSnapshot({ report: {
  assessment: 'home',
  createdAt: '2026-08-19T19:00:00-07:00',
  score: 82,
  status: 'Strong Foundation',
  strengths: [],
  priorities: []
}, propertyProfile: null, consultationRecord: null });
check('legacy reports receive safe empty advisory profile', legacySnapshot.discoveryProfile?.contractId === contract.CONTRACT_ID && contract.hasDiscovery(legacySnapshot.discoveryProfile) === false);
const workspaceHtml = read('agent/workspace/index.html');
check('Workspace loads additive advisory adapter after frozen base adapter', workspaceHtml.indexOf('/assets/js/workspace-data.js') > -1 && workspaceHtml.indexOf('/assets/js/advisory-workspace-data.js') > workspaceHtml.indexOf('/assets/js/workspace-data.js'));
check('legacy Workspace adapter remains byte-compatible', require('node:crypto').createHash('sha256').update(read('assets/js/workspace-data.js')).digest('hex') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');

const consultationRecords = read('assets/js/consultation-records.js');
check('consultation record retains complete report payload', consultationRecords.includes('report: clone(report)'));

const roadmap = read('CF-ADV-ROADMAP.md');
const sprintNames = [
  'CF-ADV-1.1','CF-ADV-1.2','CF-ADV-1.3','CF-ADV-1.4','CF-ADV-1.5','CF-ADV-1.6','CF-ADV-1.7','CF-ADV-1.8','CF-ADV-1.9','CF-ADV-1.10',
  'CF-ADV-1.11','CF-ADV-1.12','CF-ADV-1.13','CF-ADV-1.14','CF-ADV-1.15','CF-ADV-1.16','CF-ADV-1.17','CF-ADV-1.18','CF-ADV-1.19','CF-ADV-1.20','CF-ADV-1.21','CF-ADV-1.22','CF-ADV-1.23',
  'CF-ADV-2.1','CF-ADV-2.2','CF-ADV-2.3','CF-ADV-2.4','CF-ADV-2.5','CF-ADV-3.1','CF-ADV-3.2','CF-ADV-3.3'
];
check('entire detailed sprint roadmap is retained in repository', sprintNames.every(name => roadmap.includes(name)) && roadmap.includes('Program invariants') && roadmap.includes('Dependency map') && roadmap.includes('Resumption instructions'));

console.log(JSON.stringify({ suite: 'CF-ADV-1.1', pass: true, checks: checks.length, checks }, null, 2));
