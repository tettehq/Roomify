"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/authorization"
import { validateRegistration } from "@/lib/auth/validation"
import { isUuid } from "@/lib/uuid"
import { saveManagedUser, manageReservation } from "@/data/admin-management"
import { isUniqueEmailViolation } from "@/data/users"
import { ManagementError } from "@/lib/admin-management"

export type ManagementState = { message?: string; success?: boolean }
function value(data: FormData, key: string) {
  const item = data.get(key)
  return typeof item === "string" ? item : ""
}

export async function saveUserAction(
  _state: ManagementState,
  data: FormData
): Promise<ManagementState> {
  const actor = await requireRole(["ADMIN"], "/admin/users")
  const id = value(data, "id")
  const role = value(data, "role")
  if (
    (id && !isUuid(id)) ||
    (role !== "GUEST" && role !== "STAFF" && role !== "ADMIN")
  )
    return { message: "Choose a valid account and role." }
  try {
    if (id) {
      const active = value(data, "isActive")
      if (active !== "true" && active !== "false")
        return { message: "Choose an account status." }
      await saveManagedUser(actor, { id, role, isActive: active === "true" })
    } else {
      const parsed = validateRegistration(data)
      if (!parsed.success)
        return { message: Object.values(parsed.errors).flat().join(" ") }
      await saveManagedUser(actor, {
        ...parsed.data,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        role,
        isActive: true,
      })
    }
  } catch (error) {
    return {
      message: isUniqueEmailViolation(error)
        ? "An account already uses that email address."
        : error instanceof ManagementError
          ? error.message
          : "Could not save the account. Please try again.",
    }
  }
  revalidatePath("/admin")
  revalidatePath("/admin/users")
  return {
    success: true,
    message: id ? "Account updated." : "Account created.",
  }
}

export async function manageBookingAction(
  _state: ManagementState,
  data: FormData
): Promise<ManagementState> {
  const actor = await requireRole(["ADMIN"], "/admin/bookings")
  const id = value(data, "id"),
    roomId = value(data, "roomId"),
    operation = value(data, "operation")
  if (
    !isUuid(id) ||
    !["update", "cancel"].includes(operation) ||
    (operation === "update" && !isUuid(roomId))
  )
    return { message: "Invalid booking operation." }
  if (operation === "cancel" && value(data, "confirmCancel") !== "yes")
    return { message: "Confirm the cancellation before continuing." }
  try {
    await manageReservation(actor, {
      id,
      roomId,
      cancel: operation === "cancel",
      checkIn: value(data, "checkIn"),
      checkOut: value(data, "checkOut"),
    })
  } catch (error) {
    return {
      message:
        error instanceof ManagementError
          ? error.message
          : "Could not update the reservation. The room may no longer be available; refresh and try again.",
    }
  }
  for (const path of [
    "/admin",
    "/admin/bookings",
    "/staff",
    "/staff/bookings",
    `/staff/bookings/${id}`,
    "/bookings",
    `/bookings/${id}`,
    `/bookings/${id}/confirmation`,
    "/rooms",
  ])
    revalidatePath(path)
  return {
    success: true,
    message:
      operation === "cancel"
        ? "Reservation cancelled."
        : "Reservation updated using the room's current nightly rate.",
  }
}
