# CF-ADV-1.7 Release Certification

Release: CoverageFit v3.20.78  
Sprint: CF-ADV-1.7 — Outcome Concern Discovery

## Certification result

**PASS**

CF-ADV-1.7 adds ordered customer outcome preferences before the scored Home review while preserving the existing score, recommendation, evidence, and Workspace boundaries.

## Certified behavior

- Customer can select up to two Home outcome concerns.
- Selection order is preserved as stated preference priority.
- `unsure` and `prefer_not_to_answer` are explicit exclusive states.
- `other` requires customer-authored wording before completion.
- Selections persist as evidence-backed `discoveryProfile.outcomeConcerns` records.
- Custom wording is retained in `customerStatements`.
- Outcome concerns alone create no active customer signal.
- Outcome concerns create no recommendation topic or recommendation response.
- Save/resume and retake behavior includes the new outcome stage.
- The flow enters outcome discovery after Lifestyle & Dependency and before scored questions.

## Protected boundaries

Verified unchanged from the incoming v3.20.77 deployable:

- Protection Score implementation
- Home recommendation rules
- Recommendation engine
- Frozen legacy Workspace adapter

## QA

- CF-ADV-1.7 focused QA: **53/53 passing**
- Full regression: **117/181 passing, 64 failing**
- Incoming full regression: **116/180 passing, 64 failing**
- New failing suites: **0**
- Historical failing-suite set: **identical**

Forward-version allowlists in previously-green AW/RC-SMS and CF-ADV QA suites were extended to recognize v3.20.78; no runtime behavior in those systems was changed.

## Next sprint

`CF-ADV-1.8 — Conversational Assessment Orchestration`
