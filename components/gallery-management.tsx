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
import { GalleryImage } from "@/lib/types"
import { Pencil, Trash2, Plus, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

export default function GalleryManagement() {
  const t = useTranslations("admin")
  const tGallery = useTranslations("gallery")
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentImage, setCurrentImage] = useState<Partial<GalleryImage>>({})

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = () => {
    const storedImages = localStorage.getItem("petfendy_gallery_images")
    if (storedImages) {
      setImages(JSON.parse(storedImages))
    }
  }

  const saveImages = (updatedImages: GalleryImage[]) => {
    localStorage.setItem("petfendy_gallery_images", JSON.stringify(updatedImages))
    setImages(updatedImages)
  }

  const handleAddNew = () => {
    setCurrentImage({
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      order: images.length,
      isActive: true,
    })
    setIsEditing(true)
  }

  const handleEdit = (image: GalleryImage) => {
    setCurrentImage(image)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!currentImage.title || !currentImage.imageUrl) {
      toast.error("Başlık ve görsel URL gereklidir")
      return
    }

    const now = new Date()
    let updatedImages: GalleryImage[]

    if (currentImage.id) {
      // Update existing image
      updatedImages = images.map((img) =>
        img.id === currentImage.id ? { ...img, ...currentImage } as GalleryImage : img
      )
    } else {
      // Create new image
      const newImage: GalleryImage = {
        id: `gallery_${Date.now()}`,
        title: currentImage.title!,
        description: currentImage.description || "",
        imageUrl: currentImage.imageUrl!,
        category: currentImage.category || "Genel",
        order: currentImage.order || images.length,
        uploadedBy: "Admin",
        uploadedAt: now,
        isActive: currentImage.isActive ?? true,
      }
      updatedImages = [...images, newImage]
    }

    saveImages(updatedImages)
    setIsEditing(false)
    setCurrentImage({})
    toast.success(currentImage.id ? "Görsel güncellendi" : "Yeni görsel eklendi")
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      const updatedImages = images.filter((img) => img.id !== id)
      saveImages(updatedImages)
      toast.success("Görsel silindi")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentImage({})
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentImage.id ? t("editImage") : t("addImage")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={currentImage.title || ""}
              onChange={(e) => setCurrentImage({ ...currentImage, title: e.target.value })}
              placeholder="Görsel başlığı"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">{t("imageUrl")}</Label>
            <Input
              id="imageUrl"
              value={currentImage.imageUrl || ""}
              onChange={(e) => setCurrentImage({ ...currentImage, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          {currentImage.imageUrl && (
            <div className="border rounded-lg p-4">
              <img
                src={currentImage.imageUrl}
                alt="Önizleme"
                className="w-full h-64 object-cover rounded"
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={currentImage.description || ""}
              onChange={(e) => setCurrentImage({ ...currentImage, description: e.target.value })}
              placeholder="Görsel açıklaması"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t("category")}</Label>
              <Input
                id="category"
                value={currentImage.category || ""}
                onChange={(e) => setCurrentImage({ ...currentImage, category: e.target.value })}
                placeholder="Kategori"
              />
            </div>

            <div>
              <Label htmlFor="order">{t("order")}</Label>
              <Input
                id="order"
                type="number"
                value={currentImage.order || 0}
                onChange={(e) => setCurrentImage({ ...currentImage, order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={currentImage.isActive ?? true}
              onCheckedChange={(checked) => setCurrentImage({ ...currentImage, isActive: checked })}
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
        <h2 className="text-2xl font-bold">{t("gallery")}</h2>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addImage")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Görsel</TableHead>
                <TableHead>{t("title")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("order")}</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    {tGallery("noImages")}
                  </TableCell>
                </TableRow>
              ) : (
                images
                  .sort((a, b) => a.order - b.order)
                  .map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{image.title}</TableCell>
                      <TableCell>
                        <Badge>{image.category}</Badge>
                      </TableCell>
                      <TableCell>{image.order}</TableCell>
                      <TableCell>
                        <Badge variant={image.isActive ? "default" : "secondary"}>
                          {image.isActive ? t("active") : t("inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(image)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
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
