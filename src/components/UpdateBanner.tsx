import { useEffect, useState } from 'preact/hooks';

type Updater = (reload?: boolean) => Promise<void>;

/** Shows "Update available" when a new service worker is waiting (FR-9). Production builds only. */
export function UpdateBanner() {
  const [update, setUpdate] = useState<Updater | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    let cancelled = false;
    import('virtual:pwa-register').then(({ registerSW }) => {
      const updateSW = registerSW({
        onNeedRefresh() {
          if (!cancelled) setUpdate(() => updateSW);
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!update) return null;
  return (
    <div class="update-banner" role="status">
      <span>Update available</span>
      <button type="button" onClick={() => void update(true)}>
        Reload
      </button>
    </div>
  );
}
