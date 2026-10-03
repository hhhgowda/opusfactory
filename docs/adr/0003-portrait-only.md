# ADR 0003 — Portrait only via manifest + CSS overlay

- **Status:** Accepted · 2026-10-02 · Intent 0001

## Context
The app must be usable in portrait only. iOS Safari ignores the manifest `orientation` member
and does not implement `screen.orientation.lock()`. Android honours the manifest for installed PWAs;
`lock()` works only in fullscreen.

## Decision
1. Manifest `"orientation": "portrait"`.
2. Best-effort `screen.orientation.lock('portrait')` wrapped in try/catch.
3. A CSS-only overlay shown under `@media (orientation: landscape) and (hover: none) and (pointer: coarse)`
   that hides the app and asks the user to rotate.

## Consequences
- + Consistent behaviour on every mobile browser, even before JS runs or inside the failure shell.
- + Desktop development is not blocked (overlay limited to coarse-pointer devices).
- − On iOS the page still physically rotates; users briefly see the overlay rather than a locked screen.
- − Tablets in landscape are blocked too — revisit if iPad support becomes a goal.
