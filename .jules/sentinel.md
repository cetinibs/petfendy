## 2024-05-23 - Stored XSS in CMS Components
**Vulnerability:** Found `dangerouslySetInnerHTML` used directly with content from `localStorage` in blog and about pages. Since `localStorage` can be modified by admin (or theoretically by XSS elsewhere), this was a Stored XSS vulnerability.
**Learning:** React's `dangerouslySetInnerHTML` is aptly named. Even in "internal" or "admin-controlled" data, we should never trust the content if it's rendered as HTML. The existing `sanitizeInput` was insufficient as it stripped all HTML, which breaks rich text.
**Prevention:** Always use a dedicated HTML sanitizer library (like `dompurify`) when rendering HTML content. I introduced `lib/sanitize-html.ts` to handle this safely while preserving safe formatting.
