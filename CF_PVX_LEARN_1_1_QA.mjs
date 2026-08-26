import assert from 'node:assert/strict';
import { buildInsightAttribution } from './server/pvx-insight-attribution-core.mjs';
const event=(journeyId,sequence,name,detail={})=>({recordType:'pvx_meaningful_signal_event',journeyId,sequence,name,detail});
const records=[
  event('j1',1,'hook_viewed',{cohort:'campaign'}),event('j1',2,'first_answered',{cohort:'campaign'}),event('j1',3,'discovery_answered',{cohort:'campaign',questionPosition:1}),event('j1',4,'snapshot_viewed',{cohort:'campaign'}),event('j1',5,'topic_responded',{cohort:'campaign',topicResponse:'relevant'}),event('j1',6,'snapshot_saved',{cohort:'campaign'}),event('j1',7,'deeper_path_selected',{cohort:'campaign',path:'home_profile'}),
  event('j2',1,'hook_viewed',{cohort:'sms'}),event('j2',2,'first_answered',{cohort:'sms'}),event('j2',3,'snapshot_viewed',{cohort:'sms'}),event('j2',4,'contact_requested',{cohort:'sms'}),
  event('j3',1,'report_returned',{cohort:'direct'}),event('j3',2,'life_event_updated',{cohort:'direct'})
];
const report=buildInsightAttribution(records);assert.equal(report.journeys,3);assert.equal(report.cohorts.campaign.journeys,1);assert.equal(report.cohorts.sms.journeys,1);assert.equal(report.cohorts.referral.journeys,0);assert.equal(report.conversions.find(item=>item.key==='snapshot_to_save').completed,1);assert.equal(report.conversions.find(item=>item.key==='snapshot_to_home_profile').completed,1);assert.equal(report.conversions.find(item=>item.key==='snapshot_to_contact').completed,1);assert.equal(report.conversions.find(item=>item.key==='report_return_to_update_or_contact').completed,1);assert.equal(report.targetsEstablished,false);assert.equal(report.semantics.engagementIsInsuranceNeedEvidence,false);assert.equal(report.topicResponseToAction.relevant.usedAsNeedEvidence,false);assert.doesNotMatch(JSON.stringify(report),/"journeyId"|"name"|"email"|"address"|"token"|"answers"|"exactCustomerWords"|"documentMetadata"|"internalNotes"/);
console.log('CF-PVX-LEARN-1.1 QA: PASS');
