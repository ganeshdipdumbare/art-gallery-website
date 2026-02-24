"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Pencil, Trash2, LogOut, GripVertical, Eye, Palette } from "lucide-react"
import { PaintingImage } from "@/components/painting-image"
import type { PaintingCategory, PaintingRow } from "@/lib/painting-types"

type PaintingForm = {
  id?: string
  reference_id?: string
  title: string
  year: number
  medium: string
  dimensions: string
  price: number
  description: string
  image: string
  image_framed: string
  category: PaintingCategory
  sold: boolean
  sort_order: number
}

const emptyForm: PaintingForm = {
  title: "",
  year: new Date().getFullYear(),
  medium: "Oil on Canvas",
  dimensions: "",
  price: 0,
  description: "",
  image: "",
  image_framed: "",
  category: "abstract" as PaintingCategory,
  sold: false,
  sort_order: 99,
}

export default function AdminPage() {
  const [paintings, setPaintings] = useState<PaintingRow[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [editingPainting, setEditingPainting] = useState<PaintingForm | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const fetchPaintings = useCallback(async () => {
    const res = await fetch("/api/paintings")
    if (res.ok) {
      const data = await res.json()
      setPaintings(data)
    }
  }, [])

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login")
        } else {
          setIsAuthenticated(true)
          fetchPaintings()
        }
      })
      .catch(() => router.push("/admin/login"))
  }, [router, fetchPaintings])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const handleSave = async (form: PaintingForm) => {
    setSaving(true)
    try {
      if (form.id) {
        // Update
        await fetch("/api/admin/paintings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: form.id,
            title: form.title,
            year: form.year,
            medium: form.medium,
            dimensions: form.dimensions,
            price: form.price,
            description: form.description,
            image: form.image,
            image_framed: form.image_framed,
            category: form.category,
            sold: form.sold ? 1 : 0,
            sort_order: form.sort_order,
          }),
        })
      } else {
        // Create
        await fetch("/api/admin/paintings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      await fetchPaintings()
      setEditingPainting(null)
      setIsCreating(false)
    } catch (err) {
      console.error("Save failed:", err)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this painting?")) return
    await fetch(`/api/admin/paintings?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    await fetchPaintings()
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Palette className="w-8 h-8 text-muted-foreground/60 animate-pulse" />
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header — matches main site nav styling */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-xl md:text-2xl text-foreground tracking-tight">
              Gallery Admin
            </h1>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <Eye className="w-3.5 h-3.5" />
              View Site
            </a>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
        {/* Ambient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none -z-10" aria-hidden="true" />

        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground font-medium mb-2">
            Collection
          </p>
          <div className="artistic-divider w-16 mb-8" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <p className="text-sm text-muted-foreground">
            {paintings.length} painting{paintings.length !== 1 ? "s" : ""} in gallery
          </p>
          <button
            onClick={() => {
              setEditingPainting(emptyForm)
              setIsCreating(true)
            }}
            className="btn-artistic flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Painting
          </button>
        </div>

        {/* Paintings List */}
        <div className="flex flex-col gap-4">
          {paintings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 md:py-24 text-center border-2 border-dashed border-border"
            >
              <Palette className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <p className="font-serif text-lg text-foreground mb-2">No paintings yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Add your first piece to start building your collection.
              </p>
              <button
                onClick={() => {
                  setEditingPainting(emptyForm)
                  setIsCreating(true)
                }}
                className="btn-artistic flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Painting
              </button>
            </motion.div>
          ) : (
          <AnimatePresence mode="popLayout">
            {paintings.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center gap-4 p-5 md:p-6 bg-secondary/30 border-2 border-border hover:border-accent/30 transition-all duration-300 group"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/30 flex-shrink-0 group-hover:text-muted-foreground/60 transition-colors" />
                <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-muted ring-1 ring-black/5">
                  {p.image ? (
                    <PaintingImage
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base md:text-lg text-foreground truncate">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {p.reference_id && (
                      <span className="font-mono">{p.reference_id} · </span>
                    )}
                    {p.medium} · {p.dimensions} · {p.year}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {p.sold ? (
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground bg-muted px-3 py-1.5">
                      Sold
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      ${p.price.toLocaleString()}
                    </span>
                  )}
                  <button
                    onClick={() =>
                      setEditingPainting({
                        id: p.id,
                        reference_id: p.reference_id,
                        title: p.title,
                        year: p.year,
                        medium: p.medium,
                        dimensions: p.dimensions,
                        price: p.price,
                        description: p.description,
                        image: p.image,
                        image_framed: p.image_framed,
                        category: p.category as PaintingForm["category"],
                        sold: !!p.sold,
                        sort_order: p.sort_order,
                      })
                    }
                    className="w-9 h-9 flex items-center justify-center border-2 border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                    aria-label={`Edit ${p.title}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-9 h-9 flex items-center justify-center border-2 border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
                    aria-label={`Delete ${p.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingPainting && (
          <PaintingFormModal
          painting={editingPainting}
          isCreating={isCreating}
          saving={saving}
          onSave={handleSave}
          onClose={() => {
            setEditingPainting(null)
            setIsCreating(false)
          }}
        />
        )}
      </AnimatePresence>
    </div>
  )
}

function PaintingFormModal({
  painting,
  isCreating,
  saving,
  onSave,
  onClose,
}: {
  painting: PaintingForm
  isCreating: boolean
  saving: boolean
  onSave: (form: PaintingForm) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<PaintingForm>(painting)

  const update = (key: keyof PaintingForm, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const inputClass =
    "w-full px-4 py-3.5 bg-secondary/50 border-2 border-border text-foreground text-sm focus:border-accent focus:outline-none transition-colors duration-300 placeholder:text-muted-foreground/50"
  const labelClass = "block text-xs tracking-[0.25em] uppercase text-muted-foreground mb-2 font-medium"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-10 border-2 border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground font-medium mb-2">
          {isCreating ? "New Painting" : "Edit Painting"}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
          {isCreating ? "Add to Collection" : form.title || "Untitled"}
        </h2>
        <div className="artistic-divider w-16 mb-8" />

        {!isCreating && painting.reference_id && (
          <p className="text-xs text-muted-foreground mb-6 font-mono">
            Ref: {painting.reference_id}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputClass}
              placeholder="Painting title"
            />
          </div>

          <div>
            <label className={labelClass}>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => update("year", parseInt(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Series</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as PaintingCategory)}
              className={inputClass}
            >
              <option value="swirl">Swirl Series</option>
              <option value="bug">Bug Series</option>
              <option value="isolation">Isolation Series</option>
              <option value="umami">Umami Series</option>
              <option value="beatbox">Beatbox Series</option>
              <option value="abstract">Abstract Series</option>
              <option value="nature">Nature Series</option>
              <option value="collage">Collage Series</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Medium</label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => update("medium", e.target.value)}
              className={inputClass}
              placeholder="e.g., Oil on Canvas"
            />
          </div>

          <div>
            <label className={labelClass}>Dimensions</label>
            <input
              type="text"
              value={form.dimensions}
              onChange={(e) => update("dimensions", e.target.value)}
              className={inputClass}
              placeholder='e.g., 36" x 48"'
            />
          </div>

          <div>
            <label className={labelClass}>Price (USD)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", parseFloat(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", parseInt(e.target.value))}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Describe the artwork..."
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Image (upload)</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 2 * 1024 * 1024) {
                    alert("Image must be under 2MB. Consider compressing before upload.")
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () => {
                    const dataUrl = reader.result as string
                    update("image", dataUrl)
                  }
                  reader.readAsDataURL(file)
                  e.target.value = ""
                }}
                className="block w-full text-sm text-foreground file:mr-4 file:py-2.5 file:px-5 file:rounded-sm file:border-0 file:bg-foreground file:text-background file:text-xs file:tracking-[0.2em] file:uppercase file:font-medium hover:file:opacity-90 cursor-pointer transition-opacity"
              />
              <p className="text-xs text-muted-foreground">
                JPEG, PNG or WebP. Max 2MB.
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sold}
                onChange={(e) => update("sold", e.target.checked)}
                className="w-4 h-4 accent-accent rounded"
              />
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Mark as Sold
              </span>
            </label>
          </div>
        </div>

        {/* Preview */}
        {form.image && (
          <div className="mt-8">
            <p className={labelClass}>Preview</p>
            <div className="relative w-48 h-60 overflow-hidden bg-muted border-2 border-border">
              <PaintingImage
                src={form.image}
                alt="Preview"
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 mt-10 pt-8 border-t border-border">
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title || !form.image}
            className="btn-artistic px-6 py-3.5 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {saving ? "Saving..." : isCreating ? "Create Painting" : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3.5 border-2 border-border text-muted-foreground text-xs tracking-[0.2em] uppercase hover:border-foreground hover:text-foreground transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
