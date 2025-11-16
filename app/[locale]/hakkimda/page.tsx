"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  const t = useTranslations("about")
  const tNav = useTranslations("navigation")

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

        {/* About Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Content */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("content")}
              </p>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  {t("ourMission")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("mission")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  {t("ourVision")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("vision")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <Card>
            <CardHeader>
              <CardTitle>{t("whyChooseUs")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{t("reason1")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{t("reason2")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{t("reason3")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{t("reason4")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
