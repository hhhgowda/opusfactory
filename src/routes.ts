/** Single source of truth for paths. Base-path aware so GitHub Pages sub-paths work. */
const BASE = import.meta.env.BASE_URL; // always ends with '/'

export const routes = {
  home: BASE,
  action: `${BASE}action/:id`,
} as const;

export const paths = {
  home: () => BASE,
  action: (id: string | number) => `${BASE}action/${id}`,
};
