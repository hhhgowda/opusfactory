import { screen, within } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { routes } from '../routes';
import { renderAt } from '../test/route';
import { Section } from './Section';

describe('Section', () => {
  it('FR-11 shows the section title and one card per item in order', async () => {
    renderAt('/learn/vowels', routes.section, Section);
    expect(await screen.findByRole('heading', { level: 1, name: 'ಸ್ವರಗಳು' })).toHaveAttribute('lang', 'kn');
    expect(screen.getByText('Vowels')).toBeInTheDocument();
    const cards = within(screen.getByTestId('grid-all')).getAllByRole('link');
    expect(cards).toHaveLength(15);
    expect(cards[0]).toHaveAttribute('href', '/learn/vowels/a');
    expect(cards[14]).toHaveAttribute('href', '/learn/vowels/ah');
  });

  it('FR-11 Back falls back to the landing page on a cold start', async () => {
    renderAt('/learn/numbers', routes.section, Section);
    expect(await screen.findByRole('link', { name: 'Back' })).toHaveAttribute('href', '/');
  });

  it('FR-13 consonants render 5 varga rows of 5 and the avargiya group, with headings', async () => {
    renderAt('/learn/consonants', routes.section, Section);
    for (const title of ['ಕ-ವರ್ಗ', 'ಚ-ವರ್ಗ', 'ಟ-ವರ್ಗ', 'ತ-ವರ್ಗ', 'ಪ-ವರ್ಗ', 'ಅವರ್ಗೀಯ']) {
      expect(await screen.findByText(title)).toBeInTheDocument();
    }
    const ka = screen.getByTestId('grid-ka-varga');
    expect(ka.style.getPropertyValue('--cols')).toBe('5');
    expect(within(ka).getAllByRole('link')).toHaveLength(5);
    expect(within(screen.getByTestId('grid-avargiya')).getAllByRole('link')).toHaveLength(9);
  });

  it('FR-15 word cards show the Kannada word with the English meaning underneath', async () => {
    renderAt('/learn/words', routes.section, Section);
    const family = await screen.findByTestId('grid-family');
    const first = within(family).getAllByRole('link')[0];
    expect(first.querySelector('.card-kn')?.textContent).toBe('ಅಮ್ಮ');
    expect(first.querySelector('.card-en')?.textContent).toBe('mother');
    expect(family.style.getPropertyValue('--cols')).toBe('2');
  });

  it('NFR-10 cards have accessible names with romanization', async () => {
    renderAt('/learn/consonants', routes.section, Section);
    expect(await screen.findByRole('link', { name: 'ಕ, ka' })).toHaveAttribute(
      'href',
      '/learn/consonants/ka',
    );
    renderAt('/learn/words', routes.section, Section);
    expect(await screen.findByRole('link', { name: 'ಅಣ್ಣ, aṇṇa, elder brother' })).toBeInTheDocument();
  });

  it('FR-17 an unknown section shows Not found', async () => {
    renderAt('/learn/nope', routes.section, Section);
    expect(await screen.findByRole('heading', { name: 'Not found' })).toBeInTheDocument();
  });
});
