# Intent 0002 — Kannada basics: Vowels · Consonants · Numbers · Words

- **Status:** Accepted (2026-10-02)
- **Owner:** user7502@vsna.org
- **Date:** 2026-10-02
- **Source:** feature request (replaces the four placeholder tiles from intent 0001)
- **Playbook stage:** Plan

## What we want

Turn the app into a simple offline Kannada learning aid. The four landing tiles become:

| Tile | Line 1 (Kannada) | Line 2 (English) | Content |
|---|---|---|---|
| 1 | ಸ್ವರಗಳು | Vowels | 15 cards: ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ + ಅಂ ಅಃ |
| 2 | ವ್ಯಂಜನಗಳು | Consonants | 34 cards: ಕ … ಮ (25 grouped) + ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ |
| 3 | ಸಂಖ್ಯೆಗಳು | Numbers | 11 cards: ೦–೧೦ with the Kannada word (ಸೊನ್ನೆ … ಹತ್ತು) |
| 4 | ಪದಗಳು | Words | ~40 everyday words in 5 categories (draft in `content-draft.md`, owner reviews) |

Behaviour, the same for every section:

1. Tapping a tile opens a **grid of cards**, one per item (letter / number / word).
2. Tapping a card opens a **detail screen** showing that item as large as the screen allows,
   with a **Back** control that returns to the grid (and the browser/OS back gesture does the same).
3. Back from the grid returns to the landing page.

## Why

The foundation (intent 0001) has placeholder tiles. The owner wants a Kannada alphabet and vocabulary
reference that works on a phone, offline, with nothing to sign into.

## Constraints

| Area | Constraint |
|---|---|
| Platforms | Same as intent 0001 (NFR-1…NFR-8) |
| Content | Static, bundled with the app (no network, no IndexedDB writes needed). Content lives in typed data files so it can be corrected without touching components |
| Fonts | Use the system Kannada font (iOS: Kannada Sangam MN; Android: Noto Sans Kannada). No web-font download, so the size budget is untouched. Conjuncts (e.g. ಮ್ಮ, ಣ್ಣ) must render correctly — real-device check required |
| Size | Initial JS ≤ 50 KB gzip; section screens lazy-loaded |
| Layout | Portrait only (existing overlay). Cards ≥ 44 px touch targets; detail letter scales with viewport (`dvh`/`vw`) without clipping tall glyphs (ಋ, ಔ, conjuncts) |
| Accessibility | Each card and the detail screen have an accessible name with romanization + English (e.g. "ಕ, ka"), `lang="kn"` on Kannada text so screen readers pick the right voice where one exists |
| Privacy | No network calls, no analytics |

## Out of scope

- Audio / pronunciation playback (no TTS, no recordings) — candidate for a later intent.
- Quizzes, progress tracking, favourites, spaced repetition.
- ಗುಣಿತಾಕ್ಷರ (consonant + vowel-sign combinations) and ಒತ್ತಕ್ಷರ (conjunct) charts.
- Archaic letters ೠ ಱ ೞ; numbers above 10.
- Swipe between items on the detail screen (possible follow-up).

## Success looks like

- The landing grid shows the four tiles with Kannada on line 1 and English on line 2.
- Each section shows the full set of cards listed above, in traditional order.
- Tapping any card opens its detail screen; Back (button or OS gesture) returns to the same grid.
- Works offline after first load, on iPhone Safari and Android Chrome, in browser and installed mode.
- Kannada text renders without tofu (□) or broken conjuncts on a real iPhone and a real Android phone.
- Initial JS stays within budget and Lighthouse mobile thresholds still pass.

## Decisions (owner, 2026-10-02)

1. Detail screen shows the large item **plus a small caption**: romanization; Words also show the English meaning, Numbers the value.
2. Consonant grid is **grouped by ವರ್ಗ**: five rows of five, then the 9 ಅವರ್ಗೀಯ letters under their own heading.
3. Vowels include **ಅಂ ಅಃ as the last two cards** (15 total).
4. `content-draft.md` is **approved as drafted**; corrections later go to the data files only.

---
Specified in [requirements.md](./requirements.md) and [design.md](./design.md). Next: `ship-intent`.
