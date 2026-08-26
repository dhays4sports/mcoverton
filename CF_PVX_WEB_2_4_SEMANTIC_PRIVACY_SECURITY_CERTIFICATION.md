# Semantic, Privacy + Security Certification — PASS

| Boundary | Result |
| --- | --- |
| Campaign/page context vs customer answer | Kept separate; only explicit selection may seed discovery |
| Reported vs verified | Provenance retained; conflict asks once; unknown remains unknown |
| Topic vs recommendation | Discovery topics remain `worth_reviewing`; recommendations require later evidence |
| Topic response vs buy-in | Stored in separate record types |
| Save vs contact | Separate actions and consent states |
| SMS vs call/email | Independent permissions; global SMS suppression remains authoritative |
| Readiness vs eligibility | Quote readiness and professional context never determine eligibility or discounts |
| Discovery vs Protection Score | Discovery cannot create or change a score |
| Identity | Contact match alone cannot merge records; deterministic authorization required |
| Ownership | Producer ownership and human takeover cannot be silently reassigned |
| Resume | Opaque, expiring, HttpOnly/Secure/SameSite credential; no PII in URL |
| Upload | Token-bound, size/type limited, privately stored, producer reviewed |
| Producer access | Authenticated, private/no-store responses |
| Authorization to bind | Always separate and false until an authorized later action |

All paired focused, regression, protected-hash and extracted-package checks pass.
