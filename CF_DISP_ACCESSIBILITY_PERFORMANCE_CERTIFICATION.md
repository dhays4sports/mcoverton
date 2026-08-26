# CF-DISP Accessibility + Performance Certification

**Status: PASS for source-level production-candidate requirements; live post-deploy browser smoke remains an operator gate.**

## Accessibility implementation

- Skip link is present on both public displacement routes.
- One primary H1 is present per route.
- Form controls use associated `<label>` containers.
- Dynamic status regions use `aria-live="polite"`.
- The option surface uses radiogroup/radio semantics with `aria-checked`.
- Keyboard-visible focus states are implemented.
- Primary controls meet or exceed 48px minimum height; mobile options are 56px.
- Mobile layout collapses to one column at 780px.
- Dedicated 360px-and-below rule protects narrow iPhone-class widths.
- `prefers-reduced-motion: reduce` disables transition/animation behavior.
- Input modes are appropriate for postal code and telephone entry.
- Back/edit behavior is implemented inside the six-question intake.

## Static document/link audit

Both public routes passed **46/46** local markup/resource/label checks: title, description, canonical, single H1, local asset existence, and input/select label association.

## Contrast spot-checks

Calculated WCAG contrast ratios for the core text/background pairs:

- primary ink `#173047` on background `#f6faf8`: **12.87:1**
- muted `#5e7280` on white: **5.01:1**
- accent `#0d6848` on white: **6.79:1**
- body copy `#405966` on background: **7.03:1**
- disclosure copy `#536a75` on `#eef3f1`: **5.08:1**

## Performance posture

- New pages use local CSS/JS only; no new third-party runtime library is required.
- Scripts are `defer` loaded.
- The experience is small, route-local and reuses existing CoverageFit APIs.
- No decorative image payload was added to the acquisition route.
- Existing asset cache headers remain intact.

## Build-environment limitation

`npm run cloudflare:functions:build` could not execute in this sandbox because the uploaded archive did not include installed dependencies and `wrangler` was unavailable. An attempted dependency install exceeded the sandbox command window. JavaScript syntax checks, focused QA, E2E QA and normalized regression all pass. The deployment runbook requires the Wrangler build and route smoke test in the normal dependency-backed deployment environment before traffic is switched.
