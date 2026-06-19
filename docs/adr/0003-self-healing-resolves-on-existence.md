# ADR 0003 — Self-healing locators resolve on existence, not visibility

**Status:** Accepted (bug-driven) · **Date:** 2026-06

## Context

The first cut of the Playwright self-healing probe required a candidate selector to resolve
to *exactly one visible element* before accepting it:

```ts
const count = await page.locator(selector).count();
if (count !== 1) return false;
return page.locator(selector).first().isVisible();   // ← the problem
```

This broke two ways, both found by running the suite:

1. **Hidden-but-present elements.** Confirmation/error nodes (`rx-msg`, `appt-confirm`,
   `login-error`) exist in the DOM from page load but start `hidden`. The probe rejected
   them, then threw "could not resolve" — even though the selector was correct.
2. **Resolve-time race.** `resolveSelector` ran a single pass with no auto-waiting. Probing
   visibility immediately after a click (while the async fetch that reveals the element was
   still in flight) was a coin flip — which made the suite pass in isolation but fail under
   parallel load. Classic flaky test.

## Decision

Resolve a candidate on **existence** (`count === 1`), not visibility. Visibility is then
asserted by the *caller* via the runner's auto-waiting assertion
(`expect(locator).toBeVisible()` / Cypress retry-ability), which is the layer actually
designed to wait.

```ts
const probe = async (s) => (await page.locator(s).count()) === 1;
```

Separately, list actions that legitimately match multiple elements (e.g. "first enabled
refill button") bypass `smart()` and use `.first()` directly — `smart()` intentionally
enforces uniqueness for single-element intents.

## Alternatives considered

- **Add a retry/timeout loop inside the probe** — rejected: it duplicates the auto-waiting
  both runners already provide, and a per-candidate timeout makes the legacy-selector-miss
  case slow (it would wait the full timeout on a stale selector before falling back).
- **Require visibility but pre-wait for the element** — rejected: couples resolution to
  visibility timing, which is exactly the race that bit me.

## Consequences

- ✅ Stable across 3× full-suite runs under parallelism (verified).
- ✅ Clear separation: the engine *finds* the element; the runner *waits* on its state.
- ⚠️ `smart()` no longer guarantees the returned element is visible — the caller must assert
  that. This is documented and is the correct contract.
