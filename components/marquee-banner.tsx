"use client"

import { motion } from "framer-motion"

const items = [
  "Oil Painting",
  "Acrylic",
  "Mixed Media",
  "Abstract",
  "Landscape",
  "Portrait",
  "Still Life",
  "Contemporary",
]

export function MarqueeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-7 md:py-8 border-y border-border overflow-hidden w-full marquee-fade"
    >
      <div className="marquee-track whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 mx-8 text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/90 font-medium"
          >
            {item}
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent/70"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </motion.div>
  )
}
