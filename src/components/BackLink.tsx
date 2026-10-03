import { useLocation } from 'preact-iso';
import { hasInAppHistory } from '../nav';
import { paths } from '../routes';

/** Back control: uses history when we navigated in-app, otherwise goes home (e.g. deep link / cold start). */
export function BackLink() {
  const { route } = useLocation();
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    if (hasInAppHistory()) history.back();
    else route(paths.home());
  };
  return (
    <a href={paths.home()} class="back-link" onClick={onClick}>
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
