"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { ShoppingCart, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function AboutPage() {
  const router = useRouter()
  const locale = useLocale()
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    // Update page title and meta tags
    document.title = "Hakkımızda | Petfendy - Evcil Hayvan Oteli"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Petfendy Evcil Hayvan Oteli hakkında bilgi edinin. Ankara\'nın en güvenilir pet oteli olarak 2015\'ten beri hizmet veriyoruz.')
    }

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
    router.push(`/${newLocale}/hakkimizda`)
  }

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Hakkımızda</h1>
          <div className="w-24 h-1 bg-primary mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Petfendy Evcil Hayvan Oteli</h2>
            <p className="text-muted-foreground leading-relaxed">
              Petfendy, Ankara'nın en güvenilir ve konforlu evcil hayvan oteli olarak
              2015 yılından bu yana hizmet vermektedir. Misyonumuz, sevgili dostlarınıza
              evlerinden uzakta olsalar bile en iyi bakımı ve konforu sağlamaktır.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Modern tesisimiz, geniş oyun alanları ve profesyonel ekibimiz ile
              evcil hayvanlarınızın mutluluğunu ve güvenliğini ön planda tutuyoruz.
              Kafessiz konaklama anlayışımız sayesinde dostlarınız özgürce hareket
              edebilir ve sosyalleşebilir.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Veteriner hekim kontrolünde, 7/24 gözetim altında ve özenle bakılan
              evcil dostlarınız için en iyisini sunuyoruz.
            </p>
          </div>

          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <p className="text-muted-foreground text-center px-8">
                Buraya tesisinizin veya evcil hayvanların fotoğrafını ekleyebilirsiniz
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Güven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Evcil dostlarınızı ailemizin bir parçası olarak görüyor ve
                  onlara en iyi bakımı sağlıyoruz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Profesyonellik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Deneyimli ve eğitimli personelimiz ile veteriner hekim desteğinde
                  hizmet veriyoruz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Sevgi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Her hayvan bizim için özeldir ve hepsine aynı sevgi ve
                  özeni gösteriyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Evcil Dostunuz İçin En İyisini Seçin</h2>
          <p className="text-muted-foreground mb-6">
            Hemen rezervasyon yaparak tesisimizi ziyaret edebilirsiniz
          </p>
          <Button size="lg" onClick={() => router.push(`/${locale}/home`)}>
            Rezervasyon Yap
          </Button>
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
