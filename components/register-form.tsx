"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"
import { EmailVerification } from "./email-verification"
import { sanitizeInput, validateEmail, validatePassword, validatePhone } from "@/lib/security"
import { hashPassword } from "@/lib/security"
import { setPendingUser } from "@/lib/storage"
import { emailService } from "@/lib/email-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from 'next-intl';
import type { User } from "@/lib/types"

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, loginWithGoogle } = useAuth()
  const t = useTranslations('auth');
  const [showVerification, setShowVerification] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validate email
    const sanitizedEmail = sanitizeInput(formData.email)
    if (!validateEmail(sanitizedEmail)) {
      newErrors.email = "Geçerli bir e-posta adresi girin"
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0]
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor"
    }

    // Validate name
    const sanitizedName = sanitizeInput(formData.name)
    if (sanitizedName.length < 2) {
      newErrors.name = "Ad en az 2 karakter olmalıdır"
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası girin"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiry = new Date()
      expiry.setMinutes(expiry.getMinutes() + 15)

      // Create pending user
      const passwordHash = await hashPassword(formData.password)
      const pendingUser: Partial<User> = {
        id: `user-${Date.now()}`,
        email: sanitizedEmail,
        name: sanitizedName,
        phone: formData.phone,
        passwordHash,
        role: "user",
        emailVerified: false,
        verificationCode,
        verificationCodeExpiry: expiry,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save to storage
      setPendingUser(pendingUser)

      // Send verification email
      await emailService.sendVerificationEmail(sanitizedEmail, verificationCode, sanitizedName)

      // Show verification screen
      setShowVerification(true)
    } catch (err) {
      setErrors({ submit: "Kayıt başarısız. Lütfen tekrar deneyin." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSuccess = async (verifiedUser: Partial<User>) => {
    try {
      // Complete registration with verified user
      if (verifiedUser.email && verifiedUser.name && verifiedUser.phone && formData.password) {
        await register(verifiedUser.email, formData.password, verifiedUser.name, verifiedUser.phone)
        onSuccess?.()
      }
    } catch (err) {
      setErrors({ submit: "Kayıt tamamlanamadı. Lütfen giriş yapmayı deneyin." })
    }
  }

  const handleVerificationCancel = () => {
    setShowVerification(false)
  }

  const handleGoogleRegister = async () => {
    setErrors({})
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
      onSuccess?.()
    } catch (err) {
      setErrors({ submit: "Google ile kayıt başarısız. Lütfen tekrar deneyin." })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  if (showVerification) {
    return (
      <EmailVerification 
        onSuccess={handleVerificationSuccess} 
        onCancel={handleVerificationCancel}
      />
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('registerTitle')}</CardTitle>
        <CardDescription>Petfendy hesabı oluşturun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              {t('name')}
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Ahmet Yılmaz"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              required
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              required
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              {t('phone')}
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 555 123 45 67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
              required
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t('password')}
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
              required
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t('confirmPassword')}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
            {isLoading ? "Kayıt yapılıyor..." : t('registerTitle')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                veya
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleRegister}
            disabled={isLoading || isGoogleLoading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            {isGoogleLoading ? "Google ile kayıt yapılıyor..." : "Google ile Kayıt Ol"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
