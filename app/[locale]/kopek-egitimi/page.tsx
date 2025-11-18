"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { ShoppingCart, Globe, Award, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function DogTrainingPage() {
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
    router.push(`/${newLocale}/kopek-egitimi`)
  }

  const trainingPrograms = [
    {
      title: "Temel İtaat Eğitimi",
      duration: "4-6 Hafta",
      description: "Köpeğinizin temel komutları öğrenmesi ve sosyal davranışlar kazanması",
      features: [
        "Otur, yat, kal komutları",
        "Tasma eğitimi",
        "Gelme komutu",
        "Ev terbiyesi",
        "Sosyalleşme",
      ]
    },
    {
      title: "İleri Seviye Eğitim",
      duration: "8-10 Hafta",
      description: "Karmaşık komutlar ve özel yetenekler geliştirme",
      features: [
        "Uzak mesafe komutları",
        "Çevik saha antrenmanları",
        "Arama-kurtarma temelleri",
        "Savunma ve koruma",
        "Özel görev eğitimleri",
      ]
    },
    {
      title: "Davranış Düzeltme",
      duration: "Özel Program",
      description: "Problem davranışların çözümü ve iyileştirilmesi",
      features: [
        "Saldırganlık kontrolü",
        "Ayrılık kaygısı tedavisi",
        "Aşırı havlama önleme",
        "Kaçma eğilimi düzeltme",
        "Stres yönetimi",
      ]
    },
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
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Profesyonel Köpek Eğitimi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Köpek Eğitimi Hizmetlerimiz
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uzman eğitmenlerimiz ile köpeğiniz için özel eğitim programları
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Eğitim Programlarımız</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingPrograms.map((program, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <Badge className="w-fit mt-2">{program.duration}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{program.description}</p>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Program İçeriği:
                    </h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
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

        {/* Why Choose Us */}
        <div className="bg-primary/5 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Neden Petfendy Köpek Eğitimi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Profesyonel Eğitmenler</h3>
                <p className="text-sm text-muted-foreground">
                  Sertifikalı ve deneyimli eğitim uzmanları
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Kanıtlanmış Yöntemler</h3>
                <p className="text-sm text-muted-foreground">
                  Pozitif pekiştirme temelli eğitim
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Özel Programlar</h3>
                <p className="text-sm text-muted-foreground">
                  Her köpeğe özel eğitim planı
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold mb-2">Takip Desteği</h3>
                <p className="text-sm text-muted-foreground">
                  Eğitim sonrası danışmanlık hizmeti
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Köpeğiniz İçin Eğitime Başlamaya Hazır Mısınız?</h2>
          <p className="mb-6 opacity-90">
            Bizimle iletişime geçin, size özel bir eğitim planı oluşturalım
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={() => router.push(`/${locale}/iletisim`)}>
              Bize Ulaşın
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white" onClick={() => router.push(`/${locale}/home`)}>
              Rezervasyon Yap
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
