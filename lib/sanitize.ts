import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Uses isomorphic-dompurify which works on both client and server.
 *
 * @param html - The dirty HTML string
 * @returns The sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Default configuration allows common tags but strips scripts, iframes (unless configured), etc.
  // We can customize the config if needed, e.g. allowing specific attributes or tags.
  // For now, the default profile is secure and sufficient for blog content.
  return DOMPurify.sanitize(html);
}
