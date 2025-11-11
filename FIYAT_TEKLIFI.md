# 🐾 PETFENDY YAZILIM PROJESİ - FİYAT TEKLİFİ

**Teklif No:** PTF-2025-001
**Teklif Tarihi:** 11 Ocak 2025
**Geçerlilik:** 30 gün
**Hazırlayan:** [Adınız/Şirket Adınız]

---

## 📋 PROJE ÖZETI

**Proje Adı:** Petfendy - Evcil Hayvan Oteli ve Köpek Eğitim Merkezi
**Proje Tipi:** Full-Stack Web Rezervasyon ve Yönetim Platformu
**Teknoloji:** Next.js 16, TypeScript, React 19, Tailwind CSS
**Kapsam:** Otel rezervasyonu, taksi hizmeti, ödeme sistemi, admin paneli

---

## 🎯 PROJE KAPSAMI

### Mevcut Durum Analizi

Proje şu anda **%85 tamamlanmış** durumda ve aşağıdaki özelliklere sahip:

#### ✅ Tamamlanmış Özellikler
- **Frontend Geliştirme** (%100)
  - Modern, responsive UI tasarımı
  - 100+ React component
  - Çok dilli destek (Türkçe/İngilizce)
  - 20.450+ satır kod

- **Temel Fonksiyonlar** (%90)
  - Otel odası rezervasyon sistemi
  - Pet taksi rezervasyon sistemi
  - Kullanıcı kayıt ve giriş sistemi
  - Admin yönetim paneli
  - Sepet yönetimi
  - Raporlama ve analitik

- **Güvenlik Altyapısı** (%80)
  - JWT authentication
  - Bcrypt password hashing
  - AES-256 şifreleme
  - Rate limiting
  - XSS/CSRF koruması

#### ⚠️ Mock/Geliştirmeye Hazır Özellikler
- Veritabanı (localStorage → PostgreSQL'e geçiş gerekli)
- Ödeme sistemi (Mock → İyzico/PayTR entegrasyonu)
- E-posta servisi (Mock → SendGrid entegrasyonu)
- Production güvenlik ayarları

---

## 💼 HİZMET PAKETLERİ

### 🥉 PAKET 1: TEMEL PRODUCTION HAZIRLIGI
**Fiyat: 12.000 TL**

#### Kapsam:
1. **Güvenlik Güncellemeleri** (2 gün)
   - Hard-coded secret'ları kaldırma
   - Production-ready environment variables
   - HTTPS zorunlu hale getirme
   - TypeScript build hatalarını düzeltme

2. **Veritabanı Entegrasyonu** (3 gün)
   - PostgreSQL şema tasarımı
   - Prisma ORM kurulumu
   - localStorage'dan migration
   - API route'ları oluşturma

3. **E-posta Servisi** (2 gün)
   - SendGrid/Resend entegrasyonu
   - E-posta template'leri
   - Rezervasyon onay mailleri
   - SPF/DKIM ayarları

4. **Temel Test & Deployment** (1 gün)
   - Vercel/Netlify deployment
   - Production environment setup
   - Temel kullanıcı testleri

**Süre:** 8 iş günü
**Çıktı:** Çalışır, güvenli bir production sistemi

---

### 🥈 PAKET 2: TAM ÖZELLİKLİ PRODUCTION (ÖNERİLEN)
**Fiyat: 22.000 TL**

**Paket 1 + Aşağıdaki Eklentiler:**

5. **Ödeme Gateway Entegrasyonu** (4 gün)
   - İyzico veya PayTR entegrasyonu
   - 3D Secure ödeme akışı
   - Webhook yönetimi
   - İade/iptal işlemleri
   - Ödeme logları

6. **Performans Optimizasyonu** (2 gün)
   - Redis cache entegrasyonu
   - Session yönetimi (HttpOnly cookies)
   - API rate limiting (Redis)
   - Image optimization
   - Bundle size optimizasyonu

7. **Monitoring & Logging** (1 gün)
   - Sentry hata takibi
   - Winston/Pino logging
   - Uptime monitoring
   - Admin bildirim sistemi

8. **Kapsamlı Test** (1 gün)
   - End-to-end testler
   - Ödeme akışı testleri
   - Yük testleri
   - Security audit

**Süre:** 16 iş günü
**Çıktı:** Enterprise-grade production sistemi

---

### 🥇 PAKET 3: PREMIUM FULL-SERVICE
**Fiyat: 29.500 TL**

**Paket 2 + Aşağıdaki Eklentiler:**

9. **Gelişmiş Özellikler** (3 gün)
   - SMS bildirimleri (Netgsm/İletimerkezi)
   - WhatsApp Business API entegrasyonu
   - Dinamik fiyatlandırma algoritması
   - QR kod check-in sistemi
   - Müşteri sadakat programı

10. **İş Zekası & Raporlama** (2 gün)
    - Gelişmiş dashboard analytics
    - Revenue forecasting
    - Müşteri segmentasyonu
    - Excel/PDF raporlama iyileştirmeleri
    - Google Analytics 4 entegrasyonu

11. **Mobile Responsive İyileştirmeler** (1 gün)
    - PWA (Progressive Web App) desteği
    - Offline mode
    - Push notifications
    - App-like experience

12. **Dokümantasyon & Eğitim** (1 gün)
    - Kullanıcı kılavuzu (TR/EN)
    - Admin panel eğitimi
    - Video tutorials
    - Teknik dokümantasyon

**Süre:** 23 iş günü
**Çıktı:** Premium, tam özellikli sistem + eğitim

---

## 📊 DETAYLI MALİYET DÖKÜMÜ (PAKET 2 - ÖNERİLEN)

| Hizmet | Süre | Birim Fiyat | Toplam |
|--------|------|-------------|--------|
| **1. Güvenlik & Altyapı** | 2 gün | 1.500 TL | 3.000 TL |
| - Hard-coded secrets temizleme | | | |
| - Production environment setup | | | |
| - TypeScript fix | | | |
| **2. Veritabanı Geliştirme** | 3 gün | 1.500 TL | 4.500 TL |
| - PostgreSQL kurulum & migrasyon | | | |
| - Prisma ORM entegrasyonu | | | |
| - API endpoints | | | |
| **3. E-posta Sistemi** | 2 gün | 1.200 TL | 2.400 TL |
| - SendGrid entegrasyonu | | | |
| - Template tasarımı | | | |
| **4. Ödeme Gateway** | 4 gün | 1.800 TL | 7.200 TL |
| - İyzico/PayTR entegrasyonu | | | |
| - 3D Secure akışı | | | |
| - Webhook & refund | | | |
| **5. Performans & Cache** | 2 gün | 1.200 TL | 2.400 TL |
| - Redis entegrasyonu | | | |
| - Session yönetimi | | | |
| **6. Monitoring & Logging** | 1 gün | 1.000 TL | 1.000 TL |
| - Sentry, logging setup | | | |
| **7. Test & QA** | 1 gün | 1.000 TL | 1.000 TL |
| - End-to-end testler | | | |
| **8. Deployment & DevOps** | 1 gün | 500 TL | 500 TL |
| - Production deployment | | | |
| - Environment configuration | | | |
| | | **TOPLAM** | **22.000 TL** |

---

## 🔧 ÜÇÜNCÜ TARAF HİZMET MALİYETLERİ

**Müşteri Tarafından Karşılanacak Aylık Maliyetler:**

| Servis | Aylık Maliyet | Notlar |
|--------|---------------|---------|
| **PostgreSQL** (Supabase/Neon) | ₺0 - ₺500 | 5 GB'a kadar ücretsiz |
| **Redis** (Upstash) | ₺0 - ₺200 | 10.000 request/gün ücretsiz |
| **E-posta** (SendGrid) | ₺0 - ₺300 | 100 mail/gün ücretsiz |
| **Hosting** (Vercel) | ₺0 - ₺400 | Hobby plan ücretsiz |
| **Monitoring** (Sentry) | ₺0 - ₺200 | 5K event/ay ücretsiz |
| **Ödeme Gateway** | %2.9 + ₺0.30 | İşlem başına komisyon |
| **Domain & SSL** | ₺100 - ₺200 | Yıllık |
| | **TOPLAM** | **₺100 - ₺1.800/ay** |

**Not:** İlk 3-6 ay düşük trafikte neredeyse tüm servisler ücretsiz planlarda kalabilir.

---

## 📅 PROJE TESLİMAT TAKVİMİ (PAKET 2)

### Hafta 1-2: Altyapı & Veritabanı
- **Gün 1-2:** Güvenlik güncellemeleri
- **Gün 3-5:** PostgreSQL & Prisma setup
- **Gün 6-7:** E-posta entegrasyonu
- **Gün 8:** İlk deployment & test

**Milestone 1:** Temel sistem çalışır durumda

### Hafta 3: Ödeme & Optimizasyon
- **Gün 9-12:** Ödeme gateway entegrasyonu
- **Gün 13-14:** Redis & performans
- **Gün 15:** Monitoring setup

**Milestone 2:** Full-featured production sistemi

### Hafta 4: Test & Canlıya Alma
- **Gün 16:** Kapsamlı testler
- **Gün 17:** Final deployment
- **Gün 18+:** 7 gün ücretsiz destek & bug fix

**Teslim:** 17 iş günü (3-4 hafta)

---

## 🎁 TEKLİFE DAHİL OLAN EKSTRA HİZMETLER

### Tüm Paketlerde Dahil:
✅ **7 gün ücretsiz teknik destek** (teslim sonrası)
✅ **Kod dokümantasyonu** (inline comments & README)
✅ **Git versiyon kontrolü** (organize commit history)
✅ **Deployment kılavuzu** (step-by-step)
✅ **Environment setup scripts**
✅ **Admin paneli kullanım rehberi**

### Paket 2 & 3'te Ek Olarak:
✅ **30 gün teknik destek** (e-posta/telefon)
✅ **2 saat online eğitim** (admin paneli kullanımı)
✅ **Monitoring dashboard setup**
✅ **Security best practices dokümantasyonu**

---

## 🔒 GARANTİ & DESTEK POLİTİKASI

### Garanti Kapsamı (Teslim Sonrası 30 Gün)
✅ Kod hatalarının düzeltilmesi
✅ Production ortamında çıkan kritik hataların giderilmesi
✅ Performans iyileştirmeleri (belirtilen metrikler dahilinde)
✅ Güvenlik açıklarının kapatılması

### Garanti Dışı
❌ Üçüncü taraf servislerdeki sorunlar (ödeme gateway, e-posta servisi)
❌ Yeni özellik istekleri
❌ Tasarım değişiklikleri
❌ İçerik düzenlemeleri

### Sürekli Destek Paketleri (Opsiyonel)
- **Bronze:** ₺2.500/ay - E-posta desteği, 5 saat/ay
- **Silver:** ₺5.000/ay - E-posta + telefon, 10 saat/ay + küçük güncellemeler
- **Gold:** ₺8.000/ay - Priority destek, 20 saat/ay + yeni özellikler

---

## 💳 ÖDEME KOŞULLARI

### Paket 2 (22.000 TL) İçin:
- **%40 (8.800 TL)** - Sözleşme imzalama
- **%40 (8.800 TL)** - Milestone 1 tamamlandığında (veritabanı + e-posta)
- **%20 (4.400 TL)** - Final teslimat

### Ödeme Yöntemleri:
✅ Banka havalesi (EFT/SWIFT)
✅ Kredi kartı (tek çekim veya taksit)
✅ Fatura kesimi (kurumsal)

---

## 📞 SÖZLEŞME & BAŞLANGIÇ

### Sözleşme Kapsamı:
- İş kapsamı ve deliverable'lar
- Telif hakları (müşteriye devir)
- Gizlilik sözleşmesi (NDA)
- Sorumluluk sınırları
- Değişiklik talepleri prosedürü

### Başlangıç İçin Gerekli:
1. ✅ Sözleşme imzası
2. ✅ İlk ödeme (40%)
3. ✅ Logo ve marka materyalleri
4. ✅ Tercih edilen ödeme gateway bilgileri
5. ✅ Domain ve hosting erişimleri (varsa)
6. ✅ İşletme ile ilgili detaylı bilgiler

**Başlangıç Süresi:** Ödeme onayından sonra 1-2 iş günü

---

## 🎯 NEDEN BU TEKLİFİ KABUL ETMELİSİNİZ?

### ✅ Mevcut Kod Kalitesi
- **20.450+ satır** hazır, test edilmiş kod
- Modern teknoloji stack (Next.js 16, React 19)
- Enterprise-grade güvenlik altyapısı
- %85 tamamlanmış proje

### ✅ Maliyet Avantajı
- Sıfırdan yazma maliyeti: **~₺80.000+**
- Bu teklif ile maliyet: **₺22.000**
- **%70+ tasarruf**

### ✅ Hızlı Piyasaya Çıkış
- Sıfırdan geliştirme: 3-4 ay
- Bu teklif ile: **3-4 hafta**
- **3 kat daha hızlı**

### ✅ Proven & Tested
- Tüm temel özellikler çalışıyor
- UI/UX tasarımı hazır
- 100+ component library
- Çok dilli destek

---

## 📋 PROJE BAŞARI KRİTERLERİ

Proje aşağıdaki kriterleri karşıladığında tamamlanmış sayılacaktır:

### Teknik Kriterler:
✅ PostgreSQL veritabanı entegrasyonu çalışıyor
✅ Ödeme sistemi (İyzico/PayTR) 3D Secure ile çalışıyor
✅ E-posta gönderimi (rezervasyon onayları) çalışıyor
✅ Admin paneli tüm CRUD işlemlerini yapabiliyor
✅ Güvenlik testleri geçildi (OWASP Top 10)
✅ Production ortamında deployment tamamlandı
✅ SSL sertifikası aktif
✅ Monitoring sistemleri çalışıyor

### Performans Metrikleri:
✅ Sayfa yükleme süresi < 3 saniye
✅ Lighthouse score > 90
✅ API response time < 500ms
✅ 99.9% uptime (monitoring ile)

### Fonksiyonel Kriterler:
✅ Kullanıcı kayıt/giriş yapabiliyor
✅ Otel rezervasyonu oluşturulabiliyor
✅ Taksi rezervasyonu oluşturulabiliyor
✅ Ödeme başarıyla tamamlanabiliyor
✅ Admin siparişleri yönetebiliyor
✅ Raporlar Excel/PDF olarak alınabiliyor
✅ E-posta onayları gönderiliyor

---

## 📄 SÖZLEŞME SONRASI HİZMETLER

### Ücretsiz Dahil:
- **7-30 gün teknik destek** (pakete göre)
- Minor bug fixes
- Documentation
- Deployment assistance

### Ücretli Ekstra Hizmetler:
| Hizmet | Fiyat |
|--------|-------|
| Yeni özellik geliştirme | ₺1.500/gün |
| Tasarım değişiklikleri | ₺1.200/gün |
| Üçüncü parti entegrasyon | ₺2.000-5.000 |
| SEO optimizasyonu | ₺3.000 |
| Google Ads setup | ₺2.500 |
| Sosyal medya entegrasyonu | ₺1.500 |
| Mobil app geliştirme | ₺35.000+ |

---

## 🚀 ŞİMDİ HAREKETE GEÇİN!

### Teklif Geçerlilik Süresi: 30 Gün
**Son Kabul Tarihi:** 10 Şubat 2025

### Erken Ödeme İndirimi:
💰 **7 gün içinde sözleşme + ilk ödeme:** %5 indirim
💰 **Tek seferde %100 ödeme:** %8 indirim

**Paket 2 ile Örnek:**
- Normal fiyat: ₺22.000
- 7 gün indirimi: ₺20.900
- Peşin ödeme: ₺20.240

---

## 📞 İLETİŞİM BİLGİLERİ

**Geliştirici/Şirket:**
Ad Soyad: [Adınız]
E-posta: [email@example.com]
Telefon: [+90 5XX XXX XX XX]
Web: [website.com]
LinkedIn: [linkedin.com/in/yourprofile]

**Çalışma Saatleri:**
Pazartesi - Cuma: 09:00 - 18:00
Acil durumlar: 7/24 (production issues)

---

## ✅ KABUL VE ONAY

Bu teklifi kabul ediyorum:

**Müşteri Bilgileri:**
Firma/Şahıs: _______________________
Yetkili Adı: _______________________
İmza: _______________________
Tarih: _______________________

**Seçilen Paket:**
☐ Paket 1 - Temel Production (₺12.000)
☐ Paket 2 - Tam Özellikli Production (₺22.000) ⭐ ÖNERİLEN
☐ Paket 3 - Premium Full-Service (₺29.500)

**Ek Hizmetler:**
☐ Sürekli destek paketi: Bronze / Silver / Gold
☐ Diğer: _______________________

---

## 📎 EKLER

1. **Proje Teknik Dokümantasyonu** (HANDOVER.md)
2. **Güvenlik Raporu** (SECURITY.md)
3. **Özellik Listesi** (README.md)
4. **Demo Video/Screenshots** (isteğe bağlı)
5. **Referans Projeler** (isteğe bağlı)

---

**Hazırlayan:**
[Adınız/Şirket Adınız]
Tarih: 11 Ocak 2025
Versiyon: 1.0

---

**⚠️ ÖNEMLI NOTLAR:**

1. Bu teklif mevcut kod tabanına dayanmaktadır. Kapsamlı değişiklik talepleri ek ücrete tabidir.
2. Üçüncü taraf servis maliyetleri (hosting, database, payment gateway) müşteriye aittir.
3. Proje başlangıcı için müşteri tarafından gerekli erişim ve bilgilerin sağlanması gerekmektedir.
4. Teslimat süreleri, müşteri geri bildirimlerinin zamanında alınmasına bağlıdır.
5. Ödeme şartları sözleşmeye bağlıdır ve her iki taraf için geçerlidir.

---

**© 2025 - Tüm hakları saklıdır.**
