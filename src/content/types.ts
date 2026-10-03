/** Content model for intent 0002 (design.md → Content model). Data only — no UI imports. */
export type SectionId = 'vowels' | 'consonants' | 'numbers' | 'words';

export interface Item {
  /** URL slug, unique within its section: /^[a-z0-9-]+$/ (NFR-12). */
  id: string;
  /** What the card and the detail screen show large: a letter, a digit or a word. */
  kn: string;
  /** ISO 15919 romanization. For numbers, of the number word. */
  roman: string;
  /** English meaning (words). */
  en?: string;
  /** Kannada number word (numbers), e.g. ಒಂದು. */
  word?: string;
  /** Numeric value (numbers). */
  value?: number;
}

export interface Group {
  id: string;
  titleKn?: string;
  titleEn?: string;
  /** Grid columns for this group; defaults to the section's default. */
  columns?: number;
  items: Item[];
}

export interface Section {
  id: SectionId;
  titleKn: string;
  titleEn: string;
  /** 'letter' → square cards + very large glyph; 'word' → wide cards with English line. */
  kind: 'letter' | 'word';
  groups: Group[];
}
