/**
 * Server-Side Security Utilities
 * PRD Compliant: All secrets stored server-side only, NEVER exposed to client
 *
 * IMPORTANT: This file should ONLY be imported in:
 * - API routes (app/api/**)
 * - Server components
 * - Server actions
 *
 * DO NOT import in client components!
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ============================================================================
// SERVER-SIDE SECRETS (NEVER exposed to client)
// ============================================================================

// CRITICAL: These must be set in .env file, NOT using NEXT_PUBLIC_ prefix
const JWT_SECRET = process.env.JWT_SECRET || 'petfendy-jwt-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'petfendy-refresh-secret-change-in-production';

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate JWT secrets on startup
 */
export function validateJWTSecrets(): void {
  const secrets = [
    { name: 'JWT_SECRET', value: JWT_SECRET },
    { name: 'JWT_REFRESH_SECRET', value: JWT_REFRESH_SECRET },
  ];

  secrets.forEach(({ name, value }) => {
    if (!process.env[name]) {
      console.error(`❌ ERROR: ${name} not set in environment variables`);
    }

    if (value.includes('change-in-production') || value.includes('petfendy')) {
      console.warn(`⚠️  WARNING: ${name} is using a default value. Please set a strong secret in production!`);
    }

    if (value.length < 32) {
      console.warn(`⚠️  WARNING: ${name} should be at least 32 characters long`);
    }
  });
}

// ============================================================================
// JWT FUNCTIONS (Server-side only)
// ============================================================================

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
  type: 'refresh';
}

/**
 * Generate access token (24 hour expiry)
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    algorithm: 'HS256',
  });
}

/**
 * Generate refresh token (7 day expiry)
 */
export function generateRefreshToken(userId: string): string {
  const payload: RefreshTokenPayload = {
    userId,
    type: 'refresh',
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

// ============================================================================
// PASSWORD FUNCTIONS (Server-side only)
// ============================================================================

/**
 * Hash password using bcrypt (12 rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Validate password strength
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// CSRF PROTECTION (Server-side)
// ============================================================================

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token (constant-time comparison)
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  if (token.length !== storedToken.length) return false;

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(storedToken, 'hex')
  );
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export interface Session {
  userId: string;
  email: string;
  role: string;
  createdAt: Date;
  expiresAt: Date;
  ip: string;
  userAgent: string;
}

/**
 * Create session token
 */
export function createSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

// ============================================================================
// API KEY MANAGEMENT (Server-side)
// ============================================================================

/**
 * Generate API key for third-party integrations
 */
export function generateAPIKey(): string {
  const prefix = 'pk_live_';
  const key = crypto.randomBytes(32).toString('hex');
  return `${prefix}${key}`;
}

/**
 * Hash API key for storage
 */
export function hashAPIKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

/**
 * Verify API key
 */
export function verifyAPIKey(apiKey: string, hashedKey: string): boolean {
  const hash = hashAPIKey(apiKey);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashedKey));
}

// ============================================================================
// BRUTE FORCE PROTECTION
// ============================================================================

interface LoginAttempt {
  count: number;
  firstAttempt: Date;
  lastAttempt: Date;
  blocked: boolean;
  blockUntil?: Date;
}

const loginAttempts = new Map<string, LoginAttempt>();

/**
 * Record failed login attempt
 */
export function recordFailedLogin(identifier: string): {
  blocked: boolean;
  remainingAttempts?: number;
  blockUntil?: Date;
} {
  const now = new Date();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
    });
    return { blocked: false, remainingAttempts: 4 };
  }

  // Reset if 15 minutes have passed
  const minutesSinceFirst =
    (now.getTime() - attempt.firstAttempt.getTime()) / (1000 * 60);
  if (minutesSinceFirst > 15) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
    });
    return { blocked: false, remainingAttempts: 4 };
  }

  attempt.count++;
  attempt.lastAttempt = now;

  // Block after 5 failed attempts
  if (attempt.count >= 5) {
    const blockUntil = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    attempt.blocked = true;
    attempt.blockUntil = blockUntil;
    loginAttempts.set(identifier, attempt);
    return { blocked: true, blockUntil };
  }

  loginAttempts.set(identifier, attempt);
  return { blocked: false, remainingAttempts: 5 - attempt.count };
}

/**
 * Check if identifier is blocked
 */
export function isLoginBlocked(identifier: string): boolean {
  const attempt = loginAttempts.get(identifier);
  if (!attempt || !attempt.blocked) return false;

  if (attempt.blockUntil && new Date() > attempt.blockUntil) {
    loginAttempts.delete(identifier);
    return false;
  }

  return true;
}

/**
 * Clear failed login attempts (on successful login)
 */
export function clearFailedLogins(identifier: string): void {
  loginAttempts.delete(identifier);
}

// Run validation on import
validateJWTSecrets();
