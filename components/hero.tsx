"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden w-full">
      {/* Ambient orbs — warm, gallery-like glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.3 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[15%] left-[10%] w-[min(28rem,80vw)] h-[28rem] rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[min(24rem,70vw)] h-[24rem] rounded-full bg-ring/25 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-muted-foreground/5 blur-[120px]" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, oklch(0.98 0.008 85 / 0.3) 100%)",
          }}
        />
      </motion.div>

      {/* Artistic horizontal lines — tapered, elegant */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-1/3 left-0 right-0 h-px origin-left"
        aria-hidden="true"
      >
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(90deg, oklch(0.55 0.15 35 / 0.15) 0%, oklch(0.85 0.02 65) 50%, transparent 100%)",
          }}
        />
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-2/3 left-0 right-0 h-px origin-right"
        aria-hidden="true"
      >
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, oklch(0.85 0.02 65) 50%, oklch(0.55 0.15 35 / 0.15) 100%)",
          }}
        />
      </motion.div>

      <div className="relative text-center max-w-5xl mx-auto w-full min-w-0 px-1">
        {/* Subtitle above */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase text-muted-foreground mb-8 font-medium"
        >
          Original Fine Art
        </motion.p>

        {/* Main title */}
        <div className="overflow-hidden pb3">
          <motion.h1
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl min-[375px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground leading-[0.9] tracking-tight text-balance break-words"
          >
            Ursula
          </motion.h1>
        </div>
        <div className="overflow-hidden mt-2 pb-3">
          <motion.h1
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-4xl min-[375px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-stroke leading-[0.9] tracking-tight italic break-words"
          >
            Ushiko
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 md:mt-14 text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.7] text-pretty"
        >
          Travel impressions translated into abstract art, collage, and painting.
          Original works from Berlin and San Francisco.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10"
        >
          <a
            href="#gallery"
            className="btn-artistic inline-flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase text-foreground border-2 border-foreground px-6 sm:px-8 py-4 hover:bg-foreground hover:text-background"
          >
            View Collection
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/80">Scroll</span>
          <ArrowDown className="w-4 h-4 text-muted-foreground/70" strokeWidth={2} />
        </motion.div>
      </motion.div>
    </section>
  )
}
