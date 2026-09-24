import "server-only"

import { randomUUID } from "node:crypto"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { bookings, rooms, users } from "@/db/schema"
import { parseRoomSearch } from "@/lib/room-search"
import { getRoomById } from "./rooms"

export type CreateGuestBookingResult =
  | {
      success: true
      booking: {
        id: string
        guestId: string
        roomId: string
        checkIn: Date
        checkOut: Date
        status: "CONFIRMED"
        totalAmount: string
      }
    }
  | {
      success: false
      reason: "INVALID" | "ROOM_NOT_FOUND" | "CAPACITY" | "UNAVAILABLE"
    }

type InsertedBookingRow = {
  id: string
  guest_id: string
  room_id: string
  check_in: Date | string
  check_out: Date | string
  status: "CONFIRMED"
  total_amount: string
}

export async function createGuestBooking(input: {
  guestId: string
  roomId: string
  stay: {
    checkIn: string
    checkOut: string
    guests: string | number
  }
}): Promise<CreateGuestBookingResult> {
  const parsed = parseRoomSearch({
    checkIn: input.stay.checkIn,
    checkOut: input.stay.checkOut,
    guests: String(input.stay.guests),
  })
  if (!parsed.success) return { success: false, reason: "INVALID" }
  const criteria = parsed.data

  const room = await getRoomById(input.roomId)
  if (!room) return { success: false, reason: "ROOM_NOT_FOUND" }
  if (criteria.guests > room.capacity) {
    return { success: false, reason: "CAPACITY" }
  }

  const { db } = await import("@/db")
  const bookingId = randomUUID()
  const [, insertResult] = await db.batch([
    db.execute(
      sql`select "id" from "rooms" where "id" = ${input.roomId}::uuid for update`
    ),
    db.execute(sql`
      insert into "bookings" (
        "id", "guest_id", "room_id", "check_in", "check_out",
        "status", "total_amount", "created_at", "updated_at"
      )
      select
        ${bookingId}::uuid,
        ${input.guestId}::uuid,
        room."id",
        ${criteria.checkInDate},
        ${criteria.checkOutDate},
        'CONFIRMED'::"booking_status",
        (room."base_rate" * ${criteria.nights})::numeric(10, 2),
        now(),
        now()
      from "rooms" as room
      where room."id" = ${input.roomId}::uuid
        and room."capacity" >= ${criteria.guests}
        and room."status" <> 'NEEDS_CLEANING'::"room_status"
        and not exists (
          select 1
          from "bookings" as existing
          where existing."room_id" = room."id"
            and existing."status" in (
              'PENDING'::"booking_status",
              'CONFIRMED'::"booking_status",
              'CHECKED_IN'::"booking_status"
            )
            and existing."check_in"::date < ${criteria.checkOut}::date
            and existing."check_out"::date > ${criteria.checkIn}::date
        )
      returning
        "id", "guest_id", "room_id", "check_in", "check_out", "status", "total_amount"
    `),
  ] as const)

  const row = insertResult.rows[0] as InsertedBookingRow | undefined
  if (!row) return { success: false, reason: "UNAVAILABLE" }

  return {
    success: true,
    booking: {
      id: row.id,
      guestId: row.guest_id,
      roomId: row.room_id,
      checkIn: new Date(row.check_in),
      checkOut: new Date(row.check_out),
      status: row.status,
      totalAmount: row.total_amount,
    },
  }
}

export async function getGuestBookingById(id: string, guestId: string) {
  const { db } = await import("@/db")
  const [booking] = await db
    .select({
      id: bookings.id,
      guestId: bookings.guestId,
      roomId: bookings.roomId,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
      status: bookings.status,
      totalAmount: bookings.totalAmount,
      createdAt: bookings.createdAt,
      roomNumber: rooms.roomNumber,
      roomType: rooms.type,
      roomDescription: rooms.description,
      roomCapacity: rooms.capacity,
      roomImageUrl: rooms.imageUrl,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(and(eq(bookings.id, id), eq(bookings.guestId, guestId)))
    .limit(1)
  return booking ?? null
}

export type GuestBookingDetails = NonNullable<
  Awaited<ReturnType<typeof getGuestBookingById>>
>

const guestBookingSelection = {
  id: bookings.id,
  guestId: bookings.guestId,
  roomId: bookings.roomId,
  checkIn: bookings.checkIn,
  checkOut: bookings.checkOut,
  status: bookings.status,
  totalAmount: bookings.totalAmount,
  createdAt: bookings.createdAt,
  roomNumber: rooms.roomNumber,
  roomType: rooms.type,
  roomDescription: rooms.description,
  roomImageUrl: rooms.imageUrl,
}

export async function getGuestBookings(guestId: string) {
  const { db } = await import("@/db")
  return db
    .select(guestBookingSelection)
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .where(eq(bookings.guestId, guestId))
    .orderBy(desc(bookings.checkIn), desc(bookings.createdAt))
}

export async function getStaffBookingById(id: string) {
  const { db } = await import("@/db")
  const [booking] = await db
    .select({
      ...guestBookingSelection,
      guestName: users.name,
      guestEmail: users.email,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(users, eq(bookings.guestId, users.id))
    .where(eq(bookings.id, id))
    .limit(1)
  return booking ?? null
}

export async function cancelGuestBooking(id: string, guestId: string) {
  const { db } = await import("@/db")
  const [booking] = await db
    .update(bookings)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(
      and(
        eq(bookings.id, id),
        eq(bookings.guestId, guestId),
        inArray(bookings.status, ["PENDING", "CONFIRMED"]),
        sql`${bookings.checkIn}::date > current_date`
      )
    )
    .returning({ id: bookings.id })
  return booking ?? null
}

export async function getStaffBookings(filters?: {
  query?: string
  status?: (typeof bookings.status.enumValues)[number]
}) {
  const { db } = await import("@/db")
  const conditions = []
  if (filters?.status) conditions.push(eq(bookings.status, filters.status))
  if (filters?.query) {
    const query = `%${filters.query}%`
    conditions.push(
      sql`(${rooms.roomNumber} ilike ${query} or cast(${bookings.id} as text) ilike ${query} or cast(${bookings.guestId} as text) ilike ${query} or ${users.name} ilike ${query} or ${users.email} ilike ${query})`
    )
  }
  return db
    .select({
      ...guestBookingSelection,
      guestName: users.name,
      guestEmail: users.email,
    })
    .from(bookings)
    .innerJoin(rooms, eq(bookings.roomId, rooms.id))
    .innerJoin(users, eq(bookings.guestId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(bookings.checkIn), desc(bookings.createdAt))
}
