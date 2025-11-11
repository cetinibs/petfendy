/**
 * Email Proxy API
 * PRD Compliant: Server-side email sending, no API keys in client
 *
 * Flow: Client → Backend → Email Provider (never Client → Provider directly)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  applySecurityChecks,
  getClientIp,
  logApiRequest,
  estimateCost,
  finalizeCharge,
} from '@/lib/api-security';

// Server-side email credentials (NEVER exposed to client)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'mock_sendgrid_key';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@petfendy.com';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const body: EmailRequest = await request.json();

    // Apply security checks
    const { error, userId } = await applySecurityChecks(request, {
      requireAuth: true,
      operation: 'email',
      payload: body,
    });

    if (error) {
      logApiRequest('email_send', userId, ip, false, {
        reason: 'security_check_failed',
      });
      return error;
    }

    // Validate email request
    const validationError = validateEmailRequest(body);
    if (validationError) {
      logApiRequest('email_send', userId, ip, false, {
        reason: 'invalid_request',
      });
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Estimate cost
    const estimatedCost = estimateCost('email', body);

    // Send email through provider
    const emailResult = await sendEmailWithProvider(body);

    if (!emailResult.success) {
      // Refund reserved budget
      finalizeCharge(userId!, estimatedCost, 0);

      logApiRequest('email_send', userId, ip, false, {
        reason: 'email_failed',
        providerError: emailResult.error,
      });

      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Email sending failed',
        },
        { status: 500 }
      );
    }

    // Finalize charge
    finalizeCharge(userId!, estimatedCost, estimatedCost);

    logApiRequest('email_send', userId, ip, true, {
      to: body.to,
      messageId: emailResult.messageId,
    });

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    logApiRequest('email_send', null, ip, false, { reason: 'server_error' });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate email request
 */
function validateEmailRequest(body: EmailRequest): string | null {
  if (!body.to) {
    return 'Recipient email is required';
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.to)) {
    return 'Invalid recipient email';
  }

  if (!body.subject) {
    return 'Subject is required';
  }

  if (!body.html && !body.text && !body.templateId) {
    return 'Email content is required (html, text, or templateId)';
  }

  return null;
}

/**
 * Send email with external provider (server-side only)
 */
async function sendEmailWithProvider(
  emailData: EmailRequest
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  // Mock implementation for development
  if (process.env.NODE_ENV === 'production' && SENDGRID_API_KEY.includes('mock')) {
    console.warn('⚠️  Production email service not configured');
  }

  // Mock: Simulate sending
  await new Promise((resolve) => setTimeout(resolve, 500));

  const messageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log('[EMAIL] Sending email:', {
    to: emailData.to,
    subject: emailData.subject,
    messageId,
  });

  return {
    success: true,
    messageId,
  };

  /* PRODUCTION CODE (uncomment when ready):

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
            ...(emailData.templateData && { dynamic_template_data: emailData.templateData }),
          },
        ],
        from: { email: EMAIL_FROM },
        subject: emailData.subject,
        content: [
          {
            type: 'text/html',
            value: emailData.html || emailData.text || '',
          },
        ],
        ...(emailData.templateId && { template_id: emailData.templateId }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.errors?.[0]?.message || 'Email sending failed',
      };
    }

    const messageId = response.headers.get('x-message-id') || undefined;

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error('Email provider error:', error);
    return {
      success: false,
      error: 'Email provider unavailable',
    };
  }
  */
}
