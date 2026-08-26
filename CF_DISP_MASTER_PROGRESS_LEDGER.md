# CF-DISP Master Progress Ledger

Program: Carrier Displacement Acquisition
Baseline: v3.20.200
Final overlay: CF-DISP-5.2

| # | Sprint | Release | Status | Purpose |
|---:|---|---|---|---|
| 1 | CF-DISP-0.1 — Baseline, Regression + Migration Boundary | 0 — Boundary | **COMPLETE** | Freezes the exact v3.20.200 source hash, historical regression state, protected surfaces, and additive migration boundary before product changes. |
| 2 | CF-DISP-0.2 — Displacement Facts, Identity + Claims Contract | 0 — Boundary | **COMPLETE** | Creates source-governed Safeco/Liberty factual claims, non-affiliation identity rules, and explicit forbidden claims. |
| 3 | CF-DISP-1.0 — Displacement Context Contract + Carrier Registry | 1 — Consumer | **COMPLETE** | Introduces one reusable displacement context and carrier registry without forking PVX or any scoring/recommendation engine. |
| 4 | CF-DISP-1.1 — Search Intent + Attribution Extension | 1 — Consumer | **COMPLETE** | Extends first-touch/session attribution to preserve current Google click identifiers and displacement campaign context while keeping PII out of analytics. |
| 5 | CF-DISP-1.2 — Carrier-Neutral Nonrenewal Experience | 1 — Consumer | **COMPLETE** | Adds the carrier-neutral, indexable, value-first nonrenewal entry route. |
| 6 | CF-DISP-1.3 — Safeco / Liberty High-Intent Experience | 1 — Consumer | **COMPLETE** | Adds the Safeco/Liberty high-intent resource with factual HO-6 context, clear operator identity, and non-affiliation disclosure. |
| 7 | CF-DISP-1.4 — Six-Question Displacement Intake | 1 — Consumer | **COMPLETE** | Implements the six-question mobile-first sequence for event, carrier, timing, property, ZIP, and customer-reported reason. |
| 8 | CF-DISP-1.5 — Immediate Displacement Snapshot + Zero-Repeat PVX Bridge | 1 — Consumer | **COMPLETE** | Produces timing value before contact, persists displacement state, pre-fills why-shopping context, and carries it through PVX/checkpoint/profile surfaces. |
| 9 | CF-DISP-2.0 — Urgency Classification + Routing Contract | 2 — Producer | **COMPLETE** | Adds operational-only immediate/active/planning/early/unclear urgency and uses it only as a same-state producer queue tiebreaker. |
| 10 | CF-DISP-2.1 — Value-First Contact Checkpoint + Consent | 2 — Producer | **COMPLETE** | Reuses the secure Snapshot checkpoint, keeps contact/channel consent independent, and places the optional contact request after value. |
| 11 | CF-DISP-2.2 — Producer Displacement Brief + Action Alert | 2 — Producer | **COMPLETE** | Carries carrier/deadline/reason/urgency into the existing producer record and brief without creating a producer eligibility decision. |
| 12 | CF-DISP-2.3 — Agent Workspace Integration | 2 — Producer | **COMPLETE** | Adds a concise displacement panel to the existing Workspace so producers do not reconstruct the story from disconnected records. |
| 13 | CF-DISP-2.4 — Urgency-Aware Follow-Up + Deeper Continuation | 2 — Producer | **COMPLETE** | Reuses the existing queue/continuation/checkpoint mechanisms and lets deadlines prioritize already-actionable records without bypassing consent. |
| 14 | CF-DISP-3.0 — Acquisition Event Taxonomy | 3 — Paid | **COMPLETE** | Extends the meaningful-signal event model from landing through bound/lost outcomes with enumerated, PII-free displacement details. |
| 15 | CF-DISP-3.1 — Google Ads Measurement + Enhanced Lead Conversion Bridge | 3 — Paid | **COMPLETE** | Creates a current Data Manager-shaped outcome adapter with separate match data and no general-analytics PII. |
| 16 | CF-DISP-3.2 — Google Search Campaign Launch Kit | 3 — Paid | **COMPLETE** | Produces two launch-ready Search campaign structures, query controls, ads, measurement mapping, operating rules, and trademark guardrails. |
| 17 | CF-DISP-4.0 — Definitive Safeco California Nonrenewal Guide | 4 — Organic | **COMPLETE** | Turns the Safeco route into an informative source-governed guide rather than a thin lead-capture page. |
| 18 | CF-DISP-4.1 — Nonrenewal Content Hub + Technical SEO | 4 — Organic | **COMPLETE** | Adds indexable routes, canonical/meta/OG signals, sitemap inclusion, internal linking, meaningful server-readable content, and no doorway-page expansion. |
| 19 | CF-DISP-4.2 — Search Query → Content Learning Loop | 4 — Organic | **COMPLETE** | Creates a privacy-safe candidate-topic registry driven by downstream quality while explicitly prohibiting automatic publication. |
| 20 | CF-DISP-5.0 — Multi-Carrier Displacement Framework | 5 — Platform/Certification | **COMPLETE** | Makes Safeco the first configuration in a reusable carrier framework and documents the factual/editorial gate for future carriers. |
| 21 | CF-DISP-5.1 — Accessibility, Performance, Privacy + Security Certification | 5 — Platform/Certification | **COMPLETE** | Certifies mobile-first source behavior, semantic controls, reduced motion, bounded/sanitized inputs, PII separation, and protected consent semantics. |
| 22 | CF-DISP-5.2 — Cross-System Regression + Production Candidate | 5 — Platform/Certification | **COMPLETE** | Runs focused/normalized regression, protected-hash comparison, final cross-system certification, packaging, cutover, and rollback evidence. |

Final normalized regression: **306 discovered / 209 passed / 97 historical failures / 0 new unexplained failures**.
CF-DISP behavioral QA: **27/27 passed**.
