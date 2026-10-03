# Design — 0002 Kannada basics

Implements [requirements.md](./requirements.md). No new dependencies, no IndexedDB schema change,
no service-worker strategy change, so no new ADR is needed.

## Routes (`src/routes.ts`)

| Path | Screen | Notes |
|---|---|---|
| `${BASE}` | `Landing` | unchanged component, new tile data (FR-10) |
| `${BASE}learn/:section` | `Section` (lazy) | `section` ∈ `vowels \| consonants \| numbers \| words` (FR-11) |
| `${BASE}learn/:section/:item` | `ItemDetail` (lazy) | `item` = the item's `id` (FR-16) |
| `${BASE}action/:id` | removed | falls through to `NotFound` (FR-17) |

```ts
export const routes = { home: BASE, section: `${BASE}learn/:section`, item: `${BASE}learn/:section/:item` };
export const paths  = { home: () => BASE, section: (s) => `${BASE}learn/${s}`, item: (s, i) => `${BASE}learn/${s}/${i}` };
```

## Content model (`src/content/`)

```ts
// types.ts
export type SectionId = 'vowels' | 'consonants' | 'numbers' | 'words';
export interface Item  { id: string; kn: string; roman: string; en?: string; word?: string; value?: number }
export interface Group { id: string; titleKn?: string; titleEn?: string; columns?: number; items: Item[] }
export interface Section { id: SectionId; titleKn: string; titleEn: string; kind: 'letter' | 'word'; groups: Group[] }
```

| File | Content | Groups |
|---|---|---|
| `vowels.ts` | 15 items (FR-12) | 1 untitled group |
| `consonants.ts` | 34 items (FR-13) | 5 varga groups with `columns: 5`, titled ಕ-ವರ್ಗ … ಪ-ವರ್ಗ, + ಅವರ್ಗೀಯ |
| `numbers.ts` | 11 items: digit in `kn`, number word in `word`, plus `value` (FR-14) | 1 untitled group |
| `words.ts` | 40 items with `en` (FR-15) | 5 titled categories |
| `index.ts` | `sections: Record<SectionId, Section>`, `findSection(id)`, `findItem(section, itemId)` | — |

For Numbers, `kn` is the digit (೧) and `word` holds ಒಂದು. The detail screen shows the digit large
and "ಒಂದು · ondu · 1" as the caption.

**Item ids** (URL slugs, ASCII, unique per section; tests enforce `/^[a-z0-9-]+$/`):

- Vowels: `a aa i ii u uu ru e ee ai o oo au am ah`
- Consonants: `ka kha ga gha nga · ca cha ja jha nya · tta ttha dda ddha nna · ta tha da dha na ·
  pa pha ba bha ma · ya ra la va sha ssa sa ha lla` (doubled letter = retroflex/aspirate distinction)
- Numbers: `0` … `10`
- Words: the English meaning, kebab-case (`mother`, `elder-brother`, `rice`, `leg` …). Romanized
  Kannada can't be used because ಅಣ್ಣ and ಅನ್ನ both fold to `anna`

Content is transcribed verbatim from the approved `content-draft.md`. Later corrections edit only
these files (and their tests, if counts change).

## Screens and components

```
src/screens/
  Landing.tsx        renders labelKn (lang="kn") + labelEn per tile; links to paths.section(id)
  landing-tiles.ts   { id: SectionId; labelKn; labelEn; icon }  icons: ಅ ಕ ೧ ಪದ
  Section.tsx        lazy. useRoute().params.section → findSection → <NotFound/> if missing
                     header: <BackLink/> + <h1 lang="kn">titleKn</h1> + <p>titleEn</p>
                     per group: optional <h2> (kn + en), then <ul class="card-grid" style="--cols:N">
                     card = <a class="card" href={paths.item(...)} aria-label="ಕ, ka">…</a>
  ItemDetail.tsx     lazy. findItem → <NotFound/> if missing
                     <BackLink fallback={paths.section(section)}/>
                     <p class="glyph glyph--{kind}" lang="kn">{kn}</p>
                     <p class="caption">{word · roman · value | roman · en}</p>
  ActionStub.tsx     deleted
src/components/BackLink.tsx   new optional `fallback` prop (default paths.home()) used when there is
                              no in-app history (cold start / deep link) → FR-16
```

`Section` and `ItemDetail` both import `src/content/index.ts`. Vite emits them as two lazy chunks
plus one shared content chunk, all outside the initial bundle (NFR-11), and all matched by the
existing Workbox `globPatterns` (`**/*.js`), so they are precached (FR-18).

## Layout and styling (`src/styles/global.css`)

- New token `--font-kn: "Noto Sans Kannada", "Kannada Sangam MN", "Kannada MN", "Tunga", system-ui, sans-serif;`
  applied via `[lang="kn"] { font-family: var(--font-kn); line-height: 1.5; }` (NFR-9). The extra
  line-height leaves room for vowel signs above and below the base.
- `.card-grid { display: grid; grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr)); gap: 8px; }`
  - letters: `--cols: 4` (vowels, numbers, ಅವರ್ಗೀಯ) and `--cols: 5` (varga rows). At 320 px:
    (320 − 2×16 − 4×8) / 5 = 51 px per card ≥ 44 px (NFR-13).
  - words: `--cols: 2`, card shows the Kannada word + English underneath (FR-15).
- `.card` uses `aspect-ratio: 1` for letters; Kannada glyph `font-size: clamp(1.5rem, 7vw, 2.25rem)`.
- Detail: the glyph area is a flex-centred box filling the space under the header.
  - letters: `font-size: min(55vw, 38dvh)` (fallback `38vh`)
  - words: `font-size: min(16vw, 14dvh)` with `overflow-wrap: anywhere` so long words (ಮಾವಿನಹಣ್ಣು) wrap rather than overflow
  - `padding-block: 0.2em` plus `line-height: 1.5` so no ascender or descender is clipped (NFR-9)
- Touch: existing `:active` feedback and `touch-action: manipulation` apply to `.card` (NFR-4).
  Reduced motion is respected as for tiles.

## iOS Safari vs Android

| Topic | iOS (Safari / home screen) | Android (Chrome / installed) | Handling |
|---|---|---|---|
| Kannada font | Kannada Sangam MN ships with iOS | Noto Sans Kannada ships with Android | font stack covers both; no web font |
| Screen readers | VoiceOver may have no Kannada voice | TalkBack uses Google TTS `kn-IN` if installed | `aria-label` includes romanization (NFR-10) |
| Back | swipe-from-edge = `history.back()` | system back = `history.back()` | real history entries per route; `BackLink` fallback for cold starts |
| `dvh` | 16.4+ supports `dvh` | Chrome 110+ supports `dvh` | `vh` fallback kept (existing pattern) |
| Text zoom | `-webkit-text-size-adjust: 100%` already set | — | unchanged |

## Failure modes

| Failure | Result |
|---|---|
| Unknown section or item id | `NotFound` screen (FR-17) |
| Lazy chunk fails to load (offline before first visit, or a deploy changed hashes) | preact-iso suspense → error reaches our `ErrorBoundary` → crash failure shell with Reload. After the SW update flow (FR-9) the chunks are precached |
| Render error in a screen | crash failure shell (FR-5, unchanged) |
| IndexedDB unavailable | storage failure shell (FR-6, unchanged), even though this content needs no storage. Accepted for consistency; revisit if it matters on real devices (see Risks) |

## Tests to write

| File | Covers |
|---|---|
| `src/content/content.test.ts` | FR-12–FR-15 counts and order, NFR-12 ids and code points |
| `src/screens/Landing.test.tsx` (update) | FR-10 labels, `lang`, hrefs; FR-3 four tiles |
| `src/screens/Section.test.tsx` | FR-11 grid and order, FR-13 varga headings and `--cols:5`, FR-15 English line, FR-17 unknown section |
| `src/screens/ItemDetail.test.tsx` | FR-16 glyph and caption per section, Back fallback href, FR-17 unknown item |
| `e2e/landing.spec.ts` (update) | FR-3 layout (unchanged), FR-10 tile → section; FR-4 tests removed |
| `e2e/learn.spec.ts` | FR-11, FR-16 round trip (tile → card → detail → Back → grid → Back → landing); deep link to a detail then Back → section; NFR-9 not clipped; NFR-13 no horizontal scroll at 320 px |
| `e2e/pwa.spec.ts` (extend) | FR-18 offline: open a section and a detail with the context offline |

## Other changes

- `docs/intents/0001-app-foundation/requirements.md`: FR-3 acceptance says the labels come from
  `landing-tiles.ts` (see FR-10); FR-4 "Verified by" → `superseded by FR-16 (intent 0002)`.
- `scripts/check-traceability.mjs`: skip rows whose "Verified by" starts with `superseded`.
- Header title on Landing stays "OpusFactory" (renaming the app or manifest is out of scope).

## Risks / open questions

- **Real-device rendering** is the main risk (NFR-9). Playwright WebKit on Linux uses different fonts
  from iOS. The PR needs a screenshot from a real iPhone and a real Android phone.
- The **storage failure shell blocks read-only content**. Keep for now; a later intent could let
  `DbGate` degrade gracefully for screens that don't need storage.
- **Romanization scheme** (ISO 15919 with diacritics) may be unfamiliar to casual learners. It is a
  content-only change if the owner prefers a simpler scheme later.
