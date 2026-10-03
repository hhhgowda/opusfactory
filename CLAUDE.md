# CLAUDE.md — OpusFactory

Preact + TypeScript PWA, IndexedDB storage, portrait-only, for iOS Safari and Android browsers.
Built with the AI-Native SDLC playbook: **intent → spec → plan → build → test → review → deploy → metrics**.

## Golden rules

1. **No code without an intent.** Every change traces to `docs/intents/NNNN-*/intent.md`.
   New work? Copy `docs/intents/TEMPLATE.md`, then run the `intent-to-spec` skill.
2. **Plan first.** Sessions start in plan mode (`.claude/settings.json`). Present a plan that names
   the requirement IDs (FR-x / NFR-x) it satisfies before editing.
3. **Tests are the feedback loop.** Write/adjust the test that proves the requirement, then the code.
   Name tests with the requirement ID: `it('FR-3 …')`.
4. **Run `npm run verify` before you say you're done.** The Stop hook enforces lint + typecheck + unit tests.
5. **Never edit an existing IndexedDB migration.** Append a new step in `src/db/schema.ts` (ADR 0002).
6. **The failure shell must stay dependency-free** (`src/components/FailureShell.tsx`: no router, DB, or context).
7. Record significant decisions as an ADR in `docs/adr/` (copy the format of 0001).

## Commands

| Task | Command |
|---|---|
| Dev server (LAN-accessible for phones) | `npm run dev` |
| Unit tests (fast loop) | `npm test` · watch: `npm run test:watch` |
| E2E (Chromium/Pixel locally) | `npm run test:e2e -- --project=android` |
| E2E (all, as CI) | `npm run test:e2e` (needs `npx playwright install webkit chromium`) |
| Lint / autofix | `npm run lint` · `npm run lint:fix` |
| Typecheck | `npm run typecheck` |
| Everything CI checks | `npm run verify` |
| Regenerate icons | `npm run icons` |

## Layout

```
docs/intents/NNNN-*/   intent.md → requirements.md → design.md  (one folder per feature)
docs/adr/              architecture decision records
docs/metrics.md        what we measure and how it feeds new intents
src/main.tsx           boot, global error logging, orientation lock attempt
src/app.tsx            ErrorBoundary → DbGate → LocationProvider → Router
src/routes.ts          ALL paths (base-path aware) — never hard-code "/..." in components
src/components/        FailureShell, ErrorBoundary, DbGate, UpdateBanner, BackLink
src/screens/           Landing (2×2 tiles from landing-tiles.ts), ActionStub, NotFound
src/db/                schema.ts (migrations), db.ts (open w/ timeout, kv, error log)
e2e/                   Playwright specs, projects: android (Pixel 7), iphone (iPhone 13/WebKit)
.claude/               settings (plan mode, hooks), skills, agents
```

## Conventions

- Preact, function components + hooks. Use `class`, not `className`. Import hooks from `preact/hooks`.
- Navigation uses real `<a href={paths.x()}>` links; preact-iso intercepts them.
- New screens: lazy-load via `lazy()` in `app.tsx` unless on the landing path (see `add-screen` skill).
- Styling: plain CSS in `src/styles/global.css` with tokens in `:root`. Touch targets ≥ 44 px.
  Respect `env(safe-area-inset-*)`. Use `100dvh` with a `100vh` fallback.
- Formatting: Biome (2 spaces, single quotes, 110 cols). Don't hand-format; the PostToolUse hook runs Biome.
- Storage: go through `src/db/db.ts`. Never use localStorage for app data.
- Test hooks `?__crash=1` and `?__nodb=1` exist only in dev and `VITE_E2E` builds.

## Mobile gotchas (read before touching layout, storage or PWA config)

- iOS ignores manifest `orientation` and has no `screen.orientation.lock` → CSS overlay in `index.html` (ADR 0003).
- iOS: first `indexedDB.open` may hang → 4 s timeout in `openAppDb`. Safari evicts storage of
  non-installed sites after 7 idle days → `navigator.storage.persist()`.
- iOS zooms inputs with font-size < 16 px. `overscroll-behavior: none` stops pull-to-refresh.
- Service worker updates use `registerType: 'prompt'` → `UpdateBanner`. Don't switch to autoUpdate
  without an ADR (it can reload mid-task and lose input).
- Playwright WebKit ≠ real iOS Safari. UI changes need a real-device check (PR template checkbox).

## Where to look next

- Current scope: `docs/intents/` (highest number = newest).
- Why things are the way they are: `docs/adr/`.
- Workflow skills: `.claude/skills/` · Specialist reviewers: `.claude/agents/`.
