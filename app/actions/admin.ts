"use server"

import { randomUUID } from "node:crypto"
import { redirect } from "next/navigation"
import {
  createAdminMenuItem,
  createAdminRoom,
  updateAdminMenuItem,
  updateAdminRoom,
} from "@/data/admin"
import { requireRole } from "@/lib/auth/authorization"
import { isRoomType } from "@/lib/room-types"
import { isUuid } from "@/lib/uuid"

const categories = [
  "BREAKFAST",
  "MAIN_MEALS",
  "DRINKS",
  "SNACKS",
  "AMENITIES",
] as const
const statuses = ["AVAILABLE", "OCCUPIED", "NEEDS_CLEANING"] as const
function value(formData: FormData, key: string) {
  const item = formData.get(key)
  return typeof item === "string" ? item.trim() : ""
}
function money(value: string) {
  return /^\d{1,8}(?:\.\d{1,2})?$/.test(value) ? value : null
}

export async function saveRoomAction(formData: FormData) {
  await requireRole(["ADMIN"], "/admin/rooms")
  const id = value(formData, "id"),
    roomNumber = value(formData, "roomNumber"),
    type = value(formData, "type"),
    description = value(formData, "description"),
    capacity = Number(value(formData, "capacity")),
    baseRate = money(value(formData, "baseRate")),
    status = value(formData, "status"),
    imageUrl = value(formData, "imageUrl")
  if (
    !roomNumber ||
    !isRoomType(type) ||
    !description ||
    !Number.isInteger(capacity) ||
    capacity < 1 ||
    capacity > 20 ||
    !baseRate ||
    !statuses.includes(status as (typeof statuses)[number])
  )
    redirect("/admin/rooms?error=invalid")
  const input = {
    roomNumber,
    type,
    description,
    capacity,
    baseRate,
    status: status as (typeof statuses)[number],
    imageUrl: imageUrl || null,
  }
  try {
    if (id && isUuid(id)) await updateAdminRoom(id, input)
    else await createAdminRoom({ ...input, id: randomUUID() })
  } catch {
    redirect("/admin/rooms?error=save")
  }
  redirect("/admin/rooms")
}

export async function saveMenuItemAction(formData: FormData) {
  await requireRole(["ADMIN"], "/admin/menu")
  const id = value(formData, "id"),
    name = value(formData, "name"),
    description = value(formData, "description"),
    category = value(formData, "category"),
    price = money(value(formData, "price")),
    imageUrl = value(formData, "imageUrl"),
    isAvailable = value(formData, "isAvailable") === "true"
  if (
    !name ||
    !description ||
    !price ||
    !categories.includes(category as (typeof categories)[number])
  )
    redirect("/admin/menu?error=invalid")
  const input = {
    name,
    description,
    category: category as (typeof categories)[number],
    price,
    imageUrl: imageUrl || null,
    isAvailable,
  }
  try {
    if (id && isUuid(id)) await updateAdminMenuItem(id, input)
    else await createAdminMenuItem({ ...input, id: randomUUID() })
  } catch {
    redirect("/admin/menu?error=save")
  }
  redirect("/admin/menu")
}
