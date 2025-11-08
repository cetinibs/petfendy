# Gmail/Google OAuth Giriş Sistemi Kurulum Rehberi

Bu proje artık Gmail/Google hesabı ile giriş ve kayıt yapabilme özelliğine sahiptir.

## Kurulum Adımları

### 1. Google Cloud Console'da Proje Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. Sol menüden **APIs & Services** > **Credentials** seçeneğine tıklayın
4. **+ CREATE CREDENTIALS** butonuna tıklayıp **OAuth client ID** seçin
5. **Application type** olarak **Web application** seçin
6. **Authorized JavaScript origins** alanına şunları ekleyin:
   - `http://localhost:3000`
   - Üretim URL'niz (örn: `https://petfendy.com`)
7. **Authorized redirect URIs** alanına şunları ekleyin:
   - `http://localhost:3000/api/auth/callback/google`
   - Üretim URL'niz (örn: `https://petfendy.com/api/auth/callback/google`)
8. **CREATE** butonuna tıklayın
9. Client ID ve Client Secret bilgilerini kopyalayın

### 2. Ortam Değişkenlerini Yapılandırma

Proje kök dizininde `.env.local` dosyası oluşturun (`.env.example` dosyasını referans alabilirsiniz):

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-step-1
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-1
```

**NEXTAUTH_SECRET** oluşturmak için terminalde şu komutu çalıştırın:
```bash
openssl rand -base64 32
```

### 3. Uygulamayı Başlatma

```bash
npm install
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine gidin.

## Kullanım

### Giriş Yapma
1. Ana sayfada "Giriş Yap" butonuna tıklayın
2. "Google ile Giriş Yap" butonuna tıklayın
3. Google hesabınızı seçin ve izinleri onaylayın
4. Otomatik olarak giriş yapılacaktır

### Kayıt Olma
1. Ana sayfada "Kayıt Ol" butonuna tıklayın
2. "Google ile Kayıt Ol" butonuna tıklayın
3. Google hesabınızı seçin ve izinleri onaylayın
4. Otomatik olarak kayıt olup giriş yapılacaktır

## Özellikler

- ✅ Google OAuth 2.0 ile güvenli giriş
- ✅ Otomatik kullanıcı kaydı
- ✅ E-posta doğrulaması gerekmez (Google zaten doğrulamış)
- ✅ Mevcut klasik e-posta/şifre girişi ile uyumlu çalışır
- ✅ Kullanıcı profil fotoğrafı Google'dan otomatik çekilir
- ✅ Session yönetimi NextAuth.js ile güvenli şekilde yapılır

## Teknik Detaylar

### Kullanılan Teknolojiler
- **NextAuth.js v5**: Modern authentication çözümü
- **Google OAuth Provider**: Gmail hesabı ile giriş
- **JWT**: Session token yönetimi
- **Next.js 16**: App Router desteği

### Dosya Yapısı
```
petfendy/
├── lib/
│   └── auth.ts                      # NextAuth yapılandırması
├── app/
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts          # Auth API endpoint
├── components/
│   ├── auth-context.tsx             # Auth state yönetimi
│   ├── login-form.tsx               # Giriş formu (Google butonu dahil)
│   └── register-form.tsx            # Kayıt formu (Google butonu dahil)
└── .env.local                       # Ortam değişkenleri (GİT'e eklenmemeli)
```

## Güvenlik

- OAuth 2.0 protokolü kullanılarak güvenli giriş
- NEXTAUTH_SECRET ile JWT token'ları şifrelenir
- Google tarafından doğrulanmış e-posta adresleri
- HTTPS kullanımı üretimde zorunludur
- Session süreleri ve token yenileme otomatik yönetilir

## Sorun Giderme

### "OAuth error: Invalid redirect URI"
- Google Cloud Console'da redirect URI'ları kontrol edin
- `NEXTAUTH_URL` değişkeninin doğru olduğundan emin olun

### "Missing NEXTAUTH_SECRET"
- `.env.local` dosyasında `NEXTAUTH_SECRET` değişkeninin tanımlı olduğundan emin olun

### Google butonu çalışmıyor
- Google Client ID ve Secret'ın doğru olduğundan emin olun
- Tarayıcı konsolunda hata mesajlarını kontrol edin
- `npm run dev` komutuyla development sunucusunu yeniden başlatın

## Üretim (Production) İçin

Üretim ortamına geçmeden önce:

1. `.env.local` yerine üretim ortamı değişkenlerini kullanın
2. `NEXTAUTH_URL` değişkenini üretim domain'inize güncelleyin
3. Google Cloud Console'da üretim URL'lerini authorized origins ve redirect URIs'lere ekleyin
4. HTTPS kullanımına geçin (zorunlu)
5. Session ve token süreleri üretim için optimize edin

## Destek

Herhangi bir sorun yaşarsanız:
- NextAuth.js dökümantasyonu: https://next-auth.js.org/
- Google OAuth dökümantasyonu: https://developers.google.com/identity/protocols/oauth2
