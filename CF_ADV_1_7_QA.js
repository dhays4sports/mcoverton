const fs=require('fs'), path=require('path'), assert=require('assert'), crypto=require('crypto');
const root=__dirname, read=f=>fs.readFileSync(path.join(root,f),'utf8');
let checks=0; const check=(name,cond)=>{assert.ok(cond,name); checks++;};
const version=read('VERSION').trim(), pkg=JSON.parse(read('package.json'));
const html=read('assessment/index.html'), js=read('assets/js/advisory-outcome-discovery.js');
const engine=read('assets/js/assessment-engine.js'), cont=read('assets/js/assessment-continuity.js');
const life=read('assets/js/advisory-lifestyle-discovery.js'), rel=read('assets/js/advisory-relationship-discovery.js');
const open=read('assets/js/advisory-opening.js'), prop=read('assets/js/property-confirmation.js');
check('release advances to 3.20.78',['3.20.78','3.20.79','3.20.80','3.20.81','3.20.82','3.20.83'].includes(version)&&pkg.version===version);
check('outcome runtime loaded',html.includes('/assets/js/advisory-outcome-discovery.js'));
check('outcome stylesheet loaded',html.includes('/assets/css/advisory-outcome.css'));
check('outcome section exists',html.includes('id="advisoryOutcome"'));
check('outcome question exists',html.includes('name="advisory_outcome_concern"'));
for(const key of ['out_of_pocket','temporary_displacement','rebuild_properly','replace_belongings','water_loss','liability_finances','premium_low','unsure','prefer_not_to_answer','other']) check(`choice ${key}`,html.includes(`value="${key}"`));
check('choose up to two copy',html.includes('Choose up to two.'));
check('priority order copy',html.includes('first selection is kept first'));
check('non-fear framing',html.includes('not about imagining a worst-case scenario'));
check('preference boundary visible',html.includes('These are preferences, not scored findings.'));
check('score boundary visible',html.includes('They do not change your Protection Score'));
check('recommendation boundary visible',html.includes('create coverage recommendations'));
check('purchase boundary visible',html.includes('agreed to buy anything'));
check('max selection constant',js.includes('const MAX_SELECTIONS = 2'));
check('exclusive unsure/privacy states',js.includes("{ key: 'unsure'")&&js.includes("{ key: 'prefer_not_to_answer'")&&js.includes('exclusive: true'));
check('selection order is append order',js.includes('state.concerns = [...existing, makeRecord(key'));
check('third selection fails closed',js.includes('existing.length >= MAX_SELECTIONS'));
check('other text is required',js.includes("item.key === 'other' && !text(item.label)"));
check('outcome evidence key',js.includes("key: 'outcomeConcerns'"));
check('outcome records stored in discovery profile',js.includes('outcomeConcerns,'));
check('custom other stored as customer statement',js.includes("topic: 'outcomeConcerns.other'"));
check('runtime does not create signals',!js.includes('customerSignals'));
check('runtime does not create recommendations',!js.includes('recommendationAnchors'));
check('runtime does not create recommendation responses',!js.includes('recommendationResponses'));
check('lifestyle starts outcome',life.includes('CoverageFitAdvisoryOutcomeDiscovery?.start'));
check('relationship can fall through to outcome',rel.includes('CoverageFitAdvisoryOutcomeDiscovery?.start'));
check('opening can fall through to outcome',open.includes('CoverageFitAdvisoryOutcomeDiscovery?.start'));
check('property confirmation can start outcome',prop.includes('advisoryOutcome?.start?.({ propertyProfileId'));
check('property resume can start outcome',prop.includes('advisoryOutcome?.start?.({ resume: true'));
check('assessment merges outcome profile',engine.includes('advisoryOutcome?.getDiscoveryProfile?.()'));
check('assessment resets outcome on retake',engine.includes('advisoryOutcome?.reset?.()'));
check('assessment listens for outcome completion',engine.includes("coveragefit:advisory-outcome-completed"));
check('continuity names outcome draft',cont.includes('advisoryOutcome'));
check('resume copy names outcome priority',cont.includes('We saved the outcomes you started prioritizing.'));

const contract=require('./assets/js/advisory-discovery-contract.js');
global.CoverageFitAdvisoryDiscoveryContract=contract;
const signalEngine=require('./assets/js/advisory-signal-engine.js');
const outcome=require('./assets/js/advisory-outcome-discovery.js');
check('runtime contract id stable',outcome.CONTRACT_ID==='coveragefit-outcome-concern-discovery-v1');
check('runtime max selections stable',outcome.MAX_SELECTIONS===2);
check('catalog exposes 10 explicit choices',outcome.CATALOG.length===10);
const ordered=contract.create({product:'home',outcomeConcerns:[
  {value:'water_loss',label:'A serious water loss',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'outcomeConcerns',label:'Outcome question'}]},
  {value:'out_of_pocket',label:'A major unexpected out-of-pocket expense',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'outcomeConcerns',label:'Outcome question'}]}
]});
check('discovery contract preserves concern order',ordered.outcomeConcerns[0].value==='water_loss'&&ordered.outcomeConcerns[1].value==='out_of_pocket');
check('outcome concern evidence retained',ordered.outcomeConcerns.every(x=>x.evidenceRefs.length===1));
const signaled=signalEngine.apply(ordered);
check('outcome concerns alone create no active customer signal',!signaled.customerSignals.some(x=>x.status==='active'));

const hash=f=>crypto.createHash('sha256').update(read(f)).digest('hex');
const base='/mnt/data/cfadv17_baseline';
for(const f of ['assets/js/protection-score.js','assets/js/home-recommendation-rules.js','assets/js/recommendation-engine.js','assets/js/workspace-data.js']){
  check(`protected file unchanged ${f}`,hash(f)===crypto.createHash('sha256').update(fs.readFileSync(path.join(base,f))).digest('hex'));
}
console.log(`CF-ADV-1.7 QA: ${checks}/${checks} passed`);
