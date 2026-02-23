import { NextResponse } from "next/server"
import { getAllPaintings } from "@/lib/db"
import { seedDatabase } from "@/lib/seed"

export async function GET() {
  try {
    await seedDatabase()
    const paintings = await getAllPaintings()
    return NextResponse.json(paintings)
  } catch (error) {
    console.error("Failed to fetch paintings:", error)
    return NextResponse.json({ error: "Failed to fetch paintings" }, { status: 500 })
  }
}
