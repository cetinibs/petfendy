"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navigation } from "@/components/navigation"
import { ShoppingCart, Globe, HelpCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function FAQPage() {
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
    router.push(`/${newLocale}/sss`)
  }

  const faqCategories = [
    {
      title: "Genel Sorular",
      questions: [
        {
          q: "Petfendy'nin çalışma saatleri nedir?",
          a: "Tesisimiz haftanın 7 günü 08:00 - 20:00 saatleri arasında açıktır. Acil durumlar için 7/24 iletişime geçebilirsiniz."
        },
        {
          q: "Tesisi ziyaret edebilir miyim?",
          a: "Evet, tesisimizi ziyaret etmek için randevu alabilirsiniz. Böylece size özel bir tur düzenleyip tüm imkanlarımızı gösterebiliriz."
        },
        {
          q: "Hangi evcil hayvanları kabul ediyorsunuz?",
          a: "Kedi, köpek ve diğer evcil hayvanları kabul ediyoruz. Özel durumlarda bizimle iletişime geçerek bilgi alabilirsiniz."
        }
      ]
    },
    {
      title: "Otel Hizmetleri",
      questions: [
        {
          q: "Rezervasyon yapmak için ne gerekli?",
          a: "Online sistemimiz üzerinden veya telefon ile rezervasyon yapabilirsiniz. Evcil dostunuzun aşı karnesi ve kimlik bilgileri gereklidir."
        },
        {
          q: "İptal ve değişiklik politikanız nedir?",
          a: "Rezervasyon tarihinden 48 saat öncesine kadar ücretsiz iptal veya değişiklik yapabilirsiniz. Daha geç iptallerde rezervasyon bedelinin %50'si tahsil edilir."
        },
        {
          q: "Evcil hayvanımın özel ilaçları var, verebilir misiniz?",
          a: "Evet, evcil dostunuzun ilaç ve özel beslenme ihtiyaçlarını karşılıyoruz. Lütfen teslim ederken detaylı bilgi verin."
        },
        {
          q: "Kamera ile takip imkanı var mı?",
          a: "Deluxe ve Suite odalarımızda 7/24 kamera ile takip imkanı sunuyoruz. Ayrıca tüm misafirlerimize günlük fotoğraf paylaşımı yapılır."
        }
      ]
    },
    {
      title: "Köpek Eğitimi",
      questions: [
        {
          q: "Köpek eğitimi kaç yaşında başlamalı?",
          a: "Temel itaat eğitimine 3-4 aylık olduğunda başlanabilir. Ancak her yaştaki köpek eğitilebilir, yaşa özel programlarımız mevcuttur."
        },
        {
          q: "Eğitim süresi ne kadar?",
          a: "Temel eğitim 4-6 hafta, ileri seviye eğitim 8-10 hafta sürmektedir. Özel programlar için süre değişkenlik gösterebilir."
        },
        {
          q: "Eğitim sırasında köpeğim size mi kalıyor?",
          a: "Hem pansiyon (köpeğiniz bizde kalır) hem de günlük (getir-götür) eğitim seçeneklerimiz mevcuttur."
        },
        {
          q: "Eğitim sonrası takip hizmeti var mı?",
          a: "Evet, eğitim sonrası 3 ay boyunca ücretsiz danışmanlık hizmeti sunuyoruz. İhtiyaç halinde takviye eğitimler düzenlenebilir."
        }
      ]
    },
    {
      title: "Pet Kuaför",
      questions: [
        {
          q: "Ne sıklıkla kuaför hizmeti almalıyım?",
          a: "Cins ve tüy yapısına göre değişir. Genellikle 6-8 haftada bir önerilir. Düzenli bakım için size özel program oluşturabiliriz."
        },
        {
          q: "Randevu almak zorunlu mu?",
          a: "Randevu almanızı öneriyoruz ancak müsaitlik durumuna göre randevusuz da hizmet verebiliyoruz."
        },
        {
          q: "Agresif köpekler için hizmet veriyor musunuz?",
          a: "Evet, deneyimli personeliniz sayesinde agresif veya korkak hayvanlar için de hizmet veriyoruz. Özel önlemler alınır."
        },
        {
          q: "Hangi ürünleri kullanıyorsunuz?",
          a: "Evcil hayvan sağlığına uygun, dermatolojik olarak test edilmiş premium markaların ürünlerini kullanıyoruz."
        }
      ]
    },
    {
      title: "Ödeme ve Fiyatlar",
      questions: [
        {
          q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          a: "Nakit, kredi kartı, banka kartı ve online ödeme yöntemlerini kabul ediyoruz."
        },
        {
          q: "Fiyatlarınız nasıl belirleniyor?",
          a: "Fiyatlarımız hizmet tipi, süre ve seçilen paket seçeneğine göre değişmektedir. Detaylı fiyat bilgisi için bize ulaşabilirsiniz."
        },
        {
          q: "İndirim veya kampanyalarınız var mı?",
          a: "Düzenli müşterilerimize ve uzun süreli rezervasyonlarda indirimler sunuyoruz. Güncel kampanyalarımız için web sitemizi takip edebilirsiniz."
        },
        {
          q: "Fatura kesilir mi?",
          a: "Evet, tüm hizmetlerimiz için e-fatura veya kağıt fatura düzenlenebilir."
        }
      ]
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
      <section className="bg-gradient-to-br from-violet-50 to-purple-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Sıkça Sorulan Sorular</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              SSS
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIdx) => (
            <div key={categoryIdx}>
              <h2 className="text-2xl font-bold mb-6 text-primary">
                {category.title}
              </h2>
              <Card className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIdx) => (
                    <AccordionItem
                      key={faqIdx}
                      value={`${categoryIdx}-${faqIdx}`}
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-lg p-8 text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Sorunuz mu Var?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cevabını bulamadığınız bir soru için bizimle iletişime geçebilirsiniz.
            Size yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => router.push(`/${locale}/iletisim`)}>
              Bize Ulaşın
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push(`/${locale}/home`)}>
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
