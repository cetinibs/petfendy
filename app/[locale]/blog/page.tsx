"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { ShoppingCart, Globe, Calendar, User, ArrowRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCart } from "@/lib/storage"

export default function BlogPage() {
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
    router.push(`/${newLocale}/blog`)
  }

  const blogPosts = [
    {
      id: 1,
      title: "Köpeğinizi Otele Bırakmadan Önce Bilmeniz Gerekenler",
      excerpt: "Evcil dostunuzu otele bırakırken dikkat etmeniz gereken önemli noktalar ve hazırlık süreci hakkında bilgiler...",
      date: "15 Ocak 2025",
      author: "Petfendy Ekibi",
      category: "Otel Rehberi",
      readTime: "5 dk"
    },
    {
      id: 2,
      title: "Kedi Bakımında Sık Yapılan 10 Hata",
      excerpt: "Kedi sahiplerinin sıkça yaptığı hatalar ve bunların nasıl düzeltilebileceği hakkında uzman tavsiyeleri...",
      date: "10 Ocak 2025",
      author: "Dr. Ayşe Yılmaz",
      category: "Bakım",
      readTime: "7 dk"
    },
    {
      id: 3,
      title: "Köpek Eğitiminde Pozitif Pekiştirme Yöntemleri",
      excerpt: "Köpeğinizi eğitirken ödül sisteminin önemi ve doğru uygulama teknikleri...",
      date: "5 Ocak 2025",
      author: "Eğitmen Mehmet Kaya",
      category: "Eğitim",
      readTime: "6 dk"
    },
    {
      id: 4,
      title: "Yaz Aylarında Evcil Hayvan Bakımı",
      excerpt: "Sıcak havalarda evcil dostlarınızın sağlığını korumak için almanız gereken önlemler...",
      date: "1 Ocak 2025",
      author: "Petfendy Ekibi",
      category: "Sağlık",
      readTime: "4 dk"
    },
    {
      id: 5,
      title: "Pet Kuaför Hizmetlerinin Önemi",
      excerpt: "Düzenli bakım ve tıraş hizmetlerinin evcil hayvanınızın sağlığı için neden önemli olduğu...",
      date: "28 Aralık 2024",
      author: "Kuaför Zeynep Demir",
      category: "Bakım",
      readTime: "5 dk"
    },
    {
      id: 6,
      title: "Yeni Bir Köpek Sahipleniyorsanız: İlk Günler",
      excerpt: "Yeni köpeğinizle ilk günlerde yapmanız ve yapmamanız gerekenler hakkında öneriler...",
      date: "20 Aralık 2024",
      author: "Petfendy Ekibi",
      category: "Rehber",
      readTime: "8 dk"
    }
  ]

  const categories = ["Tümü", "Otel Rehberi", "Bakım", "Eğitim", "Sağlık", "Rehber"]
  const [selectedCategory, setSelectedCategory] = useState("Tümü")

  const filteredPosts = selectedCategory === "Tümü"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

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
      <section className="bg-gradient-to-br from-green-50 to-teal-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Petfendy Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Evcil dostlarınız için faydalı bilgiler, ipuçları ve uzman tavsiyeleri
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
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

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime} okuma</span>
                </div>
                <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  Devamını Oku
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Güncellemelerini Kaçırmayın</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Yeni blog yazılarımızdan haberdar olmak için bizi takip edin
          </p>
          <Button size="lg" onClick={() => router.push(`/${locale}/iletisim`)}>
            İletişime Geç
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
