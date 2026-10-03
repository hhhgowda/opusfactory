import type { Section } from './types';

/** FR-14 — ಸಂಖ್ಯೆಗಳು ೦–೧೦. `kn` is the Kannada digit, `word` the number word. */
export const numbers: Section = {
  id: 'numbers',
  titleKn: 'ಸಂಖ್ಯೆಗಳು',
  titleEn: 'Numbers',
  kind: 'letter',
  groups: [
    {
      id: 'all',
      items: [
        { id: '0', kn: '೦', word: 'ಸೊನ್ನೆ', roman: 'sonne', value: 0 },
        { id: '1', kn: '೧', word: 'ಒಂದು', roman: 'ondu', value: 1 },
        { id: '2', kn: '೨', word: 'ಎರಡು', roman: 'eraḍu', value: 2 },
        { id: '3', kn: '೩', word: 'ಮೂರು', roman: 'mūru', value: 3 },
        { id: '4', kn: '೪', word: 'ನಾಲ್ಕು', roman: 'nālku', value: 4 },
        { id: '5', kn: '೫', word: 'ಐದು', roman: 'aidu', value: 5 },
        { id: '6', kn: '೬', word: 'ಆರು', roman: 'āru', value: 6 },
        { id: '7', kn: '೭', word: 'ಏಳು', roman: 'ēḷu', value: 7 },
        { id: '8', kn: '೮', word: 'ಎಂಟು', roman: 'eṇṭu', value: 8 },
        { id: '9', kn: '೯', word: 'ಒಂಬತ್ತು', roman: 'ombattu', value: 9 },
        { id: '10', kn: '೧೦', word: 'ಹತ್ತು', roman: 'hattu', value: 10 },
      ],
    },
  ],
};
