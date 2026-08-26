# CF-ADV-1.2 — Discovery Signal Engine

Status: COMPLETE  
Release: CoverageFit 3.20.73

## Goal

Turn explicit, traceable customer discovery facts into deterministic advisory interpretations without making coverage recommendations, changing Protection Score, or conflating a customer statement with a CoverageFit interpretation.

## Delivered

### Deterministic signal runtime

Added `assets/js/advisory-signal-engine.js` with four rule families defined by the authoritative CF-ADV roadmap:

- `onlyVehicle=yes + dailyUse=yes` → `vehicleDependency.high`
- `homeOwnership=primaryResidence + stayIntent=longTerm` → `homeCommitment.high`
- `currentCarrierTenure>=10 years + likesService=yes` → `incumbentRelationship.strong`
- explicit `primaryPriority` → `tradeoffPreference.balanced|price|protection`

The engine is rule-based and contains no LLM dependency.

### Direct fact / derived interpretation separation

The signal engine exposes `collectExplicitFacts()` separately from `derive()` / `deriveDetailed()`.

Direct customer facts remain in the raw `discoveryProfile` sections created in CF-ADV-1.1. `customerSignals` contains only derived interpretations. The engine never rewrites the raw fact because a signal was derived from it.

### Evidence-first behavior

Every active or candidate signal requires one or more real `evidenceRefs`. Records without evidence do not produce signals. Unrecognized values and incomplete rule inputs fail closed.

### Conflict handling

Recognized contradictory evidence does not silently pick a winner. The affected concept becomes a `candidate` signal with a `.needsConfirmation` key, 0.50 confidence, and the conflicting evidence retained for later targeted confirmation.

### Idempotent ownership

Engine-owned signals use the `cfadv12-` ID prefix. Re-running the engine replaces only its own prior outputs while preserving non-engine signals, raw discovery, recommendation anchors, and recommendation responses.

### Assessment integration

The Home assessment now loads the advisory signal engine after the CF-ADV-1.1 discovery contract and before `assessment-engine.js`. Newly built reports apply deterministic signals to the seeded `discoveryProfile` before persistence.

No new discovery UI is added in this sprint. Existing production traffic therefore gains no unsupported inference simply by deploying 1.2; richer signals become available as explicit discovery fields are introduced by later CF-ADV sprints.

### CF-ADV-1.1 normalization compatibility fix

`normalizeValueRecords()` now includes evidence identity in duplicate detection. This preserves semantically distinct same-value facts such as `onlyVehicle=yes` and `dailyUse=yes` when they carry different evidence keys.

The public CF-ADV-1.1 contract shape, version, build identifier, and guardrails remain unchanged.

## Protected boundaries

CF-ADV-1.2 does not:

- modify `assets/js/protection-score.js`
- modify `assets/js/recommendation-engine.js`
- alter evidence-quality calculations
- alter recommendation ranking
- generate `becauseYouToldUs` language
- populate recommendation anchors
- capture customer buy-in
- create a final coverage decision
- add a parallel customer/advisory store

## Definition of done

- Home discovery facts produce normalized signal fixtures.
- Every active signal is evidence-backed.
- Contradictory recognized evidence becomes `candidate` / needs-confirmation.
- Unsupported or untraceable inputs fail closed.
- Repeated application is idempotent for engine-owned signals.
- Recommendation and scoring boundaries remain unchanged.
- Focused QA passes.
- Aggregate regression is compared to the incoming 3.20.72 baseline.

## Next sprint boundary

`CF-ADV-1.3 — Recommendation Anchor Contract` may consume eligible evidence-backed `customerSignals` alongside independently valid recommendation topics to produce a traceable personalized rationale.

It must not treat a signal as a coverage recommendation, customer agreement, or binding authorization.
