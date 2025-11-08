"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-context"
import { sanitizeInput, validateEmail } from "@/lib/security"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from 'next-intl';

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { login, loginWithGoogle } = useAuth()
  const t = useTranslations('auth');
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Input validation
    const sanitizedEmail = sanitizeInput(email)
    if (!validateEmail(sanitizedEmail)) {
      setError("Geçerli bir e-posta adresi girin")
      return
    }

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır")
      return
    }

    setIsLoading(true)
    try {
      await login(sanitizedEmail, password)
      onSuccess?.()

      // Check if user has items in cart and redirect to cart
      if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('petfendy_cart')
        if (cart && JSON.parse(cart).length > 0) {
          // User will be redirected to cart tab automatically by parent component
          console.log('User has items in cart, will be redirected to cart')
        }
      }
    } catch (err) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
      onSuccess?.()
    } catch (err) {
      setError("Google ile giriş başarısız. Lütfen tekrar deneyin.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('loginTitle')}</CardTitle>
        <CardDescription>Petfendy hesabınıza giriş yapın</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t('password')}
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
            {isLoading ? "Giriş yapılıyor..." : t('loginTitle')}
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
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            {isGoogleLoading ? "Google ile giriş yapılıyor..." : "Google ile Giriş Yap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
