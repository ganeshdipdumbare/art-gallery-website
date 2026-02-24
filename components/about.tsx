"use client"

import Image from "next/image"
import { ScrollReveal } from "./scroll-reveal"

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 bg-secondary w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/artist-portrait.jpg"
                  alt="Ursula Ushiko in her studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle inner frame */}
                <div
                  className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/20"
                  aria-hidden="true"
                />
              </div>
              {/* Artistic offset frame — double border for gallery feel */}
              <div
                className="absolute -bottom-5 -right-5 w-full h-full border-2 border-accent/60 -z-10"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-7 -right-7 w-full h-full border border-accent/30 -z-10"
                aria-hidden="true"
              />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" delay={0.2}>
            <div>
              <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-4 font-medium">
                About the Artist
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-[0.95] tracking-tight mb-6 md:mb-8">
                Every brushstroke
                <br />
                <span className="italic">tells a story</span>
              </h2>

              <div className="space-y-5 text-muted-foreground leading-[1.75]">
                <p>
                  Thank you for visiting my gallery. After having studied Interior
                  Design + Architecture in Germany and Egypt, I worked at my own
                  studio—Square One Interiors—in San Francisco for 25+ years.
                  Now I spend most of my time with my two passions: art and
                  travel. I am living the dream.
                </p>
                <p>
                  I translate my travel impressions into my—mostly
                  abstract—works. Currently my emphasis is on collage and
                  painting in small formats. As a dedicated autodidact, I have
                  had a variety of teachers in painting, collage, photography,
                  and sculpture from an early age to this day. I study original
                  works from all art movements in museums and find they are also
                  great teachers, as are my artist friends.
                </p>
                <p>
                  I currently live and work in Berlin and San Francisco. Always
                  happy for your feedback. I hope you enjoy my works—at best in
                  your home.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-border">
                <div>
                  <p className="font-serif text-3xl md:text-4xl text-foreground">
                    25+
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
                    Years Design
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl md:text-4xl text-foreground">
                    8
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
                    Series
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl md:text-4xl text-foreground">
                    2
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
                    Studios
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
