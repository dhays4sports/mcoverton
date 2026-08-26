# CoverageFit Progressive Value Exchange UX System

Sprint foundation: `CF-PVX-UX-1.0`

## Product promise

The first customer journey earns additional information through visible value:

**Easy personal discovery → immediate CoverageFit Snapshot → lead checkpoint → optional Home Profile and/or Current Policy Review → additional report checkpoint → producer review → recommendation and buy-in.**

The experience is calmer and more personal than a marketplace. One clear decision appears at a time, the customer can say “Not sure,” and technical insurance or property questions never block the first personalized result.

## Migration boundary

- `/assessment/` remains the certified v3.20.83 rollback experience.
- `/pvx/?preview=1` hosts the parallel progressive-value experience while migration is feature flagged.
- `cf_pvx_consumer_experience` is disabled by default in CF-PVX-UX-1.0.
- The PVX shell owns presentation, navigation, local draft persistence, and event emission only.
- Existing advisory, score, recommendation, report, consultation, Workspace, attribution, SMS, and private-access engines remain authoritative.
- New product logic must call or adapt existing engines; it must not fork their methodology.

## Component contract

Every step uses the same shell: stage label, human progress, one question title, optional short explanation, one control group, Back when available, contextual help, boundary copy, and a polite live region.

Single-choice cards use native buttons with radio semantics, roving keyboard focus, and automatic advance. Multi-select cards use `aria-pressed` and retain an explicit Continue action. Confirmation cards show the fact and provenance before accepting it. Text inputs use native labels, autocomplete attributes, 16-pixel text, and concise validation. All actionable controls meet or exceed 44 pixels.

## Interaction standards

| Area | Standard |
| --- | --- |
| Primary decision | One per screen |
| Single choice | Tap and advance |
| Multi-select | Explicit Continue |
| Back | Never destroys later answers silently |
| Progress | Human stages plus concise step position |
| Unknown | Valid and unpenalized |
| Copy | Plain English within `COPY_LIMITS` |
| Motion | Brief and functional; removed under reduced-motion preference |
| Loading | Represents real work only; no fake analysis delay |
| Error | Recoverable, preserves state, explains next action |
| Resume | Exact step, automatic, seven-day local boundary before server continuation is introduced |
| Account | Not required |
| Contact | Never required before the first Snapshot |

## Copy limits

- Kicker: 42 characters
- Question title: 92 characters
- Description: 180 characters
- Choice label: 62 characters
- Choice detail: 110 characters
- Micro-feedback: 140 characters

## Accessibility contract

The question title is the accessible name for its control group. Native buttons and inputs are preferred. Progress uses `role=progressbar`; validation uses `role=alert`; transitions and resume confirmations use polite status announcements. Back, help, save, retry, and dialog controls are keyboard reachable. Focus returns to the main step after navigation. The layout supports 320-pixel width, short landscape, safe areas, 400-percent zoom, forced colors, and reduced motion.

## Persistence and privacy

CF-PVX-UX-1.0 stores the internal five-step preview locally for seven days and restores the exact step. Later secure-return sprints replace this boundary with server-issued opaque tokens. Event payloads carry stable identifiers and classifications only. They never carry free-text answers, addresses, policy details, documents, or contact information.

## Semantic guardrails

- `advisoryReviewTopic` is not `recommendation`.
- `topicResponse` is not `recommendationResponse`.
- Customer-reported is not verified.
- Quote readiness is not carrier eligibility.
- Recommendation buy-in is not authorization to bind.
- Report saving is not contact consent.
- Personal discovery never changes Protection Score.

These separations are product behavior, data-contract requirements, UI language rules, and certification assertions.

