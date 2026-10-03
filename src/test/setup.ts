import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/preact';
import { afterEach, beforeEach } from 'vitest';
import { __resetDbForTests } from '../db/db';

beforeEach(async () => {
  __resetDbForTests();
  // Fresh in-memory IndexedDB per test.
  const { IDBFactory } = await import('fake-indexeddb');
  globalThis.indexedDB = new IDBFactory();
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', '/');
});
