"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addToCart, getCart } from "@/lib/storage"
import { mockHotelRooms, mockTaxiServices, mockTurkishCities } from "@/lib/mock-data"
import type { HotelRoom, TaxiService } from "@/lib/types"
import {
  Home,
  Award,
  Users,
  Calendar,
  Star,
  Check,
  ShoppingCart,
  ChevronRight,
  PawPrint,
  Heart,
  Shield,
  Car,
  MapPin,
  Clock,
  Cat,
  Dog
} from "lucide-react"

export default function HomePage() {
  const t = useTranslations('hotel')
  const tCommon = useTranslations('common')
  const router = useRouter()
  
  // Hotel states
  const [rooms] = useState<HotelRoom[]>(mockHotelRooms)
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  
  // Taxi states
  const [taxiServices] = useState<TaxiService[]>(mockTaxiServices)
  const [selectedService, setSelectedService] = useState<TaxiService | null>(null)
  const [pickupCity, setPickupCity] = useState("")
  const [dropoffCity, setDropoffCity] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [petCount, setPetCount] = useState(1)
  
  // Common states
  const [showReservation, setShowReservation] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [cartItemCount, setCartItemCount] = useState(0)
  
  // Update cart count
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateCount = () => {
        setCartItemCount(getCart().length)
      }
      updateCount()
      
      window.addEventListener('cartUpdated', updateCount)
      return () => window.removeEventListener('cartUpdated', updateCount)
    }
  }, [])

  const stats = [
    { icon: Cat, label: "Misafir Edilen Kediler", value: "600+", color: "text-purple-500" },
    { icon: Dog, label: "Eğitim Verilen Köpek", value: "400+", color: "text-orange-500" },
    { icon: PawPrint, label: "Mutlu Evcil Hayvan", value: "1000+", color: "text-pink-500" },
  ]

  const features = [
    {
      icon: Dog,
      title: "Köpek Oteli & Eğitim",
      description: "7/24 açık köpek oteli ve profesyonel eğitim merkezi",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Cat,
      title: "Kedi Oteli",
      description: "Rahat ve konforlu, kedilere özel konaklama alanları",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Heart,
      title: "Özenli Bakım",
      description: "Pet kuaför, özel beslenme ve sevgi dolu bakım",
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      icon: Car,
      title: "Pet Taksi",
      description: "Güvenli evcil hayvan taşıma servisi, şehir içi ve şehirler arası",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    }
  ]

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

  const handleReservationClick = () => {
    setShowReservation(true)
    setTimeout(() => {
      document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleAddHotelToCart = () => {
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

    const nights = calculateNights()
    const total = calculateTotal()

    const cartItem = {
      id: `hotel-${Date.now()}`,
      type: "hotel" as const,
      itemId: selectedRoom.id,
      quantity: nights,
      price: total,
      details: {
        roomName: selectedRoom.name,
        checkInDate,
        checkOutDate,
        specialRequests,
        pricePerNight: selectedRoom.pricePerNight,
      },
    }

    addToCart(cartItem)
    setSuccess(t('addedToCart', { roomName: selectedRoom.name }))
    
    // Show toast notification
    toast({
      title: "✅ Sepete Eklendi!",
      description: `${selectedRoom.name} sepetinize eklendi. Sepete gidip siparişi tamamlayabilirsiniz.`,
      duration: 3000,
    })
  }

  const calculateDistance = (): number => {
    // Mock distance calculation - in real app, this would use a mapping service
    if (!pickupCity || !dropoffCity) return 0
    
    // If same city, random distance between 5-30km
    if (pickupCity === dropoffCity) {
      return Math.floor(Math.random() * 25) + 5
    }
    
    // If different cities, random distance between 100-600km
    return Math.floor(Math.random() * 500) + 100
  }

  const calculateTaxiTotal = (): number => {
    if (!selectedService) return 0
    const distance = calculateDistance()
    return selectedService.pricePerKm * distance
  }

  const handleAddTaxiToCart = () => {
    setError("")
    setSuccess("")

    if (!selectedService) {
      setError("Lütfen bir taksi servisi seçin")
      return
    }

    if (!pickupCity || !dropoffCity) {
      setError("Lütfen kalkış ve varış şehirlerini seçin")
      return
    }

    if (!pickupLocation || !dropoffLocation) {
      setError("Lütfen kalkış ve varış adreslerini girin")
      return
    }

    if (!pickupDate || !pickupTime) {
      setError("Lütfen tarih ve saat seçin")
      return
    }

    const distance = calculateDistance()
    const total = calculateTaxiTotal()

    const cartItem = {
      id: `taxi-${Date.now()}`,
      type: "taxi" as const,
      itemId: selectedService.id,
      quantity: distance,
      price: total,
      details: {
        serviceName: selectedService.name,
        pickupCity,
        dropoffCity,
        pickupLocation,
        dropoffLocation,
        pickupDate,
        pickupTime,
        petCount,
        distance,
        pricePerKm: selectedService.pricePerKm,
      },
    }

    addToCart(cartItem)
    setSuccess(`${selectedService.name} sepetinize eklendi`)
    
    // Show toast notification
    toast({
      title: "✅ Sepete Eklendi!",
      description: `${selectedService.name} sepetinize eklendi. Sepete gidip siparişi tamamlayabilirsiniz.`,
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 border-b-2 border-orange-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/petfendy-logo.svg"
                alt="Petfendy Logo"
                width={48}
                height={48}
                className="w-12 h-12"
                priority
              />
              <PawPrint className="w-4 h-4 text-pink-500 absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                PETFENDY
                <Dog className="w-5 h-5 text-orange-500" />
                <Cat className="w-5 h-5 text-purple-500" />
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Kedi & Köpek Oteli
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => router.push('/tr')}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Sepet</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="ml-1">{cartItemCount}</Badge>
              )}
            </Button>
            <Button onClick={() => router.push('/tr')}>
              Giriş Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20 relative overflow-hidden">
        {/* Decorative pet icons */}
        <div className="absolute top-10 left-10 opacity-10">
          <Cat className="w-32 h-32 text-purple-400" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Dog className="w-32 h-32 text-orange-400" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10">
          <PawPrint className="w-24 h-24 text-pink-400" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10">
          <PawPrint className="w-20 h-20 text-purple-300" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            {/* Pet icons above title */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-full shadow-lg animate-bounce">
                <Dog className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-3 rounded-full shadow-lg">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-3 rounded-full shadow-lg animate-bounce" style={{animationDelay: '0.2s'}}>
                <Cat className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Petfendy Evcil Hayvan Oteli Ve Köpek Eğitim Merkezi
            </h1>
            <p className="text-xl text-muted-foreground mb-8 flex items-center justify-center gap-2">
              <Cat className="w-6 h-6 text-purple-500" />
              Ankara'nın kedi, köpek ve evcil hayvan oteli
              <Dog className="w-6 h-6 text-orange-500" />
            </p>
            <Button
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-all"
              onClick={handleReservationClick}
            >
              <PawPrint className="w-5 h-5" />
              Rezervasyon Yap
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {stats.map((stat, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-shadow bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-2 mb-4">
              <PawPrint className="w-8 h-8 text-pink-400" />
              <Heart className="w-8 h-8 text-pink-500" />
              <PawPrint className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">
              Neden Petfendy?
            </h2>
            <p className="text-muted-foreground">Kedi ve köpekleriniz için en iyi hizmetler</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className={`text-center hover:shadow-2xl transition-all hover:-translate-y-2 border-2 ${feature.bgColor}`}>
                <CardHeader>
                  <div className={`${feature.bgColor} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      {showReservation && (
        <section id="reservation-section" className="py-20 bg-gradient-to-b from-purple-50/50 to-orange-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-2 mb-4">
                <Dog className="w-8 h-8 text-orange-500" />
                <Heart className="w-8 h-8 text-pink-500" />
                <Cat className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Rezervasyon Yapın
              </h2>
              <p className="text-muted-foreground">Kedi ve köpeğiniz için en uygun hizmeti seçin</p>
            </div>

            <Tabs defaultValue="hotel" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-orange-100 to-purple-100 p-1">
                <TabsTrigger value="hotel" className="gap-2 data-[state=active]:bg-white">
                  <Dog className="w-5 h-5 text-orange-500" />
                  <Cat className="w-5 h-5 text-purple-500" />
                  Otel Rezervasyonu
                </TabsTrigger>
                <TabsTrigger value="taxi" className="gap-2 data-[state=active]:bg-white">
                  <Car className="w-5 h-5 text-blue-500" />
                  Pet Taksi Rezervasyonu
                </TabsTrigger>
              </TabsList>

              {/* Hotel Tab */}
              <TabsContent value="hotel" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-all hover:shadow-xl ${
                        selectedRoom?.id === room.id ? "ring-2 ring-primary shadow-lg" : ""
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{room.name}</CardTitle>
                            <CardDescription>{t(`roomTypes.${room.type}`)}</CardDescription>
                          </div>
                          {selectedRoom?.id === room.id && (
                            <Badge variant="default" className="gap-1">
                              <Check className="w-3 h-3" />
                              Seçildi
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Kapasite</span>
                          <span className="font-semibold flex items-center gap-1">
                            <PawPrint className="w-4 h-4" />
                            {room.capacity} {t('pets')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Fiyat</span>
                          <span className="text-2xl font-bold text-primary">
                            ₺{room.pricePerNight}{t('perNight')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">{t('amenities')}:</p>
                          <ul className="text-sm space-y-1">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-primary fill-primary" />
                                {amenity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Hotel Reservation Details */}
                {selectedRoom && (
                  <Card className="max-w-2xl mx-auto">
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
                        <Alert className="border-green-200 bg-green-50">
                          <AlertDescription className="text-green-800">{success}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('checkIn')}</label>
                          <Input 
                            type="date" 
                            value={checkInDate} 
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('checkOut')}</label>
                          <Input 
                            type="date" 
                            value={checkOutDate} 
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={checkInDate || new Date().toISOString().split('T')[0]}
                          />
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
                        <div className="bg-primary/5 p-4 rounded-lg space-y-2">
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

                      <Button 
                        onClick={handleAddHotelToCart} 
                        className="w-full" 
                        size="lg"
                        disabled={!checkInDate || !checkOutDate}
                      >
                        {t('addToCart')}
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground">
                        Rezervasyonu tamamlamak için giriş yapmanız gerekecektir
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Taxi Tab */}
              <TabsContent value="taxi" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {taxiServices.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all hover:shadow-xl ${
                        selectedService?.id === service.id ? "ring-2 ring-primary shadow-lg" : ""
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{service.name}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                          </div>
                          {selectedService?.id === service.id && (
                            <Badge variant="default" className="gap-1">
                              <Check className="w-3 h-3" />
                              Seçildi
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Kapasite</span>
                          <span className="font-semibold flex items-center gap-1">
                            <PawPrint className="w-4 h-4" />
                            {service.capacity} evcil hayvan
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Fiyat</span>
                          <span className="text-2xl font-bold text-primary">
                            ₺{service.pricePerKm}/km
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Özellikler:</p>
                          <ul className="text-sm space-y-1">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-primary fill-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Taxi Reservation Details */}
                {selectedService && (
                  <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle>Taksi Rezervasyon Detayları - {selectedService.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert className="border-green-200 bg-green-50">
                          <AlertDescription className="text-green-800">{success}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-4">
                        {/* City Selection */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Kalkış Şehri
                            </label>
                            <Select value={pickupCity} onValueChange={setPickupCity}>
                              <SelectTrigger>
                                <SelectValue placeholder="Şehir seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockTurkishCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Varış Şehri
                            </label>
                            <Select value={dropoffCity} onValueChange={setDropoffCity}>
                              <SelectTrigger>
                                <SelectValue placeholder="Şehir seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockTurkishCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Address Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Kalkış Adresi
                            </label>
                            <Input 
                              type="text" 
                              placeholder="Detaylı kalkış adresi"
                              value={pickupLocation} 
                              onChange={(e) => setPickupLocation(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Varış Adresi
                            </label>
                            <Input 
                              type="text" 
                              placeholder="Detaylı varış adresi"
                              value={dropoffLocation} 
                              onChange={(e) => setDropoffLocation(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Tarih
                          </label>
                          <Input 
                            type="date" 
                            value={pickupDate} 
                            onChange={(e) => setPickupDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Saat
                          </label>
                          <Input 
                            type="time" 
                            value={pickupTime} 
                            onChange={(e) => setPickupTime(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <PawPrint className="w-4 h-4" />
                          Evcil Hayvan Sayısı
                        </label>
                        <Input 
                          type="number" 
                          min="1" 
                          max={selectedService.capacity}
                          value={petCount} 
                          onChange={(e) => setPetCount(parseInt(e.target.value) || 1)}
                        />
                      </div>

                      {pickupCity && dropoffCity && (
                        <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span>Güzergah:</span>
                            <span className="font-semibold">{pickupCity} → {dropoffCity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mesafe:</span>
                            <span className="font-semibold">{calculateDistance()} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Km başına fiyat:</span>
                            <span className="font-semibold">₺{selectedService.pricePerKm}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between text-lg font-bold">
                            <span>Toplam:</span>
                            <span className="text-primary">₺{calculateTaxiTotal()}</span>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={handleAddTaxiToCart} 
                        className="w-full" 
                        size="lg"
                        disabled={!pickupCity || !dropoffCity || !pickupLocation || !dropoffLocation || !pickupDate || !pickupTime}
                      >
                        Sepete Ekle
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground">
                        Rezervasyonu tamamlamak için giriş yapmanız gerekecektir
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-20 opacity-20">
          <Cat className="w-40 h-40" />
        </div>
        <div className="absolute bottom-10 right-20 opacity-20">
          <Dog className="w-40 h-40" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="bg-white/20 p-3 rounded-full backdrop-blur">
              <Cat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Kedi ve Köpeğiniz İçin En İyisini Seçin
          </h2>
          <p className="text-lg mb-8 opacity-95">
            Kafessiz konaklama, profesyonel köpek eğitimi, özel kedi bakımı ve güvenli pet taksi hizmetlerimiz ile
            sevimli dostlarınız güvende ve mutlu
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleReservationClick}
            className="gap-2 shadow-xl hover:shadow-2xl"
          >
            <PawPrint className="w-5 h-5" />
            Hemen Rezervasyon Yap
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">İletişim</h3>
              <p className="text-sm text-gray-400">
                Şehit Hikmet Özer Cd. No:101<br />
                Etimesgut/Ankara
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Tel: +90 532 307 3264<br />
                Email: petfendyotel@gmail.com
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Çalışma Saatleri</h3>
              <p className="text-sm text-gray-400">
                Pazartesi - Pazar<br />
                08:00 - 20:00
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Hizmetler</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Köpek Eğitimi</li>
                <li>• Kedi - Köpek Oteli</li>
                <li>• Pet Kuaför</li>
                <li>• Kreş ve Sosyalleşme</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 Petfendy Evcil Hayvan Oteli. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  )
}

