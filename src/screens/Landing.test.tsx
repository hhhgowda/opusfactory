import { render, screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { Landing } from './Landing';
import { landingTiles } from './landing-tiles';

describe('Landing', () => {
  it('FR-3 renders exactly four tiles', () => {
    render(<Landing />);
    const nav = screen.getByRole('navigation', { name: 'Main actions' });
    expect(within(nav).getAllByRole('link')).toHaveLength(4);
  });

  it('FR-10 tiles show Kannada on line 1 and English on line 2, in order', () => {
    render(<Landing />);
    const links = within(screen.getByRole('navigation', { name: 'Main actions' })).getAllByRole('link');
    expect(
      links.map((l) => [
        l.querySelector('.tile-label')?.textContent,
        l.querySelector('.tile-label-en')?.textContent,
      ]),
    ).toEqual([
      ['ಸ್ವರಗಳು', 'Vowels'],
      ['ವ್ಯಂಜನಗಳು', 'Consonants'],
      ['ಸಂಖ್ಯೆಗಳು', 'Numbers'],
      ['ಪದಗಳು', 'Words'],
    ]);
    for (const l of links) expect(l.querySelector('.tile-label')).toHaveAttribute('lang', 'kn');
  });

  it('FR-10 tiles link to /learn/<section>', () => {
    render(<Landing />);
    expect(screen.getByTestId('tile-vowels')).toHaveAttribute('href', '/learn/vowels');
    expect(screen.getByTestId('tile-words')).toHaveAttribute('href', '/learn/words');
  });

  it('FR-3 tile config keeps exactly four entries for the 2×2 grid', () => {
    expect(landingTiles).toHaveLength(4);
    expect(new Set(landingTiles.map((t) => t.id)).size).toBe(4);
  });
});
