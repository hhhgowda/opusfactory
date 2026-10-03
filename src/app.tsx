import { LocationProvider, lazy, Route, ErrorBoundary as RouteErrorBoundary, Router } from 'preact-iso';
import { DbGate } from './components/DbGate';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UpdateBanner } from './components/UpdateBanner';
import { trackRouteChange } from './nav';
import { routes } from './routes';
import { Landing } from './screens/Landing';
import { NotFound } from './screens/NotFound';

const Section = lazy(() => import('./screens/Section').then((m) => m.Section));
const ItemDetail = lazy(() => import('./screens/ItemDetail').then((m) => m.ItemDetail));

/** Dev/E2E hook: `?__crash=1` throws during render to exercise the failure shell (FR-5). */
function CrashProbe() {
  const enabled = !import.meta.env.PROD || import.meta.env.VITE_E2E;
  if (enabled && new URLSearchParams(location.search).has('__crash')) {
    throw new Error('Simulated crash (?__crash=1)');
  }
  return null;
}

export function App() {
  return (
    <ErrorBoundary>
      <CrashProbe />
      <DbGate>
        <LocationProvider>
          {/* preact-iso's boundary handles lazy-route suspension; real errors bubble up to ours. */}
          <RouteErrorBoundary>
            <Router onRouteChange={trackRouteChange}>
              <Route path={routes.home} component={Landing} />
              <Route path={routes.section} component={Section} />
              <Route path={routes.item} component={ItemDetail} />
              <Route default component={NotFound} />
            </Router>
          </RouteErrorBoundary>
        </LocationProvider>
      </DbGate>
      <UpdateBanner />
    </ErrorBoundary>
  );
}
