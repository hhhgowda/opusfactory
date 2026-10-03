# Requirements — 0002 Kannada basics

Derived from [intent.md](./intent.md) (Accepted, with owner decisions 1–4). IDs continue the
project-wide sequence after intent 0001 (FR-1…FR-9, NFR-1…NFR-8). NFR-1…NFR-8 still apply and
are not repeated.

**Supersedes:** FR-3's "Action 1"–"Action 4" labels (the 2×2 layout part of FR-3 stays) and FR-4
(stub screens) from intent 0001. Their rows in `0001-app-foundation/requirements.md` are updated to
point here.

## Functional

| ID | Requirement | Acceptance criteria | Verified by |
|---|---|---|---|
| FR-10 | Landing tiles name the four sections | Tiles in order: ಸ್ವರಗಳು / Vowels, ವ್ಯಂಜನಗಳು / Consonants, ಸಂಖ್ಯೆಗಳು / Numbers, ಪದಗಳು / Words. Kannada label on line 1 (`lang="kn"`), English on line 2. Each tile links to `/learn/<section>` (base-path aware). The 2×2 layout and ≥ 44 px targets from FR-3 still hold | `src/screens/Landing.test.tsx`, `e2e/landing.spec.ts` |
| FR-11 | Section screen shows a grid of cards | `/learn/<section>` shows a header (Back + Kannada title + English subtitle) and one card per item in content order, one card per grid cell. Back returns to the landing page; so does the OS/browser back gesture | `src/screens/Section.test.tsx`, `e2e/learn.spec.ts` |
| FR-12 | Vowels content | Exactly 15 cards in this order: ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ ಅಂ ಅಃ | `src/content/content.test.ts` |
| FR-13 | Consonants content, grouped by ವರ್ಗ | 34 cards in 6 labelled groups: ಕ-ವರ್ಗ, ಚ-ವರ್ಗ, ಟ-ವರ್ಗ, ತ-ವರ್ಗ, ಪ-ವರ್ಗ (5 each, in traditional order), then ಅವರ್ಗೀಯ (ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ). Each varga renders as one row of five | `src/content/content.test.ts`, `src/screens/Section.test.tsx` |
| FR-14 | Numbers content | 11 cards ೦ … ೧೦; each item carries its value (0–10), Kannada word (ಸೊನ್ನೆ … ಹತ್ತು) and romanization as in `content-draft.md` | `src/content/content.test.ts` |
| FR-15 | Words content | 40 words in 5 labelled categories (ಕುಟುಂಬ / Family, ಬಣ್ಣಗಳು / Colours, ಪ್ರಾಣಿಗಳು / Animals, ಆಹಾರ / Food, ದೇಹ / Body), 8 each, as in `content-draft.md`. Word cards show the Kannada word with the English meaning underneath in smaller text | `src/content/content.test.ts`, `src/screens/Section.test.tsx` |
| FR-16 | Detail screen | Tapping a card opens `/learn/<section>/<item>`. It shows the item as large as fits the portrait viewport, with a caption: romanization (all sections), plus English meaning (Words) or value (Numbers). Back returns to that section's grid. After a cold start or deep link to a detail URL, Back goes to the section grid, not the landing page | `src/screens/ItemDetail.test.tsx`, `e2e/learn.spec.ts` |
| FR-17 | Unknown section or item | An unknown `<section>` or `<item>` in the URL shows the existing NotFound screen, never a blank page or the crash shell. Old `/action/:id` URLs also land on NotFound | `src/screens/ItemDetail.test.tsx`, `src/screens/Section.test.tsx` |
| FR-18 | Works offline | After one online visit, every section grid and detail screen opens with the network offline (all lazy chunks are precached) | `e2e/pwa.spec.ts` |

## Non-functional

| ID | Requirement | Target / how checked |
|---|---|---|
| NFR-9 | Kannada rendering | System fonts only (no web-font download): `"Noto Sans Kannada", "Kannada Sangam MN", "Kannada MN", "Tunga", sans-serif`. No tofu (□) and no broken conjuncts (ಮ್ಮ, ಣ್ಣ, ಕ್ಕ, ಪ್ರಾ). Vowel signs above and below the base (e.g. ಋ, ಕೃ, ಔ) are not clipped in cards or on the detail screen. **Manual:** real iPhone (Safari + home screen) and real Android (Chrome) check per the PR template; e2e asserts glyph boxes are not clipped (`scrollHeight ≤ clientHeight`) |
| NFR-10 | Accessible names | Each card's accessible name is "<Kannada>, <romanization>" (plus ", <English>" for words), and the detail caption is real text, so screen readers without a Kannada voice still say something useful. Kannada text carries `lang="kn"`. Lighthouse accessibility stays ≥ 95 (NFR-3) |
| NFR-11 | Bundle budget | Content and section screens are lazy-loaded, not in the initial chunk. Initial JS stays ≤ 50 KB gzip (NFR-2) and grows by ≤ 2 KB from the 11.6 KB baseline |
| NFR-12 | Content integrity | Content is typed data (`src/content/*.ts`). Unit tests assert counts, order, unique URL-safe ids per section, and that every `kn` string contains only Kannada-block code points (U+0C80–U+0CFF) plus ZWJ/ZWNJ |
| NFR-13 | Layout | Section grids and the detail glyph fit portrait widths 320–430 CSS px without horizontal scrolling; cards stay ≥ 44 × 44 px (NFR-4); a consonant varga row of 5 fits at 320 px |

## Traceability notes

- `scripts/check-traceability.mjs` gains one rule: rows whose "Verified by" starts with
  `superseded` are skipped (used for FR-4).
- Mapping from the intent's "Success looks like": landing tiles → FR-10; full card sets → FR-12…FR-15;
  card → detail → Back → FR-11, FR-16; offline → FR-18; Kannada rendering → NFR-9; budget and
  Lighthouse → NFR-11, NFR-3.
