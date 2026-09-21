import "server-only"

import { and, asc, eq, gte, inArray, ne, notExists, sql } from "drizzle-orm"
import { bookings, rooms } from "@/db/schema"
import {
  BLOCKING_BOOKING_STATUSES,
  type RoomSearchCriteria,
} from "@/lib/room-search"

// Keep database initialization inside the caller's error boundary too.
export async function getFeaturedRooms() {
  const { db } = await import("@/db")
  return db
    .selectDistinctOn([rooms.type], {
      id: rooms.id,
      type: rooms.type,
      description: rooms.description,
      capacity: rooms.capacity,
      baseRate: rooms.baseRate,
      imageUrl: rooms.imageUrl,
    })
    .from(rooms)
    .where(eq(rooms.status, "AVAILABLE"))
    .orderBy(asc(rooms.type), asc(rooms.roomNumber))
    .limit(3)
}

export type FeaturedRoom = Awaited<ReturnType<typeof getFeaturedRooms>>[number]

const roomDetailsSelection = {
  id: rooms.id,
  roomNumber: rooms.roomNumber,
  type: rooms.type,
  description: rooms.description,
  capacity: rooms.capacity,
  baseRate: rooms.baseRate,
  status: rooms.status,
  imageUrl: rooms.imageUrl,
}

function blockingBookingConditions(
  roomId: string | typeof rooms.id,
  criteria: RoomSearchCriteria
) {
  return and(
    eq(bookings.roomId, roomId),
    inArray(bookings.status, [...BLOCKING_BOOKING_STATUSES]),
    sql`${bookings.checkIn}::date < ${criteria.checkOut}::date`,
    sql`${bookings.checkOut}::date > ${criteria.checkIn}::date`
  )
}

export async function getRoomById(id: string) {
  const { db } = await import("@/db")
  const [room] = await db
    .select(roomDetailsSelection)
    .from(rooms)
    .where(eq(rooms.id, id))
    .limit(1)
  return room ?? null
}

export type RoomDetails = NonNullable<Awaited<ReturnType<typeof getRoomById>>>

export async function isRoomAvailable(
  roomId: string,
  criteria: RoomSearchCriteria
) {
  const { db } = await import("@/db")
  const [room] = await db
    .select({ id: rooms.id })
    .from(rooms)
    .where(
      and(
        eq(rooms.id, roomId),
        ne(rooms.status, "NEEDS_CLEANING"),
        notExists(
          db
            .select({ id: bookings.id })
            .from(bookings)
            .where(blockingBookingConditions(roomId, criteria))
        )
      )
    )
    .limit(1)
  return Boolean(room)
}

export async function getAvailableRooms(criteria: RoomSearchCriteria) {
  const { db } = await import("@/db")
  const filters = [
    ne(rooms.status, "NEEDS_CLEANING"),
    gte(rooms.capacity, criteria.guests),
    notExists(
      db
        .select({ id: bookings.id })
        .from(bookings)
        .where(blockingBookingConditions(rooms.id, criteria))
    ),
  ]
  if (criteria.roomType) filters.push(eq(rooms.type, criteria.roomType))

  return db
    .select({
      id: rooms.id,
      roomNumber: rooms.roomNumber,
      type: rooms.type,
      description: rooms.description,
      capacity: rooms.capacity,
      baseRate: rooms.baseRate,
      imageUrl: rooms.imageUrl,
    })
    .from(rooms)
    .where(and(...filters))
    .orderBy(asc(rooms.baseRate), asc(rooms.roomNumber))
}

export type AvailableRoom = Awaited<
  ReturnType<typeof getAvailableRooms>
>[number]
