"use client"

import { useState, useMemo } from "react"
import type { TaxiService, CityPricing, SharedTaxiSchedule } from "@/lib/types"
import { mockTaxiServices, mockCityPricings, mockTurkishCities, mockSharedTaxiSchedules } from "@/lib/mock-data"
import { addToCart } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export function TaxiBooking() {
  const [services] = useState<TaxiService[]>(mockTaxiServices)
  const [cityPricings] = useState<CityPricing[]>(mockCityPricings)
  const [schedules] = useState<SharedTaxiSchedule[]>(mockSharedTaxiSchedules)
  const [selectedService, setSelectedService] = useState<TaxiService | null>(null)
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [selectedSchedule, setSelectedSchedule] = useState<SharedTaxiSchedule | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [numberOfSeats, setNumberOfSeats] = useState(1)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // VIP taksi servisleri
  const vipServices = services.filter((s) => s.taxiType === "vip")
  // Paylaşımlı taksi servisleri
  const sharedServices = services.filter((s) => s.taxiType === "shared")

  // Paylaşımlı taksi için müsait tarihler ve programlar
  const availableSchedules = useMemo(() => {
    if (!selectedService || selectedService.taxiType !== "shared" || !fromCity || !toCity) {
      return []
    }

    return schedules.filter(
      (schedule) =>
        schedule.taxiServiceId === selectedService.id &&
        ((schedule.fromCity === fromCity && schedule.toCity === toCity) ||
          (schedule.fromCity === toCity && schedule.toCity === fromCity)) &&
        schedule.status === "active" &&
        schedule.bookedCount < schedule.maxCapacity
    )
  }, [selectedService, fromCity, toCity, schedules])

  // Takvimde aktif olacak tarihler (paylaşımlı taksi için)
  const availableDates = useMemo(() => {
    return availableSchedules.map((s) => {
      const date = new Date(s.travelDate)
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    })
  }, [availableSchedules])

  // Tarih seçildiğinde ilgili programı bul
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedSchedule(null)

    if (!date) return

    const schedule = availableSchedules.find((s) => {
      const scheduleDate = new Date(s.travelDate)
      return (
        scheduleDate.getFullYear() === date.getFullYear() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getDate() === date.getDate()
      )
    })

    if (schedule) {
      setSelectedSchedule(schedule)
    }
  }

  // Tarihin seçilebilir olup olmadığını kontrol et
  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.getFullYear() === date.getFullYear() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getDate() === date.getDate()
    )
  }

  // VIP taksi için mesafe hesaplama
  const getDistance = (): number => {
    if (!fromCity || !toCity) return 0

    const cityPricing = cityPricings.find(
      (cp) => (cp.fromCity === fromCity && cp.toCity === toCity) || (cp.fromCity === toCity && cp.toCity === fromCity)
    )

    if (cityPricing) {
      return cityPricing.distanceKm
    }

    if (fromCity === toCity) return 20
    return 100
  }

  const getCityPricing = (): CityPricing | null => {
    if (!fromCity || !toCity) return null

    return (
      cityPricings.find(
        (cp) => (cp.fromCity === fromCity && cp.toCity === toCity) || (cp.fromCity === toCity && cp.toCity === fromCity)
      ) || null
    )
  }

  // VIP taksi için fiyat hesaplama
  const calculateVipPrice = (): number => {
    if (!selectedService || selectedService.taxiType !== "vip" || !fromCity || !toCity) return 0

    const distance = getDistance()
    const cityPricing = getCityPricing()

    let totalPrice = selectedService.basePrice + selectedService.pricePerKm * distance

    if (isRoundTrip) {
      totalPrice *= 2
    }

    if (cityPricing) {
      totalPrice += cityPricing.additionalFee

      if (cityPricing.discount > 0) {
        totalPrice -= (totalPrice * cityPricing.discount) / 100
      }
    }

    return totalPrice
  }

  // Paylaşımlı taksi için fiyat hesaplama
  const calculateSharedPrice = (): number => {
    if (!selectedSchedule || numberOfSeats < 1) return 0
    return selectedSchedule.pricePerSeat * numberOfSeats
  }

  const handleServiceSelect = (service: TaxiService) => {
    setSelectedService(service)
    // Reset form
    setFromCity("")
    setToCity("")
    setIsRoundTrip(false)
    setScheduledDate("")
    setSelectedSchedule(null)
    setSelectedDate(undefined)
    setNumberOfSeats(1)
    setError("")
    setSuccess("")
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

    // VIP taksi için kontroller
    if (selectedService.taxiType === "vip") {
      if (!scheduledDate) {
        setError("Lütfen bir tarih seçin")
        return
      }

      const distance = getDistance()
      const price = calculateVipPrice()
      const cityPricing = getCityPricing()

      const cartItem = {
        id: `taxi-${Date.now()}`,
        type: "taxi" as const,
        itemId: selectedService.id,
        quantity: 1,
        price,
        details: {
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
          taxiType: "vip",
        },
      }

      addToCart(cartItem)
      setSuccess(`${selectedService.name} sepete eklendi!`)
      handleServiceSelect(selectedService) // Reset form
    }
    // Paylaşımlı taksi için kontroller
    else if (selectedService.taxiType === "shared") {
      if (!selectedSchedule) {
        setError("Lütfen bir tarih seçin")
        return
      }

      const remainingSeats = selectedSchedule.maxCapacity - selectedSchedule.bookedCount
      if (numberOfSeats > remainingSeats) {
        setError(`Bu sefer için maksimum ${remainingSeats} koltuk rezerve edebilirsiniz`)
        return
      }

      if (numberOfSeats < 1) {
        setError("Lütfen en az 1 koltuk seçin")
        return
      }

      const price = calculateSharedPrice()

      const cartItem = {
        id: `taxi-${Date.now()}`,
        type: "taxi" as const,
        itemId: selectedService.id,
        quantity: 1,
        price,
        details: {
          serviceName: selectedService.name,
          pickupLocation: fromCity,
          dropoffLocation: toCity,
          scheduledDate: selectedSchedule.travelDate,
          departureTime: selectedSchedule.departureTime,
          numberOfSeats,
          pricePerSeat: selectedSchedule.pricePerSeat,
          scheduleId: selectedSchedule.id,
          taxiType: "shared",
        },
      }

      addToCart(cartItem)
      setSuccess(`${selectedService.name} sepete eklendi! (${numberOfSeats} koltuk)`)
      handleServiceSelect(selectedService) // Reset form
    }
  }

  return (
    <div className="space-y-6">
      {/* VIP Taksi Hizmetleri */}
      <div>
        <h2 className="text-2xl font-bold mb-2">VIP Pet Taxi</h2>
        <p className="text-muted-foreground mb-4">Özel evcil hayvan taşıma servisi - İstediğiniz tarih ve saatte</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vipServices.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                selectedService?.id === service.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {service.name}
                  <Badge variant="secondary">VIP</Badge>
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
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

      {/* Paylaşımlı Taksi Hizmetleri */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Paylaşımlı Pet Taxi</h2>
        <p className="text-muted-foreground mb-4">
          Ekonomik paylaşımlı evcil hayvan taşıma servisi - Programlı seferler
        </p>
        <div className="grid grid-cols-1 gap-4">
          {sharedServices.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                selectedService?.id === service.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {service.name}
                  <Badge variant="outline">Paylaşımlı</Badge>
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Max Ağırlık</p>
                    <p className="font-semibold">{service.maxPetWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maksimum Kapasite</p>
                    <p className="font-semibold">{service.capacity} koltuk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* VIP Taksi Rezervasyon Formu */}
      {selectedService && selectedService.taxiType === "vip" && (
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
                  <span className="font-semibold">₺{(selectedService.pricePerKm * getDistance()).toFixed(2)}</span>
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
                      -₺
                      {(
                        ((calculateVipPrice() / (1 - getCityPricing()!.discount / 100)) * getCityPricing()!.discount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Toplam:</span>
                  <span className="text-primary">₺{calculateVipPrice().toFixed(2)}</span>
                </div>
              </div>
            )}

            <Button onClick={handleBooking} className="w-full" size="lg">
              Sepete Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Paylaşımlı Taksi Rezervasyon Formu */}
      {selectedService && selectedService.taxiType === "shared" && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedService.name} - Rezervasyon Detayları</CardTitle>
            <CardDescription>Sadece programlı seferler için rezervasyon yapabilirsiniz</CardDescription>
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
                onChange={(e) => {
                  setFromCity(e.target.value)
                  setSelectedDate(undefined)
                  setSelectedSchedule(null)
                }}
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
                onChange={(e) => {
                  setToCity(e.target.value)
                  setSelectedDate(undefined)
                  setSelectedSchedule(null)
                }}
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

            {fromCity && toCity && (
              <>
                {availableSchedules.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      Bu rota için müsait sefer bulunmamaktadır. Lütfen farklı bir rota seçin veya VIP taksi
                      hizmetimizi kullanın.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Seyahat Tarihi Seçin</label>
                      <p className="text-xs text-muted-foreground">
                        Sadece programlı seferler için tarihler aktiftir. Dolu ve pasif tarihler seçilemez.
                      </p>
                      <div className="border rounded-lg p-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => !isDateAvailable(date) || date < new Date()}
                          locale={tr}
                          className="mx-auto"
                        />
                      </div>
                    </div>

                    {selectedSchedule && (
                      <>
                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
                          <h4 className="font-semibold">Sefer Bilgileri</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Tarih</p>
                              <p className="font-semibold">
                                {format(new Date(selectedSchedule.travelDate), "dd MMMM yyyy", { locale: tr })}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Kalkış Saati</p>
                              <p className="font-semibold">{selectedSchedule.departureTime}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Koltuk Başına Fiyat</p>
                              <p className="font-semibold">₺{selectedSchedule.pricePerSeat}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Müsait Koltuk</p>
                              <p className="font-semibold text-green-600">
                                {selectedSchedule.maxCapacity - selectedSchedule.bookedCount} / {selectedSchedule.maxCapacity}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Koltuk Sayısı</label>
                          <Input
                            type="number"
                            min={1}
                            max={selectedSchedule.maxCapacity - selectedSchedule.bookedCount}
                            value={numberOfSeats}
                            onChange={(e) => setNumberOfSeats(parseInt(e.target.value) || 1)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Maksimum {selectedSchedule.maxCapacity - selectedSchedule.bookedCount} koltuk seçebilirsiniz
                          </p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Koltuk Başına:</span>
                            <span className="font-semibold">₺{selectedSchedule.pricePerSeat}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Koltuk Sayısı:</span>
                            <span className="font-semibold">{numberOfSeats}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-lg font-bold">
                            <span>Toplam:</span>
                            <span className="text-primary">₺{calculateSharedPrice().toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <Button onClick={handleBooking} className="w-full" size="lg" disabled={!selectedSchedule}>
              Sepete Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
