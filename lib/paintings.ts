export interface Painting {
  id: string
  title: string
  year: number
  medium: string
  dimensions: string
  price: number
  description: string
  image: string
  category: "abstract" | "landscape" | "portrait" | "still-life"
  sold: boolean
}

export const paintings: Painting[] = [
  {
    id: "golden-reverie",
    title: "Golden Reverie",
    year: 2024,
    medium: "Oil on Canvas",
    dimensions: '36" x 48"',
    price: 4200,
    description:
      "A luminous exploration of warmth and memory, this painting captures the golden hour in abstract form. Layers of ochre, amber, and burnt sienna create a sense of depth that draws the viewer into a meditative state.",
    image: "/images/painting-1.jpg",
    category: "abstract",
    sold: false,
  },
  {
    id: "silent-shores",
    title: "Silent Shores",
    year: 2024,
    medium: "Acrylic on Canvas",
    dimensions: '30" x 40"',
    price: 3800,
    description:
      "Inspired by the quiet coastlines of the Mediterranean, this piece evokes the stillness of dawn over the sea. Soft blues and muted greens merge to create an atmosphere of profound tranquility.",
    image: "/images/painting-2.jpg",
    category: "landscape",
    sold: false,
  },
  {
    id: "whispers-of-autumn",
    title: "Whispers of Autumn",
    year: 2023,
    medium: "Oil on Linen",
    dimensions: '24" x 36"',
    price: 3200,
    description:
      "Rich earth tones and delicate brushwork capture the fleeting beauty of autumn. Each stroke carries the weight of seasonal change, creating a tapestry of falling leaves and fading light.",
    image: "/images/painting-3.jpg",
    category: "landscape",
    sold: false,
  },
  {
    id: "portrait-of-solitude",
    title: "Portrait of Solitude",
    year: 2024,
    medium: "Oil on Canvas",
    dimensions: '40" x 50"',
    price: 5600,
    description:
      "A deeply personal portrait study that explores the beauty of introspection. The figure emerges from shadow, bathed in warm light that reveals both vulnerability and strength.",
    image: "/images/painting-4.jpg",
    category: "portrait",
    sold: false,
  },
  {
    id: "terracotta-dreams",
    title: "Terracotta Dreams",
    year: 2023,
    medium: "Mixed Media on Canvas",
    dimensions: '48" x 60"',
    price: 7200,
    description:
      "An ambitious large-scale work that combines traditional oil painting with textured elements. Warm terracotta and cream tones create a dreamlike composition that blurs the line between abstraction and figuration.",
    image: "/images/painting-5.jpg",
    category: "abstract",
    sold: true,
  },
  {
    id: "morning-light",
    title: "Morning Light",
    year: 2024,
    medium: "Oil on Canvas",
    dimensions: '20" x 24"',
    price: 2400,
    description:
      "A delicate still life bathed in the gentle glow of morning sunlight. Simple forms and soft shadows create a sense of everyday beauty and quiet contemplation.",
    image: "/images/painting-6.jpg",
    category: "still-life",
    sold: false,
  },
  {
    id: "the-garden-within",
    title: "The Garden Within",
    year: 2023,
    medium: "Acrylic on Canvas",
    dimensions: '36" x 36"',
    price: 3900,
    description:
      "An abstract floral composition that represents the inner landscape of emotion. Vibrant earthy tones bloom across the canvas, creating a sense of organic growth and renewal.",
    image: "/images/painting-7.jpg",
    category: "abstract",
    sold: false,
  },
  {
    id: "dusk-on-the-mesa",
    title: "Dusk on the Mesa",
    year: 2024,
    medium: "Oil on Linen",
    dimensions: '30" x 48"',
    price: 4800,
    description:
      "The dramatic landscape of the American Southwest rendered in rich, saturated colors. This painting captures the moment when the desert transforms under the last rays of sunlight.",
    image: "/images/painting-8.jpg",
    category: "landscape",
    sold: false,
  },
]
