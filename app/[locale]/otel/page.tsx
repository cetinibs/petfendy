"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { ShoppingCart, Globe, Home, Shield, Heart, Clock, Camera, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function HotelPage() {
  const router = useRouter()
  const locale = useLocale()
  const [cartItemCount, setCartItemCount] = useState(0)

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

  const switchLocale = (newLocale: string) => {
    router.push(`/${newLocale}/otel`)
  }

  const features = [
    {
      icon: Home,
      title: "Kafessiz Konaklama",
      description: "Geniş ve konforlu alanlarda özgürce dolaşma imkanı"
    },
    {
      icon: Shield,
      title: "24/7 Veteriner Desteği",
      description: "Her an veteriner hekim desteği ve sağlık takibi"
    },
    {
      icon: Heart,
      title: "Özenli Bakım",
      description: "Deneyimli personelimiz ile sevgi dolu bakım hizmeti"
    },
    {
      icon: Camera,
      title: "Kamera ile Takip",
      description: "Evcil dostunuzu online olarak izleme imkanı"
    },
    {
      icon: Users,
      title: "Sosyalleşme",
      description: "Diğer dostlarla kontrollü sosyalleşme aktiviteleri"
    },
    {
      icon: Clock,
      title: "Esnek Saatler",
      description: "7/24 teslim alma ve bırakma hizmeti"
    }
  ]

  const amenities = [
    "Klimalı ve ısıtmalı odalar",
    "Özel beslenme programları",
    "Günlük oyun ve egzersiz saatleri",
    "Profesyonel bakım ve temizlik",
    "Acil durum müdahale ekibi",
    "Hijyenik ve modern tesis",
    "Aşı ve sağlık kontrolü",
    "Fotoğraf ve video paylaşımı",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push(`/${locale}/home`)}
            >
              <MobileMenu locale={locale} />
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
                  Evcil Hayvan Oteli
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" />
                    {locale === 'tr' ? 'TR' : 'EN'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => switchLocale('tr')}>
                    Türkçe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLocale('en')}>
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push(`/${locale}`)}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Sepet</span>
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="ml-1">{cartItemCount}</Badge>
                )}
              </Button>
              <Button onClick={() => router.push(`/${locale}`)}>
                Giriş Yap
              </Button>
            </div>
          </div>

          <Navigation locale={locale} className="hidden lg:flex" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Home className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Ankara'nın En Güvenilir Pet Oteli</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Kedi - Köpek Oteli
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Evcil dostlarınız için evlerinden uzakta, ev konforunda konaklama
            </p>
            <Button size="lg" onClick={() => router.push(`/${locale}/home`)}>
              Hemen Rezervasyon Yap
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Otel Özelliklerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Otelimizde Neler Var?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Types Info */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Oda Tiplerimi z</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Oda</CardTitle>
                <CardDescription>Tek evcil hayvan için</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Geniş ve konforlu alan</li>
                  <li>• Oyun zamanı dahil</li>
                  <li>• Günlük bakım hizmeti</li>
                  <li>• Beslenme programı</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardHeader>
                <Badge className="w-fit mb-2">En Popüler</Badge>
                <CardTitle>Deluxe Oda</CardTitle>
                <CardDescription>1-2 evcil hayvan için</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ekstra geniş alan</li>
                  <li>• Uzun oyun zamanı</li>
                  <li>• Özel beslenme programı</li>
                  <li>• Günlük fotoğraf paylaşımı</li>
                  <li>• Kamera ile takip</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suite Oda</CardTitle>
                <CardDescription>3-4 evcil hayvan için</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Özel büyük alan</li>
                  <li>• Sınırsız oyun zamanı</li>
                  <li>• VIP bakım hizmeti</li>
                  <li>• Premium beslenme</li>
                  <li>• 7/24 video takip</li>
                  <li>• Özel aktivite programı</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Evcil Dostunuz İçin Rezervasyon Yapın</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Tesisimizi gezmek ve otelimiz hakkında detaylı bilgi almak için bizimle iletişime geçebilir
            veya hemen online rezervasyon yapabilirsiniz
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={() => router.push(`/${locale}/home`)}>
              Rezervasyon Yap
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white"
              onClick={() => router.push(`/${locale}/iletisim`)}
            >
              Bize Ulaşın
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
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
