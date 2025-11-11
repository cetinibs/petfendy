// Advanced Encryption Service for Sensitive Data
// PCI DSS Compliant - DO NOT store actual card data in production!

import CryptoJS from 'crypto-js';

/**
 * IMPORTANT: This file contains CLIENT-SIDE utilities only.
 * Encryption/decryption functions have been moved to lib/server-encryption.ts
 *
 * PRD Compliance: No encryption keys exposed to client
 *
 * For server-side encryption, import from '@/lib/server-encryption'
 */

// ============================================================================
// REMOVED FOR SECURITY: encryptData() and decryptData()
// These functions are now server-side only in lib/server-encryption.ts
// ============================================================================

/**
 * Mask card number for display (show only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return '****';
  return `**** **** **** ${cleaned.slice(-4)}`;
}

/**
 * Hash sensitive data using SHA-256 (one-way)
 */
export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return CryptoJS.lib.WordArray.random(length).toString();
}

/**
 * Validate and sanitize card number
 * Uses Luhn algorithm for validation
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Check if it's only digits
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Tokenize card data for secure storage
 * Returns a token instead of actual card data
 */
export function tokenizeCard(cardNumber: string): string {
  // In production, this would call a payment gateway API
  // For now, we generate a secure token
  const last4 = cardNumber.slice(-4);
  const token = generateSecureToken(24);
  return `tok_${token}_${last4}`;
}

/**
 * Sanitize and validate CVV
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

/**
 * PCI DSS: Card data should NEVER be stored
 * This function ensures we don't accidentally store card data
 */
export function sanitizeForStorage(data: any): any {
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = [
    'cardNumber',
    'cvv',
    'securityCode',
    'pin',
    'password',
    'passwordHash', // Don't send hash to client
    'verificationCode'
  ];
  
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });
  
  return sanitized;
}

/**
 * Generate a secure payment nonce
 * Used for one-time payment processing
 */
export function generatePaymentNonce(): string {
  const timestamp = Date.now();
  const random = generateSecureToken(16);
  const combined = `${timestamp}-${random}`;
  return CryptoJS.SHA256(combined).toString();
}

