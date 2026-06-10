"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PaintingImage } from "./painting-image"
import { ScrollReveal } from "./scroll-reveal"
import { PaintingModal } from "./painting-modal"
import { PAINTING_CATEGORIES, type PaintingRow } from "@/lib/painting-types"
import { getPageNumbers } from "@/lib/pagination"

const categories = ["all", ...PAINTING_CATEGORIES] as const
const ITEMS_PER_PAGE = 6
// Wide-aspect slots are the first and last card on every page.
// Defined here so changing ITEMS_PER_PAGE automatically updates the layout.
const WIDE_SLOT_INDICES = new Set([0, ITEMS_PER_PAGE - 1])
const GALLERY_SECTION_ID = "gallery"

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [selectedPainting, setSelectedPainting] = useState<PaintingRow | null>(null)
  const [paintings, setPaintings] = useState<PaintingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch("/api/paintings")
      .then((r) => r.json())
      .then((data) => {
        setPaintings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredPaintings =
    activeCategory === "all"
      ? paintings
      : paintings.filter((p) => p.category === activeCategory)

  const totalPages = Math.max(1, Math.ceil(filteredPaintings.length / ITEMS_PER_PAGE))

  // Clamp currentPage if totalPages shrinks (e.g. paintings deleted externally).
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [totalPages, currentPage])

  const safePage = Math.min(currentPage, totalPages)
  const paginatedPaintings = filteredPaintings.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  )

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    document.getElementById(GALLERY_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Safe result-count range — guards against a stale safePage after shrinkage.
  const rangeStart = filteredPaintings.length === 0
    ? 0
    : Math.min((safePage - 1) * ITEMS_PER_PAGE + 1, filteredPaintings.length)
  const rangeEnd = Math.min(safePage * ITEMS_PER_PAGE, filteredPaintings.length)

  return (
    <>
      <section id={GALLERY_SECTION_ID} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 w-full">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-12 md:mb-16">
              <div>
                <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-4 font-medium">
                  Collection
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] tracking-tight">
                  Selected
                  <br />
                  <span className="italic">Works</span>
                </h2>
              </div>

              {/* Filter - scrollable on mobile */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 scrollbar-hide md:overflow-visible md:flex-wrap md:mx-0 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 border flex-shrink-0 ${
                      activeCategory === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {cat === "all"
                      ? "All"
                      : `${cat.charAt(0).toUpperCase() + cat.slice(1)} Series`}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`${i === 0 ? "md:col-span-2" : ""}`}>
                    <div className={`bg-muted animate-pulse ${i === 0 ? "aspect-[21/9]" : "aspect-[4/5]"}`} />
                    <div className="py-4 flex justify-between">
                      <div>
                        <div className="h-5 w-32 bg-muted animate-pulse" />
                        <div className="h-3 w-24 bg-muted animate-pulse mt-2" />
                      </div>
                      <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gallery Grid */}
            {!loading && (
              <>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {paginatedPaintings.map((painting, index) => {
                      const absoluteIndex = (safePage - 1) * ITEMS_PER_PAGE + index
                      const isWide = WIDE_SLOT_INDICES.has(absoluteIndex % ITEMS_PER_PAGE)
                      return (
                      <motion.div
                        key={painting.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.08,
                          layout: { duration: 0.4 },
                        }}
                        className={`${isWide ? "md:col-span-2" : ""}`}
                      >
                        <button
                          onClick={() => setSelectedPainting(painting)}
                          className="painting-card group relative w-full overflow-hidden cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                        >
                          <div
                            className={`painting-frame relative ${
                              isWide ? "aspect-[21/9]" : "aspect-[4/5]"
                            } overflow-hidden`}
                          >
                            <PaintingImage
                              src={painting.image || "/placeholder.svg"}
                              alt={painting.title}
                              fill
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <p className="text-sm tracking-[0.2em] uppercase text-background/70 mb-2">
                                {painting.medium}
                              </p>
                              <h3 className="font-serif text-2xl md:text-3xl text-background">
                                {painting.title}
                              </h3>
                              <div className="flex items-center gap-4 mt-3">
                                <span className="text-sm text-background/70">{painting.year}</span>
                                <span className="w-8 h-px bg-background/40" />
                                {painting.sold ? (
                                  <span className="text-xs tracking-[0.2em] uppercase text-background/50">
                                    Sold
                                  </span>
                                ) : (
                                  <span className="text-sm text-background/90">
                                    ${painting.price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Sold badge */}
                            {painting.sold && (
                              <div className="absolute top-4 right-4 z-10 bg-foreground/90 text-background text-xs tracking-[0.2em] uppercase px-3 py-1.5">
                                Sold
                              </div>
                            )}
                          </div>

                          {/* Card footer */}
                          <div className="flex items-center justify-between py-4">
                            <div>
                              <h3 className="font-serif text-lg text-foreground">{painting.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {painting.dimensions} &middot; {painting.year}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {!painting.sold && (
                                <span className="text-sm text-foreground">
                                  ${painting.price.toLocaleString()}
                                </span>
                              )}
                              <span className="w-8 h-8 flex items-center justify-center border-2 border-border rounded-full group-hover:bg-foreground group-hover:border-foreground group-hover:text-background transition-all duration-500 ease-out">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                >
                                  <path d="M1 11L11 1M11 1H3M11 1V9" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )})}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-12 md:mt-16 border-t border-border pt-8">
                    {/* Result count */}
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {rangeStart}–{rangeEnd} of {filteredPaintings.length}
                    </p>

                    {/* Page controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                      >
                        <ChevronLeft size={14} />
                      </button>

                      {getPageNumbers(safePage, totalPages).map((p, i) =>
                        p === "ellipsis" ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="w-9 h-9 flex items-center justify-center text-muted-foreground text-xs"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            aria-label={`Page ${p}`}
                            aria-current={p === currentPage ? "page" : undefined}
                            className={`w-9 h-9 flex items-center justify-center border text-xs tracking-[0.1em] transition-all duration-200 ${
                              p === currentPage
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Painting Modal */}
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </>
  )
}
