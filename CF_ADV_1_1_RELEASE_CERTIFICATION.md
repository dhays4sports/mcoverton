# CF-ADV-1.1 — Release Certification

Release: CoverageFit `3.20.72`

Build: `CF-ADV-1.1 — Advisory Discovery Data Contract`

Disposition: **Complete / root-deployable candidate**

## Implemented contract

- `assets/js/advisory-discovery-contract.js`
- `CF_ADV_1_1_CONTRACT.json`
- `assets/js/advisory-workspace-data.js`
- `discoveryProfile` included in newly built assessment reports
- Home and Business assessment-engine routes load the advisory contract before `assessment-engine.js`
- Agent Workspace loads the additive advisory adapter after the frozen legacy `workspace-data.js`
- Existing consultation records and server inbox persistence retain `discoveryProfile` because the complete report payload is preserved
- `CF-ADV-ROADMAP.md` contains the authoritative detailed roadmap and resumption rules for subsequent CF-ADV sprints

## Guardrails certified

- Discovery fields do not affect Protection Score.
- Discovery fields do not change evidence quality.
- CF-ADV-1.1 does not change existing recommendation generation or ranking.
- Producer recommendation, customer reaction, and final decision remain separate concepts.
- Recommendation reaction is not binding authorization.
- Personalized future claims require evidence references.
- Existing trusted handoff facts may be normalized without being re-asked.
- No new discovery questions, derived signal rules, recommendation anchors, or reaction UI were introduced early.

## Focused QA

`node CF_ADV_1_1_QA.js`

Result: **PASS** — 30 checks.

Coverage includes:

- runtime/JSON contract consistency
- complete field set
- inert future layers
- trusted review-reason/current-carrier seeding
- evidence references
- merge behavior
- unsupported-signal warning behavior
- future anchor evidence location
- score isolation
- assessment load order
- assessment report transport
- additive Workspace transport
- legacy report fallback
- legacy Workspace adapter byte compatibility
- consultation report retention
- complete roadmap presence

## Syntax checks

Passed:

- `node --check assets/js/advisory-discovery-contract.js`
- `node --check assets/js/advisory-workspace-data.js`
- `node --check assets/js/assessment-engine.js`
- `node --check CF_ADV_1_1_QA.js`

## Aggregate regression comparison

Incoming attached baseline (`3.20.71`):

- total: 174
- passing: 110
- failing: 64

CF-ADV-1.1 candidate (`3.20.72`):

- total: 175
- passing: 111
- failing: 64

Comparison:

- new failing tests: **0**
- baseline failures resolved by this sprint: **0**
- baseline failures retained unchanged: **64**
- new focused CF-ADV test: **1 passing suite**

The historical aggregate suite was not green in the supplied baseline. This release does not represent those 64 existing failures as newly introduced or resolved. Release-version compatibility assertions in currently forward-compatible QA files were extended through `3.20.72`; unrelated stale historical version-pinned failures remain unchanged.

## Legacy frozen boundary

`assets/js/workspace-data.js` remains byte-for-byte at SHA-256:

`8a11fd11fb3e027cfef746f4f9214b9d345c5db49862921dff27bbcfcc49eef2`

CF-ADV uses `CoverageFitAdvisoryWorkspaceData` as an additive wrapper so future advisory UI work can consume `discoveryProfile` without breaking the existing Workspace data contract.

## Next sprint

`CF-ADV-1.2 — Discovery Signal Engine`

It may populate `customerSignals` from explicit discovery facts using deterministic, evidence-backed rules. It must not alter raw customer discovery, generate recommendation anchors, or affect Protection Score.
