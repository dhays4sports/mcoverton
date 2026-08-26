# Accessibility, Privacy, Security + Performance Certification

Sprint: CF-PVX-INSIGHT-3.2  
Version: 3.20.174  
Status: Passed.

## Accessibility and performance

- Semantic headings, skip navigation, live regions, fieldsets, native details/summary disclosure and keyboard controls are present.
- Essential controls are at least 44 CSS pixels; form text is at least 16 CSS pixels; 320-pixel and 400% reflow remains single-column.
- Reduced-motion rules remove nonessential transitions; essential states never depend on animation.
- Snapshot essential CSS and interaction JavaScript remain a small, locally served payload with explicit image dimensions and no artificial analysis wait. Static budgets and structure pass. Real-user connection timing remains a pilot telemetry measure, not a fabricated lab result.

## Privacy and security

- Native web bootstrap is top-level POST, origin restricted and keeps PII out of URLs.
- Resume uses opaque HttpOnly, Secure, SameSite cookies; cross-device return is short-lived and single use.
- Snapshot, progress and document access validate opaque credentials, expiry and server-side records.
- Revoked/deleted progress access is denied. Revoked/deleted document libraries are denied. Expired documents may be listed as expired but cannot be read or removed.
- Policy upload is private, size bounded and limited to PDF, JPEG and PNG; object keys are not returned.
- Public analytics accepts bounded event fields only; PII, answers, exact words, documents, notes and credentials are structurally excluded.
- SMS, call and email permission remain separate; global STOP and provider suppression remain authoritative.
- Contact similarity never authorizes an identity merge. Producer notes and underwriting work remain outside customer projections.
- Safe invalid, expired, replayed, revoked and deleted states disclose no private record contents.

Protected hashes match the authorized post-Hook-1.3 baseline. The prior baseline and exact two copy-only SMS changes remain retained for audit.
