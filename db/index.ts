import "dotenv/config"

import { neon, Pool } from "@neondatabase/serverless"
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzleWs, type NeonDatabase } from "drizzle-orm/neon-serverless"
import type { PgDatabase } from "drizzle-orm/pg-core"
import * as schema from "./schema"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required to initialize the Roomify database client."
  )
}

type WsDb = NeonDatabase<typeof schema>
export type Tx = Parameters<Parameters<WsDb["transaction"]>[0]>[0]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbOrTx = PgDatabase<any, typeof schema>

export async function withTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    return await drizzleWs({ client: pool, schema }).transaction(fn)
  } finally {
    await pool.end()
  }
}

export function pgErrorCode(err: unknown): string | undefined {
  const e = err as { code?: string; cause?: { code?: string } } | null
  return e?.code ?? e?.cause?.code
}

export const db = drizzleHttp({ client: neon(process.env.DATABASE_URL!), schema })
