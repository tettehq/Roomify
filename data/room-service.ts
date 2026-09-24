import "server-only"

import { randomUUID } from "node:crypto"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import {
  bookings,
  menuItems,
  rooms,
  roomServiceOrderItems,
  roomServiceOrders,
  users,
} from "@/db/schema"

export async function getAvailableMenuItems() {
  const { db } = await import("@/db")
  return db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      category: menuItems.category,
      price: menuItems.price,
      imageUrl: menuItems.imageUrl,
    })
    .from(menuItems)
    .where(eq(menuItems.isAvailable, true))
    .orderBy(asc(menuItems.category), asc(menuItems.name))
}

export async function getGuestCurrentBooking(
  bookingId: string,
  guestId: string
) {
  const { db } = await import("@/db")
  const [booking] = await db
    .select({
      id: bookings.id,
      roomNumber: rooms.roomNumber,
      status: bookings.status,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(
      and(
        eq(bookings.id, bookingId),
        eq(bookings.guestId, guestId),
        eq(bookings.status, "CHECKED_IN")
      )
    )
    .limit(1)
  return booking ?? null
}

function moneyToCents(value: string) {
  const [whole, fraction = ""] = value.split(".")
  return BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"))
}
function centsToMoney(value: bigint) {
  return `${value / BigInt(100)}.${String(value % BigInt(100)).padStart(2, "0")}`
}

export type OrderCreateResult =
  | { success: true; orderId: string }
  | { success: false; reason: "INELIGIBLE" | "INVALID_ITEMS" | "ERROR" }

export async function createGuestRoomServiceOrder(input: {
  bookingId: string
  guestId: string
  items: Array<{ menuItemId: string; quantity: number }>
}): Promise<OrderCreateResult> {
  const { db } = await import("@/db")
  const booking = await getGuestCurrentBooking(input.bookingId, input.guestId)
  if (
    !booking ||
    input.items.length === 0 ||
    input.items.some(
      (item) =>
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
    )
  )
    return { success: false, reason: "INELIGIBLE" }
  const uniqueIds = [...new Set(input.items.map((item) => item.menuItemId))]
  const menu = await db
    .select({ id: menuItems.id, price: menuItems.price })
    .from(menuItems)
    .where(
      and(inArray(menuItems.id, uniqueIds), eq(menuItems.isAvailable, true))
    )
  if (menu.length !== uniqueIds.length)
    return { success: false, reason: "INVALID_ITEMS" }
  const priceById = new Map(menu.map((item) => [item.id, item.price]))
  let total = BigInt(0)
  const rows = input.items.map((item) => {
    const price = priceById.get(item.menuItemId)!
    total += moneyToCents(price) * BigInt(item.quantity)
    return {
      id: randomUUID(),
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: price,
    }
  })
  const orderId = randomUUID()
  try {
    await db.batch([
      db.insert(roomServiceOrders).values({
        id: orderId,
        bookingId: input.bookingId,
        status: "PENDING",
        totalAmount: centsToMoney(total),
      }),
      db.insert(roomServiceOrderItems).values(
        rows.map((row) => ({
          id: row.id,
          orderId,
          menuItemId: row.menuItemId,
          quantity: row.quantity,
          unitPrice: row.unitPrice,
        }))
      ),
    ] as const)
    return { success: true, orderId }
  } catch {
    return { success: false, reason: "ERROR" }
  }
}

export async function getGuestOrders(guestId: string, bookingId?: string) {
  const { db } = await import("@/db")
  const conditions = [eq(bookings.guestId, guestId)]
  if (bookingId) conditions.push(eq(bookings.id, bookingId))
  return db
    .select({
      id: roomServiceOrders.id,
      bookingId: roomServiceOrders.bookingId,
      status: roomServiceOrders.status,
      totalAmount: roomServiceOrders.totalAmount,
      createdAt: roomServiceOrders.createdAt,
      roomNumber: rooms.roomNumber,
    })
    .from(roomServiceOrders)
    .innerJoin(bookings, eq(roomServiceOrders.bookingId, bookings.id))
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(and(...conditions))
    .orderBy(desc(roomServiceOrders.createdAt))
}

export async function getOrderById(id: string) {
  const { db } = await import("@/db")
  const [order] = await db
    .select({
      id: roomServiceOrders.id,
      bookingId: roomServiceOrders.bookingId,
      status: roomServiceOrders.status,
      totalAmount: roomServiceOrders.totalAmount,
      createdAt: roomServiceOrders.createdAt,
      roomNumber: rooms.roomNumber,
      guestName: users.name,
      guestEmail: users.email,
    })
    .from(roomServiceOrders)
    .innerJoin(bookings, eq(roomServiceOrders.bookingId, bookings.id))
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(users, eq(bookings.guestId, users.id))
    .where(eq(roomServiceOrders.id, id))
    .limit(1)
  if (!order) return null
  const items = await db
    .select({
      id: roomServiceOrderItems.id,
      menuItemId: roomServiceOrderItems.menuItemId,
      name: menuItems.name,
      quantity: roomServiceOrderItems.quantity,
      unitPrice: roomServiceOrderItems.unitPrice,
    })
    .from(roomServiceOrderItems)
    .innerJoin(menuItems, eq(roomServiceOrderItems.menuItemId, menuItems.id))
    .where(eq(roomServiceOrderItems.orderId, id))
    .orderBy(asc(menuItems.name))
  return { ...order, items }
}

export async function getStaffOrders(
  status?: (typeof roomServiceOrders.status.enumValues)[number]
) {
  const { db } = await import("@/db")
  return db
    .select({
      id: roomServiceOrders.id,
      bookingId: roomServiceOrders.bookingId,
      status: roomServiceOrders.status,
      totalAmount: roomServiceOrders.totalAmount,
      createdAt: roomServiceOrders.createdAt,
      roomNumber: rooms.roomNumber,
      guestName: users.name,
    })
    .from(roomServiceOrders)
    .innerJoin(bookings, eq(roomServiceOrders.bookingId, bookings.id))
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(users, eq(bookings.guestId, users.id))
    .where(
      status
        ? eq(roomServiceOrders.status, status)
        : sql`${roomServiceOrders.status} in ('PENDING', 'IN_PROGRESS')`
    )
    .orderBy(asc(roomServiceOrders.createdAt))
}

export async function updateOrderStatus(
  id: string,
  next: "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
) {
  const { db } = await import("@/db")
  const allowed =
    next === "IN_PROGRESS"
      ? ["PENDING"]
      : next === "COMPLETED"
        ? ["IN_PROGRESS"]
        : ["PENDING", "IN_PROGRESS"]
  const [order] = await db
    .update(roomServiceOrders)
    .set({ status: next, updatedAt: new Date() })
    .where(
      and(
        eq(roomServiceOrders.id, id),
        inArray(
          roomServiceOrders.status,
          allowed as (typeof roomServiceOrders.status.enumValues)[number][]
        )
      )
    )
    .returning({ id: roomServiceOrders.id })
  return order ?? null
}
