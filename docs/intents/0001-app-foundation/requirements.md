# Requirements — 0001 App foundation

Derived from [intent.md](./intent.md). Each requirement has an ID that tests and PRs reference
(e.g. `test('FR-3 …')`, `Implements FR-3` in a PR description).

## Functional

| ID | Requirement | Acceptance criteria | Verified by |
|---|---|---|---|
| FR-1 | App is an installable PWA | Web manifest with name, icons (192, 512, maskable 512), `display: standalone`, `start_url`, `scope`, `orientation: portrait`; Apple touch icon + iOS meta tags; service worker registered in production builds | `e2e/pwa.spec.ts`, Lighthouse CI |
| FR-2 | App shell works offline after first load | Service worker precaches HTML/JS/CSS/icons; reload with network offline renders landing page | `e2e/pwa.spec.ts` |
| FR-3 | Landing page shows 4 buttons in a 2×2 grid | Exactly four `<a>`/buttons labelled "Action 1"–"Action 4"; two columns, two rows; grid fills the viewport below the header | `src/screens/Landing.test.tsx`, `e2e/landing.spec.ts` |
| FR-4 | Each button opens a stub screen | Tapping "Action N" navigates to `/action/N`, showing the title and a Back control that returns to landing; browser back works | `e2e/landing.spec.ts` |
| FR-5 | Failure shell on render error | Any uncaught error thrown during render shows the failure shell (title, short message, Reload button); error is logged to IndexedDB `errors` store when possible | `src/components/ErrorBoundary.test.tsx`, `e2e/failure-shell.spec.ts` |
| FR-6 | Failure shell when IndexedDB is unavailable | If IndexedDB is missing, blocked or `open()` does not resolve within 4 s, the failure shell explains storage is unavailable | `src/db/db.test.ts`, `e2e/failure-shell.spec.ts` |
| FR-7 | Portrait only | In landscape (`orientation: landscape` media query) a full-screen "Please rotate your device" overlay covers the app; it disappears in portrait. On Android installed PWAs the manifest also locks orientation | `e2e/orientation.spec.ts` |
| FR-8 | Local data layer ready for features | Typed `idb` wrapper with versioned migrations; `kv` and `errors` stores; request persistent storage on first run | `src/db/db.test.ts` |
| FR-9 | Update flow | When a new service worker is waiting, the app shows a small "Update available — Reload" banner | manual (documented in design) |

## Non-functional

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | Browser support | iOS Safari 16.4+, Android Chrome 110+, Samsung Internet 20+ |
| NFR-2 | Bundle size | Initial JS ≤ 50 KB gzip (enforced by `scripts/check-size.mjs` in CI) |
| NFR-3 | Performance | Lighthouse mobile performance ≥ 90, accessibility ≥ 95 |
| NFR-4 | Touch targets | ≥ 44×44 CSS px; no 300 ms delay (`touch-action: manipulation`) |
| NFR-5 | Safe areas | Content respects `env(safe-area-inset-*)` with `viewport-fit=cover` |
| NFR-6 | No zoom-on-focus / overscroll bounce surprises | Inputs ≥ 16 px; `overscroll-behavior: none` on body |
| NFR-7 | Privacy | No third-party requests at runtime |
| NFR-8 | Quality gates | Lint, typecheck, unit, e2e, size, Lighthouse all green before merge to `main` |
