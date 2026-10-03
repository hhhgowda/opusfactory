import type { DBSchema, IDBPDatabase, IDBPTransaction, StoreNames } from 'idb';

export const DB_NAME = 'opusfactory';

export interface ErrorRecord {
  id?: number;
  time: number;
  kind: 'crash' | 'storage' | 'global';
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
}

export interface AppDB extends DBSchema {
  kv: { key: string; value: unknown };
  errors: { key: number; value: ErrorRecord; indexes: { 'by-time': number } };
}

type UpgradeTx = IDBPTransaction<AppDB, StoreNames<AppDB>[], 'versionchange'>;
type Migration = (db: IDBPDatabase<AppDB>, tx: UpgradeTx) => void;

/**
 * Forward-only migrations (ADR 0002). Index 0 upgrades to version 1, index 1 to version 2, …
 * NEVER edit or reorder an existing step — append a new one. DB_VERSION follows the array length.
 */
export const migrations: Migration[] = [
  // v1 — foundation (intent 0001)
  (db) => {
    db.createObjectStore('kv');
    const errors = db.createObjectStore('errors', { keyPath: 'id', autoIncrement: true });
    errors.createIndex('by-time', 'time');
  },
];

export const DB_VERSION = migrations.length;
