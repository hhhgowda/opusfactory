---
name: add-screen
description: Add a new screen/route to the Preact app (or wire one of the four landing tiles to a real screen). Use when implementing any new page, view, or tile destination.
---

# Add a screen

1. **Route** — add the pattern to `routes` and a builder to `paths` in `src/routes.ts`.
   Never hard-code `/…` strings in components (base path differs on GitHub Pages).
2. **Component** — create `src/screens/<Name>.tsx`:
   ```tsx
   import { BackLink } from '../components/BackLink';
   export function Name() {
     return (
       <div class="screen">
         <header class="app-header"><BackLink /><h1>Title</h1></header>
         <section class="stub">…</section>
       </div>
     );
   }
   ```
   Use `class`, hooks from `preact/hooks`, `useRoute()` from `preact-iso` for params.
3. **Register** in `src/app.tsx` inside `<Router>`, lazy-loaded:
   `const Name = lazy(() => import('./screens/Name').then((m) => m.Name));`
   `<Route path={routes.name} component={Name} />` (before the `default` route).
4. **Landing tile?** Edit `src/screens/landing-tiles.ts` (label, hint, icon). If the tile should point somewhere
   other than `/action/:id`, add an optional `href` field to `LandingTile` and use it in `Landing.tsx`.
   Keep four tiles while the grid is 2×2 (a unit test enforces it).
5. **Data** — read/write through `src/db/db.ts`. New stores need the `idb-migration` skill.
6. **Mobile checklist** — touch targets ≥ 44 px, safe-area padding comes from `.screen`, inputs ≥ 16 px,
   works at 320 px wide, nothing breaks in the failure shell.
7. **Tests** — unit test in `src/screens/<Name>.test.tsx` (render + key interactions) and an e2e step in
   `e2e/` that navigates from landing. Name tests with requirement IDs.
8. Run `npm run verify` and `npm run test:e2e -- --project=android`.
