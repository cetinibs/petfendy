# Sentinel Journal

This journal records critical security learnings and vulnerability patterns found in the codebase.

## 2024-05-22 - [Example Entry]
**Vulnerability:** Hardcoded API keys in `config.ts`
**Learning:** Developers often commit secrets for convenience during initial setup.
**Prevention:** Use environment variables and pre-commit hooks to scan for secrets.
