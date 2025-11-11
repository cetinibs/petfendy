/**
 * Authentication API - Register
 * PRD Compliant: UUID user IDs, server-side validation, rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  applySecurityChecks,
  getClientIp,
  logApiRequest,
  generateUUID,
} from '@/lib/api-security';
import { validateInput, validatePassword } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    // Apply security checks
    const { error } = await applySecurityChecks(request, {
      requireAuth: false,
      operation: 'register',
    });

    if (error) {
      logApiRequest('register', null, ip, false, { reason: 'security_check_failed' });
      return error;
    }

    // Parse request body
    const body = await request.json();
    const { email, password, name, phone } = body;

    // Validate required fields
    if (!email || !password || !name) {
      logApiRequest('register', null, ip, false, { reason: 'missing_fields' });
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email
    if (!validateInput(email, 'email')) {
      logApiRequest('register', null, ip, false, { reason: 'invalid_email' });
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      logApiRequest('register', null, ip, false, { reason: 'weak_password' });
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          requirements: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && !validateInput(phone, 'phone')) {
      logApiRequest('register', null, ip, false, { reason: 'invalid_phone' });
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Generate UUID for new user (PRD Rule #4)
    const userId = generateUUID();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // In production, save to database
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // TODO: Save to database
    // await db.users.create(newUser);

    logApiRequest('register', userId, ip, true);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    logApiRequest('register', null, ip, false, { reason: 'server_error' });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
