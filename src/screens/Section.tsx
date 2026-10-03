import { useRoute } from 'preact-iso';
import { BackLink } from '../components/BackLink';
import { findSection, type Item, type Section as SectionData } from '../content';
import { paths } from '../routes';
import { NotFound } from './NotFound';

/** Accessible name for a card (NFR-10): Kannada, romanization and, for words, English. */
export function cardLabel(item: Item): string {
  return [item.kn, item.roman, item.en].filter(Boolean).join(', ');
}

/** FR-11 — a section's grid of cards, grouped where the content has groups (FR-13, FR-15). */
export function Section() {
  const { params } = useRoute();
  const section = findSection(params.section);
  if (!section) return <NotFound />;

  return (
    <div class="screen">
      <header class="app-header">
        <BackLink />
        <div class="titles">
          <h1 lang="kn">{section.titleKn}</h1>
          <p class="subtitle">{section.titleEn}</p>
        </div>
      </header>
      <main class={`learn learn--${section.kind}`}>
        {section.groups.map((group) => (
          <section
            key={group.id}
            class="card-group"
            aria-labelledby={group.titleKn ? `g-${group.id}` : undefined}
          >
            {group.titleKn && (
              <h2 id={`g-${group.id}`} class="group-title">
                <span lang="kn">{group.titleKn}</span> <span class="group-title-en">{group.titleEn}</span>
              </h2>
            )}
            <ul
              class="card-grid"
              style={{ '--cols': String(group.columns ?? defaultColumns(section)) }}
              data-testid={`grid-${group.id}`}
            >
              {group.items.map((item) => (
                <li key={item.id}>
                  <a class="card" href={paths.item(section.id, item.id)} aria-label={cardLabel(item)}>
                    <span class="card-kn" lang="kn">
                      {item.kn}
                    </span>
                    {item.en && <span class="card-en">{item.en}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

function defaultColumns(section: SectionData): number {
  return section.kind === 'word' ? 2 : 4;
}
