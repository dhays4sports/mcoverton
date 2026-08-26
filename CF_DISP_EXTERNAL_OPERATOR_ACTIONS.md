# CF-DISP Remaining External Operator Actions

The source package is complete. These actions require an authenticated deployment/advertising environment and were intentionally not fabricated from source code alone.

## Cloudflare

- Install the declared `wrangler@4.114.0` dependency in the normal build environment.
- Run `npm run cloudflare:functions:build`.
- Deploy the root candidate.
- Perform the HTTPS post-deploy smoke checks in `CF_DISP_DEPLOYMENT_CUTOVER_RUNBOOK.md`.

The sandbox build attempt returned `wrangler: not found`; a dependency install attempt exceeded the execution window. This is retained under `cf-disp/evidence/CLOUDFLARE_BUILD_*`.

## Google Ads / Data Manager

- Create or select the authenticated Google Ads account/campaigns.
- Create/confirm the five conversion actions.
- Accept/configure applicable customer-data terms and consent settings.
- Connect the Data Manager destination/source and resource IDs.
- Test a real click → lead → downstream outcome import.
- Activate spend only after landing-page/deployment smoke and conversion diagnostics pass.

## Search Console / indexing

- Deploy first, then use the site's normal Search Console process for crawl/index inspection if desired.
- Do not publish candidate SEO topics automatically; editorial/factual review remains required.

## Automatic displacement discovery

To activate CF-DISP-OUTREACH-1.1 automatic discovery after deploying the root Pages package:

- Create/obtain a Brave Search API subscription key.
- Add `BRAVE_SEARCH_API_KEY` to the CoverageFit Pages project for producer-triggered manual sweeps.
- Copy `wrangler.discovery.example.jsonc` to a private deployment config and insert the existing production D1 database ID.
- Add `BRAVE_SEARCH_API_KEY` as a secret to the companion discovery Worker.
- Deploy `workers/displacement-discovery-worker.mjs` using the supplied discovery Wrangler config.
- Confirm the three Cron Triggers and perform the runbook smoke test.

These authenticated external actions cannot be fabricated from the source package. Without them, the existing human-assisted queue remains usable, but scheduled public-web discovery will show as not configured.
