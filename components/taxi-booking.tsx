"use client"

import { useState } from "react"
import type { TaxiService, CityPricing, Booking, Order } from "@/lib/types"
import { mockTaxiServices, mockCityPricings, mockTurkishCities } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PaymentModal } from "@/components/payment-modal"
import { useAuth } from "@/components/auth-context"
import { sendEmail } from "@/lib/email-service"
import { toast } from "@/components/ui/use-toast"

interface TaxiBookingProps {
  onLoginRequest?: () => void
}

export function TaxiBooking({ onLoginRequest }: TaxiBookingProps = {}) {
  const { user } = useAuth()
  const [services] = useState<TaxiService[]>(mockTaxiServices)
  const [cityPricings] = useState<CityPricing[]>(mockCityPricings)
  const [selectedService, setSelectedService] = useState<TaxiService | null>(null)
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Calculate distance based on city pairs or use default
  const getDistance = (): number => {
    if (!fromCity || !toCity) return 0
    
    // Check if there's a predefined city pricing
    const cityPricing = cityPricings.find(
      (cp) => 
        (cp.fromCity === fromCity && cp.toCity === toCity) ||
        (cp.fromCity === toCity && cp.toCity === fromCity)
    )
    
    if (cityPricing) {
      return cityPricing.distanceKm
    }
    
    // Default distance for same city or unknown pairs
    if (fromCity === toCity) return 20
    return 100 // Default distance for unknown city pairs
  }

  const getCityPricing = (): CityPricing | null => {
    if (!fromCity || !toCity) return null
    
    return cityPricings.find(
      (cp) => 
        (cp.fromCity === fromCity && cp.toCity === toCity) ||
        (cp.fromCity === toCity && cp.toCity === fromCity)
    ) || null
  }

  const calculatePrice = (): number => {
    if (!selectedService || !fromCity || !toCity) return 0
    
    const distance = getDistance()
    const cityPricing = getCityPricing()
    
    // Calculate base price: basePrice + (distance * pricePerKm)
    let totalPrice = selectedService.basePrice + (selectedService.pricePerKm * distance)
    
    // Apply round trip multiplier (2x for return journey)
    if (isRoundTrip) {
      totalPrice *= 2
    }
    
    // Apply city-specific additional fees
    if (cityPricing) {
      totalPrice += cityPricing.additionalFee
      
      // Apply discount if available
      if (cityPricing.discount > 0) {
        totalPrice -= (totalPrice * cityPricing.discount) / 100
      }
    }
    
    return totalPrice
  }

  const handleBooking = () => {
    setError("")
    setSuccess("")

    if (!selectedService) {
      setError("Lütfen bir taksi hizmeti seçin")
      return
    }

    if (!fromCity || !toCity) {
      setError("Lütfen kalkış ve varış şehirlerini seçin")
      return
    }

    if (!scheduledDate) {
      setError("Lütfen bir tarih seçin")
      return
    }

    // Open payment modal
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (paymentData: {
    paymentMethod: string
    invoiceInfo: any
    guestInfo?: { email: string; name: string; phone: string }
  }) => {
    if (!selectedService) return

    const distance = getDistance()
    const price = calculatePrice()
    const cityPricing = getCityPricing()

    // Create booking
    const booking: Booking = {
      id: `taxi-${Date.now()}`,
      userId: paymentData.guestInfo ? null : user?.id || null,
      roomId: null,
      petId: null,
      startDate: new Date(scheduledDate),
      endDate: null,
      totalPrice: price,
      type: "taxi",
      status: "confirmed",
      createdAt: new Date(),
      specialRequests: `Pickup: ${fromCity}, Dropoff: ${toCity}${isRoundTrip ? " (Round Trip)" : ""}`,
    }

    // Create order
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: paymentData.guestInfo ? null : user?.id || null,
      bookingId: booking.id,
      bookingType: "taxi",
      bookingDetails: {
        serviceName: selectedService.name,
        pickupLocation: fromCity,
        dropoffLocation: toCity,
        distance,
        scheduledDate,
        isRoundTrip,
        basePrice: selectedService.basePrice,
        pricePerKm: selectedService.pricePerKm,
        additionalFee: cityPricing?.additionalFee || 0,
        discount: cityPricing?.discount || 0,
      },
      totalPrice: price,
      status: "paid",
      paymentMethod: paymentData.paymentMethod as any,
      invoiceNumber: `INV-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem("petfendy_bookings") || "[]")
    existingBookings.push(booking)
    localStorage.setItem("petfendy_bookings", JSON.stringify(existingBookings))

    const existingOrders = JSON.parse(localStorage.getItem("petfendy_orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("petfendy_orders", JSON.stringify(existingOrders))

    // If guest, save guest order
    if (paymentData.guestInfo) {
      const guestOrders = JSON.parse(localStorage.getItem("petfendy_guest_orders") || "[]")
      guestOrders.push({ order, booking, guestInfo: paymentData.guestInfo })
      localStorage.setItem("petfendy_guest_orders", JSON.stringify(guestOrders))
    }

    // Send confirmation email
    const emailAddress = paymentData.guestInfo?.email || user?.email || ""
    await sendEmail({
      to: emailAddress,
      subject: "Taksi Rezervasyon Onayı",
      body: `Taksi rezervasyonunuz onaylandı! Rezervasyon No: ${booking.id}`,
    })

    // Show success message
    toast({
      title: "✅ Rezervasyon Başarılı!",
      description: `${selectedService.name} rezervasyonunuz oluşturuldu. Toplam: ₺${price.toFixed(2)}`,
      duration: 5000,
    })

    // Reset form
    setSelectedService(null)
    setFromCity("")
    setToCity("")
    setIsRoundTrip(false)
    setScheduledDate("")
    setShowPaymentModal(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Hayvan Taksi Hizmeti</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                selectedService?.id === service.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedService(service)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Başlangıç Ücreti</p>
                  <p className="font-semibold">₺{service.basePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Km Başına</p>
                  <p className="font-semibold">₺{service.pricePerKm}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Ağırlık</p>
                  <p className="font-semibold">{service.maxPetWeight} kg</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedService.name} - Rezervasyon Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Kalkış Şehri</label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Şehir seçin</option>
                {mockTurkishCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Varış Şehri</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Şehir seçin</option>
                {mockTurkishCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Switch id="roundtrip" checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
              <Label htmlFor="roundtrip" className="cursor-pointer">
                Gidiş-Dönüş (2x fiyat)
              </Label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tarih ve Saat</label>
              <Input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </div>

            {fromCity && toCity && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mesafe:</span>
                  <span className="font-semibold">{getDistance()} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Başlangıç Ücreti:</span>
                  <span className="font-semibold">₺{selectedService.basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mesafe Ücreti ({getDistance()} km):</span>
                  <span className="font-semibold">
                    ₺{(selectedService.pricePerKm * getDistance()).toFixed(2)}
                  </span>
                </div>
                {isRoundTrip && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Gidiş-Dönüş:</span>
                    <span className="font-semibold">x2</span>
                  </div>
                )}
                {getCityPricing() && getCityPricing()!.additionalFee > 0 && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Şehirler Arası Ek Ücret:</span>
                    <span className="font-semibold">₺{getCityPricing()!.additionalFee}</span>
                  </div>
                )}
                {getCityPricing() && getCityPricing()!.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>İndirim ({getCityPricing()!.discount}%):</span>
                    <span className="font-semibold">
                      -₺{((calculatePrice() / (1 - getCityPricing()!.discount / 100)) * getCityPricing()!.discount / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Toplam:</span>
                  <span className="text-primary">₺{calculatePrice().toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button onClick={handleBooking} className="w-full" size="lg">
              Rezervasyon Yap
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedService && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          bookingType="taxi"
          bookingDetails={{
            serviceName: selectedService.name,
            pickupLocation: fromCity,
            dropoffLocation: toCity,
            distance: getDistance(),
            scheduledDate,
            isRoundTrip,
            basePrice: selectedService.basePrice,
            pricePerKm: selectedService.pricePerKm,
          }}
          totalAmount={calculatePrice()}
          userEmail={user?.email}
          isGuest={!user}
          onLoginRequest={onLoginRequest}
        />
      )}
    </div>
  )
}
