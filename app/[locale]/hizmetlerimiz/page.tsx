"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Car, GraduationCap, Scissors } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const t = useTranslations("services")
  const tCommon = useTranslations("common")

  const services = [
    {
      icon: Building2,
      title: t("petHotel"),
      description: t("petHotelDesc"),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Car,
      title: t("petTaxi"),
      description: t("petTaxiDesc"),
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: GraduationCap,
      title: t("dogTraining"),
      description: t("dogTrainingDesc"),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Scissors,
      title: t("petGrooming"),
      description: t("petGroomingDesc"),
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 rounded-full ${service.bgColor} flex items-center justify-center mb-4`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                  {service.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/tr">{t("learnMore")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/tr">{t("bookNow")}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
