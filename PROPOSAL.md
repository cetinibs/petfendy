# 🐾 Petfendy - Proje Teklifi

## Proje Özeti

**Proje Adı:** Petfendy - Evcil Hayvan Oteli ve Köpek Eğitim Merkezi
**Versiyon:** 1.0
**Tarih:** 05 Kasım 2025
**Durum:** Geliştirme Aşamasında
**Konum:** Ankara, Türkiye

---

## 📋 İçindekiler

1. [Giriş](#giriş)
2. [Problem Tanımı](#problem-tanımı)
3. [Önerilen Çözüm](#önerilen-çözüm)
4. [Teknik Mimari](#teknik-mimari)
5. [Özellikler ve Fonksiyonaliteler](#özellikler-ve-fonksiyonaliteler)
6. [Güvenlik](#güvenlik)
7. [Roadmap](#roadmap)
8. [Bütçe ve Kaynaklar](#bütçe-ve-kaynaklar)
9. [Beklenen Sonuçlar](#beklenen-sonuçlar)
10. [Risk Analizi](#risk-analizi)

---

## 🎯 Giriş

Petfendy, Ankara'da faaliyet gösteren evcil hayvan sahiplerine **güvenli, konforlu ve profesyonel** hizmet sunan dijital bir platformdur. Bu proje, evcil hayvan oteli rezervasyonu, hayvan taksi hizmeti ve kullanıcı yönetimini tek bir çatı altında toplayan modern bir web uygulaması geliştirmeyi hedeflemektedir.

### Vizyon
Türkiye'nin en güvenilir ve teknolojik altyapıya sahip evcil hayvan hizmet platformu olmak.

### Misyon
Evcil hayvan sahiplerine 7/24 erişilebilir, güvenli ve kullanıcı dostu bir rezervasyon deneyimi sunmak.

---

## 🔍 Problem Tanımı

### Mevcut Sorunlar

1. **Rezervasyon Zorlukları**
   - Geleneksel yöntemlerle (telefon, yüz yüze) rezervasyon yapma zorluğu
   - Müsaitlik durumunu anlık öğrenememe
   - Manuel fiyat hesaplama hataları

2. **Güven Eksikliği**
   - Online ödeme sistemlerinin güvensiz olması
   - Kişisel ve finansal bilgilerin korunmaması endişeleri
   - Rezervasyon onayı alamama

3. **Erişilebilirlik**
   - Sadece çalışma saatlerinde rezervasyon yapabilme
   - Çok dilli destek eksikliği
   - Mobil uyumluluk sorunları

4. **Yönetim Verimsizliği**
   - Manuel rezervasyon takibi
   - Gelir raporlama zorluğu
   - Müşteri iletişim yönetimi

---

## 💡 Önerilen Çözüm

Petfendy, yukarıda belirtilen tüm sorunları çözmek için **modern web teknolojileri** kullanarak geliştirilmiş, kapsamlı bir dijital platformdur.

### Ana Çözüm Bileşenleri

#### 1. **Online Rezervasyon Sistemi**
- Anlık oda müsaitlik kontrolü
- Dinamik fiyatlandırma motoru
- Otomatik rezervasyon onayı
- 7/24 erişilebilir platform

#### 2. **Enterprise-Grade Güvenlik**
- PCI DSS uyumlu ödeme altyapısı
- AES-256 şifreleme
- JWT kimlik doğrulama
- Multi-layer güvenlik katmanları

#### 3. **Çok Dilli Destek**
- Türkçe ve İngilizce arayüz
- Otomatik dil algılama
- SEO optimizasyonu

#### 4. **Yönetim Paneli**
- Gerçek zamanlı dashboard
- Gelir raporları ve analitics
- Rezervasyon yönetimi
- Kullanıcı ve oda yönetimi

---

## 🏗️ Teknik Mimari

### Frontend Stack

```
Next.js 16 (React 19)
├── TypeScript - Type safety
├── Tailwind CSS - Modern styling
├── Shadcn/ui - UI component library
└── next-intl - Internationalization
```

### Backend & Services

```
Node.js Ecosystem
├── JWT - Authentication
├── bcryptjs - Password hashing (12 rounds)
├── crypto-js - AES-256 encryption
└── localStorage - Mock database (dev)
```

### Production Stack (Önerilen)

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| **Frontend** | Next.js 16 (Vercel) | Server-side rendering, optimal performance |
| **Backend** | Node.js / .NET Core | Scalability, microservices ready |
| **Database** | PostgreSQL | ACID compliance, reliability |
| **Cache** | Redis | Session management, rate limiting |
| **CDN** | CloudFlare | Global distribution, DDoS protection |
| **Email** | SendGrid | Reliable delivery, templates |
| **Payment** | İyzico / PayTR | Local payment methods, 3D Secure |
| **Monitoring** | Sentry + Datadog | Error tracking, performance monitoring |

### Güvenlik Katmanları

```
Security Architecture
├── Layer 1: Network (CloudFlare WAF)
├── Layer 2: Application (Rate Limiting, CORS)
├── Layer 3: Authentication (JWT + Refresh Tokens)
├── Layer 4: Authorization (Role-based access)
├── Layer 5: Data (AES-256 encryption)
└── Layer 6: Monitoring (Audit logs, alerts)
```

---

## ✨ Özellikler ve Fonksiyonaliteler

### 1. 🏨 Pet Otel Rezervasyonu

#### Kullanıcı Özellikleri
- ✅ Tarih aralığı seçimi (check-in/check-out)
- ✅ Oda tipleri: Standart, Deluxe, Suite
- ✅ Dinamik fiyat hesaplama (gece sayısı bazlı)
- ✅ Özel istekler (beslenme, ilaç, oyuncak)
- ✅ Gerçek zamanlı müsaitlik kontrolü
- ✅ Rezervasyon geçmişi görüntüleme
- ✅ E-posta ile onay ve hatırlatmalar

#### Oda Tipleri ve Fiyatlandırma

| Oda Tipi | Özellikler | Fiyat (TL/gece) |
|----------|-----------|----------------|
| **Standart** | Temel konaklama, günlük temizlik | 150 TL |
| **Deluxe** | Geniş alan, oyun ekipmanları, kamera | 250 TL |
| **Suite** | VIP hizmet, özel bakım, veteriner desteği | 400 TL |

### 2. 🚕 Hayvan Taksi Hizmeti

#### Özellikler
- ✅ Şehir içi ve şehirlerarası taşıma
- ✅ Mesafe bazlı otomatik fiyatlandırma
- ✅ Gidiş-dönüş seçeneği
- ✅ Güvenli ve konforlu araçlar
- ✅ Profesyonel sürücüler
- ✅ Gerçek zamanlı konum takibi (v1.2)

#### Fiyatlandırma
- Şehir içi: 15 TL/km
- Şehirlerarası: 12 TL/km
- Gidiş-dönüş: %10 indirim

### 3. 👤 Kullanıcı Yönetimi

#### Kayıt ve Giriş
- ✅ E-posta ile kayıt
- ✅ 6 haneli doğrulama kodu
- ✅ Güvenli şifre politikası (min 8 karakter)
- ✅ Misafir satın alma (üyeliksiz)
- ✅ Şifremi unuttum fonksiyonu

#### Profil Yönetimi
- ✅ Kişisel bilgiler güncelleme
- ✅ Şifre değiştirme
- ✅ Rezervasyon geçmişi
- ✅ Favori ayarlar (ödeme, evcil hayvan bilgileri)

### 4. 💳 Güvenli Ödeme Sistemi

#### PCI DSS Uyumlu Altyapı
- ✅ Kart bilgileri **asla** veritabanında saklanmaz
- ✅ Token-based ödeme sistemi
- ✅ AES-256 şifreleme
- ✅ Luhn algoritması ile kart doğrulama
- ✅ 3D Secure desteği
- ✅ Fraud detection (v1.3)

#### Desteklenen Ödeme Yöntemleri
- Kredi Kartı (Visa, MasterCard, American Express)
- Banka Kartı (Debit)
- Online Havale (v1.2)
- Sanal Pos Entegrasyonları: İyzico, PayTR

### 5. 🛡️ Güvenlik Özellikleri

#### Authentication & Authorization
```typescript
// JWT Token Strategy
- Access Token: 15 dakika (kısa ömürlü)
- Refresh Token: 7 gün (güvenli saklanır)
- HTTPS-only cookies
- CSRF protection
```

#### Password Security
```typescript
// Bcrypt Configuration
- Salt rounds: 12
- Minimum password: 8 karakter
- Complexity requirements: Büyük harf, küçük harf, rakam
- Password history: Son 5 şifre kullanılamaz (v1.2)
```

#### Rate Limiting
```typescript
// DDoS & Brute Force Protection
- Login: 5 deneme / 15 dakika
- API: 100 istek / 15 dakika
- Payment: 3 deneme / saat
- Registration: 3 kayıt / saat / IP
```

#### Security Headers
```typescript
Content-Security-Policy: Strict XSS protection
X-Frame-Options: DENY (Clickjacking)
X-Content-Type-Options: nosniff
Strict-Transport-Security: HSTS enabled
Referrer-Policy: strict-origin-when-cross-origin
```

### 6. 🔒 Veri Gizliliği

#### Encryption at Rest
- Hassas kullanıcı verileri (telefon, adres): AES-256
- Ödeme tokenları: Separate encryption key
- Şifreler: Bcrypt hash (irreversible)

#### Encryption in Transit
- TLS 1.3 (minimum TLS 1.2)
- Perfect Forward Secrecy (PFS)
- HTTPS-only redirects

#### Logging Policy
```typescript
// Secure Logging
✅ Log: Eylemler, hata kodları, IP, timestamp
❌ ASLA Log: Şifreler, kart bilgileri, hassas PII
- Log retention: 90 gün
- Automated PII scrubbing
```

### 7. 📊 Admin Panel

#### Dashboard
- Günlük/haftalık/aylık rezervasyon grafikleri
- Gelir analizi
- Doluluk oranları
- Kullanıcı istatistikleri

#### Rezervasyon Yönetimi
- Aktif rezervasyonlar
- Geçmiş rezervasyonlar
- Manuel rezervasyon ekleme
- İptal ve değişiklik işlemleri

#### Oda Yönetimi
- Oda ekleme/düzenleme/silme
- Fiyat güncelleme
- Müsaitlik durumu
- Bakım modu

#### Kullanıcı Yönetimi
- Kullanıcı listesi
- Rol atama (admin, staff, user)
- Kullanıcı engelleme
- Aktivite logları

---

## 🔐 Güvenlik

### OWASP Top 10 Koruma Durumu

| # | Tehdit | Koruma Durumu | Uygulanan Kontrol |
|---|--------|---------------|-------------------|
| 1 | Broken Access Control | ✅ Korumalı | JWT + Role-based access |
| 2 | Cryptographic Failures | ✅ Korumalı | AES-256 + TLS 1.3 |
| 3 | Injection | ✅ Korumalı | Input sanitization, parameterized queries |
| 4 | Insecure Design | ✅ Korumalı | Security-first architecture |
| 5 | Security Misconfiguration | ✅ Korumalı | Security headers, hardened configs |
| 6 | Vulnerable Components | ⚠️ İzleniyor | Automated dependency scanning |
| 7 | Auth Failures | ✅ Korumalı | MFA ready, rate limiting |
| 8 | Data Integrity Failures | ✅ Korumalı | Code signing, integrity checks |
| 9 | Logging Failures | ✅ Korumalı | Centralized secure logging |
| 10 | SSRF | ✅ Korumalı | URL validation, allowlists |

### Compliance Readiness

| Standart | Durum | Notlar |
|----------|-------|--------|
| **PCI DSS** | ✅ Level 1 Ready | Kart bilgileri saklanmıyor |
| **GDPR** | ⚠️ Partial | User consent, data deletion (v1.2) |
| **KVKK** | ⚠️ Partial | Veri envanterleme gerekli |
| **ISO 27001** | 🔄 Planning | Security audit scheduled |

### Güvenlik Test Süreci

```bash
# Planlı Güvenlik Testleri
1. Static Analysis (SAST) - SonarQube
2. Dynamic Analysis (DAST) - OWASP ZAP
3. Dependency Scanning - npm audit, Snyk
4. Penetration Testing - Quarterly
5. Bug Bounty Program - v2.0
```

---

## 🗺️ Roadmap

### Phase 1: MVP (v1.0) - ✅ Tamamlandı
**Süre:** 3 ay
**Durum:** Tamamlandı (Kasım 2025)

- [x] Pet otel rezervasyon sistemi
- [x] Hayvan taksi rezervasyonu
- [x] Kullanıcı kaydı ve girişi
- [x] E-posta doğrulama
- [x] Güvenli ödeme altyapısı
- [x] Temel güvenlik (JWT, Bcrypt, Rate Limiting)
- [x] Çok dilli destek (TR/EN)
- [x] Responsive tasarım

### Phase 2: Admin & Analytics (v1.1) - 🔄 Devam Ediyor
**Süre:** 2 ay
**Başlangıç:** Aralık 2025

- [ ] Admin dashboard
- [ ] Rezervasyon yönetimi
- [ ] Gelir raporları ve grafikler
- [ ] Oda ve fiyat yönetimi
- [ ] Kullanıcı yönetimi
- [ ] PDF fatura oluşturma
- [ ] SMS bildirim entegrasyonu

### Phase 3: Advanced Features (v1.2) - 📅 Planlandı
**Süre:** 2 ay
**Başlangıç:** Şubat 2026

- [ ] Rezervasyon geçmişi ve tekrar rezervasyon
- [ ] Favori evcil hayvan profilleri
- [ ] Online havale ile ödeme
- [ ] Google Maps entegrasyonu (mesafe)
- [ ] Gerçek zamanlı konum takibi (taksi)
- [ ] Push notifications
- [ ] GDPR/KVKK tam uyumluluk
- [ ] Password history
- [ ] Two-Factor Authentication (2FA)

### Phase 4: AI & Mobile (v2.0) - 💡 Gelecek Vizyon
**Süre:** 4 ay
**Başlangıç:** Nisan 2026

- [ ] AI-powered dinamik fiyatlandırma
- [ ] Chatbot müşteri desteği
- [ ] iOS ve Android mobil uygulamaları
- [ ] Kamera ile oda görüntüleme
- [ ] Blockchain-based ödeme (kripto)
- [ ] API marketplace (3rd party entegrasyonlar)
- [ ] Machine learning ile fraud detection
- [ ] Multi-location support (franchise model)

---

## 💰 Bütçe ve Kaynaklar

### Geliştirme Maliyeti (MVP - v1.0)

| Kalem | Süre | Maliyet | Toplam |
|-------|------|---------|--------|
| **Frontend Geliştirme** | 60 gün | 1,500 TL/gün | 90,000 TL |
| **Backend Geliştirme** | 45 gün | 1,800 TL/gün | 81,000 TL |
| **UI/UX Tasarım** | 20 gün | 1,200 TL/gün | 24,000 TL |
| **Güvenlik Test & Audit** | 10 gün | 2,000 TL/gün | 20,000 TL |
| **DevOps & Deployment** | 15 gün | 1,600 TL/gün | 24,000 TL |
| **Proje Yönetimi** | 90 gün | 800 TL/gün | 72,000 TL |
| **Toplam İş Gücü** | | | **311,000 TL** |

### Altyapı ve Servis Maliyetleri (Yıllık)

| Servis | Açıklama | Aylık | Yıllık |
|--------|----------|-------|--------|
| **Vercel Pro** | Hosting + CDN | $20 | $240 |
| **PostgreSQL** | Managed DB (AWS RDS) | $50 | $600 |
| **Redis** | Cache & sessions | $30 | $360 |
| **SendGrid** | Email (50K/ay) | $15 | $180 |
| **CloudFlare** | WAF + DDoS | $20 | $240 |
| **Sentry** | Error tracking | $26 | $312 |
| **SSL Certificate** | Wildcard | - | $100 |
| **Domain** | .com + .com.tr | - | $50 |
| **İyzico/PayTR** | Payment gateway | % komisyon | - |
| **SMS Gateway** | Turkcell/Netgsm | değişken | ~$300 |
| **Toplam Altyapı** | | | **~$2,400/yıl** |

### Toplam MVP Maliyeti
**Tek Seferlik:** 311,000 TL
**Yıllık İşletme:** ~75,000 TL (₺30/$ kur ile)
**TOPLAM İLK YIL:** ~386,000 TL

### ROI Projeksiyonu

```
Varsayımlar:
- Ortalama rezervasyon: 200 TL
- Aylık hedef: 500 rezervasyon
- Komisyon: %10

Aylık Gelir = 500 × 200 × 0.10 = 10,000 TL
Yıllık Gelir = 10,000 × 12 = 120,000 TL

Break-even: ~3.2 yıl (konservatif senaryoda)
```

---

## 📈 Beklenen Sonuçlar

### Kullanıcı Metrikleri (İlk Yıl)

| Metrik | Hedef | KPI |
|--------|-------|-----|
| **Aktif Kullanıcı** | 5,000 | User registration rate |
| **Aylık Rezervasyon** | 500 | Conversion rate: %10 |
| **Tekrar Rezervasyon** | %40 | Customer retention |
| **Kullanıcı Memnuniyeti** | 4.5/5 | NPS Score |
| **Ortalama Rezervasyon Değeri** | 250 TL | Revenue per booking |

### İş Değeri

#### Operasyonel Verimlilik
- ⏱️ %70 manuel işlem azalması
- 📞 %50 telefon trafiği düşüşü
- 📧 Otomatik mail gönderimi
- 💰 Gerçek zamanlı gelir takibi

#### Müşteri Deneyimi
- 🌍 7/24 erişilebilirlik
- ⚡ Anlık rezervasyon onayı
- 🔒 Güvenli ödeme
- 🌐 Çok dilli destek

#### Rekabet Avantajı
- 🚀 Modern teknoloji stack
- 🛡️ Enterprise-grade güvenlik
- 📱 Mobil uyumlu tasarım
- 🤖 AI-ready altyapı (v2.0)

---

## ⚠️ Risk Analizi

### Teknik Riskler

| Risk | Olasılık | Etki | Önlem |
|------|----------|------|-------|
| **Ödeme Gateway Hatası** | Orta | Yüksek | Fallback gateway, monitoring |
| **DDoS Saldırısı** | Düşük | Yüksek | CloudFlare WAF, rate limiting |
| **Veri Kaybı** | Düşük | Kritik | Automated backups, 3x replication |
| **3rd Party API Downtime** | Orta | Orta | Circuit breaker, fallback APIs |
| **Performance İssue** | Orta | Orta | Load testing, CDN, caching |

### İş Riskleri

| Risk | Olasılık | Etki | Önlem |
|------|----------|------|-------|
| **Düşük Kullanıcı Adaptasyonu** | Orta | Yüksek | Marketing campaign, referral program |
| **Yüksek İşletme Maliyeti** | Düşük | Orta | Cloud cost optimization |
| **Regulasyon Değişikliği** | Orta | Orta | Legal compliance monitoring |
| **Rekabet** | Yüksek | Orta | Continuous innovation, UX focus |

### Risk Azaltma Stratejileri

```typescript
// Teknik Risk Azaltma
1. Automated testing (>80% coverage)
2. Monitoring & alerting (24/7)
3. Incident response plan
4. Regular security audits
5. Disaster recovery plan (RTO: 4 saat, RPO: 1 saat)

// İş Risk Azaltma
1. User feedback loops
2. A/B testing for features
3. Competitive analysis (quarterly)
4. Financial runway: 12 ay
5. Diversification of revenue streams
```

---

## 🎯 Başarı Kriterleri

### Teknik KPI'lar

| Metrik | Hedef | Ölçüm Yöntemi |
|--------|-------|---------------|
| **Uptime** | 99.9% | Monitoring (Datadog) |
| **Page Load Time** | <2 saniye | Lighthouse, Core Web Vitals |
| **API Response Time** | <200ms (p95) | APM tools |
| **Error Rate** | <0.1% | Sentry error tracking |
| **Security Score** | A+ | Observatory, SecurityHeaders |

### İş KPI'lar

| Metrik | Hedef | Ölçüm Yöntesi |
|--------|-------|---------------|
| **Monthly Active Users (MAU)** | 2,000 (6 ay) | Analytics |
| **Conversion Rate** | >8% | Funnel analysis |
| **Customer Retention** | >40% | Cohort analysis |
| **Net Promoter Score (NPS)** | >50 | Quarterly survey |
| **Revenue Growth** | +20% MoM | Financial reports |

---

## 📞 İletişim ve Destek

### Proje Ekibi

| Rol | İsim | İletişim |
|-----|------|----------|
| **Product Manager** | Çetin Kaya | product@petfendy.com |
| **Tech Lead** | - | tech@petfendy.com |
| **Security Lead** | - | security@petfendy.com |

### Destek Kanalları

- 🌐 **Website:** [petfendy.com](https://petfendy.com)
- 📧 **Genel:** info@petfendy.com
- 🔒 **Güvenlik:** security@petfendy.com
- 💬 **Destek:** support@petfendy.com
- 📱 **Telefon:** +90 312 XXX XX XX

---

## 📚 Ek Dokümantasyon

- [README.md](README.md) - Kurulum ve kullanım kılavuzu
- [PRD.md](prd.md) - Product Requirements Document
- [ERD.md](erd.md) - Entity Relationship Diagram
- [SECURITY.md](SECURITY.md) - Güvenlik dokümantasyonu
- [SECURITY-SUMMARY.md](SECURITY-SUMMARY.md) - Güvenlik özeti
- [HANDOVER.md](HANDOVER.md) - Proje devir belgesi

---

## ✅ Onay ve İmzalar

### Proje Onay Matrisi

| Rol | İsim | Tarih | İmza |
|-----|------|-------|------|
| **Product Owner** | - | - | - |
| **Technical Architect** | - | - | - |
| **Security Officer** | - | - | - |
| **Business Stakeholder** | - | - | - |

---

## 📝 Revizyon Geçmişi

| Versiyon | Tarih | Değişiklikler | Hazırlayan |
|----------|-------|---------------|------------|
| 1.0 | 05.11.2025 | İlk proposal oluşturuldu | Çetin Kaya |

---

## 🏁 Sonuç

Petfendy projesi, **modern web teknolojileri**, **enterprise-grade güvenlik** ve **kullanıcı odaklı tasarım** ile Ankara'nın ve Türkiye'nin lider evcil hayvan hizmet platformu olma potansiyeline sahiptir.

### Neden Petfendy?

✅ **Güvenlik Öncelikli:** PCI DSS uyumlu, OWASP korumalı
✅ **Modern Teknoloji:** Next.js 16, TypeScript, scalable architecture
✅ **Kullanıcı Deneyimi:** Çok dilli, responsive, accessible
✅ **İş Değeri:** Operasyonel verimlilik, müşteri memnuniyeti
✅ **Gelecek Vizyonu:** AI-ready, mobile-first, API-first

Bu teklif, **güvenli**, **ölçeklenebilir** ve **sürdürülebilir** bir dijital dönüşüm yol haritası sunmaktadır. Proje, evcil hayvan sahiplerinin ihtiyaçlarını karşılarken, işletme verimliliğini artırmayı ve pazarda rekabet avantajı sağlamayı hedeflemektedir.

---

**Hazırlayan:** Kıdemli Ürün Yöneticisi - Çetin Kaya
**Tarih:** 05 Kasım 2025
**Versiyon:** 1.0

**Petfendy** - Evcil Dostlarınız Güvende! 🐾

---

*Bu belge gizli ve mülkiyete aittir. İzinsiz dağıtım yasaktır.*
