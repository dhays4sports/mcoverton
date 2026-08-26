# CF-DISP-OUTREACH-1.1 Regression Comparison

## Prior CF-DISP-OUTREACH-1.0 baseline
- 307 total
- 210 passing
- 97 historical failures

## Automatic-discovery candidate
- 308 total
- 211 passing
- 97 historical failures

## Delta
- +1 automatic-discovery focused QA file
- +1 passing regression entry
- +0 new failures
- inherited 97-test failure set unchanged

## Focused QA
- `CF_DISP_OUTREACH_QA.mjs`: **10/10 passed**
- `CF_DISP_DISCOVERY_QA.mjs`: **8/8 passed**

## Change isolation
Existing CF-DISP customer acquisition, scoring, recommendation, readiness, report, secure-resume and SMS systems were not altered. Changes are isolated to the private outreach UI/API, outreach record metadata, automatic discovery core, Cloudflare scheduler companion, deployment configuration and documentation.
