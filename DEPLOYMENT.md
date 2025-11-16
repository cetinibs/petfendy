# 🚀 Petfendy Deployment Rehberi

Bu dokuman, Petfendy projesinin Vercel'e nasıl deploy edileceğini adım adım açıklamaktadır.

## 📋 Önkoşullar

- [Vercel hesabı](https://vercel.com/signup) (GitHub ile bağlanmanız önerilir)
- Git repository'si GitHub, GitLab veya Bitbucket'ta
- Node.js 18+ kurulu (local test için)

## 🔧 Vercel'de İlk Deployment

### 1. Vercel'e Giriş Yapın

[https://vercel.com](https://vercel.com) adresinden giriş yapın ve GitHub hesabınızı bağlayın.

### 2. Yeni Proje Oluşturun

1. Dashboard'da **"Add New Project"** butonuna tıklayın
2. GitHub repository'nizi seçin (petfendy)
3. **Import** butonuna tıklayın

### 3. Build & Development Settings

Vercel otomatik olarak Next.js projesini algılayacaktır, ancak şu ayarları kontrol edin:

```
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install --legacy-peer-deps
Output Directory: .next
Node.js Version: 18.x
```

**ÖNEMLİ:** Install Command'ı mutlaka `npm install --legacy-peer-deps` olarak değiştirin!

### 4. Environment Variables Ekleyin

**Environment Variables** bölümüne şu değişkenleri ekleyin:

#### Zorunlu Değişkenler:

```env
# JWT Secrets (güvenli değerler üretin!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# Encryption Key
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key-min-32-chars

# Payment Gateway (Boş bırakılabilir, mock data kullanır)
PAYMENT_API_KEY=your-payment-api-key
PAYMENT_MERCHANT_ID=your-merchant-id
PAYMENT_GATEWAY_SECRET=your-payment-gateway-secret
MERCHANT_ID=your-merchant-id

# Email Service (Boş bırakılabilir, mock service kullanır)
SENDGRID_API_KEY=your-sendgrid-api-key
```

#### Güvenli Secret Üretme:

```bash
# Mac/Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Deploy Edin

**Deploy** butonuna tıklayın. İlk deployment 2-3 dakika sürebilir.

## 🔄 Otomatik Deployments

Vercel, GitHub entegrasyonu ile otomatik deployment sağlar:

- **Production:** `main` branch'e push yapıldığında otomatik deploy edilir
- **Preview:** Diğer branch'lere push yapıldığında preview URL oluşturulur
- **Pull Requests:** Her PR için otomatik preview deployment

## 🌐 Custom Domain Bağlama

### petfendy.vercel.app → petfendy.com

1. Vercel Dashboard > Project Settings > Domains
2. **Add Domain** butonuna tıklayın
3. Domain adınızı girin (örn: `petfendy.com`)
4. Vercel'in verdiği DNS kayıtlarını domain sağlayıcınıza ekleyin:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. DNS propagation için 24 saat bekleyin
6. Vercel otomatik SSL sertifikası oluşturacaktır

## 🔍 Deployment Sonrası Kontroller

### 1. Build Loglarını Kontrol Edin

Deployment > Build Logs'dan build sürecini inceleyin:

```bash
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
```

### 2. Siteyi Test Edin

- [ ] Ana sayfa açılıyor mu?
- [ ] Dil değiştirme çalışıyor mu? (TR/EN)
- [ ] Rezervasyon formu gösteriliyor mu?
- [ ] Kullanıcı kayıt/giriş çalışıyor mu?

### 3. Güvenlik Başlıklarını Kontrol Edin

[Security Headers](https://securityheaders.com/) sitesinde sitenizi test edin.

Beklenen başlıklar:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=()`

## 🐛 Yaygın Sorunlar ve Çözümleri

### Build Hatası: "next: not found"

**Çözüm:** Install Command'ı `npm install --legacy-peer-deps` olarak değiştirin.

### Environment Variables Çalışmıyor

**Çözüm:**
1. Variable isimlerini kontrol edin (büyük/küçük harf duyarlı)
2. Redeploy yapın (değişiklikler için yeniden deploy gerekir)
3. `NEXT_PUBLIC_` prefix'i olan değişkenler client-side'da kullanılır

### Font Yükleme Hatası

**Çözüm:**
Google Fonts yerine sistem fontları kullanılmaktadır. Eğer özel font eklemek isterseniz:
- Font dosyalarını `public/fonts/` klasörüne ekleyin
- `globals.css`'de `@font-face` ile tanımlayın

### Rate Limiting Sorunları

**Çözüm:**
Production için `middleware-security.ts` dosyasındaki rate limit değerlerini artırın:

```typescript
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 500, // Production için artırılabilir
}
```

## 📊 Monitoring ve Analytics

### Vercel Analytics

Vercel otomatik olarak temel analytics sağlar:
- Page views
- Unique visitors
- Top pages
- Referrers

Dashboard > Analytics'ten erişebilirsiniz.

### Vercel Speed Insights

Real User Monitoring (RUM) için:

```bash
npm install @vercel/speed-insights
```

### Error Tracking

Production hataları için Sentry entegrasyonu önerilir:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🔐 Güvenlik Tavsiyeleri

### Production Checklist

- [x] JWT secrets güvenli ve uzun (min 32 karakter)
- [x] Environment variables Vercel'de saklanıyor (kod içinde değil)
- [ ] HTTPS zorunlu (Vercel otomatik sağlar)
- [ ] Rate limiting aktif
- [ ] Security headers doğru yapılandırılmış
- [ ] SQL injection koruması aktif
- [ ] XSS koruması aktif
- [ ] CSRF token kullanımı

### Düzenli Bakım

1. **Haftalık:**
   - Error loglarını kontrol edin
   - Analytics'i inceleyin
   - Performance metrics'i gözden geçirin

2. **Aylık:**
   - Dependencies güncellemeleri (`npm outdated`)
   - Security audit (`npm audit`)
   - SSL sertifikası süresi

3. **Yıllık:**
   - Full security audit
   - Performance optimization review
   - Backup stratejisi testi

## 🆘 Destek

Deployment ile ilgili sorun yaşarsanız:

1. [Vercel Documentation](https://vercel.com/docs)
2. [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
3. Proje sahibi: info@petfendy.com

## 📝 Deployment Changelog

### v1.0.0 (2025-11-16)
- ✅ İlk production deployment
- ✅ Environment variables yapılandırıldı
- ✅ Custom domain bağlandı
- ✅ SSL sertifikası aktif
- ✅ Security headers eklendi

---

**Son Güncelleme:** 16 Kasım 2025
