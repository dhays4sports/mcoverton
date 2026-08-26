# CF-ADV-1.5 Release Certification

Release: **CoverageFit 3.20.76**  
Sprint: **CF-ADV-1.5 — Current Relationship Discovery**  
Status: **CERTIFIED**

## Delivered

CF-ADV-1.5 adds incumbent-relationship discovery to the Home advisory flow without replacing the established assessment, score, recommendation, report, consultation, or Workspace contracts.

The Home flow now proceeds:

**Property confirmation → Why are we here? → Current relationship → substantive coverage review**

The relationship step captures:

- current carrier
- current-carrier tenure
- what the customer likes
- the one thing the customer would change
- what the customer definitely wants preserved

All output is stored inside the existing CF-ADV-1.1 `discoveryProfile.currentRelationship` boundary.

## “Don’t break what works” certification

The customer experience explicitly frames current-carrier strengths as useful advisory context.

CoverageFit does not treat:

- loyalty,
- a long relationship,
- satisfaction,
- good service,
- a valued agent relationship, or
- familiar policy/service features

as a defect or sales problem.

The stored fields make it possible for later Workspace/report sprints to distinguish:

- a price problem,
- a service problem,
- a coverage problem,
- a claims problem,
- general satisfaction, and
- relationship/service attributes that should be preserved.

## Zero-repeat certification

Trusted connected `currentCarrier` and recognized future `currentCarrierTenure` values are displayed as connected facts and are not re-asked by default.

Connected values:

- remain visible,
- retain `408farmers_handoff` source evidence,
- can be corrected by the customer.

Direct corrections become `coveragefit_assessment` evidence.

## Unknown/privacy certification

The relationship step preserves explicit:

- `unsure`
- `prefer_not_to_answer`
- `none` / `nothing`

states where applicable.

These are treated as customer answers, not blanks to be filled by inference.

Custom “Something else” selections require actual customer wording before completion and survive continuity state.

## Signal-engine certification

CF-ADV-1.5 does not generate advisory signals directly.

It supplies direct relationship facts to the existing CF-ADV-1.2 engine.

The already-defined `incumbentRelationship.strong` signal may activate only when:

1. qualifying tenure evidence is present, and
2. the customer explicitly identifies service as something they value.

Unknown or prefer-not-to-answer tenure does not activate the signal.

## Flow + continuity certification

The assessment sequence now supports:

- CF-ADV-1.4 completion handing off directly to CF-ADV-1.5,
- property-confirmed resume into an unfinished relationship step,
- relationship-state save/resume,
- retake reset of direct relationship answers,
- preservation of trusted inherited carrier/tenure on retake,
- report-time merge of relationship discovery before signal derivation and recommendation anchoring.

No second durable customer store was introduced.

## Report / Workspace transport

The existing saved report carries the normalized `discoveryProfile`.

Consultation records continue to preserve the full report.

The additive `CoverageFitAdvisoryWorkspaceData` adapter exposes the normalized current-relationship profile, including `wouldChange` and `mustKeep`, without modifying the frozen legacy Workspace adapter.

## Protected boundaries

Certified unchanged:

- Protection Score implementation
- Home recommendation rules
- recommendation engine
- legacy Workspace adapter
- scored-question weights
- scored-answer impacts
- evidence-quality semantics
- recommendation eligibility/generation
- recommendation ranking
- customer decision/binding semantics

SHA-256 protected files:

- `protection-score.js`: `0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8`
- `recommendation-engine.js`: `0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18`
- `home-recommendation-rules.js`: `0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629`
- `workspace-data.js`: `8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2`

## Accessibility/mobile certification

The relationship step uses:

- native radio and checkbox controls,
- explicit fieldsets and legends,
- visible focus treatment,
- 44px-or-larger compact controls,
- 48–50px text inputs,
- mobile single-column layouts,
- a polite live region,
- bounded text fields,
- reduced-motion handling.

This certification is source/automated QA based; it does not claim unperformed physical-device or assistive-technology testing.

## QA

- CF-ADV-1.1: **30/30 PASS**
- CF-ADV-1.2: **48/48 PASS**
- CF-ADV-1.3: **68/68 PASS**
- CF-ADV-1.4: **104/104 PASS**
- CF-ADV-1.5 focused QA: **131/131 PASS**
- Aggregate regression: **115/179 passing, 64 historical failures**
- Incoming baseline: **114/178 passing, 64 historical failures**
- New failing tests: **0**
- Historical failure set changed: **No**

See `CF_ADV_1_5_REGRESSION_REPORT.md` for exact baseline comparison.

## Next sprint

**CF-ADV-1.6 — Lifestyle & Dependency Discovery**
