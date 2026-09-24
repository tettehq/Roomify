import assert from "node:assert/strict"
import test from "node:test"
import { and, eq } from "drizzle-orm"
import { db } from "../db"
import { bookings } from "../db/schema"
import {
  cancelGuestBooking,
  createGuestBooking,
  getGuestBookingById,
} from "./bookings"

const GUEST_ID = "00000000-0000-4000-8000-000000000101"
const OTHER_GUEST_ID = "00000000-0000-4000-8000-000000000102"
const FAMILY_ROOM_ID = "10000000-0000-4000-8000-000000000015"
const SMALL_ROOM_ID = "10000000-0000-4000-8000-000000000013"
const SEEDED_UPCOMING_BOOKING_ID = "20000000-0000-4000-8000-000000000003"

function day(value: Date) {
  return value.toISOString().slice(0, 10)
}

async function exactBookings(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  const start = new Date(`${checkIn}T15:00:00.000Z`)
  const end = new Date(`${checkOut}T11:00:00.000Z`)
  return db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.roomId, roomId),
        eq(bookings.checkIn, start),
        eq(bookings.checkOut, end)
      )
    )
}

test("booking creation persists authoritative guest, dates, status, and decimal total", async () => {
  const stay = { checkIn: "2040-01-10", checkOut: "2040-01-13", guests: 2 }
  let rows = await exactBookings(FAMILY_ROOM_ID, stay.checkIn, stay.checkOut)

  if (rows.length === 0) {
    const result = await createGuestBooking({
      guestId: GUEST_ID,
      roomId: FAMILY_ROOM_ID,
      stay,
    })
    assert.equal(result.success, true)
  }

  rows = await exactBookings(FAMILY_ROOM_ID, stay.checkIn, stay.checkOut)
  assert.equal(rows.length, 1)
  const [record] = rows
  assert.equal(record.guestId, GUEST_ID)
  assert.equal(record.roomId, FAMILY_ROOM_ID)
  assert.equal(day(record.checkIn), stay.checkIn)
  assert.equal(day(record.checkOut), stay.checkOut)
  assert.equal(record.status, "CONFIRMED")
  assert.equal(record.totalAmount, "660.00")

  const owned = await getGuestBookingById(record.id, GUEST_ID)
  assert.equal(owned?.id, record.id)
  assert.equal(owned?.totalAmount, "660.00")
  assert.equal(await getGuestBookingById(record.id, OTHER_GUEST_ID), null)

  const duplicate = await createGuestBooking({
    guestId: GUEST_ID,
    roomId: FAMILY_ROOM_ID,
    stay,
  })
  assert.deepEqual(duplicate, { success: false, reason: "UNAVAILABLE" })
})

test("concurrent attempts for one room and stay create at most one booking", async () => {
  const stay = { checkIn: "2040-02-10", checkOut: "2040-02-13", guests: 2 }
  const before = await exactBookings(
    FAMILY_ROOM_ID,
    stay.checkIn,
    stay.checkOut
  )

  const results = await Promise.all([
    createGuestBooking({ guestId: GUEST_ID, roomId: FAMILY_ROOM_ID, stay }),
    createGuestBooking({
      guestId: OTHER_GUEST_ID,
      roomId: FAMILY_ROOM_ID,
      stay,
    }),
  ])

  const after = await exactBookings(FAMILY_ROOM_ID, stay.checkIn, stay.checkOut)
  assert.equal(after.length, 1)
  assert.equal(
    results.filter((result) => result.success).length,
    before.length ? 0 : 1
  )
  assert.equal(
    results.filter(
      (result) => !result.success && result.reason === "UNAVAILABLE"
    ).length,
    before.length ? 2 : 1
  )
})

test("booking creation rejects invalid dates, excess capacity, and unknown rooms", async () => {
  assert.deepEqual(
    await createGuestBooking({
      guestId: GUEST_ID,
      roomId: FAMILY_ROOM_ID,
      stay: { checkIn: "2040-03-13", checkOut: "2040-03-10", guests: 2 },
    }),
    { success: false, reason: "INVALID" }
  )
  assert.deepEqual(
    await createGuestBooking({
      guestId: GUEST_ID,
      roomId: SMALL_ROOM_ID,
      stay: { checkIn: "2040-03-10", checkOut: "2040-03-13", guests: 3 },
    }),
    { success: false, reason: "CAPACITY" }
  )
  assert.deepEqual(
    await createGuestBooking({
      guestId: GUEST_ID,
      roomId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      stay: { checkIn: "2040-03-10", checkOut: "2040-03-13", guests: 2 },
    }),
    { success: false, reason: "ROOM_NOT_FOUND" }
  )
})

test("a seeded blocking booking is rejected at the final availability check", async () => {
  const [seeded] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, SEEDED_UPCOMING_BOOKING_ID))
  assert.ok(seeded)

  const result = await createGuestBooking({
    guestId: OTHER_GUEST_ID,
    roomId: seeded.roomId,
    stay: {
      checkIn: day(seeded.checkIn),
      checkOut: day(seeded.checkOut),
      guests: 1,
    },
  })
  assert.deepEqual(result, { success: false, reason: "UNAVAILABLE" })
})

test("a future guest booking can be cancelled without deleting it", async () => {
  const stay = { checkIn: "2040-04-10", checkOut: "2040-04-13", guests: 2 }
  let [record] = await exactBookings(
    FAMILY_ROOM_ID,
    stay.checkIn,
    stay.checkOut
  )
  if (!record) {
    const created = await createGuestBooking({
      guestId: GUEST_ID,
      roomId: FAMILY_ROOM_ID,
      stay,
    })
    assert.equal(created.success, true)
    ;[record] = await exactBookings(FAMILY_ROOM_ID, stay.checkIn, stay.checkOut)
  }
  assert.ok(record)
  if (record.status !== "CANCELLED") {
    const cancelled = await cancelGuestBooking(record.id, GUEST_ID)
    assert.equal(cancelled?.id, record.id)
  }
  const persisted = await getGuestBookingById(record.id, GUEST_ID)
  assert.equal(persisted?.status, "CANCELLED")
})
