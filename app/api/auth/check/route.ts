import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeQuery } from "@/lib/db"
import { seedDatabase } from "@/lib/seed"

export async function GET() {
  try {
    await seedDatabase()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value
    if (!sessionId) {
      return NextResponse.json({ authenticated: false })
    }
    const session = await executeQuery<{
      id: string
      admin_id: number
      expires_at: string
    }>(
      "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')",
      [sessionId]
    )
    if (!session) {
      return NextResponse.json({ authenticated: false })
    }
    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
