// Shared painting types and constants for use in both server and client components.
// Keep this file free of Node.js/database imports so it can be used in "use client" components.

// Ursula Ushiko series from Daily Paintworks: https://www.dailypaintworks.com/artists/ursula-ushiko-8267
export const PAINTING_CATEGORIES = [
  "swirl",
  "bug",
  "isolation",
  "umami",
  "beatbox",
  "abstract",
  "nature",
  "collage",
] as const

export type PaintingCategory = (typeof PAINTING_CATEGORIES)[number]

export interface PaintingRow {
  id: string
  reference_id: string
  title: string
  year: number
  medium: string
  dimensions: string
  price: number
  description: string
  image: string
  image_framed: string
  category: PaintingCategory
  sold: number
  sort_order: number
  created_at: string
}
