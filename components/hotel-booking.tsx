"use client"

import { useState } from "react"
import type { HotelRoom, Booking, Order } from "@/lib/types"
import { mockHotelRooms } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from 'next-intl';
import { toast } from "@/components/ui/use-toast"
import { PaymentModal } from "@/components/payment-modal"
import { useAuth } from "@/components/auth-context"
import { sendEmail } from "@/lib/email-service"

interface HotelBookingProps {
  onLoginRequest?: () => void
}

export function HotelBooking({ onLoginRequest }: HotelBookingProps = {}) {
  const t = useTranslations('hotel');
  const { user } = useAuth()
  const [rooms] = useState<HotelRoom[]>(mockHotelRooms)
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const calculateNights = (): number => {
    if (!checkInDate || !checkOutDate) return 0
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = (): number => {
    if (!selectedRoom) return 0
    return selectedRoom.pricePerNight * calculateNights()
  }

  const handleBooking = () => {
    setError("")
    setSuccess("")

    if (!selectedRoom) {
      setError(t('selectRoomError'))
      return
    }

    if (!checkInDate || !checkOutDate) {
      setError(t('selectDatesError'))
      return
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    if (checkOut <= checkIn) {
      setError(t('dateValidationError'))
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
    if (!selectedRoom) return

    const nights = calculateNights()
    const total = calculateTotal()

    // Create booking
    const booking: Booking = {
      id: `hotel-${Date.now()}`,
      userId: paymentData.guestInfo ? null : user?.id || null,
      roomId: selectedRoom.id,
      petId: null,
      startDate: new Date(checkInDate),
      endDate: new Date(checkOutDate),
      totalPrice: total,
      type: "hotel",
      status: "confirmed",
      createdAt: new Date(),
      specialRequests,
    }

    // Create order
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: paymentData.guestInfo ? null : user?.id || null,
      bookingId: booking.id,
      bookingType: "hotel",
      bookingDetails: {
        roomName: selectedRoom.name,
        checkInDate,
        checkOutDate,
        specialRequests,
        pricePerNight: selectedRoom.pricePerNight,
        nights,
      },
      totalPrice: total,
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
      subject: "Rezervasyon Onayı",
      body: `Rezervasyonunuz onaylandı! Rezervasyon No: ${booking.id}`,
    })

    // Show success message
    toast({
      title: "✅ Rezervasyon Başarılı!",
      description: `${selectedRoom.name} rezervasyonunuz oluşturuldu. Toplam: ₺${total}`,
      duration: 5000,
    })

    // Reset form
    setSelectedRoom(null)
    setCheckInDate("")
    setCheckOutDate("")
    setSpecialRequests("")
    setShowPaymentModal(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all ${selectedRoom?.id === room.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedRoom(room)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{room.name}</CardTitle>
                <CardDescription>{t(`roomTypes.${room.type}`)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t('capacity')}</p>
                  <p className="font-semibold">{room.capacity} {t('pets')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('price')}</p>
                  <p className="text-xl font-bold text-primary">₺{room.pricePerNight}{t('perNight')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('amenities')}</p>
                  <ul className="text-sm space-y-1">
                    {room.amenities.map((amenity, idx) => (
                      <li key={idx}>• {amenity}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <Card>
          <CardHeader>
            <CardTitle>{t('roomDetails', { roomName: selectedRoom.name })}</CardTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('checkIn')}</label>
                <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('checkOut')}</label>
                <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('specialRequests')}</label>
              <Input
                type="text"
                placeholder={t('specialRequestsPlaceholder')}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            {checkInDate && checkOutDate && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>{t('nights')}:</span>
                  <span className="font-semibold">{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('nightPrice')}:</span>
                  <span className="font-semibold">₺{selectedRoom.pricePerNight}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>{t('total')}:</span>
                  <span className="text-primary">₺{calculateTotal()}</span>
                </div>
              </div>
            )}

            <Button onClick={handleBooking} className="w-full" size="lg">
              Rezervasyon Yap
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedRoom && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          bookingType="hotel"
          bookingDetails={{
            roomName: selectedRoom.name,
            checkInDate,
            checkOutDate,
            specialRequests,
            pricePerNight: selectedRoom.pricePerNight,
            nights: calculateNights(),
          }}
          totalAmount={calculateTotal()}
          userEmail={user?.email}
          isGuest={!user}
          onLoginRequest={onLoginRequest}
        />
      )}
    </div>
  )
}
