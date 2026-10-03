import { useRoute } from 'preact-iso';
import { BackLink } from '../components/BackLink';
import { landingTiles } from './landing-tiles';

/** Placeholder screen for /action/:id (FR-4). Replace per tile in future intents. */
export function ActionStub() {
  const { params } = useRoute();
  const tile = landingTiles.find((t) => t.id === params.id);
  const title = tile?.label ?? `Action ${params.id}`;

  return (
    <div class="screen">
      <header class="app-header">
        <BackLink />
        <h1>{title}</h1>
      </header>
      <section class="stub">
        <p>This screen is a placeholder. It will be built in a future intent.</p>
      </section>
    </div>
  );
}
