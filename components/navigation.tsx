"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationProps {
  locale: string
  className?: string
}

const menuItems = [
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

export function Navigation({ locale, className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {menuItems.map((item) => {
        const fullPath = `/${locale}${item.href}`
        const isActive = pathname === fullPath

        return (
          <Link
            key={item.href}
            href={fullPath}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
