# OpusFactory

Portrait-only Preact PWA with an IndexedDB data layer, for iPhone Safari and Android browsers.
Built and governed with the [AI-Native SDLC Playbook](https://academy.claude.com/courses/ai-native-sdlc-playbook) —
see [`docs/playbook.md`](docs/playbook.md) for how each stage maps to this repo.

## Quick start

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:5173 — also on your LAN IP for testing on a phone
```

Install on a phone: open the deployed URL (or LAN dev URL) → Safari **Share → Add to Home Screen**,
or Chrome **⋮ → Install app**. Service worker and offline mode are active in production builds only
(`npm run build && npm run preview`).

## What's here (intent 0001)

- Landing page: four tiles in a 2×2 grid → placeholder screens
- Failure shell: error boundary + storage-unavailable screen with Reload
- Portrait lock: manifest (Android) + CSS overlay (iOS and fallback)
- IndexedDB via `idb` with append-only migrations, 4 s open timeout, persistent-storage request
- PWA: manifest, icons, precached app shell, update-available banner

Try the failure shell in dev: `/?__crash=1` or `/?__nodb=1`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm test` | Unit tests (Vitest + fake-indexeddb) |
| `npm run test:e2e` | Playwright on Pixel 7 (Chromium) and iPhone 13 (WebKit) |
| `npm run verify` | Lint + typecheck + unit + build + bundle budget |
| `npm run build` / `preview` | Production build / serve it on :4173 |

## Working with Claude Code

Open the repo in Claude Code. It starts in **plan mode**, reads `CLAUDE.md`, and is governed by hooks in
`.claude/hooks/` (blocks risky commands, asks before touching schema/CI/ADRs, auto-formats, and won't
finish until lint/types/tests pass).

```
> Create intent 0002 for <feature>        # from docs/intents/TEMPLATE.md
> Run intent-to-spec on intent 0002       # requirements.md + design.md
> Ship intent 0002                        # plan → tests → build → review → PR
```

## Repo setup checklist (one-time, on GitHub)

1. Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets → Actions: add `ANTHROPIC_API_KEY` (for Claude PR review / `@claude`),
   or run `/install-github-app` in Claude Code.
3. Branch protection on `main`: require PRs, the **CI** checks, and **Code Owners** review.
4. Add reviewers to `.github/CODEOWNERS` as the team grows.
