/**
 * Landing page tiles (FR-3). Future intents change labels/targets here, not in Landing.tsx.
 * Keep exactly four entries while the layout is a 2×2 grid.
 */
export interface LandingTile {
  id: string;
  label: string;
  /** Short hint shown under the label. */
  hint?: string;
  /** Emoji or single glyph used as the tile icon. */
  icon: string;
}

export const landingTiles: LandingTile[] = [
  { id: '1', label: 'Action 1', hint: 'Coming soon', icon: '①' },
  { id: '2', label: 'Action 2', hint: 'Coming soon', icon: '②' },
  { id: '3', label: 'Action 3', hint: 'Coming soon', icon: '③' },
  { id: '4', label: 'Action 4', hint: 'Coming soon', icon: '④' },
];
