# Changelog

Notable changes to this project. Format follows
[Keep a Changelog](https://keepachangelog.com/). This includes the real bugs found and fixed
while building the suites — kept here because the debugging is part of the engineering story.

## [Unreleased]

### Added
- Architecture Decision Records (`docs/adr/`) documenting the six non-obvious decisions.
- Test strategy, known-limitations, and roadmap docs.
- Screenshots of the mock portal in `docs/screenshots/`.
- `CONTRIBUTING.md`, `SECURITY.md`, and GitHub issue/PR templates.
- `Dockerfile` + `docker-compose.yml` to run the mock app and suites in a container.

### Changed
- README rewritten in an engineering voice: problem framing, architecture diagram, explicit
  tradeoffs, and links to the ADRs.

## [0.1.0] — 2026-06

### Added
- Playwright and Cypress E2E suites for login, appointments, prescriptions, and billing.
- Shared self-healing locator engine consumed by both runners.
- Accessibility (axe-core, WCAG 2.1 AA), visual regression, and a security baseline.
- Synthetic, seeded test-data factories (faker, optional LLM clinical notes).
- Autonomous Selenium AI agent loop with same-origin and step-count guards.

### Fixed
These surfaced while getting the suite green and stable — root-caused, not retried away:

- **Self-healing rejected valid hidden elements.** The probe required visibility at resolve
  time, so confirmation/error nodes (present but `hidden`) failed to resolve. Changed to
  resolve on *existence* and let the runner's auto-waiting handle visibility.
  ([ADR 0003](docs/adr/0003-self-healing-resolves-on-existence.md))
- **Visibility-probe race under parallelism.** Single-pass visibility checks immediately
  after a click were a coin flip; fixed by the existence-based resolution above. Verified
  green across 3 consecutive full runs.
- **`smart()` required a unique match for a list action.** "First enabled refill button"
  matched multiple elements; list actions now use `.first()` while `smart()` keeps enforcing
  uniqueness for single-element intents.
- **Flaky count-based assertions on shared mock state.** Rewrote to assert on entities each
  test creates (unique claim id) and always-true seeded facts; masked dynamic dashboard
  counts in the visual baseline.
  ([ADR 0005](docs/adr/0005-test-isolation-via-entity-scoped-assertions.md))
- **Cypress `cy.should()` callback invoked commands.** The first `cy.smartGet()` called
  `cy.task`/`cy.wrap` inside a `.should()` retry callback (illegal). Reworked to resolve the
  selector in `cy.then()` and hand off to `cy.get()` for built-in retry-ability.
- **Wrong Cypress assertion (`match` vs text).** `.and('match', /…/)` checks selector match,
  not text content; corrected the login-error assertion to `contain.text`.
