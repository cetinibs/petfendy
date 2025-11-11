/**
 * API Security Utilities
 * Implements PRD security requirements for backend API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

export interface SecurityConfig {
  maxPayloadSize: number; // bytes
  maxTokens: number;
  dailyBillingLimit: number; // dollars
  monthlyBillingLimit: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface UserBudget {
  userId: string;
  dailySpent: number;
  monthlySpent: number;
  lastResetDaily: Date;
  lastResetMonthly: Date;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxPayloadSize: 200 * 1024, // 200 KB
  maxTokens: 2000,
  dailyBillingLimit: 10, // $10/day
  monthlyBillingLimit: 100, // $100/month
  rateLimit: {
    requestsPerMinute: 30,
    requestsPerHour: 1000,
  },
};

// ============================================================================
// IN-MEMORY STORES (Replace with Redis/Database in production)
// ============================================================================

const rateLimitStore = new Map<string, RateLimitEntry>();
const userBudgetStore = new Map<string, UserBudget>();
const ipRateLimitStore = new Map<string, RateLimitEntry>();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  return ip;
}

/**
 * Get user ID from request (from JWT or session)
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    // In production, verify JWT here
    // For now, extract payload (this is insecure, just for demo)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload.userId || null;
  } catch (error) {
    return null;
  }
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Check if rate limit is exceeded for a key
 * Returns true if limit is exceeded, false otherwise
 */
function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  store: Map<string, RateLimitEntry>
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    store.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= limit) {
    return true; // Rate limit exceeded
  }

  entry.count++;
  store.set(key, entry);
  return false;
}

/**
 * Check rate limits for IP and user
 * Returns error response if limit exceeded, null otherwise
 */
export function checkRateLimits(
  request: NextRequest,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): NextResponse | null {
  const ip = getClientIp(request);
  const userId = getUserIdFromRequest(request);

  // Check IP rate limit (60 req/min)
  const ipKey = `ip:${ip}`;
  if (checkRateLimit(ipKey, 60, 60 * 1000, ipRateLimitStore)) {
    return NextResponse.json(
      {
        error: 'Too many requests from this IP',
        code: 'RATE_LIMIT_IP',
      },
      { status: 429 }
    );
  }

  // Check user rate limit (30 req/min)
  if (userId) {
    const userKey = `user:${userId}`;
    if (
      checkRateLimit(
        userKey,
        config.rateLimit.requestsPerMinute,
        60 * 1000,
        rateLimitStore
      )
    ) {
      return NextResponse.json(
        {
          error: 'Too many requests from this user',
          code: 'RATE_LIMIT_USER',
        },
        { status: 429 }
      );
    }
  }

  return null;
}

// ============================================================================
// PAYLOAD SIZE LIMITING
// ============================================================================

/**
 * Check if request payload exceeds size limit
 */
export async function checkPayloadSize(
  request: NextRequest,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<NextResponse | null> {
  const contentLength = request.headers.get('content-length');

  if (contentLength && parseInt(contentLength) > config.maxPayloadSize) {
    return NextResponse.json(
      {
        error: `Payload too large. Maximum size: ${config.maxPayloadSize} bytes`,
        code: 'PAYLOAD_TOO_LARGE',
      },
      { status: 413 }
    );
  }

  return null;
}

// ============================================================================
// BILLING & COST TRACKING
// ============================================================================

/**
 * Get user budget information
 */
export function getUserBudget(userId: string): UserBudget {
  const now = new Date();
  let budget = userBudgetStore.get(userId);

  if (!budget) {
    budget = {
      userId,
      dailySpent: 0,
      monthlySpent: 0,
      lastResetDaily: now,
      lastResetMonthly: now,
    };
    userBudgetStore.set(userId, budget);
    return budget;
  }

  // Reset daily budget if needed
  const hoursSinceDaily =
    (now.getTime() - budget.lastResetDaily.getTime()) / (1000 * 60 * 60);
  if (hoursSinceDaily >= 24) {
    budget.dailySpent = 0;
    budget.lastResetDaily = now;
  }

  // Reset monthly budget if needed
  const daysSinceMonthly =
    (now.getTime() - budget.lastResetMonthly.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceMonthly >= 30) {
    budget.monthlySpent = 0;
    budget.lastResetMonthly = now;
  }

  userBudgetStore.set(userId, budget);
  return budget;
}

/**
 * Estimate cost of an operation (in dollars)
 */
export function estimateCost(operation: string, payload: any): number {
  // Example cost estimation logic
  switch (operation) {
    case 'payment':
      return 0.1; // $0.10 per payment transaction
    case 'email':
      return 0.01; // $0.01 per email
    case 'sms':
      return 0.05; // $0.05 per SMS
    case 'storage':
      const sizeKb = JSON.stringify(payload).length / 1024;
      return sizeKb * 0.0001; // $0.0001 per KB
    default:
      return 0.001; // $0.001 default
  }
}

/**
 * Check if user has sufficient budget
 * Returns error response if limit exceeded, null otherwise
 */
export function checkBillingLimit(
  userId: string,
  estimatedCost: number,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): NextResponse | null {
  const budget = getUserBudget(userId);

  // Check daily limit
  if (budget.dailySpent + estimatedCost > config.dailyBillingLimit) {
    return NextResponse.json(
      {
        error: 'Daily billing limit exceeded',
        code: 'DAILY_LIMIT_EXCEEDED',
        limit: config.dailyBillingLimit,
        spent: budget.dailySpent,
      },
      { status: 402 }
    );
  }

  // Check monthly limit
  if (budget.monthlySpent + estimatedCost > config.monthlyBillingLimit) {
    return NextResponse.json(
      {
        error: 'Monthly billing limit exceeded',
        code: 'MONTHLY_LIMIT_EXCEEDED',
        limit: config.monthlyBillingLimit,
        spent: budget.monthlySpent,
      },
      { status: 402 }
    );
  }

  return null;
}

/**
 * Reserve budget for an operation
 */
export function reserveBudget(userId: string, cost: number): void {
  const budget = getUserBudget(userId);
  budget.dailySpent += cost;
  budget.monthlySpent += cost;
  userBudgetStore.set(userId, budget);
}

/**
 * Finalize charge (adjust if actual cost differs from estimate)
 */
export function finalizeCharge(
  userId: string,
  estimatedCost: number,
  actualCost: number
): void {
  const budget = getUserBudget(userId);
  const difference = actualCost - estimatedCost;

  if (difference !== 0) {
    budget.dailySpent += difference;
    budget.monthlySpent += difference;
    userBudgetStore.set(userId, budget);
  }
}

// ============================================================================
// SECRET VALIDATION
// ============================================================================

/**
 * Validate that all required secrets are set
 */
export function validateSecrets(): void {
  const requiredSecrets = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
  ];

  const missing: string[] = [];

  for (const secret of requiredSecrets) {
    if (!process.env[secret]) {
      missing.push(secret);
    }

    // Check if using default/weak values
    const value = process.env[secret] || '';
    if (
      value.includes('change-in-production') ||
      value.includes('petfendy-secret')
    ) {
      console.warn(
        `⚠️  WARNING: ${secret} is using a default/weak value. Please update in production!`
      );
    }
  }

  if (missing.length > 0) {
    console.error(
      `❌ ERROR: Missing required environment variables: ${missing.join(', ')}`
    );
    console.error('Please create a .env.local file with these values.');
  }
}

/**
 * Get secret rotation status
 */
export function getSecretRotationStatus(): {
  lastRotated: Date | null;
  daysSinceRotation: number;
  shouldRotate: boolean;
} {
  // In production, this would check a database
  // For now, we'll use an environment variable
  const lastRotatedStr = process.env.SECRETS_LAST_ROTATED;
  const lastRotated = lastRotatedStr ? new Date(lastRotatedStr) : null;

  if (!lastRotated) {
    return {
      lastRotated: null,
      daysSinceRotation: Infinity,
      shouldRotate: true,
    };
  }

  const now = new Date();
  const daysSinceRotation =
    (now.getTime() - lastRotated.getTime()) / (1000 * 60 * 60 * 24);
  const shouldRotate = daysSinceRotation > 60; // Rotate every 60 days

  return {
    lastRotated,
    daysSinceRotation,
    shouldRotate,
  };
}

// ============================================================================
// COMBINED SECURITY MIDDLEWARE
// ============================================================================

/**
 * Apply all security checks to a request
 * Returns error response if any check fails, null otherwise
 */
export async function applySecurityChecks(
  request: NextRequest,
  options: {
    requireAuth?: boolean;
    operation?: string;
    payload?: any;
    config?: SecurityConfig;
  } = {}
): Promise<{ error: NextResponse | null; userId: string | null }> {
  const config = options.config || DEFAULT_SECURITY_CONFIG;

  // 1. Check rate limits
  const rateLimitError = checkRateLimits(request, config);
  if (rateLimitError) {
    return { error: rateLimitError, userId: null };
  }

  // 2. Check payload size
  const payloadSizeError = await checkPayloadSize(request, config);
  if (payloadSizeError) {
    return { error: payloadSizeError, userId: null };
  }

  // 3. Get and validate user ID
  const userId = getUserIdFromRequest(request);

  if (options.requireAuth && !userId) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      ),
      userId: null,
    };
  }

  if (userId && !isValidUUID(userId)) {
    return {
      error: NextResponse.json(
        { error: 'Invalid user ID format', code: 'INVALID_USER_ID' },
        { status: 400 }
      ),
      userId: null,
    };
  }

  // 4. Check billing limits if operation specified
  if (userId && options.operation && options.payload) {
    const estimatedCost = estimateCost(options.operation, options.payload);
    const billingError = checkBillingLimit(userId, estimatedCost, config);
    if (billingError) {
      return { error: billingError, userId };
    }

    // Reserve budget
    reserveBudget(userId, estimatedCost);
  }

  return { error: null, userId };
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log API request (minimal logging as per PRD)
 */
export function logApiRequest(
  action: string,
  userId: string | null,
  ip: string,
  success: boolean,
  metadata?: Record<string, any>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: userId || 'anonymous',
    ip,
    success,
    ...metadata,
  };

  // In production, send to logging service
  console.log('[API]', JSON.stringify(logEntry));
}
