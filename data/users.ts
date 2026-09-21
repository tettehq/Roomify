import "server-only"

import { eq } from "drizzle-orm"
import { users, type UserRole } from "@/db/schema"

const safeUserSelection = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
}

export type SafeUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export async function findUserForAuthentication(email: string) {
  const { db } = await import("@/db")
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
  return user ?? null
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  const { db } = await import("@/db")
  const [user] = await db
    .select(safeUserSelection)
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  return user ?? null
}

export async function findSafeUserByEmail(
  email: string
): Promise<SafeUser | null> {
  const { db } = await import("@/db")
  const [user] = await db
    .select(safeUserSelection)
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
  return user ?? null
}

export async function createGuestUser(input: {
  name: string
  email: string
  passwordHash: string
}): Promise<SafeUser> {
  const { db } = await import("@/db")
  const [user] = await db
    .insert(users)
    .values({ ...input, role: "GUEST" })
    .returning(safeUserSelection)
  return user
}

export function isUniqueEmailViolation(error: unknown) {
  let current: unknown = error
  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (
      typeof current === "object" &&
      "code" in current &&
      current.code === "23505"
    ) {
      return true
    }
    current =
      typeof current === "object" && "cause" in current
        ? current.cause
        : undefined
  }
  return false
}
