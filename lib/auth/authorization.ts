import "server-only"

import { redirect } from "next/navigation"
import type { UserRole } from "@/db/schema"
import { getUserById, type SafeUser } from "@/data/users"
import { loginUrl, safeReturnTo } from "./return-to"
import { roleAllowed } from "./roles"
import { getSessionUserId } from "./session"

export async function getCurrentUser(): Promise<SafeUser | null> {
  const userId = await getSessionUserId()
  if (!userId) return null

  try {
    return await getUserById(userId)
  } catch {
    console.error("Current user lookup failed.")
    return null
  }
}

export async function requireUser(returnTo = "/") {
  const user = await getCurrentUser()
  if (!user) redirect(loginUrl(safeReturnTo(returnTo)))
  return user
}

export async function requireRole(
  allowedRoles: readonly UserRole[],
  returnTo = "/"
) {
  const user = await requireUser(returnTo)
  if (!roleAllowed(user.role, allowedRoles)) redirect("/unauthorized")
  return user
}
