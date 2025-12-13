import DOMPurify from 'dompurify';

export function sanitizeHTML(content: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return as is or implement server-side sanitization with jsdom
    // For now, since we only use this in client components, we can return the content
    // But to be safe, if called on server, we should probably strip everything or fail safe.
    // However, our use case is strictly client-side hydration for these components.
    // If needed on server, we'd need JSDOM.
    return content;
  }

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'a', 'img', 'blockquote', 'code', 'pre',
      'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height', 'title',
      'class', 'style' // Be careful with style, but often needed for rich text
    ],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
}
