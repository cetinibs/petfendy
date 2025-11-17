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
  Clock
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
    { icon: Users, label: "Misafir Edilen Dostlar", value: "1000+" },
    { icon: Award, label: "Eğitim Verilen Köpek", value: "200+" },
    { icon: Calendar, label: "Kreş ve Sosyalleşme", value: "400+" },
  ]

  const features = [
    {
      icon: Home,
      title: "Kafessiz Konaklama",
      description: "7/24 açık, konforlu ve geniş alanlar"
    },
    {
      icon: Award,
      title: "Profesyonel Eğitim",
      description: "Temel ve ileri seviye köpek eğitimi"
    },
    {
      icon: Heart,
      title: "Özenli Bakım",
      description: "Pet kuaför ve özel bakım hizmetleri"
    },
    {
      icon: Shield,
      title: "Güvenli Ortam",
      description: "24 saat veteriner desteği ve güvenlik"
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
      <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-orange-50 to-purple-50 border-b-2 border-primary/20 shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/petfendy-logo.svg"
                alt="Petfendy Logo"
                width={48}
                height={48}
                className="w-12 h-12 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300"
                priority
              />
              <PawPrint className="absolute -bottom-1 -right-1 w-5 h-5 text-primary animate-bounce" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PETFENDY
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                Evcil Hayvan Oteli
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="gap-2 hover:bg-primary/10 hover:border-primary transition-all hover:scale-105"
              onClick={() => router.push('/tr')}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Sepet</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="ml-1 animate-pulse">{cartItemCount}</Badge>
              )}
            </Button>
            <Button
              onClick={() => router.push('/tr')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all hover:scale-105 shadow-lg"
            >
              Giriş Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        {/* Decorative paw prints */}
        <div className="absolute top-10 left-10 opacity-10">
          <PawPrint className="w-32 h-32 text-primary animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <PawPrint className="w-24 h-24 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-3 mb-4">
              <PawPrint className="w-10 h-10 text-primary animate-bounce" />
              <Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-pulse" />
              <PawPrint className="w-10 h-10 text-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 animate-fade-in">
              Petfendy Evcil Hayvan Oteli Ve Köpek Eğitim Merkezi
            </h1>
            <p className="text-xl text-foreground/80 mb-8 flex items-center justify-center gap-2 flex-wrap">
              <MapPin className="w-5 h-5 text-primary" />
              Ankara'nın kedi, köpek ve evcil hayvan oteli
            </p>
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all hover:scale-110 shadow-2xl text-lg px-8 py-6"
              onClick={handleReservationClick}
            >
              <Calendar className="w-5 h-5" />
              Rezervasyon Yap
              <ChevronRight className="w-5 h-5 animate-bounce-x" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50 bg-gradient-to-br from-white to-orange-50/30"
              >
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 flex items-center justify-center gap-2">
              <Star className="w-8 h-8 text-primary fill-primary" />
              Neden Petfendy?
              <Star className="w-8 h-8 text-secondary fill-secondary" />
            </h2>
            <p className="text-muted-foreground">Evcil dostlarınız için en iyi hizmeti sunuyoruz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-2 hover:border-primary/30 group bg-gradient-to-br from-white to-orange-50/20"
              >
                <CardHeader>
                  <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:rotate-6">
                    <feature.icon className="w-10 h-10 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text group-hover:text-transparent transition-all">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      {showReservation && (
        <section id="reservation-section" className="py-20 bg-gradient-to-br from-orange-50/50 via-white to-purple-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 flex items-center justify-center gap-2">
                <Calendar className="w-8 h-8 text-primary" />
                Rezervasyon Yapın
                <PawPrint className="w-8 h-8 text-secondary" />
              </h2>
              <p className="text-muted-foreground">Evcil dostunuz için en uygun hizmeti seçin</p>
            </div>

            <Tabs defaultValue="hotel" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-2 bg-gradient-to-r from-primary/5 to-secondary/5 h-auto">
                <TabsTrigger
                  value="hotel"
                  className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all py-3 text-base font-medium"
                >
                  <Home className="w-5 h-5" />
                  Otel Rezervasyonu
                </TabsTrigger>
                <TabsTrigger
                  value="taxi"
                  className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all py-3 text-base font-medium"
                >
                  <Car className="w-5 h-5" />
                  Taksi Rezervasyonu
                </TabsTrigger>
              </TabsList>

              {/* Hotel Tab */}
              <TabsContent value="hotel" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 group ${
                        selectedRoom?.id === room.id
                          ? "ring-4 ring-primary shadow-2xl scale-105 bg-gradient-to-br from-orange-50 to-purple-50"
                          : "hover:ring-2 hover:ring-primary/50 bg-white"
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-2 rounded-full">
                              <Home className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text group-hover:text-transparent transition-all">
                                {room.name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <PawPrint className="w-3 h-3" />
                                {t(`roomTypes.${room.type}`)}
                              </CardDescription>
                            </div>
                          </div>
                          {selectedRoom?.id === room.id && (
                            <Badge className="gap-1 bg-gradient-to-r from-primary to-secondary animate-pulse">
                              <Check className="w-3 h-3" />
                              Seçildi
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <PawPrint className="w-4 h-4 text-primary" />
                            Kapasite
                          </span>
                          <span className="font-semibold text-primary">
                            {room.capacity} {t('pets')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Fiyat</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ₺{room.pricePerNight}{t('perNight')}
                          </span>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            {t('amenities')}:
                          </p>
                          <ul className="text-sm space-y-1">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                                <Check className="w-3 h-3 text-accent" />
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
                      className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 group ${
                        selectedService?.id === service.id
                          ? "ring-4 ring-primary shadow-2xl scale-105 bg-gradient-to-br from-orange-50 to-purple-50"
                          : "hover:ring-2 hover:ring-primary/50 bg-white"
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-2 rounded-full">
                              <Car className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text group-hover:text-transparent transition-all">
                                {service.name}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {service.description}
                              </CardDescription>
                            </div>
                          </div>
                          {selectedService?.id === service.id && (
                            <Badge className="gap-1 bg-gradient-to-r from-primary to-secondary animate-pulse">
                              <Check className="w-3 h-3" />
                              Seçildi
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <PawPrint className="w-4 h-4 text-primary" />
                            Kapasite
                          </span>
                          <span className="font-semibold text-primary">
                            {service.capacity} evcil hayvan
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Fiyat</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ₺{service.pricePerKm}/km
                          </span>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            Özellikler:
                          </p>
                          <ul className="text-sm space-y-1">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                                <Check className="w-3 h-3 text-accent" />
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
      <section className="relative py-20 bg-gradient-to-br from-primary via-secondary to-accent text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <PawPrint className="absolute top-10 left-20 w-24 h-24 animate-pulse" />
          <PawPrint className="absolute bottom-20 right-40 w-32 h-32 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Heart className="absolute top-1/2 right-20 w-20 h-20 animate-bounce" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center gap-3 mb-4">
            <PawPrint className="w-12 h-12 animate-bounce" />
            <Heart className="w-12 h-12 fill-white animate-pulse" />
            <PawPrint className="w-12 h-12 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Evcil Dostunuz İçin En İyisini Seçin
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Kafessiz konaklama, profesyonel eğitim ve özenli bakım hizmetlerimiz ile
            evcil dostlarınız güvende
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleReservationClick}
            className="bg-white text-primary hover:bg-white/90 hover:scale-110 transition-all shadow-2xl text-lg px-8 py-6 gap-2"
          >
            <Calendar className="w-5 h-5" />
            Hemen Rezervasyon Yap
            <ChevronRight className="w-5 h-5 animate-bounce-x" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">İletişim</h3>
              </div>
              <p className="text-sm text-gray-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary" />
                Şehit Hikmet Özer Cd. No:101<br />
                Etimesgut/Ankara
              </p>
              <p className="text-sm text-gray-300 space-y-1">
                <span className="flex items-center gap-2">
                  📞 Tel: +90 532 307 3264
                </span>
                <span className="flex items-center gap-2">
                  ✉️ Email: petfendyotel@gmail.com
                </span>
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Çalışma Saatleri</h3>
              </div>
              <p className="text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  Pazartesi - Pazar
                </span>
                <span className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-secondary" />
                  08:00 - 20:00
                </span>
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Hizmetler</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Award className="w-4 h-4 text-secondary" />
                  Köpek Eğitimi
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Home className="w-4 h-4 text-secondary" />
                  Kedi - Köpek Oteli
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Heart className="w-4 h-4 text-secondary" />
                  Pet Kuaför
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Users className="w-4 h-4 text-secondary" />
                  Kreş ve Sosyalleşme
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <div className="flex justify-center gap-2 mb-3">
              <PawPrint className="w-5 h-5 text-primary animate-pulse" />
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <PawPrint className="w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Petfendy Evcil Hayvan Oteli. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

