import { render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Landing } from './Landing';
import { landingTiles } from './landing-tiles';

describe('Landing', () => {
  it('FR-3 renders exactly four action tiles in order', () => {
    render(<Landing />);
    const nav = screen.getByRole('navigation', { name: 'Main actions' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(4);
    expect(links.map((l) => l.querySelector('.tile-label')?.textContent)).toEqual([
      'Action 1',
      'Action 2',
      'Action 3',
      'Action 4',
    ]);
  });

  it('FR-4 tiles link to /action/:id', () => {
    render(<Landing />);
    expect(screen.getByTestId('tile-3')).toHaveAttribute('href', '/action/3');
  });

  it('FR-3 tile config keeps exactly four entries for the 2×2 grid', () => {
    expect(landingTiles).toHaveLength(4);
    expect(new Set(landingTiles.map((t) => t.id)).size).toBe(4);
  });
});
