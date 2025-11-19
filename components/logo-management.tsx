"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import {
  Upload,
  RefreshCcw,
  CheckCircle2,
  ImageIcon,
  AlertCircle
} from "lucide-react"
import {
  getLogoSettings,
  saveLogoSettings,
  resetLogos,
  fileToDataURL,
  validateImageFile,
  type LogoSettings,
} from "@/lib/logo-storage"

interface LogoField {
  key: keyof Omit<LogoSettings, "lastUpdated">
  label: string
  description: string
}

export function LogoManagement() {
  const [logos, setLogos] = useState<LogoSettings>(getLogoSettings())
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const logoFields: LogoField[] = [
    {
      key: "headerLogo",
      label: "Header Logo",
      description: "Üst menüde görünen ana logo",
    },
    {
      key: "loginPageLogo",
      label: "Giriş Sayfası Logosu",
      description: "Giriş ve kayıt sayfalarında görünen logo",
    },
    {
      key: "footerLogo",
      label: "Footer Logo",
      description: "Sayfa altında görünen logo",
    },
    {
      key: "emailLogo",
      label: "E-posta Logosu",
      description: "E-posta şablonlarında kullanılan logo",
    },
    {
      key: "faviconUrl",
      label: "Favicon",
      description: "Tarayıcı sekmesinde görünen ikon",
    },
  ]

  useEffect(() => {
    // Listen for logo updates
    const handleLogoUpdate = (event: CustomEvent<LogoSettings>) => {
      setLogos(event.detail)
    }

    window.addEventListener("logoUpdated" as any, handleLogoUpdate)
    return () => window.removeEventListener("logoUpdated" as any, handleLogoUpdate)
  }, [])

  const handleFileUpload = async (
    file: File | null,
    logoType: keyof Omit<LogoSettings, "lastUpdated">
  ) => {
    if (!file) return

    setError("")
    setSuccess("")
    setUploading(logoType)

    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || "Geçersiz dosya")
        setUploading(null)
        return
      }

      // Convert to data URL
      const dataUrl = await fileToDataURL(file)

      // Update logo settings
      const newSettings = { ...logos, [logoType]: dataUrl }
      saveLogoSettings(newSettings)
      setLogos(newSettings)

      setSuccess(`${logoFields.find((f) => f.key === logoType)?.label} başarıyla güncellendi!`)
      toast({
        title: "Logo Güncellendi",
        description: `${logoFields.find((f) => f.key === logoType)?.label} başarıyla yüklendi.`,
      })
    } catch (err) {
      setError("Logo yüklenirken bir hata oluştu.")
      console.error("Logo upload error:", err)
    } finally {
      setUploading(null)
    }
  }

  const handleUrlUpdate = (logoType: keyof Omit<LogoSettings, "lastUpdated">, url: string) => {
    const newSettings = { ...logos, [logoType]: url }
    saveLogoSettings(newSettings)
    setLogos(newSettings)

    toast({
      title: "Logo URL Güncellendi",
      description: `${logoFields.find((f) => f.key === logoType)?.label} URL'si güncellendi.`,
    })
  }

  const handleReset = () => {
    if (confirm("Tüm logoları varsayılan ayarlara döndürmek istediğinize emin misiniz?")) {
      resetLogos()
      setLogos(getLogoSettings())
      setSuccess("Tüm logolar varsayılan ayarlara döndürüldü.")
      toast({
        title: "Logolar Sıfırlandı",
        description: "Tüm logolar varsayılan değerlere döndürüldü.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Logo Yönetimi</h2>
          <p className="text-muted-foreground">
            Uygulamada kullanılan logoları buradan yönetin
          </p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Varsayılana Dön
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logoFields.map((field) => (
          <Card key={field.key}>
            <CardHeader>
              <CardTitle className="text-lg">{field.label}</CardTitle>
              <CardDescription>{field.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview */}
              <div className="flex justify-center items-center h-32 bg-muted rounded-lg border-2 border-dashed">
                {logos[field.key] ? (
                  <div className="relative w-full h-full p-4">
                    <Image
                      src={logos[field.key]}
                      alt={field.label}
                      fill
                      className="object-contain"
                      onError={() => {
                        // Fallback to placeholder
                        const newSettings = {
                          ...logos,
                          [field.key]: "/placeholder-logo.svg"
                        }
                        setLogos(newSettings)
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Logo Yok</p>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor={`upload-${field.key}`}>Dosya Yükle</Label>
                <div className="flex gap-2">
                  <Input
                    id={`upload-${field.key}`}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] || null, field.key)}
                    disabled={uploading === field.key}
                    className="flex-1"
                  />
                  {uploading === field.key && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      Yükleniyor...
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, SVG veya WebP (Max 5MB)
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor={`url-${field.key}`}>veya URL Girin</Label>
                <div className="flex gap-2">
                  <Input
                    id={`url-${field.key}`}
                    type="url"
                    value={logos[field.key]}
                    onChange={(e) => handleUrlUpdate(field.key, e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanım Bilgisi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Not:</strong> Yüklenen logolar tarayıcınızda (LocalStorage) saklanır.
          </p>
          <p>
            • Dosya yükleme: Logo dosyasını doğrudan yükleyebilirsiniz (Base64 olarak saklanır)
          </p>
          <p>
            • URL girişi: Harici bir URL'den logo kullanabilirsiniz
          </p>
          <p>
            • Değişiklikler anında tüm sayfalara yansır
          </p>
          <p>
            • Varsayılan logoları geri yüklemek için "Varsayılana Dön" butonunu kullanın
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
