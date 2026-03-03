"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { PaintingImage } from "./painting-image"
import { ScrollReveal } from "./scroll-reveal"
import { PaintingModal } from "./painting-modal"
import { ExhibitionCard } from "./exhibition-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./ui/pagination"
import { PAINTING_CATEGORIES, type PaintingRow } from "@/lib/painting-types"

const WORKS_PER_PAGE = 8

function groupPaintingsByCategory(paintings: PaintingRow[]) {
  const byCategory = new Map<string, PaintingRow[]>()
  for (const p of paintings) {
    const list = byCategory.get(p.category) ?? []
    list.push(p)
    byCategory.set(p.category, list)
  }
  return byCategory
}

export function Gallery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const exhibitionParam = searchParams.get("exhibition")
  const pageParam = searchParams.get("page")

  const [selectedPainting, setSelectedPainting] = useState<PaintingRow | null>(
    null
  )
  const [allPaintings, setAllPaintings] = useState<PaintingRow[]>([])
  const [roomPaintings, setRoomPaintings] = useState<PaintingRow[]>([])
  const [roomTotal, setRoomTotal] = useState(0)
  const [roomHasMore, setRoomHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [roomLoading, setRoomLoading] = useState(false)

  const isInRoom = Boolean(exhibitionParam)
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1)

  const setExhibition = useCallback(
    (exhibition: string | null, page = 1) => {
      const params = new URLSearchParams()
      if (exhibition) {
        params.set("exhibition", exhibition)
        params.set("page", String(page))
      }
      const query = params.toString()
      const href = query ? `${pathname}?${query}` : pathname
      router.push(href + "#gallery")
    },
    [router, pathname]
  )

  useEffect(() => {
    if (!isInRoom) {
      fetch("/api/paintings")
        .then((r) => r.json())
        .then((data) => {
          setAllPaintings(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [isInRoom])

  useEffect(() => {
    if (isInRoom && exhibitionParam) {
      setRoomLoading(true)
      const params = new URLSearchParams()
      if (exhibitionParam !== "all") {
        params.set("category", exhibitionParam)
      }
      params.set("page", String(currentPage))
      params.set("limit", String(WORKS_PER_PAGE))

      fetch(`/api/paintings?${params}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paintings) {
            setRoomPaintings(data.paintings)
            setRoomTotal(data.total ?? 0)
            setRoomHasMore(data.hasMore ?? false)
          } else {
            setRoomPaintings([])
            setRoomTotal(0)
            setRoomHasMore(false)
          }
          setRoomLoading(false)
        })
        .catch(() => {
          setRoomPaintings([])
          setRoomTotal(0)
          setRoomHasMore(false)
          setRoomLoading(false)
        })
    }
  }, [isInRoom, exhibitionParam, currentPage])

  const byCategory = groupPaintingsByCategory(allPaintings)
  const exhibitions = PAINTING_CATEGORIES.filter((cat) => {
    const list = byCategory.get(cat)
    return list && list.length > 0
  })

  const totalPages = Math.ceil(roomTotal / WORKS_PER_PAGE) || 1

  return (
    <>
      <section
        id="gallery"
        className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 w-full"
      >
        <ScrollReveal>
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {!isInRoom ? (
              <>
                {/* Lobby: Exhibition cards */}
                <div className="mb-12 md:mb-16">
                  <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-4 font-medium">
                    Current Exhibitions
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground leading-[0.95] tracking-tight">
                    Select a series
                    <br />
                    <span className="italic">to explore</span>
                  </h2>
                </div>

                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="aspect-[4/5] bg-muted animate-pulse" />
                    ))}
                  </div>
                )}

                {!loading && exhibitions.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-muted-foreground">
                      No exhibitions available at the moment.
                    </p>
                  </div>
                )}

                {!loading && exhibitions.length > 0 && (
                  <>
                    <motion.div
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                      <AnimatePresence mode="popLayout">
                        {exhibitions.map((cat, index) => {
                          const works = byCategory.get(cat) ?? []
                          const featured = works[0]
                          if (!featured) return null
                          return (
                            <motion.div
                              key={cat}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: index * 0.06,
                              }}
                            >
                              <ExhibitionCard
                                category={cat}
                                workCount={works.length}
                                featuredPainting={featured}
                                onClick={() => setExhibition(cat)}
                              />
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </motion.div>

                    {allPaintings.length > 0 && (
                      <div className="mt-12 text-center">
                        <button
                          onClick={() => setExhibition("all")}
                          className="text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 border-b border-transparent hover:border-foreground pb-1"
                        >
                          View all {allPaintings.length} works
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {/* Room: Inside an exhibition */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 md:mb-16">
                  <button
                    onClick={() => setExhibition(null)}
                    className="flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to exhibitions
                  </button>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground">
                      {exhibitionParam === "all"
                        ? "All Works"
                        : `${(exhibitionParam ?? "").charAt(0).toUpperCase()}${(exhibitionParam ?? "").slice(1)} Series`}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {roomTotal} {roomTotal === 1 ? "work" : "works"}
                    </p>
                  </div>
                </div>

                {roomLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`${i === 0 ? "md:col-span-2" : ""}`}
                      >
                        <div
                          className={`bg-muted animate-pulse ${
                            i === 0 ? "aspect-[21/9]" : "aspect-[4/5]"
                          }`}
                        />
                        <div className="py-4 flex justify-between">
                          <div>
                            <div className="h-5 w-32 bg-muted animate-pulse" />
                            <div className="h-3 w-24 bg-muted animate-pulse mt-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!roomLoading && roomPaintings.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-muted-foreground">
                      No works in this exhibition.
                    </p>
                  </div>
                )}

                {!roomLoading && roomPaintings.length > 0 && (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {roomPaintings.map((painting, index) => (
                        <motion.div
                          key={painting.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.05,
                            layout: { duration: 0.3 },
                          }}
                          className={`${
                            index === 0 || index === 5 ? "md:col-span-2" : ""
                          }`}
                        >
                          <button
                            onClick={() => setSelectedPainting(painting)}
                            className="painting-card group relative w-full overflow-hidden cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                          >
                            <div
                              className={`painting-frame relative ${
                                index === 0 || index === 5
                                  ? "aspect-[21/9]"
                                  : "aspect-[4/5]"
                              } overflow-hidden`}
                            >
                              <PaintingImage
                                src={painting.image || "/placeholder.svg"}
                                alt={painting.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                              />

                              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <p className="text-sm tracking-[0.2em] uppercase text-background/70 mb-2">
                                  {painting.medium}
                                </p>
                                <h3 className="font-serif text-2xl md:text-3xl text-background">
                                  {painting.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-3">
                                  <span className="text-sm text-background/70">
                                    {painting.year}
                                  </span>
                                  <span className="w-8 h-px bg-background/40" />
                                  {painting.sold ? (
                                    <span className="text-xs tracking-[0.2em] uppercase text-background/50">
                                      Sold
                                    </span>
                                  ) : (
                                    <span className="text-sm text-background/90">
                                      $
                                      {painting.price.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {painting.sold ? (
                                <div className="absolute top-4 right-4 z-10 bg-foreground/90 text-background text-xs tracking-[0.2em] uppercase px-3 py-1.5">
                                  Sold
                                </div>
                              ) : null}
                            </div>

                            <div className="flex items-center justify-between py-4">
                              <div>
                                <h3 className="font-serif text-lg text-foreground">
                                  {painting.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {painting.dimensions} &middot;{" "}
                                  {painting.year}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {!painting.sold && (
                                  <span className="text-sm text-foreground">
                                    $
                                    {painting.price.toLocaleString()}
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
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

                {!roomLoading && totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination>
                      <PaginationContent className="gap-2">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) {
                                setExhibition(exhibitionParam!, currentPage - 1)
                              }
                            }}
                            className={
                              currentPage <= 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => {
                            if (totalPages <= 5) return true
                            return (
                              p === 1 ||
                              p === totalPages ||
                              Math.abs(p - currentPage) <= 1
                            )
                          })
                          .flatMap((p, i, arr) => {
                            const prev = arr[i - 1]
                            const needEllipsis =
                              i > 0 && prev !== undefined && prev !== p - 1
                            return needEllipsis
                              ? [
                                  <PaginationItem key={`ellipsis-${p}`}>
                                    <PaginationEllipsis />
                                  </PaginationItem>,
                                  <PaginationItem key={p}>
                                    <PaginationLink
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setExhibition(exhibitionParam!, p)
                                      }}
                                      isActive={currentPage === p}
                                      className="cursor-pointer"
                                    >
                                      {p}
                                    </PaginationLink>
                                  </PaginationItem>,
                                ]
                              : [
                                  <PaginationItem key={p}>
                                    <PaginationLink
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setExhibition(exhibitionParam!, p)
                                      }}
                                      isActive={currentPage === p}
                                      className="cursor-pointer"
                                    >
                                      {p}
                                    </PaginationLink>
                                  </PaginationItem>,
                                ]
                          })}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) {
                                setExhibition(
                                  exhibitionParam!,
                                  currentPage + 1
                                )
                              }
                            }}
                            className={
                              currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollReveal>
      </section>

      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </>
  )
}
