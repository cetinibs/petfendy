## 2024-05-23 - Recursive Sanitization Gap
**Vulnerability:** The `sanitizeInput` function used a single-pass regex replacement chain. This allowed attackers to bypass sanitization using nested patterns (e.g., `javajavascript:script:`), which would resolve to a malicious payload after the first pass.
**Learning:** Single-pass sanitization is insufficient for security-critical input cleaning. Discrepancies between memory/documentation and actual code state (drifts) can hide such vulnerabilities.
**Prevention:** Implement recursive sanitization that loops until the input stabilizes (fixed point) or reaches a safety iteration limit. Always verify "known" security features against the actual codebase.
