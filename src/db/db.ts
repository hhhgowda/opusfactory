import { type IDBPDatabase, openDB } from 'idb';
import { type AppDB, DB_NAME, DB_VERSION, type ErrorRecord, migrations } from './schema';

export type AppDatabase = IDBPDatabase<AppDB>;

export class StorageUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'StorageUnavailableError';
  }
}

export const OPEN_TIMEOUT_MS = 4000;

let dbPromise: Promise<AppDatabase> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new StorageUnavailableError(`IndexedDB did not open within ${ms} ms`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/** Test/dev hook: `?__nodb=1` simulates missing IndexedDB (never active in production builds). */
function simulatedNoDb(): boolean {
  if (import.meta.env.PROD && !import.meta.env.VITE_E2E) return false;
  return new URLSearchParams(globalThis.location?.search ?? '').has('__nodb');
}

async function openFresh(timeoutMs: number): Promise<AppDatabase> {
  if (simulatedNoDb() || typeof indexedDB === 'undefined' || indexedDB === null) {
    throw new StorageUnavailableError('IndexedDB is not available in this browser');
  }
  try {
    const db = await withTimeout(
      openDB<AppDB>(DB_NAME, DB_VERSION, {
        upgrade(database, oldVersion, _newVersion, tx) {
          for (let v = oldVersion; v < migrations.length; v++) migrations[v](database, tx);
        },
        blocked() {
          console.warn('[db] upgrade blocked by another open tab');
        },
        blocking() {
          // Another tab wants to upgrade: release our connection so it can proceed.
          db.close();
          dbPromise = null;
        },
        terminated() {
          dbPromise = null;
        },
      }),
      timeoutMs,
    );
    return db;
  } catch (err) {
    if (err instanceof StorageUnavailableError) throw err;
    throw new StorageUnavailableError('IndexedDB could not be opened', { cause: err });
  }
}

/** Opens (once) and returns the app database. Rejects with StorageUnavailableError. */
export function openAppDb(timeoutMs = OPEN_TIMEOUT_MS): Promise<AppDatabase> {
  if (!dbPromise) {
    dbPromise = openFresh(timeoutMs).catch((err) => {
      dbPromise = null; // allow a retry later
      throw err;
    });
  }
  return dbPromise;
}

/** Ask the browser not to evict our data (Safari evicts non-installed sites after 7 idle days). */
export async function requestPersistence(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function kvGet<T>(key: string): Promise<T | undefined> {
  return (await openAppDb()).get('kv', key) as Promise<T | undefined>;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await (await openAppDb()).put('kv', value, key);
}

const MAX_ERRORS = 50;

/** Best-effort error log. Never throws — it is called from the failure path. */
export async function logError(kind: ErrorRecord['kind'], error: unknown): Promise<void> {
  try {
    const err = error instanceof Error ? error : new Error(String(error));
    const db = await openAppDb(1000);
    const tx = db.transaction('errors', 'readwrite');
    await tx.store.add({
      time: Date.now(),
      kind,
      message: err.message,
      stack: err.stack,
      url: location.href,
      userAgent: navigator.userAgent,
    });
    // Keep only the newest MAX_ERRORS entries.
    const count = await tx.store.count();
    if (count > MAX_ERRORS) {
      let cursor = await tx.store.index('by-time').openCursor();
      for (let i = 0; cursor && i < count - MAX_ERRORS; i++) {
        await cursor.delete();
        cursor = await cursor.continue();
      }
    }
    await tx.done;
  } catch {
    /* swallow — logging must never cause a second failure */
  }
}

export async function recentErrors(limit = 20): Promise<ErrorRecord[]> {
  const all = await (await openAppDb()).getAllFromIndex('errors', 'by-time');
  return all.slice(-limit).reverse();
}

/** For tests only. */
export function __resetDbForTests(): void {
  dbPromise = null;
}
