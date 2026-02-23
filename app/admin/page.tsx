"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, LogOut, GripVertical, Eye } from "lucide-react"
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
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-xl text-foreground">Gallery Admin</h1>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View Site
          </a>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            {paintings.length} painting{paintings.length !== 1 ? "s" : ""} in gallery
          </p>
          <button
            onClick={() => {
              setEditingPainting(emptyForm)
              setIsCreating(true)
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Painting
          </button>
        </div>

        {/* Paintings List */}
        <div className="flex flex-col gap-3">
          {paintings.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 border border-border hover:border-foreground/20 transition-colors group"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-muted">
                {p.image ? (
                  <PaintingImage
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm text-foreground truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.reference_id && (
                    <span className="font-mono">{p.reference_id} &middot; </span>
                  )}
                  {p.medium} &middot; {p.dimensions} &middot; {p.year}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {p.sold ? (
                  <span className="text-xs tracking-wider uppercase text-muted-foreground bg-muted px-2 py-1">
                    Sold
                  </span>
                ) : (
                  <span className="text-sm text-foreground tabular-nums">
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
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                  aria-label={`Edit ${p.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
                  aria-label={`Delete ${p.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Create Modal */}
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-2xl text-foreground mb-6">
          {isCreating ? "Add New Painting" : "Edit Painting"}
        </h2>

        {!isCreating && painting.reference_id && (
          <p className="text-xs text-muted-foreground mb-4 font-mono">
            Reference ID: {painting.reference_id}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Year
            </label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => update("year", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Series
            </label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as PaintingCategory)}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
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
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Medium
            </label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => update("medium", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Dimensions
            </label>
            <input
              type="text"
              value={form.dimensions}
              onChange={(e) => update("dimensions", e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
              placeholder='e.g., 36" x 48"'
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Image (upload)
            </label>
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
                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-foreground file:text-background file:text-xs file:font-medium hover:file:opacity-90 cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                JPEG, PNG or WebP. Max 2MB. Stored in database.
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sold}
                onChange={(e) => update("sold", e.target.checked)}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Mark as Sold
              </span>
            </label>
          </div>
        </div>

        {/* Preview */}
        {form.image && (
          <div className="mt-6">
            <div className="relative w-48 h-60 overflow-hidden bg-muted border border-border">
              <PaintingImage src={form.image} alt="Preview" fill className="object-cover" sizes="192px" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.title || !form.image}
            className="px-6 py-3 bg-foreground text-background text-xs tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : isCreating ? "Create Painting" : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-border text-muted-foreground text-xs tracking-wider uppercase hover:border-foreground hover:text-foreground transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
