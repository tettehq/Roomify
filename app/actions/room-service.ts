"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import {
  createGuestRoomServiceOrder,
  updateOrderStatus,
} from "@/data/room-service"
import { requireRole } from "@/lib/auth/authorization"
import { isUuid } from "@/lib/uuid"

export type RoomServiceState = { message?: string; success?: boolean }
function value(formData: FormData, key: string) {
  const item = formData.get(key)
  return typeof item === "string" ? item : ""
}

export async function placeRoomServiceOrderAction(
  _state: RoomServiceState,
  formData: FormData
) {
  const bookingId = value(formData, "bookingId")
  const user = await requireRole(
    ["GUEST"],
    `/bookings/${bookingId}/room-service`
  )
  if (!isUuid(bookingId)) return { message: "This stay could not be found." }
  const items = formData.getAll("item").flatMap((item) => {
    if (typeof item !== "string") return []
    const [menuItemId, quantity] = item.split(":")
    const parsed = Number(quantity)
    return isUuid(menuItemId) && Number.isInteger(parsed) && parsed > 0
      ? [{ menuItemId, quantity: parsed }]
      : []
  })
  const result = await createGuestRoomServiceOrder({
    bookingId,
    guestId: user.id,
    items,
  })
  if (!result.success)
    return {
      message:
        result.reason === "INELIGIBLE"
          ? "Choose at least one item from your active stay."
          : result.reason === "INVALID_ITEMS"
            ? "One or more menu items are no longer available."
            : "We couldn't place this order right now.",
    }
  redirect(`/bookings/${bookingId}/room-service?order=${result.orderId}`)
}

export async function updateRoomServiceStatusAction(
  _state: RoomServiceState,
  formData: FormData
) {
  const orderId = value(formData, "orderId")
  const status = value(formData, "status")
  await requireRole(["STAFF", "ADMIN"], "/staff/room-service")
  if (
    !isUuid(orderId) ||
    !["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)
  )
    return { message: "Invalid order status." }
  const updated = await updateOrderStatus(
    orderId,
    status as "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  )
  if (!updated) return { message: "That status transition is not allowed." }
  revalidatePath("/staff/room-service")
  revalidatePath(`/staff/room-service/${orderId}`)
  return { success: true }
}
