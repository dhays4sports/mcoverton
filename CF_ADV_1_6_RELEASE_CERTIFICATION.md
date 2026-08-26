# CF-ADV-1.6 Release Certification

Release: **CoverageFit v3.20.77**  
Sprint: **CF-ADV-1.6 — Lifestyle & Dependency Discovery**

## Certified outcome

CoverageFit now captures Home lifestyle/dependency context before the scored review using six practical, non-policy-jargon questions. The resulting facts are stored in the existing evidence-backed `discoveryProfile` and remain outside Protection Score.

## Certified behaviors

- Primary-home status is captured as direct evidence.
- Residence tenure is captured without converting time-in-home into a score.
- Stay horizon is captured, including explicit uncertainty and privacy states.
- Meaningful home improvements are captured as context only.
- Household reliance uses broad roles and explicitly avoids names, ages, medical details, and unnecessary private information.
- Temporary-displacement disruption is captured as practical dependency, not as catastrophe or fear framing.
- `Something else` household wording is bounded, evidence-backed, and retained as a customer statement.
- All six question groups survive local continuity/resume.
- Retake clears direct lifestyle answers.
- The assessment cannot appear underneath an active lifestyle step.
- The existing deterministic signal engine recognizes `5_plus` stay intent as long-term.
- `primary_residence + 5_plus` can activate the pre-existing `homeCommitment.high` signal.
- Explicit unknown ownership does not activate that signal.
- Lifestyle discovery does not write `outcomeConcerns`; that remains CF-ADV-1.7.
- Lifestyle discovery does not create recommendation topics or customer recommendation responses.

## Scoring and recommendation boundaries

Certified unchanged:

- Protection Score math
- scored-question weights
- answer impacts
- Home recommendation-generation rules
- recommendation engine
- recommendation ranking
- frozen legacy Workspace adapter

## QA

Focused CF-ADV-1.6 QA: **62/62 passing**.

Aggregate comparison:

- Incoming v3.20.76: **115/179 passing, 64 failing**
- v3.20.77: **116/180 passing, 64 failing**
- New failing suites: **0**
- Exact historical failure set preserved: **yes**

## Roadmap handoff

The authoritative `CF-ADV-ROADMAP.md` is retained at the deployable root and marks CF-ADV-1.6 complete.

Next sprint: **CF-ADV-1.7 — Outcome Concern Discovery**.

## Certification

**CF-ADV-1.6 is certified root-deployable on top of CoverageFit v3.20.76.**
