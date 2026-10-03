/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Set to "1" for E2E builds: enables ?__crash and ?__nodb test hooks in production bundles. */
  readonly VITE_E2E?: string;
}
