
import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from './sanitize';

describe('sanitizeHtml', () => {
  it('should return empty string for null/undefined/empty input', () => {
    expect(sanitizeHtml('')).toBe('');
    // @ts-ignore
    expect(sanitizeHtml(null)).toBe('');
    // @ts-ignore
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('should allow safe tags', () => {
    const html = '<p>Hello <strong>World</strong></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should strip script tags', () => {
    const html = '<div><script>alert("xss")</script>Safe</div>';
    expect(sanitizeHtml(html)).toBe('<div>Safe</div>');
  });

  it('should strip onclick attributes', () => {
    const html = '<button onclick="alert(\'xss\')">Click me</button>';
    expect(sanitizeHtml(html)).toBe('<button>Click me</button>');
  });

  it('should strip javascript: URIs', () => {
    const html = '<a href="javascript:alert(\'xss\')">Link</a>';
    expect(sanitizeHtml(html)).toBe('<a>Link</a>');
  });

  it('should handle nested malicious tags', () => {
    const html = '<<script>script>alert("xss")</<script>script>';
    const sanitized = sanitizeHtml(html);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert("xss")');
  });
});
