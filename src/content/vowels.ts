import type { Section } from './types';

/** FR-12 — ಸ್ವರಗಳು: 13 vowels + ಯೋಗವಾಹಗಳು ಅಂ ಅಃ (owner decision 3). */
export const vowels: Section = {
  id: 'vowels',
  titleKn: 'ಸ್ವರಗಳು',
  titleEn: 'Vowels',
  kind: 'letter',
  groups: [
    {
      id: 'all',
      items: [
        { id: 'a', kn: 'ಅ', roman: 'a' },
        { id: 'aa', kn: 'ಆ', roman: 'ā' },
        { id: 'i', kn: 'ಇ', roman: 'i' },
        { id: 'ii', kn: 'ಈ', roman: 'ī' },
        { id: 'u', kn: 'ಉ', roman: 'u' },
        { id: 'uu', kn: 'ಊ', roman: 'ū' },
        { id: 'ru', kn: 'ಋ', roman: 'ṛ' },
        { id: 'e', kn: 'ಎ', roman: 'e' },
        { id: 'ee', kn: 'ಏ', roman: 'ē' },
        { id: 'ai', kn: 'ಐ', roman: 'ai' },
        { id: 'o', kn: 'ಒ', roman: 'o' },
        { id: 'oo', kn: 'ಓ', roman: 'ō' },
        { id: 'au', kn: 'ಔ', roman: 'au' },
        { id: 'am', kn: 'ಅಂ', roman: 'aṃ' },
        { id: 'ah', kn: 'ಅಃ', roman: 'aḥ' },
      ],
    },
  ],
};
