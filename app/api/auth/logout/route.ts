import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { executeWrite } from "@/lib/db"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value
    if (sessionId) {
      await executeWrite("DELETE FROM sessions WHERE id = ?", [sessionId])
    }
    cookieStore.delete("session_id")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout failed:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
