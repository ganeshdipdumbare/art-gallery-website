import { NextRequest, NextResponse } from "next/server"
import { getAllPaintings, getPaintingsPaginated } from "@/lib/db"
import { seedDatabase } from "@/lib/seed"
import { PAINTING_CATEGORIES } from "@/lib/painting-types"

export async function GET(request: NextRequest) {
  try {
    await seedDatabase()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")

    const hasPaginatedParams =
      category !== null ||
      (page !== null && page !== "") ||
      (limit !== null && limit !== "")

    if (hasPaginatedParams) {
      const validCategory =
        category && (PAINTING_CATEGORIES as readonly string[]).includes(category)
          ? category
          : undefined
      const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1
      const limitNum = limit ? Math.min(24, Math.max(1, parseInt(limit, 10) || 8)) : 8

      const result = await getPaintingsPaginated({
        category: validCategory,
        page: pageNum,
        limit: limitNum,
      })
      return NextResponse.json(result)
    }

    const paintings = await getAllPaintings()
    return NextResponse.json(paintings)
  } catch (error) {
    console.error("Failed to fetch paintings:", error)
    return NextResponse.json({ error: "Failed to fetch paintings" }, { status: 500 })
  }
}
