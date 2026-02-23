"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PaintingImage } from "./painting-image"
import { X, ShoppingBag, Frame, ImageIcon } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { PaintingRow } from "@/lib/painting-types"

interface PaintingModalProps {
  painting: PaintingRow | null
  onClose: () => void
}

export function PaintingModal({ painting, onClose }: PaintingModalProps) {
  const [showFramed, setShowFramed] = useState(false)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  if (!painting) return null

  const handleAddToCart = () => {
    addItem({
      id: painting.id,
      reference_id: painting.reference_id,
      title: painting.title,
      price: painting.price,
      image: painting.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <AnimatePresence>
      {painting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background w-full max-w-5xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Close painting detail"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image with frame toggle - single image, automatic frame overlay */}
              <div className="relative">
                <div className="relative aspect-[4/5] lg:min-h-[600px] bg-muted/50">
                  <motion.div
                    layout
                    className={`absolute overflow-hidden transition-all duration-300 ${
                      showFramed
                        ? "inset-4 md:inset-6 bg-background border-[12px] border-white shadow-lg"
                        : "inset-0"
                    }`}
                  >
                    <PaintingImage
                      src={painting.image || "/placeholder.svg"}
                      alt={`${painting.title}${showFramed ? " - framed view" : ""}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Frame toggle - always visible */}
                <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                  <button
                    onClick={() => setShowFramed(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                      !showFramed
                        ? "bg-foreground text-background"
                        : "bg-background/95 text-foreground border border-border hover:bg-background"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Original
                  </button>
                  <button
                    onClick={() => setShowFramed(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                      showFramed
                        ? "bg-foreground text-background"
                        : "bg-background/95 text-foreground border border-border hover:bg-background"
                    }`}
                  >
                    <Frame className="w-3.5 h-3.5" />
                    Framed
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                    {painting.category.charAt(0).toUpperCase() +
                      painting.category.slice(1) +
                      " Series"}
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">
                    {painting.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {painting.year}
                    {painting.reference_id && (
                      <span className="ml-2 text-xs">Ref: {painting.reference_id}</span>
                    )}
                  </p>

                  <div className="h-px bg-border my-8" />

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        Medium
                      </p>
                      <p className="text-sm text-foreground">
                        {painting.medium}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        Dimensions
                      </p>
                      <p className="text-sm text-foreground">
                        {painting.dimensions}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {painting.description}
                  </p>
                </div>

                {/* Price & Purchase */}
                <div className="mt-10">
                  <div className="h-px bg-border mb-8" />

                  {painting.sold ? (
                    <div className="text-center py-4">
                      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                        This painting has found its home
                      </p>
                      <p className="font-serif text-2xl text-foreground mt-2">
                        Sold
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                          Price
                        </p>
                        <p className="font-serif text-2xl text-foreground">
                          ${painting.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        disabled={added}
                        className={`flex items-center justify-center gap-3 w-full py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 ${
                          added
                            ? "bg-accent text-accent-foreground"
                            : "bg-foreground text-background hover:opacity-90"
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {added ? "Added to Cart" : "Add to Cart"}
                      </button>

                      <p className="text-center text-xs text-muted-foreground mt-4">
                        Secure checkout via PayPal. Free shipping within the US.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
