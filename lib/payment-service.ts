// Mock Payment Gateway Service (İyzico / PayTR)
// In production, replace with actual payment gateway integration

export interface PaymentRequest {
  amount: number
  currency: string
  orderReference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  cardDetails?: {
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    cardHolderName: string
  }
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  status: "success" | "failed" | "pending"
  message: string
  paymentUrl?: string
  errorCode?: string
}

export interface RefundRequest {
  transactionId: string
  amount: number
  reason: string
}

class PaymentService {
  private apiKey: string
  private merchantId: string
  private isTestMode: boolean

  constructor() {
    // Get credentials from environment
    this.apiKey = process.env.PAYMENT_API_KEY || ""
    this.merchantId = process.env.PAYMENT_MERCHANT_ID || ""
    this.isTestMode = !this.apiKey || !this.merchantId

    // Security check for production
    if (typeof window === 'undefined') { // Server-side only
      if (process.env.NODE_ENV === 'production' && this.isTestMode) {
        console.error('⚠️ PRODUCTION WARNING: PAYMENT_API_KEY and PAYMENT_MERCHANT_ID not set.');
        console.error('⚠️ Payment service will run in MOCK MODE. Set credentials in Vercel for real payments.');
      } else if (this.isTestMode) {
        console.log('💳 [Payment Service] Running in TEST/MOCK MODE for development');
      }
    }
  }

  /**
   * İyzico-style payment initialization
   */
  async initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log("💳 [Payment Service] Initializing payment...")
    console.log("Amount:", request.amount, request.currency)
    console.log("Order:", request.orderReference)
    console.log("Customer:", request.customerName)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock success response (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: "success",
        message: "Ödeme başarıyla tamamlandı",
        paymentUrl: this.isTestMode ? "https://sandbox.payment.com/checkout" : undefined,
      }
    }

    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Ödeme başarısız oldu. Lütfen kart bilgilerinizi kontrol edin.",
      errorCode: "PAYMENT_FAILED",
    }
  }

  /**
   * PayTR-style payment (3D Secure flow)
   */
  async create3DSecurePayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log("🔒 [Payment Service] Creating 3D Secure payment...")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock 3D Secure redirect
    return {
      success: true,
      transactionId: `3DS-${Date.now()}`,
      status: "pending",
      message: "3D Secure doğrulama için yönlendiriliyorsunuz",
      paymentUrl: this.isTestMode
        ? `https://sandbox.payment.com/3dsecure?token=${Math.random().toString(36).substr(2, 9)}`
        : undefined,
    }
  }

  /**
   * Direct payment with card
   */
  async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!request.cardDetails) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Kart bilgileri eksik",
        errorCode: "MISSING_CARD_DETAILS",
      }
    }

    console.log("💳 [Payment Service] Processing card payment...")
    console.log("Card Holder:", request.cardDetails.cardHolderName)
    console.log("Card Number:", "****" + request.cardDetails.cardNumber.slice(-4))

    // Validate card number (basic check)
    if (request.cardDetails.cardNumber.length < 13) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: "Geçersiz kart numarası",
        errorCode: "INVALID_CARD_NUMBER",
      }
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock success
    return {
      success: true,
      transactionId: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "success",
      message: "Ödeme başarıyla tamamlandı",
    }
  }

  /**
   * Verify payment callback
   */
  async verifyPaymentCallback(token: string): Promise<PaymentResponse> {
    console.log("✅ [Payment Service] Verifying payment callback...")
    console.log("Token:", token)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock verification
    return {
      success: true,
      transactionId: `VERIFIED-${Date.now()}`,
      status: "success",
      message: "Ödeme doğrulandı",
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(request: RefundRequest): Promise<PaymentResponse> {
    console.log("💰 [Payment Service] Processing refund...")
    console.log("Transaction ID:", request.transactionId)
    console.log("Amount:", request.amount)
    console.log("Reason:", request.reason)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock success
    return {
      success: true,
      transactionId: `REFUND-${Date.now()}`,
      status: "success",
      message: "İade işlemi başarıyla tamamlandı",
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    console.log("🔍 [Payment Service] Checking payment status...")
    console.log("Transaction ID:", transactionId)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock status check
    return {
      success: true,
      transactionId,
      status: "success",
      message: "Ödeme tamamlandı",
    }
  }

  /**
   * Get available installments for amount
   */
  async getAvailableInstallments(amount: number): Promise<
    Array<{
      installment: number
      totalAmount: number
      installmentAmount: number
    }>
  > {
    console.log("📊 [Payment Service] Getting installment options...")

    // Mock installment calculations
    const installments = [
      { installment: 1, rate: 0 },
      { installment: 2, rate: 0.02 },
      { installment: 3, rate: 0.03 },
      { installment: 6, rate: 0.06 },
      { installment: 9, rate: 0.09 },
      { installment: 12, rate: 0.12 },
    ]

    return installments.map((opt) => {
      const totalAmount = amount * (1 + opt.rate)
      return {
        installment: opt.installment,
        totalAmount,
        installmentAmount: totalAmount / opt.installment,
      }
    })
  }

  /**
   * Calculate commission/fees
   */
  calculateCommission(amount: number, paymentMethod: "credit_card" | "bank_transfer" | "wallet"): number {
    const commissionRates = {
      credit_card: 0.029, // 2.9%
      bank_transfer: 0.01, // 1%
      wallet: 0, // No commission
    }

    return amount * commissionRates[paymentMethod]
  }
}

export const paymentService = new PaymentService()





