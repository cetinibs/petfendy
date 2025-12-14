## 2025-02-18 - [CRITICAL] Stored XSS via dangerouslySetInnerHTML
**Vulnerability:** Found `dangerouslySetInnerHTML` usage in `app/[locale]/blog/[slug]/page.tsx` and `app/[locale]/hakkimda/page.tsx` rendering content from `localStorage` without proper sanitization. The existing `sanitizeInput` function stripped all HTML tags, making it unsuitable for rich text content, which likely led to it being skipped.
**Learning:** Generic sanitizers that strip all tags are dangerous because developers will bypass them when they need rich text.
**Prevention:** Implemented `sanitizeHTML` using `isomorphic-dompurify` to allow safe HTML tags while stripping scripts. Updated vulnerable components to use this new sanitizer. Added `jsdom` to dev dependencies to support build-time environment needs.
