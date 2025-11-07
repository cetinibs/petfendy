"use client"

import { useState } from "react"
import type { TaxiService, CityPricing } from "@/lib/types"
import { mockTaxiServices, mockCityPricings, mockTurkishCities } from "@/lib/mock-data"
import { addToCart } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Crown } from "lucide-react"

export function TaxiBooking() {
  const [services] = useState<TaxiService[]>(mockTaxiServices)
  const [cityPricings] = useState<CityPricing[]>(mockCityPricings)
  const [selectedTaxiType, setSelectedTaxiType] = useState<"vip" | "shared" | null>(null)
  const [selectedService, setSelectedService] = useState<TaxiService | null>(null)
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

    const distance = getDistance()
    const price = calculatePrice()
    const cityPricing = getCityPricing()

    const cartItem = {
      id: `taxi-${Date.now()}`,
      type: "taxi" as const,
      itemId: selectedService.id,
      quantity: 1,
      price,
      details: {
        serviceName: selectedService.name,
        taxiType: selectedService.taxiType,
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
    }

    addToCart(cartItem)
    setSuccess(`${selectedService.name} sepete eklendi!`)
    resetForm()
  }

  const resetForm = () => {
    setSelectedTaxiType(null)
    setSelectedService(null)
    setFromCity("")
    setToCity("")
    setIsRoundTrip(false)
    setScheduledDate("")
  }

  const filteredServices = selectedTaxiType
    ? services.filter(s => s.taxiType === selectedTaxiType)
    : []

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        {selectedTaxiType && (
          <Button variant="ghost" size="sm" onClick={resetForm}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        )}
        <h2 className="text-2xl font-bold">Hayvan Taksi Hizmeti</h2>
      </div>

      {/* Step 1: Taxi Type Selection */}
      {!selectedTaxiType && (
        <div>
          <p className="text-muted-foreground mb-6">Lütfen taksi tipi seçiniz:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shared Taxi Option */}
            <Card
              className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary"
              onClick={() => setSelectedTaxiType("shared")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Paylaşımlı Taksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-center text-muted-foreground">
                  Diğer evcil hayvanlarla paylaşımlı, ekonomik taşıma servisi
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Uygun fiyatlı</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Diğer hayvanlarla birlikte</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Belirli saatlerde kalkış</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Güvenli ve temiz</span>
                  </li>
                </ul>
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">Başlangıç fiyatı</p>
                  <p className="text-2xl font-bold text-blue-600">₺30'dan başlayan</p>
                </div>
              </CardContent>
            </Card>

            {/* VIP Taxi Option */}
            <Card
              className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-amber-500"
              onClick={() => setSelectedTaxiType("vip")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">VIP Özel Taksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-center text-muted-foreground">
                  Sadece sizin evcil hayvanınız için özel lüks taşıma
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">★</span>
                    <span>Özel araç - tek hayvan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">★</span>
                    <span>İstediğiniz saatte</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">★</span>
                    <span>Veteriner refakat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600">★</span>
                    <span>Premium konfor</span>
                  </li>
                </ul>
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground">Başlangıç fiyatı</p>
                  <p className="text-2xl font-bold text-amber-600">₺100'den başlayan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Service Selection */}
      {selectedTaxiType && !selectedService && (
        <div>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="font-semibold">
              {selectedTaxiType === "vip" ? "VIP Özel Taksi" : "Paylaşımlı Taksi"} seçtiniz.
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedTaxiType === "vip"
                ? "Lütfen premium taksi servislerinden birini seçin:"
                : "Lütfen paylaşımlı taksi servislerinden birini seçin:"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary"
                onClick={() => setSelectedService(service)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {service.taxiType === "vip" ? (
                      <Crown className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Users className="h-5 w-5 text-blue-600" />
                    )}
                    {service.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Başlangıç Ücreti</p>
                      <p className="font-semibold text-lg">₺{service.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Km Başına</p>
                      <p className="font-semibold text-lg">₺{service.pricePerKm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Ağırlık</p>
                      <p className="font-semibold">{service.maxPetWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kapasite</p>
                      <p className="font-semibold">{service.capacity} hayvan</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Özellikler:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Booking Details */}
      {selectedService && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {selectedService.taxiType === "vip" ? (
                <Crown className="h-5 w-5 text-amber-600" />
              ) : (
                <Users className="h-5 w-5 text-blue-600" />
              )}
              <CardTitle>{selectedService.name} - Rezervasyon Detayları</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{selectedService.description}</p>
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
              Sepete Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
