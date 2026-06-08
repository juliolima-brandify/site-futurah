import { Pool } from "pg";

// Pool singleton (sobrevive a invocações quentes da serverless function).
// Aponta pro mesmo Postgres do Payload (site-futurah) via DATABASE_URL.
// Use o transaction pooler do Supabase (porta 6543) em serverless.
let pool: Pool | null = null;

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.length < 16) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return pool;
}
