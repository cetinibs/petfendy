# Security Quick Start Guide

**⚡ 5-Minute Setup for Developers**

---

## 🚀 Quick Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd petfendy
npm install
```

### 2. Configure Secrets
```bash
# Copy environment template
cp .env.example .env.local

# Generate strong secrets (macOS/Linux)
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env.local
echo "JWT_REFRESH_SECRET=$(openssl rand -hex 32)" >> .env.local
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env.local
echo "SECRETS_LAST_ROTATED=$(date +%Y-%m-%d)" >> .env.local

# Windows (PowerShell)
# Generate manually and add to .env.local
```

### 3. Run Security Check
```bash
npm run scan-secrets
# Should output: ✅ No secrets detected!
```

### 4. Start Development
```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 🔒 Security Rules (Must Follow!)

### ❌ NEVER DO THIS:
```typescript
// ❌ DON'T: Expose secrets with NEXT_PUBLIC_
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ❌ DON'T: Call external APIs directly from client
fetch('https://payment-gateway.com/charge', {
  headers: { 'API-Key': API_KEY }
});

// ❌ DON'T: Use sequential IDs
const userId = 1, 2, 3, 4...

// ❌ DON'T: Hardcode secrets
const SECRET = 'my-secret-key-123';
```

### ✅ ALWAYS DO THIS:
```typescript
// ✅ DO: Server-side secrets only (no NEXT_PUBLIC_)
// In API routes only:
const API_KEY = process.env.API_KEY;

// ✅ DO: Call backend API from client
fetch('/api/payment/process', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${userToken}` },
  body: JSON.stringify(paymentData)
});

// ✅ DO: Use UUIDs for user IDs
import { generateUUID } from '@/lib/api-security';
const userId = generateUUID(); // 550e8400-e29b-41d4-a716-446655440000

// ✅ DO: Use environment variables
const SECRET = process.env.JWT_SECRET;
```

---

## 📁 File Structure

```
petfendy/
├── app/api/              # 🔒 Server-side API routes (SECURE)
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── register/route.ts
│   ├── payment/
│   │   └── process/route.ts
│   └── email/
│       └── send/route.ts
│
├── lib/
│   ├── api-security.ts         # 🔒 Server: Rate limiting, billing
│   ├── server-encryption.ts    # 🔒 Server: Encryption functions
│   ├── server-security.ts      # 🔒 Server: JWT, passwords
│   ├── encryption.ts           # 🌐 Client: Validation only
│   └── security.ts             # 🌐 Client: Input sanitization
│
├── scripts/
│   └── scan-secrets.js    # Secret scanner
│
├── .env.example           # Template (safe to commit)
├── .env.local             # Your secrets (NEVER commit!)
└── .gitignore             # .env* is gitignored
```

---

## 🛠️ Common Tasks

### Adding a New API Route

```typescript
// app/api/my-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { applySecurityChecks, logApiRequest, getClientIp } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // 1. Apply security checks
  const { error, userId } = await applySecurityChecks(request, {
    requireAuth: true,        // Require user login
    operation: 'my-feature',  // For billing
    payload: await request.json(),
  });

  if (error) {
    logApiRequest('my-feature', userId, ip, false);
    return error; // Returns 429, 402, 413, or 401
  }

  // 2. Your business logic here
  try {
    const result = doSomething();

    logApiRequest('my-feature', userId, ip, true);
    return NextResponse.json({ success: true, result });

  } catch (err) {
    logApiRequest('my-feature', userId, ip, false);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Using Server-Side Encryption

```typescript
// In API routes only!
import { encryptData, decryptData } from '@/lib/server-encryption';

const encrypted = encryptData('sensitive data');
// Store encrypted data...

const decrypted = decryptData(encrypted);
// Use decrypted data...
```

### Generating UUIDs

```typescript
import { generateUUID, isValidUUID } from '@/lib/api-security';

// Generate
const userId = generateUUID();
// 550e8400-e29b-41d4-a716-446655440000

// Validate
if (!isValidUUID(userId)) {
  return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
}
```

---

## 🧪 Testing Security

### Test Secret Scanner
```bash
# Should pass
npm run scan-secrets

# To test failure, add a fake secret:
echo "const API_KEY = 'real-api-key-value-here-at-least-20-chars';" >> test.js
npm run scan-secrets
# Should fail with HIGH finding (Generic API Key detected)
rm test.js
```

### Test Rate Limiting
```bash
# Make 100 requests in 1 minute
for i in {1..100}; do
  curl http://localhost:3000/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}' &
done

# Should get 429 errors after 60 requests
```

### Test Billing Limits
```typescript
// In API route
import { getUserBudget } from '@/lib/api-security';

const budget = getUserBudget(userId);
console.log(budget);
// { dailySpent: 3.50, monthlySpent: 45.20, ... }
```

---

## 🐛 Troubleshooting

### Error: "Secrets detected in codebase"
```bash
# Run scanner to see findings
npm run scan-secrets

# Fix: Remove hardcoded secrets, use .env instead
```

### Error: "Rate limit exceeded"
```bash
# Wait 1 minute, or clear rate limits (dev only):
# Restart dev server: Ctrl+C, npm run dev
```

### Error: "Daily billing limit exceeded"
```bash
# Wait until daily reset (24 hours), or increase limit:
# In .env.local:
DAILY_BILLING_LIMIT=100
```

### Error: "Payload too large"
```bash
# Reduce request size, or increase limit:
# In lib/api-security.ts:
maxPayloadSize: 500 * 1024, // 500 KB
```

---

## 📋 Pre-Deployment Checklist

```bash
# 1. Run security scan
npm run scan-secrets

# 2. Check for weak secrets
grep -r "change-in-production" .env.local
# Should return nothing

# 3. Verify .env.local is gitignored
git status
# .env.local should NOT appear

# 4. Build test
npm run build
# Should succeed

# 5. Set production secrets in hosting dashboard
# Vercel: Project Settings > Environment Variables
```

---

## 🆘 Getting Help

**Full Documentation:**
- `/SECURITY-PRD-IMPLEMENTATION.md` - Complete implementation guide
- `/.env.example` - All environment variables
- `/HANDOVER.md` - Full project documentation

**Common Questions:**

**Q: Can I use `NEXT_PUBLIC_` for API keys?**
A: ❌ NO! Never use `NEXT_PUBLIC_` for secrets. It exposes them to the browser.

**Q: Where do I call external APIs?**
A: ✅ Only in `/app/api/**/route.ts` files (server-side).

**Q: How do I rotate secrets?**
A: Generate new ones with `openssl rand -hex 32`, update `.env.local`, restart app.

**Q: What if I accidentally commit a secret?**
A: 1) Revoke it immediately, 2) Generate new one, 3) Use `git-filter-repo` to remove from history.

---

**Quick Reference Card:**

| Task | Command |
|------|---------|
| Setup | `cp .env.example .env.local` |
| Generate secret | `openssl rand -hex 32` |
| Scan secrets | `npm run scan-secrets` |
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Test API | `curl http://localhost:3000/api/...` |

---

**Security Contact:** security@petfendy.com

**Version:** 1.0 | **Date:** November 11, 2025
