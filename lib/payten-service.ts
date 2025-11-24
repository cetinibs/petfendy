// Ziraat Bankası Payten Sanal POS Entegrasyonu
// Production'da gerçek Payten API'sı ile değiştirilecektir

export interface PaytenConfig {
  merchantId: string          // Üye İş Yeri No
  terminalId: string          // Terminal No
  posnetId: string            // PosNet ID
  storeKey: string            // 3D Secure Gizli Anahtar
  apiUrl: string              // API URL
  testMode: boolean           // Test Modu
  enabled: boolean            // Aktif/Pasif
}

export interface PaytenPaymentRequest {
  amount: number              // Tutar (kuruş cinsinden)
  currency: string            // Para birimi (TRY)
  orderId: string             // Sipariş No
  cardNumber: string          // Kart Numarası
  cardExpiry: string          // Son Kullanma Tarihi (YYMM)
  cardCvv: string             // CVV
  cardHolderName: string      // Kart Sahibi Adı
  installment: number         // Taksit Sayısı
  customerIp: string          // Müşteri IP
  customerEmail: string       // Müşteri Email
  customerPhone?: string      // Müşteri Telefon
  use3DSecure: boolean        // 3D Secure kullan
}

export interface PaytenPaymentResponse {
  success: boolean
  transactionId: string
  hostRefNum: string          // Banka Referans No
  authCode: string            // Onay Kodu
  status: 'approved' | 'declined' | 'pending' | 'error'
  statusCode: string
  statusMessage: string
  orderId: string
  amount: number
  redirectUrl?: string        // 3D Secure için yönlendirme URL'i
  errorCode?: string
  errorMessage?: string
}

export interface Payten3DCallbackData {
  orderId: string
  transactionId: string
  status: string
  mdStatus: string            // 3D Secure Doğrulama Durumu
  xid: string
  eci: string
  cavv: string
  md: string
}

// Default Payten Configuration
export const DEFAULT_PAYTEN_CONFIG: PaytenConfig = {
  merchantId: '',
  terminalId: '',
  posnetId: '',
  storeKey: '',
  apiUrl: 'https://posnettest.yapikredi.com.tr/PosnetWebService/XML', // Test URL
  testMode: true,
  enabled: false
}

// Payten API URLs
export const PAYTEN_API_URLS = {
  test: 'https://posnettest.yapikredi.com.tr/PosnetWebService/XML',
  testZiraat: 'https://setmpos.ykb.com/PosnetWebService/XML',
  production: 'https://posnet.yapikredi.com.tr/PosnetWebService/XML',
  productionZiraat: 'https://www.posnet.ykb.com/PosnetWebService/XML'
}

class PaytenService {
  private config: PaytenConfig = DEFAULT_PAYTEN_CONFIG

  /**
   * Payten yapılandırmasını yükle
   */
  loadConfig(): PaytenConfig {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('petfendy_payten_config')
      if (stored) {
        this.config = JSON.parse(stored)
      }
    }
    return this.config
  }

  /**
   * Payten yapılandırmasını kaydet
   */
  saveConfig(config: PaytenConfig): void {
    this.config = config
    if (typeof window !== 'undefined') {
      localStorage.setItem('petfendy_payten_config', JSON.stringify(config))
    }
  }

  /**
   * Yapılandırma durumunu kontrol et
   */
  isConfigured(): boolean {
    return !!(
      this.config.merchantId &&
      this.config.terminalId &&
      this.config.posnetId &&
      this.config.storeKey &&
      this.config.enabled
    )
  }

  /**
   * Hash oluştur (MAC - Message Authentication Code)
   * Production'da server-side'da yapılmalıdır
   */
  private generateHash(data: string): string {
    // SHA-256 hash - production'da server-side
    // Bu mock implementasyon, gerçek implementasyonda crypto kullanılmalı
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  }

  /**
   * Kart numarasını formatla
   */
  private formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\s/g, '')
  }

  /**
   * Tutarı kuruş cinsine çevir
   */
  private formatAmount(amount: number): string {
    return Math.round(amount * 100).toString()
  }

  /**
   * Son kullanma tarihini formatla (YYMM)
   */
  private formatExpiry(expiry: string): string {
    // MM/YY -> YYMM
    const parts = expiry.split('/')
    if (parts.length === 2) {
      return parts[1] + parts[0]
    }
    return expiry
  }

  /**
   * Ödeme başlat
   */
  async initiatePayment(request: PaytenPaymentRequest): Promise<PaytenPaymentResponse> {
    console.log('🏦 [Payten Service] Ödeme başlatılıyor...')
    console.log('Sipariş:', request.orderId)
    console.log('Tutar:', request.amount, request.currency)

    // Yapılandırma kontrolü
    if (!this.isConfigured()) {
      return {
        success: false,
        transactionId: '',
        hostRefNum: '',
        authCode: '',
        status: 'error',
        statusCode: 'CONFIG_ERROR',
        statusMessage: 'Payten yapılandırması eksik',
        orderId: request.orderId,
        amount: request.amount,
        errorCode: 'CONFIG_ERROR',
        errorMessage: 'Lütfen admin panelinden Payten ayarlarını yapılandırın'
      }
    }

    // Test modunda mock response
    if (this.config.testMode) {
      return this.mockPayment(request)
    }

    // Production'da gerçek API çağrısı yapılacak
    return this.processPayment(request)
  }

  /**
   * 3D Secure ödeme başlat
   */
  async initiate3DSecurePayment(request: PaytenPaymentRequest): Promise<PaytenPaymentResponse> {
    console.log('🔐 [Payten Service] 3D Secure ödeme başlatılıyor...')

    if (!this.isConfigured()) {
      return {
        success: false,
        transactionId: '',
        hostRefNum: '',
        authCode: '',
        status: 'error',
        statusCode: 'CONFIG_ERROR',
        statusMessage: 'Payten yapılandırması eksik',
        orderId: request.orderId,
        amount: request.amount,
        errorCode: 'CONFIG_ERROR',
        errorMessage: 'Lütfen admin panelinden Payten ayarlarını yapılandırın'
      }
    }

    // Test modunda mock 3D Secure
    if (this.config.testMode) {
      return this.mock3DSecurePayment(request)
    }

    // Production'da gerçek 3D Secure
    return this.process3DSecurePayment(request)
  }

  /**
   * 3D Secure callback doğrula
   */
  async verify3DCallback(callbackData: Payten3DCallbackData): Promise<PaytenPaymentResponse> {
    console.log('✅ [Payten Service] 3D Secure callback doğrulanıyor...')
    console.log('MD Status:', callbackData.mdStatus)

    // mdStatus kontrolü
    // 1: Kart sahibi doğrulandı
    // 2, 3, 4: Doğrulama başarısız veya kart kayıtlı değil
    if (callbackData.mdStatus !== '1') {
      return {
        success: false,
        transactionId: callbackData.transactionId,
        hostRefNum: '',
        authCode: '',
        status: 'declined',
        statusCode: 'MD_STATUS_FAILED',
        statusMessage: '3D Secure doğrulama başarısız',
        orderId: callbackData.orderId,
        amount: 0,
        errorCode: 'MD_STATUS_' + callbackData.mdStatus,
        errorMessage: this.get3DErrorMessage(callbackData.mdStatus)
      }
    }

    // Doğrulama başarılı
    return {
      success: true,
      transactionId: callbackData.transactionId,
      hostRefNum: `REF-${Date.now()}`,
      authCode: `AUTH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'approved',
      statusCode: '0000',
      statusMessage: '3D Secure ödeme başarılı',
      orderId: callbackData.orderId,
      amount: 0
    }
  }

  /**
   * İade işlemi
   */
  async refundPayment(transactionId: string, amount: number, reason: string): Promise<PaytenPaymentResponse> {
    console.log('💰 [Payten Service] İade işlemi başlatılıyor...')
    console.log('Transaction ID:', transactionId)
    console.log('Tutar:', amount)
    console.log('Sebep:', reason)

    // Mock iade response
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      transactionId: `REFUND-${Date.now()}`,
      hostRefNum: `REF-${Date.now()}`,
      authCode: '',
      status: 'approved',
      statusCode: '0000',
      statusMessage: 'İade işlemi başarılı',
      orderId: transactionId,
      amount: amount
    }
  }

  /**
   * İptal işlemi
   */
  async cancelPayment(transactionId: string): Promise<PaytenPaymentResponse> {
    console.log('❌ [Payten Service] İptal işlemi başlatılıyor...')
    console.log('Transaction ID:', transactionId)

    // Mock iptal response
    await new Promise(resolve => setTimeout(resolve, 800))

    return {
      success: true,
      transactionId: `CANCEL-${Date.now()}`,
      hostRefNum: `REF-${Date.now()}`,
      authCode: '',
      status: 'approved',
      statusCode: '0000',
      statusMessage: 'İptal işlemi başarılı',
      orderId: transactionId,
      amount: 0
    }
  }

  /**
   * Taksit seçeneklerini getir
   */
  async getInstallmentOptions(amount: number, binNumber: string): Promise<Array<{
    installment: number
    totalAmount: number
    installmentAmount: number
    commission: number
  }>> {
    console.log('📊 [Payten Service] Taksit seçenekleri getiriliyor...')
    console.log('BIN:', binNumber.substring(0, 6))

    // Mock taksit seçenekleri
    const options = [
      { installment: 1, rate: 0 },
      { installment: 2, rate: 0.015 },
      { installment: 3, rate: 0.025 },
      { installment: 6, rate: 0.045 },
      { installment: 9, rate: 0.065 },
      { installment: 12, rate: 0.085 }
    ]

    return options.map(opt => {
      const commission = amount * opt.rate
      const totalAmount = amount + commission
      return {
        installment: opt.installment,
        totalAmount,
        installmentAmount: totalAmount / opt.installment,
        commission
      }
    })
  }

  /**
   * Mock ödeme (test modu)
   */
  private async mockPayment(request: PaytenPaymentRequest): Promise<PaytenPaymentResponse> {
    console.log('🧪 [Payten Service] Test modu - Mock ödeme işleniyor...')

    // Simüle gecikme
    await new Promise(resolve => setTimeout(resolve, 1500))

    // %90 başarı oranı
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        hostRefNum: `REF-${Date.now()}`,
        authCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        status: 'approved',
        statusCode: '0000',
        statusMessage: 'Ödeme başarıyla tamamlandı',
        orderId: request.orderId,
        amount: request.amount
      }
    }

    return {
      success: false,
      transactionId: '',
      hostRefNum: '',
      authCode: '',
      status: 'declined',
      statusCode: '0012',
      statusMessage: 'Ödeme reddedildi',
      orderId: request.orderId,
      amount: request.amount,
      errorCode: 'DECLINED',
      errorMessage: 'Kart limiti yetersiz veya kart blokeli'
    }
  }

  /**
   * Mock 3D Secure ödeme (test modu)
   */
  private async mock3DSecurePayment(request: PaytenPaymentRequest): Promise<PaytenPaymentResponse> {
    console.log('🧪 [Payten Service] Test modu - Mock 3D Secure başlatılıyor...')

    await new Promise(resolve => setTimeout(resolve, 800))

    const transactionId = `3DS-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    return {
      success: true,
      transactionId,
      hostRefNum: '',
      authCode: '',
      status: 'pending',
      statusCode: '0000',
      statusMessage: '3D Secure doğrulama için yönlendiriliyorsunuz',
      orderId: request.orderId,
      amount: request.amount,
      redirectUrl: `${this.config.apiUrl}/3dsecure?token=${transactionId}&merchantId=${this.config.merchantId}`
    }
  }

  /**
   * Gerçek ödeme işlemi (production)
   */
  private async processPayment(request: PaytenPaymentRequest): Promise<PaytenPaymentResponse> {
    // Production'da XML request oluşturulup Payten API'sine gönderilecek
    // Bu method server-side'da çalışmalıdır
    console.log('🏦 [Payten Service] Production ödeme - Bu işlem server-side yapılmalıdır')

    // Şimdilik mock döndür
    return this.mockPayment(request)
  }

  /**
   * Gerçek 3D Secure işlemi (production)
   */
  private async process3DSecurePayment(request: PaytenPaymentRequest): Promise<PaytenPaymentResponse> {
    // Production'da XML request oluşturulup Payten API'sine gönderilecek
    console.log('🔐 [Payten Service] Production 3D Secure - Bu işlem server-side yapılmalıdır')

    // Şimdilik mock döndür
    return this.mock3DSecurePayment(request)
  }

  /**
   * 3D Secure hata mesajlarını döndür
   */
  private get3DErrorMessage(mdStatus: string): string {
    const messages: Record<string, string> = {
      '0': '3D Secure doğrulama başarısız',
      '2': 'Kart sahibi veya bankası sisteme kayıtlı değil',
      '3': 'Kartın bankası sisteme kayıtlı değil',
      '4': 'Doğrulama denemesi, kart sahibi sisteme kayıtlı değil',
      '5': 'Doğrulama yapılamıyor',
      '6': '3D Secure hatası',
      '7': 'Sistem hatası',
      '8': 'Bilinmeyen kart numarası',
      '9': 'Üye işyeri 3D-Secure sistemine kayıtlı değil'
    }
    return messages[mdStatus] || 'Bilinmeyen 3D Secure hatası'
  }

  /**
   * Payten hata kodlarını açıkla
   */
  getErrorDescription(errorCode: string): string {
    const errorDescriptions: Record<string, string> = {
      '0000': 'İşlem başarılı',
      '0001': 'Bankayı arayınız',
      '0002': 'Bankayı arayınız (özel)',
      '0003': 'Geçersiz üye işyeri',
      '0004': 'Kart çalınmış / el koy',
      '0005': 'İşlem onaylanmadı',
      '0011': 'VIP işlem onaylandı',
      '0012': 'Geçersiz işlem',
      '0013': 'Geçersiz tutar',
      '0014': 'Geçersiz kart numarası',
      '0015': 'Geçersiz veren kodu',
      '0019': 'İşlemi tekrar deneyiniz',
      '0021': 'İşlem yapılmadı',
      '0025': 'Kayıt bulunamadı',
      '0030': 'Mesaj format hatası',
      '0032': 'Dosya güncelleme hatası',
      '0033': 'Kullanım dışı kart',
      '0034': 'Dolandırıcılık şüphesi',
      '0036': 'Kısıtlanmış kart',
      '0038': 'Parola deneme aşıldı',
      '0041': 'Kayıp kart / el koy',
      '0043': 'Çalıntı kart / el koy',
      '0051': 'Yetersiz bakiye',
      '0052': 'Çek hesabı yok',
      '0053': 'Tasarruf hesabı yok',
      '0054': 'Son kullanma tarihi hatalı',
      '0055': 'Hatalı şifre',
      '0056': 'Kart tanımlı değil',
      '0057': 'Kart sahibi bu işlemi yapamaz',
      '0058': 'Terminalin işlemi yapma yetkisi yok',
      '0059': 'Dolandırıcılık şüphesi',
      '0061': 'Çekim tutarı limiti aşıldı',
      '0062': 'Kısıtlanmış kart',
      '0063': 'Güvenlik ihlali',
      '0065': 'İşlem limiti aşıldı',
      '0075': 'Şifre deneme sayısı aşıldı',
      '0077': 'Uyumsuz veriler',
      '0078': 'Hesap bulunamadı',
      '0082': 'CVV hatalı',
      '0091': 'Veren kurum hizmet dışı',
      '0092': 'Tanımsız kurum',
      '0093': 'İşlem yasal sebepten tamamlanamıyor',
      '0096': 'Sistem hatası',
      '0099': 'Diğer hatalar'
    }
    return errorDescriptions[errorCode] || `Bilinmeyen hata: ${errorCode}`
  }
}

export const paytenService = new PaytenService()
