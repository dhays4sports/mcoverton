# CF-DISP Deployment + Cutover Runbook

## 1. Pre-deploy gate

1. Use Node/npm compatible with the existing CoverageFit deployment environment.
2. Install declared dependencies (`npm ci` when a lockfile/environment supports it, otherwise the approved dependency install procedure).
3. Confirm Wrangler `4.114.0` is available.
4. Run `node CF_DISP_FOCUSED_QA.mjs` — expected **27/27**.
5. Run `node qa/cf-disp/RUN_ALL_CF_DISP_SPRINT_QA.mjs` — expected **141/141 across 22 sprints**.
6. Run `node qa/cf-disp/CF_DISP_E2E_QA.mjs` — expected **30/30**.
7. Run `node RUN_REGRESSION_SUITE.js` and compare against the normalized 305/208/97 baseline. Expected integrated result: 306/209/97 and zero new unexplained failures.
8. Run `npm run cloudflare:functions:build` successfully in the dependency-backed environment.

## 2. Deploy candidate

Deploy the root of this archive using the same Cloudflare Pages/Functions procedure as the v3.20.200 baseline. Do not deploy a nested project folder.

## 3. Post-deploy smoke

Verify over HTTPS:

- `/`
- `/pvx/start/`
- `/nonrenewal/`
- `/nonrenewal/safeco/`
- `/agent/workspace/` through its normal protected access path
- relevant PVX checkpoint/event Functions

On both nonrenewal pages verify:

- six questions complete on mobile and desktop;
- timing value appears before contact fields;
- optional contact UI remains hidden until requested;
- Continue My Review carries displacement context into PVX;
- Safeco page shows non-affiliation and the dated factual distinction;
- no unexpected console/network errors;
- sitemap returns the new routes.

## 4. Google measurement activation

Only after the site is live and smoke-tested:

1. Create/confirm Google Ads conversion actions: Lead, Qualified Lead, Quote Started, Quote Delivered, Policy Bound.
2. Configure the current Google Ads Data Manager / enhanced-conversions-for-leads connection using the mapping in `campaigns/google-ads/GOOGLE_MEASUREMENT_IMPLEMENTATION.md`.
3. Confirm customer-data terms, consent configuration, destination/account IDs and schedule in the authenticated Google account.
4. Run a controlled test lead and confirm the source click identifier is retained and the downstream conversion row is accepted.
5. Keep raw intake-start/value-view events observational rather than primary bidding goals.

## 5. Search campaign cutover

Use `campaigns/google-ads/` as the launch kit. Start Search-only with exact/phrase matching. Keep competitor trademarks in keyword targeting only as permitted by current Google policy and preserve clear CoverageFit/agency identity on the landing page.

## 6. SEO cutover

Request normal crawl/indexing through the existing site process after deployment. Do not generate carrier × city pages. New content candidates remain `measure-before-authoring` until editorial/factual approval.

## 7. Rollback trigger

Rollback immediately for: consent regression, context leaking into scoring/readiness, PII in general analytics, broken checkpoint/resume, public identity confusion, new unexplained regression failures, or route/API failure. Follow `CF_DISP_ROLLBACK_RUNBOOK.md`.
