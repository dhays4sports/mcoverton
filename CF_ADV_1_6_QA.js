const fs=require('fs'), path=require('path'), assert=require('assert');
const root=__dirname, read=f=>fs.readFileSync(path.join(root,f),'utf8');
let checks=0; const check=(name,cond)=>{assert.ok(cond,name); checks++;};
const version=read('VERSION').trim(), pkg=JSON.parse(read('package.json'));
const html=read('assessment/index.html'), js=read('assets/js/advisory-lifestyle-discovery.js'), engine=read('assets/js/assessment-engine.js'), cont=read('assets/js/assessment-continuity.js'), rel=read('assets/js/advisory-relationship-discovery.js'), prop=read('assets/js/property-confirmation.js'), sig=read('assets/js/advisory-signal-engine.js');
check('release advances to 3.20.77',['3.20.77','3.20.78','3.20.79','3.20.80','3.20.81','3.20.82','3.20.83'].includes(version)&&pkg.version===version);
check('lifestyle runtime loaded',html.includes('/assets/js/advisory-lifestyle-discovery.js'));
check('lifestyle stylesheet loaded',html.includes('/assets/css/advisory-lifestyle.css'));
check('lifestyle section exists',html.includes('id="advisoryLifestyle"'));
for(const n of ['advisory_primary_home','advisory_residence_tenure','advisory_stay_intent','advisory_improvements','advisory_household_reliance','advisory_displacement']) check(`question ${n}`,html.includes(`name="${n}"`));
for(const key of ['primary_residence','not_primary','under_1','1_2','3_5','6_10','10_plus','under_2','2_5','5_plus','significant','some','none','just_me','partner','children','other_household','major','meaningful','manageable','minimal','unsure','prefer_not_to_answer']) check(`choice ${key}`,html.includes(`value="${key}"`));
check('privacy copy avoids names',html.includes('We do not need names, ages, or personal details.'));
check('displacement is non-catastrophe framed',html.includes('not about imagining a worst-case scenario'));
check('score boundary visible',html.includes('These answers do not change your Protection Score.'));
for(const key of ['homeOwnership','residenceTenure','stayIntent','homeImprovements','householdReliance','displacementDisruption']) check(`evidence key ${key}`,js.includes(`'${key}'`));
check('household facts stored',js.includes('householdContext: { source: SOURCE, facts: householdFacts'));
check('lifestyle dependencies stored',js.includes('lifestyleDependencies,'));
check('custom wording stored as statement',js.includes("topic: 'householdContext.reliance'"));
check('does not write outcomeConcerns',!js.includes('outcomeConcerns'));
check('does not write recommendation responses',!js.includes('recommendationResponses'));
check('relationship starts lifestyle',rel.includes('CoverageFitAdvisoryLifestyleDiscovery?.start'));
check('property resume can start lifestyle',prop.includes('advisoryLifestyle?.start?.({ resume: true'));
check('assessment merges lifestyle discovery',engine.includes('advisoryLifestyle?.getDiscoveryProfile?.()'));
check('assessment resets lifestyle on retake',engine.includes('advisoryLifestyle?.reset?.()'));
check('continuity names lifestyle stage',cont.includes('advisoryLifestyle'));
check('resume copy names home-life context',cont.includes('Your home-life context is saved'));
check('signal engine recognizes 5_plus vocabulary',sig.includes("'5plus'"));

// Runtime contract and signal derivation
const contract=require('./assets/js/advisory-discovery-contract.js'); global.CoverageFitAdvisoryDiscoveryContract=contract;
const signalEngine=require('./assets/js/advisory-signal-engine.js');
const lifestyle=require('./assets/js/advisory-lifestyle-discovery.js');
check('runtime contract id stable',lifestyle.CONTRACT_ID==='coveragefit-lifestyle-dependency-discovery-v1');
const profile=contract.create({product:'home', householdContext:{source:'coveragefit_assessment',facts:[{value:'primary_residence',label:'Primary home',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'homeOwnership',label:'Primary home question'}]}]}, lifestyleDependencies:[{value:'5_plus',label:'5+ years / long term',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'stayIntent',label:'Stay intent question'}]}]});
const applied=signalEngine.apply(profile);
check('explicit home facts activate existing home commitment signal',applied.customerSignals.some(s=>s.key==='homeCommitment.high'&&s.status==='active'));
check('home commitment signal has evidence',applied.customerSignals.find(s=>s.key==='homeCommitment.high').evidenceRefs.length===2);
const uncertain=contract.create({product:'home', householdContext:{source:'coveragefit_assessment',facts:[{value:'unsure',label:'I’m not sure',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'homeOwnership',label:'Primary home question'}]}]}, lifestyleDependencies:[{value:'5_plus',label:'5+ years',source:'coveragefit_assessment',evidenceRefs:[{source:'coveragefit_assessment',key:'stayIntent',label:'Stay intent question'}]}]});
check('unknown ownership does not create active home commitment',!signalEngine.apply(uncertain).customerSignals.some(s=>s.key==='homeCommitment.high'&&s.status==='active'));

// protected scoring/recommendation files unchanged from source baseline (hashes supplied by test runtime)
const crypto=require('crypto'), hash=f=>crypto.createHash('sha256').update(read(f)).digest('hex');
const base='/mnt/data/cfadv16_base';
for(const f of ['assets/js/protection-score.js','assets/js/home-recommendation-rules.js','assets/js/recommendation-engine.js','assets/js/workspace-data.js']){
  if(fs.existsSync(path.join(root,f))&&fs.existsSync(path.join(base,f))) check(`protected file unchanged ${f}`,hash(f)===crypto.createHash('sha256').update(fs.readFileSync(path.join(base,f))).digest('hex'));
}
console.log(`CF-ADV-1.6 QA: ${checks}/${checks} passed`);
