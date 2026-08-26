# CF-ADV-1.4 Release Certification

Release: **CoverageFit 3.20.75**  
Sprint: **CF-ADV-1.4 — “Why Are We Here?” Opening**  
Status: **CERTIFIED**

## Delivered

CF-ADV-1.4 adds the first customer-facing advisory discovery experience to CoverageFit without replacing the established assessment, score, recommendation, report, or Workspace contracts.

The Home flow now proceeds:

**Property confirmation → Why are we here? → What matters most? → substantive coverage review**

The advisory opening captures:

- `reasonForReview`
- `primaryPriority`
- evidence-backed customer wording for the review reason

into the existing CF-ADV-1.1 `discoveryProfile`.

## Zero-repeat certification

Trusted 408FARMERS `reviewContext` is displayed as a connected fact and is not re-asked by default. If only a bounded Home review goal exists, that goal can provide the connected reason. A recognized future priority field is handled the same way. Connected values remain visible and editable by the customer.

## Priority certification

The four explicit states are:

- `price`
- `balance`
- `protection`
- `unsure`

`unsure` is a complete, explicit customer state and intentionally does not create a CF-ADV-1.2 tradeoff preference signal.

`price`, `balance`, and `protection` may create the already-defined deterministic tradeoff signal. They do not create recommendation topics.

## Review-reason integration

The completed opening reason becomes the active Home review reason. It may affect the existing, previously certified review-reason context and priority-ordering annotations only. The existing Home contract explicitly states that this does not change question weights, answer impacts, category scores, or the Protection Score formula.

## Protected boundaries

Certified unchanged:

- Protection Score implementation
- Home recommendation rules
- recommendation engine
- legacy Workspace adapter
- assessment answer weights and impacts
- evidence-quality semantics
- recommendation eligibility/generation
- recommendation ranking
- customer decision/binding semantics

SHA-256 protected files:

- `protection-score.js`: `0cf3190a5bb99aceb0e527f91268247481fd14e67acd81fb35db3accd8a5f2a8`
- `recommendation-engine.js`: `0d5973be5455d416c8f2477ce08f327adff0fff91bdb987efe62c6e8e8e6fe18`
- `home-recommendation-rules.js`: `0c4fb83590a2d0f29803f593a6716ba961c49a651542b74d53e01b9e33df4629`
- `workspace-data.js`: `8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2`

## Continuity certification

The opening uses the existing assessment continuity draft and supports:

- incomplete opening resume
- completed opening resume directly into substantive review
- property-confirmed resume
- deliberate retake reset
- preservation of trusted inherited intake facts on retake

No second durable customer store was introduced.

## Accessibility/mobile certification

The opening uses native radio inputs, explicit labels, focus-visible card treatment, visible connected-context text, a polite live region, mobile single-column layout, and reduced-motion handling.

## QA

- CF-ADV-1.1: **PASS**
- CF-ADV-1.2: **PASS**
- CF-ADV-1.3: **PASS**
- CF-ADV-1.4 focused QA: **104/104 PASS**
- Aggregate regression: **114/178 passing, 64 historical failures**
- New failing tests: **0**

See `CF_ADV_1_4_REGRESSION_REPORT.md` for baseline comparison.

## Next sprint

**CF-ADV-1.5 — Current Relationship Discovery**
