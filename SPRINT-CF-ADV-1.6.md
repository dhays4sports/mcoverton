# CF-ADV-1.6 — Lifestyle & Dependency Discovery

Release: CoverageFit v3.20.77  
Program: CF-ADV-1 — Personalized Advisory Conversation

## Goal

Discover how the insured home actually supports the customer's day-to-day life before CoverageFit begins the scored policy review. The sprint captures practical context without policy jargon and without asking for unnecessary personal or sensitive household detail.

## Customer flow

CF-ADV-1.6 follows CF-ADV-1.5 and precedes the substantive Home assessment.

The customer is asked:

1. Is this the home you live in most of the time?
2. How long have you lived here?
3. How long do you expect to stay here?
4. Have you made meaningful improvements to the home?
5. Who relies on this home day-to-day?
6. If you had to live somewhere else temporarily, how disruptive would that be?

The household question uses broad roles only. CoverageFit explicitly says names, ages, and private details are not needed.

## Data contract

Direct evidence is stored in the existing CF-ADV-1.1 `discoveryProfile`:

- `householdContext.facts`
  - `homeOwnership`
  - `residenceTenure`
  - `householdReliance`
- `lifestyleDependencies`
  - `stayIntent`
  - `homeImprovements`
  - `displacementDisruption`
- `customerStatements`
  - only customer-authored "Something else" household context

Each value retains a question-level `evidenceRef` with source `coveragefit_assessment`.

## Signal compatibility

CF-ADV-1.2 remains the only interpretation boundary. This sprint does not manufacture signals itself.

The existing `homeCommitment.high` rule can now be satisfied naturally by explicit Home discovery when:

- `homeOwnership = primary_residence`, and
- `stayIntent = 5_plus`.

The signal engine was extended only to recognize the new deterministic `5_plus` vocabulary as long-term intent. No score, recommendation, or ranking rule changed.

## Privacy and persuasion boundary

CF-ADV-1.6 does not ask for:

- names of household members,
- ages,
- medical information,
- income or net worth,
- detailed family circumstances,
- catastrophic-loss imagination.

The temporary-displacement question measures practical dependency. The distinct "what would be hardest" preference exercise remains CF-ADV-1.7.

## Continuity

Updated flow:

**Property confirmation → CF-ADV-1.4 Why Are We Here? → CF-ADV-1.5 Current Relationship → CF-ADV-1.6 Lifestyle & Dependency → scored CoverageFit review**

All six responses survive local save/resume. Retake resets direct lifestyle answers. Resume messaging identifies an unfinished lifestyle step instead of claiming the customer is already on a scored question.

## Protected boundaries

CF-ADV-1.6 does not:

- change Protection Score math,
- change question weights or answer impacts,
- alter evidence-quality scoring,
- create a recommendation topic,
- change recommendation eligibility or ranking,
- treat household composition as risk scoring,
- infer concern or fear from household roles,
- capture customer recommendation buy-in,
- perform CF-ADV-1.7 outcome-concern discovery.

## Files

Runtime:
- `assets/js/advisory-lifestyle-discovery.js`
- `assets/js/advisory-signal-engine.js` (vocabulary compatibility only)

Presentation:
- `assets/css/advisory-lifestyle.css`
- `assessment/index.html`

Integration:
- `assets/js/advisory-opening.js`
- `assets/js/advisory-relationship-discovery.js`
- `assets/js/property-confirmation.js`
- `assets/js/assessment-engine.js`
- `assets/js/assessment-continuity.js`

Contracts and certification:
- `CF_ADV_1_6_LIFESTYLE_CONTRACT.json`
- `CF_ADV_1_6_QA.js`
- `CF_ADV_1_6_RELEASE_CERTIFICATION.md`
- `CF_ADV_1_6_REGRESSION_REPORT.md`

## Definition of done

CF-ADV-1.6 is complete when Home lifestyle/dependency facts are durably evidence-backed, preserve explicit unknown/privacy states, can activate the established long-term Home commitment signal when its actual rule is met, survive resume/retake, remain outside Protection Score and recommendation generation, and introduce no new aggregate regression failures relative to v3.20.76.

Next: `CF-ADV-1.7 — Outcome Concern Discovery`.
