import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"
import { pendingUsers, findPendingUserByEmail } from "@/lib/users-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi gerekli" },
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

    // Generate new verification code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date()
    expiry.setMinutes(expiry.getMinutes() + 15)

    user.verificationCode = newCode
    user.verificationCodeExpiry = expiry
    user.updatedAt = new Date()

    pendingUsers.set(id, user)

    // Send verification email
    await emailService.sendVerificationEmail(user.email, newCode, user.name)

    return NextResponse.json({
      success: true,
      message: "Yeni doğrulama kodu gönderildi",
    })
  } catch (error) {
    console.error("Resend code error:", error)
    return NextResponse.json(
      { error: "Kod gönderilemedi" },
      { status: 500 }
    )
  }
}
