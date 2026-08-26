# CF-ADV-1.1 — Advisory Discovery Data Contract

Status: Implemented

## Goal

Create the durable data boundary required for CoverageFit to evolve from a score-first assessment into a personalized advisory conversation system without changing existing Protection Score, evidence, recommendation, consultation, or zero-repeat semantics.

## Delivered

- Added `CoverageFitAdvisoryDiscoveryContract` as a versioned, browser/runtime-safe normalization module.
- Added the canonical `discoveryProfile` root contract with separate layers for raw customer discovery, future derived advisory signals/anchors, and future customer recommendation reactions.
- Added evidence/source references so later `Because you told me…` language can be traced to an actual captured customer fact.
- Added deterministic normalization, context seeding, merging, validation, and discovery-presence helpers.
- Seeded only existing trusted facts available today: review reason/context and current carrier when already present in the 408FARMERS/prefill/legacy context.
- Added `discoveryProfile` to saved assessment reports without changing score calculation.
- Exposed normalized `discoveryProfile` through the additive `CoverageFitAdvisoryWorkspaceData` adapter while leaving the frozen legacy Workspace adapter byte-for-byte unchanged; complete consultation records already clone the report and therefore retain the contract automatically.
- Added an explicit JSON release contract for future sprint/API work.
- Added the complete CF-ADV detailed roadmap as `CF-ADV-ROADMAP.md` so subsequent sprints have one in-repo source of truth.

## Explicitly not implemented yet

- New discovery questions or assessment UI.
- Customer signal derivation rules (CF-ADV-1.2).
- Personalized recommendation-anchor generation (CF-ADV-1.3).
- Recommendation buy-in UI/state capture (CF-ADV-1.13).
- Agent Workspace advisory UI or scripts (CF-ADV-1.14+).
- Any change to Protection Score methodology, evidence quality, existing recommendation rules, or ranking.

## Definition of Done

- A normalized `discoveryProfile` exists on newly built assessment reports.
- Existing review reason/current carrier can enter the profile without being re-asked.
- Empty future sections (`customerSignals`, `recommendationAnchors`, `recommendationResponses`) remain structurally valid and inert.
- Every future signal/anchor has a contract location for evidence references.
- Advisory Workspace snapshots preserve and expose the contract without changing the legacy Workspace data contract.
- Legacy reports without `discoveryProfile` remain readable and receive a safe empty normalized profile.
- The score engine has no dependency on the advisory contract.
- Focused CF-ADV-1.1 QA passes.

## Resumption boundary for CF-ADV-1.2

CF-ADV-1.2 may derive `customerSignals` from explicit discovery facts. It must not change the raw discovery facts, generate recommendation anchors, alter scoring, or infer unsupported customer preferences. Every derived signal must cite one or more `evidenceRefs` that resolve to actual source fields/statements.
