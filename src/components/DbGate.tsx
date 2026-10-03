import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { openAppDb, requestPersistence } from '../db/db';
import { FailureShell } from './FailureShell';

type Status = { state: 'opening' } | { state: 'ready' } | { state: 'failed'; error: unknown };

/** Opens IndexedDB before rendering the app; shows the storage failure shell on failure (FR-6). */
export function DbGate({ children }: { children: ComponentChildren }) {
  const [status, setStatus] = useState<Status>({ state: 'opening' });

  useEffect(() => {
    let cancelled = false;
    openAppDb()
      .then(() => {
        if (cancelled) return;
        setStatus({ state: 'ready' });
        void requestPersistence();
      })
      .catch((error: unknown) => {
        if (!cancelled) setStatus({ state: 'failed', error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status.state === 'failed') return <FailureShell kind="storage" error={status.error} />;
  if (status.state === 'opening')
    return <div class="splash" role="status" aria-busy="true" aria-label="Loading" />;
  return <>{children}</>;
}
