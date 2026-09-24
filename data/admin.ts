import "server-only"

import { asc, eq } from "drizzle-orm"
import { menuItems, rooms } from "@/db/schema"

export async function getAdminRooms() {
  const { db } = await import("@/db")
  return db.select().from(rooms).orderBy(asc(rooms.roomNumber))
}
export async function getAdminMenuItems() {
  const { db } = await import("@/db")
  return db
    .select()
    .from(menuItems)
    .orderBy(asc(menuItems.category), asc(menuItems.name))
}
export async function createAdminRoom(input: typeof rooms.$inferInsert) {
  const { db } = await import("@/db")
  return db.insert(rooms).values(input).returning({ id: rooms.id })
}
export async function updateAdminRoom(
  id: string,
  input: Partial<typeof rooms.$inferInsert>
) {
  const { db } = await import("@/db")
  return db
    .update(rooms)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(rooms.id, id))
    .returning({ id: rooms.id })
}
export async function createAdminMenuItem(
  input: typeof menuItems.$inferInsert
) {
  const { db } = await import("@/db")
  return db.insert(menuItems).values(input).returning({ id: menuItems.id })
}
export async function updateAdminMenuItem(
  id: string,
  input: Partial<typeof menuItems.$inferInsert>
) {
  const { db } = await import("@/db")
  return db
    .update(menuItems)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(menuItems.id, id))
    .returning({ id: menuItems.id })
}
