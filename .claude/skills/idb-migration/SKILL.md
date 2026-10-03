---
name: idb-migration
description: Add or change IndexedDB object stores/indexes safely with an append-only migration. Use whenever a feature needs new persisted data, a new index, or a data transform.
---

# IndexedDB migration (ADR 0002)

Rules: **append, never edit**. Users may upgrade from any old version; every step must run in order.

1. In `src/db/schema.ts`:
   - Add the store type to `AppDB` (key, value, optional `indexes`).
   - Append a function to `migrations` with a comment `// vN — <what> (intent NNNN)`.
     `DB_VERSION` updates automatically (array length).
   - Data transforms: use the provided `tx` (`tx.objectStore('x')`) — do not open new transactions, do not `await`
     anything that is not an IDB request inside `upgrade` (the versionchange transaction auto-commits).
2. In `src/db/db.ts` add typed helpers (e.g. `listNotes()`, `saveNote()`); components never call `openAppDb()` directly
   except via helpers.
3. Tests in `src/db/db.test.ts` (fake-indexeddb):
   - Fresh install creates the new store at `DB_VERSION`.
   - **Upgrade path**: open with the previous version using `openDB(DB_NAME, N-1, { upgrade })` applying
     `migrations.slice(0, N-1)`, seed data, close, then `openAppDb()` and assert data survived/transformed.
4. Safari notes: keep keys simple (string/number/Date/array). Avoid storing `Blob`s larger than a few MB in one record.
   Do not rely on `getAll` with huge stores on old iOS — paginate with cursors.
5. The PreToolUse hook will ask the human to approve edits to `schema.ts`. Explain in one line why the change is
   append-only when it asks.
