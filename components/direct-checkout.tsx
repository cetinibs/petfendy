"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'
import { useAuth } from "@/components/auth-context"
import { processPayment } from "@/lib/payment-service-secure"
import { validateCardNumber, validateCVV } from "@/lib/encryption"
import { emailService } from "@/lib/email-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Lock, User, Building2, UserPlus, LogIn, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Order } from "@/lib/types"

interface BookingDetails {
  type: "hotel" | "taxi"
  itemId: string
  price: number
  details: Record<string, any>
}

interface DirectCheckoutProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  booking: BookingDetails
}

type CheckoutStep = "auth" | "payment" | "success"

export function DirectCheckout({ isOpen, onClose, onSuccess, booking }: DirectCheckoutProps) {
  const { user, isAuthenticated, login, register } = useAuth()
  const router = useRouter()
  const t = useTranslations('payment')
  const tAuth = useTranslations('auth')
  const locale = useLocale()

  const [step, setStep] = useState<CheckoutStep>(isAuthenticated ? "payment" : "auth")
  const [authMode, setAuthMode] = useState<"login" | "register" | "guest">("login")

  // Guest info
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  })

  // Payment form
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  // Invoice info
  const [invoiceType, setInvoiceType] = useState<"individual" | "corporate">("individual")
  const [invoiceInfo, setInvoiceInfo] = useState({
    individualName: "",
    individualSurname: "",
    individualTcNo: "",
    corporateName: "",
    corporateTaxNo: "",
    corporateAddress: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)

  // Format helpers
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  // Handle login
  const handleLogin = async () => {
    setErrors({})
    if (!loginData.email || !loginData.password) {
      setErrors({ auth: "E-posta ve şifre gereklidir" })
      return
    }

    setIsProcessing(true)
    try {
      await login(loginData.email, loginData.password)
      setStep("payment")
    } catch (error) {
      setErrors({ auth: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin." })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle register
  const handleRegister = async () => {
    setErrors({})
    const newErrors: Record<string, string> = {}

    if (!registerData.email) newErrors.email = "E-posta gereklidir"
    if (!registerData.password || registerData.password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalıdır"
    }
    if (!registerData.name) newErrors.name = "Ad soyad gereklidir"
    if (!registerData.phone) newErrors.phone = "Telefon gereklidir"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsProcessing(true)
    try {
      await register(registerData.email, registerData.password, registerData.name, registerData.phone)
      setStep("payment")
    } catch (error) {
      setErrors({ auth: "Kayıt başarısız. Lütfen tekrar deneyin." })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle guest continue
  const handleGuestContinue = () => {
    setErrors({})
    const newErrors: Record<string, string> = {}

    if (!guestInfo.name) newErrors.name = "Ad soyad gereklidir"
    if (!guestInfo.email) newErrors.email = "E-posta gereklidir"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin"
    }
    if (!guestInfo.phone) newErrors.phone = "Telefon gereklidir"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStep("payment")
  }

  // Validate payment form
  const validatePaymentForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const cardDigits = paymentData.cardNumber.replace(/\s/g, '')
    if (!validateCardNumber(cardDigits)) {
      newErrors.cardNumber = "Geçersiz kart numarası"
    }

    const cardHolderRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/
    if (paymentData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = "Kart sahibi adı en az 3 karakter olmalıdır"
    } else if (!cardHolderRegex.test(paymentData.cardHolder)) {
      newErrors.cardHolder = "Kart sahibi adı sadece harf içermelidir"
    }

    const expiryParts = paymentData.expiryDate.split('/')
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiryDate = "Son kullanma tarihi geçersiz (AA/YY)"
    } else {
      const month = parseInt(expiryParts[0])
      const year = parseInt(expiryParts[1])

      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Geçersiz ay"
      }

      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = "Kartın süresi dolmuş"
      }
    }

    if (!validateCVV(paymentData.cvv)) {
      newErrors.cvv = "CVV geçersiz (3-4 hane)"
    }

    // Validate invoice info
    if (invoiceType === "individual") {
      if (!invoiceInfo.individualName.trim()) {
        newErrors.individualName = "Ad alanı zorunludur"
      }
      if (!invoiceInfo.individualSurname.trim()) {
        newErrors.individualSurname = "Soyad alanı zorunludur"
      }
      if (!invoiceInfo.individualTcNo.trim()) {
        newErrors.individualTcNo = "TC Kimlik No zorunludur"
      } else if (!/^\d{11}$/.test(invoiceInfo.individualTcNo)) {
        newErrors.individualTcNo = "TC Kimlik No 11 haneli olmalıdır"
      }
    } else {
      if (!invoiceInfo.corporateName.trim()) {
        newErrors.corporateName = "Şirket adı zorunludur"
      }
      if (!invoiceInfo.corporateTaxNo.trim()) {
        newErrors.corporateTaxNo = "Vergi No zorunludur"
      } else if (!/^\d{10}$/.test(invoiceInfo.corporateTaxNo)) {
        newErrors.corporateTaxNo = "Vergi No 10 haneli olmalıdır"
      }
      if (!invoiceInfo.corporateAddress.trim()) {
        newErrors.corporateAddress = "Şirket adresi zorunludur"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle payment
  const handlePayment = async () => {
    if (!validatePaymentForm()) return

    setIsProcessing(true)
    try {
      const customerEmail = isAuthenticated ? user?.email || "" : guestInfo.email
      const customerName = isAuthenticated ? user?.name || "" : guestInfo.name

      const paymentResult = await processPayment({
        amount: booking.price,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        cardHolder: paymentData.cardHolder,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        email: customerEmail,
      })

      if (paymentResult.success) {
        // Create order
        const order: Order = {
          id: `order-${Date.now()}`,
          userId: isAuthenticated ? user?.id || "guest" : `guest-${Date.now()}`,
          items: [{
            id: `item-${Date.now()}`,
            type: booking.type,
            itemId: booking.itemId,
            quantity: 1,
            price: booking.price,
            details: booking.details,
          }],
          totalPrice: booking.price,
          status: "paid",
          paymentMethod: "credit_card",
          invoiceNumber: `INV-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Store order
        const orders = JSON.parse(localStorage.getItem("petfendy_orders") || "[]")
        orders.push(order)
        localStorage.setItem("petfendy_orders", JSON.stringify(orders))

        // Create booking
        const bookingRecord = {
          id: `booking-${Date.now()}`,
          userId: isAuthenticated ? user?.id || null : null,
          type: booking.type,
          totalPrice: booking.price,
          status: "confirmed" as const,
          createdAt: new Date(),
          ...booking.details
        }

        const existingBookings = JSON.parse(localStorage.getItem("petfendy_bookings") || "[]")
        localStorage.setItem("petfendy_bookings", JSON.stringify([...existingBookings, bookingRecord]))

        // Store guest info if guest checkout
        if (!isAuthenticated) {
          const guestOrders = JSON.parse(localStorage.getItem("petfendy_guest_orders") || "[]")
          guestOrders.push({ order, guestInfo })
          localStorage.setItem("petfendy_guest_orders", JSON.stringify(guestOrders))
        }

        // Send emails
        if (customerEmail && customerName) {
          await emailService.sendBookingConfirmationEmail({
            customerEmail,
            customerName,
            bookingType: booking.type,
            bookingDetails: booking.type === "hotel"
              ? `${booking.details.roomName} (${booking.details.checkInDate} - ${booking.details.checkOutDate})`
              : `${booking.details.serviceName} (${booking.details.pickupLocation} → ${booking.details.dropoffLocation})`,
            bookingDate: new Date(),
            totalAmount: booking.price
          })

          await emailService.sendInvoiceEmail({
            customerName,
            customerEmail,
            invoiceNumber: order.invoiceNumber,
            totalAmount: booking.price,
            items: [{
              name: booking.type === "hotel" ? booking.details.roomName : booking.details.serviceName,
              quantity: 1,
              price: booking.price
            }]
          })
        }

        setOrderDetails(order)
        setStep("success")

        toast({
          title: "Ödeme Başarılı!",
          description: `Rezervasyonunuz oluşturuldu. Fatura ${customerEmail} adresine gönderildi.`,
          duration: 5000,
        })
      } else {
        setErrors({ payment: paymentResult.message || t('paymentFailed') })
      }
    } catch (error) {
      setErrors({ payment: t('paymentFailed') })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle close
  const handleClose = () => {
    if (step === "success") {
      onSuccess()
    }
    onClose()
    // Reset state
    setStep(isAuthenticated ? "payment" : "auth")
    setAuthMode("login")
    setGuestInfo({ name: "", email: "", phone: "" })
    setLoginData({ email: "", password: "" })
    setRegisterData({ email: "", password: "", name: "", phone: "" })
    setPaymentData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" })
    setInvoiceInfo({
      individualName: "",
      individualSurname: "",
      individualTcNo: "",
      corporateName: "",
      corporateTaxNo: "",
      corporateAddress: "",
    })
    setErrors({})
    setOrderDetails(null)
  }

  // Booking summary component
  const BookingSummary = () => (
    <div className="bg-muted p-4 rounded-lg mb-4">
      <h4 className="font-semibold mb-2">Rezervasyon Özeti</h4>
      <div className="space-y-1 text-sm">
        {booking.type === "hotel" ? (
          <>
            <p><span className="text-muted-foreground">Oda:</span> {booking.details.roomName}</p>
            <p><span className="text-muted-foreground">Giriş:</span> {booking.details.checkInDate}</p>
            <p><span className="text-muted-foreground">Çıkış:</span> {booking.details.checkOutDate}</p>
            <p><span className="text-muted-foreground">Gece:</span> {booking.details.nights}</p>
          </>
        ) : (
          <>
            <p><span className="text-muted-foreground">Hizmet:</span> {booking.details.serviceName}</p>
            <p><span className="text-muted-foreground">Güzergah:</span> {booking.details.pickupLocation} → {booking.details.dropoffLocation}</p>
            <p><span className="text-muted-foreground">Tarih:</span> {booking.details.scheduledDate}</p>
            {booking.details.isRoundTrip && <p className="text-blue-600">Gidiş-Dönüş</p>}
          </>
        )}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Toplam:</span>
            <span className="text-primary">₺{booking.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "auth" && "Devam Et"}
            {step === "payment" && (
              <>
                <CreditCard className="w-5 h-5" />
                {t('title')}
              </>
            )}
            {step === "success" && (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Rezervasyon Tamamlandı
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "auth" && "Rezervasyonunuzu tamamlamak için giriş yapın veya üyeliksiz devam edin"}
            {step === "payment" && "Güvenli ödeme - Tüm bilgileriniz şifrelenir"}
            {step === "success" && "Rezervasyonunuz başarıyla oluşturuldu"}
          </DialogDescription>
        </DialogHeader>

        <BookingSummary />

        {/* Auth Step */}
        {step === "auth" && (
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login" className="text-xs">
                <LogIn className="w-3 h-3 mr-1" />
                Giriş Yap
              </TabsTrigger>
              <TabsTrigger value="register" className="text-xs">
                <UserPlus className="w-3 h-3 mr-1" />
                Kayıt Ol
              </TabsTrigger>
              <TabsTrigger value="guest" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                Üyeliksiz
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4 mt-4">
              {errors.auth && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.auth}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">{tAuth('email')}</label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{tAuth('password')}</label>
                <Input
                  type="password"
                  placeholder="********"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={isProcessing}>
                {isProcessing ? "Giriş yapılıyor..." : "Giriş Yap ve Devam Et"}
              </Button>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4 mt-4">
              {errors.auth && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.auth}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">{tAuth('name')}</label>
                <Input
                  placeholder="Ad Soyad"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{tAuth('email')}</label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{tAuth('phone')}</label>
                <Input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{tAuth('password')}</label>
                <Input
                  type="password"
                  placeholder="En az 8 karakter"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <Button onClick={handleRegister} className="w-full" disabled={isProcessing}>
                {isProcessing ? "Kayıt yapılıyor..." : "Kayıt Ol ve Devam Et"}
              </Button>
            </TabsContent>

            {/* Guest Tab */}
            <TabsContent value="guest" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  Üyelik oluşturmadan devam edebilirsiniz. Rezervasyon bilgileri e-posta ile gönderilecektir.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad Soyad *</label>
                <Input
                  placeholder="Ad Soyad"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-posta *</label>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon *</label>
                <Input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <Button onClick={handleGuestContinue} className="w-full">
                Ödemeye Devam Et
              </Button>
            </TabsContent>
          </Tabs>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
            {errors.payment && (
              <Alert variant="destructive">
                <AlertDescription>{errors.payment}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('cardNumber')}</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                  disabled={isProcessing}
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('cardHolder')}</label>
              <Input
                type="text"
                placeholder="AD SOYAD"
                value={paymentData.cardHolder}
                onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value.toUpperCase() })}
                disabled={isProcessing}
              />
              {errors.cardHolder && <p className="text-xs text-destructive">{errors.cardHolder}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('expiryDate')}</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })}
                  disabled={isProcessing}
                  maxLength={5}
                />
                {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  {t('cvv')}
                  <Lock className="w-3 h-3" />
                </label>
                <Input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                  disabled={isProcessing}
                  maxLength={4}
                />
                {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
              </div>
            </div>

            {/* Invoice Type Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fatura Türü</label>
                <Select value={invoiceType} onValueChange={(value: "individual" | "corporate") => setInvoiceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Bireysel Fatura
                      </div>
                    </SelectItem>
                    <SelectItem value="corporate">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Kurumsal Fatura
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {invoiceType === "individual" && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm">Bireysel Fatura Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Ad</label>
                      <Input
                        placeholder="Adınız"
                        value={invoiceInfo.individualName}
                        onChange={(e) => setInvoiceInfo({ ...invoiceInfo, individualName: e.target.value })}
                        disabled={isProcessing}
                      />
                      {errors.individualName && <p className="text-xs text-destructive">{errors.individualName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Soyad</label>
                      <Input
                        placeholder="Soyadınız"
                        value={invoiceInfo.individualSurname}
                        onChange={(e) => setInvoiceInfo({ ...invoiceInfo, individualSurname: e.target.value })}
                        disabled={isProcessing}
                      />
                      {errors.individualSurname && <p className="text-xs text-destructive">{errors.individualSurname}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">TC Kimlik No</label>
                    <Input
                      placeholder="12345678901"
                      value={invoiceInfo.individualTcNo}
                      onChange={(e) => setInvoiceInfo({ ...invoiceInfo, individualTcNo: e.target.value.replace(/\D/g, '').substring(0, 11) })}
                      disabled={isProcessing}
                      maxLength={11}
                    />
                    {errors.individualTcNo && <p className="text-xs text-destructive">{errors.individualTcNo}</p>}
                  </div>
                </div>
              )}

              {invoiceType === "corporate" && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm">Kurumsal Fatura Bilgileri</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Şirket Adı</label>
                      <Input
                        placeholder="Şirket Adı"
                        value={invoiceInfo.corporateName}
                        onChange={(e) => setInvoiceInfo({ ...invoiceInfo, corporateName: e.target.value })}
                        disabled={isProcessing}
                      />
                      {errors.corporateName && <p className="text-xs text-destructive">{errors.corporateName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Vergi No</label>
                      <Input
                        placeholder="1234567890"
                        value={invoiceInfo.corporateTaxNo}
                        onChange={(e) => setInvoiceInfo({ ...invoiceInfo, corporateTaxNo: e.target.value.replace(/\D/g, '').substring(0, 10) })}
                        disabled={isProcessing}
                        maxLength={10}
                      />
                      {errors.corporateTaxNo && <p className="text-xs text-destructive">{errors.corporateTaxNo}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Şirket Adresi</label>
                      <Input
                        placeholder="Şirket adresi"
                        value={invoiceInfo.corporateAddress}
                        onChange={(e) => setInvoiceInfo({ ...invoiceInfo, corporateAddress: e.target.value })}
                        disabled={isProcessing}
                      />
                      {errors.corporateAddress && <p className="text-xs text-destructive">{errors.corporateAddress}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep("auth")} disabled={isProcessing || isAuthenticated}>
                Geri
              </Button>
              <Button type="submit" disabled={isProcessing} className="flex-1">
                {isProcessing ? t('processing') : `₺${booking.price.toFixed(2)} Öde`}
              </Button>
            </div>
          </form>
        )}

        {/* Success Step */}
        {step === "success" && orderDetails && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Ödemeniz Alındı!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Rezervasyon onay e-postası gönderildi.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sipariş No:</span>
                <span className="font-mono">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fatura No:</span>
                <span className="font-mono">{orderDetails.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tutar:</span>
                <span className="font-bold">₺{orderDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Kapat
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
