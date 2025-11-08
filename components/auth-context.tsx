"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import type { User } from "@/lib/types"
import { getCurrentUser, setCurrentUser, clearAllData, getAuthToken, setAuthToken } from "@/lib/storage"

interface AuthContextType {
  user: Partial<User> | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (email: string, password: string, name: string, phone: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    // Check NextAuth session first
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      // User is logged in via Google OAuth
      const googleUser: Partial<User> = {
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image || undefined,
        role: (session.user as any).role || "user",
        emailVerified: true,
      }
      setCurrentUser(googleUser)
      setUser(googleUser)
      setIsLoading(false)
      return
    }

    // Check if user is logged in with traditional auth
    const storedUser = getCurrentUser()
    const token = getAuthToken()

    if (storedUser && token) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [session, status])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock authentication - check if admin
      const isAdmin = email === "admin@petfendy.com" && password === "admin123"
      
      const mockUser: Partial<User> = {
        id: isAdmin ? "admin-1" : "user-" + Date.now(),
        email,
        name: isAdmin ? "Admin User" : email.split('@')[0],
        role: isAdmin ? "admin" : "user",
      }

      const token = "mock_token_" + Date.now()
      setAuthToken(token)
      setCurrentUser(mockUser)
      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true)
    try {
      // Mock registration - in production, call your API
      const mockUser: Partial<User> = {
        id: Date.now().toString(),
        email,
        name,
        role: "user",
      }

      const token = "mock_token_" + Date.now()
      setAuthToken(token)
      setCurrentUser(mockUser)
      setUser(mockUser)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await nextAuthSignIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Sign out from NextAuth if session exists
    if (session) {
      nextAuthSignOut({ callbackUrl: "/" })
    }
    clearAllData()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
