"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Large name display */}
      <div className="overflow-hidden py-16 md:py-24 px-6 md:px-12">
        <motion.div
          initial={{ y: 100 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-serif text-6xl md:text-8xl lg:text-[10rem] text-foreground/5 leading-none tracking-tight select-none" aria-hidden="true">
            Ursula Ushiko
          </p>
        </motion.div>
      </div>

      {/* Footer links */}
      <div className="border-t border-border px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground tracking-wider">
            &copy; {new Date().getFullYear()} Ursula Ushiko. All rights
            reserved.
          </p>
          <div className="flex items-center gap-8">
            <a
              href="https://www.dailypaintworks.com/artists/ursula-ushiko-8267"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Daily Paintworks
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Pinterest
            </a>
            <a
              href="#"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
