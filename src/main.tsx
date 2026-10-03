import { render } from 'preact';
import { App } from './app';
import { logError } from './db/db';
import './styles/global.css';

// Errors outside the render tree (event handlers, async code) are logged; they don't replace the UI.
window.addEventListener('error', (e) => void logError('global', e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => void logError('global', e.reason));

// Best-effort orientation lock (Android fullscreen/installed only). iOS relies on the CSS overlay (ADR 0003).
try {
  const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
  orientation?.lock?.('portrait').catch(() => {});
} catch {
  /* not supported */
}

const root = document.getElementById('app');
if (root) render(<App />, root);
