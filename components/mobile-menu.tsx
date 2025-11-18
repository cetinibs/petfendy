"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  locale: string
}

const menuItems = [
  { label: "Ana Sayfa", href: "/home" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
  { label: "Köpek Eğitimi", href: "/kopek-egitimi" },
  { label: "Kedi – Köpek Oteli", href: "/otel" },
  { label: "Pet Kuaför", href: "/pet-kuafor" },
  { label: "Blog", href: "/blog" },
  { label: "Galeri", href: "/galeri" },
  { label: "Bize Ulaşın", href: "/iletisim" },
  { label: "SSS", href: "/sss" },
]

export function MobileMenu({ locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menüyü Aç</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menü</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => {
            const fullPath = `/${locale}${item.href}`
            const isActive = pathname === fullPath

            return (
              <Link
                key={item.href}
                href={fullPath}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary p-3 rounded-lg",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
