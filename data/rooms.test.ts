import assert from "node:assert/strict"
import test from "node:test"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { bookings } from "../db/schema"
import { getAvailableRooms, getRoomById, isRoomAvailable } from "./rooms"
import type { RoomSearchCriteria } from "../lib/room-search"

const SEEDED_BOOKINGS = {
  upcoming: "20000000-0000-4000-8000-000000000003",
  cancelled: "20000000-0000-4000-8000-000000000008",
} as const

function day(value: Date) {
  return value.toISOString().slice(0, 10)
}

function hotelDate(value: string, hour: number) {
  return new Date(`${value}T${String(hour).padStart(2, "0")}:00:00.000Z`)
}

function addDays(value: string, days: number) {
  const result = hotelDate(value, 0)
  result.setUTCDate(result.getUTCDate() + days)
  return day(result)
}

function criteria(
  checkIn: string,
  checkOut: string,
  guests = 1,
  roomType?: RoomSearchCriteria["roomType"]
): RoomSearchCriteria {
  return {
    checkIn,
    checkOut,
    checkInDate: hotelDate(checkIn, 15),
    checkOutDate: hotelDate(checkOut, 11),
    guests,
    roomType,
    nights: Math.round(
      (hotelDate(checkOut, 0).valueOf() - hotelDate(checkIn, 0).valueOf()) /
        86_400_000
    ),
  }
}

async function seededBooking(id: string) {
  const [booking] = await db
    .select({
      roomId: bookings.roomId,
      checkIn: bookings.checkIn,
      checkOut: bookings.checkOut,
    })
    .from(bookings)
    .where(eq(bookings.id, id))
  assert.ok(booking, `Expected seeded booking ${id}`)
  return booking
}

test("an overlapping confirmed booking excludes its room", async () => {
  const booking = await seededBooking(SEEDED_BOOKINGS.upcoming)
  const results = await getAvailableRooms(
    criteria(day(booking.checkIn), day(booking.checkOut))
  )
  assert.equal(
    results.some((room) => room.id === booking.roomId),
    false
  )
})

test("back-to-back stays are available", async () => {
  const booking = await seededBooking(SEEDED_BOOKINGS.upcoming)
  const checkIn = day(booking.checkOut)
  const results = await getAvailableRooms(
    criteria(checkIn, addDays(checkIn, 2))
  )
  assert.equal(
    results.some((room) => room.id === booking.roomId),
    true
  )
})

test("a cancelled booking does not block its room", async () => {
  const booking = await seededBooking(SEEDED_BOOKINGS.cancelled)
  const results = await getAvailableRooms(
    criteria(day(booking.checkIn), day(booking.checkOut))
  )
  assert.equal(
    results.some((room) => room.id === booking.roomId),
    true
  )
})

test("capacity and room type filters are applied in the query", async () => {
  const results = await getAvailableRooms(
    criteria("2030-01-10", "2030-01-12", 3, "FAMILY_SUITE")
  )
  assert.ok(results.length > 0)
  assert.ok(results.every((room) => room.capacity >= 3))
  assert.ok(results.every((room) => room.type === "FAMILY_SUITE"))
})

test("a room can be loaded by its seeded UUID", async () => {
  const booking = await seededBooking(SEEDED_BOOKINGS.upcoming)
  const room = await getRoomById(booking.roomId)
  assert.ok(room)
  assert.equal(room.id, booking.roomId)
  assert.equal(typeof room.baseRate, "string")
})

test("an unknown UUID returns no room", async () => {
  const room = await getRoomById("ffffffff-ffff-4fff-8fff-ffffffffffff")
  assert.equal(room, null)
})

test("specific room availability rejects an overlapping confirmed booking", async () => {
  const booking = await seededBooking(SEEDED_BOOKINGS.upcoming)
  assert.equal(
    await isRoomAvailable(
      booking.roomId,
      criteria(day(booking.checkIn), day(booking.checkOut))
    ),
    false
  )
})

test("specific room availability ignores a cancelled booking", async () => {
  const booking = await seededBooking(SEEDED_BOOKINGS.cancelled)
  assert.equal(
    await isRoomAvailable(
      booking.roomId,
      criteria(day(booking.checkIn), day(booking.checkOut))
    ),
    true
  )
})
