import "server-only"
import { headers } from "next/headers"
import { auditLog } from "@/db/schema"
import type { DbOrTx } from "@/db"

export type Actor = { id: string; name?: string | null; role: string }

async function clientIp() {
  try {
    const h = await headers()
    return h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? null
  } catch {
    return null // not inside a request (e.g. a cron job)
  }
}

export async function recordAudit(
  dbOrTx: DbOrTx,
  e: {
    actor: Actor
    action: string
    entityType: string
    entityId: string
    changes?: Record<string, [unknown, unknown]>
    metadata?: Record<string, unknown>
  }
) {
  await dbOrTx.insert(auditLog).values({
    actorId: e.actor.id,
    actorName: e.actor.name ?? null,
    actorRole: e.actor.role,
    action: e.action,
    entityType: e.entityType,
    entityId: e.entityId,
    changes: e.changes,
    metadata: e.metadata,
    ip: await clientIp(),
  })
}