# Vercel Deployment Guide - Petfendy

## Quick Start

1. **Environment Variables**: Add these to your Vercel project settings:
   - Go to: https://vercel.com/cetinibs/petfendy/settings/environment-variables
   - Copy variables from `.env.example`
   - Add each variable with your production values

## Required Environment Variables

### Authentication (Required)
```bash
JWT_SECRET=your-secure-random-string-here
JWT_REFRESH_SECRET=your-secure-random-string-here
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key-here
```

### Email Service (Optional - for notifications)
```bash
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Payment Gateway (Optional - for payment processing)
```bash
PAYMENT_API_KEY=your-payment-api-key
PAYMENT_MERCHANT_ID=your-merchant-id
PAYMENT_GATEWAY_SECRET=your-gateway-secret
MERCHANT_ID=your-merchant-id
```

## Deployment Settings

Already configured in `vercel.json`:
- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Install Command: `npm install`
- ✅ Security Headers
- ✅ i18n Rewrites (Turkish/English)
- ✅ Region: Frankfurt (arn1)

## Post-Deployment Checklist

- [ ] Add environment variables in Vercel dashboard
- [ ] Test authentication flow
- [ ] Test reservation booking
- [ ] Test admin panel access
- [ ] Verify email notifications (if configured)
- [ ] Test payment integration (if configured)

## Domains

Add your custom domain:
1. Go to: https://vercel.com/cetinibs/petfendy/settings/domains
2. Add your domain (e.g., petfendy.com)
3. Follow DNS configuration instructions

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project Issues: Check HANDOVER.md for technical details
