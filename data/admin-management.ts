import "server-only"
import { and, asc, eq, inArray, ne, sql } from "drizzle-orm"
import { users, bookings, rooms } from "@/db/schema"
import type { UserRole } from "@/db/schema"
import { recordAudit, type Actor } from "@/data/audit"
import {
  canManageAccount,
  canEditReservation,
  ManagementError,
} from "@/lib/admin-management"
import { parseRoomSearch } from "@/lib/room-search"
import { multiplyMoney } from "@/lib/money"

export async function getAdminUsers() {
  const { db } = await import("@/db")
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .orderBy(asc(users.name))
}

export async function saveManagedUser(
  actor: Actor,
  input: {
    id?: string
    name?: string
    email?: string
    passwordHash?: string
    role: UserRole
    isActive: boolean
  }
) {
  const { withTransaction } = await import("@/db")
  return withTransaction(async (tx) => {
    // Serializing account changes also prevents two admins disabling each other.
    await tx.execute(sql`select pg_advisory_xact_lock(499001)`)
    const [currentActor] = await tx
      .select()
      .from(users)
      .where(eq(users.id, actor.id))
    if (!currentActor?.isActive || currentActor.role !== "ADMIN")
      throw new ManagementError("Administrator access is no longer available.")
    if (input.id) {
      if (!canManageAccount(actor.id, input.id))
        throw new ManagementError(
          "You cannot change your own role or deactivate your own account."
        )
      const [target] = await tx
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .for("update")
      if (!target) throw new ManagementError("Account not found.")
      await tx
        .update(users)
        .set({
          role: input.role,
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.id))
      await recordAudit(tx, {
        actor,
        action: "USER_UPDATED",
        entityType: "user",
        entityId: input.id,
        changes: {
          role: [target.role, input.role],
          isActive: [target.isActive, input.isActive],
        },
      })
    } else {
      if (!input.name || !input.email || !input.passwordHash)
        throw new ManagementError("Complete the account details.")
      const [created] = await tx
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          passwordHash: input.passwordHash,
          role: input.role,
        })
        .returning({ id: users.id })
      await recordAudit(tx, {
        actor,
        action: "USER_CREATED",
        entityType: "user",
        entityId: created.id,
      })
    }
  })
}

export async function manageReservation(
  actor: Actor,
  input: {
    id: string
    cancel: boolean
    roomId: string
    checkIn: string
    checkOut: string
  }
) {
  const { withTransaction } = await import("@/db")
  return withTransaction(async (tx) => {
    const [booking] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.id, input.id))
      .for("update")
    if (!booking || !canEditReservation(booking.status))
      throw new ManagementError(
        "Only pending or confirmed reservations can be changed or cancelled."
      )
    if (input.cancel) {
      await tx
        .update(bookings)
        .set({ status: "CANCELLED", updatedAt: new Date() })
        .where(eq(bookings.id, input.id))
      await recordAudit(tx, {
        actor,
        action: "BOOKING_CANCELLED",
        entityType: "booking",
        entityId: input.id,
        changes: { status: [booking.status, "CANCELLED"] },
      })
      return
    }
    const parsed = parseRoomSearch({
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: "1",
    })
    if (!parsed.success) throw new ManagementError(parsed.errors[0])
    const [oldRoom] = await tx
      .select()
      .from(rooms)
      .where(eq(rooms.id, booking.roomId))
    const [room] = await tx
      .select()
      .from(rooms)
      .where(eq(rooms.id, input.roomId))
      .for("update")
    if (!room || room.status === "NEEDS_CLEANING")
      throw new ManagementError("Choose a room that is ready for booking.")
    // Historical bookings do not store guest count. Never move them to a smaller room.
    if (room.capacity < oldRoom.capacity)
      throw new ManagementError(
        "Choose a room with at least the current room's capacity."
      )
    const conflict = await tx
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, room.id),
          ne(bookings.id, booking.id),
          inArray(bookings.status, ["PENDING", "CONFIRMED", "CHECKED_IN"]),
          sql`${bookings.checkIn}::date < ${input.checkOut}::date`,
          sql`${bookings.checkOut}::date > ${input.checkIn}::date`
        )
      )
      .limit(1)
    if (conflict.length)
      throw new ManagementError(
        "That room is already reserved for those dates."
      )
    const totalAmount = multiplyMoney(room.baseRate, parsed.data.nights)
    await tx
      .update(bookings)
      .set({
        roomId: room.id,
        checkIn: parsed.data.checkInDate,
        checkOut: parsed.data.checkOutDate,
        totalAmount,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, input.id))
    await recordAudit(tx, {
      actor,
      action: "BOOKING_UPDATED",
      entityType: "booking",
      entityId: input.id,
      changes: {
        roomId: [booking.roomId, room.id],
        checkIn: [booking.checkIn, parsed.data.checkInDate],
        checkOut: [booking.checkOut, parsed.data.checkOutDate],
        totalAmount: [booking.totalAmount, totalAmount],
      },
    })
  })
}
