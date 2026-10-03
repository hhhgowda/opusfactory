# Metrics — closing the loop

Playbook stage 6 (Maintain). Metrics exist to generate the **next intent**, not to decorate a dashboard.

## What we measure

| Metric | Source | Target | Breach → |
|---|---|---|---|
| Initial JS (gzip) | `scripts/check-size.mjs` (CI, blocking) | ≤ 50 KB | CI fails → `breach-to-intent` issue on main |
| Lighthouse performance / a11y (mobile) | `lighthouserc.json` (CI, blocking) | ≥ 0.90 / ≥ 0.95 | same |
| E2E pass rate per engine | CI `e2e` matrix | 100%, flaky tests fixed within a week | intent: stabilise test |
| Requirement traceability | `scripts/check-traceability.mjs` | every automated FR has a named test | CI fails |
| Median PR lead time | weekly `metrics.yml` | ≤ 24 h | intent: process improvement |
| Main pipeline success rate | weekly `metrics.yml` | ≥ 90% | intent: fix root cause |
| Open policy breaches | issues labelled `policy-breach` | 0 | triage weekly |
| On-device errors | IndexedDB `errors` store (`recentErrors()`), last 50 | trend → 0 | intent: fix top error |

## Loop

```
metrics.yml (weekly) ─► issue "Metrics report" ─► any ⚠️ row
        ▲                                           │
        │                                           ▼
   deploy.yml ◄── PR ◄── ship-intent ◄── intent-to-spec ◄── docs/intents/NNNN/intent.md
```

## Not yet measured (future intents)

- Real-user Web Vitals and crash rates (needs a privacy-reviewed collection endpoint — NFR-7 currently forbids it).
- An in-app diagnostics screen that shows `recentErrors()` for on-device QA.
