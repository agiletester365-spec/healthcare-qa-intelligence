# Security policy

## Scope and intent

This repository is for **authorized testing only**. It ships a synthetic mock patient portal
as its default target and contains **no real patient data (PHI)**. The security specs and the
Selenium agent must only be pointed (`BASE_URL` / `--url`) at:

- the bundled mock app, or
- systems you own, or
- systems you have explicit written authorization to test.

Never run them against production or third-party healthcare systems.

## What the suite checks

The security baseline (`shared/security/checks.ts`) is a regression guard, not a substitute
for professional testing. It verifies security headers, hardened session cookies
(`HttpOnly` + `SameSite`), absence of PHI/secrets in URLs, login anti-enumeration, and auth
on protected APIs. See [docs/security-testing.md](docs/security-testing.md).

## Handling secrets

- `ANTHROPIC_API_KEY` is read from the environment / `.env` (gitignored). Never commit it.
- The agent masks typed values (passwords) in its logs.
- `.env.example` documents configuration without any real values.

## Reporting a vulnerability

If you find a security issue in this code, please open a GitHub issue marked **security**
(or, for anything sensitive, contact the maintainer privately rather than filing a public
issue with exploit details). I'll acknowledge and address it.
