"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen, clearCart } = useCart()

  const paypalCartUrl = () => {
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr"
    const params = new URLSearchParams()
    params.set("cmd", "_cart")
    params.set("upload", "1")
    params.set("business", process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "artist@elenavasquez.com")
    params.set("currency_code", "USD")
    params.set("no_shipping", "0")

    const appUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || ""
    if (appUrl) {
      params.set("notify_url", `${appUrl}/api/webhooks/paypal`)
    }

    const paintingIds: string[] = []
    items.forEach((item, i) => {
      const n = i + 1
      const refLabel = item.reference_id ? ` [${item.reference_id}]` : ""
      params.set(`item_name_${n}`, `${item.title}${refLabel}`)
      params.set(`amount_${n}`, item.price.toFixed(2))
      params.set(`quantity_${n}`, item.quantity.toString())
      for (let q = 0; q < item.quantity; q++) paintingIds.push(item.id)
    })
    if (paintingIds.length > 0) {
      params.set("custom", paintingIds.join(","))
    }

    return `${baseUrl}?${params.toString()}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <h2 className="font-serif text-xl text-foreground">
                  Your Cart
                </h2>
                <span className="text-xs tracking-wider text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-all duration-300"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="font-serif text-lg text-foreground mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Browse the gallery to add paintings
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-sm text-foreground leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-all text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-foreground w-4 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-all text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Total
                  </p>
                  <p className="font-serif text-2xl text-foreground">
                    ${totalPrice.toLocaleString()}
                  </p>
                </div>

                <a
                  href={paypalCartUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(() => clearCart(), 1000)
                  }}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-foreground text-background text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity duration-300"
                >
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 24 32"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.067 8.478c.492-3.14-.003-5.282-1.71-7.217C16.604-.439 13.53.012 10.954.012H3.71c-.59 0-1.093.434-1.185 1.02L.024 23.155c-.07.438.263.834.705.834h5.13l1.29-8.184-.04.258c.092-.586.591-1.017 1.18-1.017h2.458c4.83 0 8.612-1.963 9.718-7.637.033-.168.061-.332.087-.493l-.004-.002-.481.564z" />
                    <path d="M9.625 8.512a1.18 1.18 0 0 1 .463-.544c.186-.12.402-.186.629-.186h4.478c.53 0 1.024.034 1.485.105a9.89 9.89 0 0 1 1.062.252c.186.06.365.13.54.207.095-.607.094-1.02.094-1.14 0-3.5-2.854-5.194-7.037-5.194H5.312c-.59 0-1.097.434-1.186 1.02L1.631 23.155c-.07.438.263.834.705.834h5.13l1.29-8.184.869-7.293z" />
                  </svg>
                  Checkout with PayPal
                </a>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Secure checkout via PayPal. Free shipping within the US.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
