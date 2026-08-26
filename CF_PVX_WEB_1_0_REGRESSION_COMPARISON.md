# 408-CF-PVX-WEB-1.0 Regression Comparison

CoverageFit baseline v3.20.135: 238 discovered, 150 passing, 88 raw failures.  
CoverageFit v3.20.136: 239 discovered, 150 passing, 89 raw failures during the first run; the only added raw failure was the exact-version changelog check and was repaired. The new focused QA passes. Historical product and legacy exact-version sets are otherwise unchanged.

408FARMERS raw baseline: 162 test files, 22 passing, 140 failing in the repeatable normalized run. The raw failures include missing BeautifulSoup/Playwright/Chromium dependencies, obsolete exact-version assertions, stale visual-freeze artifacts, and absent old cross-repository fixtures. After Sprint 1.0: 163 discovered, 23 passing, 140 failing. The new QA passes; the prior UI 4.10 manifest-body freeze is classified as an intentionally superseded exact-artifact check. Protected Life, Local, Worker, direct-contact, and renter hashes are unchanged.

No new non-version product failure remains.

