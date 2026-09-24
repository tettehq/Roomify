"use server"

import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { bookings, rooms } from "@/db/schema"
import { getStaffBookingById } from "@/data/bookings"
import { updateRoomStatus } from "@/data/operations"
import { requireRole } from "@/lib/auth/authorization"
import { isUuid } from "@/lib/uuid"

export type StaffActionState = { message?: string }

function value(formData: FormData, key: string) {
  const item = formData.get(key)
  return typeof item === "string" ? item : ""
}

export async function updateBookingStatusAction(
  _state: StaffActionState,
  formData: FormData
) {
  const bookingId = value(formData, "bookingId")
  const nextStatus = value(formData, "nextStatus")
  await requireRole(["STAFF", "ADMIN"], `/staff/bookings/${bookingId}`)
  if (!isUuid(bookingId) || !["CHECKED_IN", "COMPLETED"].includes(nextStatus))
    return { message: "Invalid booking operation." }
  const { db } = await import("@/db")
  try {
    const booking = await getStaffBookingById(bookingId)
    if (!booking) return { message: "Booking not found." }
    if (nextStatus === "CHECKED_IN") {
      if (
        booking.status !== "CONFIRMED" ||
        booking.checkIn.toISOString().slice(0, 10) >
          new Date().toISOString().slice(0, 10) ||
        booking.checkOut.toISOString().slice(0, 10) <=
          new Date().toISOString().slice(0, 10)
      )
        return { message: "This booking is not eligible for check-in." }
      const [updated] = await db.batch([
        db
          .update(bookings)
          .set({ status: "CHECKED_IN", updatedAt: new Date() })
          .where(
            and(eq(bookings.id, bookingId), eq(bookings.status, "CONFIRMED"))
          )
          .returning({ id: bookings.id }),
        db
          .update(rooms)
          .set({ status: "OCCUPIED", updatedAt: new Date() })
          .where(eq(rooms.id, booking.roomId))
          .returning({ id: rooms.id }),
      ] as const)
      if (!updated?.length)
        return { message: "This booking is not eligible for check-in." }
    } else {
      if (booking.status !== "CHECKED_IN")
        return { message: "Only checked-in bookings can be checked out." }
      const [updated] = await db.batch([
        db
          .update(bookings)
          .set({ status: "COMPLETED", updatedAt: new Date() })
          .where(
            and(eq(bookings.id, bookingId), eq(bookings.status, "CHECKED_IN"))
          )
          .returning({ id: bookings.id }),
        db
          .update(rooms)
          .set({ status: "NEEDS_CLEANING", updatedAt: new Date() })
          .where(eq(rooms.id, booking.roomId))
          .returning({ id: rooms.id }),
      ] as const)
      if (!updated?.length)
        return { message: "Only checked-in bookings can be checked out." }
    }
    redirect(`/staff/bookings/${bookingId}`)
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error
    console.error("Staff booking status update failed.")
    return { message: "The booking status could not be updated." }
  }
}

export async function updateRoomStatusAction(
  _state: StaffActionState,
  formData: FormData
) {
  const roomId = value(formData, "roomId")
  const status = value(formData, "status")
  await requireRole(["STAFF", "ADMIN"], "/staff")
  if (
    !isUuid(roomId) ||
    !["AVAILABLE", "OCCUPIED", "NEEDS_CLEANING"].includes(status)
  )
    return { message: "Invalid room status." }
  try {
    const updated = await updateRoomStatus(
      roomId,
      status as "AVAILABLE" | "OCCUPIED" | "NEEDS_CLEANING"
    )
    if (!updated) return { message: "Room not found." }
    redirect("/staff")
  } catch {
    return { message: "The room status could not be updated." }
  }
}
