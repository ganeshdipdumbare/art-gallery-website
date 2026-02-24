"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

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
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Ambient background — matches main site hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-accent/15 blur-[80px]" />
        <div className="absolute bottom-[25%] right-[10%] w-64 h-64 rounded-full bg-ring/20 blur-[60px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, transparent 50%, oklch(0.98 0.008 85 / 0.4) 100%)",
          }}
        />
      </div>

      {/* Decorative lines */}
      <div
        className="absolute top-1/4 left-0 right-0 h-px opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.55 0.15 35 / 0.2) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-1/3 left-0 right-0 h-px opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.55 0.15 35 / 0.2) 50%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <a
            href="/"
            className="font-serif text-2xl sm:text-3xl text-foreground hover:text-accent transition-colors duration-300"
          >
            Ursula Ushiko
          </a>
          <p className="text-xs tracking-[0.35em] uppercase text-muted-foreground mt-4 font-medium">
            Admin Login
          </p>
          <div className="artistic-divider w-24 mx-auto mt-6" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-center py-3 px-4 border border-destructive/30 bg-destructive/5 text-destructive rounded-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-xs tracking-[0.25em] uppercase text-muted-foreground mb-2 font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 bg-secondary/50 border-2 border-border text-foreground text-sm focus:border-accent focus:outline-none transition-colors duration-300 placeholder:text-muted-foreground/50"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs tracking-[0.25em] uppercase text-muted-foreground mb-2 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-secondary/50 border-2 border-border text-foreground text-sm focus:border-accent focus:outline-none transition-colors duration-300 placeholder:text-muted-foreground/50"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-artistic w-full py-4 bg-foreground text-background text-sm tracking-[0.2em] uppercase font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8">
          <a
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            ← Back to Gallery
          </a>
        </p>
      </motion.div>
    </div>
  )
}
