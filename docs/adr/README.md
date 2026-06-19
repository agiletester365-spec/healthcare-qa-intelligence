# Architecture Decision Records

Short records of the non-obvious decisions in this project — the context, what was chosen,
what was rejected, and the tradeoffs accepted. They exist so the reasoning survives the
code, and so a future maintainer (or me, in six months) can tell a deliberate choice from
an accident.

| ADR | Decision | Status |
|---|---|---|
| [0001](0001-bundled-mock-as-system-under-test.md) | Bundle a mock app as the system under test | Accepted |
| [0002](0002-two-runners-one-shared-engine.md) | Maintain Playwright **and** Cypress from one shared engine | Accepted |
| [0003](0003-self-healing-resolves-on-existence.md) | Self-healing locators resolve on existence, not visibility | Accepted (bug-driven) |
| [0004](0004-ai-features-degrade-gracefully.md) | AI features are optional and degrade to deterministic behaviour | Accepted |
| [0005](0005-test-isolation-via-entity-scoped-assertions.md) | Isolate parallel tests with entity-scoped assertions, not DB resets | Accepted (bug-driven) |
| [0006](0006-agent-safety-guards.md) | Constrain the Selenium agent to same-origin + bounded steps | Accepted |

Format is a trimmed [MADR](https://adr.github.io/madr/): Context → Decision → Alternatives →
Consequences.
