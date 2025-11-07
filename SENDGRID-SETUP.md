# SendGrid E-posta Entegrasyonu Kurulum Rehberi

## 📧 Genel Bakış

Petfendy projesi, email göndermek için SendGrid API kullanır. Bu dokümanda SendGrid hesabı oluşturma ve entegrasyon adımları anlatılmaktadır.

## 🚀 Kurulum Adımları

### 1. SendGrid Hesabı Oluşturun

1. [SendGrid](https://sendgrid.com) web sitesine gidin
2. "Start for Free" ile ücretsiz hesap oluşturun
3. Email adresinizi doğrulayın

### 2. API Key Oluşturun

1. SendGrid Dashboard'a giriş yapın
2. **Settings** > **API Keys** bölümüne gidin
3. **Create API Key** butonuna tıklayın
4. İsim verin (örn: "Petfendy Production")
5. **Full Access** veya en azından **Mail Send** yetkisi verin
6. API Key'i kopyalayın (sadece bir kez gösterilir!)

### 3. Sender Identity Doğrulayın

SendGrid'in email gönderebilmesi için gönderen adresini doğrulamanız gerekir:

#### Seçenek A: Tek Email Doğrulama (Hızlı - Test için)
1. **Settings** > **Sender Authentication** > **Verify a Single Sender**
2. Email adresinizi ekleyin (örn: noreply@petfendy.com)
3. Email'inize gelen doğrulama linkine tıklayın

#### Seçenek B: Domain Doğrulama (Önerilen - Production için)
1. **Settings** > **Sender Authentication** > **Authenticate Your Domain**
2. DNS kayıtlarını domain sağlayıcınıza ekleyin
3. Doğrulama tamamlanana kadar bekleyin

### 4. Environment Variables Ayarlayın

1. Proje klasöründe `.env.local` dosyası oluşturun:
```bash
cp .env.example .env.local
```

2. `.env.local` dosyasını düzenleyin:
```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.xxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyy
SENDGRID_FROM_EMAIL=noreply@petfendy.com

# Environment
NODE_ENV=production
```

### 5. Vercel'de Environment Variables Ayarlayın

Production deployment için:

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. Projenizi seçin
3. **Settings** > **Environment Variables**
4. Aşağıdaki değişkenleri ekleyin:
   - `SENDGRID_API_KEY`: SendGrid API key'iniz
   - `SENDGRID_FROM_EMAIL`: Doğrulanmış gönderen email'iniz
   - `NODE_ENV`: `production`

5. **Save** butonuna tıklayın
6. Projeyi yeniden deploy edin

## ✅ Test Etme

### Development Modunda Test

Development'ta API key olmadan çalışır (email gönderilmez, konsola log atılır):

```bash
npm run dev
```

Kayıt olma işlemini deneyin - konsol çıktısında doğrulama kodu görünecektir.

### Production Modunda Test

API key'i `.env.local`'e ekledikten sonra:

```bash
NODE_ENV=production npm run dev
```

Kayıt olun ve email'inizi kontrol edin.

## 📊 Email Türleri

Sistem şu email'leri gönderir:

1. **Email Doğrulama** - Yeni kullanıcı kaydında 6 haneli kod
2. **Şifre Sıfırlama** - Şifre sıfırlama linki
3. **Rezervasyon Onayı** - Otel/taksi rezervasyon detayları
4. **Fatura** - Ödeme sonrası fatura detayları

## 🔧 Sorun Giderme

### Email Gelmiyor?

1. **Spam klasörünü kontrol edin**
2. **SendGrid Activity**'yi kontrol edin:
   - Dashboard > Activity
   - Son gönderilen email'leri ve durumlarını görün
3. **API Key'in yetkilerini kontrol edin**
4. **Sender email'in doğrulandığından emin olun**

### Development Modunda Test

API key olmadan test etmek için konsolda doğrulama kodunu görün:

```bash
# Konsol çıktısı:
📧 [Email Service - DEV MODE] Email would be sent:
To: user@example.com
Subject: Petfendy - E-posta Doğrulama
Content: ...
Doğrulama Kodu: 123456
...
```

### Error: Unauthorized

- API Key'in doğru olduğundan emin olun
- API Key'in **Mail Send** yetkisi olduğunu kontrol edin
- API Key'i yeniden oluşturup deneyin

### Error: Invalid Sender

- Gönderen email'in SendGrid'de doğrulandığından emin olun
- `SENDGRID_FROM_EMAIL` değişkeninin doğru olduğunu kontrol edin

## 📈 SendGrid Limitleri

### Ücretsiz Plan:
- 100 email/gün
- Tek sender doğrulama
- Temel analytics

### Essentials Plan ($19.95/ay):
- 50,000 email/ay
- Domain doğrulama
- Gelişmiş analytics
- Email validation API

## 🔒 Güvenlik Notları

1. ⚠️ **API Key'i asla Git'e commit etmeyin**
2. `.env.local` dosyası `.gitignore`'da olmalı
3. Production'da API key'i sadece Vercel Environment Variables'da saklayın
4. API key'i düzenli olarak rotate edin
5. Her environment için ayrı API key kullanın

## 🌐 Daha Fazla Bilgi

- [SendGrid Dokümantasyonu](https://docs.sendgrid.com/)
- [SendGrid Node.js Kütüphanesi](https://github.com/sendgrid/sendgrid-nodejs)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)

## 💡 İpuçları

1. **Test Email'leri**: Production'a geçmeden önce kendi email'inize test gönderin
2. **Email Templates**: SendGrid'in Dynamic Templates özelliğini kullanarak email tasarımlarını yönetin
3. **Monitoring**: SendGrid Activity sayfasından email başarı oranlarını takip edin
4. **Webhook**: Email açılma, tıklama gibi olayları takip etmek için webhook kurabilirsiniz

## 📞 Destek

Sorun yaşarsanız:
- SendGrid Support: https://support.sendgrid.com/
- Proje Issues: GitHub repository issues sayfası
