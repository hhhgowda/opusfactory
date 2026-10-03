import type { Section } from './types';

/** FR-13 — ವ್ಯಂಜನಗಳು grouped by ವರ್ಗ (owner decision 2). */
export const consonants: Section = {
  id: 'consonants',
  titleKn: 'ವ್ಯಂಜನಗಳು',
  titleEn: 'Consonants',
  kind: 'letter',
  groups: [
    {
      id: 'ka-varga',
      titleKn: 'ಕ-ವರ್ಗ',
      titleEn: 'Velar',
      columns: 5,
      items: [
        { id: 'ka', kn: 'ಕ', roman: 'ka' },
        { id: 'kha', kn: 'ಖ', roman: 'kha' },
        { id: 'ga', kn: 'ಗ', roman: 'ga' },
        { id: 'gha', kn: 'ಘ', roman: 'gha' },
        { id: 'nga', kn: 'ಙ', roman: 'ṅa' },
      ],
    },
    {
      id: 'ca-varga',
      titleKn: 'ಚ-ವರ್ಗ',
      titleEn: 'Palatal',
      columns: 5,
      items: [
        { id: 'ca', kn: 'ಚ', roman: 'ca' },
        { id: 'cha', kn: 'ಛ', roman: 'cha' },
        { id: 'ja', kn: 'ಜ', roman: 'ja' },
        { id: 'jha', kn: 'ಝ', roman: 'jha' },
        { id: 'nya', kn: 'ಞ', roman: 'ña' },
      ],
    },
    {
      id: 'tta-varga',
      titleKn: 'ಟ-ವರ್ಗ',
      titleEn: 'Retroflex',
      columns: 5,
      items: [
        { id: 'tta', kn: 'ಟ', roman: 'ṭa' },
        { id: 'ttha', kn: 'ಠ', roman: 'ṭha' },
        { id: 'dda', kn: 'ಡ', roman: 'ḍa' },
        { id: 'ddha', kn: 'ಢ', roman: 'ḍha' },
        { id: 'nna', kn: 'ಣ', roman: 'ṇa' },
      ],
    },
    {
      id: 'ta-varga',
      titleKn: 'ತ-ವರ್ಗ',
      titleEn: 'Dental',
      columns: 5,
      items: [
        { id: 'ta', kn: 'ತ', roman: 'ta' },
        { id: 'tha', kn: 'ಥ', roman: 'tha' },
        { id: 'da', kn: 'ದ', roman: 'da' },
        { id: 'dha', kn: 'ಧ', roman: 'dha' },
        { id: 'na', kn: 'ನ', roman: 'na' },
      ],
    },
    {
      id: 'pa-varga',
      titleKn: 'ಪ-ವರ್ಗ',
      titleEn: 'Labial',
      columns: 5,
      items: [
        { id: 'pa', kn: 'ಪ', roman: 'pa' },
        { id: 'pha', kn: 'ಫ', roman: 'pha' },
        { id: 'ba', kn: 'ಬ', roman: 'ba' },
        { id: 'bha', kn: 'ಭ', roman: 'bha' },
        { id: 'ma', kn: 'ಮ', roman: 'ma' },
      ],
    },
    {
      id: 'avargiya',
      titleKn: 'ಅವರ್ಗೀಯ',
      titleEn: 'Non-grouped',
      items: [
        { id: 'ya', kn: 'ಯ', roman: 'ya' },
        { id: 'ra', kn: 'ರ', roman: 'ra' },
        { id: 'la', kn: 'ಲ', roman: 'la' },
        { id: 'va', kn: 'ವ', roman: 'va' },
        { id: 'sha', kn: 'ಶ', roman: 'śa' },
        { id: 'ssa', kn: 'ಷ', roman: 'ṣa' },
        { id: 'sa', kn: 'ಸ', roman: 'sa' },
        { id: 'ha', kn: 'ಹ', roman: 'ha' },
        { id: 'lla', kn: 'ಳ', roman: 'ḷa' },
      ],
    },
  ],
};
