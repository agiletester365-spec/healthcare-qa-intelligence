# ADR 0006 — Constrain the Selenium agent to same-origin + bounded steps

**Status:** Accepted · **Date:** 2026-06

## Context

`selenium-agent/agent.py` lets an LLM choose and execute browser actions in a loop. An
autonomous agent that can click and navigate freely is a real liability: a bad model
decision (or a prompt-injected page) could navigate off-site, submit forms, or loop forever
burning tokens and taking unintended actions.

## Decision

Bound the agent with explicit guards rather than trusting the model:

- **Same-origin only** — `navigate` actions are validated against the starting origin and
  refused otherwise.
- **Bounded loop** — `--max-steps` (default 15) caps iterations; the loop also exits on an
  explicit `finish`.
- **No secret leakage** — typed values (passwords) are masked in logs.
- **Explicit responsible-use scope** — defaults to the bundled mock; documented that it must
  only be pointed at authorized targets.

## Alternatives considered

- **Trust the model to stay on task** — rejected: not a safety boundary; one bad step is
  enough.
- **Full sandboxing (container, network egress rules)** — good for a production deployment,
  out of scope for a reference script; noted in the roadmap.

## Consequences

- ✅ The agent cannot wander off the SUT or run unbounded.
- ✅ Demonstrates security awareness for agentic systems (a topic recruiters increasingly
  probe), not just happy-path automation.
- ⚠️ Same-origin blocks legitimate cross-domain flows (e.g. third-party SSO). Acceptable for
  this scope; would need an explicit allowlist for real use.
