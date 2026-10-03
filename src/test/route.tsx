import { render } from '@testing-library/preact';
import type { ComponentType } from 'preact';
import { LocationProvider, Route, Router } from 'preact-iso';

/** Render one routed screen at `url` (test helper). */
export function renderAt(url: string, path: string, component: ComponentType) {
  window.history.replaceState(null, '', url);
  return render(
    <LocationProvider>
      <Router>{[<Route key={path} path={path} component={component} />]}</Router>
    </LocationProvider>,
  );
}
