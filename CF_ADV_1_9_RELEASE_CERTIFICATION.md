# CF-ADV-1.9 Release Certification

Release: CoverageFit v3.20.80  
Sprint: CF-ADV-1.9 — Progressive Discovery Branching  
Status: **CERTIFIED / ROOT DEPLOYABLE**

## Certified behavior

- Progressive advisory follow-ups are deterministic and evidence-driven.
- `currentRelationship.mustKeep` is suppressed by default and appears only for explicit 10+ year incumbent tenure plus explicit service value.
- `homeImprovements` is suppressed by default and appears only for explicit primary-residence plus 5+ year stay intent.
- Existing trusted review reason, carrier, and carrier-tenure zero-repeat behavior remains intact.
- Only one bounded branch follow-up is surfaced from each applicable discovery stage.
- Branch state is persisted inside the existing continuity draft.
- Legacy saved answers from pre-1.9 builds remain visible instead of being discarded.
- New branch answers are cleared if the customer later changes the triggering facts so stale evidence cannot survive an ineligible branch.
- Hidden branches create no customer signal, recommendation anchor, recommendation eligibility, score impact, or buy-in state.

## Protected boundaries

The following incoming runtime files are byte-identical:

- `assets/js/protection-score.js`
- `assets/js/home-recommendation-rules.js`
- `assets/js/recommendation-engine.js`
- `assets/js/workspace-data.js`

The validated Home scored question catalog, question weights, answer impacts, evidence semantics, Protection Score formula, recommendation ranking, and CF-ADV-1.2 signal rules remain unchanged.

## QA

- CF-ADV-1.9 focused suite: **60/60 passing**
- CF-ADV-1.8 focused suite: **87/87 passing**
- CF-ADV-1.7 focused suite: **53/53 passing**
- CF-ADV-1.6 focused suite: **58/58 passing**
- Aggregate incoming: **118/182 passing, 64 failing**
- Aggregate release: **119/183 passing, 64 failing**
- New failing suites: **0**
- Historical failure set: **identical**

## Next sprint

`CF-ADV-1.10 — Customer Language & Reaction Layer`
