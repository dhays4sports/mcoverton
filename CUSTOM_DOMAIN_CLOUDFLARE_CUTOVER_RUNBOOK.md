# review.408farmers.com + Cloudflare Production Cutover Runbook

This is an operator runbook. The release program did not deploy or change DNS, Cloudflare, D1, R2, RingCentral, Formspree, notification or storage configuration.

## 1. Change approval and inputs

- Approve one coordinated maintenance window for the CoverageFit receiver first and 408FARMERS sender second.
- Use only the final v3.20.151 CoverageFit and final 408FARMERS packages from the Release 12 gate.
- Retain the four rollback packages listed in `FINAL_LEGACY_COMPATIBILITY_ROLLBACK_CERTIFICATION.md`.
- Record current Pages deployment IDs, custom-domain state, D1 migration version, R2 binding, environment variables and RingCentral webhook health before changing anything.

## 2. Stage CoverageFit v3.20.151

1. Deploy the CoverageFit ZIP root to a non-production Cloudflare Pages preview.
2. Bind preview D1 as `COVERAGEFIT_DB` and apply migrations `0001` through `0006` in order. Do not drop or rewrite existing tables.
3. Bind a private preview R2 bucket as `POLICY_FILES`.
4. Configure the existing required secrets from `wrangler.example.jsonc`; do not copy secret values into tickets or logs.
5. Keep notification sends disabled in preview or route them to an approved test destination.
6. Verify `/api/pvx/web-bootstrap`, `/api/pvx/web-journey`, `/api/pvx/checkpoint`, `/api/pvx/policy-upload`, `/api/pvx/producer-records`, `/sms/continue/` and the RingCentral status endpoint.

## 3. Attach the custom domain

1. In the approved CoverageFit Pages project, add `review.408farmers.com` as a custom domain.
2. Allow Cloudflare to create/validate the required DNS record and TLS certificate; do not hand-create a PII-bearing redirect.
3. Confirm HTTPS, HSTS policy compatibility and an active certificate before sender cutover.
4. Confirm `review.408farmers.com/api/pvx/web-bootstrap` accepts POST from `https://408farmers.com` and rejects an unapproved origin.
5. Confirm the response redirects only to `/pvx/web/` and sets the opaque HttpOnly/Secure/SameSite resume cookie.

## 4. Receiver smoke gate

- Use non-customer fixture data.
- Test direct CoverageFit entry and one 408FARMERS POST fixture for Home, Buyer, Home + Auto, professional, QR and referral.
- Verify the browser URL contains no name, phone, email, address or customer wording.
- Verify exact-stage resume, back navigation, Snapshot-before-contact, save/contact separation and both optional continuation paths.
- Verify policy upload reaches private R2 and is not publicly addressable.
- Verify Workspace access is authenticated and the unified record has stable ownership.
- Re-run STOP, manual Dylan reply/human takeover and existing SMS continuation before changing the 408FARMERS sender.

## 5. Deploy 408FARMERS

1. Deploy the final 408FARMERS ZIP root to preview and verify all static assets and routes.
2. Confirm the bootstrap meta action is exactly `https://review.408farmers.com/api/pvx/web-bootstrap` with no query or fragment.
3. Confirm Life, Local, merchant, renter, Call Dylan and Text Dylan paths are unchanged.
4. Promote the 408FARMERS deployment only after the receiver smoke gate passes.

## 6. Controlled production verification

- Run one non-customer acceptance journey from each high-intent route.
- Confirm no new traffic reaches `/assessment/`.
- Confirm campaign/referral metadata remains attribution and is not shown as a customer answer.
- Confirm one idempotent journey and one lead checkpoint across retries.
- Confirm no notification duplication or ownership reassignment.
- Monitor bootstrap rejection/error rate, D1/R2 errors, SMS webhook health, suppression checks, resume errors and producer-record access errors.

## 7. Rollback

1. If the CoverageFit receiver fails before sender promotion, restore the previous CoverageFit Pages deployment; do not promote 408FARMERS.
2. If failure occurs after sender promotion, restore the prior 408FARMERS Sprint 2.4 deployment first, then restore CoverageFit v3.20.150 if needed.
3. For a severe compatibility issue, restore both original baseline packages in the coordinated order: receiver first, sender second.
4. Do not reverse additive D1 migrations destructively. Preserve D1/R2 data and disable only the new route surface if required.
5. Do not modify RingCentral webhook/subscription configuration during web rollback unless an independently verified SMS incident requires its own approved procedure.
6. After rollback, verify direct contact, Life, Local, legacy reports, consultations, SMS STOP/human takeover and existing handoff links.

## 8. Closeout

- Record deployment IDs, time, operator, smoke results, error metrics and rollback readiness.
- Begin first-value and conversion measurement only after production traffic exists. Do not backfill or invent pilot metrics.
