"use server"

import { redirect } from "next/navigation"
import { cancelGuestBooking } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"
import { isUuid } from "@/lib/uuid"

export type CancelBookingState = { message?: string }

export async function cancelBookingAction(
  _state: CancelBookingState,
  formData: FormData
): Promise<CancelBookingState> {
  const id =
    typeof formData.get("bookingId") === "string"
      ? String(formData.get("bookingId"))
      : ""
  const user = await requireRole(["GUEST"], `/bookings/${id}`)
  if (!isUuid(id)) return { message: "This reservation could not be found." }
  try {
    const cancelled = await cancelGuestBooking(id, user.id)
    if (!cancelled)
      return { message: "This reservation can no longer be cancelled." }
    redirect(`/bookings/${id}`)
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error
    console.error("Guest booking cancellation failed.")
    return { message: "We couldn't cancel this reservation right now." }
  }
}
