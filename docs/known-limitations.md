# Known limitations

Being explicit about what this project is *not* — naming the edges is part of owning it.

| # | Limitation | Why it's acceptable here | Path forward |
|---|---|---|---|
| 1 | **SUT is a simple mock**, not a complex production app | Keeps the repo runnable, safe, and reproducible ([ADR 0001](adr/0001-bundled-mock-as-system-under-test.md)). The transferable value is the framework, not the SUT. | Provide an adapter so the same specs can run against a real authorized staging env. |
| 2 | **No unit tests** for the `shared/` engine yet | Repo's purpose is E2E demonstration; the engine is small and exercised indirectly. | Add vitest unit tests for `self-healing`, `security/checks`, factories (#roadmap). |
| 3 | **AI features need a key** to be fully visible | Determinism + free CI ([ADR 0004](adr/0004-ai-features-degrade-gracefully.md)). | A recorded demo / GIF showing AI mode; optional VCR-style cassette for the LLM call. |
| 4 | **NL-authoring CLI is a thin wrapper** | Honest scope; the value is the authoring guide it feeds the model. | Add validation that generated tests compile + a feedback loop. |
| 5 | **Shared mutable mock state** under parallelism | Mitigated by entity-scoped assertions ([ADR 0005](adr/0005-test-isolation-via-entity-scoped-assertions.md)). | Per-worker data namespacing for true isolation. |
| 6 | **Cross-browser visual baselines** not maintained | Cross-engine pixel noise makes them low-signal | Per-browser baseline dirs + a visual-diff service (Percy/Argos). |
| 7 | **Agent has no sandboxing** beyond same-origin + step cap | Reference script, not a deployed service ([ADR 0006](adr/0006-agent-safety-guards.md)) | Containerize with network egress rules for real use. |
| 8 | **No performance/load testing** | Out of scope for functional E2E | k6/Artillery against the API as a separate track. |
