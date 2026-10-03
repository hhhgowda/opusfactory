import { consonants } from './consonants';
import { numbers } from './numbers';
import type { Item, Section, SectionId } from './types';
import { vowels } from './vowels';
import { words } from './words';

export type { Group, Item, Section, SectionId } from './types';

/** All learning sections, in landing-tile order (FR-10). */
export const sections: Record<SectionId, Section> = { vowels, consonants, numbers, words };

export const sectionIds = Object.keys(sections) as SectionId[];

export function findSection(id: string | undefined): Section | undefined {
  return id && Object.hasOwn(sections, id) ? sections[id as SectionId] : undefined;
}

export function findItem(section: Section, itemId: string | undefined): Item | undefined {
  if (!itemId) return undefined;
  for (const group of section.groups) {
    const item = group.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return undefined;
}

/** Flat list of a section's items in display order. */
export function allItems(section: Section): Item[] {
  return section.groups.flatMap((g) => g.items);
}
