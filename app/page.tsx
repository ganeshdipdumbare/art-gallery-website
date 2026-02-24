import { CartProvider } from "@/lib/cart-context"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { MarqueeBanner } from "@/components/marquee-banner"
import { Gallery } from "@/components/gallery"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"

export default function Home() {
  return (
    <CartProvider>
      <main className="w-full min-w-0 flex flex-col">
        <Navigation />
        <Hero />
        <MarqueeBanner />
        <Gallery />
        <About />
        <Contact />
        <Footer />
        <CartDrawer />
      </main>
    </CartProvider>
  )
}
