/**
 * Payment Proxy API
 * PRD Compliant: All payment processing server-side, billing limits, no client secrets
 *
 * Flow: Client → Backend → Payment Provider (never Client → Provider directly)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  applySecurityChecks,
  getClientIp,
  logApiRequest,
  estimateCost,
  reserveBudget,
  finalizeCharge,
} from '@/lib/api-security';

// Server-side payment credentials (NEVER exposed to client)
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY || 'mock_payment_key';
const PAYMENT_MERCHANT_ID = process.env.PAYMENT_MERCHANT_ID || 'mock_merchant_123';
const PAYMENT_API_URL = process.env.PAYMENT_API_URL || 'https://api.payment-gateway.com';

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  // Card data should be tokenized by payment provider's SDK (not raw card numbers)
  paymentToken: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    // Parse request body first to get payload for security checks
    const body: PaymentRequest = await request.json();

    // Apply comprehensive security checks
    const { error, userId } = await applySecurityChecks(request, {
      requireAuth: true, // Payment requires authentication
      operation: 'payment',
      payload: body,
    });

    if (error) {
      logApiRequest('payment_process', userId, ip, false, {
        reason: 'security_check_failed',
      });
      return error;
    }

    // Validate payment request
    const validationError = validatePaymentRequest(body);
    if (validationError) {
      logApiRequest('payment_process', userId, ip, false, {
        reason: 'invalid_request',
      });
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Estimate cost (for billing limits)
    const estimatedCost = estimateCost('payment', body);

    // Process payment through provider (server-side only)
    const paymentResult = await processPaymentWithProvider(body);

    if (!paymentResult.success) {
      // Refund reserved budget since payment failed
      finalizeCharge(userId!, estimatedCost, 0);

      logApiRequest('payment_process', userId, ip, false, {
        reason: 'payment_failed',
        providerError: paymentResult.error,
      });

      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || 'Payment processing failed',
          code: paymentResult.code,
        },
        { status: 400 }
      );
    }

    // Finalize actual charge
    const actualCost = estimatedCost; // In production, get from provider
    finalizeCharge(userId!, estimatedCost, actualCost);

    logApiRequest('payment_process', userId, ip, true, {
      amount: body.amount,
      currency: body.currency,
      transactionId: paymentResult.transactionId,
    });

    return NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      amount: body.amount,
      currency: body.currency,
      status: 'completed',
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    logApiRequest('payment_process', null, ip, false, {
      reason: 'server_error',
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate payment request
 */
function validatePaymentRequest(body: PaymentRequest): string | null {
  if (!body.amount || body.amount <= 0) {
    return 'Invalid amount';
  }

  if (body.amount > 100000) {
    // Max $100k per transaction
    return 'Amount exceeds maximum allowed';
  }

  if (!body.currency || !['TRY', 'USD', 'EUR'].includes(body.currency)) {
    return 'Invalid currency';
  }

  if (!body.paymentToken) {
    return 'Payment token is required';
  }

  if (!body.customerEmail || !body.customerName) {
    return 'Customer information is required';
  }

  return null;
}

/**
 * Process payment with external provider (server-side only)
 * This is where the actual API call to payment gateway happens
 *
 * IMPORTANT: API keys are stored server-side only, never exposed to client
 */
async function processPaymentWithProvider(
  paymentData: PaymentRequest
): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
  code?: string;
}> {
  // Mock implementation for development
  // In production, replace with actual payment gateway API call

  if (process.env.NODE_ENV === 'production' && PAYMENT_API_KEY.includes('mock')) {
    throw new Error('Production payment gateway not configured');
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock: Simulate 5% failure rate for testing
  const shouldFail = Math.random() < 0.05;

  if (shouldFail) {
    return {
      success: false,
      error: 'Payment declined by bank',
      code: 'PAYMENT_DECLINED',
    };
  }

  // Mock success
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    transactionId,
  };

  /* PRODUCTION CODE (uncomment when ready):

  try {
    const response = await fetch(`${PAYMENT_API_URL}/v1/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYMENT_API_KEY}`,
        'X-Merchant-ID': PAYMENT_MERCHANT_ID,
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        payment_token: paymentData.paymentToken,
        customer: {
          email: paymentData.customerEmail,
          name: paymentData.customerName,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Payment failed',
        code: errorData.code || 'PAYMENT_ERROR',
      };
    }

    const result = await response.json();

    return {
      success: true,
      transactionId: result.transaction_id,
    };
  } catch (error) {
    console.error('Payment provider error:', error);
    return {
      success: false,
      error: 'Payment provider unavailable',
      code: 'PROVIDER_ERROR',
    };
  }
  */
}
