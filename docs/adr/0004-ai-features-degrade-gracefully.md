# ADR 0004 — AI features are optional and degrade gracefully

**Status:** Accepted · **Date:** 2026-06

## Context

The project showcases AI-assisted automation (self-healing selector suggestions,
NL-to-test authoring, generated test data). But a CI pipeline and anyone cloning the repo
won't have an `ANTHROPIC_API_KEY`, and tests that depend on a network call to an LLM are
both non-deterministic and a flakiness/cost liability.

## Decision

Treat AI as an **enhancement layer, never a hard dependency**. Every AI helper checks for
`ANTHROPIC_API_KEY` and falls back to deterministic behaviour when it is absent:

- `askClaude()` returns `null`; callers handle null.
- Self-healing still heals via the fallback selector list; it just doesn't add an
  AI-suggested durable selector.
- The data factory returns templated (still synthetic) clinical notes instead of generated
  ones.
- The NL-authoring CLI prints a ready-to-fill scaffold instead of generated code.

The same test suite runs in both modes; a key "upgrades" it rather than enabling it.

## Alternatives considered

- **Require a key** — rejected: breaks CI and first-clone experience; couples test
  reliability to an external paid API.
- **Mock the LLM in tests** — partially adopted in spirit (the deterministic fallbacks *are*
  the no-key path), but I avoid asserting on AI output because non-deterministic text
  shouldn't gate a build.

## Consequences

- ✅ CI is deterministic and free; the repo is green on first clone.
- ✅ AI is demonstrably integrated (real Messages API call via stdlib/`fetch`) without being
  a reliability risk.
- ⚠️ The headline AI features are only *fully* visible with a key. This is called out in the
  README and in [docs/known-limitations.md](../known-limitations.md) rather than hidden.
- ⚠️ The NL-authoring CLI is deliberately a thin wrapper — honest about its depth; the
  durable value is the conventions/guide it feeds the model, not the wrapper.
