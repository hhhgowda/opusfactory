# ADR 0002 — IndexedDB via `idb` with forward-only migrations

- **Status:** Accepted · 2026-10-02 · Intent 0001

## Context
All data is local. localStorage is synchronous, string-only and ~5 MB; Cache API is for responses.
IndexedDB is the only structured, large, async store on both iOS Safari and Android.

## Decision
Use `idb` (Jake Archibald's promise wrapper) with a typed `DBSchema`. Schema changes are an
append-only list of migration steps keyed by version. `open()` is raced against a 4 s timeout and
failures surface the storage failure shell. Request `navigator.storage.persist()` on first run.

## Consequences
- + Typed stores/indexes; tests run against `fake-indexeddb`.
- + Old migration steps never change → upgrades from any version are deterministic.
- − Safari may evict data for non-installed sites after 7 days unused; we must encourage install
  before storing anything precious (future intent).
- − No cross-device sync (out of scope).

## Alternatives considered
Dexie (heavier, more features than needed), localForage (no indexes), OPFS + SQLite WASM (large, newer Safari only).
