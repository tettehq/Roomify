import assert from "node:assert/strict"
import test from "node:test"
import { randomUUID } from "node:crypto"
import bcrypt from "bcryptjs"
import { eq, inArray } from "drizzle-orm"
import { db } from "../db"
import { users, rooms, bookings, auditLog } from "../db/schema"
import { saveManagedUser, manageReservation } from "./admin-management"
import { getUserById } from "./users"
import { authenticateUser } from "../lib/auth/authenticate"
import { ROOM_TYPES } from "../lib/room-types"

test("admin account and reservation management preserves access and inventory rules", async () => {
  const actor = {
    id: randomUUID(),
    role: "ADMIN",
    name: "Admin integration test",
  }
  const guestId = randomUUID(),
    roomId = randomUUID(),
    otherRoomId = randomUUID(),
    smallRoomId = randomUUID()
  const bookingId = randomUUID(),
    conflictId = randomUUID()
  const email = `${guestId}@roomify.test`
  const password = "AdminIntegration123!"
  try {
    const passwordHash = await bcrypt.hash(password, 4)
    await db.insert(users).values([
      {
        id: actor.id,
        name: actor.name,
        email: `${actor.id}@roomify.test`,
        role: "ADMIN",
        passwordHash,
      },
      { id: guestId, name: "Test guest", email, role: "GUEST", passwordHash },
    ])
    await assert.rejects(
      saveManagedUser(actor, { id: actor.id, role: "GUEST", isActive: false }),
      /own/
    )
    await saveManagedUser(actor, {
      id: guestId,
      role: "STAFF",
      isActive: false,
    })
    assert.equal(await getUserById(guestId), null)
    assert.equal(await authenticateUser(email, password), null)
    await saveManagedUser(actor, { id: guestId, role: "GUEST", isActive: true })
    assert.equal((await authenticateUser(email, password))?.role, "GUEST")
    await db
      .insert(rooms)
      .values(
        [roomId, otherRoomId, smallRoomId].map((id, index) => ({
          id,
          roomNumber: `test-${id}`,
          type: ROOM_TYPES[0],
          description: "Temporary integration test room",
          capacity: index === 2 ? 1 : 2,
          baseRate: index === 1 ? "150.00" : "100.00",
        }))
      )
    await db.insert(bookings).values([
      {
        id: bookingId,
        guestId,
        roomId,
        checkIn: new Date("2045-01-10T15:00:00Z"),
        checkOut: new Date("2045-01-12T11:00:00Z"),
        status: "CONFIRMED",
        totalAmount: "200.00",
      },
      {
        id: conflictId,
        guestId,
        roomId: otherRoomId,
        checkIn: new Date("2045-01-13T15:00:00Z"),
        checkOut: new Date("2045-01-15T11:00:00Z"),
        status: "CONFIRMED",
        totalAmount: "300.00",
      },
    ])
    const input = {
      id: bookingId,
      cancel: false,
      roomId: otherRoomId,
      checkIn: "2045-01-11",
      checkOut: "2045-01-14",
    }
    await assert.rejects(manageReservation(actor, input), /already reserved/)
    await assert.rejects(
      manageReservation(actor, { ...input, roomId: smallRoomId }),
      /capacity/
    )
    await assert.rejects(
      manageReservation(actor, { ...input, checkOut: "2045-01-10" }),
      /after/
    )
    // Same-day departure/arrival is allowed, with the authoritative new rate.
    await manageReservation(actor, { ...input, checkOut: "2045-01-13" })
    const [updated] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
    assert.equal(updated.roomId, otherRoomId)
    assert.equal(updated.totalAmount, "300.00")
    await manageReservation(actor, { ...input, cancel: true })
    await assert.rejects(
      manageReservation(actor, input),
      /Only pending or confirmed/
    )
    const [cancelled] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
    assert.equal(cancelled.status, "CANCELLED")
    const audit = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.actorId, actor.id))
    assert.equal(audit.length, 4)
    assert.ok(!JSON.stringify(audit).includes(passwordHash))
  } finally {
    await db.delete(auditLog).where(eq(auditLog.actorId, actor.id))
    await db
      .delete(bookings)
      .where(inArray(bookings.id, [bookingId, conflictId]))
    await db
      .delete(rooms)
      .where(inArray(rooms.id, [roomId, otherRoomId, smallRoomId]))
    await db.delete(users).where(inArray(users.id, [actor.id, guestId]))
  }
})
