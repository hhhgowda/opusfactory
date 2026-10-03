## Intent

Implements `docs/intents/NNNN-slug/` — requirements: FR-…, NFR-…

## What changed

-

## Requirement checklist

| ID | Implemented | Test |
|---|---|---|
| FR- | | |

## Verification

- [ ] `npm run verify` green locally
- [ ] E2E green (`npm run test:e2e`)
- [ ] `design.md` updated if implementation diverged; ADR added for irreversible decisions
- [ ] **Real-device check (human):** iPhone Safari + home-screen app, Android Chrome — portrait, rotate, offline reload
- [ ] Screenshots attached for UI changes

## Risk

- [ ] Touches IndexedDB schema (append-only migration + upgrade test)
- [ ] Touches service worker / manifest / `vite.config.ts`
- [ ] Touches CI, hooks, or Claude settings
