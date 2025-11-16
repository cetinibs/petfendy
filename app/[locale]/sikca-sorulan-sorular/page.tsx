"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { FAQ } from "@/lib/types"

export default function FAQPage() {
  const t = useTranslations("faq")
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Load FAQs from localStorage
    const storedFaqs = localStorage.getItem("petfendy_faqs")
    if (storedFaqs) {
      const allFaqs = JSON.parse(storedFaqs) as FAQ[]
      // Only show active FAQs, sorted by order
      setFaqs(allFaqs.filter(faq => faq.isActive).sort((a, b) => a.order - b.order))
    }
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              {t("allCategories")}
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                {t("noQuestions")}
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={faq.id}>
                  <AccordionItem value={`item-${index}`} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-start gap-3 text-left w-full">
                        <Badge className="mt-1">{faq.category}</Badge>
                        <span className="font-semibold text-lg">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="text-gray-700 dark:text-gray-300 ml-20">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  )
}
