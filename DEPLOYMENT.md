# 🚀 Petfendy Deployment Guide

Bu dokümantasyon Petfendy uygulamasının farklı ortamlara nasıl deploy edileceğini açıklar.

## 📋 Ön Gereksinimler

### Tüm Deployment Yöntemleri için:
- Node.js 18+
- npm veya pnpm
- Git

### Docker Deployment için:
- Docker 20.10+
- Docker Compose 2.0+

## 🔧 Environment Setup

### 1. Environment Dosyası Oluşturma

```bash
cp .env.example .env.local
```

### 2. Environment Değişkenlerini Düzenleme

`.env.local` dosyasını açın ve aşağıdaki değerleri güncelleyin:

#### Zorunlu Değişkenler:

```env
# JWT Secrets - MUTLAKA DEĞİŞTİRİN!
JWT_SECRET=<openssl rand -base64 32 ile üretin>
JWT_REFRESH_SECRET=<openssl rand -base64 32 ile üretin>

# Encryption Key - MUTLAKA DEĞİŞTİRİN!
NEXT_PUBLIC_ENCRYPTION_KEY=<openssl rand -base64 32 ile üretin>
```

#### Opsiyonel (Production için önerilir):

```env
# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@petfendy.com

# Payment Gateway
PAYMENT_PROVIDER=iyzico  # veya paytr, stripe
PAYMENT_API_KEY=your-payment-api-key
PAYMENT_SECRET_KEY=your-payment-secret-key
```

### 3. Güvenli Secret Üretme

```bash
# JWT Secret üretme
openssl rand -base64 32

# Encryption Key üretme
openssl rand -base64 32
```

## 🐳 Docker Deployment (Önerilen)

### Hızlı Başlangıç

```bash
# Deployment script'i kullanarak
./deploy.sh
```

Script menüsünden "1) Docker Compose (Production)" seçin.

### Manuel Docker Deployment

```bash
# 1. Docker image oluşturma
docker build -t petfendy:latest .

# 2. Container başlatma
docker run -p 3000:3000 --env-file .env.local petfendy:latest
```

### Docker Compose ile Deployment

```bash
# Build ve başlatma
docker-compose up -d --build

# Logları görüntüleme
docker-compose logs -f

# Durdurma
docker-compose down

# Yeniden başlatma
docker-compose restart
```

### Docker Health Check

Container'ın sağlık durumunu kontrol etme:

```bash
docker ps
# STATUS kolonunda (healthy) görmelisiniz

# Manuel health check
curl http://localhost:3000/api/health
```

## 💻 Local/Manual Deployment

### Development Mode

```bash
# Dependencies yükleme
npm install --legacy-peer-deps

# Development server başlatma
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

### Production Mode

```bash
# Dependencies yükleme
npm install --legacy-peer-deps

# Production build
npm run build

# Production server başlatma
npm start
```

## ☁️ Cloud Platform Deployment

### Vercel (En Kolay)

1. Vercel hesabınıza giriş yapın: https://vercel.com
2. "New Project" → GitHub repository'nizi seçin
3. Environment Variables ekleyin (`.env.example` dosyasındaki tüm değişkenler)
4. "Deploy" butonuna tıklayın

**Environment Variables:**
- Vercel Dashboard → Settings → Environment Variables
- `.env.local` dosyasındaki TÜM değişkenleri ekleyin

### Railway

```bash
# Railway CLI kurulumu
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Environment variables ekleme
railway variables set JWT_SECRET=<your-secret>
# ... diğer variables

# Deploy
railway up
```

### DigitalOcean App Platform

1. DigitalOcean hesabınıza giriş yapın
2. App Platform → "Create App"
3. GitHub repository'nizi bağlayın
4. Environment Variables ekleyin
5. Deploy edin

### AWS (Docker ile)

#### ECR ve ECS kullanarak:

```bash
# 1. ECR repository oluşturma
aws ecr create-repository --repository-name petfendy

# 2. Docker login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# 3. Image build ve tag
docker build -t petfendy .
docker tag petfendy:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/petfendy:latest

# 4. Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/petfendy:latest

# 5. ECS Task Definition ve Service oluşturma (AWS Console'dan)
```

## 🔒 Production Güvenlik Checklist

Deploy öncesi kontrol listesi:

- [ ] Tüm environment variables güvenli değerlerle ayarlandı
- [ ] JWT_SECRET production için üretildi (openssl rand -base64 32)
- [ ] ENCRYPTION_KEY production için üretildi
- [ ] Test credentials production'dan kaldırıldı
- [ ] HTTPS sertifikası yüklendi
- [ ] Payment gateway production keys eklendi
- [ ] Email service konfigüre edildi
- [ ] Rate limiting production values ayarlandı
- [ ] Error logging servisleri aktif (Sentry, LogRocket vb.)
- [ ] Monitoring kuruldu (New Relic, Datadog vb.)
- [ ] Backup stratejisi hazır
- [ ] SSL/TLS sertifikaları geçerli
- [ ] Firewall kuralları ayarlandı
- [ ] CORS ayarları production domain'e göre yapılandı

## 📊 Monitoring ve Maintenance

### Logları Görüntüleme

```bash
# Docker logs
docker-compose logs -f petfendy-app

# Sadece son 100 satır
docker-compose logs --tail=100 petfendy-app

# Belirli bir zamandan sonraki loglar
docker-compose logs --since 2024-01-01T00:00:00 petfendy-app
```

### Performance Monitoring

Production'da kullanılabilecek servisler:
- **Vercel Analytics** (Vercel deployment için built-in)
- **Google Analytics**
- **Sentry** (Error tracking)
- **New Relic** (APM)
- **Datadog** (Infrastructure monitoring)

### Database Backup (Production için önerilir)

Şu anda localStorage kullanılıyor. Production için:

1. **PostgreSQL** veya **MongoDB** kullanın
2. Otomatik backup schedule'ı oluşturun
3. Backup'ları farklı bir region'da saklayın

```bash
# Örnek PostgreSQL backup
pg_dump petfendy_db > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * /usr/bin/pg_dump petfendy_db > /backups/backup_$(date +\%Y\%m\%d).sql
```

## 🔄 CI/CD Pipeline

### GitHub Actions Örneği

`.github/workflows/deploy.yml` oluşturun:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker Image
        run: docker build -t petfendy:latest .

      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push petfendy:latest

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/petfendy
            docker-compose pull
            docker-compose up -d
```

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Port 3000'i kullanan process'i bulma
lsof -ti:3000

# Process'i durdurma
kill -9 $(lsof -ti:3000)
```

### Docker Build Fails

```bash
# Cache'i temizleme
docker-compose build --no-cache

# Tüm Docker resources'ları temizleme (DİKKAT!)
docker system prune -a
```

### Permission Errors

```bash
# Node modules'ı temizleme
rm -rf node_modules package-lock.json

# Yeniden yükleme
npm install --legacy-peer-deps
```

### Environment Variables Not Loading

```bash
# Docker'da env variables'ı kontrol etme
docker-compose config

# Container içinde kontrol
docker exec -it petfendy printenv | grep JWT
```

## 📞 Destek

Sorun yaşıyorsanız:

1. [GitHub Issues](https://github.com/your-username/petfendy/issues) açın
2. Email: support@petfendy.com
3. Güvenlik sorunları için: security@petfendy.com

## 📚 İlgili Dökümanlar

- [README.md](README.md) - Genel proje bilgisi
- [SECURITY.md](SECURITY.md) - Güvenlik dokümantasyonu
- [HANDOVER.md](HANDOVER.md) - Proje devir dokümantasyonu

---

**Petfendy ile güvenli deployment! 🐾**
