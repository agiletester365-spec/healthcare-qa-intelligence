# ADR 0001 — Bundle a mock app as the system under test

**Status:** Accepted · **Date:** 2026-06

## Context

This is a portfolio/reference project demonstrating healthcare patient-portal test
automation. The obvious targets — real patient portals (Epic MyChart, athenahealth, etc.) —
are off-limits: testing them without authorization is unethical and likely illegal, and they
require credentials, MFA, and VPNs that nobody cloning this repo will have. A public demo
site (saucedemo, the-internet) would be portable but wouldn't model healthcare workflows
(appointments, refills, claims, PHI handling) at all.

I needed a target that is healthcare-shaped, runnable by anyone in one command, and safe.

## Decision

Ship a small, dependency-free Node HTTP server (`mock-app/server.mjs`) that implements the
modeled workflows — auth, appointments, prescriptions, claims — with realistic security
headers and accessible markup. The test suites target it by default; `BASE_URL` redirects
them at an authorized environment when one exists.

## Alternatives considered

- **Target a real portal** — rejected: unauthorized, non-reproducible, unsafe.
- **Use a public demo site** — rejected: doesn't model the domain; can't add security/a11y
  affordances I want to assert against.
- **Record/replay (HAR, WireMock)** — rejected: heavier, and a live app exercises real
  client-side behaviour (form submission, DOM updates) that replay can't.

## Consequences

- ✅ `npm i && npm run e2e` is green for anyone, with zero setup and no real PHI.
- ✅ Deterministic, seeded data → stable assertions and visual baselines.
- ✅ I control the app, so I can demonstrate security headers, a11y, and self-healing
  against a realistic surface.
- ⚠️ The app is intentionally simple; it is **not** proof of testing a complex production
  system. The transferable skill is the *framework and engineering approach*, not the SUT.
- ⚠️ State is in-memory and mutable, which created a real test-isolation problem — see
  [ADR 0005](0005-test-isolation-via-entity-scoped-assertions.md).
