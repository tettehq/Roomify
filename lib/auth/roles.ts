import type { UserRole } from "@/db/schema"

export function roleAllowed(role: UserRole, allowedRoles: readonly UserRole[]) {
  return allowedRoles.includes(role)
}
