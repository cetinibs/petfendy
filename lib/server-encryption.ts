/**
 * Server-Side Encryption Utilities
 * PRD Compliant: Encryption keys stored server-side only, NEVER exposed to client
 *
 * IMPORTANT: This file should ONLY be imported in:
 * - API routes (app/api/**)
 * - Server components
 * - Server actions
 *
 * DO NOT import in client components!
 */

import CryptoJS from 'crypto-js';
import crypto from 'crypto';

// ============================================================================
// SERVER-SIDE SECRETS (NEVER exposed to client)
// ============================================================================

// CRITICAL: These must be set in .env file, NOT using NEXT_PUBLIC_ prefix
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'petfendy-secret-key-change-in-production-2025';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate encryption key on startup
 */
export function validateEncryptionKey(): void {
  if (!process.env.ENCRYPTION_KEY) {
    console.error('❌ ERROR: ENCRYPTION_KEY not set in environment variables');
  }

  if (ENCRYPTION_KEY.includes('change-in-production') || ENCRYPTION_KEY.includes('petfendy-secret')) {
    console.warn('⚠️  WARNING: Using default encryption key. Please set a strong key in production!');
  }

  if (ENCRYPTION_KEY.length < 32) {
    console.warn('⚠️  WARNING: Encryption key should be at least 32 characters long');
  }
}

// ============================================================================
// ENCRYPTION FUNCTIONS (Server-side only)
// ============================================================================

/**
 * Encrypt sensitive data using AES-256-GCM (Node.js crypto module)
 * More secure than CryptoJS for server-side operations
 */
export function encryptData(data: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Data encryption failed');
  }
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Data decryption failed');
  }
}

/**
 * Encrypt data using CryptoJS (legacy compatibility)
 * Use encryptData() for new code
 */
export function encryptDataLegacy(data: string): string {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Legacy encryption error:', error);
    throw new Error('Data encryption failed');
  }
}

/**
 * Decrypt data using CryptoJS (legacy compatibility)
 */
export function decryptDataLegacy(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Legacy decryption error:', error);
    throw new Error('Data decryption failed');
  }
}

// ============================================================================
// HASHING & TOKENS
// ============================================================================

/**
 * Hash sensitive data using SHA-256 (one-way)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure payment nonce
 * Used for one-time payment processing
 */
export function generatePaymentNonce(): string {
  const timestamp = Date.now();
  const random = generateSecureToken(16);
  return hashData(`${timestamp}-${random}`);
}

// ============================================================================
// CARD TOKENIZATION (Server-side only)
// ============================================================================

/**
 * Tokenize card data for secure storage
 * Returns a token instead of actual card data
 *
 * IMPORTANT: In production, use payment provider's tokenization API
 */
export function tokenizeCard(cardNumber: string): string {
  const last4 = cardNumber.slice(-4);
  const token = generateSecureToken(24);
  return `tok_${token}_${last4}`;
}

/**
 * Encrypt card data for temporary storage during payment flow
 * Card data should NEVER be stored permanently!
 */
export function encryptCardData(cardData: {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}): string {
  const jsonData = JSON.stringify(cardData);
  return encryptData(jsonData);
}

/**
 * Decrypt card data (temporary use only)
 */
export function decryptCardData(encryptedData: string): {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
} {
  const decrypted = decryptData(encryptedData);
  return JSON.parse(decrypted);
}

// ============================================================================
// PCI DSS COMPLIANCE
// ============================================================================

/**
 * Sanitize data before storage (remove sensitive fields)
 */
export function sanitizeForStorage(data: any): any {
  const sanitized = { ...data };

  const sensitiveFields = [
    'cardNumber',
    'cvv',
    'securityCode',
    'pin',
    'password',
    'passwordHash',
    'verificationCode',
  ];

  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  return sanitized;
}

/**
 * Check if data contains potentially sensitive information
 */
export function containsSensitiveData(data: any): boolean {
  const dataStr = JSON.stringify(data).toLowerCase();

  const patterns = [
    /\b\d{13,19}\b/, // Credit card numbers
    /\b\d{3,4}\b.*cvv/i, // CVV codes
    /password/i,
    /secret/i,
    /api[_-]?key/i,
  ];

  return patterns.some((pattern) => pattern.test(dataStr));
}

// Run validation on import
validateEncryptionKey();
