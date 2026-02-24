"use client"

import { ScrollReveal } from "./scroll-reveal"

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 w-full relative">
      {/* Decorative top divider */}
      <div className="artistic-divider w-full max-w-2xl mx-auto mb-12 md:mb-16" />
      <div className="max-w-4xl mx-auto text-center w-full min-w-0">
        <ScrollReveal>
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-4 font-medium">
            Get in Touch
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] tracking-tight text-balance">
            Interested in a piece?
            <br />
            <span className="italic">{"Let's connect."}</span>
          </h2>
          <p className="mt-8 text-muted-foreground max-w-xl mx-auto leading-[1.7] text-pretty">
            Whether you are a collector, gallery owner, or simply an art
            enthusiast, I would love to hear from you. Commissions and private
            viewings are available by appointment.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="mailto:hello@elenavasquez.com"
              className="btn-artistic inline-flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase text-foreground border-2 border-foreground px-8 py-4 hover:bg-foreground hover:text-background"
            >
              Send an Email
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-artistic inline-flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase text-muted-foreground border-2 border-border px-8 py-4 hover:border-foreground hover:text-foreground"
            >
              Follow on Instagram
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
