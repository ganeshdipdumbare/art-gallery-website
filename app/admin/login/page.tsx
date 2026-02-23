"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      router.push("/admin")
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="font-serif text-2xl text-foreground">
            Ursula Ushiko
          </a>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-3">
            Admin Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="text-sm text-center py-3 border border-destructive/30 bg-destructive/5 text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border border-border text-foreground text-sm focus:border-foreground focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-foreground text-background text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          <a href="/" className="hover:text-foreground transition-colors">
            Back to Gallery
          </a>
        </p>
      </div>
    </div>
  )
}
