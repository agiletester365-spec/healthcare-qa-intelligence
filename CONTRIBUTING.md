# Contributing

Thanks for taking a look. This repo is small but opinionated; a few conventions keep it
stable and meaningful.

## Setup

```bash
npm install
npx playwright install
npm run mock          # start the mock app on :4300 (separate terminal)
npm run e2e           # Playwright + Cypress
npm run typecheck     # TS across both suites + shared engine
```

## Writing tests — house rules

1. **Selectors:** `data-testid` first. For elements likely to drift, declare a `LocatorSpec`
   and use `smart()` (Playwright) / `cy.smartGet()` (Cypress) so drift self-heals and logs.
2. **No fixed waits.** Use web-first / retrying assertions, never `waitForTimeout` /
   `cy.wait(<ms>)`.
3. **Assert on your own entity.** Because the mock app shares mutable state across parallel
   workers, assert on data the test created (e.g. a returned id) or always-true seeded facts —
   never on global counts. This is the rule behind
   [ADR 0005](docs/adr/0005-test-isolation-via-entity-scoped-assertions.md); breaking it
   reintroduces flakiness.
4. **Synthetic data only.** Use the `shared/data` factories; never hardcode anything
   resembling real PHI.
5. **Keep AI optional.** New AI-assisted helpers must degrade to deterministic behaviour
   without `ANTHROPIC_API_KEY` ([ADR 0004](docs/adr/0004-ai-features-degrade-gracefully.md)).

## Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`,
  `docs:`, `test:`, `chore:`, `ci:`).
- Explain the *why* in the body when the change isn't obvious. A good commit message is the
  cheapest documentation there is.

## Decisions

Non-trivial design choices get an ADR in `docs/adr/` (copy the format of an existing one).
If you change a decision, supersede the ADR rather than editing history.

## Before opening a PR

- [ ] `npm run typecheck` passes
- [ ] `npm run e2e` passes locally (run it twice — races hide on the first pass)
- [ ] New behaviour has a test; new decisions have an ADR
- [ ] `CHANGELOG.md` updated under *Unreleased*
