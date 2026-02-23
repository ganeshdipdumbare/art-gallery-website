import { createClient } from "@libsql/client"
import type { PaintingCategory, PaintingRow } from "./painting-types"

const url = process.env.TURSO_DATABASE_URL!
const authToken = process.env.TURSO_AUTH_TOKEN

let client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!client) {
    if (!url) {
      throw new Error(
        "TURSO_DATABASE_URL is required. Add it to .env.local (see .env.example)"
      )
    }
    client = createClient({
      url,
      authToken: authToken || undefined,
    })
  }
  return client
}

export type { PaintingCategory, PaintingRow }

async function initDb() {
  const db = getClient()

  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)`,
      `CREATE TABLE IF NOT EXISTS paintings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        medium TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        image_framed TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL CHECK(category IN ('swirl','bug','isolation','umami','beatbox','abstract','nature','collage')),
        sold INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        admin_id INTEGER NOT NULL REFERENCES admin_users(id),
        expires_at TEXT NOT NULL
      )`,
    ],
    "write"
  )

  const versionResult = await db.execute(
    "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1"
  )
  const version = (versionResult.rows[0] as { version: number } | undefined)
    ?.version ?? 0

  if (version < 2) {
    await db.execute("DROP TABLE IF EXISTS paintings")
    await db.execute(`
      CREATE TABLE paintings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        medium TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        image_framed TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL CHECK(category IN ('swirl','bug','isolation','umami','beatbox','abstract','nature','collage')),
        sold INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
    await db.execute({
      sql: "INSERT OR REPLACE INTO schema_migrations (version) VALUES (2)",
    })
  }

  if (version < 3) {
    await db.execute("ALTER TABLE paintings ADD COLUMN reference_id TEXT")
    const paintings = (await db.execute("SELECT id, created_at FROM paintings ORDER BY created_at ASC"))
      .rows as unknown as { id: string; created_at: string }[]
    const year = new Date().getFullYear()
    for (let i = 0; i < paintings.length; i++) {
      const refId = `UU-${year}-${String(i + 1).padStart(4, "0")}`
      await db.execute({
        sql: "UPDATE paintings SET reference_id = ? WHERE id = ?",
        args: [refId, paintings[i].id],
      })
    }
    await db.execute({
      sql: "INSERT OR REPLACE INTO schema_migrations (version) VALUES (3)",
    })
  }
}

function rowToPainting(row: Record<string, unknown>): PaintingRow {
  return {
    id: row.id as string,
    reference_id: (row.reference_id as string) || `UU-${row.id}`,
    title: row.title as string,
    year: row.year as number,
    medium: row.medium as string,
    dimensions: row.dimensions as string,
    price: row.price as number,
    description: row.description as string,
    image: row.image as string,
    image_framed: (row.image_framed as string) || "",
    category: row.category as PaintingCategory,
    sold: row.sold as number,
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
  }
}

export async function getAllPaintings(): Promise<PaintingRow[]> {
  await initDb()
  const db = getClient()
  const result = await db.execute(
    "SELECT * FROM paintings ORDER BY sort_order ASC, created_at DESC"
  )
  return result.rows.map((r) => rowToPainting(r as Record<string, unknown>))
}

export async function getPaintingById(
  id: string
): Promise<PaintingRow | undefined> {
  await initDb()
  const db = getClient()
  const result = await db.execute({
    sql: "SELECT * FROM paintings WHERE id = ?",
    args: [id],
  })
  const row = result.rows[0] as Record<string, unknown> | undefined
  return row ? rowToPainting(row) : undefined
}

export async function insertPainting(
  p: Omit<PaintingRow, "created_at">
): Promise<void> {
  await initDb()
  const db = getClient()
  const refId =
    p.reference_id ||
    `UU-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  await db.execute({
    sql: `INSERT INTO paintings (id, reference_id, title, year, medium, dimensions, price, description, image, image_framed, category, sold, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      p.id,
      refId,
      p.title,
      p.year,
      p.medium,
      p.dimensions,
      p.price,
      p.description,
      p.image,
      p.image_framed,
      p.category,
      p.sold,
      p.sort_order,
    ],
  })
}

export async function markPaintingsSold(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await initDb()
  const db = getClient()
  for (const id of ids) {
    await db.execute({
      sql: "UPDATE paintings SET sold = 1 WHERE id = ?",
      args: [id],
    })
  }
}

export async function updatePainting(
  id: string,
  data: Partial<Omit<PaintingRow, "id" | "created_at">>
): Promise<void> {
  await initDb()
  const db = getClient()
  const fields = Object.keys(data) as (keyof typeof data)[]
  if (fields.length === 0) return
  const sets = fields.map((f) => `${f} = ?`).join(", ")
  const values = fields.map((f) => (data as Record<string, unknown>)[f])
  await db.execute({
    sql: `UPDATE paintings SET ${sets} WHERE id = ?`,
    args: [...values, id],
  })
}

export async function deletePainting(id: string): Promise<void> {
  await initDb()
  const db = getClient()
  await db.execute({
    sql: "DELETE FROM paintings WHERE id = ?",
    args: [id],
  })
}

export async function executeQuery<T = Record<string, unknown>>(
  sql: string,
  args?: unknown[]
): Promise<T | undefined> {
  await initDb()
  const db = getClient()
  const result = await db.execute(
    args && args.length > 0
      ? { sql, args }
      : sql
  )
  return result.rows[0] as T | undefined
}

export async function executeWrite(
  sql: string,
  args?: unknown[]
): Promise<void> {
  await initDb()
  const db = getClient()
  await db.execute(
    args && args.length > 0
      ? { sql, args }
      : sql
  )
}
