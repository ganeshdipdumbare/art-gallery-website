"use client"

import { ScrollReveal } from "./scroll-reveal"

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Get in Touch
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] tracking-tight text-balance">
            Interested in a piece?
            <br />
            <span className="italic">{"Let's connect."}</span>
          </h2>
          <p className="mt-8 text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty">
            Whether you are a collector, gallery owner, or simply an art
            enthusiast, I would love to hear from you. Commissions and private
            viewings are available by appointment.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@elenavasquez.com"
              className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-foreground border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-500"
            >
              Send an Email
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-muted-foreground border border-border px-8 py-4 hover:border-foreground hover:text-foreground transition-all duration-500"
            >
              Follow on Instagram
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
