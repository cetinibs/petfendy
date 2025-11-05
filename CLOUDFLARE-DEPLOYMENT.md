# Cloudflare Workers/Pages Deployment Guide

Bu proje Next.js 15.5.2 ve React 18 kullanacak şekilde yapılandırılmıştır. Cloudflare'e deploy etmek için birkaç seçenek bulunmaktadır.

## ⚠️ Önemli Notlar

Mevcut projede kullanılan bazı özellikler Cloudflare Workers/Pages ile tam uyumlu değildir:

1. **next-intl**: Server-side i18n, static export ile uyumlu değil
2. **jsonwebtoken**: Node.js crypto modülü Edge Runtime'da çalışmaz
3. **Middleware**: Security middleware headers kullanıyor, bu da static export ile uyumsuz

## 🚀 Önerilen Deployment Yöntemleri

### Seçenek 1: Vercel (ÖNERİLEN ⭐)

Next.js'in geliştiricisi Vercel, tüm özellikleri tam destekler:

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Deploy
vercel
```

**Avantajları:**
- ✅ Tüm Next.js özellikleri desteklenir
- ✅ Server-side rendering tam destek
- ✅ Middleware tam çalışır
- ✅ Edge Functions
- ✅ Otomatik HTTPS
- ✅ Global CDN

### Seçenek 2: Cloudflare Pages (GitHub Entegrasyonu)

Cloudflare Dashboard üzerinden:

1. **Cloudflare Dashboard'a gidin:** https://dash.cloudflare.com/
2. **Pages > Create a project**
3. **GitHub repository'nizi bağlayın**
4. **Build ayarları:**
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node.js version: `20`

**Notlar:**
- ⚠️ Bazı middleware özellikleri çalışmayabilir
- ⚠️ Server-side i18n sınırlı olabilir
- ✅ Client-side rendering tam çalışır

### Seçenek 3: Cloudflare Pages (Wrangler CLI)

```bash
# Cloudflare'e login
npx wrangler login

# Pages deploy
npm run pages:deploy
```

**Not:** Bu yöntem şu an Next.js 15 ile bazı uyumluluk sorunları yaşayabilir.

## 📋 Yapılan Değişiklikler

1. ✅ Next.js 16.0.0 → 15.5.2 (Cloudflare uyumluluğu için)
2. ✅ React 19.2.0 → 18.3.1 (Next.js 15 uyumluluğu için)
3. ✅ @cloudflare/next-on-pages ve wrangler kuruldu
4. ✅ wrangler.toml yapılandırması eklendi
5. ✅ Build scriptleri eklendi (`pages:build`, `pages:deploy`, etc.)
6. ✅ Google Fonts devre dışı bırakıldı (build uyumluluğu için)

## 🔧 Kurulu Paketler

```json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.16",
    "wrangler": "^4.45.4"
  }
}
```

## 📝 Build Scriptleri

```json
{
  "scripts": {
    "build": "next build",
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:deploy": "npm run pages:build && wrangler pages deploy",
    "pages:dev": "npx @cloudflare/next-on-pages --watch",
    "preview": "npm run pages:build && wrangler pages dev"
  }
}
```

## 🌐 Alternatif Deployment Platformları

Eğer Cloudflare ile uyumluluk sorunları yaşarsanız:

### 1. **Vercel** (En İyi Next.js Desteği)
- https://vercel.com
- Ücretsiz plan mevcut
- Tam Next.js desteği

### 2. **Netlify**
- https://netlify.com
- Next.js desteği
- Kolay GitHub entegrasyonu

### 3. **Railway**
- https://railway.app
- Full-stack Node.js hosting
- Otomatik deployments

### 4. **Render**
- https://render.com
- Ücretsiz plan
- Next.js desteği

## 🐛 Sorun Giderme

### Edge Runtime Hataları

Eğer "Module not found: Can't resolve 'crypto'" hatası alırsanız:
- Bu normal bir durumdur, Node.js modülleri Edge Runtime'da çalışmaz
- Çözüm: Vercel gibi full Node.js destekli bir platform kullanın

### Build Hataları

Eğer build sırasında i18n hataları alırsanız:
- Middleware geçici olarak devre dışı bırakılabilir
- Static export yerine server-side rendering kullanın

## 📞 Destek

Deployment konusunda yardıma ihtiyacınız varsa:
- Vercel Documentation: https://vercel.com/docs
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Son Güncelleme:** 2025-11-05
**Next.js Versiyon:** 15.5.2
**React Versiyon:** 18.3.1
