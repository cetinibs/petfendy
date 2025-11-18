"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ShoppingCart, Globe, Scissors, Sparkles, Heart, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function PetGroomingPage() {
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
    router.push(`/${newLocale}/pet-kuafor`)
  }

  const services = [
    {
      title: "Temel Bakım Paketi",
      description: "Evcil dostunuzun temel temizlik ve bakım ihtiyaçları",
      features: [
        "Banyo ve fön",
        "Tırnak kesimi",
        "Kulak temizliği",
        "Göz çevresi temizliği",
        "Pati bakımı",
      ],
      duration: "1-2 saat"
    },
    {
      title: "Profesyonel Tıraş",
      description: "Cins ve ihtiyaca özel profesyonel tıraş hizmeti",
      features: [
        "Irk standartlarına uygun kesim",
        "Model tıraş seçenekleri",
        "Makas ve makineli tıraş",
        "Yüz ve ayak detayı",
        "Finishing işlemleri",
      ],
      duration: "2-3 saat",
      popular: true
    },
    {
      title: "Özel Bakım",
      description: "Özel ihtiyaçlar için detaylı bakım hizmeti",
      features: [
        "Koltuk açma tedavisi",
        "Deri ve tüy bakımı",
        "Özel şampuan uygulamaları",
        "Diş temizliği",
        "Aromaterapi",
        "SPA uygulamaları",
      ],
      duration: "3-4 saat"
    }
  ]

  const features = [
    {
      icon: Scissors,
      title: "Profesyonel Ekip",
      description: "Deneyimli ve sertifikalı pet kuaförlerimiz"
    },
    {
      icon: Sparkles,
      title: "Kaliteli Ürünler",
      description: "Evcil hayvan sağlığına uygun premium ürünler"
    },
    {
      icon: Heart,
      title: "Sevgi ve Sabır",
      description: "Her hayvana özel, stressiz bakım anlayışı"
    },
    {
      icon: Shield,
      title: "Hijyen ve Güvenlik",
      description: "Steril ekipman ve hijyenik ortam"
    }
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
      <section className="bg-gradient-to-br from-purple-50 to-pink-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Profesyonel Pet Kuaför</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Pet Kuaför Hizmetlerimiz
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Evcil dostlarınız için özenli bakım ve güzellik hizmetleri
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Bakım Paketlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className={`hover:shadow-xl transition-shadow ${service.popular ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader>
                  {service.popular && <Badge className="w-fit mb-2">En Popüler</Badge>}
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <Badge variant="outline" className="w-fit mt-2">{service.duration}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Paket İçeriği:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Neden Petfendy Pet Kuaför?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Ek Hizmetler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Özel Günler Hazırlığı</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Özel günler, yarışmalar ve fotoğraf çekimleri için evcil dostunuzu hazırlayalım
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Yarışma hazırlığı</li>
                  <li>• Fotoğraf çekimi öncesi bakım</li>
                  <li>• Özel gün güzellik paketleri</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mevsimsel Bakım</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Mevsim geçişlerinde evcil dostunuzun ihtiyacına özel bakım
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Yaz tıraşı</li>
                  <li>• Kış bakımı</li>
                  <li>• Tüy dökülme kontrolü</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Evcil Dostunuza Özel Bakım Zamanı</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Randevu almak ve hizmetlerimiz hakkında detaylı bilgi için bizimle iletişime geçin
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={() => router.push(`/${locale}/iletisim`)}>
              Randevu Al
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white"
              onClick={() => router.push(`/${locale}/galeri`)}
            >
              Çalışmalarımızı Görün
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
