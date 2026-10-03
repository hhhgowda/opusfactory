import { paths } from '../routes';
import { landingTiles } from './landing-tiles';

export function Landing() {
  return (
    <div class="screen">
      <header class="app-header">
        <h1>OpusFactory</h1>
      </header>
      <nav class="tile-grid" aria-label="Main actions">
        {landingTiles.map((tile) => (
          <a key={tile.id} class="tile" href={paths.action(tile.id)} data-testid={`tile-${tile.id}`}>
            <span class="tile-icon" aria-hidden="true">
              {tile.icon}
            </span>
            <span class="tile-label">{tile.label}</span>
            {tile.hint && <span class="tile-hint">{tile.hint}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}
