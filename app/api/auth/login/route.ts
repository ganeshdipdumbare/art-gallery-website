import { NextResponse } from "next/server"
import { executeQuery, executeWrite } from "@/lib/db"
import { seedDatabase } from "@/lib/seed"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    await seedDatabase()
    const { username, password } = await req.json()
    const user = await executeQuery<{
      id: number
      username: string
      password_hash: string
    }>("SELECT * FROM admin_users WHERE username = ?", [username])

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    await executeWrite(
      "INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)",
      [sessionId, user.id, expiresAt]
    )

    const cookieStore = await cookies()
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
