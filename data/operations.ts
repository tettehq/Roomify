import "server-only"

import { and, asc, count, eq, gte, lt, sql } from "drizzle-orm"
import { bookings, rooms, roomServiceOrders, users } from "@/db/schema"

function utcToday() {
  const now = new Date()
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
}

function tomorrow() {
  const value = utcToday()
  value.setUTCDate(value.getUTCDate() + 1)
  return value
}

export async function getStaffDashboardData() {
  const { db } = await import("@/db")
  const today = utcToday()
  const nextDay = tomorrow()
  const [
    arrivals,
    departures,
    currentStays,
    roomSummary,
    activeBookings,
    pendingOrders,
  ] = await Promise.all([
    db
      .select({
        id: bookings.id,
        roomNumber: rooms.roomNumber,
        guestName: users.name,
        checkIn: bookings.checkIn,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id))
      .innerJoin(users, eq(bookings.guestId, users.id))
      .where(
        and(
          gte(bookings.checkIn, today),
          lt(bookings.checkIn, nextDay),
          sql`${bookings.status} in ('PENDING', 'CONFIRMED')`
        )
      )
      .orderBy(asc(bookings.checkIn)),
    db
      .select({
        id: bookings.id,
        roomNumber: rooms.roomNumber,
        guestName: users.name,
        checkOut: bookings.checkOut,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id))
      .innerJoin(users, eq(bookings.guestId, users.id))
      .where(
        and(
          gte(bookings.checkOut, today),
          lt(bookings.checkOut, nextDay),
          eq(bookings.status, "CHECKED_IN")
        )
      )
      .orderBy(asc(bookings.checkOut)),
    db
      .select({
        id: bookings.id,
        roomNumber: rooms.roomNumber,
        guestName: users.name,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id))
      .innerJoin(users, eq(bookings.guestId, users.id))
      .where(eq(bookings.status, "CHECKED_IN"))
      .orderBy(asc(bookings.checkOut)),
    db
      .select({ status: rooms.status, count: count() })
      .from(rooms)
      .groupBy(rooms.status),
    db
      .select({
        id: bookings.id,
        roomNumber: rooms.roomNumber,
        guestName: users.name,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(rooms, eq(bookings.roomId, rooms.id))
      .innerJoin(users, eq(bookings.guestId, users.id))
      .where(sql`${bookings.status} in ('PENDING', 'CONFIRMED', 'CHECKED_IN')`)
      .orderBy(asc(bookings.checkIn))
      .limit(12),
    db
      .select({ count: count() })
      .from(roomServiceOrders)
      .where(eq(roomServiceOrders.status, "PENDING")),
  ])
  return {
    arrivals,
    departures,
    currentStays,
    roomSummary,
    activeBookings,
    pendingOrders: pendingOrders[0]?.count ?? 0,
  }
}

export async function updateRoomStatus(
  id: string,
  status: "AVAILABLE" | "OCCUPIED" | "NEEDS_CLEANING"
) {
  const { db } = await import("@/db")
  const [room] = await db
    .update(rooms)
    .set({ status, updatedAt: new Date() })
    .where(eq(rooms.id, id))
    .returning({ id: rooms.id })
  return room ?? null
}

export async function getRoomStatusRows() {
  const { db } = await import("@/db")
  return db
    .select({
      id: rooms.id,
      roomNumber: rooms.roomNumber,
      status: rooms.status,
    })
    .from(rooms)
    .orderBy(asc(rooms.roomNumber))
}
