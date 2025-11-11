/**
 * Authentication API - Login
 * PRD Compliant: Server-side authentication, rate limiting, no secrets in client
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  applySecurityChecks,
  getClientIp,
  logApiRequest,
  generateUUID,
} from '@/lib/api-security';
import { validateInput } from '@/lib/security';

// Server-side secrets (NOT exposed to client)
const JWT_SECRET = process.env.JWT_SECRET || 'petfendy-jwt-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'petfendy-refresh-secret-change-in-production';

// Mock user database (replace with real database)
// In production, this would be PostgreSQL/MongoDB
const MOCK_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000', // UUID format
    email: 'admin@petfendy.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYFJZ8p8Vpe', // password: admin123
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    email: 'user@example.com',
    password: '$2a$12$Zl5L5z5Z5Z5Z5Z5Z5Z5Z5eYN8/LewY5GyYFJZ8p8Vpe', // password: user123
    name: 'Regular User',
    role: 'user',
  },
];

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    // Apply security checks
    const { error } = await applySecurityChecks(request, {
      requireAuth: false,
      operation: 'login',
    });

    if (error) {
      logApiRequest('login', null, ip, false, { reason: 'security_check_failed' });
      return error;
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      logApiRequest('login', null, ip, false, { reason: 'missing_credentials' });
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateInput(email, 'email')) {
      logApiRequest('login', null, ip, false, { reason: 'invalid_email' });
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user (in production, query database)
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      logApiRequest('login', null, ip, false, { reason: 'user_not_found' });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      logApiRequest('login', user.id, ip, false, { reason: 'invalid_password' });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: 'refresh',
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    logApiRequest('login', user.id, ip, true);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    logApiRequest('login', null, ip, false, { reason: 'server_error' });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
