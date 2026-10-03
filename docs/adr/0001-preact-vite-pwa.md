# ADR 0001 — Preact + Vite + vite-plugin-pwa

- **Status:** Accepted · 2026-10-02 · Intent 0001

## Context
We need a small, fast, installable mobile web app that runs on iOS Safari and Android browsers,
with no backend, that many parallel Claude sessions can extend safely.

## Decision
Preact 11 with TypeScript, built by Vite 8 with `@preact/preset-vite`. PWA features via
`vite-plugin-pwa` using Workbox `generateSW` and `registerType: 'prompt'`. Routing with `preact-iso`.

## Consequences
- + ~10 KB baseline JS; React ecosystem mostly usable via `preact/compat` if ever needed.
- + Generated service worker; we do not hand-maintain caching code.
- − `generateSW` limits custom SW logic; switch to `injectManifest` if we need push or background sync.
- − `registerType: 'prompt'` requires us to show an update banner (FR-9).

## Alternatives considered
React (3× runtime size), SvelteKit (different mental model for future contributors), hand-written SW (error-prone).
