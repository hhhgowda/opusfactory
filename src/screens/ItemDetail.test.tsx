import { screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { routes } from '../routes';
import { renderAt } from '../test/route';
import { ItemDetail } from './ItemDetail';

describe('ItemDetail', () => {
  it('FR-16 shows a letter large with its romanization', async () => {
    renderAt('/learn/consonants/ka', routes.item, ItemDetail);
    const glyph = await screen.findByTestId('glyph');
    expect(glyph).toHaveTextContent('ಕ');
    expect(glyph).toHaveAttribute('lang', 'kn');
    expect(glyph).toHaveClass('glyph--letter');
    expect(screen.getByTestId('caption')).toHaveTextContent('ka');
  });

  it('FR-16 numbers show the digit with word, romanization and value', async () => {
    renderAt('/learn/numbers/9', routes.item, ItemDetail);
    expect(await screen.findByTestId('glyph')).toHaveTextContent('೯');
    expect(screen.getByTestId('caption')).toHaveTextContent('ಒಂಬತ್ತು · ombattu · 9');
  });

  it('FR-16 words show the word with romanization and English', async () => {
    renderAt('/learn/words/elder-brother', routes.item, ItemDetail);
    const glyph = await screen.findByTestId('glyph');
    expect(glyph).toHaveTextContent('ಅಣ್ಣ');
    expect(glyph).toHaveClass('glyph--word');
    expect(screen.getByTestId('caption')).toHaveTextContent('aṇṇa · elder brother');
  });

  it('FR-16 Back falls back to the section grid after a deep link', async () => {
    renderAt('/learn/vowels/au', routes.item, ItemDetail);
    expect(await screen.findByRole('link', { name: 'Back' })).toHaveAttribute('href', '/learn/vowels');
  });

  it('FR-17 an unknown item or section shows Not found', async () => {
    renderAt('/learn/vowels/zz', routes.item, ItemDetail);
    expect(await screen.findByRole('heading', { name: 'Not found' })).toBeInTheDocument();
    renderAt('/learn/nope/a', routes.item, ItemDetail);
    expect(await screen.findAllByRole('heading', { name: 'Not found' })).not.toHaveLength(0);
  });
});
