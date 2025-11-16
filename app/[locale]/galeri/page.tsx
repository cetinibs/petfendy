"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { GalleryImage } from "@/lib/types"

export default function GalleryPage() {
  const t = useTranslations("gallery")
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    // Load gallery images from localStorage
    const storedImages = localStorage.getItem("petfendy_gallery_images")
    if (storedImages) {
      const allImages = JSON.parse(storedImages) as GalleryImage[]
      // Only show active images, sorted by order
      setImages(allImages.filter(img => img.isActive).sort((a, b) => a.order - b.order))
    }
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(images.map(img => img.category)))

  // Filter images
  const filteredImages = selectedCategory === "all"
    ? images
    : images.filter(img => img.category === selectedCategory)

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

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredImages.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                {t("noImages")}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-square bg-gray-200">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <Badge className="mb-2">{image.category}</Badge>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge>{selectedImage.category}</Badge>
                    {selectedImage.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                  {selectedImage.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
