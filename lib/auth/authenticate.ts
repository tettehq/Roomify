import "server-only"

import bcrypt from "bcryptjs"
import { findUserForAuthentication, type SafeUser } from "@/data/users"

const DUMMY_PASSWORD_HASH =
  "$2b$12$7QJ5sP6EJO0uA2bWvWnxeeSbDBJePGONVHTzAboYlNgnC0D3oYlXK"

export async function authenticateUser(
  email: string,
  password: string
): Promise<SafeUser | null> {
  const user = await findUserForAuthentication(email)
  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH
  )
  if (!user || !passwordMatches) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
