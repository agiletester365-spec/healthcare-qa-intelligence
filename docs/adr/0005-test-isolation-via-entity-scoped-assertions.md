# ADR 0005 — Isolate parallel tests with entity-scoped assertions

**Status:** Accepted (bug-driven) · **Date:** 2026-06

## Context

The mock app holds state in memory ([ADR 0001](0001-bundled-mock-as-system-under-test.md)).
Playwright runs `fullyParallel`, and all workers hit one shared server. Two assertions
broke as a result, in both runners:

- `expect(claimRows).toHaveCount(2)` — another test (or a prior run, since Playwright reuses
  a running dev server locally) had already submitted a claim, so the count was 3.
- A dashboard visual snapshot whose stat **counts change with state**, making the baseline
  non-reproducible.

These are textbook shared-backend isolation failures.

## Decision

Make every assertion depend only on **what the test itself created or on always-true seeded
facts**, never on global mutable counts:

- The "submit a claim" test asserts on the **unique claim id returned**, not a row count.
- The "seeded claim" test asserts the always-present seeded *Annual physical / Paid* row
  exists — not that there are exactly N rows.
- The dashboard visual test **masks** the live stat numbers so the baseline is stable.

## Alternatives considered

- **Reset DB between tests via an endpoint** — rejected: with parallel workers sharing one
  server, a reset in one test corrupts another mid-flight. Per-test reset only works with a
  per-test backend.
- **Per-worker/per-session data namespacing** — viable for a real backend (seed a fresh
  tenant per worker), but overkill for this mock and out of scope. Noted in the roadmap.
- **Serialize the suite (`workers: 1`)** — rejected: hides the design problem and throws
  away parallel speed.

## Consequences

- ✅ Stable under parallelism; verified across repeated full-suite runs.
- ✅ The assertions are also *better tests* — they verify behaviour, not incidental global
  state.
- ⚠️ Requires discipline: new tests must follow the same "assert on your own entity" rule.
  Captured in [CONTRIBUTING.md](../../CONTRIBUTING.md).
