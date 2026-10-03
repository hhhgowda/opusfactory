# Intent 0001 — App foundation

- **Status:** Accepted
- **Owner:** user7502@vsna.org
- **Date:** 2026-10-02
- **Playbook stage:** Plan

## What we want

A mobile-first Progressive Web App built with **Preact**, storing data locally in
**IndexedDB**, that we can grow feature-by-feature. This first intent delivers only
the foundation:

1. An installable PWA (home-screen icon, standalone display, works offline after first load).
2. A **failure shell**: when the app hits an unrecoverable error (render crash,
   IndexedDB unavailable), the user sees a calm, branded error screen with a
   "Reload" action — never a blank white page.
3. A **landing page** with **four buttons in a 2×2 grid**. Buttons are placeholders
   ("Action 1"–"Action 4") that navigate to stub screens with a back control.
4. **Portrait only.** In landscape the app is covered by a "rotate your device" prompt.

## Why

We want a solid, tested, governed base before adding product features, so that every
future feature starts as its own `intent.md` and flows through the same pipeline
(plan → design → build → test → deploy → maintain).

## Constraints

| Area | Constraint |
|---|---|
| Platforms | iOS/iPadOS Safari 16.4+ (browser and home-screen), Android Chrome 110+, Samsung Internet 20+ |
| Orientation | Portrait only. iOS ignores manifest `orientation` and has no `screen.orientation.lock`, so a CSS overlay is required |
| Storage | IndexedDB only (no backend). Must survive Safari quirks: slow/hanging first `open`, eviction of non-installed sites, private mode |
| Size | Initial JS ≤ 50 KB gzipped |
| Offline | App shell precached by a service worker |
| Accessibility | Buttons ≥ 44×44 pt touch targets, labelled, respects safe-area insets and reduced motion |
| Privacy | No analytics or network calls beyond loading the app itself |

## Out of scope

- Real functionality behind the four buttons.
- Sync, accounts, push notifications.
- Offline fallback page and no-JS shell (deferred; the failure shell is an in-app error boundary).

## Success looks like

- Lighthouse PWA installability checks pass; performance ≥ 90 on mobile.
- E2E tests pass on iPhone- and Pixel-sized viewports.
- Forcing a render error or blocking IndexedDB shows the failure shell.
- Rotating to landscape shows the rotate prompt; rotating back restores the UI.
