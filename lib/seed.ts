import {
  executeQuery,
  executeWrite,
  insertPainting,
  type PaintingRow,
} from "./db"
import bcrypt from "bcryptjs"

// Seed paintings featuring Ursula Ushiko's series from Daily Paintworks
// https://www.dailypaintworks.com/artists/ursula-ushiko-8267
const seedPaintings: Omit<PaintingRow, "created_at">[] = [
  {
    id: "swirl-golden",
    title: "Swirl in Gold",
    year: 2024,
    medium: "Mixed Media on Paper",
    dimensions: '12" x 12"',
    price: 450,
    description:
      "A swirling composition from the Swirl Series. Fluid movement and warm tones capture the flow of travel impressions.",
    image: "/images/painting-1.jpg",
    image_framed: "/images/painting-1-framed.jpg",
    category: "swirl",
    sold: 0,
    sort_order: 1,
  },
  {
    id: "bug-series-blue",
    title: "Bug Series - Blue",
    year: 2024,
    medium: "Acrylic on Canvas",
    dimensions: '8" x 10"',
    price: 380,
    description:
      "From the Bug series. Small format work exploring organic forms and intricate details.",
    image: "/images/painting-2.jpg",
    image_framed: "/images/painting-2-framed.jpg",
    category: "bug",
    sold: 0,
    sort_order: 2,
  },
  {
    id: "isolation-portrait",
    title: "Portrait of Solitude",
    year: 2024,
    medium: "Oil on Canvas",
    dimensions: '40" x 50"',
    price: 5600,
    description:
      "From the Isolation series. A deeply personal study exploring the beauty of introspection and quiet reflection.",
    image: "/images/painting-4.jpg",
    image_framed: "/images/painting-4-framed.jpg",
    category: "isolation",
    sold: 0,
    sort_order: 3,
  },
  {
    id: "umami-morning",
    title: "Umami Morning",
    year: 2024,
    medium: "Oil on Canvas",
    dimensions: '20" x 24"',
    price: 2400,
    description:
      "From the Umami series. A delicate still life bathed in gentle glow—everyday beauty and quiet contemplation.",
    image: "/images/painting-6.jpg",
    image_framed: "/images/painting-6-framed.jpg",
    category: "umami",
    sold: 0,
    sort_order: 4,
  },
  {
    id: "beatbox-rhythm",
    title: "Beatbox Rhythm",
    year: 2023,
    medium: "Mixed Media on Canvas",
    dimensions: '18" x 24"',
    price: 1200,
    description:
      "From the Beatbox series. Abstract rhythmic patterns inspired by sound and movement.",
    image: "/images/painting-7.jpg",
    image_framed: "/images/painting-7-framed.jpg",
    category: "beatbox",
    sold: 1,
    sort_order: 5,
  },
  {
    id: "abstract-garden",
    title: "The Garden Within",
    year: 2023,
    medium: "Acrylic on Canvas",
    dimensions: '36" x 36"',
    price: 3900,
    description:
      "From the Abstract series. An abstract floral composition representing the inner landscape of emotion.",
    image: "/images/painting-7.jpg",
    image_framed: "/images/painting-7-framed.jpg",
    category: "abstract",
    sold: 0,
    sort_order: 6,
  },
  {
    id: "abstract-terracotta",
    title: "Terracotta Dreams",
    year: 2023,
    medium: "Mixed Media on Canvas",
    dimensions: '48" x 60"',
    price: 7200,
    description:
      "From the Abstract series. Large-scale work combining traditional oil with textured elements. Warm terracotta and cream tones.",
    image: "/images/painting-5.jpg",
    image_framed: "/images/painting-5-framed.jpg",
    category: "abstract",
    sold: 1,
    sort_order: 7,
  },
  {
    id: "nature-dusk",
    title: "Dusk on the Mesa",
    year: 2024,
    medium: "Oil on Linen",
    dimensions: '30" x 48"',
    price: 4800,
    description:
      "From the Nature series. The dramatic landscape rendered in rich, saturated colors—the desert under the last rays of sunlight.",
    image: "/images/painting-8.jpg",
    image_framed: "/images/painting-8-framed.jpg",
    category: "nature",
    sold: 0,
    sort_order: 8,
  },
  {
    id: "nature-shores",
    title: "Silent Shores",
    year: 2024,
    medium: "Acrylic on Canvas",
    dimensions: '30" x 40"',
    price: 3800,
    description:
      "From the Nature series. Inspired by quiet coastlines. Soft blues and muted greens merge to create profound tranquility.",
    image: "/images/painting-2.jpg",
    image_framed: "/images/painting-2-framed.jpg",
    category: "nature",
    sold: 0,
    sort_order: 9,
  },
  {
    id: "collage-travel",
    title: "Travel Impressions",
    year: 2024,
    medium: "Collage on Paper",
    dimensions: '11" x 14"',
    price: 650,
    description:
      "From the Collage series. Travel impressions from Eastern Europe translated into layered collage. Small format focus.",
    image: "/images/painting-1.jpg",
    image_framed: "",
    category: "collage",
    sold: 0,
    sort_order: 10,
  },
]

export async function seedDatabase() {
  const count = await executeQuery<{ c: number }>(
    "SELECT COUNT(*) as c FROM paintings"
  )
  if (count && count.c === 0) {
    for (const p of seedPaintings) {
      await insertPainting(p)
    }
  }

  const adminCount = await executeQuery<{ c: number }>(
    "SELECT COUNT(*) as c FROM admin_users"
  )
  if (adminCount && adminCount.c === 0) {
    const hash = bcrypt.hashSync("admin123", 10)
    await executeWrite(
      "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
      ["admin", hash]
    )
  }
}
