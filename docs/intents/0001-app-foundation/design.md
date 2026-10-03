# Design — 0001 App foundation

Implements [requirements.md](./requirements.md).

## Stack

| Concern | Choice | Why |
|---|---|---|
| UI | Preact 11 + TypeScript | 4 KB runtime, React-compatible API |
| Routing | `preact-iso` (`LocationProvider`, `Router`, `lazy`) | Official, tiny, code-splits routes |
| Build | Vite 8 + `@preact/preset-vite` | Fast dev server, ES modules |
| PWA | `vite-plugin-pwa` (Workbox `generateSW`, `registerType: 'prompt'`) | Manifest + precache + update prompt |
| Storage | `idb` 8 over IndexedDB | Promise API, typed schema, ~1 KB |
| Unit tests | Vitest + jsdom + Testing Library + `fake-indexeddb` | Fast feedback loop for Claude |
| E2E | Playwright: `iphone` (WebKit, iPhone 13) and `android` (Chromium, Pixel 7) projects | Real mobile viewports and engines |
| Lint/format | Biome | One fast tool |

See ADRs in [`docs/adr`](../../adr) for the reasoning behind the bigger choices.

## Module layout

```
src/
  main.tsx              boot: render <App>, register SW, global error hooks
  app.tsx               <ErrorBoundary> → <DbGate> → <LocationProvider> → <Router>
  routes.ts             single source of truth for paths (base-path aware)
  nav.ts                tracks in-app navigation so Back never leaves the app
  components/
    ErrorBoundary.tsx   catches render errors → <FailureShell>
    FailureShell.tsx    the "default failure shell" UI
    DbGate.tsx          opens IndexedDB before children render; failure → <FailureShell kind="storage">
    UpdateBanner.tsx    SW "update available" prompt (also registers the SW in production)
    BackLink.tsx        history.back() when in-app history exists, else route home
  screens/
    Landing.tsx         2×2 grid of four action tiles
    ActionStub.tsx      placeholder screen for /action/:id
    NotFound.tsx
  db/
    db.ts               openAppDb() with timeout, migrations, helpers
    schema.ts           DBSchema type + migration list
  styles/global.css     tokens, safe areas, grid, failure shell
index.html              critical inline CSS + markup for the portrait-only overlay (works without JS)
```

## Boot sequence

```
index.html (theme-color, apple meta, viewport-fit=cover)
  └─ main.tsx
       ├─ window 'error' / 'unhandledrejection' → logError()   (best effort)
       ├─ registerSW (prod only) → UpdateBanner on needRefresh
       └─ render(<App/>)
            └─ ErrorBoundary ── on error ──► FailureShell kind="crash"
                 └─ DbGate ── open fails/timeout ──► FailureShell kind="storage"
                      └─ LocationProvider → Router → Landing | ActionStub | NotFound
  .rotate-overlay (static markup in index.html, outside #app, shown by CSS in landscape)
```

## Failure shell

- `ErrorBoundary` is a class component using `componentDidCatch` (Preact also supports
  `getDerivedStateFromError`). It renders `<FailureShell kind="crash" />`.
- `FailureShell` has **no dependencies on the router, DB or context** so it can always render.
  It shows an icon, title, one-sentence message, and a **Reload** button (`location.reload()`).
  A collapsible "Details" shows the error message (useful when testing on devices).
- Errors are written to the `errors` store via `logError()`, which swallows its own failures.
- Test hook: visiting `?__crash=1` throws during render in non-production builds and in E2E
  (`import.meta.env.VITE_E2E`), so the shell can be verified on real devices.

## IndexedDB layer

- DB name `opusfactory`, version 1. Stores: `kv` (key → any), `errors` (autoIncrement, index `by-time`).
- Migrations are an ordered array; `upgrade(db, oldVersion)` runs every step `> oldVersion`.
  New features add a step and bump the version — never edit an old step.
- **Safari hardening**
  - `open()` is raced against a 4 s timeout (iOS has had bugs where the first `open` never settles).
  - `blocked` / `blocking` handlers close the connection so other tabs can upgrade.
  - `navigator.storage.persist()` is requested once; Safari evicts script-writable storage of
    non-installed sites after 7 days of no use, so we also nudge users to *Add to Home Screen* later.
  - Test hook: `?__nodb=1` simulates IndexedDB unavailable in non-production/E2E builds.

## Portrait-only strategy

| Platform | Mechanism |
|---|---|
| Android, installed | Manifest `"orientation": "portrait"` (honoured by Chrome/Samsung) |
| Android, browser tab | Best effort `screen.orientation.lock('portrait')` (only works fullscreen; errors ignored) |
| iOS (all), and fallback everywhere | No lock API on iOS. A CSS-only "rotate your device" overlay covers the app in landscape |

The overlay is pure CSS so it works before JS and inside the failure shell:

```css
@media (orientation: landscape) { .rotate-overlay { display: flex } #app { visibility: hidden } }
```

We scope it to touch devices with `(hover: none) and (pointer: coarse)` so desktop browsers
(used for development) are not blocked.

## Landing page

- CSS grid: `grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr)`,
  filling `100dvh` minus header and safe-area insets, `gap: 16px`.
- Tiles are `<a href>` (real links → work with preact-iso, middle-click, a11y), min 44 px,
  `:active` scale feedback, disabled under `prefers-reduced-motion`.
- Tile config lives in `src/screens/landing-tiles.ts` so later intents only edit data.

## Base path

`vite.config.ts` reads `BASE_PATH` (default `/`). GitHub Pages builds use `/<repo>/`.
`routes.ts` prefixes every path with `import.meta.env.BASE_URL`; manifest `scope`/`start_url`
follow the same base.

## Risks / open questions

- iOS standalone mode cannot be orientation-locked; the overlay is the only control.
- WebKit E2E on Linux CI is not identical to iOS Safari — keep a manual device check in the PR template.
