# ADR 0002 — Two runners, one shared engine

**Status:** Accepted · **Date:** 2026-06

## Context

Cypress and Playwright are the two dominant E2E runners, and teams genuinely disagree on
which to use. A project that demonstrates only one leaves a reader guessing whether I can
work in the other. But duplicating every concept (self-healing, data factories, security
checks) across two stacks would be a maintenance trap and would itself signal poor design.

## Decision

Put all framework-agnostic logic in `shared/` and consume it from both runners through thin
adapters:

- `shared/ai/self-healing.ts` exposes a `resolveSelector(spec, probe)` that takes a
  `probe(selector) => Promise<boolean>` callback. Playwright supplies a `page.locator`-based
  probe; Cypress supplies a `Cypress.$`-based one.
- `shared/data/*` and `shared/security/*` are pure TS, imported directly by both.

So the *engine* is written once; only the binding to each runner's API differs.

## Alternatives considered

- **Pick one runner** — rejected: weaker demonstration, and the shared-engine design is
  itself the more interesting thing to show.
- **A custom abstraction layer over both runners** — rejected: over-engineered; teams want
  idiomatic Playwright/Cypress, not a bespoke DSL on top.

## Consequences

- ✅ One mental model; logic fixes land in both suites at once.
- ✅ Demonstrates the abstraction boundary explicitly (adapter pattern).
- ⚠️ The two runners have genuinely different execution models (Playwright's async/await vs
  Cypress's command queue). The Cypress adapter can't reuse the async engine directly and
  reimplements resolution natively — a real seam, documented in
  [ADR 0003](0003-self-healing-resolves-on-existence.md).
- ⚠️ Slightly more indirection than a single-runner project; justified by the payoff above.
