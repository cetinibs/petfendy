import { NextResponse } from "next/server"
import { pendingUsers, users, findPendingUserByEmail } from "@/lib/users-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, verificationCode } = body

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "E-posta ve doğrulama kodu gerekli" },
        { status: 400 }
      )
    }

    // Find user by email
    const userEntry = findPendingUserByEmail(email)

    if (!userEntry) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    const { id, user } = userEntry

    // Check if code matches
    if (user.verificationCode !== verificationCode) {
      return NextResponse.json(
        { error: "Geçersiz doğrulama kodu" },
        { status: 400 }
      )
    }

    // Check if code expired
    if (user.verificationCodeExpiry && new Date(user.verificationCodeExpiry) < new Date()) {
      return NextResponse.json(
        { error: "Doğrulama kodu süresi doldu. Lütfen yeni kod isteyin." },
        { status: 400 }
      )
    }

    // Mark email as verified
    user.emailVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpiry = undefined
    user.updatedAt = new Date()

    // Move user from pending to verified users
    users.set(id, user)
    pendingUsers.delete(id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      message: "E-posta başarıyla doğrulandı",
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Doğrulama sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
