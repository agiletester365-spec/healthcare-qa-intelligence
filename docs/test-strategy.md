# Test strategy

## Goal

Verify the patient-portal workflows that matter clinically and legally — authentication,
appointments, prescriptions, billing — at the layer where they actually integrate (the
browser), while keeping the suite fast, deterministic, and meaningful.

## Where this sits in the pyramid

This repo is deliberately **E2E-heavy** because its purpose is to demonstrate end-to-end
automation. In a production codebase the same logic would sit on a much larger base of unit
and integration tests; the shared engine (`shared/`) is unit-testable in isolation and is
the natural place that base would attach. That's a conscious scope choice, not an oversight —
see [Known limitations](known-limitations.md).

```
        ╱╲          E2E (this repo): Playwright + Cypress, 48 specs
       ╱──╲         Integration:     mock-app API exercised via security/* specs
      ╱────╲        Unit:            shared/ engine — see roadmap (vitest)
```

## Coverage matrix

| Workflow | Happy path | Validation / negative | a11y | Visual | Security |
|---|:--:|:--:|:--:|:--:|:--:|
| Login / session | ✅ | ✅ (bad creds, redirects, logout) | ✅ | ✅ | ✅ (cookie, enumeration) |
| Appointments | ✅ | ✅ (required fields) | ✅ | — | — |
| Prescriptions | ✅ | ✅ (zero-refills guard) | ✅ | — | — |
| Billing / claims | ✅ | ✅ (seeded-state check) | ✅ | — | ✅ (auth on API) |
| Cross-cutting | — | — | ✅ all pages | ✅ login+dash | ✅ headers, PHI-in-URL |

## Principles applied

- **Web-first assertions** — rely on auto-waiting (`expect().toBeVisible()`, Cypress
  retry-ability) instead of fixed sleeps. No `waitForTimeout` in the suites.
- **Stable selectors** — `data-testid` first, with self-healing fallbacks so selector drift
  surfaces as a logged event rather than a hard failure.
- **Entity-scoped assertions** — tests assert on data they created or always-true seeded
  facts, never on global mutable counts. This is what makes the parallel run stable
  ([ADR 0005](adr/0005-test-isolation-via-entity-scoped-assertions.md)).
- **Deterministic data** — seeded faker (`TEST_DATA_SEED`) → reproducible runs and stable
  visual baselines.
- **a11y as a gate** — axe-core fails the build on serious/critical WCAG 2.1 AA violations,
  appropriate for healthcare (Section 508).

## Flakiness handling

- Verified the Playwright suite green across **3 consecutive full runs** before committing.
- Retries: 2 in CI, 0 locally (local retries hide races; CI retries absorb infra noise).
- Traces/video/screenshots captured `on-first-retry` / `on-failure` for triage.
- The one race I introduced (visibility-probe) was root-caused and fixed at the design level,
  not papered over with a retry — see [ADR 0003](adr/0003-self-healing-resolves-on-existence.md).

## What I deliberately did *not* test

- Backend persistence beyond in-memory (the mock has none by design).
- Cross-browser visual baselines (pinned to chromium to avoid cross-engine pixel noise;
  functional specs still run on firefox/webkit).
- Load/performance and full security DAST — these are noted as roadmap items, not claimed.
