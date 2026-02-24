"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { label: "Works", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, setIsOpen: setCartOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-5 w-full max-w-[100vw]">
          <a
            href="#"
            className="font-serif text-xl md:text-2xl tracking-tight text-foreground"
          >
            Ursula Ushiko
          </a>

          <div className="flex items-center gap-6 md:gap-10">
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-foreground hover:text-accent transition-colors duration-300"
              aria-label={`Open cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-medium flex items-center justify-center rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-foreground"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-5">
              <span className="font-serif text-xl text-foreground">
                Ursula Ushiko
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-foreground"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-[80vh] gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="font-serif text-4xl text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
