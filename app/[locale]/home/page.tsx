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
    { icon: Users, label: "Mutlu Müşteri", value: "1000+" },
    { icon: Award, label: "Eğitimli Evcil Hayvan", value: "200+" },
    { icon: Calendar, label: "Yıllık Deneyim", value: "5+" },
  ]

  const features = [
    {
      icon: Home,
      title: "Kafessiz Konaklama",
      description: "Evcil dostlarınız için 7/24 açık, geniş ve konforlu alanlar. Evlerinden uzaktayken bile ev konforunda hissedecekler."
    },
    {
      icon: Award,
      title: "Profesyonel Eğitim",
      description: "Uzman eğitmenlerimizle temel itaat eğitiminden ileri seviye davranış düzeltmeye kadar tam destek."
    },
    {
      icon: Heart,
      title: "Özenli Bakım",
      description: "Profesyonel pet kuaför hizmetleri, özel diyet programları ve kişiselleştirilmiş bakım."
    },
    {
      icon: Shield,
      title: "Güvenli ve Hijyenik",
      description: "24 saat veteriner desteği, sürekli izleme ve hijyen standartlarında üst düzey hizmet."
    },
    {
      icon: Car,
      title: "Pet Taksi Hizmeti",
      description: "Evcil dostlarınızın güvenli transferi için özel araçlarla kapıdan kapıya ulaşım."
    },
    {
      icon: PawPrint,
      title: "Sosyalleşme ve Oyun",
      description: "Günlük aktiviteler, oyun saatleri ve diğer dostlarla sosyalleşme imkanı."
    }
  ]

  const testimonials = [
    {
      name: "Ayşe Yılmaz",
      comment: "Köpeğim Max'i buraya bırakırken çok endişeliydim ama geri aldığımda çok mutlu ve bakımlıydı. Gerçekten harika bir hizmet!",
      rating: 5
    },
    {
      name: "Mehmet Demir",
      comment: "Profesyonel eğitim hizmeti sayesinde köpeğimiz Bella'nın davranışlarında inanılmaz gelişmeler gördük. Teşekkürler Petfendy!",
      rating: 5
    },
    {
      name: "Zeynep Kaya",
      comment: "Pet taksi hizmeti çok işime yaradı. Arabam olmadığı için veterinere götürmekte zorlanıyordum. Artık çok kolay!",
      rating: 5
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Rezervasyon Yapın",
      description: "Online sistemimizden kolayca rezervasyon oluşturun"
    },
    {
      step: "2",
      title: "Evcil Dostunuzu Getirin",
      description: "Belirlenen tarihte tesisimize teslim edin"
    },
    {
      step: "3",
      title: "Huzur İçinde Zaman Geçirin",
      description: "Biz hallederken siz keyfini çıkarın"
    },
    {
      step: "4",
      title: "Mutlu Bir Şekilde Alın",
      description: "Bakımlı ve mutlu dostunuzla tekrar buluşun"
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image
              src="/petfendy-logo.svg"
              alt="Petfendy Logo"
              width={48}
              height={48}
              className="w-12 h-12"
              priority
            />
            <div>
              <h1 className="text-xl font-bold text-primary">PETFENDY</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Evcil Hayvan Oteli & Eğitim Merkezi
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              className="gap-2 hover:bg-primary/10 transition-colors"
              onClick={() => router.push('/tr')}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Sepet</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="ml-1">{cartItemCount}</Badge>
              )}
            </Button>
            <Button onClick={() => router.push('/tr')} className="shadow-lg hover:shadow-xl transition-shadow">
              Giriş Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 md:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <PawPrint className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ankara'nın En Güvenilir Evcil Hayvan Oteli</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Evcil Dostlarınız İçin<br />
              <span className="text-primary">Huzurlu Bir Tatil</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Kafessiz konaklama, profesyonel eğitim ve 7/24 veteriner desteği ile
              evcil hayvanlarınız güvende ve mutlu
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="gap-2 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={handleReservationClick}
              >
                Hemen Rezervasyon Yap
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 py-6 text-lg hover:bg-white transition-all"
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Hizmetlerimizi Keşfedin
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>7/24 Veteriner Desteği</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Kafessiz Konaklama</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Kamera ile Canlı İzleme</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {stats.map((stat, idx) => (
              <Card key={idx} className="text-center border-none shadow-xl hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur">
                <CardContent className="pt-8 pb-8">
                  <stat.icon className="w-14 h-14 mx-auto mb-4 text-primary" />
                  <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Petfendy'yi Seçmelisiniz?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Evcil dostlarınızın konforlu ve güvenli bir ortamda vakit geçirmesi için sunduğumuz özel hizmetler
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              4 basit adımda evcil dostunuz için rezervasyon yapın
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {/* Arrow connector - hidden on last item and mobile */}
                {idx < howItWorks.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-10 -right-4 w-8 h-8 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Binlerce mutlu müşterimizin deneyimlerinden bazıları
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-2 hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Petfendy Müşterisi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      {showReservation && (
        <section id="reservation-section" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Hızlı ve Kolay Rezervasyon</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Rezervasyon Yapın
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Otel veya taksi hizmetlerimiz için hemen rezervasyon oluşturun
              </p>
            </div>

            <Tabs defaultValue="hotel" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="hotel" className="gap-2">
                  <Home className="w-4 h-4" />
                  Otel Rezervasyonu
                </TabsTrigger>
                <TabsTrigger value="taxi" className="gap-2">
                  <Car className="w-4 h-4" />
                  Taksi Rezervasyonu
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
      <section className="relative py-24 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <PawPrint className="w-4 h-4" />
            <span className="text-sm font-medium">Güvenilir ve Profesyonel Hizmet</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Evcil Dostunuz İçin En İyisini Seçin
          </h2>

          <p className="text-xl mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Kafessiz konaklama, profesyonel eğitim ve 7/24 veteriner desteği ile
            evcil dostlarınız güvende ve mutlu olsun
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              onClick={handleReservationClick}
            >
              Hemen Rezervasyon Yap
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 py-6 text-lg border-2 border-white text-white hover:bg-white hover:text-primary transition-all"
              onClick={() => router.push('/tr')}
            >
              Giriş Yap
            </Button>
          </div>

          {/* Contact info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Etimesgut, Ankara</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>7/24 Hizmet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/petfendy-logo.svg"
                  alt="Petfendy Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="font-bold text-lg">PETFENDY</h3>
                  <p className="text-xs text-gray-400">Evcil Hayvan Oteli</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ankara'nın en güvenilir ve profesyonel evcil hayvan oteli
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                İletişim
              </h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>
                  Şehit Hikmet Özer Cd. No:101<br />
                  Etimesgut/Ankara
                </p>
                <p>
                  <span className="text-white font-medium">Tel:</span> +90 532 307 3264
                </p>
                <p>
                  <span className="text-white font-medium">Email:</span> petfendyotel@gmail.com
                </p>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Çalışma Saatleri
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex justify-between">
                  <span className="text-white">Pazartesi - Pazar</span>
                </p>
                <p className="text-lg text-white font-semibold">08:00 - 20:00</p>
                <p className="text-primary font-medium mt-3">
                  🔔 Acil Durumlar İçin 7/24 Ulaşılabilir
                </p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-primary" />
                Hizmetler
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-primary" />
                  Köpek Eğitimi
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-primary" />
                  Kedi - Köpek Oteli
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-primary" />
                  Pet Kuaför
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-primary" />
                  Kreş ve Sosyalleşme
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-primary" />
                  Pet Taksi Hizmeti
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 Petfendy Evcil Hayvan Oteli. Tüm hakları saklıdır.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
                <a href="#" className="hover:text-white transition-colors">SSS</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

