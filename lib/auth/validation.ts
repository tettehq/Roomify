export type AuthActionState = {
  errors?: Partial<
    Record<"name" | "email" | "password" | "confirmPassword", string[]>
  >
  message?: string
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function formString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : ""
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export function validateLogin(formData: FormData) {
  const email = normalizeEmail(formString(formData.get("email")))
  const password = formString(formData.get("password"))
  const errors: AuthActionState["errors"] = {}

  if (!validEmail(email)) errors.email = ["Enter a valid email address."]
  if (!password) errors.password = ["Enter your password."]

  return {
    success: !Object.keys(errors).length,
    errors,
    data: { email, password },
  }
}

export function validateRegistration(formData: FormData) {
  const name = formString(formData.get("name")).trim().replace(/\s+/g, " ")
  const email = normalizeEmail(formString(formData.get("email")))
  const password = formString(formData.get("password"))
  const confirmPassword = formString(formData.get("confirmPassword"))
  const errors: AuthActionState["errors"] = {}

  if (name.length < 2 || name.length > 80) {
    errors.name = ["Name must be between 2 and 80 characters."]
  }
  if (!validEmail(email)) errors.email = ["Enter a valid email address."]

  const passwordErrors: string[] = []
  if (password.length < 10) passwordErrors.push("Use at least 10 characters.")
  if (!/[a-z]/.test(password)) passwordErrors.push("Add a lowercase letter.")
  if (!/[A-Z]/.test(password)) passwordErrors.push("Add an uppercase letter.")
  if (!/\d/.test(password)) passwordErrors.push("Add a number.")
  if (new TextEncoder().encode(password).length > 72) {
    passwordErrors.push("Use no more than 72 bytes.")
  }
  if (passwordErrors.length) errors.password = passwordErrors
  if (confirmPassword !== password) {
    errors.confirmPassword = ["Passwords do not match."]
  }

  return {
    success: !Object.keys(errors).length,
    errors,
    data: { name, email, password },
  }
}
