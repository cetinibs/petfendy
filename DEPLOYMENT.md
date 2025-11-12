# 🚀 Vercel Deployment Rehberi - Petfendy

Bu rehber, Petfendy projesini Vercel'e nasıl deploy edeceğinizi adım adım açıklamaktadır.

## 📋 Ön Gereksinimler

1. [Vercel hesabı](https://vercel.com/signup) (GitHub ile giriş yapabilirsiniz)
2. GitHub'da yüklü proje repository'si
3. Node.js 18+ (lokal geliştirme için)

## 🎯 Hızlı Başlangıç (3 Adımda Deployment)

### Adım 1: Vercel'e Proje İmport Et

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "Add New..." → "Project" seçeneğine tıklayın
3. GitHub repository'nizi seçin (`petfendy`)
4. "Import" butonuna tıklayın

### Adım 2: Environment Variables Ekle

Vercel project ayarlarında, aşağıdaki environment variables'ları ekleyin:

**Zorunlu Değişkenler:**
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key-change-in-production
```

**Opsiyonel Değişkenler (Production özellikleri için):**
```env
SENDGRID_API_KEY=your-sendgrid-api-key
PAYMENT_API_KEY=your-payment-gateway-api-key
PAYMENT_MERCHANT_ID=your-merchant-id
```

> 💡 **Güçlü Secret Oluşturma:**
> ```bash
> openssl rand -base64 32
> ```
> Bu komutla güvenli random stringler oluşturabilirsiniz.

### Adım 3: Deploy Et!

1. "Deploy" butonuna tıklayın
2. Vercel otomatik olarak projenizi build edip deploy edecek
3. Deploy tamamlandığında size bir production URL verilecek: `https://your-project.vercel.app`

## 🔧 Vercel CLI ile Deployment (Alternatif)

Terminal kullanarak deploy etmek isterseniz:

```bash
# 1. Vercel CLI'yi yükleyin
npm install -g vercel

# 2. Vercel'e login olun
vercel login

# 3. Projeyi deploy edin
vercel

# 4. Production'a deploy için
vercel --prod
```

## 📝 Environment Variables Ayarlama (Detaylı)

### Vercel Dashboard'dan

1. Projenize gidin
2. "Settings" → "Environment Variables" sekmesine gidin
3. Her değişken için:
   - Name: Değişken adı (örn: `JWT_SECRET`)
   - Value: Değişken değeri
   - Environment: Production, Preview, Development (hepsini seçebilirsiniz)
4. "Save" butonuna tıklayın

### Vercel CLI'den

```bash
# Tek tek ekleme
vercel env add JWT_SECRET

# .env dosyasından toplu ekleme
vercel env pull .env.local
```

## 🔐 Güvenlik Önerileri

### 1. Secret Değerleri Değiştirin

`.env.example` dosyasındaki değerler sadece örnek! **Mutlaka** kendi güvenli değerlerinizi oluşturun:

```bash
# Güvenli random string oluşturma
openssl rand -base64 32
# veya
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. SendGrid Email Servisi (Opsiyonel)

Eğer email bildirimleri göndermek istiyorsanız:

1. [SendGrid](https://sendgrid.com/) hesabı oluşturun (ücretsiz plan mevcut)
2. API Key oluşturun: Settings → API Keys → Create API Key
3. `SENDGRID_API_KEY` environment variable'ına ekleyin

### 3. Payment Gateway (Opsiyonel)

Production'da gerçek ödeme almak için:

**İyzico için:**
1. [İyzico](https://www.iyzico.com/) merchant hesabı oluşturun
2. API Key ve Secret Key'i alın
3. Environment variables'a ekleyin

**PayTR için:**
1. [PayTR](https://www.paytr.com/) merchant hesabı oluşturun
2. Merchant ID ve API Key'i alın
3. Environment variables'a ekleyin

## 🏗️ Build Settings

Vercel otomatik olarak Next.js algılar, ancak manuel ayarlamak isterseniz:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## 🌍 Domain Bağlama

Kendi domain'inizi bağlamak için:

1. Vercel Dashboard → Projeniz → "Settings" → "Domains"
2. Domain adınızı girin (örn: `petfendy.com`)
3. DNS ayarlarını yapın (Vercel size talimatları gösterecek)
4. SSL sertifikası otomatik olarak oluşturulacak

## 📊 Monitoring & Analytics

Vercel otomatik olarak şunları sağlar:

- **Analytics**: Ziyaretçi istatistikleri
- **Speed Insights**: Performans metrikleri
- **Logs**: Real-time deployment ve runtime logları

Bunlara erişmek için: Dashboard → Projeniz → İlgili sekme

## 🐛 Troubleshooting

### Build Hatası

```bash
# Lokal build test edin
npm run build

# TypeScript hatalarını görmezden gel (geçici)
# next.config.mjs dosyasında zaten ayarlanmış
```

### Environment Variables Yüklenmedi

1. Environment variables'ları doğru environment'a eklediniz mi? (Production/Preview/Development)
2. Değişiklikleri kaydettiğiniz sonra projeyi yeniden deploy edin
3. `NEXT_PUBLIC_` prefix'i olan değişkenler browser'da görünebilir (hassas bilgi koymayın!)

### Image Optimization Hatası

`next.config.mjs` dosyasında `images.unoptimized: true` zaten ayarlanmış, sorun olmamalı.

## 📚 Faydalı Linkler

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🎉 Deployment Tamamlandı!

Deploy işlemi tamamlandıktan sonra:

1. ✅ Production URL'i alın ve test edin
2. ✅ Tüm sayfaların çalıştığını kontrol edin
3. ✅ Form gönderimlerini test edin
4. ✅ Responsive tasarımı mobil cihazlarda test edin

**Hayırlı olsun! 🐾**

---

## 🆘 Yardım

Sorun yaşarsanız:
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- Projenin GitHub Issues sayfası
