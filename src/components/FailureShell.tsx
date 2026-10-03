/**
 * The default failure shell (FR-5, FR-6).
 * Must stay dependency-free: no router, no DB, no context — it has to render when everything else is broken.
 */
export type FailureKind = 'crash' | 'storage';

const COPY: Record<FailureKind, { title: string; message: string }> = {
  crash: {
    title: 'Something went wrong',
    message: 'The app hit an unexpected problem. Reloading usually fixes it.',
  },
  storage: {
    title: 'Storage unavailable',
    message:
      'This app needs on-device storage. Turn off Private Browsing, free up space, or allow website data, then reload.',
  },
};

interface Props {
  kind?: FailureKind;
  error?: unknown;
  onReload?: () => void;
}

export function FailureShell({ kind = 'crash', error, onReload }: Props) {
  const { title, message } = COPY[kind];
  const detail = error instanceof Error ? error.message : error ? String(error) : null;
  const reload = onReload ?? (() => location.reload());

  return (
    <div class="failure-shell" role="alert" aria-labelledby="failure-title" data-kind={kind}>
      <svg
        viewBox="0 0 24 24"
        width="56"
        height="56"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v6" />
        <path d="M12 17h.01" />
      </svg>
      <h1 id="failure-title">{title}</h1>
      <p>{message}</p>
      <button type="button" class="btn-primary" onClick={reload}>
        Reload
      </button>
      {detail && (
        <details>
          <summary>Details</summary>
          <code>{detail}</code>
        </details>
      )}
    </div>
  );
}
