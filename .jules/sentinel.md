## 2025-05-23 - Recursive Sanitization Bypass
**Vulnerability:** The regex-based `sanitizeInput` function was vulnerable to nested pattern attacks. For example, `javascripjavascript:t:` would be sanitized to `javascript:`, bypassing the filter.
**Learning:** Single-pass regex replacements are insufficient for security sanitization because removing a pattern can create a new instance of that pattern from the surrounding text.
**Prevention:** Use recursive sanitization (loop until no changes) or, preferably, use an allow-list based parser (like DOMPurify) instead of a deny-list based regex. In this case, we implemented a bounded recursive loop to fix the immediate issue without adding dependencies.
