"use server"

import { redirect } from "next/navigation"
import { createGuestBooking } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"
import { bookingRequestFromFormData } from "@/lib/booking-request"
import { parseRoomSearch } from "@/lib/room-search"
import { isUuid } from "@/lib/uuid"

export type ConfirmBookingState = {
  code?: "INVALID" | "CAPACITY" | "UNAVAILABLE" | "ERROR"
  message?: string
}

export async function confirmBookingAction(
  _state: ConfirmBookingState,
  formData: FormData
): Promise<ConfirmBookingState> {
  const { roomId, checkIn, checkOut, guests } =
    bookingRequestFromFormData(formData)
  const reviewQuery = new URLSearchParams({ roomId, checkIn, checkOut, guests })
  const user = await requireRole(["GUEST"], `/bookings/new?${reviewQuery}`)

  if (!isUuid(roomId)) {
    return { code: "INVALID", message: "Select a valid room before booking." }
  }

  const parsed = parseRoomSearch({ checkIn, checkOut, guests })
  if (!parsed.success) {
    return { code: "INVALID", message: parsed.errors[0] }
  }

  let result
  try {
    result = await createGuestBooking({
      guestId: user.id,
      roomId,
      stay: { checkIn, checkOut, guests },
    })
  } catch {
    console.error("Booking creation failed.")
    return {
      code: "ERROR",
      message:
        "We couldn't create your reservation right now. Please try again.",
    }
  }

  if (!result.success) {
    if (result.reason === "INVALID") {
      return {
        code: "INVALID",
        message: "Check your stay details and try again.",
      }
    }
    if (result.reason === "CAPACITY") {
      return {
        code: "CAPACITY",
        message: "This room cannot accommodate the selected number of guests.",
      }
    }
    if (result.reason === "ROOM_NOT_FOUND") {
      return { code: "INVALID", message: "This room is no longer available." }
    }
    console.info("Booking creation rejected: room unavailable.")
    return {
      code: "UNAVAILABLE",
      message:
        "Sorry, this room is no longer available for the selected dates.",
    }
  }

  console.info(`Booking creation succeeded: ${result.booking.id}`)
  redirect(`/bookings/${result.booking.id}/confirmation`)
}
