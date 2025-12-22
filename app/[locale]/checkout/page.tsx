"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getTempReservation, clearTempReservation, isHotelReservation, isTaxiReservation, type HotelReservationData, type TaxiReservationData, type ReservationData } from "@/lib/storage"
import { useAuth } from "@/components/auth-context"
import { PaymentModal } from "@/components/payment-modal"
import { toast } from "@/components/ui/use-toast"
import { emailService } from "@/lib/email-service"
import type { Order } from "@/lib/types"
import { ShoppingBag, User, CreditCard, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [reservation, setReservation] = useState<ReservationData | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<"select" | "guest-info" | "payment">("select")
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Guest information
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const tempReservation = getTempReservation()
    if (!tempReservation) {
      router.push('/tr/home')
      return
    }
    setReservation(tempReservation)
  }, [router])

  const calculateTotal = (): number => {
    return reservation?.totalPrice || 0
  }

  const handleMemberLogin = () => {
    // Store current cart and redirect to login
    router.push('/tr')
  }

  const handleGuestCheckout = () => {
    setCheckoutStep("guest-info")
  }

  const handleGuestInfoSubmit = () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm bilgileri doldurun.",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(guestInfo.email)) {
      toast({
        title: "Geçersiz E-posta",
        description: "Lütfen geçerli bir e-posta adresi girin.",
        variant: "destructive",
      })
      return
    }

    setCheckoutStep("payment")
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async () => {
    if (!reservation) return
    
    setIsLoading(true)
    try {
      // Determine reservation type and create appropriate order
      const isHotel = isHotelReservation(reservation)
      const isTaxi = isTaxiReservation(reservation)
      
      let orderItem: any
      let bookingDetails: string
      let invoiceItems: Array<{ name: string; quantity: number; price: number }> = []

      if (isHotel) {
        const hotelRes = reservation as HotelReservationData
        orderItem = {
          id: `hotel-${Date.now()}`,
          type: "hotel" as const,
          itemId: hotelRes.roomId,
          quantity: hotelRes.nights,
          price: hotelRes.totalPrice,
          details: {
            roomName: hotelRes.roomName,
            checkInDate: hotelRes.checkInDate,
            checkOutDate: hotelRes.checkOutDate,
            petCount: hotelRes.petCount,
            specialRequests: hotelRes.specialRequests,
            additionalServices: hotelRes.additionalServices,
          }
        }
        bookingDetails = `${hotelRes.roomName} (${hotelRes.nights} gece, ${hotelRes.petCount} hayvan)`
        invoiceItems = [
          {
            name: hotelRes.roomName,
            quantity: hotelRes.nights,
            price: hotelRes.basePrice
          },
          ...hotelRes.additionalServices.map(service => ({
            name: service.name,
            quantity: 1,
            price: service.price
          }))
        ]
      } else if (isTaxi) {
        const taxiRes = reservation as TaxiReservationData
        orderItem = {
          id: `taxi-${Date.now()}`,
          type: "taxi" as const,
          itemId: taxiRes.vehicleId || `taxi-${Date.now()}`,
          quantity: 1,
          price: taxiRes.totalPrice,
          details: {
            vehicleName: taxiRes.vehicleName,
            fromCity: taxiRes.fromCity,
            toCity: taxiRes.toCity,
            distanceKm: taxiRes.distanceKm,
            isRoundTrip: taxiRes.isRoundTrip,
            scheduledDate: taxiRes.scheduledDate,
            petCount: taxiRes.petCount,
            specialRequests: taxiRes.specialRequests,
          }
        }
        bookingDetails = `${taxiRes.fromCity} → ${taxiRes.toCity} (${taxiRes.distanceKm} km${taxiRes.isRoundTrip ? ', Gidiş-Dönüş' : ''}, ${taxiRes.petCount} hayvan)`
        invoiceItems = [
          {
            name: `Pet Taksi: ${taxiRes.fromCity} → ${taxiRes.toCity}`,
            quantity: taxiRes.isRoundTrip ? 2 : 1,
            price: taxiRes.basePrice
          }
        ]
      }

      const order: Order = {
        id: `order-${Date.now()}`,
        userId: isAuthenticated ? user?.id || "guest" : `guest-${Date.now()}`,
        items: [orderItem],
        totalPrice: calculateTotal(),
        status: "paid",
        paymentMethod: "credit_card",
        invoiceNumber: `INV-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Store order in localStorage
      const orders = JSON.parse(localStorage.getItem("petfendy_orders") || "[]")
      orders.push(order)
      localStorage.setItem("petfendy_orders", JSON.stringify(orders))

      // Create booking based on type
      let booking: any
      if (isHotel) {
        const hotelRes = reservation as HotelReservationData
        booking = {
          id: `booking-${Date.now()}`,
          userId: isAuthenticated ? user?.id || null : null,
          type: "hotel" as const,
          roomId: hotelRes.roomId,
          petId: null,
          startDate: new Date(hotelRes.checkInDate),
          endDate: new Date(hotelRes.checkOutDate),
          totalPrice: hotelRes.totalPrice,
          status: "confirmed" as const,
          specialRequests: hotelRes.specialRequests,
          createdAt: new Date(),
        }
      } else if (isTaxi) {
        const taxiRes = reservation as TaxiReservationData
        booking = {
          id: `booking-${Date.now()}`,
          userId: isAuthenticated ? user?.id || null : null,
          type: "taxi" as const,
          vehicleId: taxiRes.vehicleId || null,
          roomId: null,
          petId: null,
          startDate: new Date(taxiRes.scheduledDate),
          endDate: null,
          totalPrice: taxiRes.totalPrice,
          status: "confirmed" as const,
          specialRequests: taxiRes.specialRequests,
          createdAt: new Date(),
        }
      }

      // Store booking
      const existingBookings = JSON.parse(localStorage.getItem("petfendy_bookings") || "[]")
      localStorage.setItem("petfendy_bookings", JSON.stringify([...existingBookings, booking]))

      // Store guest info if guest checkout
      if (!isAuthenticated) {
        const guestOrders = JSON.parse(localStorage.getItem("petfendy_guest_orders") || "[]")
        guestOrders.push({
          order,
          guestInfo,
        })
        localStorage.setItem("petfendy_guest_orders", JSON.stringify(guestOrders))
      }

      // Send confirmation email and invoice
      const customerEmail = isAuthenticated ? user?.email || "" : guestInfo.email
      const customerName = isAuthenticated ? user?.name || "" : guestInfo.name

      if (customerEmail && customerName) {
        // Send booking confirmation email
        await emailService.sendBookingConfirmationEmail({
          customerEmail,
          customerName,
          bookingType: isHotel ? "hotel" : "taxi",
          bookingDetails,
          bookingDate: new Date(),
          totalAmount: calculateTotal()
        })

        // Send invoice email
        await emailService.sendInvoiceEmail({
          customerName,
          customerEmail,
          invoiceNumber: order.invoiceNumber,
          totalAmount: calculateTotal(),
          items: invoiceItems
        })
      }

      clearTempReservation()
      setShowPaymentModal(false)

      // Show success page
      router.push('/tr/checkout/success')
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "❌ Hata",
        description: "Sipariş işlenirken bir hata oluştu.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getUserEmail = () => {
    if (isAuthenticated && user?.email) {
      return user.email
    }
    if (checkoutStep === "payment" && guestInfo.email) {
      return guestInfo.email
    }
    return ""
  }

  // If already authenticated, skip to payment
  useEffect(() => {
    if (isAuthenticated && checkoutStep === "select") {
      setCheckoutStep("payment")
      setShowPaymentModal(true)
    }
  }, [isAuthenticated, checkoutStep])

  if (!reservation) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-16 h-12">
              <Image
                src="/petfendy-logo.svg"
                alt="Petfendy Logo"
                width={64}
                height={48}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-xl font-bold text-primary">PETFENDY</h1>
              <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
                Rezervasyon ve Ödeme
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push('/tr/home')}
          >
            Geri Dön
          </Button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${checkoutStep === "select" ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep === "select" ? "bg-primary text-white" : "bg-gray-200"}`}>
              <User className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline font-medium">Giriş Seçimi</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${checkoutStep === "guest-info" ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep === "guest-info" ? "bg-primary text-white" : "bg-gray-200"}`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline font-medium">Bilgiler</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${checkoutStep === "payment" ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep === "payment" ? "bg-primary text-white" : "bg-gray-200"}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline font-medium">Ödeme</span>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Rezervasyon Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              {isHotelReservation(reservation) ? (
                // Hotel Reservation Summary
                <>
                  <div>
                    <p className="font-semibold text-lg">{reservation.roomName}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.checkInDate} - {reservation.checkOutDate} ({reservation.nights} gece)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.petCount} hayvan
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Oda Ücreti:</span>
                      <span className="font-medium">₺{reservation.basePrice.toFixed(2)}</span>
                    </div>

                    {reservation.additionalServices.length > 0 && (
                      <>
                        <div className="text-sm font-medium pt-2">Ek Hizmetler:</div>
                        {reservation.additionalServices.map((service) => (
                          <div key={service.id} className="flex justify-between text-sm pl-4">
                            <span className="text-muted-foreground">
                              {service.name}
                              {service.duration && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {service.duration}
                                </Badge>
                              )}
                            </span>
                            <span>₺{service.price.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-medium pt-1">
                          <span>Hizmetler Toplamı:</span>
                          <span>₺{reservation.servicesTotal.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : isTaxiReservation(reservation) ? (
                // Taxi Reservation Summary
                <>
                  <div>
                    <p className="font-semibold text-lg">Pet Taksi - {reservation.vehicleName}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.fromCity} → {reservation.toCity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tarih: {reservation.scheduledDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.petCount} hayvan
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mesafe:</span>
                      <span className="font-medium">{reservation.distanceKm} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Km Başı Ücret:</span>
                      <span className="font-medium">₺{reservation.pricePerKm.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yön:</span>
                      <span className="font-medium">{reservation.isRoundTrip ? 'Gidiş-Dönüş' : 'Tek Yön'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2">
                      <span>Taşıma Ücreti:</span>
                      <span>₺{reservation.basePrice.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <Separator />

            <div className="flex justify-between items-center text-xl font-bold">
              <span>Toplam:</span>
              <span className="text-primary">₺{calculateTotal().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Step: Select Login Method */}
        {checkoutStep === "select" && (
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer" onClick={handleMemberLogin}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Üye Olarak Devam Et
                </CardTitle>
                <CardDescription>
                  Hesabınıza giriş yaparak rezervasyonlarınızı takip edin ve özel avantajlardan yararlanın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Giriş Yap / Üye Ol
                </Button>
              </CardContent>
            </Card>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-muted-foreground">veya</span>
              </div>
            </div>

            <Card className="border-2 border-gray-200 hover:border-primary/50 transition-colors cursor-pointer" onClick={handleGuestCheckout}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Misafir Olarak Devam Et
                </CardTitle>
                <CardDescription>
                  Üye olmadan hızlıca rezervasyon yapın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" size="lg">
                  Misafir Olarak Devam Et
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Guest Information */}
        {checkoutStep === "guest-info" && (
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileriniz</CardTitle>
              <CardDescription>
                Rezervasyon detaylarını göndermek için bilgilerinize ihtiyacımız var
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad *</Label>
                <Input
                  id="name"
                  placeholder="Ad Soyad"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                />
              </div>

              <Alert>
                <AlertDescription>
                  Rezervasyon onayı ve fatura bu e-posta adresine gönderilecektir.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCheckoutStep("select")}
                >
                  Geri
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGuestInfoSubmit}
                >
                  Ödemeye Geç
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            if (!isAuthenticated) {
              setCheckoutStep("guest-info")
            }
          }}
          onSuccess={handlePaymentSuccess}
          cartItems={[
            isHotelReservation(reservation) ? {
              id: `hotel-${Date.now()}`,
              type: "hotel" as const,
              itemId: reservation.roomId,
              quantity: reservation.nights,
              price: reservation.totalPrice,
              details: {
                roomName: reservation.roomName,
                checkInDate: reservation.checkInDate,
                checkOutDate: reservation.checkOutDate,
              }
            } : isTaxiReservation(reservation) ? {
              id: `taxi-${Date.now()}`,
              type: "taxi" as const,
              itemId: reservation.vehicleId || `taxi-${Date.now()}`,
              quantity: 1,
              price: reservation.totalPrice,
              details: {
                vehicleName: reservation.vehicleName,
                fromCity: reservation.fromCity,
                toCity: reservation.toCity,
                scheduledDate: reservation.scheduledDate,
              }
            } : {
              id: `unknown-${Date.now()}`,
              type: "hotel" as const,
              itemId: "unknown",
              quantity: 1,
              price: 0,
              details: {}
            }
          ]}
          totalAmount={calculateTotal()}
          userEmail={getUserEmail()}
        />
      </div>
    </div>
  )
}
