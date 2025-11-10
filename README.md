<div align="center">

# 🐾 Petfendy

### Ankara'nın Modern Evcil Hayvan Oteli ve Köpek Eğitim Merkezi

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

![Petfendy Banner](public/petfendy-logo.svg)

**[Demo](https://petfendy.com)** • **[Dökümanlar](#-kurulum)** • **[Güvenlik](#-güvenlik)** • **[Katkıda Bulun](#-katkıda-bulunma)**

</div>

---

## 📋 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Demo](#-demo)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Güvenlik](#-güvenlik)
- [API Referansı](#-api-referansı)
- [Deployment](#-deployment)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

---

## 🎯 Hakkında

**Petfendy**, Ankara'da evcil hayvan sahiplerine güvenli, konforlu ve profesyonel hizmet sunan modern bir dijital platformdur. Pet oteli rezervasyonundan hayvan taksi hizmetine, kullanıcı yönetiminden güvenli ödeme sistemine kadar tam özellikli bir çözüm sunar.

### ✨ Neden Petfendy?

- 🏆 **Enterprise-Grade Güvenlik** - PCI DSS uyumlu ödeme sistemi
- 🌍 **Çok Dilli** - Türkçe ve İngilizce tam destek
- 📱 **Responsive Design** - Tüm cihazlarda mükemmel deneyim
- ⚡ **Blazing Fast** - Next.js 16 ile optimize edilmiş performans
- 🎨 **Modern UI/UX** - Shadcn/ui ve Tailwind CSS ile tasarlandı
- 🔒 **OWASP Top 10 Korumalı** - Kurumsal güvenlik standartları

---

## 🚀 Özellikler

### 🏨 Pet Otel Rezervasyon Sistemi

<table>
  <tr>
    <td width="50%">
      <h4>✅ Dinamik Oda Yönetimi</h4>
      <ul>
        <li>Standart, Deluxe, Suite oda seçenekleri</li>
        <li>Gerçek zamanlı müsaitlik kontrolü</li>
        <li>Fotoğraf galerisi ve detaylı açıklamalar</li>
      </ul>
    </td>
    <td width="50%">
      <h4>✅ Akıllı Fiyatlandırma</h4>
      <ul>
        <li>Gece sayısına göre otomatik hesaplama</li>
        <li>Sezon ve kampanya desteği</li>
        <li>Şeffaf fiyat dökümü</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>✅ Özelleştirilebilir Hizmetler</h4>
      <ul>
        <li>Özel beslenme planları</li>
        <li>İlaç ve vitamin takibi</li>
        <li>Oyuncak ve ekipman tercihleri</li>
      </ul>
    </td>
    <td>
      <h4>✅ Otomatik Bildirimler</h4>
      <ul>
        <li>E-posta ile rezervasyon onayı</li>
        <li>SMS hatırlatıcılar</li>
        <li>Check-in/Check-out bildirimleri</li>
      </ul>
    </td>
  </tr>
</table>

### 🚕 Hayvan Taksi Servisi

- **Şehir İçi & Şehirler Arası** - Mesafe bazlı dinamik fiyatlandırma
- **Gidiş-Dönüş Seçeneği** - Uygun fiyatlı paket hizmet
- **Güvenli Taşıma** - Profesyonel şoförler ve özel ekipman
- **Canlı Takip** - GPS ile anlık konum paylaşımı
- **Acil Durum Desteği** - 7/24 veteriner koordinasyonu

### 👥 Gelişmiş Kullanıcı Yönetimi

```
┌─────────────────────────────────────────────┐
│  Kullanıcı Özellikleri                      │
├─────────────────────────────────────────────┤
│  ✅ E-posta doğrulama (6 haneli kod)       │
│  ✅ Güvenli şifre sıfırlama                │
│  ✅ Profil ve hayvan yönetimi              │
│  ✅ Rezervasyon geçmişi                    │
│  ✅ Favori oda ve hizmetler                │
│  ✅ Misafir checkout (üye olmadan)         │
└─────────────────────────────────────────────┘
```

### 💳 Güvenli Ödeme Altyapısı

| Özellik | Açıklama |
|---------|----------|
| 🔐 **PCI DSS Level 1** | Kart bilgileri asla saklanmaz veya loglanmaz |
| 🛡️ **AES-256 Encryption** | Tüm hassas veriler için uçtan uca şifreleme |
| 🎫 **Token Sistemi** | Güvenli kart referansları ve tek kullanımlık tokenler |
| ✓ **Luhn Algorithm** | Kart numarası doğrulama ve fraud önleme |
| 🔄 **3D Secure** | Banka doğrulama desteği |
| 📊 **Fraud Detection** | Gerçek zamanlı şüpheli işlem tespiti |

### 🔒 Enterprise-Grade Güvenlik

```typescript
Security Features:
├── Authentication
│   ├── JWT Access & Refresh Tokens
│   ├── Bcrypt (12 rounds salt)
│   └── Session Management
├── Authorization
│   ├── Role-Based Access Control (RBAC)
│   ├── Resource-Level Permissions
│   └── API Key Management
├── Protection
│   ├── Rate Limiting (100 req/15min)
│   ├── DDoS Mitigation
│   ├── SQL Injection Prevention
│   ├── XSS Protection
│   ├── CSRF Tokens
│   └── Clickjacking Defense
└── Monitoring
    ├── Secure Logging (PII redaction)
    ├── Audit Trail
    └── Real-time Alerts
```

### 🎨 Admin Panel

- 📊 **Dashboard & Analytics** - Gerçek zamanlı istatistikler ve grafikler
- 📝 **Rezervasyon Yönetimi** - Onay, iptal, düzenleme
- 👨‍💼 **Kullanıcı Yönetimi** - CRUD operasyonları ve roller
- 💰 **Finansal Raporlar** - Gelir, gider, kar analizi
- 🐕 **Pet Profilleri** - Sağlık kayıtları ve notlar
- 📧 **İletişim Merkezi** - Email ve SMS şablonları
- ⚙️ **Sistem Ayarları** - Fiyat, kapasite, servis konfigürasyonu

---

## 📸 Demo

<div align="center">

### Ana Sayfa
![Ana Sayfa](https://via.placeholder.com/800x400/667eea/ffffff?text=Petfendy+Ana+Sayfa)

### Rezervasyon Süreci
![Rezervasyon](https://via.placeholder.com/800x400/764ba2/ffffff?text=Rezervasyon+Formu)

### Admin Panel
![Admin Panel](https://via.placeholder.com/800x400/f093fb/ffffff?text=Admin+Dashboard)

</div>

---

## 🛠️ Teknoloji Yığını

### Frontend

```
┌──────────────────────────────────────┐
│  Core Framework                      │
├──────────────────────────────────────┤
│  Next.js 16           React 19       │
│  TypeScript 5         Server Actions │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  UI & Styling                        │
├──────────────────────────────────────┤
│  Tailwind CSS 4       Shadcn/ui      │
│  Radix UI             Lucide Icons   │
│  Vaul (Drawer)        Sonner (Toast) │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Forms & Validation                  │
├──────────────────────────────────────┤
│  React Hook Form      Zod Schema     │
│  Input-OTP            Date-fns       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Data Visualization                  │
├──────────────────────────────────────┤
│  Recharts             jsPDF          │
│  XLSX Export          AutoTable      │
└──────────────────────────────────────┘
```

### Backend & Security

```
┌──────────────────────────────────────┐
│  Authentication & Authorization      │
├──────────────────────────────────────┤
│  JWT (jsonwebtoken)                  │
│  Bcrypt.js (12 rounds)               │
│  Secure Session Management           │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Encryption & Security               │
├──────────────────────────────────────┤
│  AES-256 (crypto-js)                 │
│  Node.js Crypto (native)             │
│  Security Headers                    │
│  Rate Limiting                       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Storage & Data (Dev)                │
├──────────────────────────────────────┤
│  LocalStorage (Mock)                 │
│  Production: PostgreSQL + Redis      │
└──────────────────────────────────────┘
```

### Internationalization

- **next-intl** - Çok dilli destek
- **Locale Routing** - `/tr`, `/en` URL yapısı
- **Dynamic Messages** - JSON tabanlı çeviri sistemi

### DevOps & Monitoring

- **Vercel Analytics** - Performans ve kullanıcı analitiği
- **GitHub Actions** - CI/CD pipeline (önerilir)
- **Sentry** - Hata izleme (integration hazır)

---

## 📦 Kurulum

### Gereksinimler

- **Node.js** 18.x veya üzeri
- **npm** 9.x veya **pnpm** 8.x
- **Git** versiyon kontrol

### Hızlı Başlangıç

```bash
# 1. Repository'yi klonlayın
git clone https://github.com/cetinibs/petfendy.git
cd petfendy

# 2. Bağımlılıkları yükleyin
npm install --legacy-peer-deps
# veya
pnpm install

# 3. Environment variables kopyalayın
cp .env.example .env.local

# 4. Geliştirme sunucusunu başlatın
npm run dev

# 5. Tarayıcıda açın
# http://localhost:3000
```

### Environment Variables

`.env.local` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

```bash
# ============================================
# JWT Authentication
# ============================================
# Üretim için: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# Encryption
# ============================================
# AES-256 için 32 karakter
NEXT_PUBLIC_ENCRYPTION_KEY=your-32-character-encryption-key-here

# ============================================
# Payment Gateway
# ============================================
# İyzico için
PAYMENT_PROVIDER=iyzico
IYZICO_API_KEY=your-iyzico-api-key
IYZICO_SECRET_KEY=your-iyzico-secret-key
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Stripe için (alternatif)
# PAYMENT_PROVIDER=stripe
# STRIPE_PUBLISHABLE_KEY=pk_test_xxx
# STRIPE_SECRET_KEY=sk_test_xxx

# PayTR için (alternatif)
# PAYMENT_PROVIDER=paytr
# PAYTR_MERCHANT_ID=your-merchant-id
# PAYTR_MERCHANT_KEY=your-merchant-key
# PAYTR_MERCHANT_SALT=your-merchant-salt

# ============================================
# Email Service
# ============================================
# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key
FROM_EMAIL=noreply@petfendy.com
FROM_NAME=Petfendy

# SMTP (alternatif)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# ============================================
# Database (Production)
# ============================================
DATABASE_URL=postgresql://user:password@localhost:5432/petfendy
REDIS_URL=redis://localhost:6379

# ============================================
# Security
# ============================================
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
SESSION_SECRET=your-session-secret-key

# ============================================
# Application
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# ============================================
# Monitoring & Analytics
# ============================================
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

### Production Güvenlik Kontrolü

Production'a deploy etmeden önce:

```bash
# ✅ JWT secret'ları güçlü ve rastgele
openssl rand -base64 32

# ✅ Encryption key 32 karakter
openssl rand -hex 16

# ✅ Environment variables production values
# ✅ HTTPS sertifikası yüklü
# ✅ Rate limiting aktif
# ✅ Security headers yapılandırılmış
# ✅ Payment gateway production API keys
```

---

## 💻 Kullanım

### Geliştirme

```bash
# Geliştirme sunucusu (hot reload)
npm run dev

# Tip kontrolü
npm run type-check

# Linting
npm run lint

# Format
npm run format
```

### Production Build

```bash
# Build oluştur
npm run build

# Production sunucu
npm start

# Build analizi
npm run analyze
```

### Test Kullanıcıları

**Development ortamı için test hesapları:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Admin Hesabı
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Email: admin@petfendy.com
  Şifre: admin123
  Rol: Administrator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Test Kullanıcı
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Email: user@test.com
  Şifre: test123
  Rol: Customer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Test Ödeme Kartları

**⚠️ SADECE Development/Sandbox kullanımı için:**

```
┌─────────────────────────────────────┐
│  Başarılı İşlem                     │
├─────────────────────────────────────┤
│  Kart No: 4242 4242 4242 4242      │
│  Son Kullanma: 12/25                │
│  CVV: 123                           │
│  Ad Soyad: Test User                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Başarısız İşlem (Yetersiz Bakiye)  │
├─────────────────────────────────────┤
│  Kart No: 4000 0000 0000 0002      │
│  Son Kullanma: 12/25                │
│  CVV: 123                           │
└─────────────────────────────────────┘
```

---

## 🔐 Güvenlik

Petfendy, kurumsal güvenlik standartlarına uygun olarak geliştirilmiştir.

### Güvenlik Belgeleri

📚 **Kapsamlı dokümantasyon:**
- [SECURITY.md](SECURITY.md) - Detaylı güvenlik protokolleri
- [SECURITY-SUMMARY.md](SECURITY-SUMMARY.md) - Hızlı güvenlik özeti

### Güvenlik Özellikleri

<table>
  <tr>
    <th>Kategori</th>
    <th>Özellikler</th>
    <th>Standart</th>
  </tr>
  <tr>
    <td>🔐 Authentication</td>
    <td>JWT + Refresh Tokens<br>Bcrypt (12 rounds)<br>Session Management</td>
    <td>OWASP ASVS</td>
  </tr>
  <tr>
    <td>💳 Payment Security</td>
    <td>PCI DSS Level 1<br>AES-256 Encryption<br>Token Vault</td>
    <td>PCI DSS 3.2.1</td>
  </tr>
  <tr>
    <td>🛡️ Protection</td>
    <td>XSS Prevention<br>CSRF Tokens<br>SQL Injection Defense</td>
    <td>OWASP Top 10</td>
  </tr>
  <tr>
    <td>🚦 Rate Limiting</td>
    <td>100 req/15min<br>Adaptive Throttling<br>IP-based blocking</td>
    <td>Custom</td>
  </tr>
  <tr>
    <td>📊 Monitoring</td>
    <td>Secure Logging<br>Audit Trail<br>PII Redaction</td>
    <td>GDPR/KVKK</td>
  </tr>
</table>

### Güvenlik Açığı Bildirimi

Güvenlik açığı tespit ederseniz lütfen **security@petfendy.com** adresine rapor edin.

**⚠️ Lütfen güvenlik açıklarını GitHub Issues'da paylaşmayın.**

**Responsible Disclosure Policy:**
- 90 gün içinde yanıt garantisi
- Onaylanan açıklar için bug bounty programı
- Hall of Fame'de yer alma

---

## 📚 API Referansı

### Authentication Endpoints

```typescript
POST /api/auth/register
// Yeni kullanıcı kaydı
Body: {
  email: string;
  password: string;
  name: string;
  phone: string;
}

POST /api/auth/login
// Kullanıcı girişi
Body: {
  email: string;
  password: string;
}

POST /api/auth/verify-email
// Email doğrulama
Body: {
  email: string;
  code: string; // 6 haneli
}

POST /api/auth/refresh-token
// Token yenileme
Headers: {
  Authorization: Bearer <refresh_token>
}
```

### Booking Endpoints

```typescript
GET /api/bookings
// Kullanıcının rezervasyonları
Headers: {
  Authorization: Bearer <access_token>
}

POST /api/bookings/hotel
// Otel rezervasyonu
Body: {
  roomType: 'standard' | 'deluxe' | 'suite';
  checkIn: string; // ISO date
  checkOut: string;
  petInfo: {
    name: string;
    type: 'dog' | 'cat' | 'other';
    breed: string;
    age: number;
  };
  specialRequests?: string;
}

POST /api/bookings/taxi
// Taksi rezervasyonu
Body: {
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  returnTrip: boolean;
  petInfo: object;
}
```

### Payment Endpoints

```typescript
POST /api/payment/create-token
// Güvenli ödeme token oluştur
Body: {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}
Response: {
  token: string;
  last4: string;
}

POST /api/payment/process
// Ödeme işle
Body: {
  paymentToken: string;
  amount: number;
  bookingId: string;
}
```

### Rate Limiting

Tüm API endpoint'leri için:
- **Rate Limit**: 100 istek / 15 dakika
- **Header**: `X-RateLimit-Remaining`
- **429 Response**: `{ error: "Too many requests" }`

---

## 📁 Proje Yapısı

```
petfendy/
├── 📂 app/                          # Next.js App Router
│   └── [locale]/                   # i18n locale wrapper
│       ├── layout.tsx              # Root layout
│       ├── page.tsx                # Ana sayfa
│       ├── home/                   # Home page
│       └── globals.css             # Global styles
│
├── 📂 components/                   # React Components
│   ├── admin-dashboard.tsx         # Admin panel
│   ├── auth-context.tsx            # Auth provider
│   ├── cart.tsx                    # Sepet sistemi
│   ├── email-verification.tsx      # Email doğrulama
│   ├── hotel-booking.tsx           # Otel rezervasyon
│   ├── invoice-system.tsx          # Fatura sistemi
│   ├── login-form.tsx              # Giriş formu
│   ├── payment-modal.tsx           # Ödeme modalı
│   ├── pet-management.tsx          # Evcil hayvan yönetimi
│   ├── register-form.tsx           # Kayıt formu
│   ├── reports-analytics.tsx       # Raporlama
│   ├── taxi-booking.tsx            # Taksi rezervasyon
│   ├── theme-provider.tsx          # Dark/Light mode
│   ├── user-profile.tsx            # Kullanıcı profili
│   └── ui/                         # Shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── ...
│
├── 📂 lib/                          # Utility Libraries
│   ├── encryption.ts               # AES-256 şifreleme
│   ├── email-service.ts            # Email gönderim
│   ├── mock-data.ts                # Test verileri
│   ├── payment-service.ts          # Ödeme servisi (mock)
│   ├── payment-service-secure.ts   # Güvenli ödeme
│   ├── security.ts                 # Güvenlik fonksiyonları
│   ├── storage.ts                  # LocalStorage wrapper
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # Helper functions
│
├── 📂 i18n/                         # Internationalization
│   ├── messages/
│   │   ├── tr.json                 # Türkçe çeviriler
│   │   └── en.json                 # İngilizce çeviriler
│   └── request.ts                  # i18n config
│
├── 📂 hooks/                        # Custom React Hooks
│   ├── use-mobile.ts               # Responsive hook
│   └── use-toast.ts                # Toast notifications
│
├── 📂 public/                       # Static Assets
│   ├── petfendy-logo.svg
│   ├── favicon.ico
│   └── images/
│
├── 📄 middleware.ts                 # Next.js Middleware (i18n)
├── 📄 middleware-security.ts        # Security Middleware
├── 📄 next.config.mjs               # Next.js Config
├── 📄 tailwind.config.ts            # Tailwind Config
├── 📄 tsconfig.json                 # TypeScript Config
├── 📄 package.json                  # Dependencies
│
├── 📄 SECURITY.md                   # Güvenlik dokümantasyonu
├── 📄 SECURITY-SUMMARY.md           # Güvenlik özeti
├── 📄 HANDOVER.md                   # Proje devir dökümantasyonu
└── 📄 README.md                     # Bu dosya
```

### Klasör Yapısı Felsefesi

```
Components     → Tek sorumluluk prensibi
Lib            → Pure functions, no side effects
i18n           → Merkezi çeviri yönetimi
Middleware     → Güvenlik ve routing
```

---

## 🌍 Çok Dilli Destek

Petfendy, **next-intl** kullanarak tam çok dilli destek sunar.

### Desteklenen Diller

| Dil | Kod | Durum | Tamamlanma |
|-----|-----|-------|------------|
| 🇹🇷 Türkçe | `tr` | Aktif | ✅ 100% |
| 🇬🇧 English | `en` | Aktif | ✅ 100% |
| 🇩🇪 Deutsch | `de` | Planlı | ⏳ 0% |
| 🇫🇷 Français | `fr` | Planlı | ⏳ 0% |

### Yeni Dil Ekleme

```bash
# 1. Yeni çeviri dosyası oluştur
cp i18n/messages/en.json i18n/messages/de.json

# 2. i18n/request.ts dosyasına ekle
export const locales = ['tr', 'en', 'de'];

# 3. Çevirileri yap
# i18n/messages/de.json içeriğini düzenle

# 4. Test et
npm run dev
# http://localhost:3000/de
```

---

## 🚀 Deployment

### Vercel (Önerilen)

```bash
# 1. Vercel CLI yükle
npm i -g vercel

# 2. Deploy
vercel

# 3. Environment variables ekle
vercel env add JWT_SECRET
vercel env add PAYMENT_API_KEY
# ... diğer değişkenler

# 4. Production deploy
vercel --prod
```

### Docker

```dockerfile
# Dockerfile oluştur
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build ve run
docker build -t petfendy .
docker run -p 3000:3000 --env-file .env.production petfendy
```

### VPS / Self-Hosted

```bash
# 1. Sunucuya bağlan
ssh user@your-server.com

# 2. Node.js ve PM2 yükle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# 3. Repository clone
git clone https://github.com/cetinibs/petfendy.git
cd petfendy

# 4. Build
npm install --production
npm run build

# 5. PM2 ile başlat
pm2 start npm --name "petfendy" -- start
pm2 save
pm2 startup

# 6. Nginx reverse proxy (opsiyonel)
sudo nano /etc/nginx/sites-available/petfendy
```

**Nginx config örneği:**

```nginx
server {
    listen 80;
    server_name petfendy.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Production Checklist

- [ ] ✅ Environment variables production değerleriyle ayarlandı
- [ ] ✅ HTTPS sertifikası yüklendi (Let's Encrypt)
- [ ] ✅ Payment gateway production API keys eklendi
- [ ] ✅ Email servisi konfigüre edildi
- [ ] ✅ Database connection strings production'a ayarlandı
- [ ] ✅ Redis cache aktif
- [ ] ✅ Rate limiting production values (100/15min)
- [ ] ✅ Security headers doğrulandı
- [ ] ✅ Monitoring servisleri aktif (Vercel Analytics, Sentry)
- [ ] ✅ Backup stratejisi hazır
- [ ] ✅ CDN konfigürasyonu (CloudFlare önerilir)
- [ ] ✅ Domain DNS ayarları yapıldı
- [ ] ✅ GDPR/KVKK compliance kontrol edildi
- [ ] ✅ Security audit yapıldı
- [ ] ✅ Load testing tamamlandı

---

## 🧪 Test

### Unit Tests

```bash
# Test suite çalıştır
npm test

# Coverage raporu
npm run test:coverage

# Watch mode
npm run test:watch
```

### Integration Tests

```bash
# E2E testler (Playwright)
npm run test:e2e

# Specific test
npm run test:e2e -- booking.spec.ts
```

### Manual Test Checklist

```
Rezervasyon Flow:
├── [ ] Oda seçimi
├── [ ] Tarih seçimi (overlap kontrolü)
├── [ ] Pet bilgileri
├── [ ] Fiyat hesaplama
├── [ ] Ödeme (test kartı)
└── [ ] Email onayı

Authentication:
├── [ ] Kayıt (email doğrulama)
├── [ ] Giriş (JWT token)
├── [ ] Şifre sıfırlama
├── [ ] Token refresh
└── [ ] Logout

Admin Panel:
├── [ ] Dashboard metrikleri
├── [ ] Rezervasyon onay/red
├── [ ] Kullanıcı yönetimi
├── [ ] Rapor export (PDF/Excel)
└── [ ] Ayarlar güncelleme
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Projeye katkıda bulunmak için:

### Contribution Guidelines

1. **Fork** edin
2. **Feature branch** oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** edin (Conventional Commits)
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push** edin
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Pull Request** açın

### Commit Message Formatı

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Bug fix
- `docs`: Dokümantasyon
- `style`: Formatlama, noktalı virgül vb.
- `refactor`: Kod iyileştirme
- `test`: Test ekleme
- `chore`: Build, dependencies

**Örnek:**
```bash
feat(payment): add stripe integration

- Implemented Stripe payment gateway
- Added webhook handlers
- Updated payment flow tests

Closes #123
```

### Code Style

```bash
# Lint check
npm run lint

# Auto-fix
npm run lint:fix

# Format
npm run format
```

**Kodlama Standartları:**
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ 2 spaces indentation
- ✅ Single quotes
- ✅ Trailing commas
- ✅ 80 characters max line length

### Pull Request Checklist

- [ ] Kod ESLint kurallarına uygun
- [ ] TypeScript hatasız
- [ ] Yeni özellikler için testler eklendi
- [ ] Dokümantasyon güncellendi
- [ ] CHANGELOG.md'ye eklendi
- [ ] Breaking changes belirtildi
- [ ] Screenshots eklendi (UI değişiklikleri için)

---

## 🏆 Contributors

Teşekkürler! 🙏

<!-- ALL-CONTRIBUTORS-LIST:START -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/cetinibs">
        <img src="https://github.com/cetinibs.png" width="100px;" alt=""/>
        <br /><sub><b>cetinibs</b></sub>
      </a>
      <br />💻 🎨 📖
    </td>
    <!-- Daha fazla contributor buraya eklenecek -->
  </tr>
</table>
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## 📄 Lisans

Copyright © 2025 **Petfendy**. Tüm hakları saklıdır.

Bu proje özel mülkiyettir ve aşağıdaki şartlarla lisanslanmıştır:

- ✅ Kişisel kullanım için görüntüleme ve inceleme
- ❌ Ticari kullanım yasaktır
- ❌ Dağıtım yasaktır
- ❌ Modifikasyon yasaktır (izin olmadan)

Daha fazla bilgi için `LICENSE` dosyasına bakınız.

---

## 📞 İletişim

### Genel İletişim

- 🌐 **Website**: [https://petfendy.com](https://petfendy.com)
- 📧 **Email**: info@petfendy.com
- 📱 **Telefon**: +90 (312) 123 45 67
- 📍 **Adres**: Çankaya, Ankara, Türkiye

### Destek

- 💬 **Canlı Destek**: [petfendy.com/chat](https://petfendy.com/chat)
- 📧 **Email**: support@petfendy.com
- 📚 **Docs**: [docs.petfendy.com](https://docs.petfendy.com)

### Güvenlik

- 🔐 **Security**: security@petfendy.com
- ⚠️ **Acil Güvenlik Bildirimi**: +90 5XX XXX XX XX

### Sosyal Medya

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/petfendy)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/petfendy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/petfendy)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/petfendy)

---

## 🎯 Roadmap

### Q1 2025
- [ ] 🐾 Mobil uygulama (React Native)
- [ ] 🔔 Push notification sistemi
- [ ] 📹 Video call ile veteriner danışma
- [ ] 🎯 Sadakat programı

### Q2 2025
- [ ] 🤖 AI tabanlı pet bakım önerileri
- [ ] 📊 Gelişmiş analytics dashboard
- [ ] 🌍 Çok şubeli sistem
- [ ] 💳 Abonelik paketleri

### Q3 2025
- [ ] 🎮 Gamification sistemi
- [ ] 🏪 Pet shop e-ticaret entegrasyonu
- [ ] 📱 Paw reader (QR kod ile pet profili)
- [ ] 🚑 Acil durum sos butonu

---

## 📊 Proje İstatistikleri

![GitHub repo size](https://img.shields.io/github/repo-size/cetinibs/petfendy?style=flat-square)
![GitHub code size](https://img.shields.io/github/languages/code-size/cetinibs/petfendy?style=flat-square)
![Lines of code](https://img.shields.io/tokei/lines/github/cetinibs/petfendy?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/cetinibs/petfendy?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/cetinibs/petfendy?style=flat-square)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cetinibs/petfendy&type=Date)](https://star-history.com/#cetinibs/petfendy&Date)

---

## 🙏 Teşekkürler

Bu projeyi mümkün kılan açık kaynak topluluğuna ve aşağıdaki projelere teşekkürler:

- [Next.js](https://nextjs.org/) - React Framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Radix UI](https://www.radix-ui.com/) - Headless UI
- [Vercel](https://vercel.com/) - Hosting & Analytics

---

<div align="center">

### 🐾 Petfendy ile evcil hayvanlarınız güvende! 🐾

**[⬆ Başa Dön](#-petfendy)**

---

Made with ❤️ in Ankara, Turkey

[![GitHub stars](https://img.shields.io/github/stars/cetinibs/petfendy?style=social)](https://github.com/cetinibs/petfendy)
[![GitHub forks](https://img.shields.io/github/forks/cetinibs/petfendy?style=social)](https://github.com/cetinibs/petfendy/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/cetinibs/petfendy?style=social)](https://github.com/cetinibs/petfendy)

</div>
