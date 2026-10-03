import { describe, expect, it, vi } from 'vitest';
import { kvGet, kvSet, logError, openAppDb, recentErrors, StorageUnavailableError } from './db';
import { DB_VERSION } from './schema';

describe('db', () => {
  it('FR-8 opens at the current schema version with kv and errors stores', async () => {
    const db = await openAppDb();
    expect(db.version).toBe(DB_VERSION);
    expect([...db.objectStoreNames].sort()).toEqual(['errors', 'kv']);
  });

  it('FR-8 returns the same connection on repeated calls', async () => {
    expect(await openAppDb()).toBe(await openAppDb());
  });

  it('FR-8 round-trips kv values', async () => {
    await kvSet('greeting', { hello: 'world' });
    expect(await kvGet('greeting')).toEqual({ hello: 'world' });
    expect(await kvGet('missing')).toBeUndefined();
  });

  it('FR-5 logs errors newest-first and never throws', async () => {
    await logError('crash', new Error('first'));
    await logError('global', 'second');
    const errors = await recentErrors();
    expect(errors.map((e) => e.message)).toEqual(['second', 'first']);
    expect(errors[1].kind).toBe('crash');
  });

  it('FR-6 rejects with StorageUnavailableError when IndexedDB is missing', async () => {
    vi.stubGlobal('indexedDB', undefined);
    await expect(openAppDb()).rejects.toBeInstanceOf(StorageUnavailableError);
    vi.unstubAllGlobals();
  });

  it('FR-6 rejects when open() never settles (Safari hang) and allows retry', async () => {
    const real = globalThis.indexedDB;
    // An IDBRequest that never fires success/error — reproduces the iOS hang.
    vi.stubGlobal('indexedDB', {
      open: () => new (globalThis.IDBRequest as unknown as new () => IDBRequest)(),
    });
    await expect(openAppDb(50)).rejects.toThrow(/did not open within 50 ms/);
    vi.stubGlobal('indexedDB', real);
    await expect(openAppDb()).resolves.toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('FR-6 ?__nodb=1 simulates missing storage outside production', async () => {
    window.history.replaceState(null, '', '/?__nodb=1');
    await expect(openAppDb()).rejects.toBeInstanceOf(StorageUnavailableError);
  });

  it('logError swallows failures when storage is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined);
    await expect(logError('crash', new Error('x'))).resolves.toBeUndefined();
    vi.unstubAllGlobals();
  });
});
