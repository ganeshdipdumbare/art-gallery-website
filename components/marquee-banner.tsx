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
      className="py-6 border-y border-border overflow-hidden"
    >
      <div className="marquee-track whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 mx-6 text-sm tracking-[0.25em] uppercase text-muted-foreground"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </div>
    </motion.div>
  )
}
