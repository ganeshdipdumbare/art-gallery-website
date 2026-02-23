import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  executeQuery,
  insertPainting,
  updatePainting,
  deletePainting,
} from "@/lib/db"
import { seedDatabase } from "@/lib/seed"

async function verifyAdmin(): Promise<boolean> {
  try {
    await seedDatabase()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value
    if (!sessionId) return false
    const session = await executeQuery(
      "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')",
      [sessionId]
    )
    return !!session
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    if (!body.image) {
      return NextResponse.json(
        { error: "Image is required. Please upload an image." },
        { status: 400 }
      )
    }
    const id =
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now().toString(36)

    await insertPainting({
      id,
      title: body.title,
      year: body.year,
      medium: body.medium,
      dimensions: body.dimensions,
      price: body.price,
      description: body.description,
      image: body.image || "", // base64 data URL or empty; placeholder used if empty
      image_framed: body.image_framed || "",
      category: body.category,
      sold: body.sold ? 1 : 0,
      sort_order: body.sort_order || 99,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Failed to create painting:", error)
    return NextResponse.json({ error: "Failed to create painting" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) {
      return NextResponse.json({ error: "Painting ID required" }, { status: 400 })
    }
    await updatePainting(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update painting:", error)
    return NextResponse.json({ error: "Failed to update painting" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Painting ID required" }, { status: 400 })
    }
    await deletePainting(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete painting:", error)
    return NextResponse.json({ error: "Failed to delete painting" }, { status: 500 })
  }
}
