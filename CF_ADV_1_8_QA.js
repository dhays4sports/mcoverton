const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = __dirname;
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(root, rel));
const checks = [];
function check(name, condition) { assert.ok(condition, name); checks.push(name); }
const version = read('VERSION').trim();
const pkg = JSON.parse(read('package.json'));
const html = read('assessment/index.html');
const engine = read('assets/js/assessment-engine.js');
const css = read('assets/css/advisory-assessment-orchestration.css');
const moduleText = read('assets/js/advisory-assessment-orchestration.js');
const contract = JSON.parse(read('CF_ADV_1_8_ORCHESTRATION_CONTRACT.json'));
const scoring = require('./assets/js/protection-score.js');
const hash = rel => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, rel))).digest('hex');

function loadConfig(withOrchestration = false) {
  const sandbox = { window: {}, globalThis: {} };
  sandbox.globalThis = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(read('home/assessment-config.js'), sandbox, { filename: 'home/assessment-config.js' });
  if (withOrchestration) vm.runInContext(moduleText, sandbox, { filename: 'advisory-assessment-orchestration.js' });
  return { config: sandbox.window.COVERAGEFIT_CONFIG, api: sandbox.window.CoverageFitAdvisoryAssessmentOrchestration };
}
function profile(data = {}, verifiedFields = Object.keys(data)) {
  return {
    profileId: 'cfadv18-profile', status: 'confirmed', data,
    fieldMeta: Object.fromEntries(Object.keys(data).map(key => [key, { verifiedByUser: verifiedFields.includes(key), source: verifiedFields.includes(key) ? 'user' : 'provider' }]))
  };
}
function selectionSet(questions, answerIndex = 1) {
  return Object.fromEntries(questions.map(question => [question.key, question.answers[Math.min(answerIndex, question.answers.length - 1)]]));
}
function normalizedScore(evaluation) { const categories = Array.isArray(evaluation.categories) ? [...evaluation.categories].sort((a,b)=>String(a.category||a.name||'').localeCompare(String(b.category||b.name||''))) : evaluation.categories; return { score: evaluation.score, status: evaluation.status, categories }; }

check('release remains compatible after 3.20.79', /^3\.20\.(79|8\d|9\d)$/.test(version) && pkg.version === version);
check('package remains compatible after conversational orchestration', /Conversational Assessment Orchestration|Progressive Discovery Branching|Customer Language & Reaction Layer|Your CoverageFit Results Model|Why This Fits You Recommendation Cards/i.test(pkg.description));
check('orchestration runtime exists', exists('assets/js/advisory-assessment-orchestration.js'));
check('orchestration stylesheet exists', exists('assets/css/advisory-assessment-orchestration.css'));
check('orchestration contract exists', exists('CF_ADV_1_8_ORCHESTRATION_CONTRACT.json'));
check('sprint documentation exists', exists('SPRINT-CF-ADV-1.8.md'));
check('contract identity is stable', contract.id === 'coveragefit-conversational-assessment-orchestration-v1' && contract.sprint === 'CF-ADV-1.8');
check('contract explicitly protects scoring', contract.boundaries.score_formula_changed === false && contract.boundaries.answer_impacts_changed === false && contract.boundaries.weights_changed === false);
check('contract explicitly excludes progressive branching', contract.boundaries.progressive_branching === false);
check('contract explicitly keeps discovery non-scoring', contract.boundaries.discovery_is_scoring === false);

const loaded = loadConfig(true);
const config = loaded.config;
const api = loaded.api;
check('runtime exports orchestration API', Boolean(api && api.BUILD === 'CF-ADV-1.8' && api.VERSION === '1.0.0'));
check('runtime contract id matches JSON contract', api.CONTRACT_ID === contract.id);
check('exactly six conversational chapters exist', api.CHAPTERS.length === 6);
check('chapters are numbered 1 through 6', api.CHAPTERS.every((chapter, index) => chapter.number === index + 1));
check('chapter 1 is why reviewing', api.CHAPTERS[0].title === 'Why you’re reviewing');
check('chapter 2 is home and household', api.CHAPTERS[1].title === 'Your home and household');
check('chapter 3 captures dependency and priorities', api.CHAPTERS[2].title === 'What you depend on / what matters');
check('chapter 4 is current protection', api.CHAPTERS[3].title === 'How your current protection works');
check('chapter 5 is outcomes worth planning for', api.CHAPTERS[4].title === 'Outcomes worth planning for');
check('chapter 6 is things worth reviewing', api.CHAPTERS[5].title === 'Things worth reviewing');
check('first three chapters are discovery-only', api.CHAPTERS.slice(0,3).every(chapter => chapter.mode === 'discovery'));
check('last three chapters are scored-review chapters', api.CHAPTERS.slice(3).every(chapter => chapter.mode === 'scored-review'));

const plain = loadConfig(false).config;
const basePlain = plain.resolveQuestions({ selections: {}, profile: {}, reviewReason: '' });
const baseOrchestrated = config.resolveQuestions({ selections: {}, profile: {}, reviewReason: '' });
check('orchestration preserves active core question count', baseOrchestrated.length === basePlain.length && baseOrchestrated.length === 11);
check('orchestration preserves exact active question key set', [...baseOrchestrated.map(q=>q.key)].sort().join('|') === [...basePlain.map(q=>q.key)].sort().join('|'));
check('orchestration preserves exact total active weight', baseOrchestrated.reduce((s,q)=>s+q.weight,0) === basePlain.reduce((s,q)=>s+q.weight,0));
check('orchestration preserves answer catalogs', baseOrchestrated.every(q => JSON.stringify(q.answers) === JSON.stringify(basePlain.find(p=>p.key===q.key).answers)));
check('orchestration preserves question titles', baseOrchestrated.every(q => q.title === basePlain.find(p=>p.key===q.key).title));
check('orchestration preserves constructs', baseOrchestrated.every(q => q.construct === basePlain.find(p=>p.key===q.key).construct));
check('orchestration annotates all active questions with chapter metadata', baseOrchestrated.every(q => q.advisoryChapterNumber >= 4 && q.advisoryChapterNumber <= 6 && q.advisoryChapterId));
check('orchestration is stable within each chapter', baseOrchestrated.every((q,i,list) => i === 0 || q.advisoryChapterNumber >= list[i-1].advisoryChapterNumber));

const expectedBaseOrder = ['dwelling','extendedReplacement','ordinanceLaw','water','deductible','personalProperty','liability','lossOfUse','umbrella','lifeEvents','separatePerils'];
check('base Home questions follow conversational chapter order', baseOrchestrated.map(q=>q.key).join('|') === expectedBaseOrder.join('|'));
check('current-protection chapter contains six core questions', baseOrchestrated.filter(q=>q.advisoryChapterNumber===4).length === 6);
check('planning-outcomes chapter contains three core questions', baseOrchestrated.filter(q=>q.advisoryChapterNumber===5).length === 3);
check('worth-reviewing chapter contains two core questions', baseOrchestrated.filter(q=>q.advisoryChapterNumber===6).length === 2);
check('life events move into the final review chapter', api.chapterForQuestion({key:'lifeEvents'}).id === 'worth-reviewing');
check('separate hazards remain in the final review chapter', api.chapterForQuestion({key:'separatePerils'}).id === 'worth-reviewing');
check('loss of use is an outcomes-planning question', api.chapterForQuestion({key:'lossOfUse'}).id === 'planning-outcomes');
check('deductible remains a current-policy understanding question', api.chapterForQuestion({key:'deductible'}).id === 'current-protection');

const all = config.resolveQuestions({ selections: {}, profile: profile({ pool: true, detachedStructures: true, roofYear: new Date().getFullYear()-20, roofType: 'Tile' }), reviewReason: '' });
check('all three existing property-aware branches remain available', ['poolLiabilityReview','detachedStructuresReview','roofTermsReview'].every(key => all.some(q=>q.key===key)));
check('pool review remains immediately after liability', all.findIndex(q=>q.key==='poolLiabilityReview') === all.findIndex(q=>q.key==='liability') + 1);
check('detached structure review remains immediately after personal property', all.findIndex(q=>q.key==='detachedStructuresReview') === all.findIndex(q=>q.key==='personalProperty') + 1);
check('roof terms remain immediately after water', all.findIndex(q=>q.key==='roofTermsReview') === all.findIndex(q=>q.key==='water') + 1);
check('pool review inherits outcomes-planning chapter', all.find(q=>q.key==='poolLiabilityReview').advisoryChapterNumber === 5);
check('detached structures inherit current-protection chapter', all.find(q=>q.key==='detachedStructuresReview').advisoryChapterNumber === 4);
check('roof terms inherit current-protection chapter', all.find(q=>q.key==='roofTermsReview').advisoryChapterNumber === 4);
check('property branch conditions themselves remain in existing config', plain.propertyQuestions.every(q => typeof q.condition === 'function'));

const first = api.questionContext(baseOrchestrated, 0);
const ch5Index = baseOrchestrated.findIndex(q=>q.advisoryChapterNumber===5);
const ch6Index = baseOrchestrated.findIndex(q=>q.advisoryChapterNumber===6);
const last = api.questionContext(baseOrchestrated, baseOrchestrated.length-1);
check('first scored question reports chapter 4 of 6', first.chapter.number === 4 && first.coverageQuestionNumber === 1 && first.coverageQuestionCount === 11);
check('first question reports entry into chapter', first.enteredChapter === true);
check('second question does not falsely report a new chapter', api.questionContext(baseOrchestrated,1).enteredChapter === false);
check('chapter 5 boundary is detected', api.questionContext(baseOrchestrated,ch5Index).enteredChapter === true && api.questionContext(baseOrchestrated,ch5Index).chapter.number === 5);
check('chapter 6 boundary is detected', api.questionContext(baseOrchestrated,ch6Index).enteredChapter === true && api.questionContext(baseOrchestrated,ch6Index).chapter.number === 6);
check('coverage progress starts above zero', first.progressPercent > 0 && first.progressPercent < 100);
check('coverage progress ends at 100', last.progressPercent === 100);
check('progress text explicitly says coverage question', first.progressText.startsWith('Coverage question 1 of 11.'));
check('chapter-local question count is truthful', first.chapterQuestionNumber === 1 && first.chapterQuestionCount === 6);

const baseSelections = selectionSet(basePlain, 1);
const orchestratedSelections = Object.fromEntries(baseOrchestrated.map(q => [q.key, baseSelections[q.key]]));
const beforeEval = scoring.evaluate({ questions: basePlain, selections: baseSelections, methodology: plain.scoreMethodology });
const afterEval = scoring.evaluate({ questions: baseOrchestrated, selections: orchestratedSelections, methodology: config.scoreMethodology });
check('identical answers preserve numeric Protection Score after reordering', beforeEval.score === afterEval.score);
check('identical answers preserve score band/status after reordering', beforeEval.status === afterEval.status);
check('identical answers preserve normalized category scores', JSON.stringify(normalizedScore(beforeEval).categories) === JSON.stringify(normalizedScore(afterEval).categories));
check('orchestration does not add or remove findings', beforeEval.findings.length === afterEval.findings.length);
check('orchestration does not change per-key weighted penalty', beforeEval.findings.every(f => afterEval.findings.find(a=>a.key===f.key)?.weightedPenalty === f.weightedPenalty));

check('assessment loads orchestration stylesheet', html.includes('/assets/css/advisory-assessment-orchestration.css'));
check('assessment loads orchestration runtime', html.includes('/assets/js/advisory-assessment-orchestration.js'));
check('orchestration runtime loads after outcome discovery', html.indexOf('/assets/js/advisory-assessment-orchestration.js') > html.indexOf('/assets/js/advisory-outcome-discovery.js'));
check('orchestration runtime loads before assessment engine', html.indexOf('/assets/js/advisory-assessment-orchestration.js') < html.indexOf('/assets/js/assessment-engine.js'));
check('assessment contains semantic chapter card', html.includes('id="assessmentChapter"') && html.includes('aria-labelledby="assessmentChapterTitle"'));
check('assessment chapter exposes title and description nodes', html.includes('id="assessmentChapterTitle"') && html.includes('id="assessmentChapterCopy"'));
check('progress bar is explicitly scoped to coverage review', html.includes('aria-label="Coverage review progress"'));
check('initial progress text is explicitly a coverage question', html.includes('aria-valuetext="Coverage question 1 of 11"'));

check('assessment engine consumes orchestration API', engine.includes('CoverageFitAdvisoryAssessmentOrchestration'));
check('assessment engine renders coverage-question wording', engine.includes('Coverage question ${conversation.coverageQuestionNumber} of ${conversation.coverageQuestionCount}'));
check('assessment engine renders chapter count', engine.includes('Chapter ${conversation.chapter.number} of 6'));
check('assessment engine exposes chapter id on body', engine.includes('document.body.dataset.assessmentChapter = conversation.chapter.id'));
check('assessment engine persists chapter metadata without replacing question key', engine.includes('advisoryChapterId:') && engine.includes('currentQuestionKey: question?.key'));
check('assessment engine final CTA is conversational', engine.includes("'Review What We Found'"));
check('assessment engine no longer injects obsolete business-style coverage intro', !engine.includes("intro.id = 'coverageSectionIntro'"));
check('assessment chapter entry analytics are non-scoring', engine.includes("'advisory_assessment_chapter_entered'") && engine.includes('scoreFormulaChanged: false'));
check('reduced-motion CSS removes chapter animation', css.includes('@media (prefers-reduced-motion:reduce)') && css.includes('animation:none'));
check('mobile CSS stacks chapter metadata', css.includes('@media (max-width:640px)') && css.includes('flex-direction:column'));

check('Protection Score implementation remains byte-certified', hash('assets/js/protection-score.js') === '0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8');
check('Home recommendation rules remain byte-certified', hash('assets/js/home-recommendation-rules.js') === '0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629');
check('recommendation engine remains byte-certified', hash('assets/js/recommendation-engine.js') === '0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18');
check('legacy Workspace adapter remains byte-certified', hash('assets/js/workspace-data.js') === '8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2');
check('orchestration module explicitly declares score formula unchanged', moduleText.includes("scoreFormulaChanged: false"));
check('orchestration module explicitly declares progressive branching false', moduleText.includes("progressiveBranching: false"));
check('orchestration module does not mutate answer points', !/\.points\s*=|scoreImpact\s*=|weight\s*=/.test(moduleText));
check('roadmap marks CF-ADV-1.8 complete', read('CF-ADV-ROADMAP.md').includes('CF-ADV-1.8 implementation status — COMPLETE in v3.20.79'));
check('roadmap advances to CF-ADV-1.9', read('CF-ADV-ROADMAP.md').includes('Next: `CF-ADV-1.9 — Progressive Discovery Branching`'));

console.log(`CF-ADV-1.8 QA: ${checks.length}/${checks.length} passed`);
