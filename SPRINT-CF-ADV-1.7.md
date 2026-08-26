# CF-ADV-1.7 — Outcome Concern Discovery

Release: CoverageFit v3.20.78  
Program: CF-ADV-1 — Personalized Advisory Conversation

## Goal

Let Home customers state which practical outcomes matter most before CoverageFit presents scored findings or recommendations. The step creates evidence for later personalization without turning preferences into risk scoring.

## Customer flow

CF-ADV-1.7 follows Lifestyle & Dependency Discovery and precedes the scored Home review.

Prompt: **If something went wrong with your home, what would be hardest for your household? Choose up to two.**

Choices:
1. A major unexpected out-of-pocket expense
2. Having to live somewhere else temporarily
3. Rebuilding the home properly
4. Replacing belongings
5. A serious water loss
6. Liability affecting our finances
7. Keeping the premium as low as practical
8. I’m not sure yet
9. Prefer not to answer
10. Something else

The first selected concern remains first, preserving customer-stated priority order. `unsure` and `prefer_not_to_answer` are exclusive. `other` requires customer-authored wording.

## Data contract

Selections are persisted through the existing CF-ADV-1.1 contract as `discoveryProfile.outcomeConcerns`. Each record carries `coveragefit_assessment` source and an `outcomeConcerns` evidence reference. Customer-authored “Something else” text is also retained in `customerStatements`.

## Advisory boundary

CF-ADV-1.7 does not:
- alter Protection Score, question weights, or evidence-quality scoring;
- create or rerank recommendation topics;
- create a new customer signal merely because a concern was selected;
- convert a concern into recommendation acceptance;
- imply binding authorization or purchase intent;
- use catastrophe or lawsuit fear as the default framing.

The purpose is future explanation: an already-valid recommendation may later say why it fits using a concern the customer explicitly selected.

## Continuity

Updated flow:

**Property confirmation → Why Are We Here? → Current Relationship → Lifestyle & Dependency → Outcome Concerns → scored CoverageFit review**

Selections survive save/resume. Retake resets outcome concerns. Resume messaging identifies the unfinished outcome-priority step.

## Files

Runtime:
- `assets/js/advisory-outcome-discovery.js`

Presentation:
- `assets/css/advisory-outcome.css`
- `assessment/index.html`

Integration:
- `assets/js/advisory-opening.js`
- `assets/js/advisory-relationship-discovery.js`
- `assets/js/advisory-lifestyle-discovery.js`
- `assets/js/property-confirmation.js`
- `assets/js/assessment-engine.js`
- `assets/js/assessment-continuity.js`

Certification:
- `CF_ADV_1_7_OUTCOME_CONCERN_CONTRACT.json`
- `CF_ADV_1_7_QA.js`
- `CF_ADV_1_7_RELEASE_CERTIFICATION.md`
- `CF_ADV_1_7_REGRESSION_REPORT.md`

## Definition of done

CF-ADV-1.7 is complete when customers can state up to two ordered Home outcome concerns, those preferences are traceable and resumable, explicit unknown/privacy states are preserved, custom wording is required when applicable, and the sprint introduces no score/recommendation coupling or new aggregate regression failures.

Next: `CF-ADV-1.8 — Conversational Assessment Orchestration`.
