import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { hashPassword, sanitizeInput, validateEmail, validatePassword, validatePhone } from "@/lib/security"
import type { User } from "@/lib/types"
import { users, pendingUsers, findUserByEmail, findPendingUserByEmail } from "@/lib/users-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    // Validate inputs
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedName = sanitizeInput(name)

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin" },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      )
    }

    if (sanitizedName.length < 2) {
      return NextResponse.json(
        { error: "Ad en az 2 karakter olmalıdır" },
        { status: 400 }
      )
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: "Geçerli bir telefon numarası girin" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = findUserByEmail(sanitizedEmail)
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 409 }
      )
    }

    // Check if user is already pending
    const existingPendingUser = findPendingUserByEmail(sanitizedEmail)
    if (existingPendingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi için zaten bir kayıt işlemi devam ediyor" },
        { status: 409 }
      )
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date()
    expiry.setMinutes(expiry.getMinutes() + 15)

    // Create user
    const passwordHash = await hashPassword(password)
    const userId = `user-${Date.now()}`

    const newUser: User = {
      id: userId,
      email: sanitizedEmail,
      name: sanitizedName,
      phone,
      passwordHash,
      role: "user",
      emailVerified: false,
      verificationCode,
      verificationCodeExpiry: expiry,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Store user in pending users
    pendingUsers.set(userId, newUser)

    // Send verification email
    await emailService.sendVerificationEmail(sanitizedEmail, verificationCode, sanitizedName)

    // Return user data without sensitive info
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
      },
      message: "Kayıt başarılı. E-posta adresinize doğrulama kodu gönderildi.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
