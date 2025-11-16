"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FAQ } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

export default function FAQManagement() {
  const t = useTranslations("admin")
  const tFaq = useTranslations("faq")
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({})

  useEffect(() => {
    loadFaqs()
  }, [])

  const loadFaqs = () => {
    const storedFaqs = localStorage.getItem("petfendy_faqs")
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs))
    }
  }

  const saveFaqs = (updatedFaqs: FAQ[]) => {
    localStorage.setItem("petfendy_faqs", JSON.stringify(updatedFaqs))
    setFaqs(updatedFaqs)
  }

  const handleAddNew = () => {
    setCurrentFaq({
      question: "",
      answer: "",
      category: "",
      order: faqs.length,
      isActive: true,
    })
    setIsEditing(true)
  }

  const handleEdit = (faq: FAQ) => {
    setCurrentFaq(faq)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!currentFaq.question || !currentFaq.answer) {
      toast.error("Soru ve cevap gereklidir")
      return
    }

    const now = new Date()
    let updatedFaqs: FAQ[]

    if (currentFaq.id) {
      // Update existing FAQ
      updatedFaqs = faqs.map((faq) =>
        faq.id === currentFaq.id
          ? { ...faq, ...currentFaq, updatedAt: now } as FAQ
          : faq
      )
    } else {
      // Create new FAQ
      const newFaq: FAQ = {
        id: `faq_${Date.now()}`,
        question: currentFaq.question!,
        answer: currentFaq.answer!,
        category: currentFaq.category || "Genel",
        order: currentFaq.order || faqs.length,
        isActive: currentFaq.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      }
      updatedFaqs = [...faqs, newFaq]
    }

    saveFaqs(updatedFaqs)
    setIsEditing(false)
    setCurrentFaq({})
    toast.success(currentFaq.id ? "Soru güncellendi" : "Yeni soru eklendi")
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      const updatedFaqs = faqs.filter((faq) => faq.id !== id)
      saveFaqs(updatedFaqs)
      toast.success("Soru silindi")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentFaq({})
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentFaq.id ? t("editQuestion") : t("addQuestion")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="question">{t("question")}</Label>
            <Input
              id="question"
              value={currentFaq.question || ""}
              onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
              placeholder="Soru"
            />
          </div>

          <div>
            <Label htmlFor="answer">{t("answer")}</Label>
            <Textarea
              id="answer"
              value={currentFaq.answer || ""}
              onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
              placeholder="Cevap"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t("category")}</Label>
              <Input
                id="category"
                value={currentFaq.category || ""}
                onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                placeholder="Kategori"
              />
            </div>

            <div>
              <Label htmlFor="order">{t("order")}</Label>
              <Input
                id="order"
                type="number"
                value={currentFaq.order || 0}
                onChange={(e) => setCurrentFaq({ ...currentFaq, order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={currentFaq.isActive ?? true}
              onCheckedChange={(checked) => setCurrentFaq({ ...currentFaq, isActive: checked })}
            />
            <Label>{t("active")}</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Kaydet</Button>
            <Button variant="outline" onClick={handleCancel}>
              İptal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("faq")}</h2>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addQuestion")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("question")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("order")}</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    {tFaq("noQuestions")}
                  </TableCell>
                </TableRow>
              ) : (
                faqs
                  .sort((a, b) => a.order - b.order)
                  .map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium max-w-md">
                        <div className="line-clamp-2">{faq.question}</div>
                      </TableCell>
                      <TableCell>
                        <Badge>{faq.category}</Badge>
                      </TableCell>
                      <TableCell>{faq.order}</TableCell>
                      <TableCell>
                        <Badge variant={faq.isActive ? "default" : "secondary"}>
                          {faq.isActive ? t("active") : t("inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(faq)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(faq.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
