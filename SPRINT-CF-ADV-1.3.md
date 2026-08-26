# CF-ADV-1.3 — Recommendation Anchor Contract

Status: Complete  
Release: CoverageFit 3.20.74

## Goal

Create the deterministic bridge from an already-eligible recommendation topic plus evidence-backed customer context to a personalized advisory rationale.

The sprint does **not** create coverage findings, rerank recommendations, change Protection Score, capture buy-in, or alter a producer decision.

## Delivered

- Added `assets/js/advisory-recommendation-anchor-contract.js`.
- Added deterministic `build`, `buildDetailed`, `apply`, ownership, normalization, and eligibility helpers.
- Anchors are created only from the recommendation topics explicitly supplied by the established recommendation path.
- Active, evidence-backed customer signals may personalize an anchor; candidate/conflicted signals do not.
- Missing or irrelevant evidence produces a generic anchor using the established recommendation explanation/question, with an empty `becauseYouToldUs` field rather than fabricated personalization.
- Added topic-specific personalization for Home commitment → rebuilding/long-term-home topics and vehicle dependency → replacement-transportation topics.
- Added explicit price/protection tradeoff framing for the three CF-ADV-1.2 tradeoff signals.
- Added separate customer-facing and producer-facing copy variants.
- Added additive metadata to the CF-ADV-1.1 anchor normalizer while preserving the original discovery contract identity.
- Integrated anchor persistence into the Home assessment after the existing priority rows are calculated. The existing Home recommendation engine and ranking remain unchanged.
- Added contract JSON, focused QA, release certification, regression report, and roadmap progression.

## Contract rule

`customer fact → derived signal → existing eligible recommendation → recommendation anchor`

The arrow never runs backward. A signal cannot manufacture a recommendation topic.

## Personalization rule

Personalized `becauseYouToldUs` copy requires an active signal with evidence references. If that condition is not satisfied, CoverageFit returns a generic non-personalized anchor.

## Copy rule

Customer copy stays neutral and explanatory. Producer copy can use the natural `Because you told me…` bridge and a bounded buy-in question, but must not imply consent, binding authority, or fear-default persuasion.

## Protected boundaries

CF-ADV-1.3 does not change:

- Protection Score calculation or methodology
- assessment evidence quality
- established recommendation generation
- established recommendation ranking
- existing Home recommendation rules
- legacy Workspace data adapter
- customer recommendation responses
- producer recommendation decisions
- binding or policy authorization

## Next sprint

`CF-ADV-1.4 — “Why Are We Here?” Opening`
