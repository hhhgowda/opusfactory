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
          <a key={tile.id} class="tile" href={paths.section(tile.id)} data-testid={`tile-${tile.id}`}>
            <span class="tile-icon" lang="kn" aria-hidden="true">
              {tile.icon}
            </span>
            <span class="tile-label" lang="kn">
              {tile.labelKn}
            </span>
            <span class="tile-label-en">{tile.labelEn}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
