/** Single source of truth for paths. Base-path aware so GitHub Pages sub-paths work. */
const BASE = import.meta.env.BASE_URL; // always ends with '/'

export const routes = {
  home: BASE,
  section: `${BASE}learn/:section`,
  item: `${BASE}learn/:section/:item`,
} as const;

export const paths = {
  home: () => BASE,
  section: (section: string) => `${BASE}learn/${section}`,
  item: (section: string, item: string) => `${BASE}learn/${section}/${item}`,
};
