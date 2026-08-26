# CF-DISP-DISCOVERY-1.0 Regression Comparison

## Prior CF-DISP-OUTREACH-1.0 baseline
- 307 total
- 210 passing
- 97 historical failures

## Automatic discovery candidate
- 308 total
- 211 passing
- 97 historical failures

## Delta
- +1 discovery QA file
- +1 passing test
- +0 new failures
- +0 removed historical failures
- inherited 97-test failure set unchanged

## Focused suites
- `CF_DISP_DISCOVERY_QA.mjs`: 8/8 passed
- `CF_DISP_OUTREACH_QA.mjs`: 10/10 passed

## Protected architecture
The release does not modify Protection Score, recommendation engines, action-readiness core, report engines, secure resume, or SMS consent/outbound ownership. It extends only the isolated outreach namespace, private outreach UI/API surface, deployment configuration and automatic-discovery companion Worker.
