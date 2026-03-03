"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { PaintingImage } from "./painting-image"
import type { PaintingRow } from "@/lib/painting-types"

interface ExhibitionCardProps {
  category: string
  workCount: number
  featuredPainting: PaintingRow
  onClick: () => void
}

export function ExhibitionCard({
  category,
  workCount,
  featuredPainting,
  onClick,
}: ExhibitionCardProps) {
  const displayName =
    category.charAt(0).toUpperCase() + category.slice(1) + " Series"

  return (
    <motion.button
      onClick={onClick}
      className="exhibition-card group relative w-full overflow-hidden cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <PaintingImage
          src={featuredPainting.image || "/placeholder.svg"}
          alt={displayName}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient overlay - always present for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

        {/* Hover overlay - darker gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content - default state */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
          <p className="text-xs tracking-[0.3em] uppercase text-background/80 mb-2">
            {workCount} {workCount === 1 ? "work" : "works"}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-background">
            {displayName}
          </h3>
          {/* Hover CTA */}
          <div className="flex items-center gap-3 mt-4 text-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm tracking-[0.2em] uppercase">
              Enter exhibition
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.button>
  )
}
