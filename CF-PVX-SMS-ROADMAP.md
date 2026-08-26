# CoverageFit SMS + Progressive Value Exchange Roadmap

Baseline: CoverageFit v3.20.129  
Release: 7  
Status: In progress

- [x] `CF-PVX-SMS-1.0` — SMS-to-PVX Handoff Mapping Contract
- [x] `CF-PVX-SMS-1.1` — Secure PVX Bootstrap Adapter
- [x] `CF-PVX-SMS-1.2` — Intent-Aware Zero-Repeat Entry
- [x] `CF-PVX-SMS-1.3` — Snapshot + Lead Checkpoint Convergence
- [x] `CF-PVX-SMS-1.4` — Producer Workspace + Operations Convergence
- [x] `CF-PVX-SMS-1.5` — Consent, Ownership + Regression Certification

## Protected boundary

RingCentral connection, webhook processing, deterministic SMS conversation routing, shared-number orchestration, outbound registry/gateway, global consent/suppression, producer takeover, retry handling, and existing operations behavior remain protected. Only the SMS-to-PVX handoff and required read-only/projection integrations may change without a separately documented compatibility reason.

## Final acceptance

An eligible Buyer, Home Review, or Home + Auto SMS customer follows the existing deterministic text intake, opens the existing opaque `/sms/continue/` link, confirms any customer-reported address once, resumes at the first unanswered PVX discovery question, receives the discovery-only Snapshot before a contact request, and remains linked to the same producer-owned SMS relationship. Other, human-requested, and ambiguous conversations remain producer-safe.
