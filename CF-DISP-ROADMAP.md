# CF-DISP — Carrier Displacement Acquisition Program

**Status: COMPLETE — CF-DISP-5.2**

Baseline: CoverageFit v3.20.200 / CF-PVX-READY-3.3

## Sprint ledger

| # | Sprint | Title | Status |
|---:|---|---|---|
| 1 | CF-DISP-0.1 | Baseline, Regression + Migration Boundary | **COMPLETE** |
| 2 | CF-DISP-0.2 | Displacement Facts, Identity + Claims Contract | **COMPLETE** |
| 3 | CF-DISP-1.0 | Displacement Context Contract + Carrier Registry | **COMPLETE** |
| 4 | CF-DISP-1.1 | Search Intent + Attribution Extension | **COMPLETE** |
| 5 | CF-DISP-1.2 | Carrier-Neutral Nonrenewal Experience | **COMPLETE** |
| 6 | CF-DISP-1.3 | Safeco / Liberty High-Intent Experience | **COMPLETE** |
| 7 | CF-DISP-1.4 | Six-Question Displacement Intake | **COMPLETE** |
| 8 | CF-DISP-1.5 | Immediate Displacement Snapshot + Zero-Repeat PVX Bridge | **COMPLETE** |
| 9 | CF-DISP-2.0 | Urgency Classification + Routing Contract | **COMPLETE** |
| 10 | CF-DISP-2.1 | Value-First Contact Checkpoint + Consent | **COMPLETE** |
| 11 | CF-DISP-2.2 | Producer Displacement Brief + Action Alert | **COMPLETE** |
| 12 | CF-DISP-2.3 | Agent Workspace Integration | **COMPLETE** |
| 13 | CF-DISP-2.4 | Urgency-Aware Follow-Up + Deeper Continuation | **COMPLETE** |
| 14 | CF-DISP-3.0 | Acquisition Event Taxonomy | **COMPLETE** |
| 15 | CF-DISP-3.1 | Google Ads Measurement + Enhanced Lead Conversion Bridge | **COMPLETE** |
| 16 | CF-DISP-3.2 | Google Search Campaign Launch Kit | **COMPLETE** |
| 17 | CF-DISP-4.0 | Definitive Safeco California Nonrenewal Guide | **COMPLETE** |
| 18 | CF-DISP-4.1 | Nonrenewal Content Hub + Technical SEO | **COMPLETE** |
| 19 | CF-DISP-4.2 | Search Query → Content Learning Loop | **COMPLETE** |
| 20 | CF-DISP-5.0 | Multi-Carrier Displacement Framework | **COMPLETE** |
| 21 | CF-DISP-5.1 | Accessibility, Performance, Privacy + Security Certification | **COMPLETE** |
| 22 | CF-DISP-5.2 | Cross-System Regression + Production Candidate | **COMPLETE** |

## Governing architecture

Search / organic / referral / direct → `/nonrenewal/` or `/nonrenewal/safeco/` → six-question displacement intake → timing value → optional checkpoint → existing PVX → existing Home Profile / Policy Review → existing producer record / Workspace → downstream outcome measurement.

Safeco is the first activated carrier-specific configuration. The displacement engine is shared and configuration-driven.

## Program-level acceptance

- Value is rendered before contact information is requested.
- Operational urgency never becomes a Protection Score, underwriting, eligibility, pricing, bindability, or action-readiness input.
- Contact and channel permissions remain independent.
- First/session attribution captures current Google click identifiers without putting contact PII into general analytics.
- Carrier-specific facts are source governed and do not auto-publish.
- Final normalized regression introduces zero new unexplained failures.
- All 22 sprint evidence packs and focused QA results are retained in-tree.

---

## Post-5.2 additive extension — COMPLETE

### CF-DISP-OUTREACH-1.0 — Human-Assisted Displacement Outreach
**Status: COMPLETE**

Adds an internal, human-approved outreach queue for Reddit, Nextdoor, Facebook groups, HOA/property-manager/Realtor/mortgage relationships and the producer's existing network. Includes deterministic scoring/drafts, optional server-side AI redrafting, bulk relationship CSV import, source-attributed CoverageFit links, and manual response/follow-up status tracking. No automated posting or platform scraping is introduced.
