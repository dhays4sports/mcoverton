# CF-ADV-1.5 — Current Relationship Discovery

Release: CoverageFit v3.20.76  
Program: CF-ADV-1 — Personalized Advisory Conversation

## Goal

Understand what the customer values about the incumbent insurance relationship, what creates switching resistance, what they would change, and what should not be lost if another option is considered.

This sprint deliberately treats loyalty, familiarity, good service, and a valued agent relationship as useful context—not defects to overcome.

## Customer flow

CF-ADV-1.5 follows the completed CF-ADV-1.4 opening and precedes the substantive scored Home review.

The customer is asked:

1. **Who are you insured with now?**
2. **How long have you been with your current company?**
3. **What have you liked about them?**
4. **If you could change one thing about your current insurance, what would it be?**
5. **What do you definitely want to keep?**

Carrier and tenure already supplied through trusted connected intake are carried forward visibly rather than re-asked. The customer can correct either connected value.

## Data contract

All output remains inside the existing `discoveryProfile.currentRelationship` object:

- `carrier`
- `tenure`
- `likes`
- `wouldChange`
- `mustKeep`
- `notes`

No parallel customer or advisory store is introduced.

Direct answers use source `coveragefit_assessment`. Trusted connected carrier/tenure values use `408farmers_handoff`. Every stored record retains an evidence reference to the question or connected source that produced it.

## Explicit unknown states

The following are first-class answers rather than missing data:

- `unsure`
- `prefer_not_to_answer`
- `none` / `nothing`, where that is the customer's explicit answer

CoverageFit does not turn any of these states into a positive or negative relationship inference.

## “Don’t break what works” semantics

`likes` records what the customer gives the incumbent credit for.

`wouldChange` records the primary thing the customer would improve.

`mustKeep` records attributes a replacement option should not make worse.

These fields are designed for future producer context such as:

- “They have been with the carrier 12 years and value responsive service.”
- “The problem is price, not service.”
- “Do not sacrifice the agent/service experience just to create a lower number.”

This sprint stores the evidence. It does not yet render the future Workspace advisory snapshot.

## Signal-engine compatibility

CF-ADV-1.2 already defines `incumbentRelationship.strong`.

CF-ADV-1.5 supplies the direct evidence that rule may use:

- `currentRelationship.tenure`
- an explicit `likes` record containing service

The signal remains generated only by the existing CF-ADV-1.2 deterministic engine. Relationship discovery itself never manufactures a signal.

## Flow integration

Updated assessment path:

**Property confirmation → CF-ADV-1.4 Why Are We Here? → CF-ADV-1.5 Current Relationship → substantive CoverageFit review**

Save/resume recognizes an unfinished relationship step, and retake clears direct relationship answers while preserving trusted inherited carrier/tenure values.

At report creation:

1. existing trusted context is seeded,
2. CF-ADV-1.4 opening discovery is merged,
3. CF-ADV-1.5 current-relationship discovery is merged,
4. CF-ADV-1.2 signals are derived,
5. CF-ADV-1.3 recommendation anchors are generated only for already-eligible recommendations.

## Protected boundaries

CF-ADV-1.5 does **not**:

- change Protection Score math,
- change scored-question weights,
- change answer impacts,
- change evidence quality,
- create coverage recommendations,
- create recommendation topics,
- change recommendation ranking,
- treat loyalty as a defect,
- infer dissatisfaction from tenure,
- infer satisfaction from carrier name,
- treat a relationship answer as consent or binding authorization.

## Files

Runtime:
- `assets/js/advisory-relationship-discovery.js`

Presentation:
- `assets/css/advisory-relationship.css`
- `assessment/index.html`

Integration:
- `assets/js/advisory-opening.js`
- `assets/js/property-confirmation.js`
- `assets/js/assessment-engine.js`
- `assets/js/assessment-continuity.js`

Contracts and certification:
- `CF_ADV_1_5_RELATIONSHIP_CONTRACT.json`
- `CF_ADV_1_5_QA.js`
- `CF_ADV_1_5_RELEASE_CERTIFICATION.md`
- `CF_ADV_1_5_REGRESSION_REPORT.md`

## Definition of done

CF-ADV-1.5 is complete when:

- carrier/tenure/likes/would-change/must-keep are durably stored in the existing discovery contract,
- unknown and prefer-not-to-answer states survive normalization,
- connected carrier/tenure facts are not re-asked by default,
- the customer can correct connected values,
- current-relationship evidence can activate the existing strong-incumbent signal when its rule is actually satisfied,
- price dissatisfaction can be distinguished from service/relationship dissatisfaction from stored evidence,
- report/consultation/Workspace data transport retains the relationship profile,
- Protection Score and recommendation-generation contracts remain unchanged,
- focused QA passes, and
- no new aggregate regression failures are introduced relative to v3.20.75.

Next: `CF-ADV-1.6 — Lifestyle & Dependency Discovery`.
