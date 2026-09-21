"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import {
  createGuestUser,
  findSafeUserByEmail,
  isUniqueEmailViolation,
} from "@/data/users"
import { authenticateUser } from "@/lib/auth/authenticate"
import { safeReturnTo } from "@/lib/auth/return-to"
import { createSession, deleteSession } from "@/lib/auth/session"
import {
  type AuthActionState,
  validateLogin,
  validateRegistration,
} from "@/lib/auth/validation"

export async function loginAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const validated = validateLogin(formData)
  if (!validated.success) return { errors: validated.errors }

  let user
  try {
    user = await authenticateUser(validated.data.email, validated.data.password)
  } catch {
    console.error("Login lookup failed.")
    return { message: "We couldn't sign you in right now. Please try again." }
  }

  if (!user) return { message: "Invalid email or password." }

  try {
    await createSession(user.id)
  } catch {
    console.error("Session creation failed.")
    return { message: "We couldn't sign you in right now. Please try again." }
  }

  redirect(safeReturnTo(formData.get("returnTo")))
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const validated = validateRegistration(formData)
  if (!validated.success) return { errors: validated.errors }

  try {
    if (await findSafeUserByEmail(validated.data.email)) {
      return { message: "An account with this email already exists." }
    }
  } catch {
    console.error("Registration duplicate check failed.")
    return { message: "We couldn't create your account right now." }
  }

  let user
  try {
    const passwordHash = await bcrypt.hash(validated.data.password, 12)
    user = await createGuestUser({
      name: validated.data.name,
      email: validated.data.email,
      passwordHash,
    })
  } catch (error) {
    if (isUniqueEmailViolation(error)) {
      return { message: "An account with this email already exists." }
    }
    console.error("Guest registration failed.")
    return { message: "We couldn't create your account right now." }
  }

  try {
    await createSession(user.id)
  } catch {
    console.error("Session creation after registration failed.")
    return {
      message: "Your account was created, but we couldn't sign you in.",
    }
  }

  redirect(safeReturnTo(formData.get("returnTo")))
}

export async function logoutAction() {
  await deleteSession()
  redirect("/")
}
