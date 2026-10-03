import { useRoute } from 'preact-iso';
import { BackLink } from '../components/BackLink';
import { findItem, findSection, type Item } from '../content';
import { paths } from '../routes';
import { NotFound } from './NotFound';

/** Caption text after the optional Kannada number word (owner decision 1). */
export function caption(item: Item): string {
  const extra = item.value !== undefined ? String(item.value) : item.en;
  return [item.roman, extra].filter(Boolean).join(' · ');
}

/** FR-16 — one item shown as large as the portrait viewport allows, with a caption. */
export function ItemDetail() {
  const { params } = useRoute();
  const section = findSection(params.section);
  const item = section && findItem(section, params.item);
  if (!section || !item) return <NotFound />;

  return (
    <div class="screen">
      <header class="app-header">
        <BackLink fallback={paths.section(section.id)} />
        <div class="titles">
          <h1 lang="kn">{section.titleKn}</h1>
          <p class="subtitle">{section.titleEn}</p>
        </div>
      </header>
      <main class="detail">
        <p class={`glyph glyph--${section.kind}`} lang="kn" data-testid="glyph">
          {item.kn}
        </p>
        <p class="caption" data-testid="caption">
          {item.word && (
            <>
              <span lang="kn">{item.word}</span>
              {' · '}
            </>
          )}
          {caption(item)}
        </p>
      </main>
    </div>
  );
}
