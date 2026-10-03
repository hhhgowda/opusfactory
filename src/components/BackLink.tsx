import { useLocation } from 'preact-iso';
import { hasInAppHistory } from '../nav';
import { paths } from '../routes';

/**
 * Back control: uses history when we navigated in-app, otherwise goes to `fallback`
 * (home by default) — e.g. after a deep link or cold start (FR-16).
 */
export function BackLink({ fallback = paths.home() }: { fallback?: string }) {
  const { route } = useLocation();
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    if (hasInAppHistory()) history.back();
    else route(fallback);
  };
  return (
    <a href={fallback} class="back-link" onClick={onClick}>
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span class="sr-only">Back</span>
    </a>
  );
}
