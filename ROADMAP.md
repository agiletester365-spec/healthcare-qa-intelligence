# Roadmap

Where this goes next, roughly in priority order. Tracked as [GitHub issues](../../issues);
this file is the high-level view.

## Near term

- [ ] **Enable CI** — move `docs/ci-workflow.example.yml` to `.github/workflows/ci.yml`
      (Playwright on chromium/firefox/webkit + Cypress + typecheck on every PR).
- [ ] **Unit tests for `shared/`** — vitest coverage for the self-healing resolver, security
      checks, and data factories (the layer E2E exercises only indirectly).
- [ ] **Lint + format gate** — ESLint + Prettier wired into CI and a pre-commit hook.
- [ ] **Recorded demo** — short GIF of the self-healing log and the Selenium agent loop.

## Mid term

- [ ] **Real-env adapter** — config layer so the same specs run against an authorized
      staging portal (env-driven base URL, auth strategy, data setup/teardown).
- [ ] **Per-worker data isolation** — namespace mock state per worker for true parallel
      isolation (removes the shared-state constraint behind ADR 0005).
- [ ] **Visual diffing service** — integrate Argos/Percy for reviewable visual changes and
      per-browser baselines.
- [ ] **Expand security checks** — login rate-limiting, password-policy, CSP report-only
      validation, TLS config.

## Longer term

- [ ] **Contract tests** against the mock API (Pact-style) to decouple UI specs from backend.
- [ ] **Performance track** — k6 smoke + load against the API.
- [ ] **Agent hardening** — containerized execution, action allowlists, and an eval harness
      that scores agent task completion across goals.
- [ ] **Reporting** — publish HTML reports + trends to GitHub Pages from CI.

## Done

- [x] Cypress + Playwright suites for all four workflows (48 specs).
- [x] Shared self-healing engine across both runners.
- [x] a11y (axe-core) + visual regression + security baseline.
- [x] Synthetic, seeded test-data factories.
- [x] Autonomous Selenium AI agent loop with safety guards.
- [x] Architecture Decision Records and test strategy.
