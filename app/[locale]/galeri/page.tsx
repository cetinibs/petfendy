"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { ShoppingCart, Globe, Camera } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function GalleryPage() {
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
    router.push(`/${newLocale}/galeri`)
  }

  const galleryCategories = ["Tümü", "Otel", "Köpek Eğitimi", "Pet Kuaför", "Aktiviteler"]
  const [selectedCategory, setSelectedCategory] = useState("Tümü")

  // Placeholder gallery items
  const galleryItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    category: ["Otel", "Köpek Eğitimi", "Pet Kuaför", "Aktiviteler"][Math.floor(Math.random() * 4)],
    title: `Galeri ${i + 1}`
  }))

  const filteredItems = selectedCategory === "Tümü"
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory)

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
      <section className="bg-gradient-to-br from-orange-50 to-yellow-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Camera className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Fotoğraf Galerisi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Galeri
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tesisimizden ve mutlu dostlarımızdan kareler
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {galleryCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-indigo-100">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <Badge variant="secondary" className="mt-2">{item.category}</Badge>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm">Fotoğrafı Görüntüle</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Fotoğraf Çekimleri</h3>
            <p className="text-muted-foreground mb-4">
              Otelimizde konaklayan tüm dostlarımızın günlük aktivitelerinden
              fotoğraflar çekiyor ve sahiplerimizle paylaşıyoruz.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Günlük aktivite fotoğrafları</li>
              <li>• Oyun zamanı kareleri</li>
              <li>• Eğitim anları</li>
              <li>• Kuaför sonrası görüntüler</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Video Paylaşımları</h3>
            <p className="text-muted-foreground mb-4">
              Evcil dostlarınızın videolarını da düzenli olarak çekip
              sosyal medya hesaplarımızdan paylaşıyoruz.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Oyun anları videoları</li>
              <li>• Eğitim ilerlemeleri</li>
              <li>• Sosyalleşme aktiviteleri</li>
              <li>• Özel anlar</li>
            </ul>
          </Card>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Evcil Dostunuzun Fotoğraflarını Görmek İster Misiniz?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rezervasyon yapın, dostlarınızın mutlu anlarını sizinle paylaşalım
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => router.push(`/${locale}/home`)}>
              Rezervasyon Yap
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push(`/${locale}/iletisim`)}>
              Bilgi Al
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
