import { BackLink } from '../components/BackLink';

export function NotFound() {
  return (
    <div class="screen">
      <header class="app-header">
        <BackLink />
        <h1>Not found</h1>
      </header>
      <section class="stub">
        <p>That page doesn’t exist.</p>
      </section>
    </div>
  );
}
