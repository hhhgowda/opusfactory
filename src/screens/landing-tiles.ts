import type { SectionId } from '../content/types';

/**
 * Landing page tiles (FR-3 layout, FR-10 labels). Future intents change labels/targets here,
 * not in Landing.tsx. Keep exactly four entries while the layout is a 2×2 grid.
 */
export interface LandingTile {
  id: SectionId;
  /** Line 1, Kannada. */
  labelKn: string;
  /** Line 2, English. */
  labelEn: string;
  /** Kannada glyph used as the tile icon. */
  icon: string;
}

export const landingTiles: LandingTile[] = [
  { id: 'vowels', labelKn: 'ಸ್ವರಗಳು', labelEn: 'Vowels', icon: 'ಅ' },
  { id: 'consonants', labelKn: 'ವ್ಯಂಜನಗಳು', labelEn: 'Consonants', icon: 'ಕ' },
  { id: 'numbers', labelKn: 'ಸಂಖ್ಯೆಗಳು', labelEn: 'Numbers', icon: '೧' },
  { id: 'words', labelKn: 'ಪದಗಳು', labelEn: 'Words', icon: 'ಪದ' },
];
