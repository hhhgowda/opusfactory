import { describe, expect, it } from 'vitest';
import { allItems, findItem, findSection, sectionIds, sections } from './index';

const kn = (s: keyof typeof sections) => allItems(sections[s]).map((i) => i.kn);

describe('content', () => {
  it('FR-12 vowels: 15 cards in traditional order, ಅಂ ಅಃ last', () => {
    expect(kn('vowels')).toEqual([
      'ಅ',
      'ಆ',
      'ಇ',
      'ಈ',
      'ಉ',
      'ಊ',
      'ಋ',
      'ಎ',
      'ಏ',
      'ಐ',
      'ಒ',
      'ಓ',
      'ಔ',
      'ಅಂ',
      'ಅಃ',
    ]);
  });

  it('FR-13 consonants: 5 vargas of 5 in order, then 9 avargiya', () => {
    const groups = sections.consonants.groups;
    expect(groups.map((g) => g.titleKn)).toEqual(['ಕ-ವರ್ಗ', 'ಚ-ವರ್ಗ', 'ಟ-ವರ್ಗ', 'ತ-ವರ್ಗ', 'ಪ-ವರ್ಗ', 'ಅವರ್ಗೀಯ']);
    expect(groups.slice(0, 5).map((g) => g.items.map((i) => i.kn).join(''))).toEqual([
      'ಕಖಗಘಙ',
      'ಚಛಜಝಞ',
      'ಟಠಡಢಣ',
      'ತಥದಧನ',
      'ಪಫಬಭಮ',
    ]);
    for (const g of groups.slice(0, 5)) expect(g.columns).toBe(5);
    expect(groups[5].items.map((i) => i.kn).join('')).toBe('ಯರಲವಶಷಸಹಳ');
    expect(kn('consonants')).toHaveLength(34);
  });

  it('FR-14 numbers: ೦–೧೦ with value, word and romanization', () => {
    const items = allItems(sections.numbers);
    expect(items.map((i) => i.kn)).toEqual(['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯', '೧೦']);
    expect(items.map((i) => i.value)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(items.map((i) => i.word)).toEqual([
      'ಸೊನ್ನೆ',
      'ಒಂದು',
      'ಎರಡು',
      'ಮೂರು',
      'ನಾಲ್ಕು',
      'ಐದು',
      'ಆರು',
      'ಏಳು',
      'ಎಂಟು',
      'ಒಂಬತ್ತು',
      'ಹತ್ತು',
    ]);
    for (const i of items) expect(i.roman).toMatch(/\S/);
  });

  it('FR-15 words: 40 words in 5 categories of 8, each with English', () => {
    const groups = sections.words.groups;
    expect(groups.map((g) => `${g.titleKn}/${g.titleEn}`)).toEqual([
      'ಕುಟುಂಬ/Family',
      'ಬಣ್ಣಗಳು/Colours',
      'ಪ್ರಾಣಿಗಳು/Animals',
      'ಆಹಾರ/Food',
      'ದೇಹ/Body',
    ]);
    for (const g of groups) expect(g.items).toHaveLength(8);
    for (const i of allItems(sections.words)) expect(i.en).toMatch(/^[a-z][a-z /]*$/);
    expect(findItem(sections.words, 'elder-brother')?.kn).toBe('ಅಣ್ಣ');
    expect(findItem(sections.words, 'rice')?.kn).toBe('ಅನ್ನ');
  });

  it('NFR-12 ids are unique, URL-safe and Kannada text uses only the Kannada block', () => {
    const kannadaOnly = /^[ಀ-೿‌‍]+$/u;
    for (const id of sectionIds) {
      const s = sections[id];
      const ids = allItems(s).map((i) => i.id);
      expect(new Set(ids).size, id).toBe(ids.length);
      for (const itemId of ids) expect(itemId).toMatch(/^[a-z0-9-]+$/);
      for (const i of allItems(s)) {
        expect(i.kn, `${id}/${i.id}`).toMatch(kannadaOnly);
        if (i.word) expect(i.word).toMatch(kannadaOnly);
      }
      expect(s.titleKn).toMatch(kannadaOnly);
    }
  });

  it('FR-17 lookups reject unknown sections and items', () => {
    expect(findSection('vowels')?.titleEn).toBe('Vowels');
    expect(findSection('nope')).toBeUndefined();
    expect(findSection('toString')).toBeUndefined();
    expect(findSection(undefined)).toBeUndefined();
    expect(findItem(sections.vowels, 'zz')).toBeUndefined();
  });
});
