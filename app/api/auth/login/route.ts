import { NextResponse } from "next/server"
import { sanitizeInput, validateEmail, verifyPassword } from "@/lib/security"
import { sign } from "jsonwebtoken"
import { users, findUserByEmail } from "@/lib/users-store"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate inputs
    const sanitizedEmail = sanitizeInput(email)

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin" },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: "Şifre gerekli" },
        { status: 400 }
      )
    }

    // Mock admin check
    if (sanitizedEmail === "admin@petfendy.com" && password === "admin123") {
      const adminUser = findUserByEmail("admin@petfendy.com")

      if (adminUser) {
        const token = sign(
          { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
          JWT_SECRET,
          { expiresIn: "24h" }
        )

        return NextResponse.json({
          success: true,
          user: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
            emailVerified: adminUser.emailVerified,
          },
          token,
        })
      }
    }

    // Find user by email
    const foundUser = findUserByEmail(sanitizedEmail)

    if (!foundUser) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı" },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!foundUser.emailVerified) {
      return NextResponse.json(
        {
          error: "E-posta adresiniz doğrulanmamış. Lütfen e-postanıza gelen doğrulama kodunu kullanın.",
          emailNotVerified: true,
          email: foundUser.email
        },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, foundUser.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = sign(
      { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    return NextResponse.json({
      success: true,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        emailVerified: foundUser.emailVerified,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Giriş sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
